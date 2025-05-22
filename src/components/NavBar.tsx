"use client";

import { ConnectButton } from "thirdweb/react";
import { createWallet } from "thirdweb/wallets";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";

import { client } from "@/app/client";

export default function NavBar() {
  const wallets = [createWallet("io.metamask")];
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Projects", href: "/projects" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 px-4 py-3 transition-all duration-300 ${
        isScrolled
          ? "bg-white shadow-md"
          : "bg-gradient-to-r from-amber-50 to-amber-100/80 backdrop-blur-sm"
      }`}
    >
      <div className="flex justify-between items-center container mx-auto">
        <Link href="/" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SC</span>
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
            SumCharity
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-amber-800 hover:text-amber-600 font-medium transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-amber-700 p-1 rounded-md focus:outline-none mr-2"
          >
            {mobileMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Connect Button */}
        <div className="hidden md:block">
          <ConnectButton
            wallets={wallets}
            client={client}
            appMetadata={{
              name: "SumCharity",
              url: "https://sumcharity.org",
            }}
            connectButton={{
              label: "Connect Wallet",
              className: "",
              style: {
                backgroundColor: "var(--color-amber-500)",
                color: "white",
                fontWeight: "500",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
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
      </div>

      {/* Mobile Navigation Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-amber-100 mt-2 py-2 shadow-lg">
          <div className="container mx-auto px-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block py-2 text-amber-800 hover:text-amber-600 font-medium"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="py-2">
              <ConnectButton
                wallets={wallets}
                client={client}
                appMetadata={{
                  name: "SumCharity",
                  url: "https://sumcharity.org",
                }}
                connectButton={{
                  label: "Connect Wallet",
                  className: "w-full",
                  style: {
                    backgroundColor: "var(--color-amber-500)",
                    color: "white",
                    fontWeight: "500",
                    width: "100%",
                    maxHeight: "40px",
                  },
                }}
                detailsButton={{
                  style: {
                    width: "100%",
                    maxHeight: "40px",
                  },
                }}
              />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
