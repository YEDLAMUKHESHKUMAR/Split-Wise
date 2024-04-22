import { URL } from "../constants";

const getMergedSettleUps = async (
  user,
  friendId,
  setMergedSettleUps,
  setNotFrnd
) => {
  // console.log("jsonSettle");

  const jsonSettle = await fetch(
    URL + "/getSettleUpTrans/" + user._id + "/" + friendId
  ).then((res) => res.json());
  // console.log("jsonSettle", jsonSettle);
  if (!jsonSettle.msg) {
    setMergedSettleUps(jsonSettle[0]);
    setNotFrnd(null);
  } else {
    setNotFrnd(jsonSettle.msg);
  }
};

export default getMergedSettleUps;
