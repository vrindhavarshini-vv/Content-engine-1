import React, { useState } from "react";

const EmailForm = () => {
  const [formDetails, setFormDetails] = useState({
    subject: "",
    body: "",
    feedback: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { subject, body, feedback } = formDetails;
    const gmailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=''&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}%0A%0A${encodeURIComponent(feedback)}`;
    window.open(gmailLink, '_blank');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>Email Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Subject:</label>
          <input
            type="text"
            name="subject"
            value={formDetails.subject}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div>
          <label>Body:</label>
          <input
            type="text"
            name="body"
            value={formDetails.body}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <div>
          <label>Feedback:</label>
          <textarea
            name="feedback"
            value={formDetails.feedback}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '8px', margin: '5px 0' }}
          />
        </div>
        <button type="submit" style={{ padding: '10px 20px', marginTop: '10px' }}>Submit</button>
      </form>
    </div>
  );
};

export default EmailForm;
