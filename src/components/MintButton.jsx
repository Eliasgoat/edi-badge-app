import { useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, ABI } from "../utils/badgeContract";
import { uploadCanvasToPinata, uploadMetadataToPinata } from "../utils/ipfs";

// Mintbutton component handles the minting process when the user clicks the "Mint Badge" button. It connects to MetaMask, uploads the badge image and metadata to IPFS (Pinata), and interacts with the smart contract to mint the NFT. It also provides feedback on the minting status and displays a link to view the transaction on PolygonScan once minted.
export default function MintButton({ formData, canvasRef }) {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [tokenId, setTokenId] = useState(null);

  async function handleMint() {
    try {
      if (
        !formData.firstName ||
        !formData.lastName ||
        !formData.visaType ||
        !formData.dateOfArrival ||
        !formData.dateOfLeaving ||
        !formData.mainProject ||
        !formData.recipientWallet
      ) {
        setStatus("Please fill in all required fields before minting.");
        return;
      }

      //This makes sure only allowed wallets can mint. For now, it's only me (Elias) and the examiner (Raphael)
      const ALLOWED_WALLETS = [
        "0x8D4fb4B7cbb0d8e8E225eAA6cCe7C5aBB6030c5c",
        "0x0c4869fd5A92ed96Aef6EFAeFCfdC1BEe931B67F"
      ];

      // Validate recipient wallet
      if (!ALLOWED_WALLETS.map(w => w.toLowerCase()).includes(formData.recipientWallet.toLowerCase())) {
        setStatus("Recipient wallet is not authorized to receive this badge.");
        return;
      }

      setLoading(true);
      setStatus("Connecting to MetaMask...");

      // Connect to MetaMask
      if (!window.ethereum) {
        setStatus("MetaMask not found. Please install it.");
        return;
      }

      await window.ethereum.request({ method: "eth_requestAccounts" });
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      // Validate minter wallet
      if (!ALLOWED_WALLETS.map(w => w.toLowerCase()).includes(signerAddress.toLowerCase())) {
        setStatus("Your wallet is not authorized to mint this badge.");
        setLoading(false);
        return;
      }

      // Check correct network (Polygon Amoy = 80002)
      const network = await provider.getNetwork();
      if (network.chainId !== 80002n) {
        setStatus("Please switch MetaMask to Polygon Amoy Testnet.");
        setLoading(false);
        return;
      }

      // Upload canvas image to IPFS (Pinata)
      setStatus("Uploading badge image to IPFS...");
      const canvas = canvasRef.current;
      const imageUrl = await uploadCanvasToPinata(canvas);

      // Upload metadata to IPFS (Pinata)
      setStatus("Uploading metadata to IPFS...");
      const metadataUrl = await uploadMetadataToPinata(formData, imageUrl);

      // Mint the NFT (calls mintBadge on the deployed Solidity smart contract via ethers.js bridge between react and blockchain)
      setStatus("Minting badge — confirm in MetaMask...");
      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
      const tx = await contract.mintBadge(formData.recipientWallet, metadataUrl, {
        maxPriorityFeePerGas: ethers.parseUnits("30", "gwei"),
        maxFeePerGas: ethers.parseUnits("50", "gwei"),
      });

      setStatus("Waiting for transaction confirmation...");
      const receipt = await tx.wait();
      setTxHash(receipt.hash);

      // Get token ID
      const id = await contract.currentTokenId();
      setTokenId((Number(id) - 1).toString());

      setStatus("success");

    } catch (err) {
      console.error(err);
      if (err.code === "ACTION_REJECTED") {
        setStatus("Transaction rejected — you cancelled the MetaMask request.");
      } else {
        setStatus("Error: an unexpected error occurred. Please inspect the console for details.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mint-container">
      <button
        onClick={handleMint}
        disabled={loading}
        className="mint-button"
      >
        {loading ? "Minting..." : "Mint Badge"}
      </button>

      {status === "success" ? (
        <div className="success">
          <p>Badge minted successfully!</p>
          <p>Token ID: <strong>#{tokenId}</strong></p>
          <a
            href={`https://amoy.polygonscan.com/tx/${txHash}`}
            target="_blank"
            rel="noreferrer"
           >
            View on PolygonScan →
          </a>
        </div>
      ) : (
        status && <p className="status">{status}</p>
      )}
    </div>
  );
}