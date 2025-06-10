import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Wizard VS Puppet - Rock Paper Fire",
  description: "A decentralized Rock Paper Fire game on Starknet featuring epic battles between Wizards and Puppets",
  keywords: ["blockchain", "game", "starknet", "web3", "rock paper scissors", "wizard", "puppet"],
  authors: [{ name: "Wizard vs Puppet Team" }],
  openGraph: {
    title: "Wizard VS Puppet - Rock Paper Fire",
    description: "Epic battles between Wizards and Puppets on Starknet",
    type: "website",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
      // Prevent ethereum proxy assignment errors - safer approach
      if (typeof window !== 'undefined') {
        try {
          // Check if ethereum property already exists
          if ('ethereum' in window) {
            // If it exists, try to redefine it safely
            try {
              Object.defineProperty(window, 'ethereum', {
                get: function() {
                  return undefined;
                },
                set: function() {
                  // Silently ignore attempts to set ethereum
                  return;
                },
                configurable: true,
                enumerable: false
              });
            } catch (defineError) {
              // If we can't redefine, just ignore
              console.debug('Ethereum property already defined');
            }
          } else {
            // If it doesn't exist, define it
            try {
              Object.defineProperty(window, 'ethereum', {
                get: function() {
                  return undefined;
                },
                set: function() {
                  // Silently ignore attempts to set ethereum
                  return;
                },
                configurable: true,
                enumerable: false
              });
            } catch (defineError) {
              // Fallback: just set it to undefined
              try {
                window.ethereum = undefined;
              } catch (setError) {
                // Complete fallback: do nothing
              }
            }
          }
        } catch (e) {
          // Complete error handling - do nothing if all fails
        }
      }
    `,
          }}
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}
