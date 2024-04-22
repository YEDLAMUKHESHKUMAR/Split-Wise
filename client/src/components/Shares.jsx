import { URL } from "../utils/constants";

const { useState, useEffect } = require("react");

const Shares = ({ transactions, User1 }) => {
  const [LentedUsers, setLentedUsers] = useState([]);
  console.log("Lented users", LentedUsers, transactions);
  const getLentedUsers = async () => {
    let AllUsers = [];

    for (let i = 0; i < transactions.lentTo.length; i++) {
      console.log(transactions.lentTo[i].userID);
      const jsonData = await fetch(
        URL + "/getUser/" + transactions.lentTo[i].userID
      ).then((res) => res.json());
      if (!AllUsers.includes(jsonData)) {
        AllUsers.push(jsonData);
      }
    }
    setLentedUsers(AllUsers);
  };
  useEffect(() => {
    getLentedUsers();
  }, []);
  return (
    <div className="text-md">
      <div>
        {User1.name} paid {transactions.amount_paid}
        {transactions.type === "expense" ? (
          <span> and owes {transactions.lentedAmount}</span>
        ) : null}
        {/*  */}
      </div>
      {LentedUsers.map((user) => (
        <div>
          {user.username}{" "}
          {transactions.type === "expense" ? (
            <span>owes {transactions.lentedAmount}</span>
          ) : (
            <span>recieved {transactions.amount_paid}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Shares;
