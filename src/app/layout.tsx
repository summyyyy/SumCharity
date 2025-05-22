import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { ThirdwebProvider } from "thirdweb/react";
import { MantineProvider, createTheme } from "@mantine/core";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";

const inter = Inter({ subsets: ["latin"] });

const theme = createTheme({
  primaryColor: "orange",
});

export const metadata: Metadata = {
  title: "SumCharity",
  description: "A blockchain-based charity platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MantineProvider theme={theme}>
          <ThirdwebProvider>{children}</ThirdwebProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
