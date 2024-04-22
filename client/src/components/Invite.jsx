import React, { useContext, useState } from "react";
import { UserContext } from "../utils/userContext";
import { URL } from "../utils/constants";
// import { useHistory } from "react-router-dom"; // For navigation
// import {useHistory}

const InvitationForm = () => {
  const [friendEmail, setFriendEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);
  const { user } = useContext(UserContext);
  //   const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(URL + "/api/invitations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, friendEmail }),
      });

      const data = await response.json();
      if (data.message === "Invitation sent successfully!") {
        setErrorMessage("Invitation sent successfully!"); // Clear any previous errors
        // history.push("/success"); // Redirect to success page (optional)
      } else {
        setErrorMessage(data.message);
      }
    } catch (err) {
      console.error(err);
      setErrorMessage("An error occurred. Please try again later.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
      className="border border-black"
        type="email"
        placeholder="Friend's Email Address"
        value={friendEmail}
        onChange={(e) => setFriendEmail(e.target.value)}
      />
      <br />
      <button type="submit" className="bg-slate-200 p-1 m-1">Send Invitation</button>
      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </form>
  );
};

export default InvitationForm;
// Registration component (handle pre-filled email if received from invitation link)
