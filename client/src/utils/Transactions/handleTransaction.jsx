import Cookies from "js-cookie";
// import { useEffect, useState } from "react";
import { URL } from "../constants";

const handleTransaction = async (
  Transaction,
  // id,
  user,
  login,
  setPopUpActive,
  setPopSettled,
  setShowTransAfterSubmit,
  ShowTransAfterSubmit
) => {
  // if()
  // console.log(Transaction, id, user._id);
  if (Cookies.get("user") === undefined) {
    alert("please login first");
    window.location = "/login";
  } else if (user._id !== JSON.parse(Cookies.get("user"))._id) {
    alert("something went wrong");
    login(JSON.parse(Cookies.get("user")));
  } else {
    // Transaction.currentFrnd = id;

    const jsonData = await fetch(URL + "/add/transaction/" + user._id, {
      method: "POST",
      headers: { "Content-Type": "application/json" },

      body: JSON.stringify(Transaction),
    }).then((res) => res.json());
    if (jsonData.msg) {
      // console.log(jsonData);
      // const data = await jsonData.json();
      // console.log(data);
      alert(jsonData.msg);
    } else {
      setPopUpActive(false);
      setPopSettled(false);
    }
  }
  setShowTransAfterSubmit(!ShowTransAfterSubmit);
};

export default handleTransaction;
