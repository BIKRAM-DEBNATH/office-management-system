import { useState } from "react";
import "./SubmitWork.css"; // <-- CSS file

export default function SubmitWork() {
  const [work, setWork] = useState({
    title: "",
    description: "",
    file: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setWork((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!work.title || !work.description) {
      alert("Please fill all fields!");
      return;
    }
    alert(`✅ Work Submitted: ${work.title}`);
    setWork({ title: "", description: "", file: null });
  };

  return (
    <div className="submit-container">
      <h2 className="submit-heading">📌 Submit Your Work</h2>
      <form className="submit-form" onSubmit={handleSubmit}>
        {/* Title */}
        <label className="submit-label">Title</label>
        <input
          type="text"
          name="title"
          value={work.title}
          onChange={handleChange}
          className="submit-input"
          placeholder="Enter work title"
          required
        />

        {/* Description */}
        <label className="submit-label">Description</label>
        <textarea
          name="description"
          value={work.description}
          onChange={handleChange}
          className="submit-textarea"
          placeholder="Enter work description"
          required
        />

        {/* File Upload */}
        <label className="submit-label">Upload File</label>
        <input
          type="file"
          name="file"
          onChange={handleChange}
          className="submit-file"
        />

        {/* Submit Button */}
        <button type="submit" className="submit-button">
          Submit Work
        </button>
      </form>
    </div>
  );
}
