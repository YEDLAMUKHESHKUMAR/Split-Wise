import Cookies from "js-cookie";
import { createContext } from "react";
import { useState, useEffect } from "react";
const UserContext = createContext({
  user: null, 
});

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   console.log("every time should render this page", user);
//   //   useEffect(() => {
//   //     const storedUser = localStorage.getItem("user");
//   //     if (storedUser) {
//   //       setUser(JSON.parse(storedUser)); // Parse the stored user string
//   //     }
//   //   }, []);

//   //   useEffect(() => {
//   //     localStorage.setItem("user", JSON.stringify(user)); // Stringify the user object
//   //   }, [user]);

//   useEffect(() => {
//     const storedUser = Cookies.get("user");
//     if (storedUser) {
//       // console.log("storedUser", JSON.parse(storedUser));
//       //   getUser(currUser);
//       // console.log(storedUser);
//       //   console.log(_id);
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);
//   //   useEffect(() => {

//   //     Cookies.set("user", user, { expires: 7 });
//   //   }, [user]);

//   const login = (userData) => {
//     console.log("userData", userData);

//     setUser(userData);
//     Cookies.set("user", JSON.stringify(userData), { expires: 7 }); // there is some link with user and token here ..
//   };
//   const logout = () => {
//     setUser(null);
//     Cookies.remove("user");
//     window.location.href = "/login"; // .. if you want to redirect to login page everytime user logged out, do this
//   };
//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

export {UserContext} 

// import Cookies from "js-cookie";
// import { createContext } from "react";
// import { useState, useEffect } from "react";
// const UserContext = createContext({});

// const UserProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   console.log("every time should render this page", user);
//   //   useEffect(() => {
//   //     const storedUser = localStorage.getItem("user");
//   //     if (storedUser) {
//   //       setUser(JSON.parse(storedUser)); // Parse the stored user string
//   //     }
//   //   }, []);

//   //   useEffect(() => {
//   //     localStorage.setItem("user", JSON.stringify(user)); // Stringify the user object
//   //   }, [user]);

//   useEffect(() => {
//     const storedUser = Cookies.get("user");
//     if (storedUser) {
//       // console.log("storedUser", JSON.parse(storedUser));
//       //   getUser(currUser);
//       // console.log(storedUser);
//       //   console.log(_id);
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);
//   //   useEffect(() => {

//   //     Cookies.set("user", user, { expires: 7 });
//   //   }, [user]);

//   const login = (userData) => {
//     console.log("userData", userData);

//     setUser(userData);
//     Cookies.set("user", JSON.stringify(userData), { expires: 7 }); // there is some link with user and token here ..
//   };
//   const logout = () => {
//     setUser(null);
//     Cookies.remove("user");
//     window.location.href = "/login"; // .. if you want to redirect to login page everytime user logged out, do this
//   };
//   return (
//     <UserContext.Provider value={{ user, login, logout }}>
//       {children}
//     </UserContext.Provider>
//   );
// };

// export { UserContext, UserProvider };
