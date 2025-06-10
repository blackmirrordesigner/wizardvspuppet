export interface CoinInfo {
  symbol: string
  name: string
  balance: string
  icon?: string
}

export const COIN_ICONS: Record<string, string> = {
  LORDS: "/images/coins/lords.png",
  ETH: "/images/coins/eth.svg",
  STRK: "/images/coins/strk.png",
  USDC: "/images/coins/usdc.png",
  BTC: "/images/coins/btc.svg",
  USDT: "/images/coins/usdt.svg",
  BNB: "/images/coins/bnb.svg",
  SOL: "/images/coins/sol.svg",
  ADA: "/images/coins/ada.svg",
  AVAX: "/images/coins/avax.svg",
  DOT: "/images/coins/dot.svg",
  MATIC: "/images/coins/matic.svg",
  LINK: "/images/coins/link.svg",
  UNI: "/images/coins/uni.svg",
  ATOM: "/images/coins/atom.svg",
  XRP: "/images/coins/xrp.svg",
  LTC: "/images/coins/ltc.svg",
  NEAR: "/images/coins/near.svg",
  FTM: "/images/coins/ftm.svg",
  ALGO: "/images/coins/algo.svg",
  DASH: "/images/coins/dash.svg",
  ZEC: "/images/coins/zec.svg",
  XMR: "/images/coins/xmr.svg",
  AION: "/images/coins/aion.svg",
}

export function getCoinIcon(symbol: string): string {
  return COIN_ICONS[symbol.toUpperCase()] || "/placeholder.svg?height=26&width=26&text=" + symbol
}

// Create a non-JSX version that just returns the string
export function getCoinIconSrc(symbol: string): string {
  return getCoinIcon(symbol) || "/placeholder.svg?height=20&width=20&text=" + symbol
}
