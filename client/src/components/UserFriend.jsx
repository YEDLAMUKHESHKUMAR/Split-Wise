import { useContext } from "react";
import { UserContext } from "../utils/userContext";
import { useParams } from "react-router-dom";

import Login from "./Login";
import AddTransaction from "./AddTransaction";
const UserFriend = (props) => {
  const { id } = useParams();

  const { user } = useContext(UserContext);
  const userFriend = props;
  // console.log("currFriend ", id);
  return (
    <div>
      {user ? (
        <div>
          <AddTransaction friendId={id} />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UserFriend;
