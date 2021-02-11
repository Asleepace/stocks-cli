const { time } = require('console')
const yahooStockPrices = require('yahoo-stock-prices')

const INTERVAL = 60000
const PADDING = 20

let previousPrice = 0
let percetnChange = 0

const positions = [
  { ticker: 'ACB', amount: 3121 },
  { ticker: 'OTLK', amount: 1111 },
  { ticker: 'CGC', amount: 26.50 },
  { ticker: 'GSAT', amount: 16 },
  { ticker: 'TLRY', amount: 48.15 },
]

const table = []

async function main() {
  try {
    const stocks = await Promise.all(positions.map(format))
    output(stocks)
  } catch (error) {
    console.warn(`[error]: ${error.message}`)
  }
}

const format = async (position) => {
  try {
    const data = await yahooStockPrices.getCurrentData(position.ticker)
    return ({ ...data, ...position, value: position.amount * data.price })
  } catch (error) {
    console.warn(error.message)
  }
}

const bold = (string) => "\033[1m" + string + "\033[0m"

const output = (stocks) => {
  const totalValue = stocks.reduce((amount, stock) => amount + stock.value, 0)
  stocks = stocks.map(stock => {
    stock.value = formatPrice(stock.value)
    return stock
  })

  // Calculate the items
  const difference = totalValue - previousPrice
  const percentage = ((difference / totalValue) * 100.0).toFixed(2)

  // Format colors
  const diffPlus = difference >= 0
  const percPlus = percentage >= 0

  const diffColor = diffPlus ? colors.fg.green : colors.fg.red
  const percColor = percPlus ? colors.fg.green : colors.fg.red

  const date = `${Date()}`.split("GMT")[0]

  const timestamp = `${colors.fg.white}[${date.trim()}]${colors.reset}`
  const formatedTotal = bold(formatPrice(totalValue)).padEnd(PADDING, ' ')
  const formatedChange = `${diffColor}${diffPlus ? "+" : ""}${formatPrice(difference)}${colors.reset}`.padEnd(PADDING, ' ')
  const formatedPercent = `${percColor}${percPlus ? "+" : ""}${percentage}%${colors.reset}${colors.reset}`.padEnd(PADDING, ' ')
  console.log(`\n${timestamp}:  ${formatedTotal} ${formatedPercent} ${formatedChange}\n`)
  console.table(stocks.map(addPadding))
  previousPrice = totalValue
}

const formatPrice = (amount) => amount.toLocaleString('en-US', {
  style: 'currency',
  currency: 'USD',
})

const printStock = (stock) => {
  console.log(`[${stock.ticker}] ${formatPrice(stock.value)}`)
}

const addPadding = (stock) => {
  for (let key in stock) {
    if (key === 'currency') continue
    const value = String(stock[key])
    stock[key] = value.padEnd(6, ' ')
  }
  return stock
}

// MAIN
console.clear()
main()
setInterval(main, INTERVAL)

const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  underscore: "\x1b[4m",
  blink: "\x1b[5m",
  reverse: "\x1b[7m",
  hidden: "\x1b[8m",
  fg: {
    black: "\x1b[30m",
    red: "\x1b[31m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    blue: "\x1b[34m",
    magenta: "\x1b[35m",
    cyan: "\x1b[36m",
    white: "\x1b[37m",
    crimson: "\x1b[38m" // Scarlet
  },
  bg: {
    black: "\x1b[40m",
    red: "\x1b[41m",
    green: "\x1b[42m",
    yellow: "\x1b[43m",
    blue: "\x1b[44m",
    magenta: "\x1b[45m",
    cyan: "\x1b[46m",
    white: "\x1b[47m",
    crimson: "\x1b[48m"
  }
};