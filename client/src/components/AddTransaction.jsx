// bug : duplicate the tab and logout from one , and try to add an expsense from  another   ... it's done
// bug2 : user1 logged in current tab and user2 too....now use2 logged out and logged in with  a new account...now whenever we logout in user1 (which was already logged out by user2) .... but if we click on logout . it is re-rendiering
// bug3 : user changed and tried to click on expense or settle , should lead to

import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { URL } from "../utils/constants";
import { useContext } from "react";
import { UserContext } from "../utils/userContext";
import ShowTransactions from "./ShowTransactions";
import handleTransaction from "../utils/Transactions/handleTransaction";
import getMergedSettleUps from "../utils/Transactions/getMergedSettleUps";
import GetPaidUser from "../utils/GetPaidUser";
import Cookies from "js-cookie";

import Owes from "./Owes";
import GetLentedUser from "../utils/GetLentedUser";
import Login from "./Login";
import AddExpense from "../utils/Transactions/addExpense";
import MyFriends from "../utils/getMyFriends";
const AddTransaction = (props) => {
  // get friendId through props by clicking any friend
  const { user, logout, login } = useContext(UserContext);
  const id = props.friendId;
  // console.log("frnd  id from addTrans", id);
  // console.log("id from addtr", id, user._id);
  const [PopUpActive, setPopUpActive] = useState(false);
  const [PopSettled, setPopSettled] = useState(false);
  const [ShowTransAfterSubmit, setShowTransAfterSubmit] = useState(false);
  const [MergedExpenses, setMergedExpenses] = useState([]);
  const [MergedSettleUps, setMergedSettleUps] = useState([]);
  const [Owner, setOwner] = useState("");
  const [Owe, setOwe] = useState(null);
  const [ForSettle, setForSettle] = useState(null);
  const [SettlingUser, setSettlingUser] = useState(null);
  const [SettlingWith, setSettlingWith] = useState(null);
  const [ShowSettleUps, setShowSettleUps] = useState(false);
  const [Show, setShow] = useState("Show");

  const [EditReq, SetEditReq] = useState(false);
  const [DeleteReq, SetDeleteReq] = useState(false);
  const [NotFrnd, setNotFrnd] = useState(null);
  const [ShowPage, setShowPage] = useState(false);
  const [ShowIndex, setShowIndex] = useState(null);
  const [ShowIndexSettle, setShowIndexSettle] = useState(null);

  // trials
  const [Friends, setFriends] = useState([]);
  const [state, setstate] = useState({
    query: "",
    listOfFriends: [],
  });
  const [consider, setConsider] = useState([]);

  // const [CommonId, setCommonId] = useState(null);
  // console.log("My friends", Friends);
  // console.log("Cookie", Cookies.get("user"), user);

  console.log("thalanoppi T_T ", SettlingUser, SettlingWith);
  const getMergedTrans = async () => {
    // console.log("getMergedTrans");
    const jsonTrans = await fetch(
      URL + "/getMergedTrans/" + user._id + "/" + id
    ).then((res) => res.json());

    console.log("jsonTrans", jsonTrans);
    if (!jsonTrans.msg) {
      setMergedExpenses(jsonTrans[0]);
      const owe = jsonTrans[1].owe;
      const owner = jsonTrans[1].owner;
      // console.log(owner);
      setOwe(owe);
      setForSettle(owe);
      setOwner(owner);
      setNotFrnd(null);
      // setCommonId(jsonTrans[1].idOfFriends);
      // console.log("useeffect in addtransaction", owe);

      // checking who owes whom , for settling money..

      if (owe === 0) {
        // console.log("booyah", owe);
        setSettlingUser(user._id);
        setSettlingWith(id);
      } else if (owe < 0) {
        setSettlingUser(owner);
        if (owner.toString() === user._id.toString()) {
          setSettlingWith(id);
        } else {
          setSettlingWith(user._id);
        }
      } else {
        setSettlingWith(owner); // if owe > 0 someone owes owner
        if (owner.toString() === user._id.toString()) {
          setSettlingUser(id);
        } else {
          setSettlingUser(user._id);
        }
      }
    } else {
      setNotFrnd(jsonTrans.msg);
      // alert("Invalid id")
    }
  };

  useEffect(() => {
    setShowSettleUps(false);
    setShow("Show");
    MyFriends(setFriends, user);
  }, [id]);

  useEffect(() => {
    // if (Cookies.get("user") === undefined) {
    //   window.location = "/login";
    // } else {
    //   // setUser(JSON.parse(atob(Cookies.get("user"))));
    //   login(JSON.parse(Cookies.get("user")));
    // }
    // console.log("got into useEffect in Add Trans");
    getMergedTrans();
    getMergedSettleUps(user, id, setMergedSettleUps, setNotFrnd);
    setShowPage(true);
  }, [ShowTransAfterSubmit, EditReq, DeleteReq, id]);

  // removed PopUpActive, PopSettled, from use Effect and added ShowTransAfterSubmit
  // you dont have to give popUpActive and Popset... here , instead you can create another state variable which will only re-render the whole app when we submit
  // useEffect(() => {
  // owe details
  // const user1 = GetPaidUser(user._id); // always : you
  const user1 = "you";
  let user2 = GetLentedUser(id); // no need GetLentedUser...you can just pass id to GetPaidUser
  // console.log("user1", user1, user2);

  // }, []);

  // const handleQuery = (e) => {
  //   const result = Friends.filter((frnd) => {
  //     return frnd.userID.username
  //       .toLowerCase()
  //       .includes(e.target.value.toLowerCase());
  //   });
  //   setstate({
  //     query: e.target.value,
  //     listOfFriends: result,
  //   });
  // };
  // const addMe = (frnd) => {
  //   console.log("good boy", frnd, consider);
  //   // setConsider.push(frnd);
  //   // setTodos([...todos, data]);
  //   let check = 0;
  //   const res = consider.map(
  //     (friend) => (check += friend.userID._id === frnd.userID._id ? 1 : 0)
  //   );
  //   console.log(res);
  //   if (res > 0) alert("Already Considered!");
  //   else {
  //     setConsider([...consider, frnd]);
  //     setstate({
  //       query: "",
  //       listOfFriends: [],
  //     });
  //   }
  // };

  // const removeConsider = (frnd) => {
  //   // console.log(frnd)
  //   const result = consider.filter(
  //     (friend) => friend.userID._id !== frnd.userID._id
  //   );
  //   setConsider(result);
  // };

  // console.log("list of my friends after searching : ", state.listOfFriends);

  let frndId = useParams().id;
  const addTransaction = async (Transaction, id) => {
    console.log("Both are not same", SettlingUser, SettlingWith);
    if (Transaction.type === "settle") {
      console.log("changing");
      Transaction.userIds = SettlingUser; // change this to the person who is paying right now , it is based on who owes whom
      Transaction.Friendss = [{ userID: { _id: SettlingWith } }];
    }

    // getMergedTrans(); // i called here becoz : if both users is settling at a time id's wont update
    console.log("Transaction", Transaction);
    await handleTransaction(
      Transaction,
      user,
      login,
      setPopUpActive,
      setPopSettled,
      setShowTransAfterSubmit,
      ShowTransAfterSubmit
    );
  };
  const handleClick = () => {
    setShowSettleUps(!ShowSettleUps);
    if (Show === "Show") {
      setShow("Hide");
    } else {
      setShow("Show");
    }
  };
  return (
    <div className="h-screen">
      {/* <div>
        <div className="m-1">
          with you and :
          {consider.map((frnd) => (
            <span className="bg-red-200 ml-1">
              {frnd.userID.username} &nbsp;{" "}
              <span className="cursor-pointer" onClick={() => removeConsider(frnd)}>x</span>{" "}
            </span>
          ))}
        </div>
        <form>
          <input
            className="border border-black"
            type="search"
            value={state.query}
            onChange={handleQuery}
          />
        </form>
        <div>
          <ul>
            {state.query === ""
              ? ""
              : state.listOfFriends.map((frnd) => (
                  <li
                    className="bg-blue-200 w-20 cursor-pointer"
                    key={frnd._id}
                    onClick={() => addMe(frnd)}
                  >
                    {frnd.userID.username}
                  </li>
                ))}
          </ul>
        </div>
      </div> */}

      {user ? ( // you can check with cookies , if you don't want to keep as it is even user doesn't exist.
        NotFrnd !== null ||
        Cookies.get("user") === undefined ||
        JSON.parse(Cookies.get("user"))._id !== user._id ? (
          <h3>
            {NotFrnd ? NotFrnd : <div>Loading because you are wrong user</div>}
          </h3> // like shimmer
        ) : (
          <div className=" border-blue-400 h-full">
            <div className="flex items-center justify-between  border-b-2 bg-gray-200 border-slate-300">
              <div>{user2}</div>
              <div>
                <button
                  onClick={() => setPopUpActive(true)}
                  className="bg-orange-500 text-white p-2 text-md m-2"
                >
                  Add Expense
                </button>
                <button
                  onClick={() => setPopSettled(true)}
                  className="bg-green-500 text-white p-2 text-md m-2"
                >
                  Settle Expense
                </button>
              </div>
            </div>

            {/* Add this pop up to new component, pass everything u need through props */}

            {PopUpActive && id !== undefined ? (
              // <div className="popup w-[300px] rounded-md border-black bg-gray-300 ">
              //   <div className="head bg-green-600 p-2 flex justify-between text-white font-semiboldbold ">
              //     <div>Add an Expense</div>
              //     <div
              //       className="closePopup text-white fontw rounded-lg w-6 text-center cursor-pointer"
              //       onClick={() => setPopUpActive(false)}
              //     >
              //       X
              //     </div>
              //   </div>

              //   <form
              //     onSubmit={(e) => {
              //       e.preventDefault();
              //       const formData = new FormData(e.target);
              //       const Transaction = {
              //         description: formData.get("description"),
              //         amount: formData.get("amount"),
              //         date: new Date().toISOString().slice(0, 10),
              //         type: "expense",
              //         userId: user._id,
              //         FriendId: id,
              //         Owe: Owe,
              //         Owner: Owner,
              //       };
              //       addTransaction(Transaction, id);
              //     }}
              //   >
              //     <input
              //       className="p-2 m-1"
              //       type="text"
              //       name="description"
              //       placeholder="Enter description"
              //     />
              //     <input
              //       className="p-2 m-1"
              //       type="number"
              //       name="amount"
              //       placeholder="0.00"
              //     />
              //     <button
              //       type="button"
              //       onClick={() => setPopUpActive(false)}
              //       className="bg-stone-800 px-4 py-2 m-2 text-white"
              //     >
              //       Cancel
              //     </button>
              //     <button
              //       type="submit"
              //       className="bg-green-500 text-white px-4 py-2 m-2"
              //     >
              //       Save
              //     </button>
              //   </form>
              // </div>
              // <AddExpense props={user,login,setPopSettled,setPopUpActive,setShowTransAfterSubmit,ShowTransAfterSubmit}/>
              <AddExpense
                user={user}
                login={login}
                setPopSettled={setPopSettled}
                PopUpActive={PopUpActive}
                setPopUpActive={setPopUpActive}
                setShowTransAfterSubmit={setShowTransAfterSubmit}
                ShowTransAfterSubmit={ShowTransAfterSubmit}
              />
            ) : (
              ""
            )}
            {PopSettled && id !== undefined ? (
              <div className="popup w-[300px] rounded-md border-black bg-gray-300 ">
                <div className="head bg-green-600 p-2 flex justify-between text-white font-semiboldbold ">
                  <div>Add an Expense</div>
                  <div
                    className="closePopup text-white fontw rounded-lg w-6 text-center cursor-pointer"
                    onClick={() => setPopSettled(false)}
                  >
                    X
                  </div>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.target);
                    const Transaction = {
                      description: "Payment",
                      amount: formData.get("amount"),
                      date: new Date().toISOString().slice(0, 10),
                      type: "settle",
                      userId: SettlingUser, // change this to the person who is paying right now , it is based on who owes whom
                      Friends: [{ userID: { _id: SettlingWith } }],
                    };
                    addTransaction(Transaction, id);
                  }}
                >
                  {/* <div className="m-1 text-center"> */}
                  <Owes
                    id={id}
                    user={user}
                    user1={user1}
                    user2={user2}
                    Owe={Owe}
                    Owner={Owner}
                    type={"settle"}
                  />{" "}
                  <input
                    className="p-2 m-1"
                    type="number"
                    // min="0" step=".01"
                    name="amount"
                    onChange={(e) => setForSettle(e.target.value)}
                    value={Math.abs(ForSettle)}
                  />
                  {/* </div> */}
                  {/* <div className="btns flex justify-end"> */}
                  <button
                    type="button"
                    onClick={() => setPopSettled(false)}
                    className="bg-stone-800 px-4 py-2 m-2 text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 m-2"
                  >
                    Save
                  </button>
                  {/* </div> */}
                </form>
              </div>
            ) : (
              ""
            )}
            {!ShowPage ? (
              <div>Wait ing</div>
            ) : (
              <div className=" h-full">
                {MergedExpenses.length === 0 && MergedSettleUps.length === 0 ? (
                  <div className="flex justify-center  items-center">
                    <img
                      className="w-3/12  "
                      src="https://assets.splitwise.com/assets/fat_rabbit/empty-table-effed2a2e610373b6407d746cb95858f5d47329c8610bb70f1fd2040dfa35165.png"
                      alt="null expense"
                    />
                    <div className="ml-2 text-lg w-21">
                      You have not added any expenses yet
                    </div>
                  </div>
                ) : (
                  <div className="h-full">
                    {MergedExpenses.length === 0 && !ShowSettleUps ? (
                      <div className="text-center">
                        <div className="w-full  flex justify-center">
                          <img
                            className="w-3/12 "
                            src="https://assets.splitwise.com/assets/fat_rabbit/app/checkmark-circle-ae319506ad7196dc77eede0aed720a682363d68160a6309f6ebe9ce1983e45f0.png"
                            alt="null expense"
                          />
                        </div>
                        <div>You are all settled up. Awesome!</div>
                      </div>
                    ) : (
                      <div>
                        <Owes
                          id={id}
                          user={user}
                          user1={user1}
                          user2={user2}
                          Owe={Owe}
                          Owner={Owner}
                          type={"expense"}
                        />
                        {/* )} */}
                        {MergedExpenses.map((trans, index) => (
                          <ShowTransactions
                            key={trans.transactionId._id}
                            transactions={trans.transactionId}
                            SetDeleteReq={() => SetDeleteReq(!DeleteReq)}
                            SetEditReq={() => SetEditReq(!EditReq)}
                            clicked={"expense"}
                            ShowDetails={ShowIndex === index ? true : false}
                            setShowIndex={() => {
                              index === ShowIndex
                                ? setShowIndex(null)
                                : setShowIndex(index); // 1
                            }}
                            setShowIndexDelete={() => {
                              setShowIndex(null);
                            }}
                          />
                        ))}
                      </div>
                    )}
                    <div className="flex justify-center mt-5">
                      <div
                        className="text-blue-500 cursor-pointer w-[200px]"
                        onClick={handleClick}
                      >
                        {Show} Settled Expenses
                      </div>
                    </div>
                    <div>
                      {ShowSettleUps ? (
                        MergedSettleUps.length !== 0 ? (
                          MergedSettleUps.map((trans, index) => (
                            <ShowTransactions
                              key={trans.transactionId._id}
                              transactions={trans.transactionId}
                              SetEditReq={() => SetEditReq(!EditReq)}
                              SetDeleteReq={() => SetDeleteReq(!DeleteReq)}
                              clicked={"settle"}
                              ShowDetails={
                                ShowIndexSettle === index ? true : false
                              }
                              setShowIndex={() => {
                                index === ShowIndexSettle
                                  ? setShowIndexSettle(null)
                                  : setShowIndexSettle(index); // 1
                              }}
                              setShowIndexDelete={() => {
                                setShowIndexSettle(null);
                              }}
                            />
                          ))
                        ) : (
                          <div>No Settled Transaction Yet</div>
                        )
                      ) : (
                        // </div>
                        // <div>Show Settled Expenses</div>
                        ""
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )
      ) : (
        // <div>sdfkj</div>
        <Login />
      )}
    </div>
  );
};

export default AddTransaction;
