/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SOROBAN_CONTRACT_ID?: string;
  readonly VITE_SOROBAN_RPC_URL?: string;
  readonly VITE_STELLAR_NETWORK?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
