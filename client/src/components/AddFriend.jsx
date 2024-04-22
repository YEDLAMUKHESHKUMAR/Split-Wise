import { useState, useContext, useEffect } from "react";
import { UserContext } from "../utils/userContext";
import { URL } from "../utils/constants";
import { Link } from "react-router-dom";
import UserFriend from "./UserFriend";
import MyFriends from "../utils/getMyFriends";
import InvitationForm from "./Invite";
import Cookies from "js-cookie"

const AddFriend = () => {
  const { user ,login} = useContext(UserContext);
  const [Friends, setFriends] = useState([]);
  // console.log("Friends", Friends);
  // const MyFriends = async () => {
  //   const friendsList = await fetch(URL + "/getFriends/" + user._id).then(
  //     (res) => res.json()
  //   );
  //   console.log("friendsList", friendsList);
  //   setFriends(friendsList);
  // };
  useEffect(() => {
    const fetchFriends = async () => {
      // console.log("user changed ")
      if (user && user.friends) {
        // user.friends.map((friend))
        // const friendsList = await fetch(URL + "/getFriends/" + user._id).then(
        //   (res) => res.json()
        // );
        // // console.log("friendsList", friendsList);
        // setFriends(friendsList);
        MyFriends(setFriends,user);
        // console.log("got some friends ??", Friends);
      } else {
        setFriends([]);
      }
    };
    fetchFriends();
  }, [user]);

  //   console.log("user from AddFriend", user);
  const AddFriend = async (data) => {
    // console.log("data", data);
    if (Cookies.get("user") === undefined) {
      alert("please login first");
      window.location = "/login";
    } else if (user._id !== JSON.parse(Cookies.get("user"))._id) {
      alert("something went wrong");
      login(JSON.parse(Cookies.get("user")));
    } else {
    const jsonData = await fetch(URL + "/addFriend/" + user._id, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (jsonData.status !== 200) {
      const result = await jsonData.json();
      alert(result.msg);
      // console.log("jsonData bad",result);
    } else {
      const result = await jsonData.json();
      // console.log("result", result);
      const newFrnd = result[0].user;
      newFrnd.FrndId = result[0].frndID;
      // console.log("New frnd", newFrnd);

      MyFriends(setFriends,user);
      // setFriends((Friends) => [...Friends, newFrnd]);
      // fetchFriends()
    }
  }
    // console.log("jsonData", jsonData.status);
  };
  return (
    <div>
      {user ? (
        <div>
          <div>
            {/* add new friend */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                let data = {
                  email: formData.get("email"),
                };
                AddFriend(data);
              }}
            >
              <input
                className="border border-black"
                name="email"
                placeholder="enter email of friend"
                type="email"
              />
              <button
                type="submit"
                className="bg-slate-700 ml-2 px-4 py-1 text-white"
              >
                Add
              </button>
            </form>
          </div>
          <div>

            {/* show old friends */}
            <div className="font-medium">Your Friends</div>
            {Friends.length !== 0 ? (
              <div>
                {Friends.map(
                  (friend) => (
                    //   friend.userID.username ? (
                    <Link key={friend._id} to={"/friends/" + friend.userID._id}>
                      <div className="bg-white  transition-colors group duration-300 ease-in-out hover:bg-slate-100  p-1 text-md text-gray-500 ">
                        {friend.username || friend.userID.username}
                      </div>
                      {/* <UserFriend userfriend={friend}/> */}
                    </Link>
                  )
                  //   ) : null

                  // <div>hi</div>
                )}
              </div>
            ) : (
              <div>No friends yet!</div>
            )}
          </div>
          <InvitationForm/>
        </div>
      ) : null}
    </div>
  );
};

export default AddFriend;
