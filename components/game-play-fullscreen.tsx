"use client"

import { useState, useEffect } from "react"
import { Clock } from "lucide-react"
import { OrientationGuard } from "./orientation-guard"
import { getCoinIcon } from "@/lib/coin-utils"

interface GamePlayFullscreenProps {
  game: any
  onGameEnd: () => void
  userAddress: string
}

type Move = "rock" | "paper" | "fire" | null

export function GamePlayFullscreen({ game, onGameEnd, userAddress }: GamePlayFullscreenProps) {
  const [playerMove, setPlayerMove] = useState<Move>(null)
  const [opponentMove, setOpponentMove] = useState<Move>(null)
  const [timeLeft, setTimeLeft] = useState(30)
  const [gamePhase, setGamePhase] = useState<"playing" | "revealing" | "finished">("playing")
  const [winner, setWinner] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isRequestingRematch, setIsRequestingRematch] = useState(false)
  const [rematchAccepted, setRematchAccepted] = useState(false)

  useEffect(() => {
    if (gamePhase === "playing" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && gamePhase === "playing") {
      if (!playerMove) {
        const moves: Move[] = ["rock", "paper", "fire"]
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
      await new Promise((resolve) => setTimeout(resolve, 2000))

      const opponentMoves: Move[] = ["rock", "paper", "fire"]
      const opponentChoice = opponentMoves[Math.floor(Math.random() * opponentMoves.length)]

      setOpponentMove(opponentChoice)
      setGamePhase("revealing")

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
      rock: "fire",
      paper: "rock",
      fire: "paper",
    }

    return winConditions[p1Move] === p2Move ? "player" : "opponent"
  }

  const getMoveImage = (move: Move, size = "w-12 h-12") => {
    if (!move) return <div className={`${size} flex items-center justify-center text-4xl`}>❓</div>

    const imageSrc = {
      rock: "/images/rock.png",
      paper: "/images/paper.png",
      fire: "/images/fire.png",
    }

    return <img src={imageSrc[move] || "/placeholder.svg"} alt={move} className={`${size} object-contain`} />
  }

  const getResultMessage = () => {
    if (winner === "player") return "Victory! 🎉"
    if (winner === "opponent") return "Defeat 😔"
    if (winner === "tie") return "Draw! 🤝"
    return ""
  }

  const handlePlayAgain = () => {
    setIsRequestingRematch(true)

    // Simulate waiting for opponent's decision
    setTimeout(() => {
      // 70% chance opponent accepts rematch
      const opponentAccepts = Math.random() > 0.3

      if (opponentAccepts) {
        setRematchAccepted(true)

        // Reset game state for a new round
        setTimeout(() => {
          setPlayerMove(null)
          setOpponentMove(null)
          setTimeLeft(30)
          setGamePhase("playing")
          setWinner(null)
          setIsSubmitting(false)
          setIsRequestingRematch(false)
          setRematchAccepted(false)
        }, 1500)
      } else {
        // Opponent declined
        setIsRequestingRematch(false)
        alert("Opponent declined the rematch")
      }
    }, 3000)
  }

  return (
    <OrientationGuard>
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url(/images/background-game-1.png)" }}
      >
        {/* Header */}
        <div className="absolute top-0 left-0 right-0 z-10 p-6">
          <div className="flex items-center justify-between">
            {/* Left - Wizard Info */}
            <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-blue-400/20">
              <img src="/images/wizard.png" alt="Wizard" className="w-12 h-12" />
              <div className="text-white font-body">
                <div className="font-bold">Odi.brother</div>
                <div className="text-sm text-gray-300 flex items-center">
                  <img src="/images/starknet-logo.svg" alt="Starknet" className="w-4 h-4 mr-1" />
                  Starknet
                </div>
                <div className="text-xs text-blue-400 font-mono">
                  {userAddress.slice(0, 6)}...{userAddress.slice(-4)}
                </div>
              </div>
            </div>

            {/* Right - Puppet Info */}
            <div className="flex items-center space-x-4 bg-black/30 backdrop-blur-sm rounded-lg px-4 py-3 border border-orange-400/20">
              <div className="text-white font-body text-right">
                <div className="font-bold">Opponent</div>
                <div className="text-sm text-gray-300 flex items-center justify-end">
                  <img src="/images/starknet-logo.svg" alt="Starknet" className="w-4 h-4 mr-1" />
                  Starknet
                </div>
                <div className="text-xs text-orange-400 font-mono">
                  {game.player1 === userAddress
                    ? `${game.player2?.slice(0, 6)}...${game.player2?.slice(-4)}`
                    : `${game.player1?.slice(0, 6)}...${game.player1?.slice(-4)}`}
                </div>
              </div>
              <img src="/images/puppet.png" alt="Puppet" className="w-12 h-12" />
            </div>
          </div>
        </div>

        {/* Game Actions */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Center Characters */}
          <div className="relative mr-12 mt-[60px]">
            <img src="/images/wizard.png" alt="Wizard" className="w-[300px] h-[300px] object-contain drop-shadow-2xl" />
          </div>

          {/* VS Text or Timer */}
          <div className="relative z-10 mx-8 mt-[50px]">
            {gamePhase === "finished" ? (
              <div className="text-4xl text-white font-heading"></div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                {/* Player moves display above timer */}
                <div className="flex items-center space-x-8">
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      {playerMove ? (
                        getMoveImage(playerMove, "w-12 h-12")
                      ) : (
                        <div className="w-12 h-12 flex items-center justify-center text-2xl">❓</div>
                      )}
                    </div>
                    <div className="text-blue-400 text-sm font-body">You</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">
                      <div className="w-12 h-12 flex items-center justify-center text-2xl">❓</div>
                    </div>
                    <div className="text-orange-400 text-sm font-body">Opponent</div>
                  </div>
                </div>

                {/* Timer */}
                <div className="relative w-32 h-32 -translate-y-[200px]">
                  {/* Background circle */}
                  <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255, 255, 255, 0.2)"
                      strokeWidth="8"
                      fill="transparent"
                    />
                    {/* Progress circle that shrinks with time - starts from top */}
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      stroke="rgba(255, 255, 255, 0.8)"
                      strokeWidth="8"
                      fill="transparent"
                      strokeDasharray={`${2 * Math.PI * 45}`}
                      strokeDashoffset={`${2 * Math.PI * 45 * (1 - timeLeft / 30)}`}
                      className="transition-all duration-1000 ease-linear"
                      strokeLinecap="round"
                    />
                  </svg>
                  {/* Timer text in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <Clock className="w-6 h-6 text-white mx-auto mb-2" />
                      <span className="text-2xl font-bold text-white font-body">{timeLeft}s</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Puppet Character */}
          <div className="relative ml-12 mt-[60px]">
            <img src="/images/puppet.png" alt="Puppet" className="w-[300px] h-[300px] object-contain drop-shadow-2xl" />
            {gamePhase === "playing" && (
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 text-4xl animate-pulse">❓</div>
            )}
          </div>
        </div>

        {/* Game Move Buttons */}
        {gamePhase === "playing" && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <div className="grid grid-cols-3 gap-8">
              {(["rock", "paper", "fire"] as const).map((move) => (
                <button
                  key={move}
                  onClick={() => submitMove(move)}
                  disabled={isSubmitting || playerMove !== null}
                  className="btn-move w-24 h-24 flex flex-col items-center justify-center"
                >
                  <div className="text-center">
                    <div className="mb-1 flex justify-center">{getMoveImage(move, "w-8 h-8")}</div>
                    <div className="text-black text-xs font-medium capitalize font-body">{move}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {gamePhase === "finished" ? (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
            <div className="text-center">
              <div className="px-12 py-8 -translate-y-[150px]">
                <div className="text-4xl font-bold text-white mb-4 font-heading">{getResultMessage()}</div>
                {/* Add pot display under the result message */}
                <div className="flex items-center justify-center space-x-2 mb-6">
                  <img src={getCoinIcon("LORDS") || "/placeholder.svg"} alt="LORDS" className="w-6 h-6" />
                  <div className="text-yellow-400 text-xl font-bold font-body">POT: {Number(game.bet) * 2} LORDS</div>
                </div>
                <div className="flex items-center justify-center space-x-8 mb-6">
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">{getMoveImage(playerMove, "w-20 h-20")}</div>
                    <div className="text-blue-400 font-bold font-body">{playerMove?.toUpperCase()}</div>
                  </div>
                  <div className="text-center">
                    <div className="mb-2 flex justify-center">{getMoveImage(opponentMove, "w-20 h-20")}</div>
                    <div className="text-orange-400 font-bold font-body">{opponentMove?.toUpperCase()}</div>
                  </div>
                </div>
                <div className="flex flex-col items-center space-y-4">
                  <button
                    onClick={handlePlayAgain}
                    disabled={isRequestingRematch}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
                  >
                    {isRequestingRematch
                      ? rematchAccepted
                        ? "Starting New Game..."
                        : "Waiting for Opponent..."
                      : "Play Again"}
                  </button>
                  <button onClick={onGameEnd} className="btn-secondary px-8 py-3">
                    Return to Lobby
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {gamePhase === "revealing" && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 translate-y-40">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl px-8 py-6 border border-white/20">
              <div className="animate-pulse text-white text-2xl font-bold mb-4 font-heading">Revealing Moves...</div>
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="mb-2 flex justify-center">{getMoveImage(playerMove, "w-16 h-16")}</div>
                  <div className="text-blue-400 font-body">Wizard</div>
                </div>
                <div className="text-4xl text-white animate-pulse font-heading">VS</div>
                <div className="text-center">
                  <div className="text-4xl mb-2 animate-spin flex justify-center">❓</div>
                  <div className="text-orange-400 font-body">Puppet</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </OrientationGuard>
  )
}
