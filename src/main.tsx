import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import {
  IotaClientProvider,
  WalletProvider
} from "@iota/dapp-kit";

const networks = {
  testnet: { url: "https://api.testnet.iota.cafe" }
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <IotaClientProvider networks={networks} defaultNetwork="testnet">
      <WalletProvider autoConnect>
        <App />
      </WalletProvider>
    </IotaClientProvider>
  </React.StrictMode>
);
