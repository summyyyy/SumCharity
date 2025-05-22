"use client";

import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import Link from "next/link";

import { client } from "@/app/client";

export default function NavBar() {
  const wallets = [createWallet("io.metamask")];

  return (
    <header className="fixed top-0 left-0 right-0 z-100 bg-amber-50 px-4 py-2">
      <div className="flex justify-between items-center container mx-auto">
        <Link href="/">
          <h1 className="text-lg font-bold text-amber-500 ">SumCharity</h1>
        </Link>
        <ConnectButton
          wallets={wallets}
          client={client}
          appMetadata={{
            name: "Example App",
            url: "https://example.com",
          }}
          connectButton={{
            label: "Connect my wallet",
            className: "",
            style: {
              backgroundColor: "var(--color-amber-500)",
              color: "white",
              maxHeight: "40px",
            },
          }}
          detailsButton={{
            style: {
              maxHeight: "40px",
            },
          }}
        />
      </div>
    </header>
  );
}
