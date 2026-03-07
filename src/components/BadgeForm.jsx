// Renders all badge input fields dynamically from the fields array
export default function BadgeForm({ formData, onChange }) {
  const fields = [
    { name: "firstName", label: "First Name", type: "text", placeholder: "Jane" },
    { name: "lastName", label: "Last Name", type: "text", placeholder: "Doe" },
    { name: "visaType", label: "Visa Type", type: "text", placeholder: "EDI Challenge" },
    { name: "dateOfArrival", label: "Date of Arrival", type: "date" },
    { name: "dateOfLeaving", label: "Date of Leaving", type: "date" },
    { name: "mainProject", label: "Main Project", type: "text", placeholder: "EDI Main Internship" },
    { name: "imageLink", label: "Image Link", type: "text", placeholder: "https://example.com/photo.jpg" },
    { name: "recipientWallet", label: "Recipient Wallet", type: "text", placeholder: "0x..." },
  ];

  return (
    <div className="form-container">
      <h2>Badge Information</h2>
      {fields.map((field) => (
        <div key={field.name} className="field">
          <label>{field.label}</label>
          <input
            type={field.type}
            name={field.name}
            placeholder={field.placeholder || ""}
            value={formData[field.name]}
            onChange={onChange}
          />
        </div>
      ))}
    </div>
  );
}