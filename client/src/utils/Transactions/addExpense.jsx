import { useContext, useEffect, useState } from "react";
import handleTransaction from "./handleTransaction";
import { UserContext } from "../userContext";
import MyFriends from "../getMyFriends";
const AddExpense = ({
  id,
  user,
  login,
  setPopSettled,
  setPopUpActive,
  PopUpActive,
  setShowTransAfterSubmit,
  ShowTransAfterSubmit,
}) => {
  const [Friends, setFriends] = useState([]);
  const [state, setstate] = useState({
    query: "",
    listOfFriends: [],
  });
  const [consider, setConsider] = useState([]);
  console.log("consider", consider);
  useEffect(() => {
    MyFriends(setFriends, user);
  }, [PopUpActive]);
  //   const { user, login } = useContext(UserContext);
  const addTransaction = async (Transaction, id) => {
    if (consider.length === 0) alert("You must add  a friend to consider");
    else {
      await handleTransaction(
        Transaction,
        user,
        login,
        setPopUpActive,
        setPopSettled,
        setShowTransAfterSubmit,
        ShowTransAfterSubmit
      );
    }
  };
  const handleQuery = (e) => {
    const result = Friends.filter((frnd) => {
      return frnd.userID.username
        .toLowerCase()
        .includes(e.target.value.toLowerCase());
    });
    setstate({
      query: e.target.value,
      listOfFriends: result,
    });
  };
  const addMe = (frnd) => {
    // setConsider.push(frnd);
    // setTodos([...todos, data]);
    let check = 0;
    const res = consider.map(
      (friend) => (check += friend.userID._id === frnd.userID._id ? 1 : 0)
    );
    console.log(res);
    if (check > 0) alert("Already Considered!");
    else {
      setConsider([...consider, frnd]);
      setstate({
        query: "",
        listOfFriends: [],
      });
    }
    console.log("good boy", frnd, consider);
  };

  const removeConsider = (frnd) => {
    // console.log(frnd)
    const result = consider.filter(
      (friend) => friend.userID._id !== frnd.userID._id
    );
    setConsider(result);
  };
  return (
    <div>
      <div className="popup w-[300px] rounded-md border-black bg-gray-300 ">
        <div className="head bg-green-600 p-2 flex justify-between text-white font-semiboldbold ">
          <div>Add an Expense</div>
          <div
            className="closePopup text-white fontw rounded-lg w-6 text-center cursor-pointer"
            onClick={() => setPopUpActive(false)}
          >
            X
          </div>
        </div>

        <div>
          <div className="m-1">
            with you and :
            {consider.map((frnd) => (
              <span key={frnd._id} className="bg-red-200 ml-1">
                {frnd.userID.username} &nbsp;{" "}
                <span
                  className="cursor-pointer"
                  onClick={() => removeConsider(frnd)}
                >
                  x
                </span>{" "}
              </span>
            ))}
          </div>
          <form>
            <input
              className="border border-black"
              type="search"
              placeholder="Search for friends..."
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
                      className="bg-blue-200 w-20 mb-1 cursor-pointer"
                      key={frnd._id}
                      onClick={() => addMe(frnd)}
                    >
                      {frnd.userID.username}
                    </li>
                  ))}
            </ul>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            const formData = new FormData(e.target);
            const Transaction = {
              description: formData.get("description"),
              amount: formData.get("amount"),
              date: new Date().toISOString().slice(0, 10),
              type: "expense",
              userId: user._id,
              Friends: consider,
            };
            addTransaction(Transaction, id);
          }}
        >
          {/* <div className="m-1 text-center"> */}
          <input
            className="p-2 m-1"
            type="text"
            name="description"
            placeholder="Enter description"
          />
          <input
            className="p-2 m-1"
            type="number"
            // min="0" step=".01"
            name="amount"
            placeholder="0.00"
          />
          {/* </div> */}
          {/* <div className="btns flex justify-end"> */}
          <button
            type="button"
            onClick={() => setPopUpActive(false)}
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
    </div>
  );
};

export default AddExpense;
