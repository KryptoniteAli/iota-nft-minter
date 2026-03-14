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
  mainnet: { url: "https://api.mainnet.iota.cafe" },
});

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={queryClient}>
    <IotaClientProvider networks={networkConfig} defaultNetwork="mainnet">
      <WalletProvider autoConnect>
        <App />
      </WalletProvider>
    </IotaClientProvider>
  </QueryClientProvider>
);
