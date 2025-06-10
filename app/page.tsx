"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Wallet } from "lucide-react"
import { GameLobby } from "@/components/game-lobby"
import { GamePlayFullscreen } from "@/components/game-play-fullscreen"

export default function HomePage() {
  const [isWalletConnected, setIsWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState("")
  const [balance, setBalance] = useState("0")
  const [activeTab, setActiveTab] = useState("lobby")
  const [currentGame, setCurrentGame] = useState(null)
  const [selectedCoin, setSelectedCoin] = useState({ symbol: "LORDS", name: "Lords", balance: "125.8" })
  const [betAmount, setBetAmount] = useState("")
  const [betError, setBetError] = useState("")
  const [selectedFaction, setSelectedFaction] = useState<"wizard" | "puppet">("wizard")
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false)
  const [currencySearchTerm, setCurrencySearchTerm] = useState("")
  const [waitingLobby, setWaitingLobby] = useState<any>(null)
  const [waitingTimeLimit, setWaitingTimeLimit] = useState(5) // minutes
  const [waitingTimeLeft, setWaitingTimeLeft] = useState(0) // seconds

  const availableCoins = [
    { symbol: "LORDS", name: "Lords", balance: "125.8" },
    { symbol: "ETH", name: "Ethereum", balance: "2.45" },
    { symbol: "STRK", name: "Starknet", balance: "1,124.8" },
    { symbol: "USDC", name: "USD Coin", balance: "1,250.00" },
    { symbol: "BTC", name: "Bitcoin", balance: "0.0123" },
    { symbol: "USDT", name: "Tether", balance: "890.50" },
    { symbol: "BNB", name: "BNB", balance: "12.34" },
    { symbol: "SOL", name: "Solana", balance: "8.90" },
    { symbol: "ADA", name: "Cardano", balance: "1,200.00" },
    { symbol: "AVAX", name: "Avalanche", balance: "45.67" },
    { symbol: "DOT", name: "Polkadot", balance: "78.90" },
    { symbol: "MATIC", name: "Polygon", balance: "450.75" },
    { symbol: "LINK", name: "Chainlink", balance: "23.45" },
    { symbol: "UNI", name: "Uniswap", balance: "15.67" },
    { symbol: "ATOM", name: "Cosmos", balance: "89.12" },
    { symbol: "XRP", name: "XRP", balance: "2,500.00" },
    { symbol: "LTC", name: "Litecoin", balance: "5.67" },
    { symbol: "NEAR", name: "NEAR Protocol", balance: "234.56" },
    { symbol: "FTM", name: "Fantom", balance: "1,890.00" },
    { symbol: "ALGO", name: "Algorand", balance: "3,456.78" },
  ]

  const filteredCoins = availableCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(currencySearchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(currencySearchTerm.toLowerCase()),
  )

  // Prevent ethereum-related errors on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        // Prevent any ethereum provider errors
        const originalError = window.onerror
        window.onerror = (message, source, lineno, colno, error) => {
          if (typeof message === "string" && (message.includes("ethereum") || message.includes("proxy"))) {
            return true // Prevent the error from being logged
          }
          if (originalError) {
            return originalError(message, source, lineno, colno, error)
          }
          return false
        }
      } catch (e) {
        // Ignore setup errors
      }
    }
  }, [])

  const validateBetAmount = (amount: string) => {
    const numAmount = Number.parseFloat(amount)
    const maxBalance = Number.parseFloat(selectedCoin.balance)

    if (!amount) {
      setBetError("")
      return
    }

    if (isNaN(numAmount) || numAmount <= 0) {
      setBetError("Please enter a valid amount")
      return
    }

    if (numAmount < 0.1) {
      setBetError("Minimum bet is 0.1")
      return
    }

    if (numAmount > maxBalance) {
      setBetError(`Insufficient balance. Maximum: ${selectedCoin.balance} ${selectedCoin.symbol}`)
      return
    }

    setBetError("")
  }

  useEffect(() => {
    setBetAmount("")
    setBetError("")
  }, [selectedCoin.symbol])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCurrencyDropdownOpen && !(event.target as Element).closest(".relative")) {
        setIsCurrencyDropdownOpen(false)
        setCurrencySearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isCurrencyDropdownOpen])

  useEffect(() => {
    if (waitingLobby && waitingTimeLeft > 0) {
      const timer = setTimeout(() => setWaitingTimeLeft(waitingTimeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (waitingLobby && waitingTimeLeft === 0) {
      // Time expired, cancel the lobby
      setWaitingLobby(null)
      setWaitingTimeLeft(0)
      alert("Waiting time expired. Lobby cancelled.")
    }
  }, [waitingTimeLeft, waitingLobby])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Character Versus Section - Only shown on homepage */}
      {!isWalletConnected && (
        <div className="w-full px-[60px] min-h-screen flex items-center border-b border-blue-500/20">
          <div className="relative flex items-center justify-between max-w-7xl mx-auto">
            {/* Wizard Character - Left Side */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border-4 border-blue-400 flex items-center justify-center shadow-2xl">
                  <img src="/images/wizard.png" alt="Wizard" className="w-40 h-40 object-contain" />
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white font-heading">WIZARD</h3>
                <p className="text-blue-400 font-body">Master of Elements</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Content Section - Center */}
            <div className="flex-grow flex items-center justify-center px-8">
              <div className="w-full max-w-md">
                <div className="flex justify-center space-x-8 mb-8">
                  {/* Cartridge Logo */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center shadow-lg mb-2 p-2">
                      <img
                        src="/images/cartridge-logo.png"
                        alt="Cartridge Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-white text-sm font-medium font-body">Cartridge</span>
                  </div>

                  {/* Starknet Logo */}
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg mb-2 p-2">
                      <img
                        src="/images/starknet-logo.svg"
                        alt="Starknet Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-white text-sm font-medium font-body">Starknet</span>
                  </div>
                </div>

                <Card className="bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                  <CardHeader className="text-center">
                    <CardTitle className="text-white text-2xl font-title">Connect to Starknet</CardTitle>
                    <CardDescription className="text-gray-300 text-base mt-2 font-body">
                      Experience Rock Paper Fire on the Starknet network
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-center">
                    <div className="space-y-4">
                      <button
                        onClick={() => setIsWalletConnected(true)}
                        className="btn-primary w-full py-6 text-lg font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                      >
                        <div className="w-5 h-5 mr-2 bg-white rounded flex items-center justify-center p-1">
                          <img
                            src="/images/cartridge-logo.png"
                            alt="Cartridge Logo"
                            className="w-full h-full object-contain filter brightness-0"
                          />
                        </div>
                        Connect Cartridge Wallet
                      </button>

                      <button
                        onClick={() => setIsWalletConnected(true)}
                        className="btn-secondary w-full py-6 text-lg font-medium shadow-lg transition-all duration-300 hover:scale-[1.02] flex items-center justify-center"
                      >
                        <Wallet className="w-5 h-5 mr-2" />
                        Connect Argent X
                      </button>
                    </div>

                    <div className="mt-6 text-gray-400 text-sm font-body">
                      Secure, decentralized gameplay with real LORDS rewards
                    </div>
                  </CardContent>
                </Card>

                <div className="mt-8 text-center">
                  <p className="text-gray-400 text-sm font-body">A premier gaming experience built on Starknet</p>
                  <p className="text-gray-500 text-xs mt-2 font-body">© 2025 Rock Paper Fire</p>
                </div>
              </div>
            </div>

            {/* Puppet Character - Right Side */}
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-600/20 to-orange-800/20 backdrop-blur-sm border-4 border-orange-400 flex items-center justify-center shadow-2xl">
                  <img src="/images/puppet.png" alt="Puppet" className="w-40 h-40 object-contain" />
                </div>
                <div className="absolute -bottom-2 -left-2 w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white font-heading">PUPPET</h3>
                <p className="text-orange-400 font-body">Chaos Bringer</p>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                  <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
                </div>
              </div>
            </div>

            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      )}

      {/* Game Content - Shown when wallet is connected */}
      {isWalletConnected && (
        <div className="min-h-screen">
          {/* Header Section */}
          <div
            className={`bg-black/30 backdrop-blur-sm border-b border-white/20 p-6 relative z-50 ${currentGame ? "hidden" : ""}`}
          >
            <div className="container mx-auto">
              <div className="flex items-center justify-between">
                {/* Left - Game Logo and Title */}
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-lg">🎮</span>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-white font-heading">Wizard vs Puppet</h1>
                    <p className="text-gray-300 font-body">Rock Paper Fire on Starknet</p>
                  </div>
                </div>

                {/* Center - Game Statistics */}
                <div className="flex items-center space-x-6">
                  <div className="text-center">
                    <div className="text-xl font-bold text-green-400 font-body">42</div>
                    <div className="text-gray-400 text-sm font-body">Games Played</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-blue-400 font-body">67%</div>
                    <div className="text-gray-400 text-sm font-body">Win Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-yellow-400 font-body">15.8 LORDS</div>
                    <div className="text-gray-400 text-sm font-body">Total Winnings</div>
                  </div>
                </div>

                {/* Right - User Info and Currency Selector */}
                <div className="flex items-center space-x-6">
                  {/* User Profile */}
                  <div className="flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-sm">DB</span>
                    </div>
                    <div className="text-white">
                      <div className="font-bold font-body">Designer.brother</div>
                      <div className="flex items-center space-x-2">
                        <span className="text-gray-300 text-sm font-mono">0x9cSd...pfV2s</span>
                        <button
                          onClick={() =>
                            navigator.clipboard.writeText("0x9cSd1234567890abcdefghijklmnopqrstuvwxyzpfV2s")
                          }
                          className="text-gray-400 hover:text-white transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsWalletConnected(false)}
                      className="text-red-400 hover:text-red-300 transition-colors ml-2"
                      title="Logout"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Currency Selector */}
                  <div className="relative">
                    <button
                      onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
                      className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg px-4 py-3 text-white font-body cursor-pointer pr-10 min-w-[140px] flex items-center space-x-2"
                    >
                      <img
                        src={`/images/coins/${selectedCoin.symbol.toLowerCase()}.svg`}
                        alt={selectedCoin.symbol}
                        className="w-5 h-5"
                        onError={(e) => {
                          e.currentTarget.src = `/placeholder.svg?height=20&width=20&text=${selectedCoin.symbol}`
                        }}
                      />
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{selectedCoin.symbol}</span>
                        <span className="text-xs text-gray-400">{selectedCoin.balance}</span>
                      </div>
                      <svg
                        className="w-4 h-4 text-gray-400 ml-auto"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {isCurrencyDropdownOpen && (
                      <div className="absolute top-full right-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-[99999] max-h-80 overflow-hidden">
                        <div className="p-3 border-b border-white/20">
                          <div className="relative">
                            <svg
                              className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                              />
                            </svg>
                            <input
                              type="text"
                              placeholder="Search coins..."
                              value={currencySearchTerm}
                              onChange={(e) => setCurrencySearchTerm(e.target.value)}
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
                                setIsCurrencyDropdownOpen(false)
                                setCurrencySearchTerm("")
                              }}
                              className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors text-left"
                            >
                              <div className="flex items-center space-x-3">
                                <img
                                  src={`/images/coins/${coin.symbol.toLowerCase()}.svg`}
                                  alt={coin.symbol}
                                  className="w-6 h-6"
                                  onError={(e) => {
                                    e.currentTarget.src = `/placeholder.svg?height=20&width=20&text=${coin.symbol}`
                                  }}
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
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="container mx-auto px-4 py-8">
            {currentGame ? (
              <GamePlayFullscreen
                game={currentGame}
                onGameEnd={() => {
                  setCurrentGame(null)
                  setActiveTab("lobby")
                }}
                userAddress={userAddress || "0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10"}
              />
            ) : waitingLobby ? (
              <div className="space-y-6">
                {/* Waiting for Opponent Screen */}
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white font-heading">Waiting for Opponent</CardTitle>
                    <CardDescription className="text-gray-300 font-body">
                      Your game lobby is active and waiting for a player to join
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-800/20 backdrop-blur-sm border-4 border-blue-400 flex items-center justify-center shadow-2xl animate-pulse">
                          <img
                            src={selectedFaction === "wizard" ? "/images/wizard.png" : "/images/puppet.png"}
                            alt={selectedFaction}
                            className="w-24 h-24 object-contain"
                          />
                        </div>
                        <div className="absolute -top-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                          <span className="text-white font-bold text-xs">?</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <div className="text-white text-xl font-bold font-heading">
                        Playing as {selectedFaction === "wizard" ? "Wizard" : "Puppet"}
                      </div>
                      <div className="flex items-center justify-center space-x-4">
                        <img
                          src={`/images/coins/${waitingLobby.coin.toLowerCase()}.svg`}
                          alt={waitingLobby.coin}
                          className="w-6 h-6"
                          onError={(e) => {
                            e.currentTarget.src = `/placeholder.svg?height=24&width=24&text=${waitingLobby.coin}`
                          }}
                        />
                        <span className="text-yellow-400 text-2xl font-bold font-body">
                          {waitingLobby.bet} {waitingLobby.coin}
                        </span>
                      </div>
                      <div className="text-gray-300 font-body">
                        Lobby closes in:{" "}
                        <span className="text-orange-400 font-bold">
                          {Math.floor(waitingTimeLeft / 60)}:{(waitingTimeLeft % 60).toString().padStart(2, "0")}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center space-x-4">
                      <button
                        onClick={() => {
                          setWaitingLobby(null)
                          setWaitingTimeLeft(0)
                          setActiveTab("lobby")
                        }}
                        className="btn-danger px-6 py-3"
                      >
                        Cancel Lobby
                      </button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <div>
                <div className="flex justify-between items-center mb-6 w-full max-w-6xl mx-auto">
                  {/* Left side buttons */}
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setActiveTab("lobby")}
                      className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center ${
                        activeTab === "lobby"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      Game Lobby
                    </button>
                    <button
                      onClick={() => setActiveTab("stats")}
                      className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center ${
                        activeTab === "stats"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      Statistics
                    </button>
                  </div>

                  {/* Center button */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setActiveTab("tournament")}
                      className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center ${
                        activeTab === "tournament"
                          ? "bg-blue-600 text-white shadow-lg"
                          : "bg-white/10 text-gray-300 hover:bg-white/20 hover:text-white"
                      }`}
                    >
                      Tournaments
                    </button>
                    <span className="bg-yellow-500 text-black text-xs font-bold px-2 py-1 rounded-full">
                      Coming Soon
                    </span>
                  </div>

                  {/* Right side button */}
                  <div>
                    <button
                      onClick={() => setActiveTab("create")}
                      className={`px-6 py-3 rounded-lg transition-all duration-200 font-medium flex items-center ${
                        activeTab === "create"
                          ? "bg-green-700 text-white shadow-lg"
                          : "bg-green-600 text-white hover:bg-green-700 shadow-md"
                      }`}
                    >
                      Create a Lobby
                    </button>
                  </div>
                </div>

                {/* Tab Content */}
                {activeTab === "lobby" && (
                  <GameLobby
                    userAddress={userAddress || "0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10"}
                    balance={selectedCoin.balance}
                    onGameStart={(game) => setCurrentGame(game)}
                  />
                )}

                {activeTab === "create" && (
                  <div className="mt-6">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white font-heading">Create New Game</CardTitle>
                        <CardDescription className="text-gray-300 font-body">
                          Set your bet amount and wait for an opponent
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="space-y-6">
                          {/* Faction Selection */}
                          <div className="space-y-3">
                            <label className="text-white font-body text-lg">Choose Your Champion</label>
                            <div className="grid grid-cols-2 gap-4">
                              <button
                                onClick={() => setSelectedFaction("wizard")}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                  selectedFaction === "wizard"
                                    ? "border-blue-400 bg-blue-500/20 shadow-lg"
                                    : "border-white/20 bg-white/5 hover:border-blue-400/50"
                                }`}
                              >
                                <div className="flex flex-col items-center space-y-3">
                                  <img src="/images/wizard.png" alt="Wizard" className="w-16 h-16 object-contain" />
                                  <div className="text-center">
                                    <div className="text-white font-bold font-heading">WIZARD</div>
                                    <div className="text-blue-400 text-sm font-body">Master of Elements</div>
                                  </div>
                                </div>
                              </button>
                              <button
                                onClick={() => setSelectedFaction("puppet")}
                                className={`p-4 rounded-lg border-2 transition-all duration-300 ${
                                  selectedFaction === "puppet"
                                    ? "border-orange-400 bg-orange-500/20 shadow-lg"
                                    : "border-white/20 bg-white/5 hover:border-orange-400/50"
                                }`}
                              >
                                <div className="flex flex-col items-center space-y-3">
                                  <img src="/images/puppet.png" alt="Puppet" className="w-16 h-16 object-contain" />
                                  <div className="text-center">
                                    <div className="text-white font-bold font-heading">PUPPET</div>
                                    <div className="text-orange-400 text-sm font-body">Chaos Bringer</div>
                                  </div>
                                </div>
                              </button>
                            </div>
                          </div>

                          {/* Waiting Time Selection */}
                          <div className="space-y-3">
                            <label className="text-white font-body text-lg">Waiting Time for Opponent</label>
                            <div className="grid grid-cols-4 gap-3">
                              {[5, 10, 30, 60].map((minutes) => (
                                <button
                                  key={minutes}
                                  onClick={() => setWaitingTimeLimit(minutes)}
                                  className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                                    waitingTimeLimit === minutes
                                      ? "border-green-400 bg-green-500/20 shadow-lg"
                                      : "border-white/20 bg-white/5 hover:border-green-400/50"
                                  }`}
                                >
                                  <div className="text-center">
                                    <div className="text-white font-bold font-heading">{minutes}m</div>
                                    <div className="text-gray-400 text-xs font-body">wait</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          </div>

                          {/* Bet Amount Slider */}
                          <div className="space-y-4 max-w-md mx-auto">
                            <div className="space-y-2">
                              <label className="text-white font-body">Bet Amount ({selectedCoin.symbol})</label>
                              <div className="space-y-3">
                                {/* Slider */}
                                <div className="relative">
                                  <input
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={
                                      betAmount
                                        ? Math.round(
                                            (Number.parseFloat(betAmount) / Number.parseFloat(selectedCoin.balance)) *
                                              100,
                                          )
                                        : 1
                                    }
                                    onChange={(e) => {
                                      const percentage = Number.parseInt(e.target.value)
                                      const calculatedAmount = (
                                        (percentage / 100) *
                                        Number.parseFloat(selectedCoin.balance)
                                      ).toFixed(2)
                                      setBetAmount(calculatedAmount)
                                      validateBetAmount(calculatedAmount)
                                    }}
                                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                                    style={{
                                      background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${betAmount ? Math.round((Number.parseFloat(betAmount) / Number.parseFloat(selectedCoin.balance)) * 100) : 1}%, rgba(255,255,255,0.2) ${betAmount ? Math.round((Number.parseFloat(betAmount) / Number.parseFloat(selectedCoin.balance)) * 100) : 1}%, rgba(255,255,255,0.2) 100%)`,
                                    }}
                                  />
                                  <style jsx>{`
                                    .slider::-webkit-slider-thumb {
                                      appearance: none;
                                      height: 20px;
                                      width: 20px;
                                      border-radius: 50%;
                                      background: #3b82f6;
                                      cursor: pointer;
                                      border: 2px solid white;
                                      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                    }
                                    .slider::-moz-range-thumb {
                                      height: 20px;
                                      width: 20px;
                                      border-radius: 50%;
                                      background: #3b82f6;
                                      cursor: pointer;
                                      border: 2px solid white;
                                      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
                                    }
                                  `}</style>
                                </div>

                                {/* Amount Display and Input */}
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center space-x-2">
                                    <input
                                      type="number"
                                      value={betAmount}
                                      onChange={(e) => {
                                        const value = e.target.value
                                        setBetAmount(value)
                                        validateBetAmount(value)
                                      }}
                                      placeholder={(0.01 * Number.parseFloat(selectedCoin.balance)).toFixed(2)}
                                      className={`bg-white/10 border rounded-md px-3 py-2 text-white font-bold font-body text-right flex-1 focus:outline-none transition-colors ${
                                        betError
                                          ? "border-red-400 focus:border-red-500"
                                          : "border-white/20 focus:border-blue-400"
                                      }`}
                                      step="0.01"
                                      min="0"
                                      max={selectedCoin.balance}
                                    />
                                    <button
                                      onClick={() => {
                                        setBetAmount(selectedCoin.balance)
                                        validateBetAmount(selectedCoin.balance)
                                      }}
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      100%
                                    </button>
                                  </div>
                                </div>

                                {betError && <div className="text-red-400 text-sm font-body">{betError}</div>}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <button
                                onClick={() => {
                                  if (!betError && betAmount && Number.parseFloat(betAmount) > 0) {
                                    const newLobby = {
                                      id: `lobby-${Date.now()}`,
                                      creator: userAddress,
                                      bet: betAmount,
                                      coin: selectedCoin.symbol,
                                      faction: selectedFaction,
                                      waitingTime: waitingTimeLimit,
                                      createdAt: new Date(),
                                    }
                                    setWaitingLobby(newLobby)
                                    setWaitingTimeLeft(waitingTimeLimit * 60) // Convert minutes to seconds
                                    setActiveTab("lobby")
                                  }
                                }}
                                className="btn-success w-full py-4 text-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={!!betError || !betAmount || Number.parseFloat(betAmount) <= 0}
                              >
                                Create Game as {selectedFaction === "wizard" ? "Wizard" : "Puppet"}
                              </button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "stats" && (
                  <div className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white font-heading">Games Played</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-white font-body">42</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white font-heading">Win Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-green-400 font-body">67%</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-white/10 backdrop-blur-md border-white/20">
                        <CardHeader>
                          <CardTitle className="text-white font-heading">Total Winnings</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-3xl font-bold text-yellow-400 font-body">15.8 LORDS</div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                )}

                {activeTab === "tournament" && (
                  <div className="mt-6">
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <CardHeader>
                        <CardTitle className="text-white font-heading">Tournaments</CardTitle>
                        <CardDescription className="text-gray-300 font-body">
                          Coming soon - compete in tournaments for bigger prizes
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-white">Tournament features will be available soon</div>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
