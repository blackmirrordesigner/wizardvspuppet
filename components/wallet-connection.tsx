"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wallet, Copy } from "lucide-react"

interface WalletConnectionProps {
  isConnected: boolean
  onConnect: (connected: boolean) => void
  userAddress: string
  onAddressChange: (address: string) => void
  balance: string
  onBalanceChange: (balance: string) => void
}

export function WalletConnection({
  isConnected,
  onConnect,
  userAddress,
  onAddressChange,
  balance,
  onBalanceChange,
}: WalletConnectionProps) {
  const [isConnecting, setIsConnecting] = useState(false)

  const connectWallet = async () => {
    setIsConnecting(true)

    try {
      // Pure simulation without any window object access
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const mockAddress = "0x7b51bad750f4ee8fef2e108da352886dc3b01144524ac4e12f4d2fde896083e9"
      const mockBalance = "25.5"

      onAddressChange(mockAddress)
      onBalanceChange(mockBalance)
      onConnect(true)
    } catch (error) {
      console.error("Failed to connect wallet:", error)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    onConnect(false)
    onAddressChange("")
    onBalanceChange("0")
  }

  const copyAddress = () => {
    navigator.clipboard.writeText(userAddress)
  }

  if (!isConnected) {
    return (
      <Button
        onClick={connectWallet}
        disabled={isConnecting}
        className="bg-green-600 hover:bg-green-700 border-2 border-green-400"
      >
        <Wallet className="w-4 h-4 mr-2" />
        {isConnecting ? "Connecting..." : "Connect StarKey"}
      </Button>
    )
  }

  return (
    <Card className="bg-white/10 backdrop-blur-md border-white/20 border border-red-500/20 shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border border-green-400">
              Connected
            </Badge>
            <span className="text-white font-mono text-sm">
              {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={copyAddress}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              <Copy className="w-3 h-3" />
            </Button>
          </div>
          <div className="text-white">
            <span className="font-bold">{balance} SUPRA</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={disconnectWallet}
            className="border-red-500/40 text-red-400 hover:bg-red-500/10 hover:border-red-500"
          >
            Disconnect
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
