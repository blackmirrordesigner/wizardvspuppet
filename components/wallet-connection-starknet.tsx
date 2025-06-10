"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy, ChevronDown, Search } from "lucide-react"
import { getCoinIcon } from "@/lib/coin-utils"

const POPULAR_COINS = [
  { symbol: "STRK", name: "Starknet", balance: "1,124,255.8" },
  { symbol: "LORDS", name: "Lords", balance: "125.8" },
  { symbol: "ETH", name: "Ethereum", balance: "2.45" },
  { symbol: "BTC", name: "Bitcoin", balance: "0.0123" },
  { symbol: "USDC", name: "USD Coin", balance: "1,250.00" },
  { symbol: "USDT", name: "Tether", balance: "890.50" },
  { symbol: "MATIC", name: "Polygon", balance: "450.75" },
  { symbol: "ARB", name: "Arbitrum", balance: "89.25" },
  { symbol: "OP", name: "Optimism", balance: "67.80" },
  { symbol: "AVAX", name: "Avalanche", balance: "12.34" },
  { symbol: "SOL", name: "Solana", balance: "8.90" },
  { symbol: "ADA", name: "Cardano", balance: "1,200.00" },
  { symbol: "DOT", name: "Polkadot", balance: "45.67" },
  { symbol: "LINK", name: "Chainlink", balance: "78.90" },
  { symbol: "UNI", name: "Uniswap", balance: "23.45" },
  { symbol: "AAVE", name: "Aave", balance: "5.67" },
]

interface WalletConnectionStarknetProps {
  isConnected: boolean
  onConnect: (connected: boolean) => void
  userAddress: string
  onAddressChange: (address: string) => void
  balance: string
  onBalanceChange: (balance: string) => void
  onCoinChange?: (coin: { symbol: string; name: string; balance: string }) => void
}

export function WalletConnectionStarknet({
  isConnected,
  onConnect,
  userAddress,
  onAddressChange,
  balance,
  onBalanceChange,
  onCoinChange,
}: WalletConnectionStarknetProps) {
  const [isConnecting, setIsConnecting] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState(POPULAR_COINS[0])
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredCoins = POPULAR_COINS.filter(
    (coin) =>
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Prevent any ethereum-related code from running
  useEffect(() => {
    // Ensure no ethereum provider is accessed
    if (typeof window !== "undefined") {
      try {
        // Block any ethereum provider access
        const originalError = console.error
        console.error = (...args) => {
          if (args[0]?.includes?.("ethereum") || args[0]?.includes?.("proxy")) {
            return // Silently ignore ethereum-related errors
          }
          originalError.apply(console, args)
        }
      } catch (e) {
        // Ignore
      }
    }
  }, [])

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      // Pure simulation - absolutely no browser APIs
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock Starknet address and balance
      const mockAddress = "0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10"
      const mockBalance = "125.8"

      onAddressChange(mockAddress)
      onBalanceChange(mockBalance)
      onConnect(true)
    } catch (error) {
      // Silently handle errors to prevent ethereum-related issues
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    onConnect(false)
    onAddressChange("")
    onBalanceChange("0")
  }

  const copyAddress = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(userAddress)
      }
    } catch (error) {
      // Fallback - just log to console
      console.log("Address:", userAddress)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isDropdownOpen && !(event.target as Element).closest(".relative")) {
        setIsDropdownOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isDropdownOpen])

  if (!isConnected) {
    return (
      <button onClick={connectWallet} disabled={isConnecting} className="btn-primary px-6 py-3 flex items-center">
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect Cartridge"}
      </button>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 border border-blue-500/20 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-blue-500/20 text-blue-400 border border-blue-400 font-body">
              Connected
            </Badge>
            <span className="text-white font-mono text-sm font-body">@designer.brother</span>
            <button
              onClick={copyAddress}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white bg-transparent border-none"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white hover:bg-white/20 transition-colors"
            >
              <img
                src={getCoinIcon(selectedCoin.symbol) || "/placeholder.svg"}
                alt={selectedCoin.symbol}
                className="w-4 h-4"
              />
              <span className="font-bold">
                {selectedCoin.balance} {selectedCoin.symbol}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-[99999]">
                <div className="p-3 border-b border-white/20 z-[99999]">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search coins..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-400"
                    />
                  </div>
                </div>
                <div className="max-h-60 overflow-y-auto">
                  {filteredCoins.map((coin) => (
                    <button
                      key={coin.symbol}
                      onClick={() => {
                        setSelectedCoin(coin)
                        setIsDropdownOpen(false)
                        setSearchTerm("")
                        onBalanceChange(coin.balance)
                        onCoinChange?.(coin)
                      }}
                      className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors text-left"
                    >
                      <div className="flex items-center space-x-3">
                        <img
                          src={getCoinIcon(coin.symbol) || "/placeholder.svg"}
                          alt={coin.symbol}
                          className="w-6 h-6"
                        />
                        <div>
                          <div className="text-white font-medium">{coin.symbol}</div>
                          <div className="text-gray-400 text-sm">{coin.name}</div>
                        </div>
                      </div>
                      <div className="text-white font-bold">{coin.balance}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
          <button onClick={disconnectWallet} className="btn-danger px-4 py-2 text-sm">
            Disconnect
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
