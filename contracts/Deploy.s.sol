// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "./GlitchLeaderboard.sol";
import "./GlitchWinnerNFT.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // 1. Deploy Leaderboard
        GlitchLeaderboard leaderboard = new GlitchLeaderboard();
        console.log("Leaderboard deployed at:", address(leaderboard));

        // 2. Deploy NFT
        GlitchWinnerNFT nft = new GlitchWinnerNFT();
        console.log("NFT deployed at:", address(nft));

        vm.stopBroadcast();
    }
}
