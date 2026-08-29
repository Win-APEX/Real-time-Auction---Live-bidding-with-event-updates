#![cfg(test)]

use super::*;
use soroban_sdk::{testutils::{Address as _, Ledger}, Address, Env, String};

#[test]
fn test_auction_flow() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AuctionContract);
    let client = AuctionContractClient::new(&env, &contract_id);

    let admin = Address::generate(&env);
    let seller = Address::generate(&env);
    let bidder1 = Address::generate(&env);
    let bidder2 = Address::generate(&env);

    // 1. Initialize
    assert_eq!(client.initialize(&admin), ());
    assert_eq!(client.get_auction_count(), 0);

    // 2. Create Auction with buyout price (500 XLM)
    let title = String::from_str(&env, "Vintage Watch");
    let description = String::from_str(&env, "Rare 1960 Chronograph in pristine condition.");
    let starting_bid: i128 = 100_0000000; // 100 XLM
    let min_increment: i128 = 10_0000000; // 10 XLM
    let buyout_price: i128 = 500_0000000; // 500 XLM
    let duration: u64 = 3600; // 1 hour

    let auction_id = client.create_auction(
        &seller,
        &title,
        &description,
        &starting_bid,
        &min_increment,
        &buyout_price,
        &duration,
    );

    assert_eq!(auction_id, 1);
    assert_eq!(client.get_auction_count(), 1);

    let auction = client.get_auction(&auction_id);
    assert_eq!(auction.id, 1);
    assert_eq!(auction.seller, seller);
    assert_eq!(auction.starting_bid, 100_0000000);
    assert_eq!(auction.buyout_price, 500_0000000);
    assert_eq!(auction.highest_bid, 100_0000000);
    assert_eq!(auction.total_bids, 0);
    assert_eq!(auction.ended, false);

    // 3. Bidder 1 places first valid bid
    let bid1_amount: i128 = 100_0000000;
    client.place_bid(&auction_id, &bidder1, &bid1_amount);

    let updated_auction = client.get_auction(&auction_id);
    assert_eq!(updated_auction.highest_bid, 100_0000000);
    assert_eq!(updated_auction.highest_bidder, bidder1);
    assert_eq!(updated_auction.total_bids, 1);

    // 4. Bidder 2 outbids Bidder 1 with min_increment
    let bid2_amount: i128 = 110_0000000;
    client.place_bid(&auction_id, &bidder2, &bid2_amount);

    let updated_auction2 = client.get_auction(&auction_id);
    assert_eq!(updated_auction2.highest_bid, 110_0000000);
    assert_eq!(updated_auction2.highest_bidder, bidder2);
    assert_eq!(updated_auction2.total_bids, 2);

    // Verify bid history
    let bids = client.get_bids(&auction_id);
    assert_eq!(bids.len(), 2);
    assert_eq!(bids.get(0).unwrap().bidder, bidder1);
    assert_eq!(bids.get(1).unwrap().bidder, bidder2);

    // 5. Advance ledger time past auction duration to test end_auction
    env.ledger().set_timestamp(env.ledger().timestamp() + 3601);

    // End auction
    client.end_auction(&auction_id, &seller);
    let final_auction = client.get_auction(&auction_id);
    assert_eq!(final_auction.ended, true);
}

#[test]
fn test_buyout_instant_win() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AuctionContract);
    let client = AuctionContractClient::new(&env, &contract_id);

    let seller = Address::generate(&env);
    let buyer = Address::generate(&env);

    let auction_id = client.create_auction(
        &seller,
        &String::from_str(&env, "Quantum Core"),
        &String::from_str(&env, "Instant buyable tech pass."),
        &100_0000000,
        &10_0000000,
        &300_0000000, // Buyout price: 300 XLM
        &3600,
    );

    // Execute instant buyout
    client.buyout_auction(&auction_id, &buyer, &300_0000000);

    let auction = client.get_auction(&auction_id);
    assert_eq!(auction.highest_bid, 300_0000000);
    assert_eq!(auction.highest_bidder, buyer);
    assert_eq!(auction.ended, true);
}

#[test]
#[should_panic(expected = "HostError")]
fn test_bid_too_low() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AuctionContract);
    let client = AuctionContractClient::new(&env, &contract_id);

    let seller = Address::generate(&env);
    let bidder1 = Address::generate(&env);
    let bidder2 = Address::generate(&env);

    let auction_id = client.create_auction(
        &seller,
        &String::from_str(&env, "Item"),
        &String::from_str(&env, "Desc"),
        &100_0000000,
        &10_0000000,
        &0,
        &3600,
    );

    client.place_bid(&auction_id, &bidder1, &100_0000000);
    // Should panic because bid is lower than highest_bid + min_increment
    client.place_bid(&auction_id, &bidder2, &105_0000000);
}

#[test]
#[should_panic(expected = "HostError")]
fn test_seller_cannot_bid() {
    let env = Env::default();
    env.mock_all_auths();

    let contract_id = env.register_contract(None, AuctionContract);
    let client = AuctionContractClient::new(&env, &contract_id);

    let seller = Address::generate(&env);

    let auction_id = client.create_auction(
        &seller,
        &String::from_str(&env, "Item"),
        &String::from_str(&env, "Desc"),
        &100_0000000,
        &10_0000000,
        &0,
        &3600,
    );

    // Should panic because seller cannot bid on their own auction
    client.place_bid(&auction_id, &seller, &100_0000000);
}
