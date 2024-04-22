import { URL } from "../utils/constants";
import { useState, useContext } from "react";
import { Link } from "react-router-dom";

import { UserContext } from "../utils/userContext";
import DashBoard from "./DashBoard";

const Login = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, user } = useContext(UserContext);
  const handleLogin = async () => {
    // console.log(credentials)
    const jsonData = await fetch(URL + "/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    if (jsonData.status === 200) {
      // window.location.href="/"
      console.log("good");
      const data = await jsonData.json();
      console.log(data.user);
      login(data.user); // sending currLoggedin user to userContext to store in cookies
      // window.location.href = "/dashboard"; i removed this here and added it under login function in index.js
    } else {
      const data = await jsonData.json();
      alert(data.msg);
    }
    // console.log("Valid user");
  };
  return (
    <div className="h-screen">
      {user ? (
        (window.location.href = "/dashboard")
      ) : (
        // <DashBoard />
        <div className="flex justify-center items-center h-full ">
          <div className="  flex flex-col bg-slate-100  w-10/12  p-12 shadow-lg">
            {/* <label htmlFor="username">username : </label> */}

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
                onClick={handleLogin}
              >
                Login
              </button>
              <p className="text-blue-400 text-sm">
                new User? <Link to={"/register"}>SignUp</Link>{" "}
              </p>
            </div>
          </div>
        </div>

        // by using form

        // <div className="flex justify-center items-center h-full ">
        //   <div className="flex flex-col bg-slate-100  w-10/12  p-14 shadow-lg ">
        //     {/* <form
        //       className="w-[300px]"
        //       onSubmit={(e) => {
        //         e.preventDefault();
        //         const formData = new FormData(e.target);
        //         const credentials = {
        //           email: formData.get("email"),
        //           password: formData.get("password"),
        //         };
        //         handleLogin(credentials);

        //         console.log(e);
        //       }}
        //     >
        //       <input
        //         className="border w-full p-1 border-black m-2"
        //         type="email"
        //         name="email"
        //         placeholder="email"
        //       />
        //       <br />
        //       <input
        //         className="border w-full p-1 border-black m-2"
        //         type="password"
        //         name="password"
        //         placeholder="password"
        //       />
        //       <br />
        //       <button
        //         className="bg-green-600 px-4 py-1 text-md text-white m-2"
        //         type="submit"
        //       >
        //         Login
        //       </button>
        //     </form> */}

        //   </div>
        // </div>
      )}
    </div>
  );
};

export default Login;
