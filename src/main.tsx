import ReactDOM from "react-dom/client";
import {
  IotaClientProvider,
  WalletProvider,
  createNetworkConfig,
} from "@iota/dapp-kit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
import "@iota/dapp-kit/dist/index.css";

const { networkConfig } = createNetworkConfig({
  testnet: { url: "https://api.testnet.iota.cafe" },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <IotaClientProvider networks={networkConfig} defaultNetwork="testnet">
      <WalletProvider autoConnect>
        <App />
      </WalletProvider>
    </IotaClientProvider>
  </QueryClientProvider>
);
