import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "./userContext";
import { URL } from "./constants";
const GetLentedUser = (id) => {
  //   const [PaidUser, setPaidUser] = useState("");
  const [LentedUser, setLentedUser] = useState("");
  // console.log("LentedUser", LentedUser);
  const { user } = useContext(UserContext);
  useEffect(() => {
    getLentedUser();
  }, [id]); // it didn't worked when i put id at starting , but it works now ??
  const getLentedUser = async () => {
    const jsonData = await fetch(URL + "/getUser/" + id).then((res) =>
      res.json()
    );
    if (user._id.toString() === jsonData._id.toString()) {
      // it is required
      setLentedUser("you");
    } else {
      setLentedUser(jsonData.username);
    }
  };
  return LentedUser;
};

export default GetLentedUser;
