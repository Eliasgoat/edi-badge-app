import { useState, useRef } from "react";
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
  const canvasRef = useRef(null);

  function handleChange(e) {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  return (
    <div className="app">
      <h1>EDI Badge Minter</h1>
      <div className="layout">
        <BadgeForm formData={formData} onChange={handleChange} />
        <div className="preview-section">
          <BadgePreview formData={formData} canvasRef={canvasRef} />
          <MintButton formData={formData} canvasRef={canvasRef} />
        </div>
      </div>
    </div>
  );
}