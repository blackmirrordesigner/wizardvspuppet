"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Clock, Coins, User } from "lucide-react"

interface GamePlayProps {
  game: any
  onGameEnd: () => void
  userAddress: string
}

type Move = "rock" | "paper" | "scissors" | null

export function GamePlay({ game, onGameEnd, userAddress }: GamePlayProps) {
  const [playerMove, setPlayerMove] = useState<Move>(null)
  const [opponentMove, setOpponentMove] = useState<Move>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gamePhase, setGamePhase] = useState<"playing" | "revealing" | "finished">("playing")
  const [winner, setWinner] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [showRematchPopup, setShowRematchPopup] = useState(false)
  const [isWaitingForRematch, setIsWaitingForRematch] = useState(false)
  const [rematchRequested, setRematchRequested] = useState(false)

  // Background color management
  const getBackgroundClass = () => {
    if (gamePhase !== "finished") {
      return "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    }

    switch (winner) {
      case "player":
        return "bg-gradient-to-br from-green-900 via-green-700 to-green-800"
      case "opponent":
        return "bg-gradient-to-br from-red-900 via-red-700 to-red-800"
      case "tie":
        return "bg-gradient-to-br from-purple-900 via-purple-700 to-purple-800"
      default:
        return "bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    }
  }

  useEffect(() => {
    if (gamePhase === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gamePhase === "playing") {
      // Auto-submit random move if time runs out
      if (!playerMove) {
        const moves: Move[] = ["rock", "paper", "scissors"]
        const randomMove = moves[Math.floor(Math.random() * moves.length)]
        submitMove(randomMove)
      }
    }
  }, [timeLeft, gamePhase, playerMove])

  const submitMove = async (move: Move) => {
    if (!move) return

    setIsSubmitting(true)
    setPlayerMove(move)

    try {
      // Simulate blockchain transaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate opponent move (in real game, this would come from blockchain)
      const opponentMoves: Move[] = ["rock", "paper", "scissors"]
      const opponentChoice = opponentMoves[Math.floor(Math.random() * opponentMoves.length)]

      setOpponentMove(opponentChoice)
      setGamePhase("revealing")

      // Determine winner
      setTimeout(() => {
        const result = determineWinner(move, opponentChoice)
        setWinner(result)
        setGamePhase("finished")
      }, 2000)
    } catch (error) {
      console.error("Failed to submit move:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const determineWinner = (p1Move: Move, p2Move: Move): string | null => {
    if (!p1Move || !p2Move) return null
    if (p1Move === p2Move) return "tie"

    const winConditions = {
      rock: "scissors",
      paper: "rock",
      scissors: "paper",
    }

    return winConditions[p1Move] === p2Move ? "player" : "opponent"
  }

  const getMoveEmoji = (move: Move) => {
    switch (move) {
      case "rock":
        return "🪨"
      case "paper":
        return "📄"
      case "scissors":
        return "✂️"
      default:
        return "❓"
    }
  }

  const getResultMessage = () => {
    if (winner === "player") return "You Win! 🎉"
    if (winner === "opponent") return "You Lose 😔"
    if (winner === "tie") return "It's a Tie! 🤝"
    return ""
  }

  const getWinnings = () => {
    if (winner === "player") return (Number.parseFloat(game.bet) * 1.99).toFixed(2)
    if (winner === "tie") return game.bet
    return "0"
  }

  const getMoveGif = (move: Move, isPlayer: boolean) => {
    if (!move) return "/placeholder.svg?height=200&width=200&text=?"

    const gifs = {
      rock: isPlayer ? "/animations/left-hand-rock.gif" : "/animations/right-hand-rock.gif",
      paper: isPlayer ? "/animations/left-hand-paper.gif" : "/animations/right-hand-paper.gif",
      scissors: isPlayer ? "/animations/left-hand-scissors.gif" : "/animations/right-hand-scissors.gif",
    }

    return gifs[move] || "/placeholder.svg?height=200&width=200&text=?"
  }

  const getOutcomeGif = (playerMove: Move, opponentMove: Move, winner: string | null) => {
    if (!playerMove || !opponentMove) return null

    // Handle tie scenarios
    if (winner === "tie") {
      if (playerMove === "rock" && opponentMove === "rock") {
        return "/animations/outcomes/draw-both-rocks.gif"
      } else if (playerMove === "paper" && opponentMove === "paper") {
        return "/animations/outcomes/draw-two-papers.gif"
      } else if (playerMove === "scissors" && opponentMove === "scissors") {
        return "/animations/outcomes/draw-both-scissors.gif"
      }
    }

    // Handle win scenarios
    if (winner === "player") {
      if (playerMove === "paper" && opponentMove === "rock") {
        return "/animations/outcomes/you-win-paper-rock.gif"
      } else if (playerMove === "rock" && opponentMove === "scissors") {
        return "/animations/outcomes/you-win-rock-scissors.gif"
      } else if (playerMove === "scissors" && opponentMove === "paper") {
        // We need to create this one or use a generic win
        return "/animations/outcomes/you-win-paper-rock.gif" // Fallback
      }
    }

    // Handle lose scenarios
    if (winner === "opponent") {
      if (playerMove === "scissors" && opponentMove === "rock") {
        return "/animations/outcomes/you-lost-scissors-rock.gif"
      } else if (playerMove === "paper" && opponentMove === "scissors") {
        return "/animations/outcomes/you-lost-paper-scissors.gif"
      } else if (playerMove === "rock" && opponentMove === "paper") {
        return "/animations/outcomes/you-lost-rock-paper.gif"
      }
    }

    return null
  }

  const handleRematchRequest = async () => {
    setIsWaitingForRematch(true)
    setRematchRequested(true)

    try {
      // Simulate sending rematch request to opponent
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate opponent response (in real game, this would come from blockchain/websocket)
      setTimeout(() => {
        // 70% chance opponent accepts for demo purposes
        const opponentAccepts = Math.random() > 0.3

        if (opponentAccepts) {
          // Reset game state for new match
          resetGameForRematch()
        } else {
          // Opponent declined
          setIsWaitingForRematch(false)
          setRematchRequested(false)
          alert("Opponent declined the rematch")
        }
      }, 3000)
    } catch (error) {
      console.error("Failed to request rematch:", error)
      setIsWaitingForRematch(false)
      setRematchRequested(false)
    }
  }

  const resetGameForRematch = () => {
    setPlayerMove(null)
    setOpponentMove(null)
    setTimeLeft(30)
    setGamePhase("playing")
    setWinner(null)
    setIsSubmitting(false)
    setIsWaitingForRematch(false)
    setRematchRequested(false)
    setShowRematchPopup(false)
  }

  const handleRematchResponse = (accepted: boolean) => {
    setShowRematchPopup(false)

    if (accepted) {
      resetGameForRematch()
    }
  }

  useEffect(() => {
    if (gamePhase === "finished" && !rematchRequested) {
      // Simulate receiving rematch request from opponent (30% chance after 5 seconds)
      const timer = setTimeout(() => {
        if (Math.random() > 0.7) {
          setShowRematchPopup(true)
        }
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [gamePhase, rematchRequested])

  return (
    <div className={`min-h-screen transition-all duration-1000 ease-in-out ${getBackgroundClass()}`}>
      <div className="container mx-auto px-4 py-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={onGameEnd}
            className="bg-gray-800 border-gray-600 text-white hover:bg-gray-700 hover:border-gray-500 shadow-lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            {gamePhase === "finished" ? "Return to Lobby" : "Back to Lobby"}
          </Button>
          <div className="flex items-center space-x-4">
            <Badge className="bg-blue-500/20 text-blue-400">Game ID: {game.id}</Badge>
            <div className="flex items-center space-x-2 text-white">
              <Coins className="w-4 h-4 text-yellow-400" />
              <span className="font-bold">{game.bet} SUPRA</span>
            </div>
          </div>
        </div>

        {/* Player Information - Only show during finished phase */}
        {/* Player Information and Outcome Animation - Side by side layout */}
        {gamePhase === "finished" && (
          <div className="flex justify-center items-center space-x-8 mb-6">
            {/* Player (You) Information - Left Side */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg min-w-[200px]">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-blue-400" />
                  <span className="text-white font-bold text-lg">You</span>
                </div>
                <div className="text-gray-300 font-mono text-xs mb-3">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </div>

                {/* Game Statistics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-1 text-sm">
                    <span className="text-green-400">🏆</span>
                    <span className="text-white">W:23</span>
                    <span className="text-red-400">❌</span>
                    <span className="text-white">L:22</span>
                    <span className="text-purple-400">🤝</span>
                    <span className="text-white">D:15</span>
                  </div>
                  <div className="text-yellow-400 font-bold text-sm">
                    💰 Total: {(23 * Number.parseFloat(game.bet) * 1.99 - 22 * Number.parseFloat(game.bet)).toFixed(2)}{" "}
                    SUPRA
                  </div>
                </div>
              </div>
            </div>

            {/* Main Outcome Animation - Center */}
            <div className="flex justify-center">
              {getOutcomeGif(playerMove, opponentMove, winner) && (
                <div className="relative">
                  <img
                    src={getOutcomeGif(playerMove, opponentMove, winner) || ""}
                    alt="Game outcome"
                    className="w-80 h-80 rounded-full shadow-2xl border-4 border-white/20"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-transparent via-transparent to-black/20"></div>
                </div>
              )}
            </div>

            {/* Opponent Information - Right Side */}
            <div className="text-center">
              <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-lg p-4 shadow-lg min-w-[200px]">
                <div className="flex items-center justify-center space-x-2 mb-3">
                  <User className="w-5 h-5 text-red-400" />
                  <span className="text-white font-bold text-lg">Opponent</span>
                </div>
                <div className="text-gray-300 font-mono text-xs mb-3">
                  {game.player1 === userAddress
                    ? `${game.player2?.slice(0, 6)}...${game.player2?.slice(-4)}`
                    : `${game.player1.slice(0, 6)}...${game.player1.slice(-4)}`}
                </div>

                {/* Opponent Statistics */}
                <div className="space-y-2">
                  <div className="flex items-center justify-center space-x-1 text-sm">
                    <span className="text-green-400">🏆</span>
                    <span className="text-white">W:18</span>
                    <span className="text-red-400">❌</span>
                    <span className="text-white">L:25</span>
                    <span className="text-purple-400">🤝</span>
                    <span className="text-white">D:12</span>
                  </div>
                  <div className="text-yellow-400 font-bold text-sm">
                    💰 Total: {(18 * Number.parseFloat(game.bet) * 1.99 - 25 * Number.parseFloat(game.bet)).toFixed(2)}{" "}
                    SUPRA
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Game Status */}
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader className="text-center">
            {gamePhase === "playing" && (
              <CardDescription className="text-gray-300">
                <div className="flex items-center justify-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Time remaining: {timeLeft}s</span>
                </div>
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {gamePhase === "playing" && (
              <div className="space-y-6">
                <Progress value={((30 - timeLeft) / 30) * 100} className="w-full" />
                <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto">
                  {(["rock", "paper", "scissors"] as const).map((move) => (
                    <Button
                      key={move}
                      onClick={() => submitMove(move)}
                      disabled={isSubmitting || playerMove !== null}
                      className="h-48 w-48 flex flex-col items-center justify-center bg-green-600 hover:bg-green-700 border-4 border-green-400 rounded-2xl shadow-2xl transform hover:scale-105 transition-all duration-300 game-button"
                    >
                      <img src={`/animations/left-hand-${move}.gif`} alt={move} className="w-32 h-32 mb-4" />
                      <span className="text-white font-bold text-xl capitalize">{move}</span>
                    </Button>
                  ))}
                </div>
                {playerMove && (
                  <div className="text-center text-green-400 text-lg font-bold animate-pulse">
                    Move submitted: {getMoveEmoji(playerMove)} {playerMove.toUpperCase()}
                  </div>
                )}
              </div>
            )}

            {gamePhase === "revealing" && (
              <div className="text-center space-y-6">
                <div className="animate-pulse text-white text-xl">Waiting for opponent's move to be revealed...</div>
                <div className="flex justify-center items-center space-x-16">
                  <div className="text-center">
                    <div className="w-56 h-56 bg-gradient-to-br from-red-900/40 to-red-600/40 rounded-full flex items-center justify-center border-4 border-red-500 mb-6 shadow-2xl pulse-red">
                      <img
                        src={getMoveGif(playerMove, true) || "/placeholder.svg"}
                        alt="Your move"
                        className="w-40 h-40"
                      />
                    </div>
                    <div className="text-white font-bold text-2xl">You</div>
                  </div>
                  <div className="text-center">
                    <div className="text-8xl text-red-400 font-bold animate-pulse">VS</div>
                  </div>
                  <div className="text-center">
                    <div className="w-56 h-56 bg-gradient-to-br from-red-900/40 to-red-600/40 rounded-full flex items-center justify-center border-4 border-red-500 mb-6 shadow-2xl pulse-red">
                      <div className="text-8xl animate-spin">❓</div>
                    </div>
                    <div className="text-white font-bold text-2xl">Opponent</div>
                  </div>
                </div>
              </div>
            )}

            {gamePhase === "finished" && (
              <div className="text-center space-y-4">
                {/* Main Outcome Animation */}

                {/* Game Result Info */}
                <div className="space-y-4">
                  <div className="text-4xl font-bold text-white">{getResultMessage()}</div>
                  <div className="text-2xl text-yellow-400 font-bold">Winnings: {getWinnings()} </div>
                  {winner === "player" && (
                    <div className="text-sm text-gray-300 mb-2">
                      (1% fee: {(Number.parseFloat(game.bet) * 0.01).toFixed(2)} earnings goes to tournament pool)
                    </div>
                  )}

                  {/* Rematch Button - Positioned directly under fee text */}
                  <div className="pt-1">
                    <Button
                      onClick={handleRematchRequest}
                      disabled={isWaitingForRematch || rematchRequested}
                      className="bg-green-600 hover:bg-green-700 text-lg px-8 py-3 shadow-lg"
                    >
                      {isWaitingForRematch ? "Waiting for opponent..." : "Rematch"}
                    </Button>
                  </div>
                </div>

                {/* Rematch Status */}
                {isWaitingForRematch && (
                  <div className="text-center">
                    <div className="animate-pulse text-blue-400 text-lg">
                      Rematch request sent! Waiting for opponent's response...
                    </div>
                    <div className="text-gray-300 text-sm mt-2">Bet amount: {game.bet} </div>
                  </div>
                )}
              </div>
            )}

            {/* Rematch Popup */}
            {showRematchPopup && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                <Card className="bg-white/10 backdrop-blur-md border-white/20 max-w-md mx-4">
                  <CardHeader className="text-center">
                    <CardTitle className="text-white">Rematch Request</CardTitle>
                    <CardDescription className="text-gray-300">Your opponent wants a rematch!</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center">
                      <div className="text-white text-lg">
                        Bet Amount: <span className="font-bold text-yellow-400">{game.bet} </span>
                      </div>
                    </div>
                    <div className="flex space-x-4">
                      <Button
                        onClick={() => handleRematchResponse(true)}
                        className="flex-1 bg-green-600 hover:bg-green-700"
                      >
                        Accept
                      </Button>
                      <Button
                        onClick={() => handleRematchResponse(false)}
                        variant="outline"
                        className="flex-1 border-red-500/40 text-red-400 hover:bg-red-500/10"
                      >
                        Decline
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
