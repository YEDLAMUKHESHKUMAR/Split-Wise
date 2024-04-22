import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../utils/userContext";
import { useContext } from "react";
import Login from "./Login";
import AddFriend from "./AddFriend";
import AddTransaction from "./AddTransaction";
import { URL } from "../utils/constants";
import AllExpenses from "./AllExpenses";
import { Link } from "react-router-dom";

const Body = () => {
  const { user, login, logout } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  console.log("userDetails", userDetails);
  const navigate = useNavigate();
  useEffect(() => {
    const getUser = async (currUser) => {
      // console.log(currUser);
      const { _id } = currUser;
      console.log("_id", _id);
      // if(_id){

      const jsonData = await fetch(URL + "/getUser/" + _id).then((res) =>
        res.json()
      );
      const data = jsonData;
      console.log("data", data);
      setUserDetails(data);
      // }
    };
    const fetchProfile = async () => {
      if (user) {
        console.log("user from fectchProfile", user);
        getUser(user);
      } else {
        setUserDetails(null);
      }
    };
    fetchProfile();
  }, [user]);

  return (
    <div>
      <button className="btn bg-black text-white px-4 py-2">Hello</button>
      <div>
        {userDetails ? (
          <div>
            <p>Welcome back {userDetails.username}</p>
            <button
              className="bg-orange-600 px-4 py-1 text-md text-white m-2"
              onClick={() => logout()} 
            >
              Logout
            </button>
            <Link to={"/all"}>
              <div className="bg-slate-400 w-[100px] p-1 m-1" >All Expenses</div>
            </Link>
            <Link to={"/dashboard"}>
              <div className="bg-slate-400 w-[100px] p-1 m-1" >Dashboard</div>
            </Link>
            {/* <AllExpenses/> */}
            <AddFriend />
            {/* <AddTransaction friendId={null} /> */}
          </div>
        ) : (
          // <Login/>
          // <p>Logged in as guest</p>
          <Login />

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
      {/* <Login /> */}
    </div>
  );
};

export default Body;
