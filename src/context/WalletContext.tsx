import React, { createContext, useContext, useState, useEffect } from 'react';
import { WalletState } from '../types';
import {
  connectFreighterWallet,
  fetchXlmBalance,
  checkFreighterInstalled,
} from '../services/stellar';

interface WalletContextType extends WalletState {
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  refreshBalance: () => Promise<void>;
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

  // Restore stored session if present
  useEffect(() => {
    const savedKey = localStorage.getItem('stellar_connected_pubkey');
    if (savedKey) {
      handleInitialConnect(savedKey);
    }
  }, []);

  const handleInitialConnect = async (pubKey: string) => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const balance = await fetchXlmBalance(pubKey);
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
        isLoading: false,
        error: 'Failed to restore wallet balance.',
      }));
    }
  };

  const connectWallet = async () => {
    setWalletState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const pubKey = await connectFreighterWallet();
      const balance = await fetchXlmBalance(pubKey);

      localStorage.setItem('stellar_connected_pubkey', pubKey);

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
        error: err.message || 'Connection failed. Please check Freighter wallet.',
      }));
    }
  };

  const disconnectWallet = () => {
    localStorage.removeItem('stellar_connected_pubkey');
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
        disconnectWallet,
        refreshBalance,
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
