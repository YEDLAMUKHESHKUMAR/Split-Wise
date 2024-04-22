import { useContext, useEffect } from "react";
import AddFriend from "./AddFriend";
import AllExpenses from "./AllExpenses";

import DashBoard from "./DashBoard";
import { Link } from "react-router-dom";
import { UserContext } from "../utils/userContext";

const LeftComponents = () => {
  const { user } = useContext(UserContext);

  return (
    <div>
      {user ? (
        <div>
          <div>
            <Link to={"/all"}>
              <div className="bg-slate-400 p-1 m-1">All Expenses</div>
            </Link>
            <Link to={"/dashboard"}>
              <div className="bg-slate-400  p-1 m-1">Dashboard</div>
            </Link>
            <div className="flex flex-col justify-center">
              <div>Friends</div>
              <AddFriend />
            </div>
          </div>
        </div>
      ) : (
        // <div></div>
        ""
      )}
    </div>
  );
};

export default LeftComponents;
