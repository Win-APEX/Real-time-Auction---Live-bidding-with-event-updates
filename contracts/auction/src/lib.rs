#![no_std]
use soroban_sdk::{
    contract, contracterror, contractimpl, contracttype, symbol_short, Address, Env, String, Symbol, Vec
};

#[contracterror]
#[derive(Copy, Clone, Debug, Eq, PartialEq, Ord, PartialOrd)]
#[repr(u32)]
pub enum AuctionError {
    AlreadyInitialized = 1,
    NotInitialized = 2,
    AuctionNotFound = 3,
    AuctionExpired = 4,
    AuctionNotExpired = 5,
    AuctionAlreadyEnded = 6,
    BidTooLow = 7,
    Unauthorized = 8,
    InvalidAmount = 9,
    SellerCannotBid = 10,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct BidRecord {
    pub bidder: Address,
    pub amount: i128,
    pub timestamp: u64,
}

#[contracttype]
#[derive(Clone, Debug, PartialEq)]
pub struct Auction {
    pub id: u64,
    pub seller: Address,
    pub item_title: String,
    pub item_description: String,
    pub starting_bid: i128,
    pub highest_bid: i128,
    pub highest_bidder: Address,
    pub min_increment: i128,
    pub end_time: u64,
    pub ended: bool,
    pub total_bids: u32,
}

#[contracttype]
pub enum DataKey {
    Admin,
    AuctionCount,
    Auction(u64),
    Bids(u64),
}

#[contract]
pub struct AuctionContract;

#[contractimpl]
impl AuctionContract {
    /// Initialize the auction manager contract
    pub fn initialize(env: Env, admin: Address) -> Result<(), AuctionError> {
        if env.storage().instance().has(&DataKey::Admin) {
            return Err(AuctionError::AlreadyInitialized);
        }
        admin.require_auth();
        env.storage().instance().set(&DataKey::Admin, &admin);
        env.storage().instance().set(&DataKey::AuctionCount, &0u64);
        Ok(())
    }

    /// Create a new auction
    pub fn create_auction(
        env: Env,
        seller: Address,
        item_title: String,
        item_description: String,
        starting_bid: i128,
        min_increment: i128,
        duration_secs: u64,
    ) -> Result<u64, AuctionError> {
        seller.require_auth();

        if starting_bid <= 0 || min_increment <= 0 {
            return Err(AuctionError::InvalidAmount);
        }

        let mut count: u64 = env
            .storage()
            .instance()
            .get(&DataKey::AuctionCount)
            .unwrap_or(0u64);

        count += 1;
        let current_time = env.ledger().timestamp();
        let end_time = current_time + duration_secs;

        let auction = Auction {
            id: count,
            seller: seller.clone(),
            item_title: item_title.clone(),
            item_description,
            starting_bid,
            highest_bid: starting_bid,
            highest_bidder: seller.clone(),
            min_increment,
            end_time,
            ended: false,
            total_bids: 0,
        };

        env.storage().instance().set(&DataKey::Auction(count), &auction);
        env.storage().instance().set(&DataKey::AuctionCount, &count);

        let bids: Vec<BidRecord> = Vec::new(&env);
        env.storage().instance().set(&DataKey::Bids(count), &bids);

        // Publish real-time Soroban event
        env.events().publish(
            (Symbol::new(&env, "auction_created"), count),
            (seller, starting_bid, end_time),
        );

        Ok(count)
    }

    /// Place a bid on an active auction
    pub fn place_bid(
        env: Env,
        auction_id: u64,
        bidder: Address,
        amount: i128,
    ) -> Result<(), AuctionError> {
        bidder.require_auth();

        let mut auction: Auction = env
            .storage()
            .instance()
            .get(&DataKey::Auction(auction_id))
            .ok_or(AuctionError::AuctionNotFound)?;

        if auction.ended {
            return Err(AuctionError::AuctionAlreadyEnded);
        }

        let current_time = env.ledger().timestamp();
        if current_time >= auction.end_time {
            return Err(AuctionError::AuctionExpired);
        }

        if bidder == auction.seller {
            return Err(AuctionError::SellerCannotBid);
        }

        let min_required_bid = if auction.total_bids == 0 {
            auction.starting_bid
        } else {
            auction.highest_bid + auction.min_increment
        };

        if amount < min_required_bid {
            return Err(AuctionError::BidTooLow);
        }

        // Update auction state
        auction.highest_bid = amount;
        auction.highest_bidder = bidder.clone();
        auction.total_bids += 1;

        env.storage().instance().set(&DataKey::Auction(auction_id), &auction);

        // Record bid history
        let mut bids: Vec<BidRecord> = env
            .storage()
            .instance()
            .get(&DataKey::Bids(auction_id))
            .unwrap_or(Vec::new(&env));

        bids.push_back(BidRecord {
            bidder: bidder.clone(),
            amount,
            timestamp: current_time,
        });
        env.storage().instance().set(&DataKey::Bids(auction_id), &bids);

        // Publish real-time Soroban event for bid placement
        env.events().publish(
            (Symbol::new(&env, "bid_placed"), auction_id),
            (bidder, amount, current_time),
        );

        Ok(())
    }

    /// End an auction after its expiration time
    pub fn end_auction(env: Env, auction_id: u64, caller: Address) -> Result<(), AuctionError> {
        caller.require_auth();

        let mut auction: Auction = env
            .storage()
            .instance()
            .get(&DataKey::Auction(auction_id))
            .ok_or(AuctionError::AuctionNotFound)?;

        if auction.ended {
            return Err(AuctionError::AuctionAlreadyEnded);
        }

        let current_time = env.ledger().timestamp();
        if current_time < auction.end_time {
            return Err(AuctionError::AuctionNotExpired);
        }

        auction.ended = true;
        env.storage().instance().set(&DataKey::Auction(auction_id), &auction);

        // Publish real-time Soroban event for auction end
        env.events().publish(
            (Symbol::new(&env, "auction_ended"), auction_id),
            (auction.highest_bidder.clone(), auction.highest_bid),
        );

        Ok(())
    }

    /// Fetch details for a specific auction
    pub fn get_auction(env: Env, auction_id: u64) -> Result<Auction, AuctionError> {
        env.storage()
            .instance()
            .get(&DataKey::Auction(auction_id))
            .ok_or(AuctionError::AuctionNotFound)
    }

    /// Fetch total number of auctions
    pub fn get_auction_count(env: Env) -> u64 {
        env.storage()
            .instance()
            .get(&DataKey::AuctionCount)
            .unwrap_or(0u64)
    }

    /// Fetch bid history for an auction
    pub fn get_bids(env: Env, auction_id: u64) -> Vec<BidRecord> {
        env.storage()
            .instance()
            .get(&DataKey::Bids(auction_id))
            .unwrap_or(Vec::new(&env))
    }
}

mod test;
