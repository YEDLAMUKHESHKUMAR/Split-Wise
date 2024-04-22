import { useContext } from "react";
import { UserContext } from "../utils/userContext";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { URL } from "../utils/constants";
import Login from "./Login";
import AddExpense from "../utils/Transactions/addExpense";
const DashBoard = () => {
  // const { user } = useContext(UserContext);
  const { user, login, logout } = useContext(UserContext);
  const [userDetails, setUserDetails] = useState(null);
  console.log("userDetails", userDetails);
  const navigate = useNavigate();
  // console.log("user form dashboard", user);
  const [Total, setTotal] = useState(0);
  const [YouOwe, setYouOwe] = useState(0);
  const [YouAreOwed, setYouAreOwed] = useState(0);

  const [IOwe, setIOwe] = useState([]);
  const [TheyOwe, setTheyOwe] = useState([]);
  const [ShowPage, setShowPage] = useState(false);

  const [PopUpActive, setPopUpActive] = useState(false);
  const [PopSettled, setPopSettled] = useState(false);
  const [ShowTransAfterSubmit, setShowTransAfterSubmit] = useState(false);

  console.log("Owing", IOwe, TheyOwe);
  const getDetails = async () => {
    setShowPage(false);

    const jsonData = await fetch(URL + "/getFriends/" + user._id).then((res) =>
      res.json()
    );
    // console.log("dashboard balances", jsonData);
    const allDetails = await fetch(URL + "/dashboard/balances/" + user._id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(jsonData),
    }).then((res) => res.json());
    console.log("all details", allDetails);
    setYouOwe(allDetails[2].totIOwe);
    setYouAreOwed(allDetails[2].totTheyOwe);
    setTotal(allDetails[2].totalBalance);
    setIOwe(allDetails[0]);
    setTheyOwe(allDetails[1]);
    setShowPage(true);
  };

  const getUser = async (currUser) => {
    // console.log(currUser);
    const { _id } = currUser;
    // console.log("_id", _id);
    // if(_id){

    const jsonData = await fetch(URL + "/getUser/" + _id).then((res) =>
      res.json()
    );
    const data = jsonData;
    // console.log("data", data);
    setUserDetails(data);
    // }
  };
  const fetchProfile = async () => {
    if (user) {
      // console.log("user from fectchProfile", user);
      getUser(user);
    } else {
      setUserDetails(null);
    }
  };
  useEffect(() => {
    if (user) getDetails();
    // fetchProfile();
  }, [user, ShowTransAfterSubmit]);

  return (
    <div>
      {Cookies.get("user") === undefined ? (
        <Login />
      ) : ShowPage ? (
        <div>
          <div className="flex items-center justify-between  border-b-2 bg-gray-200 border-slate-300">
            <div>
              <button
                onClick={() => setPopUpActive(true)}
                className="bg-orange-500 text-white p-2 text-md m-2"
              >
                Add Expense
              </button>
            </div>
          </div>
          {PopUpActive ? (
            <AddExpense
              user={user}
              login={login}
              setPopSettled={setPopSettled}
              PopUpActive={PopUpActive}
              setPopUpActive={setPopUpActive}
              setShowTransAfterSubmit={setShowTransAfterSubmit}
              ShowTransAfterSubmit={ShowTransAfterSubmit}
            />
          ) : null}
          <div className="text-2xl border-b border-slate-300 mb-2 ">
            DashBoard
          </div>
          <div className="flex pb-1 border-b border-slate-300 justify-evenly w-[500px] text-sm">
            <div className="flex flex-col items-center">
              <div>Total balance</div>
              {Total > 0 ? (
                <div className="text-green-500">₹{Total}</div>
              ) : (
                <div className="text-red-500">₹{Total}</div>
              )}
            </div>
            <div className="flex flex-col items-center border-l border-r px-10 border-slate-400 ">
              <div>You owe</div>
              <div className="text-red-500 ">₹{YouOwe}</div>
            </div>
            <div className="flex flex-col items-center">
              <div>You are owed</div>
              <div className="text-green-500">₹{YouAreOwed}</div>
            </div>
          </div>
          <div className="flex mt-4 justify-evenly">
            <div className="w-3/6">
              <div>YOU OWE</div>
              <div>
                {!IOwe ? (
                  <div>Loading IOwe shimmer</div>
                ) : (
                  IOwe.map((owe) => (
                    <div
                      className="bg-white shadow-md transition-colors  duration-300 ease-in-out hover:bg-slate-100 p-1 m-1 flex-1"
                      key={owe.userID._id}
                    >
                      <Link to={"/friends/" + owe.userID._id}>
                        <div>{owe.userID.username}</div>
                        <div className="text-xs text-red-500">
                          you owe ₹{Math.abs(owe.owe)}
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
            <div className="w-3/6">
              <div className="text-end">YOU ARE OWED</div>
              <div>
                {!TheyOwe ? (
                  <div>Loading They owe Shimmer</div>
                ) : (
                  TheyOwe.map((owe) => (
                    <div
                      className="bg-white shadow-md transition-colors duration-300 ease-in-out hover:bg-slate-100 m-1 p-1 flex-1"
                      key={owe.userID._id}
                    >
                      <Link to={"/friends/" + owe.userID._id}>
                        <div>{owe.userID.username}</div>
                        <div className="text-xs text-green-500">
                          owes you ₹{Math.abs(owe.owe)}
                        </div>
                      </Link>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>Loading</div>
      )}
    </div>
  );
};
export default DashBoard;
