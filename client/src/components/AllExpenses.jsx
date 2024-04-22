import { useContext } from "react";
import { UserContext } from "../utils/userContext";
import Login from "./Login";
import { URL } from "../utils/constants";
import { useEffect, useState } from "react";
import ShowTransactions from "./ShowTransactions";
import { useParams } from "react-router-dom";
import AddExpense from "../utils/Transactions/addExpense";
const AllExpenses = () => {
  const { user, login } = useContext(UserContext);
  const [AllExpenses, setAllExpenses] = useState([]);
  const [EditReq, SetEditReq] = useState(false);
  const [DeleteReq, SetDeleteReq] = useState(false);
  const [ShowPage, setShowPage] = useState(false);
  const [ShowIndex, setShowIndex] = useState(false);
  const [PopUpActive, setPopUpActive] = useState(false);
  const [PopSettled, setPopSettled] = useState(false);
  const [ShowTransAfterSubmit, setShowTransAfterSubmit] = useState(false);

  const { id } = useParams();

  // console.log("all exp");
  const getAllTransactions = async (id) => {
    // setShowPage(false);
    const jsonData = await fetch(URL + "/all/" + id).then((res) => res.json());
    // console.log("all trans", jsonData);
    setAllExpenses(jsonData);
    setShowPage(true);
  };
  useEffect(() => {
    if (user) getAllTransactions(user._id);
  }, [user, EditReq, DeleteReq, ShowTransAfterSubmit]);
  return (
    <div className="h-full">
      {!user ? (
        <Login />
      ) : !ShowPage ? (
        <div>Loading transactions</div>
      ) : (
        // <div>Shimmer</div>
        <div className="h-full ">
          {/* We used this many times */}
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

          {AllExpenses.length === 0 ? (
            <div className="flex flex-col justify-center mt-auto h-full items-center">
              {/* <p>sd</p> */}
              <img
                className="w-96"
                src="https://img.freepik.com/free-vector/no-data-concept-illustration_114360-626.jpg?size=626&ext=jpg&ga=GA1.1.1700460183.1712707200&semt=ais"
                alt="no transactions found"
              />
              <div className="text-lg text-red-500">
                You have not added any expenses yet
              </div>
            </div>
          ) : (
            <div>
              <h1 className="text-center text-xl  ">All Expenses</h1>
              {AllExpenses.map((expense, index) => (
                // <div>hi</div>
                <ShowTransactions
                  key={expense.transactionId._id}
                  transactions={expense.transactionId}
                  SetEditReq={() => SetEditReq(!EditReq)}
                  SetDeleteReq={() => SetDeleteReq(!DeleteReq)}
                  clicked={"all"}
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
        </div>
      )}
    </div>
  );
};

export default AllExpenses;
