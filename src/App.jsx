import { useState, useRef, useEffect } from "react";
import BadgeForm from "./components/BadgeForm";
import BadgePreview from "./components/BadgePreview";
import MintButton from "./components/MintButton";
import "./App.css";

const initialFormData = {
  firstName: "",
  lastName: "",
  visaType: "",
  dateOfArrival: "",
  dateOfLeaving: "",
  mainProject: "",
  imageLink: "",
  recipientWallet: "",
};

// Main app part that merges all components together
export default function App() {
  const [formData, setFormData] = useState(initialFormData);
  const [walletAddress, setWalletAddress] = useState(null);
  const canvasRef = useRef(null);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found. Please install it.");
      return;
    }
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setWalletAddress(accounts[0]);
  }

  // Auto-detect if already connected
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts) => {
        if (accounts.length > 0) setWalletAddress(accounts[0]);
      });
    }
  }, []);

  function truncate(addr) {
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  }

  return (
    <>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-logo">EDI<span> </span>BADGE</div>
        <div className="navbar-right">
          <div className="network-badge">POLYGON AMOY</div>
          {walletAddress ? (
            <div className="wallet-address">{truncate(walletAddress)}</div>
          ) : (
            <button className="connect-btn" onClick={connectWallet}>
              Connect Wallet
            </button>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <main className="app-main">
        <div className="app-title">Badge Minting Terminal</div>
        <div className="layout">
          <BadgeForm formData={formData} onChange={handleChange} />
          <div className="preview-section">
            <BadgePreview formData={formData} canvasRef={canvasRef} />
            <MintButton formData={formData} canvasRef={canvasRef} />
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <span>EDI CHALLENGE 2026 // POLYGON AMOY TESTNET</span>
        <span><span className="footer-blink">■</span> SYSTEM ONLINE</span>
      </footer>
    </>
  );
}