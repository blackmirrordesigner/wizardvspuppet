"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Clock } from "lucide-react"
import { getCoinIcon } from "@/lib/coin-utils"
import { Search } from "lucide-react"

interface GameLobbyProps {
  userAddress: string
  balance: string
  onGameStart: (game: any) => void
}

interface GameRoom {
  id: string
  creator: string
  bet: string
  coin: string
  status: "waiting" | "full" | "playing" | "finished"
  createdAt: Date
  winner?: string
  result?: string
}

export function GameLobby({ userAddress, balance, onGameStart }: GameLobbyProps) {
  const [gameRooms, setGameRooms] = useState<GameRoom[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [isCoinDropdownOpen, setIsCoinDropdownOpen] = useState(false)
  const [coinSearchTerm, setCoinSearchTerm] = useState("")
  const [lobbyTimers, setLobbyTimers] = useState<Record<string, number>>({})
  const [gameTimers, setGameTimers] = useState<Record<string, number>>({})

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

  const filteredCoinOptions = availableCoins.filter(
    (coin) =>
      coin.name.toLowerCase().includes(coinSearchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(coinSearchTerm.toLowerCase()),
  )

  useEffect(() => {
    const rooms = [
      {
        id: "room-1",
        creator: "0x1234...5678",
        bet: "2.5",
        coin: "LORDS",
        status: "waiting",
        createdAt: new Date(Date.now() - 300000),
      },
      {
        id: "room-2",
        creator: "0x9876...4321",
        bet: "5.0",
        coin: "ETH",
        status: "waiting",
        createdAt: new Date(Date.now() - 600000),
      },
      {
        id: "room-3",
        creator: "0xabcd...efgh",
        bet: "1.0",
        coin: "LORDS",
        status: "playing",
        createdAt: new Date(Date.now() - 900000),
      },
      {
        id: "room-4",
        creator: "0xdef1...2345",
        bet: "0.5",
        coin: "STRK",
        status: "waiting",
        createdAt: new Date(Date.now() - 1200000),
      },
      {
        id: "room-5",
        creator: "0x5678...9abc",
        bet: "10.0",
        coin: "USDC",
        status: "finished",
        createdAt: new Date(Date.now() - 1500000),
        winner: "0x5678...9abc",
        result: "Rock vs Paper",
      },
      {
        id: "room-6",
        creator: "0x2468...1357",
        bet: "0.001",
        coin: "BTC",
        status: "waiting",
        createdAt: new Date(Date.now() - 1800000),
      },
      {
        id: "room-7",
        creator: "0x1357...2468",
        bet: "3.2",
        coin: "ETH",
        status: "playing",
        createdAt: new Date(Date.now() - 2100000),
      },
      {
        id: "room-8",
        creator: "0x9999...1111",
        bet: "15.0",
        coin: "LORDS",
        status: "waiting",
        createdAt: new Date(Date.now() - 2400000),
      },
    ]

    // Initialize timers
    const initialLobbyTimers = {}
    const initialGameTimers = {}

    rooms.forEach((room) => {
      if (room.status === "waiting") {
        const timeElapsed = Math.floor((Date.now() - room.createdAt.getTime()) / 1000)
        const maxTime = 3600 // 1 hour
        initialLobbyTimers[room.id] = Math.max(0, maxTime - timeElapsed)
      } else if (room.status === "playing") {
        initialGameTimers[room.id] = Math.floor(Math.random() * 30) // Random progress for demo
      }
    })

    setLobbyTimers(initialLobbyTimers)
    setGameTimers(initialGameTimers)
    setGameRooms(rooms)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setLobbyTimers((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((roomId) => {
          if (updated[roomId] > 0) {
            updated[roomId] -= 1
          }
        })
        return updated
      })

      setGameTimers((prev) => {
        const updated = { ...prev }
        Object.keys(updated).forEach((roomId) => {
          if (updated[roomId] < 30) {
            updated[roomId] += 1
          }
        })
        return updated
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isCoinDropdownOpen && !(event.target as Element).closest(".coin-dropdown")) {
        setIsCoinDropdownOpen(false)
        setCoinSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [isCoinDropdownOpen])

  const joinGame = async (room: GameRoom) => {
    try {
      // Simulate joining game
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const game = {
        id: room.id,
        player1: room.creator,
        player2: userAddress,
        bet: room.bet,
        status: "playing",
      }

      onGameStart(game)
    } catch (error) {
      console.error("Failed to join game:", error)
    }
  }

  const createGame = async (betAmount: string) => {
    setIsCreating(true)
    try {
      // Simulate game creation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const newRoom: GameRoom = {
        id: `room-${Date.now()}`,
        creator: userAddress,
        bet: betAmount,
        coin: "LORDS",
        status: "waiting",
        createdAt: new Date(),
      }

      setGameRooms((prev) => [newRoom, ...prev])
    } catch (error) {
      console.error("Failed to create game:", error)
    } finally {
      setIsCreating(false)
    }
  }

  const formatTimeAgo = (date: Date) => {
    const minutes = Math.floor((Date.now() - date.getTime()) / 60000)
    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    return `${Math.floor(minutes / 60)}h ago`
  }

  const filteredRooms = gameRooms.filter((room) => {
    const coinMatch = selectedCoin === "all" || room.coin === selectedCoin
    const statusMatch = selectedStatus === "all" || room.status === selectedStatus
    return coinMatch && statusMatch
  })

  const formatTimeRemaining = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}h ${minutes}m`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  const getProgressPercentage = (current: number, max: number, inverted = false) => {
    const percentage = (current / max) * 100
    return inverted ? 100 - percentage : percentage
  }

  return (
    <div className="w-full px-[60px]">
      {/* Active Games */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20 w-full">
        <CardHeader>
          <CardTitle className="text-white font-heading">Active Game Rooms</CardTitle>
          <CardDescription className="text-gray-300 font-body">
            Join an existing game or wait for players to join yours in Rock Paper Fire
          </CardDescription>
        </CardHeader>
        {/* Filter Controls - moved inside the card */}
        <div className="mx-6 mb-4 flex flex-wrap items-center justify-between gap-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <label className="text-white font-body text-sm">Coin:</label>
              <div className="relative coin-dropdown">
                <button
                  onClick={() => setIsCoinDropdownOpen(!isCoinDropdownOpen)}
                  className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400 min-w-[140px] flex items-center space-x-2"
                >
                  {selectedCoin === "all" ? (
                    <>
                      <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
                      <span>All Coins</span>
                    </>
                  ) : (
                    <>
                      <img
                        src={getCoinIcon(selectedCoin) || "/placeholder.svg"}
                        alt={selectedCoin}
                        className="w-4 h-4"
                        onError={(e) => {
                          e.currentTarget.src = `/placeholder.svg?height=16&width=16&text=${selectedCoin}`
                        }}
                      />
                      <span>{selectedCoin}</span>
                    </>
                  )}
                  <svg className="w-4 h-4 text-gray-400 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {isCoinDropdownOpen && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-black/90 backdrop-blur-md border border-white/20 rounded-lg shadow-xl z-[99999] max-h-80 overflow-hidden">
                    <div className="p-3 border-b border-white/20">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search coins..."
                          value={coinSearchTerm}
                          onChange={(e) => setCoinSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md text-white placeholder:text-gray-400 focus:outline-none focus:border-blue-400"
                        />
                      </div>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <button
                        onClick={() => {
                          setSelectedCoin("all")
                          setIsCoinDropdownOpen(false)
                          setCoinSearchTerm("")
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-6 h-6 bg-gray-400 rounded-full"></div>
                          <div>
                            <div className="text-white font-medium">All Coins</div>
                            <div className="text-gray-400 text-sm">Show all currencies</div>
                          </div>
                        </div>
                      </button>
                      {filteredCoinOptions.map((coin) => (
                        <button
                          key={coin.symbol}
                          onClick={() => {
                            setSelectedCoin(coin.symbol)
                            setIsCoinDropdownOpen(false)
                            setCoinSearchTerm("")
                          }}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-white/10 transition-colors text-left"
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={getCoinIcon(coin.symbol) || "/placeholder.svg"}
                              alt={coin.symbol}
                              className="w-6 h-6"
                              onError={(e) => {
                                e.currentTarget.src = `/placeholder.svg?height=24&width=24&text=${coin.symbol}`
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
            <div className="flex items-center space-x-2">
              <label className="text-white font-body text-sm">Status:</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-white/10 border border-white/20 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:border-blue-400"
              >
                <option value="all" className="bg-gray-800">
                  All Status
                </option>
                <option value="waiting" className="bg-gray-800">
                  Waiting
                </option>
                <option value="playing" className="bg-gray-800">
                  Playing
                </option>
                <option value="full" className="bg-gray-800">
                  Full
                </option>
              </select>
            </div>
          </div>
          <div className="text-gray-400 text-sm font-body">
            Showing {filteredRooms.length} of {gameRooms.length} games
          </div>
        </div>
        <CardContent>
          <div className="space-y-3">
            {filteredRooms.length === 0 ? (
              <div className="text-center py-8 text-gray-400 font-body">
                No games match your filters. Try adjusting the filters above.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/20">
                      <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">Player</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">Stats</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">Bet Amount</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">Timer/Status</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-body text-sm">Status</th>
                      <th className="text-right py-3 px-4 text-gray-400 font-body text-sm">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRooms.map((room) => (
                      <tr key={room.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3">
                            <Users className="w-4 h-4 text-gray-400" />
                            <span className="text-white font-mono text-sm font-body">
                              {room.creator.slice(0, 6)}...{room.creator.slice(-4)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-3 text-xs">
                            <span className="text-green-400">W:{20 + (room.creator.charCodeAt(6) % 30)}</span>
                            <span className="text-red-400">L:{10 + (room.creator.charCodeAt(8) % 20)}</span>
                            <span className="text-purple-400">D:{3 + (room.creator.charCodeAt(10) % 12)}</span>
                            <span
                              className={`font-bold ${(() => {
                                const wins = 20 + (room.creator.charCodeAt(6) % 30)
                                const losses = 10 + (room.creator.charCodeAt(8) % 20)
                                const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 - 50 : 0
                                return winRate > 0 ? "text-green-400" : "text-red-400"
                              })()}`}
                            >
                              {(() => {
                                const wins = 20 + (room.creator.charCodeAt(6) % 30)
                                const losses = 10 + (room.creator.charCodeAt(8) % 20)
                                const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 - 50 : 0
                                return winRate > 0 ? "+" : ""
                              })()}
                              {(() => {
                                const wins = 20 + (room.creator.charCodeAt(6) % 30)
                                const losses = 10 + (room.creator.charCodeAt(8) % 20)
                                const winRate = wins + losses > 0 ? (wins / (wins + losses)) * 100 - 50 : 0
                                return Math.abs(winRate).toFixed(1)
                              })()}%
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <img
                              src={getCoinIcon(room.coin) || "/placeholder.svg"}
                              alt={room.coin}
                              className="w-4 h-4"
                            />
                            <span className="text-white font-bold font-body">
                              {room.bet} {room.coin}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          {room.status === "waiting" && (
                            <div className="space-y-2">
                              <div className="group relative">
                                <div className="w-full bg-gray-700 rounded-full h-3 cursor-pointer">
                                  <div
                                    className="bg-gradient-to-r from-orange-500 to-yellow-400 h-3 rounded-full transition-all duration-1000"
                                    style={{
                                      width: `${getProgressPercentage(lobbyTimers[room.id] || 0, 3600, false)}%`,
                                    }}
                                  ></div>
                                </div>

                                {/* Hover tooltip */}
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-3 h-3 text-orange-400" />
                                    <span>Closes in {formatTimeRemaining(lobbyTimers[room.id] || 0)}</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {room.status === "playing" && (
                            <div className="space-y-2">
                              <div className="group relative">
                                <div className="w-full bg-gray-700 rounded-full h-3 cursor-pointer">
                                  <div
                                    className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all duration-1000"
                                    style={{
                                      width: `${getProgressPercentage(gameTimers[room.id] || 0, 30)}%`,
                                    }}
                                  ></div>
                                </div>

                                {/* Hover tooltip */}
                                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-black/80 text-white px-3 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap pointer-events-none">
                                  <div className="flex items-center space-x-2">
                                    <Clock className="w-3 h-3 text-blue-400" />
                                    <span>Game in progress: {gameTimers[room.id] || 0}s / 30s</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}

                          {room.status === "playing" && gameTimers[room.id] >= 30 && (
                            <div className="h-12 flex items-center justify-center">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center">
                                  <img src="/images/rock.png" alt="Rock" className="w-6 h-6 object-contain" />
                                  <span className="text-gray-400 mx-1">vs</span>
                                  <img src="/images/paper.png" alt="Paper" className="w-6 h-6 object-contain" />
                                </div>
                                <div className="text-green-400 text-xs font-medium">
                                  {room.winner
                                    ? `${room.winner.slice(0, 6)}...${room.winner.slice(-4)}`
                                    : `${room.creator.slice(0, 6)}...${room.creator.slice(-4)}`}{" "}
                                  won
                                </div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant={
                              room.status === "waiting"
                                ? "default"
                                : room.status === "playing"
                                  ? "secondary"
                                  : "outline"
                            }
                            className={`font-body ${
                              room.status === "waiting"
                                ? "bg-green-500/20 text-green-400 border border-green-400"
                                : room.status === "playing"
                                  ? "bg-red-500/20 text-red-400 border border-red-400"
                                  : "bg-gray-500/20 text-gray-400"
                            }`}
                          >
                            {room.status === "waiting" ? "Waiting" : room.status === "playing" ? "Playing" : "Finished"}
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-right">
                          {room.status === "waiting" &&
                            room.creator !== userAddress &&
                            (lobbyTimers[room.id] || 0) > 0 && (
                              <button onClick={() => joinGame(room)} className="btn-primary px-4 py-2">
                                Join Game
                              </button>
                            )}
                          {room.status === "waiting" && (lobbyTimers[room.id] || 0) === 0 && (
                            <span className="text-red-400 text-sm font-body">Expired</span>
                          )}
                          {room.creator === userAddress && room.status === "waiting" && (
                            <span className="text-gray-400 text-sm font-body">Waiting...</span>
                          )}
                          {room.status === "playing" && (
                            <span className="text-gray-400 text-sm font-body">In Progress</span>
                          )}
                          {room.status === "finished" && (
                            <span className="text-gray-400 text-sm font-body">Completed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
