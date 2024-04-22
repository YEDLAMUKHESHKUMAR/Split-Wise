import { URL } from "./constants";

const MyFriends = async (setFriends, user) => {
  const friendsList = await fetch(URL + "/getFriends/" + user._id).then((res) =>
    res.json()
  );
  // console.log("friendsList", friendsList);
  setFriends(friendsList);
};

export default MyFriends;
