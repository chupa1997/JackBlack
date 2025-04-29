// script.js

// Card deck and game variables
const suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades']
const values = [
  'Ace',
  '2',
  '3',
  '4',
  '5',
  '6',
  '7',
  '8',
  '9',
  '10',
  'Jack',
  'Queen',
  'King'
]
let deck = []
let playerHand = []
let dealerHand = []
let gameOver = false
let playerWon = false

// Create a deck of cards
function createDeck() {
  deck = []
  for (let suit of suits) {
    for (let value of values) {
      deck.push({ suit, value })
    }
  }
}

// Shuffle the deck
function shuffleDeck() {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]] // Fixed misplaced semicolon
  }
}

// Get the numeric value of a card
function getCardValue(card) {
  if (card.value === 'Ace') return 11
  if (['Jack', 'Queen', 'King'].includes(card.value)) return 10
  return parseInt(card.value)
}

// Calculate the hand value
function calculateHandValue(hand) {
  let value = 0
  let aceCount = 0

  for (let card of hand) {
    value += getCardValue(card)
    if (card.value === 'Ace') aceCount++
  }

  while (value > 21 && aceCount > 0) {
    value -= 10
    aceCount--
  }

  return value
}

// Deal a card
function dealCard(hand) {
  if (deck.length === 0) {
    console.error('The deck is empty. Cannot deal more cards.')
    return // Prevent dealing from an empty deck
  }
  hand.push(deck.pop())
}

// Start a new game
function startGame() {
  createDeck()
  shuffleDeck()
  playerHand = []
  dealerHand = []
  gameOver = false
  playerWon = false

  dealCard(playerHand)
  dealCard(dealerHand)
  dealCard(playerHand)
  dealCard(dealerHand)

  updateGameState()
}

// Update the game state
function updateGameState() {
  const playerValue = calculateHandValue(playerHand)
  const dealerValue = calculateHandValue(dealerHand)

  if (playerValue > 21) {
    gameOver = true
    playerWon = false
  } else if (dealerValue > 21) {
    gameOver = true
    playerWon = true
  } else if (gameOver) {
    if (playerValue > dealerValue) {
      playerWon = true
    } else if (playerValue < dealerValue) {
      playerWon = false
    } else {
      // Tie condition
      playerWon = false
    }
  }

  // Check for natural blackjack (21 with first two cards)
  if (playerHand.length === 2 && playerValue === 21) {
    gameOver = true
    playerWon = true
  } else if (dealerHand.length === 2 && dealerValue === 21) {
    gameOver = true
    playerWon = false
  }

  renderGame() // Ensure the game state is rendered after updates
}

// Player hits
function hit() {
  if (!gameOver) {
    dealCard(playerHand)
    updateGameState()
  }
}

// Player stands
function stand() {
  if (!gameOver) {
    while (calculateHandValue(dealerHand) < 17) {
      dealCard(dealerHand)
    }
    gameOver = true
    updateGameState()
  }
}

// Render the game
function renderGame() {
  const playerValue = calculateHandValue(playerHand)
  const dealerValue = calculateHandValue(dealerHand)

  const playerHandContainer = document.getElementById('player-hand')
  const dealerHandContainer = document.getElementById('dealer-hand')

  // Clear previous hands
  playerHandContainer.innerHTML = ''
  dealerHandContainer.innerHTML = ''

  // Render player hand
  playerHand.forEach((card) => {
    const img = document.createElement('img')
    img.src = `images/${card.value}_of_${card.suit}.png`
    img.alt = `${card.value} of ${card.suit}`
    img.className = 'card-image'
    playerHandContainer.appendChild(img)
  })

  // Render dealer hand
  dealerHand.forEach((card) => {
    const img = document.createElement('img')
    img.src = `images/${card.value}_of_${card.suit}.png`
    img.alt = `${card.value} of ${card.suit}`
    img.className = 'card-image'
    dealerHandContainer.appendChild(img)
  })

  // Display hand values
  document.getElementById(
    'player-value'
  ).textContent = `Player Value: ${playerValue}`
  document.getElementById(
    'dealer-value'
  ).textContent = `Dealer Value: ${dealerValue}`

  // Display game result
  if (gameOver) {
    document.getElementById('result').textContent = playerWon
      ? 'You Win!'
      : 'Dealer Wins!'
  } else {
    document.getElementById('result').textContent = 'Game in Progress...'
  }
}

// Convert hand to string
function handToString(hand) {
  return hand.map((card) => `${card.value} of ${card.suit}`).join(', ')
}

// Attach event listeners
function attachEventListeners() {
  const hitButton = document.getElementById('hit-button')
  const standButton = document.getElementById('stand-button')
  const newGameButton = document.getElementById('new-game-button')

  if (hitButton) hitButton.addEventListener('click', hit)
  if (standButton) standButton.addEventListener('click', stand)
  if (newGameButton) newGameButton.addEventListener('click', startGame)
}

// Start the game on load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    attachEventListeners()
    startGame()
  })
} else {
  attachEventListeners()
  startGame()
}
