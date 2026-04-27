export const LEADERBOARD_ADDRESS = '0xf9a83955165b811272a04c9040288c1bdf0afc89';
export const VICTORY_NFT_ADDRESS = '0xf9ba7e781f0065ab21380e32c2c1be2812e94da5';
export const BASESCAN_URL = 'https://basescan.org';

export const LEADERBOARD_ABI = [
  {
    "inputs": [
      { "internalType": "uint256", "name": "questionsUsed", "type": "uint256" },
      { "internalType": "string", "name": "gameMode", "type": "string" },
      { "internalType": "string", "name": "category", "type": "string" }
    ],
    "name": "submitScore",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "uint256", "name": "limit", "type": "uint256" }],
    "name": "getTopScores",
    "outputs": [
      {
        "components": [
          { "internalType": "address", "name": "player", "type": "address" },
          { "internalType": "uint256", "name": "questionsUsed", "type": "uint256" },
          { "internalType": "string", "name": "gameMode", "type": "string" },
          { "internalType": "string", "name": "category", "type": "string" },
          { "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "internalType": "struct GlitchLeaderboard.Score[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const VICTORY_NFT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "uint256", "name": "questionsUsed", "type": "uint256" },
      { "internalType": "string", "name": "category", "type": "string" }
    ],
    "name": "safeMint",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
