import { URL } from "../utils/constants";
import Cookies from "js-cookie";
import { UserContext } from "../utils/userContext";
import { useContext, useEffect } from "react";
import { useState } from "react";

const Comments = (props) => {
  const { user, login } = useContext(UserContext);
  const [Trigger, setTrigger] = useState(false);
  const [Comments, setComments] = useState([]);
  const { transactionId } = props;
  useEffect(() => {
    getComments(transactionId);
  }, [Trigger]);
  console.log("Comments state", Comments);
  const getComments = async (transactionId) => {
    const jsonData = await fetch(URL + "/getComments/" + transactionId).then(
      (res) => res.json()
    );
    console.log("comments are ", jsonData);
    setComments(jsonData);
  };

  const AddComment = async (comment) => {
    if (Cookies.get("user") === undefined) {
      alert("please login first");
      window.location = "/login";
    } else if (JSON.parse(Cookies.get("user"))._id !== user._id) {
      alert("something went wrong,please try again");
      login(JSON.parse(Cookies.get("user")));
    } else {
      const jsonData = await fetch(URL + "/add/comment/" + transactionId, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ comment, user }),
      }).then((res) => res.json());

      console.log("comment", jsonData);
      if (jsonData.msg) {
        alert(jsonData.msg);
      } else if (jsonData.error) {
        alert(jsonData.error);
        window.location.reload();
      }
      // else {
      // setComments([...Comments, jsonData]);
      // }
      setTrigger(!Trigger);
      // you can remove above line , and add this to useState to call getComments everytime
    }
  };
  const deleteComment = async (transactionId, commentId) => {
    if (Cookies.get("user") === undefined) {
      alert("please login first");
      window.location = "/login";
    } else if (JSON.parse(Cookies.get("user"))._id !== user._id) {
      alert("something went wrong,please try again");
      login(JSON.parse(Cookies.get("user")));
    } else {
      const jsonData = await fetch(
        URL + "/delete/comment/" + transactionId + "/" + commentId,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      ).then((res) => res.json());
      if (jsonData.msg) {
        alert(jsonData.msg);
      } else {
        setTrigger(!Trigger);
        // setComments(
        //   Comments.filter((cmt) => cmt.commentId._id !== jsonData.comment._id)
        // );
        console.log("deleted comments", jsonData);
      }
    }
  };
  return (
    <div key={transactionId}>
      <div>
        {Comments.map((comment) => (
          <div
            className="border text-xs p-1 m-1 rounded-md  border-gray-300"
            key={comment._id}
          >
            <div className="top">
              <div className="flex justify-between items-center">
                <div className="font-bold">
                  {comment.commentId.owner.username}
                </div>
                {comment.commentId.owner.id.toString() ===
                user._id.toString() ? (
                  <div className="text-red-600">
                    <div
                      className="cursor-pointer"
                      // what if clicked on deleted comment from another tab
                      onClick={() =>
                        deleteComment(transactionId, comment.commentId._id)
                      }
                    >
                      X
                    </div>
                  </div>
                ) : null}{" "}
              </div>
            </div>
            <div>{comment.commentId.text}</div>
          </div>
        ))}
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const comment = {
            text: formData.get("text"),
          };
          AddComment(comment);
        }}
      >
        <textarea
          name="text"
          id="comment"
          cols="25"
          rows="3"
          placeholder="Add a comment"
          className="text-xs"
        ></textarea>
        <br />
        <button
          className="bg-orange-500 text-white px-2 rounded-sm text-sm "
          type="submit"
        >
          Post
        </button>
      </form>
    </div>
  );
};
export default Comments;
