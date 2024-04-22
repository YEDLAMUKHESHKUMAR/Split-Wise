import { useEffect, useState } from "react";
const Owes = (props) => {
  const { Owe, Owner, user1, user2, user, type, id } = props;
  const [Show, setShow] = useState("");
  const [Show2, setShow2] = useState("");
  const [Id, setId] = useState(id);
  useEffect(() => {
    if (type === "expense") {
      setShow("owe");
      setShow2("owes");
    } else {
      setShow("paid");
      setShow2("paid");
    }
  }, [id]); // or you can remove dependicies to call it everytime , but time waste
  console.log("id from owes", id, Owe);
  return (
    <div>
      {Owe === 0 ? (
        <div>All settled</div>
      ) : user._id.toString() === Owner.toString() ? (
        Owe < 0 ? (
          <div className="text-red-500">
            {user1} {Show} {user2}{" "}
            {type === "expense" ? <span>₹{-Owe}/-</span> : ""}
            {/* i owe someone */}
          </div>
        ) : (
          <div className="text-green-500">
            {user2} {Show2} {user1}{" "}
            {type === "expense" ? <span>₹{Owe}/-</span> : ""}
            {/* someone owes me */}
          </div>
        )
      ) : Owe < 0 ? (
        <div className="text-green-500">
          {user2} {Show} {user1}{" "}
          {type === "expense" ? <span>₹{-Owe}/-</span> : ""}
        </div>
      ) : (
        <div className="text-red-500">
          {user1} {Show} {user2}{" "}
          {type === "expense" ? <span>₹{Owe}/-</span> : ""}
          {/* i owe someone */}
        </div>
      )}
    </div>
  );
};

export default Owes;
