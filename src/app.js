import React, { Component } from "react";
import { Router } from "react-router-dom";
import { createHashHistory } from "history";
import { Helmet } from "react-helmet";
import Header from "./components/header.js";

import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  WalletProvider,
  ConnectionProvider,
} from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import {
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SolflareWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import { clusterApiUrl } from "@solana/web3.js";
import { useMemo } from "react";
import { ToastContainer } from "react-toastify";

const history = createHashHistory();

if(!localStorage.getItem("key") || !localStorage.getItem("key") == "deposited"){
  localStorage.setItem("key", "pending");
}

export default function App() {
  const network = WalletAdapterNetwork.Devnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(
    () => [
      new LedgerWalletAdapter(),
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter({ network }),
    ],
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <ToastContainer />
          <Router history={history}>
            <Helmet>
              <title>{process.env.REACT_APP_SEO_TITLE}</title>
            </Helmet>
            <Header />
          </Router>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
}
