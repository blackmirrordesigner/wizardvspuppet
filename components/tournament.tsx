"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Trophy, Users, Clock, Coins, Calendar } from "lucide-react"

interface TournamentProps {
  userAddress: string
  balance: string
}

interface Tournament {
  id: string
  name: string
  entryFee: string
  prizePool: string
  participants: number
  maxParticipants: number
  status: "upcoming" | "registration" | "active" | "finished"
  startTime: Date
  bracket: any[]
}

export function Tournament({ userAddress, balance }: TournamentProps) {
  const [tournaments, setTournaments] = useState<Tournament[]>([])
  const [isRegistering, setIsRegistering] = useState(false)
  const [selectedTournament, setSelectedTournament] = useState<string | null>(null)

  useEffect(() => {
    // Simulate tournament data
    setTournaments([
      {
        id: "weekly-1",
        name: "Wizard's Championship",
        entryFee: "1.0",
        prizePool: "47.5",
        participants: 47,
        maxParticipants: 64,
        status: "registration",
        startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        bracket: [],
      },
      {
        id: "daily-1",
        name: "Fire Tournament",
        entryFee: "0.5",
        prizePool: "15.5",
        participants: 31,
        maxParticipants: 32,
        status: "active",
        startTime: new Date(Date.now() - 60 * 60 * 1000),
        bracket: [],
      },
      {
        id: "mega-1",
        name: "Puppet Chaos Cup",
        entryFee: "5.0",
        prizePool: "320.0",
        participants: 64,
        maxParticipants: 128,
        status: "finished",
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        bracket: [],
      },
    ])
  }, [])

  const registerForTournament = async (tournamentId: string) => {
    setIsRegistering(true)
    setSelectedTournament(tournamentId)

    try {
      // Simulate smart contract interaction
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setTournaments((prev) =>
        prev.map((t) => (t.id === tournamentId ? { ...t, participants: t.participants + 1 } : t)),
      )
    } catch (error) {
      console.error("Failed to register for tournament:", error)
    } finally {
      setIsRegistering(false)
      setSelectedTournament(null)
    }
  }

  const getStatusColor = (status: Tournament["status"]) => {
    switch (status) {
      case "upcoming":
        return "bg-gray-500/20 text-gray-400"
      case "registration":
        return "bg-green-500/20 text-green-400 border border-green-400"
      case "active":
        return "bg-red-500/20 text-red-400 border border-red-400"
      case "finished":
        return "bg-gray-500/20 text-gray-400 border border-gray-400"
    }
  }

  const getStatusText = (status: Tournament["status"]) => {
    switch (status) {
      case "upcoming":
        return "Upcoming"
      case "registration":
        return "Registration Open"
      case "active":
        return "In Progress"
      case "finished":
        return "Finished"
    }
  }

  const formatTimeUntil = (date: Date) => {
    const diff = date.getTime() - Date.now()
    if (diff < 0) return "Started"

    const days = Math.floor(diff / (24 * 60 * 60 * 1000))
    const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000))
    const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000))

    if (days > 0) return `${days}d ${hours}h`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Tournament Pool Info */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white flex items-center font-heading">
            <Trophy className="w-5 h-5 mr-2 text-yellow-400" />
            Wizard vs Puppet Tournaments
          </CardTitle>
          <CardDescription className="text-gray-300 font-body">
            Single-elimination tournaments with 1% of all game fees contributing to the prize pool
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-400 font-body">125.8 LORDS</div>
              <div className="text-gray-400 font-body">Total Pool</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 font-body">3</div>
              <div className="text-gray-400 font-body">Active Tournaments</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 font-body">142</div>
              <div className="text-gray-400 font-body">Total Players</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tournament List */}
      <div className="space-y-4">
        {tournaments.map((tournament) => (
          <Card
            key={tournament.id}
            className="bg-white/10 backdrop-blur-md border-white/20 border border-blue-500/20 shadow-lg hover:border-blue-500/40 transition-all duration-200"
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-white font-heading">{tournament.name}</CardTitle>
                  <CardDescription className="text-gray-300 font-body">
                    Single-elimination bracket tournament
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(tournament.status)} font-body`}>
                  {getStatusText(tournament.status)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="text-white font-bold font-body">{tournament.entryFee} LORDS</div>
                    <div className="text-gray-400 text-sm font-body">Entry Fee</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  <div>
                    <div className="text-white font-bold font-body">{tournament.prizePool} LORDS</div>
                    <div className="text-gray-400 text-sm font-body">Prize Pool</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-white font-bold font-body">
                      {tournament.participants}/{tournament.maxParticipants}
                    </div>
                    <div className="text-gray-400 text-sm font-body">Players</div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-400" />
                  <div>
                    <div className="text-white font-bold font-body">{formatTimeUntil(tournament.startTime)}</div>
                    <div className="text-gray-400 text-sm font-body">
                      {tournament.status === "active" ? "Started" : "Starts in"}
                    </div>
                  </div>
                </div>
              </div>

              <Progress value={(tournament.participants / tournament.maxParticipants) * 100} className="w-full" />

              <div className="flex items-center justify-between">
                <div className="text-gray-400 text-sm font-body">
                  <Calendar className="w-4 h-4 inline mr-1" />
                  {tournament.startTime.toLocaleDateString()} at {tournament.startTime.toLocaleTimeString()}
                </div>

                {tournament.status === "registration" && (
                  <button
                    onClick={() => registerForTournament(tournament.id)}
                    disabled={
                      isRegistering ||
                      Number.parseFloat(tournament.entryFee) > Number.parseFloat(balance) ||
                      tournament.participants >= tournament.maxParticipants
                    }
                    className="btn-success px-6 py-3"
                  >
                    {isRegistering && selectedTournament === tournament.id ? "Registering..." : "Register"}
                  </button>
                )}

                {tournament.status === "active" && (
                  <Badge className="bg-red-500/20 text-red-400 border border-red-400 font-body">
                    Round 1 in progress
                  </Badge>
                )}

                {tournament.status === "finished" && (
                  <Badge className="bg-gray-500/20 text-gray-400 border border-gray-400 font-body">
                    Winner: 0x1234...5678
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tournament Rules */}
      <Card className="bg-white/10 backdrop-blur-md border-white/20">
        <CardHeader>
          <CardTitle className="text-white font-heading">Tournament Rules</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-gray-300 font-body">
          <div>• Single-elimination format - lose once and you're out</div>
          <div>• 30-second time limit per move</div>
          <div>• Winner takes the entire prize pool</div>
          <div>• 1 LORDS entry fee for weekly tournaments</div>
          <div>• Prize pool grows from 1% of all game fees</div>
          <div>• Tournaments start when minimum players are reached</div>
          <div>• Random bracket seeding</div>
          <div>• Choose your faction: Wizard or Puppet</div>
        </CardContent>
      </Card>
    </div>
  )
}
