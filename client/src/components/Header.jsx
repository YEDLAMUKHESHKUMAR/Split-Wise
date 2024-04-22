import { useContext } from "react";
import { UserContext } from "../utils/userContext";
import { Link } from "react-router-dom";

const Header = () => {
  const { user, login, logout } = useContext(UserContext);
  return (
    <div className="bg-green-500 text-white  ">
      <div>
        {user ? (
          <div className="flex items-center justify-between ">
            <p>Welcome back {user.username}</p>
            <button
              className="bg-orange-600 px-4 py-1 text-md text-white m-2"
              onClick={() => logout()}
            >
              Logout
            </button>
            {/* <Link to={"/all"}>
              <div className="bg-slate-400 w-[100px] p-1 m-1" >All Expenses</div>
            </Link> */}
            {/* <Link to={"/dashboard"}>
              <div className="bg-slate-400 w-[100px] p-1 m-1" >Dashboard</div>
            </Link> */}
            {/* <AllExpenses/> */}
            {/* <AddFriend /> */}
            {/* <AddTransaction friendId={null} /> */}
          </div>
        ) : (
          <Link to={"/login"}>Login</Link>
          // <Login/>
          // <p>Logged in as guest</p>
          //   <Login />

          // <button
          //   onClick={() =>
          //     login({
          //       _id: "65f98c61498e837c73c99c1b",
          //     })
          //   }
          // >
          //   Login
          // </button>
        )}
      </div>
    </div>
  );
};

export default Header;
