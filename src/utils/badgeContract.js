// Contract address and ABI for the badge contract
export const CONTRACT_ADDRESS = "0xe655B62fAD873fD9D4312FBcDB305ca52250509B";
export const ABI = [
  // Mints a new badge NFT to the recipient
  "function mintBadge(address to, string memory tokenURI) public returns (uint256)",
  // Returns the current token ID (number of badges minted)
  "function currentTokenId() public view returns (uint256)"
];
