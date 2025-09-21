import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThirdwebProvider } from '@thirdweb-dev/react';
import { Polygon } from '@thirdweb-dev/chains';
import App from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

const clientId = import.meta.env.VITE_APP_THIRDWEB_CLIENT_ID;

if (!clientId) {
  console.warn('VITE_APP_THIRDWEB_CLIENT_ID is not set. Some features may not work properly.');
}

const activeChain = {
  ...Polygon,
  chainId: parseInt(import.meta.env.VITE_APP_CHAIN_ID || '80002'),
  rpc: [import.meta.env.VITE_APP_RPC_URL || 'https://rpc-amoy.polygon.technology'],
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThirdwebProvider
        activeChain={activeChain}
        clientId={clientId || 'placeholder_client_id_for_development'}
        queryClient={queryClient}
      >
        <App />
      </ThirdwebProvider>
    </QueryClientProvider>
  </StrictMode>
);
