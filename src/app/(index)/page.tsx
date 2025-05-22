"use client";

import NavBar from "@/components/NavBar";
import Link from "next/link";
import Image from "next/image";
import { ConnectButton } from "thirdweb/react";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  CurrencyDollarIcon,
  GlobeAltIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { client } from "@/app/client";
import { createWallet } from "thirdweb/wallets";

export default function Home() {
  const wallets = [createWallet("io.metamask")];

  return (
    <>
      <NavBar />
      <div className="relative min-h-screen">
        {/* Hero Image Background with Overlay */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/hero.png"
            alt="Charity background"
            fill
            className="object-cover opacity-10"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-amber-50/80 via-white/70 to-amber-50/80" />
        </div>

        {/* Hero Section */}
        <main className="relative z-10 px-4 min-h-screen flex flex-col items-center justify-center container mx-auto">
          <div className="mt-20 w-full flex flex-col md:flex-row items-start justify-between gap-8 py-20">
            <div>
              <h1 className="py-2 text-6xl md:text-8xl font-bold bg-gradient-to-r from-amber-500 to-amber-700 bg-clip-text text-transparent">
                SumCharity
              </h1>
              <h2 className="text-xl md:text-2xl mt-4 text-gray-700 max-w-md">
                A fair, transparent, and secure platform for charity powered by
                blockchain technology.
              </h2>

              <div className="flex flex-col sm:flex-row gap-4 mt-8">
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
                      backgroundColor: "transparent",
                      color: "var(--color-amber-600)",
                      border: "2px solid var(--color-amber-500)",
                      height: "50px",
                      fontWeight: "bold",
                    },
                  }}
                  detailsButton={{
                    style: {
                      height: "50px",
                    },
                  }}
                />
                <Link href="/projects">
                  <button className="px-6 py-3 bg-amber-500 rounded-lg text-white hover:bg-amber-600 transition-all duration-300 font-bold shadow-lg hover:shadow-amber-200 h-[50px] flex items-center gap-2">
                    View Charity Projects
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </Link>
              </div>
            </div>

            <div className="w-full mt-10 md:mt-0">
              <div className="relative w-full h-64 md:h-96 rounded-2xl">
                <Image
                  src="/SumCharity/hero.png"
                  alt="Charity hands"
                  width={1024}
                  height={768}
                  className="object-contain w-full h-full"
                />
              </div>
            </div>
          </div>

          <div className="w-full mt-10 mb-20">
            <h3 className="text-3xl font-semibold text-center mb-10 text-amber-800">
              Why Choose SumCharity?
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-amber-100 transition-all duration-300 border border-amber-100">
                <ShieldCheckIcon className="w-12 h-12 text-amber-500 mb-4" />
                <h4 className="text-xl font-bold text-amber-700 mb-2">
                  Secure & Transparent
                </h4>
                <p className="text-gray-600">
                  All transactions are recorded on the blockchain, ensuring
                  complete transparency and security for donors and recipients.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-amber-100 transition-all duration-300 border border-amber-100">
                <CurrencyDollarIcon className="w-12 h-12 text-amber-500 mb-4" />
                <h4 className="text-xl font-bold text-amber-700 mb-2">
                  Direct Impact
                </h4>
                <p className="text-gray-600">
                  Your donations go directly to projects without middlemen,
                  maximizing the impact of every contribution.
                </p>
              </div>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl shadow-lg hover:shadow-amber-100 transition-all duration-300 border border-amber-100">
                <GlobeAltIcon className="w-12 h-12 text-amber-500 mb-4" />
                <h4 className="text-xl font-bold text-amber-700 mb-2">
                  Global Reach
                </h4>
                <p className="text-gray-600">
                  Support projects from around the world and track how your
                  donations are making a difference globally.
                </p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative z-10 bg-amber-50 border-t border-amber-200">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* About */}
              <div>
                <div className="flex items-center mb-4">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center mr-2">
                    <span className="text-white font-bold text-sm">SC</span>
                  </div>
                  <h4 className="text-lg font-bold bg-gradient-to-r from-amber-600 to-amber-800 bg-clip-text text-transparent">
                    SumCharity
                  </h4>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  A decentralized charity platform that ensures transparency and
                  security through blockchain technology.
                </p>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="text-lg font-bold text-amber-800 mb-4">
                  Quick Links
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/projects"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      Projects
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-lg font-bold text-amber-800 mb-4">
                  What is this?
                </h4>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      A course project
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      For COMP 4541
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="text-gray-600 hover:text-amber-600 transition-colors"
                    >
                      Blockchain, Cryptocurrencies and Smart Contracts
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Contact */}
              <div>
                <h4 className="text-lg font-bold text-amber-800 mb-4">
                  Contact Us
                </h4>
                <div className="space-y-2">
                  <Link
                    href="mailto:sylamau@connect.ust.hk"
                    className="flex items-center text-gray-600 hover:text-amber-600 transition-colors"
                  >
                    <EnvelopeIcon className="h-5 w-5 mr-2" />
                    sylamau@connect.ust.hk
                  </Link>
                  <div className="flex space-x-4 mt-4">
                    <a
                      href="https://github.com/charlieop"
                      target="_blank"
                      className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-200 transition-all"
                      aria-label="Twitter"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 9.99 9.99 0 01-3.127 1.195 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-200 transition-all"
                      aria-label="Discord"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/summyyyy"
                      target="_blank"
                      className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 hover:bg-amber-200 transition-all"
                      aria-label="GitHub"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-amber-200 mt-8 pt-6 text-center">
              <p className="text-sm text-gray-600">
                &copy; {new Date().getFullYear()} SumCharity. All rights
                reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
