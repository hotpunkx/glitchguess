// Deployed on Base Mainnet — update address after contract deploy
export const LEADERBOARD_ADDRESS = '0x0000000000000000000000000000000000000000' as `0x${string}`; // TO BE UPDATED POST-DEPLOY

export const leaderboardAbi = [
  {
    type: 'function',
    name: 'submitScore',
    inputs: [
      { name: 'questionsUsed', type: 'uint256' },
      { name: 'gameMode', type: 'string' },
      { name: 'category', type: 'string' },
    ],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getTopScores',
    inputs: [{ name: 'limit', type: 'uint256' }],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'player', type: 'address' },
          { name: 'questionsUsed', type: 'uint256' },
          { name: 'gameMode', type: 'string' },
          { name: 'category', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'totalScores',
    inputs: [],
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'ScoreSubmitted',
    inputs: [
      { name: 'player', type: 'address', indexed: true },
      { name: 'questionsUsed', type: 'uint256', indexed: false },
      { name: 'gameMode', type: 'string', indexed: false },
      { name: 'category', type: 'string', indexed: false },
    ],
  },
] as const;

// Base Mainnet chain ID
export const BASE_CHAIN_ID = 8453;

// Basescan base URL for tx links
export const BASESCAN_URL = 'https://basescan.org';
