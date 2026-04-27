// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Base64.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

/**
 * @title GlitchWinnerNFT
 * @notice An on-chain NFT awarded to winners of The Glitch trivia game on Base.
 * @dev Metadata is generated entirely on-chain as a Base64 encoded JSON/SVG.
 */
contract GlitchWinnerNFT is ERC721, ERC721URIStorage, Ownable {
    using Strings for uint256;

    uint256 private _nextTokenId;
    
    struct WinnerData {
        uint256 questionsUsed;
        string category;
        uint256 timestamp;
    }

    mapping(uint256 => WinnerData) public tokenData;

    constructor() ERC721("The Glitch Winner", "GLITCH") Ownable(msg.sender) {}

    /**
     * @notice Mint a victory NFT.
     * @param to The player's address.
     * @param questionsUsed How many questions they used to win.
     * @param category The game category.
     */
    function safeMint(address to, uint256 questionsUsed, string memory category) public {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        
        tokenData[tokenId] = WinnerData({
            questionsUsed: questionsUsed,
            category: category,
            timestamp: block.timestamp
        });

        _setTokenURI(tokenId, _generateOnChainMetadata(tokenId));
    }

    /**
     * @dev Generates the Base64 encoded metadata string.
     */
    function _generateOnChainMetadata(uint256 tokenId) internal view returns (string memory) {
        WinnerData memory data = tokenData[tokenId];
        
        string memory svg = string(abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            '<style>.base { fill: #bef264; font-family: "Courier New", monospace; font-size: 24px; font-weight: bold; }</style>',
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">THE GLITCH</text>',
            '<text x="50%" y="55%" class="base" font-size="14" dominant-baseline="middle" text-anchor="middle">CATEGORY: ', data.category, '</text>',
            '<text x="50%" y="65%" class="base" font-size="14" dominant-baseline="middle" text-anchor="middle">QUESTIONS: ', data.questionsUsed.toString(), '/20</text>',
            '<rect x="20" y="300" width="310" height="10" fill="#bef264" />',
            '</svg>'
        ));

        string memory json = Base64.encode(bytes(string(abi.encodePacked(
            '{"name": "Glitch Victory #', tokenId.toString(), '",',
            '"description": "A proof of victory in The Glitch trivia game on Base.",',
            '"attributes": [',
                '{"trait_type": "Category", "value": "', data.category, '"},',
                '{"trait_type": "Questions Used", "value": ', data.questionsUsed.toString(), '}',
            '],',
            '"image": "data:image/svg+xml;base64,', Base64.encode(bytes(svg)), '"}'
        ))));

        return string(abi.encodePacked("data:application/json;base64,", json));
    }

    // Required overrides
    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721, ERC721URIStorage) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
