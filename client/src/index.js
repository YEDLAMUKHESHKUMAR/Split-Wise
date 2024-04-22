import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import Body from "./components/Body";
import "./index.css";
// import { useContext } from "react";
import { UserProvider } from "./utils/userContext";
import { UserContext } from "./utils/userContext";
import UserFriend from "./components/UserFriend";
import Login from "./components/Login";
import AllExpenses from "./components/AllExpenses";
import DashBoard from "./components/DashBoard";
import { StrictMode, useState, useEffect, createContext } from "react";
import Cookies from "js-cookie";

import LeftComponents from "./components/LeftComponents";
// import Header from "./Header";
import Header from "./components/Header";
import Register from "./components/Register";
// const UserContext = createContext({});

const AppLayout = () => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      // console.log("storedUser", JSON.parse(storedUser));
      //   getUser(currUser);
      // console.log(storedUser);
      //   console.log(_id);
      setUser(JSON.parse(storedUser));
    }
  }, []);
  const login = (userData) => {
    console.log("userData", userData);

    setUser(userData);
    Cookies.set("user", JSON.stringify(userData), { expires: 7 }); // there is some link with user and token here ..
    window.location.href = window.location.origin + "/dashboard";
  };
  const logout = () => {
    setUser(null);
    Cookies.remove("user");
    window.location.href = window.location.origin + "/login"; // .. if you want to redirect to login page everytime user logged out, do this
  };
  return (
    <StrictMode>
      {/* https://react.dev/reference/react/StrictMode */}
      <UserContext.Provider value={{ user, login, logout }}>
        {/* <Body/> */}
        <Header />
        <div className="flex justify-center ">
          <div className="mr-2">
            <LeftComponents />
          </div>
          {/* w-[550px] */}
          <div className="   w-[540px] h-screen shadow-lg">
            <Outlet />
            {/* <Register/> */}
          </div>
        </div>
      </UserContext.Provider>
    </StrictMode>
  );
};

const AppRoutes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <DashBoard />,
      },
      {
        path: "/friends/:id",
        element: <UserFriend />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/all",
        element: <AllExpenses />,
      },
      {
        path: "/dashboard",
        element: <DashBoard />,
      },
    ],
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={AppRoutes} />);
// import React from "react";
// import ReactDOM from "react-dom/client";
// import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
// import Body from "./components/Body";
// import "./index.css";
// // import { useContext } from "react";
// import { UserProvider } from "./utils/userContext";
// import UserFriend from "./components/UserFriend";
// import Login from "./components/Login";
// import AllExpenses from "./components/AllExpenses";
// import DashBoard from "./components/DashBoard";
// import { StrictMode } from "react";
// import LeftComponents from "./components/LeftComponents";
// // import Header from "./Header";
// import Header from "./components/Header";

// const AppLayout = () => {
//   return (
//     <StrictMode>
//       {/* https://react.dev/reference/react/StrictMode */}
//       <UserProvider>
//         {/* <Body/> */}
//         <Header />
//         <div className="flex justify-center ">
//           <div className="mr-2">
//             <LeftComponents />
//           </div>
//           {/* w-[550px] */}
//           <div className=" bg-slate-100 m-2 p-4 w-[540px] h-screen">
//             <Outlet />
//           </div>
//         </div>
//       </UserProvider>
//     </StrictMode>
//   );
// };

// const AppRoutes = createBrowserRouter([
//   {
//     path: "/",
//     element: <AppLayout />,
//     children: [
//       {
//         path: "/",
//         element: <DashBoard />,
//       },
//       {
//         path: "friends/:id",
//         element: <UserFriend />,
//       },
//       {
//         path: "/login",
//         element: <Login />,
//       },
//       {
//         path: "/all",
//         element: <AllExpenses />,
//       },
//       {
//         path: "/dashboard",
//         element: <DashBoard />,
//       },
//     ],
//   },
// ]);

// const root = ReactDOM.createRoot(document.getElementById("root"));
// root.render(<RouterProvider router={AppRoutes} />);
