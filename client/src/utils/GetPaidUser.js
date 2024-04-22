import { useState, useEffect } from "react";
import { useContext } from "react";
import { UserContext } from "./userContext";
import { URL } from "./constants";
import { useParams } from "react-router-dom";

const GetPaidUser = (transaction) => {
  const { id } = useParams();
  // console.log("is there any friend id : ", id);
  const [PaidUser, setPaidUser] = useState("");
  const { user } = useContext(UserContext);
  useEffect(() => {
    if (id === undefined || id === null) {
      setPaidUser("");
      
    } else {
      getUser();
    }
  }, [id]);
  const getUser = async () => {
    // i made this call to get username

    // console.log("filterr ledhu anta : ", transaction);
    // let getId = transaction.lentTo.filter((lented) => lented.userID === id);
    let getId = false;
    transaction.lentTo.forEach((obj) => {
      // console.log("blah blah blah : ", obj.userID, id);
      if (obj.userID === id) {
        getId = true;
      }
    });
    // console.log(
    //   "muk lent muk anta : lol skdajfa;olesdkjfaslekdfkjlsdfkjsdf : ",
    //   getId
    // );
    if (getId === false) setPaidUser("You");
    else {
      const jsonData = await fetch(URL + "/getUser/" + id).then((res) =>
        res.json()
      );
      // check if user exists ... then apply operations
      // if (user._id.toString() === jsonData._id.toString()) {
      //   setPaidUser("you");
      // } else {
      setPaidUser(jsonData.username);
    }
    // }
  };
  return PaidUser;
};

export default GetPaidUser;
