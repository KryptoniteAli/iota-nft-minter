import React from "react";
import ReactDOM from "react-dom/client";
import {
  createNetworkConfig,
  IotaClientProvider,
  WalletProvider,
} from "@iota/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "@iota/dapp-kit/dist/index.css";

const { networkConfig } = createNetworkConfig({
  mainnet: { url: "https://api.testnet.iota.cafe" },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
        <WalletProvider autoConnect>
          <App />
        </WalletProvider>
      </IotaClientProvider>
    </QueryClientProvider>
  </React.StrictMode>,
);
