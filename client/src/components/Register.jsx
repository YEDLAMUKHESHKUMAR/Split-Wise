import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { URL } from "../utils/constants";
import Cookies from "js-cookie";
import { UserContext } from "../utils/userContext";
import { useLocation } from "react-router-dom"; // Access URL parameters
import { useParams } from "react-router-dom"; // Assuming you're using React Router

const Register = () => {
  const [username, setUsername] = useState("");
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const invitationToken = searchParams.get("invitation");
  console.log("invitationToken there ? ", invitationToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [invitedBy,setInvitedBy] = useState("");
  const { login, user } = useContext(UserContext);
  // const [email, setEmail] = useState("");
  console.log("frnd email : ", email);

  const checkInvitation = async (invitationToken) => {
    const jsonData = await fetch(
      URL + `/invite/register?invitationToken=${invitationToken}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        // body: JSON.stringify({invitationToken})
      }
    ).then((res) => res.json());
    console.log(jsonData);
    if (jsonData.msg) {
      alert(jsonData.msg);
      window.location.href = "/register";
    } else {
      setInvitedBy(jsonData.sender)
      setEmail(jsonData.recipientEmail);
    }
  };

  useEffect(() => {
    console.log("check invite only when location changes");
    if (invitationToken) checkInvitation(invitationToken);
  }, [location]);
  // useEffect(() => {
  //   // const searchParams = new URLSearchParams(location.search); // Parse URL parameters
  //   // console.log(searchParams);
  //   // const prefilledEmail = searchParams.get("prefilledEmail");
  //   if (prefilledEmail) {
  //     setEmail(prefilledEmail);
  //   }
  // }, [prefilledEmail]);

  // Submit the form to register
  const handleRegister = async () => {
    if (Cookies.get("user") !== undefined) {
      alert("You are already logged in.");
      window.location.href = "/dashboard";
    }
    console.log("handle register");
    const jsonData = await fetch(URL + "/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password,invitedBy }),
    }).then((res) => res.json());
    if (jsonData.msg) {
      alert(jsonData.msg);
    } else {
      login(jsonData);
      setUsername("");
      setEmail("");
      setPassword("");
    }
    // alert("sdkfkjf")
  };
  return (
    <div className="h-screen">
      {Cookies.get("user") !== undefined ? (
        (window.location.href = "/dashboard")
      ) : (
        <div className="flex justify-center items-center h-full ">
          <div className="  flex flex-col bg-slate-100  w-10/12  p-12 shadow-lg">
            <h1 className="text-center text-2xl mb-8">Register</h1>
            {/* <label htmlFor="username">username : </label> */}
            <input
              className="border border-black p-1"
              type="text"
              onChange={(e) => setUsername(e.target.value)}
              value={username}
              name="username"
              placeholder="enter username"
            />
            <br />
            {/* <label htmlFor="username">email : </label> */}
            <input
              className="border border-black p-1"
              type="email"
              placeholder="enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              name="email"
            />
            <br />
            {/* <label htmlFor="username">password : </label> */}
            <input
              className="border border-black p-1"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="enter password"
              name="password"
            />
            <div className="mt-2 flex justify-between items-center">
              <button
                className="bg-green-400 text-white p-1"
                onClick={handleRegister}
              >
                SignUp
              </button>
              <p className="text-blue-400 text-sm">
                already a member? <Link to={"/login"}>login</Link>{" "}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
