import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletState, WalletType } from '../types';
import {
  connectFreighterWallet,
  fetchXlmBalance,
  createFundedDemoWallet,
  isFreighterAvailable,
} from '../services/stellar';

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  connectDemoWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
  isFreighterInstalled: boolean;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [walletState, setWalletState] = useState<WalletState>({
    isConnected: false,
    publicKey: null,
    balance: null,
    walletType: 'freighter',
    network: 'Testnet',
    error: null,
    isLoading: false,
  });

  const [isFreighterInstalled, setIsFreighterInstalled] = useState<boolean>(true);

  useEffect(() => {
    setIsFreighterInstalled(isFreighterAvailable());
    const savedKey = localStorage.getItem('stellar_connected_pubkey');
    const savedType = (localStorage.getItem('stellar_wallet_type') as WalletType) || 'freighter';
    if (savedKey) {
      handleInitialConnect(savedKey, savedType);
    }
  }, []);

  const handleInitialConnect = async (pubKey: string, type: WalletType) => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const balance = await fetchXlmBalance(pubKey);
      setWalletState({
        isConnected: true,
        publicKey: pubKey,
        balance,
        walletType: type,
        network: 'Testnet',
        error: null,
        isLoading: false,
      });
    } catch (err: any) {
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to fetch account balance.',
      }));
    }
  };

  const connectWallet = async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const pubKey = await connectFreighterWallet();
      const balance = await fetchXlmBalance(pubKey);

      localStorage.setItem('stellar_connected_pubkey', pubKey);
      localStorage.setItem('stellar_wallet_type', 'freighter');

      setWalletState({
        isConnected: true,
        publicKey: pubKey,
        balance,
        walletType: 'freighter',
        network: 'Testnet',
        error: null,
        isLoading: false,
      });
    } catch (err: any) {
      setWalletState((prev) => ({
        ...prev,
        isConnected: false,
        isLoading: false,
        error: err.message || 'Freighter connection failed. Check extension permissions.',
      }));
    }
  };

  const connectDemoWallet = async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const { publicKey: pubKey, balance } = await createFundedDemoWallet();

      localStorage.setItem('stellar_connected_pubkey', pubKey);
      localStorage.setItem('stellar_wallet_type', 'simulated');

      setWalletState({
        isConnected: true,
        publicKey: pubKey,
        balance,
        walletType: 'simulated',
        network: 'Testnet',
        error: null,
        isLoading: false,
      });
    } catch (err: any) {
      setWalletState((prev) => ({
        ...prev,
        isLoading: false,
        error: 'Failed to create demo testnet wallet.',
      }));
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('stellar_connected_pubkey');
    localStorage.removeItem('stellar_wallet_type');
    setWalletState({
      isConnected: false,
      publicKey: null,
      balance: null,
      walletType: 'freighter',
      network: 'Testnet',
      error: null,
      isLoading: false,
    });
  };

  const refreshBalance = async () => {
    if (walletState.publicKey) {
      const updatedBalance = await fetchXlmBalance(walletState.publicKey);
      setWalletState((prev) => ({ ...prev, balance: updatedBalance }));
    }
  };

  return (
    <WalletContext.Provider
      value={{
        ...walletState,
        connectWallet,
        connectDemoWallet,
        disconnectWallet,
        refreshBalance,
        isFreighterInstalled,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};
