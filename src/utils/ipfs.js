// Pinata JWT token
const PINATA_JWT = import.meta.env.VITE_PINATA_JWT;

// Uploads the canvas image to Pinata and returns the image URL
export async function uploadCanvasToPinata(canvas) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      const formData = new FormData();
      formData.append("file", blob, "badge.png");

      const response = await fetch(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${PINATA_JWT}`,
          },
          body: formData,
        }
      );

      const data = await response.json();
      if (data.IpfsHash) {
        resolve(`https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`);
      } else {
        reject(new Error("Pinata upload failed"));
      }
    }, "image/png");
  });
}

// Uploads badge nft metadata to Pinata and returns the metadata URL
export async function uploadMetadataToPinata(formData, imageUrl) {
  const metadata = {
    name: `${formData.firstName} ${formData.lastName} — EDI Badge`,
    description: `EDI Challenge completion badge for ${formData.mainProject}`,
    image: imageUrl,
    attributes: [
      { trait_type: "First Name", value: formData.firstName },
      { trait_type: "Last Name", value: formData.lastName },
      { trait_type: "Visa Type", value: formData.visaType },
      { trait_type: "Date of Arrival", value: formData.dateOfArrival },
      { trait_type: "Date of Leaving", value: formData.dateOfLeaving },
      { trait_type: "Main Project", value: formData.mainProject },
    ],
  };

  const response = await fetch(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${PINATA_JWT}`,
      },
      body: JSON.stringify(metadata),
    }
  );

  const data = await response.json();
  if (data.IpfsHash) {
    return `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`;
  }
  throw new Error("Metadata upload failed");
}