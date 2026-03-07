import { useEffect } from "react";

// Live Badge preview that updates according to what is field in the form.

// Image used in case user doesn't provide one
const DEFAULT_IMAGE = "https://picsum.photos/seed/edi/200";


export default function BadgePreview({ formData, canvasRef }) {
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const drawBadge = (profileImg = null) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#0f0f1a";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Border
      ctx.strokeStyle = "#6c63ff";
      ctx.lineWidth = 4;
      ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

      // Title
      ctx.fillStyle = "#6c63ff";
      ctx.font = "bold 18px Arial";
      ctx.fillText("EDI CHALLENGE BADGE", 30, 50);

      // Divider line
      ctx.strokeStyle = "#6c63ff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(30, 60);
      ctx.lineTo(canvas.width - 30, 60);
      ctx.stroke();

      // Name — use placeholder style if empty
      const displayName = `${formData.firstName || "Jane"} ${formData.lastName || "Doe"}`;
      ctx.fillStyle = formData.firstName && formData.lastName ? "#ffffff" : "#555577";
      ctx.font = "bold 28px Arial";
      ctx.fillText(displayName, 30, 100);

      // Visa Type
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "14px Arial";
      ctx.fillText("VISA TYPE", 30, 130);
      ctx.fillStyle = formData.visaType ? "#ffffff" : "#555577";
      ctx.font = "16px Arial";
      ctx.fillText(formData.visaType || "e.g. EDI Challenge", 30, 150);

      // Main Project
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "14px Arial";
      ctx.fillText("MAIN PROJECT", 200, 130);
      ctx.fillStyle = formData.mainProject ? "#ffffff" : "#555577";
      ctx.font = "16px Arial";
      ctx.fillText(formData.mainProject || "e.g. EDI Internship", 200, 150);

      // Date of Arrival
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "14px Arial";
      ctx.fillText("DATE OF ARRIVAL", 30, 180);
      ctx.fillStyle = formData.dateOfArrival ? "#ffffff" : "#555577";
      ctx.font = "16px Arial";
      ctx.fillText(formData.dateOfArrival || "Not set", 30, 200);

      // Date of Leaving
      ctx.fillStyle = "#aaaaaa";
      ctx.font = "14px Arial";
      ctx.fillText("DATE OF LEAVING", 200, 180);
      ctx.fillStyle = formData.dateOfLeaving ? "#ffffff" : "#555577";
      ctx.font = "16px Arial";
      ctx.fillText(formData.dateOfLeaving || "Not set", 200, 200);

      // Footer
      ctx.fillStyle = "#6c63ff";
      ctx.font = "12px Arial";
      ctx.fillText("Polygon Amoy Testnet • EDI Challenge 2026", 30, canvas.height - 20);

      // Profile image
      if (profileImg) {
        ctx.fillStyle = "#0f0f1a";
        ctx.fillRect(canvas.width - 160, 65, 130, 130);
        ctx.drawImage(profileImg, canvas.width - 155, 70, 120, 120);
      }
    };

    // Always load an image — user's or default
    const imgSrc = formData.imageLink || DEFAULT_IMAGE;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imgSrc;
    img.onload = () => drawBadge(img);
    img.onerror = () => drawBadge(null); // if image fails, draw without it

  }, [formData, canvasRef]);

  return (
    <div className="preview-container">
      <h2>Badge Preview</h2>
      <canvas
        ref={canvasRef}
        width={500}
        height={300}
        style={{ borderRadius: "8px" }}
      />
    </div>
  );
}