// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title GlitchLeaderboard
/// @notice On-chain leaderboard for The Glitch trivia game on Base Mainnet
/// @dev Stores up to 100 most recent winning scores. Lower questionsUsed = better.
contract GlitchLeaderboard {
    struct Score {
        address player;
        uint256 questionsUsed;
        string gameMode;   // "human-thinks" or "ai-thinks"
        string category;   // "Animals", "Food", "Movies", etc.
        uint256 timestamp;
    }

    Score[] private scores;
    uint256 public constant MAX_SCORES = 100;

    event ScoreSubmitted(
        address indexed player,
        uint256 questionsUsed,
        string gameMode,
        string category
    );

    /// @notice Submit a winning score on-chain
    /// @param questionsUsed Number of questions it took to win (fewer = better)
    /// @param gameMode "human-thinks" or "ai-thinks"
    /// @param category The category played (Animals, Food, Movies, etc.)
    function submitScore(
        uint256 questionsUsed,
        string calldata gameMode,
        string calldata category
    ) external {
        require(questionsUsed > 0 && questionsUsed <= 20, "Invalid question count");
        require(bytes(gameMode).length > 0, "Game mode required");
        require(bytes(category).length > 0, "Category required");

        scores.push(Score({
            player: msg.sender,
            questionsUsed: questionsUsed,
            gameMode: gameMode,
            category: category,
            timestamp: block.timestamp
        }));

        // Keep only the last MAX_SCORES entries
        if (scores.length > MAX_SCORES) {
            for (uint256 i = 0; i < scores.length - 1; i++) {
                scores[i] = scores[i + 1];
            }
            scores.pop();
        }

        emit ScoreSubmitted(msg.sender, questionsUsed, gameMode, category);
    }

    /// @notice Returns the most recent scores, newest first
    /// @param limit How many scores to return (max 100)
    function getTopScores(uint256 limit) external view returns (Score[] memory) {
        uint256 count = scores.length < limit ? scores.length : limit;
        Score[] memory result = new Score[](count);
        for (uint256 i = 0; i < count; i++) {
            result[i] = scores[scores.length - 1 - i];
        }
        return result;
    }

    /// @notice Total number of scores ever submitted (up to MAX_SCORES stored)
    function totalScores() external view returns (uint256) {
        return scores.length;
    }
}
