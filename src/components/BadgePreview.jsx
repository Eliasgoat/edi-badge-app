import { useEffect, useRef } from "react";

// Live Badge preview that updates according to what is field in the form.

// Image used in case user doesn't provide one
const DEFAULT_IMAGE = "https://picsum.photos/seed/edi/200";


export default function BadgePreview({ formData, canvasRef }) {
  // Ref for the 3D tilt effect
  const wrapperRef = useRef(null);

  // 3D tilt effect
  useEffect(() => {
    const wrapper = wrapperRef.current;
    const inner = wrapper.querySelector(".canvas-inner");

    function handleMouseMove(e) {
      const rect = wrapper.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      inner.style.transform = `rotateY(${x * 20}deg) rotateX(${-y * 20}deg)`;
    }

    function handleMouseLeave() {
      inner.style.transform = "rotateY(0deg) rotateX(0deg)";
    }

    wrapper.addEventListener("mousemove", handleMouseMove);
    wrapper.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      wrapper.removeEventListener("mousemove", handleMouseMove);
      wrapper.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawBadge = (profileImg = null) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#030a06";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid pattern
      ctx.strokeStyle = "rgba(0, 255, 136, 0.04)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // Outer border
      ctx.strokeStyle = "rgba(0, 255, 136, 0.3)";
      ctx.lineWidth = 1;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Corner brackets - top left
      ctx.strokeStyle = "#00ff88";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 40); ctx.lineTo(10, 10); ctx.lineTo(40, 10);
      ctx.stroke();

      // Corner brackets - top right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 40, 10); ctx.lineTo(canvas.width - 10, 10); ctx.lineTo(canvas.width - 10, 40);
      ctx.stroke();

      // Corner brackets - bottom left
      ctx.beginPath();
      ctx.moveTo(10, canvas.height - 40); ctx.lineTo(10, canvas.height - 10); ctx.lineTo(40, canvas.height - 10);
      ctx.stroke();

      // Corner brackets - bottom right
      ctx.beginPath();
      ctx.moveTo(canvas.width - 40, canvas.height - 10); ctx.lineTo(canvas.width - 10, canvas.height - 10); ctx.lineTo(canvas.width - 10, canvas.height - 40);
      ctx.stroke();

      // Top label
      ctx.fillStyle = "#00ff88";
      ctx.font = "bold 11px 'Share Tech Mono', monospace";
      ctx.letterSpacing = "3px";
      ctx.fillText("EDI // CHALLENGE BADGE", 30, 35);

      // Divider
      ctx.strokeStyle = "rgba(0, 255, 136, 0.2)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, 45);
      ctx.lineTo(canvas.width - 30, 45);
      ctx.stroke();

      // Name
      ctx.fillStyle = "#c8f0d8";
      ctx.font = "bold 26px 'Rajdhani', sans-serif";
      const displayName = `${formData.firstName || "Jane"} ${formData.lastName || "Doe"}`;
      const nameColor = formData.firstName && formData.lastName ? "#c8f0d8" : "#2a5a3a";
      ctx.fillStyle = nameColor;
      ctx.fillText(displayName, 30, 85);

      // Visa Type label + value
      ctx.fillStyle = "#4a7a5a";
      ctx.font = "10px 'Share Tech Mono', monospace";
      ctx.fillText("VISA TYPE", 30, 115);
      ctx.fillStyle = formData.visaType ? "#c8f0d8" : "#2a5a3a";
      ctx.font = "14px 'Rajdhani', sans-serif";
      ctx.fillText(formData.visaType || "e.g. EDI Challenge", 30, 132);

      // Main Project label + value
      ctx.fillStyle = "#4a7a5a";
      ctx.font = "10px 'Share Tech Mono', monospace";
      ctx.fillText("MAIN PROJECT", 200, 115);
      ctx.fillStyle = formData.mainProject ? "#c8f0d8" : "#2a5a3a";
      ctx.font = "14px 'Rajdhani', sans-serif";
      ctx.fillText(formData.mainProject || "e.g. EDI Internship", 200, 132);

      // Date of Arrival label + value
      ctx.fillStyle = "#4a7a5a";
      ctx.font = "10px 'Share Tech Mono', monospace";
      ctx.fillText("DATE OF ARRIVAL", 30, 162);
      ctx.fillStyle = formData.dateOfArrival ? "#00ff88" : "#2a5a3a";
      ctx.font = "13px 'Share Tech Mono', monospace";
      ctx.fillText(formData.dateOfArrival || "NOT SET", 30, 178);

      // Date of Leaving label + value
      ctx.fillStyle = "#4a7a5a";
      ctx.font = "10px 'Share Tech Mono', monospace";
      ctx.fillText("DATE OF LEAVING", 200, 162);
      ctx.fillStyle = formData.dateOfLeaving ? "#00ff88" : "#2a5a3a";
      ctx.font = "13px 'Share Tech Mono', monospace";
      ctx.fillText(formData.dateOfLeaving || "NOT SET", 200, 178);

      // Divider before footer
      ctx.strokeStyle = "rgba(0, 255, 136, 0.15)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, canvas.height - 35);
      ctx.lineTo(canvas.width - 30, canvas.height - 35);
      ctx.stroke();

      // Footer
      ctx.fillStyle = "#4a7a5a";
      ctx.font = "10px 'Share Tech Mono', monospace";
      ctx.fillText("CHAIN: POLYGON AMOY TESTNET", 30, canvas.height - 18);
      ctx.fillStyle = "#00ff88";
      ctx.fillText("● READY", canvas.width - 80, canvas.height - 18);

      // Profile image
      if (profileImg) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(canvas.width - 155, 55, 115, 115);
        ctx.clip();
        ctx.drawImage(profileImg, canvas.width - 155, 55, 115, 115);
        ctx.restore();
        // Image border
        ctx.strokeStyle = "rgba(0, 255, 136, 0.4)";
        ctx.lineWidth = 1;
        ctx.strokeRect(canvas.width - 155, 55, 115, 115);
      }
    };

    // Always load an image — user's or default or null incase of error input
    const imgSrc = formData.imageLink || DEFAULT_IMAGE;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => drawBadge(img);
    img.onerror = () => drawBadge(null); // if image fails, draw without it

  }, [formData, canvasRef]);

  return (
    <div className="preview-container">
      <div className="preview-title">Badge Preview</div>
      <div className="canvas-wrapper" ref={wrapperRef}>
        <div className="canvas-inner">
          <canvas
            ref={canvasRef}
            width={500}
            height={300}
          />
        </div>
      </div>
    </div>
  );
}