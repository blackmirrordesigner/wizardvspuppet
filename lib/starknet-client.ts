// Starknet client for Wizard vs Puppet game
export const starknetClient = {
  async connectWallet() {
    // Simulate wallet connection
    await new Promise((resolve) => setTimeout(resolve, 1000))
    return {
      address: "0x07394cbe418daa16e42b87ba67372d4ab4a5df0b05c6e554d158458ce245bc10",
      publicKey: "0x1234567890abcdef",
    }
  },

  async getBalance(address: string) {
    // Simulate balance retrieval
    await new Promise((resolve) => setTimeout(resolve, 500))
    return "125.8"
  },

  async submitTransaction(payload: any, senderAddress: string) {
    // Simulate Starknet transaction
    await new Promise((resolve) => setTimeout(resolve, 2000))
    return `0x${Math.random().toString(16).substring(2, 66)}`
  },

  async createGame(betAmount: number, faction: "wizard" | "puppet") {
    return this.submitTransaction({ type: "create_game", bet: betAmount, faction }, "")
  },

  async joinGame(gameId: string, faction: "wizard" | "puppet") {
    return this.submitTransaction({ type: "join_game", gameId, faction }, "")
  },

  generateMoveHash(move: number, nonce: string) {
    // Simple hash simulation for commit-reveal scheme
    return Math.abs(move * nonce.length).toString(16)
  },

  generateNonce() {
    return Math.random().toString(36).substring(2, 15)
  },
}
