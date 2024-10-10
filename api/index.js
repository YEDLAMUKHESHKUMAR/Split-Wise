/*
MVC : (Models,views,controllers) 
In backend we use MVC for better functionality . 
Models : To create models for Schemas .
Views : To store the render view files ... 
controllers : To make use of paths easier , we write all paths in it .  

Unfortunately in this project I have not used MVC since it is somehow disturbing the flow of the project. 
But I have the power of managing code by dividing them into multiple files and use it efficiently. 


Please check this project for MVC : https://github.com/YEDLAMUKHESHKUMAR/Accommodation-Booking-Platform

*/



if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
}
const express = require("express");

const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const User = require("./models/user");
const Friend = require("./models/friend");
const Transaction = require("./models/transaction");
const Comment = require("./models/comment");
const { check, validationResult } = require("express-validator");
const port = process.env.PORT || 3001;
const dbUrl = process.env.ATLASDB_URL;

const nodemailer = require("nodemailer");

//models

app.use(express.json());
app.use(cors());

app.use(express.json({ extended: false }));

mongoose
  .connect(dbUrl)
  .then(() => console.log("connected to db")) 
  .catch(console.error); 
 
app.get("/users", async (req, res) => {
  const users = await User.find();
  res.json(users);
});

app.get("/getUser/:id", async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id);
  res.json(user);
});

app.post(
  "/register",
  [
    check("username", "username is required").not().isEmpty(),
    check("email", "please include a valid email").isEmail(),
    check(
      "password",
      "please enter a pssword with 5 or more characters"
    ).isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: errors.array()[0].msg });
    }
    const { username, email, password, invitedBy } = req.body;
    const hashedPaswword = await bcrypt.hash(password, 10);
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "email already exists" });
      }
      const newUser = new User({
        username,
        email,
        password: hashedPaswword,
      });
      // if (friends) {
      //   newUser.friends.push(friends);
      // }
      await newUser.save();
      // res.send("registered succesfully");
      console.log(newUser);
      if (invitedBy) {
        const user = await AddFriend(invitedBy, newUser.email, res);
      }
      res.json(newUser);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server error");
    }
  }
);

app.post("/login", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ msg: errors.array()[0].msg });
  }
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "Email not found" });
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ msg: "Password is wrong" });
    }
    const token = jwt.sign({ userId: user._id }, "secretKey");
    console.log("token", token);
    res.status(200).json({ token, user });
    // res.send("logged in successfully");
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server error");
  }
});

app.get("/getFriends/:id", (req, res) => {
  const { id } = req.params;
  User.findById(id)
    .populate("friends.userID")
    .exec()
    .then((user) => {
      const populatedFriends = user.friends;
      res.json(populatedFriends);
    })
    .catch((err) => {
      console.error(err);
      // Handle error
    });
});

const AddFriend = async (currUserId, email, res) => {
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ msg: "Tell your friend to register bro !!" });
  }
  const CurrentUser = await User.findById(currUserId);
  if (!CurrentUser) {
    return res.status(404).json({ msg: "User not found" });
    //definetly user will exist , i wrote this for just to make sure
  }
  if (user._id.toString() === currUserId.toString()) {
    return res.status(401).json({ msg: "You can't add yourself as a friend!" });
  }
  for (let friend of CurrentUser.friends) {
    if (friend.userID.toString() === user._id.toString()) {
      return res.status(409).json({ msg: "Already a Friend!" });
    }
  }
  //// i dont think i need below 4 lines
  let mergeId1 = currUserId.toString() + user._id.toString();
  let mergeId2 = user._id.toString() + currUserId.toString();
  const isExist1 = await Friend.findOne({ mergeId: mergeId1 });
  const isExist2 = await Friend.findOne({ mergeId: mergeId2 });
  console.log("adding new friend", isExist1, isExist2);
  if (!isExist1 && !isExist2) {
    console.log("merging ");
    const newFriendship = new Friend({
      mergeId: mergeId1,
      user1: currUserId,
      user2: user._id,
    });
    await newFriendship.save();
    console.log("newFriendship", newFriendship);
  }
  // CurrentUser.friends.unshift({ userID: user._id });
  // await CurrentUser.save();
  // user.friends.push({ userID: CurrentUser._id });
  // if (CurrentUser.friends.includes(user._id)) {
  //   return res.status(409).json({ msg: "Already friends!" });
  // } else {
  CurrentUser.friends.push({ userID: user._id });
  user.friends.push({ userID: CurrentUser._id });
  await CurrentUser.save();
  await user.save();
  return user;

  // for now user is not required ,
  // }
};

app.post("/addFriend/:id", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  let currUserId = req.params.id;
  const { email } = req.body;
  try {
    const user = await AddFriend(currUserId, email, res);
    console.log("Added Friend", user);
    res.status(200).json([{ user, frndID: user._id }]);
    // const user = await User.findOne({ email });
    // if (!user) {
    //   return res
    //     .status(404)
    //     .json({ msg: "Tell your friend to register bro !!" });
    // }
    // const CurrentUser = await User.findById(currUserId);
    // if (!CurrentUser) {
    //   return res.status(404).json({ msg: "User not found" });
    //   //definetly user will exist , i wrote this for just to make sure
    // }
    // if (user._id.toString() === currUserId.toString()) {
    //   return res
    //     .status(401)
    //     .json({ msg: "You can't add yourself as a friend!" });
    // }
    // for (let friend of CurrentUser.friends) {
    //   if (friend.userID.toString() === user._id.toString()) {
    //     return res.status(409).json({ msg: "Already a Friend!" });
    //   }
    // }
    // //// i dont think i need below 4 lines
    // let mergeId1 = currUserId.toString() + user._id.toString();
    // let mergeId2 = user._id.toString() + currUserId.toString();
    // const isExist1 = await Friend.findOne({ mergeId: mergeId1 });
    // const isExist2 = await Friend.findOne({ mergeId: mergeId2 });
    // console.log("adding new friend", isExist1, isExist2);
    // if (!isExist1 && !isExist2) {
    //   console.log("merging ");
    //   const newFriendship = new Friend({
    //     mergeId: mergeId1,
    //     user1: currUserId,
    //     user2: user._id,
    //   });
    //   await newFriendship.save();
    //   console.log("newFriendship", newFriendship);
    // }
    // // CurrentUser.friends.unshift({ userID: user._id });
    // // await CurrentUser.save();
    // // user.friends.push({ userID: CurrentUser._id });
    // // if (CurrentUser.friends.includes(user._id)) {
    // //   return res.status(409).json({ msg: "Already friends!" });
    // // } else {
    // CurrentUser.friends.push({ userID: user._id });
    // user.friends.push({ userID: CurrentUser._id });
    // await CurrentUser.save();
    // await user.save();
    // console.log("Added Friend", user);
    // res.status(200).json([{ user, frndID: user._id }]); // for now user is not required ,
    // // }
  } catch (err) {
    console.error(err);
  }

  // const {userId}=req.query;
});

// const authenticateToken = (req, res, next) => {
//   const token = req.headers["Authorization"];
//   if (!token) {
//     return res.status(401).json({ msg: "No Token Provided" });
//   }
//   jwt.verify(token,'secretKey',(err,user)=>{
//     if(err){
//       return res.status(403).send({msg:"Invalid Token "})
//     }
//     req.user=user;
//     next();
//   })
// };

// app.get("/api/profile", authenticateToken, (req, res) => {
//   const user = User.findById(req.user._id);
//   console.log("authen user", user);
//   res.json({ user });
// });

const getMergedFriends = async (userId, FriendId) => {
  // adding transaction to merged frnds
  console.log("user frnd", userId, FriendId);
  let mergeId1 = userId.toString() + FriendId.toString();
  let mergeId2 = FriendId.toString() + userId.toString();
  // console.log(mergeId1, mergeId2);
  const isExist1 = await Friend.findOne({ mergeId: mergeId1 });
  const isExist2 = await Friend.findOne({ mergeId: mergeId2 });
  const mergedFriends = isExist1 || isExist2;
  return mergedFriends;
  // console.log(isExist1, isExist2);
};

const addTransToBoth = async (id, newTransaction) => {
  const user1 = await User.findById(id);
  // const user2 = await User.findById(FriendId);
  user1.transactions.push({ transactionId: newTransaction._id });
  // user2.transactions.push({ transactionId: newTransaction._id });
  await user1.save();
  // await user2.save();
  console.log("added to both");
};
// add transaction
app.post(
  "/add/transaction/:id",
  [
    // body('amount').isNumeric(),
    check("description", "Description should be a string").not().isEmpty(),
    check("amount")
      .isFloat()
      .custom((value) => {
        // console.log(value)
        if (value < 0) {
          throw new Error("Amound should be greater than or equal to zero");
        }
        return true;
      }),
  ],
  async (req, res) => {
    // console.log(req.body.description);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Enter valid description or amount" });
    }
    // res.status(200).json({ msg: "Hi" });
    const { description, amount, userId, Friends, date, type, currentFrnd } =
      req.body;
    let totalFriends = Friends.length;
    console.log(Friends);
    let calculatedOweAmount;
    let calculatedLentedAmount = 0;
    let totalLentedAmount = 0;
    if (type === "expense") {
      // ------------------------------------------------- calc amount---------------------------------------------------------------------------
      let calcAmount = amount / (totalFriends + 1);
      calculatedOweAmount = calcAmount;
      calculatedLentedAmount = calcAmount;
      totalLentedAmount = amount - calcAmount;
    } else {
      // console.log("currentFrnd", userId, currentFrnd, Friends[0].userID._id);
      const mergedFriends = await getMergedFriends(
        userId,
        Friends[0].userID._id
      );
      const owe = mergedFriends.owe;
      const Owner = mergedFriends.user1;
      console.log(" ------- what the shit happenned in settle ----- ");
      console.log(" prev Owe : ", owe);
      console.log("paid by : ", userId);
      console.log("lent to : ", Friends[0].userID._id);
      console.log("Owner", Owner);
      console.log(
        "type of owe and amount",
        typeof owe,
        typeof parseInt(amount, 10)
      );
      if (Owner.toString() === userId.toString()) {
        console.log("he is owner");
        if (owe === 0) {
          calculatedOweAmount = amount;
        } else if (owe < 0) {
          // owner is paying  friend
          console.log(" owner : owe < 0");

          calculatedOweAmount = amount - Math.abs(owe);
        } else {
          console.log("owner : owe > 0", parseInt(amount, 10));
          calculatedOweAmount = parseInt(amount, 10) + owe;
          console.log(calculatedOweAmount);
        }
      } else {
        console.log("not owner");
        if (owe === 0) {
          calculatedOweAmount = -amount;
        } else if (owe < 0) {
          calculatedOweAmount = owe - amount; // should remain -ve
        } else {
          calculatedOweAmount = owe - amount;
        }
      }
      // if (owe === 0) {
      //   calculatedLentedAmount = amount; // if already settled , he is giving entire money to friend
      //   if (Owner.toString() === userId.toString()) {
      //     calculatedOweAmount = amount;
      //     // calculatedLentedAmount = amount;
      //   } else {
      //     calculatedOweAmount = -amount;
      //   }
      // } else if (owe < 0) {
      //   // owner is paying  friend
      //   calculatedOweAmount = amount - Math.abs(owe);
      //   if (calculatedOweAmount > 0) {
      //     calculatedLentedAmount = calculatedOweAmount;
      //   }
      // } else {
      //   calculatedOweAmount = owe - amount;
      //   if (calculatedOweAmount < 0) {
      //     calculatedLentedAmount = Math.abs(calculatedOweAmount);
      //   }
      // }
      console.log("owe after update : ", calculatedOweAmount);
      console.log(" --------------- shit ends ------------- ");

      // console.log("lentedAmount after update : ", calculatedLentedAmount);
    }

    const newTransaction = new Transaction({
      description: description,
      amount_paid: amount,
      paidBy: userId,
      // -------------------------------------------------array of friends -------------------------------------------------
      // lentTo: FriendId,
      date: date,
      //----------------------------------- lented amount ----------------------------------------------------
      lentedAmount: calculatedLentedAmount, // don't put owe here
      // ------------------- total lented amount also put here -------------------
      totalLentedAmount,
      type,
    });
    for (let frnd of Friends) {
      newTransaction.lentTo.push({ userID: frnd.userID._id });
    }
    await newTransaction.save();
    // ----------------------------  use for loop to traverse in lentTo friends and update owe's accordingly-------------------------------------------------
    //  more than 2 people unte ??
    // make a for loop below may be ??

    for (let friend of Friends) {
      console.log("any error over here ?? ", friend.userID._id);
      const mergedFriends = await getMergedFriends(userId, friend.userID._id);
      // if (!mergedFriends) {
      //   return res.status(404).json({
      //     msg: "Sorry you don't have any relationship with this guy :(",
      //   });
      // }
      let prevOwe = mergedFriends.owe;
      // console.log(mergedFriends.user1, prevOwe);

      mergedFriends.transactions.push({ transactionId: newTransaction._id });
      if (type === "expense") {
        if (mergedFriends.user1.toString() === userId.toString()) {
          mergedFriends.owe = prevOwe + newTransaction.lentedAmount;
        } else {
          mergedFriends.owe = prevOwe - newTransaction.lentedAmount;
        }
      } else {
        mergedFriends.owe = calculatedOweAmount;
      }

      await mergedFriends.save();
      if (mergedFriends.owe === 0) {
        for (let transaction of mergedFriends.transactions) {
          mergedFriends.settledTransactions.push({
            transactionId: transaction.transactionId,
          });
        }
        mergedFriends.transactions = [];
        await mergedFriends.save();
      }
      addTransToBoth(friend.userID._id, newTransaction._id);
    }
    // console.log("mergedFriends,mergedFriendsmergedFriends", mergedFriends);
    // adding transaction to current User and frnd
    addTransToBoth(userId, newTransaction);

    // -----------------------------------------------------------------------------------------------------------------------------------------------

    // make a for loop below to add  the transactioin for every lented persons
    // console.log(totalFriends, newTransaction);
    res.status(200).json(newTransaction); // successfully wasted 3 hours by not writing this line , god!
    // res.status(200).json([{newTransaction,owe:mergedFriends.owe}]); // successfully wasted 3 hours by not writing this line , god!
  }
);

const getTransactions = (id, res) => {
  try {
    Friend.findById(id)
      .populate("transactions.transactionId")
      .exec()
      .then((user) => {
        const transactions = user.transactions;
        //  return sortDescending(transactions);
        // console.log("transactions", transactions);
        res.json([
          transactions.reverse(),
          { owe: user.owe, owner: user.user1, idOfFriends: id },
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

const getMergedSettleUps = (id, res) => {
  try {
    Friend.findById(id)
      .populate("settledTransactions.transactionId")
      .exec()
      .then((user) => {
        const transactions = user.settledTransactions;
        // console.log("transactions", transactions);
        res.json([
          transactions.reverse(),
          { owe: user.owe, owner: user.user1 },
        ]);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

// get merged trans
app.get("/getMergedTrans/:id1/:id2", async (req, res) => {
  let userId = req.params.id1;
  let FriendId = req.params.id2;
  // console.log("mergedFriend", userId, FriendId);
  // const mergedFriends = await getMergedFriends(userId, FriendId);
  try {
    const mergedFriends = await getMergedFriends(userId, FriendId);
    // console.log(mergedFriends);
    // let id = null;
    if (mergedFriends) {
      getTransactions(mergedFriends._id, res);
      // id = mergedFriends._id; // i wrote this , sometimes it is showing cannot read undefined _id
    } else {
      // res.json(re)
      res.status(404).json({
        msg: "Sorry you don't have any relationship with this guy :(",
      });
    }

    // console.log("got mergedFriend", mergedFriends);
    // res.json(mergedFriends);
  } catch (err) {
    console.error(err);
  }
  // console.log("hammayya", mergedTransactions);
  // res.json(mergedTransactions);
});

//get settled trans

app.get("/getSettleUpTrans/:id1/:id2", async (req, res) => {
  let userId = req.params.id1;
  let FriendId = req.params.id2;
  try {
    const mergedFriends = await getMergedFriends(userId, FriendId);
    if (mergedFriends) {
      getMergedSettleUps(mergedFriends._id, res);
    } else {
      res.status(404).json({
        msg: "Sorry you don't have any relationship with this guy :(",
      });
    }
  } catch (err) {
    console.error(err);
  }
});
// all expenses
app.get("/all/:id", (req, res) => {
  const id = req.params.id;
  console.log("getting all friends for ", id);
  User.findById(id)
    .populate("transactions.transactionId")
    .exec()
    .then((user) => {
      const transactions = user.transactions;
      res.json(transactions.reverse());
    })
    .catch((err) => {
      console.error(err);
    });
});
// dashboard balances
app.post("/dashboard/balances/:id", async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ errors: errors.array() });
  }
  const userId = req.params.id;
  // const {}
  const jsonData = req.body;
  let iOwe = [];
  let theyOwe = [];
  let totIOwe = 0;
  let totTheyOwe = 0;
  let totalBalance = 0;
  // console.log(jsonData);
  for (let friend of jsonData) {
    let fr = friend;
    // fr.
    const mergedFriends = await getMergedFriends(userId, friend.userID._id);
    if (!mergedFriends) return res.sendStatus(500);
    fr.owe = mergedFriends.owe;
    if (mergedFriends.owe < 0) {
      console.log("uff");
      if (mergedFriends.user1.toString() === userId.toString()) {
        iOwe.push(fr);
        totIOwe += Math.abs(mergedFriends.owe);
      } else {
        theyOwe.push(fr);
        totTheyOwe += Math.abs(mergedFriends.owe);
      }
    } else if (mergedFriends.owe > 0) {
      console.log("hmm", mergedFriends.owe);
      if (mergedFriends.user1.toString() === userId.toString()) {
        // if (mergedFriends.owe !== 0) {
        theyOwe.push(fr);
        // }
        totTheyOwe += mergedFriends.owe;
      } else {
        // if (mergedFriends.owe !== 0) {
        iOwe.push(fr);
        // }
        totIOwe += mergedFriends.owe;
      }
    }
  }
  totalBalance = totTheyOwe - totIOwe;
  res.json([
    iOwe,
    theyOwe,
    { totIOwe: totIOwe, totTheyOwe: totTheyOwe, totalBalance: totalBalance },
  ]);
  // const user = await User.findById(userId);
  // console.log()
});

//delete transaction
app.delete("/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { clicked } = req.body;
    // const {transactions} = req.body;
    //deleted original transaction
    let trans = await Transaction.findByIdAndDelete({ _id: id });
    if (!trans) return res.status(404).json({ msg: "No Transaction found" });
    if (trans) {
      const commentIds = trans.comments.map((comment) => comment.commentId);
      // Delete comments associated with this transaction
      await Comment.deleteMany({ _id: { $in: commentIds } });
    }
    // let u1 = await User.findById(trans.paidBy); // del tran in user1
    // let u2 = await User.findById(trans.lentTo); //  "   "   "  user2
    // console.log(
    //   "before delete ",
    //   u1.transactions.length,
    //   u2.transactions.length
    // );
    let transOfMerge = await Friend.updateMany(
      { transactions: { $elemMatch: { transactionId: id } } },
      { $pull: { transactions: { transactionId: id } } }
    );

    let settledTransOfMerge = await Friend.updateMany(
      { settledTransactions: { $elemMatch: { transactionId: id } } },
      { $pull: { settledTransactions: { transactionId: id } } }
    );
    console.log("settledTransOfMerge", settledTransOfMerge);
    let transOfUser1 = await User.updateOne(
      {
        _id: trans.paidBy,
        transactions: { $elemMatch: { transactionId: id } },
      },
      { $pull: { transactions: { transactionId: id } } }
    );
    // ------------------ make a for loop ------------------
    for (let lented of trans.lentTo) {
      let transOfUser2 = await User.updateOne(
        {
          _id: lented.userID,
          transactions: { $elemMatch: { transactionId: id } },
        },
        { $pull: { transactions: { transactionId: id } } }
      );
      //  more than 2 people unte ??
      // make a for loop below may be ??
      const mergedFriends = await getMergedFriends(trans.paidBy, lented.userID);
      // let user1 = await User.findById(trans.paidBy); // del tran in user1
      // let user2 = await User.findById(trans.lentTo); //  "   "   "  user2
      // console.log(
      //   "before delete ",
      //   user1.transactions.length,
      //   user2.transactions.length
      // );
      const owner = mergedFriends.user1;
      let owe = mergedFriends.owe;
      console.log("owe before update", owe);
      let updateOwe = trans.lentedAmount;
      if (trans.type === "settle") {
        updateOwe = trans.amount_paid;
      }
      if (owner.toString() === trans.paidBy.toString()) {
        owe = owe - updateOwe;
      } else {
        owe = owe + updateOwe;
      }
      console.log("owe after update", owe);

      let MatchAmount = updateOwe; // this is for checking in settle trans, to lift them up if not settled
      if (trans.paidBy.toString() === owner.toString()) {
        MatchAmount = -updateOwe;
      }
      console.log("MatchAmount", MatchAmount);

      // updating amounts
      await AmountUpdates(
        trans,
        lented.userID,
        owe,
        clicked,
        MatchAmount,
        settledTransOfMerge.matchedCount
      );
    }

    // let UpdatingOwe = await Friend.findByIdAndUpdate(
    //   // changed owe :
    //   mergedFriends._id,
    //   { owe: owe }
    // );
    // // dont console with UpdatingOwe , it is asynchronous, might process  after the next line of code
    // let updatedMergedFriends = await Friend.findById(mergedFriends._id);
    // console.log("updatedFriend owe", updatedMergedFriends.owe);
    // // expense 80,40 and settle 40 , still owe 80 , but if i delete 80 or i deleted 80 somewhere in settled then, all are settled ,  so push every trans into settled
    // if (updatedMergedFriends.owe === 0) {
    //   for (let transaction of updatedMergedFriends.transactions) {
    //     updatedMergedFriends.settledTransactions.push({
    //       transactionId: transaction.transactionId,
    //     });
    //   }
    //   updatedMergedFriends.transactions = [];
    //   await updatedMergedFriends.save();
    // }
    // if (clicked === "settle" || settledTransOfMerge.matchedCount === 1) {
    //   // i put the second condition for (what if user is not clicking settled transactions directly , instead he is clicking settled transactions from all expenses :)
    //   // this is where u need to add some of settled transactions back to expenses of merged Users
    //   if (updatedMergedFriends.owe !== 0) {
    //     let addToExpense = [];
    //     let upDatedSettle = [];
    //     let checkOwe = 0;
    //     let allSettle = updatedMergedFriends.settledTransactions.reverse();
    //     let crossed = false;

    //     for (let i = 0; i < allSettle.length; i++) {
    //       let settle = allSettle[i];
    //       // console.log(settle);
    //       const trans = await Transaction.findById(settle.transactionId);
    //       let amount = trans.lentedAmount;
    //       // console.log(amount);
    //       if (trans.type === "settle") {
    //         amount = trans.amount_paid;
    //       }
    //       if (
    //         updatedMergedFriends.user1.toString() === trans.paidBy.toString()
    //       ) {
    //         checkOwe += amount;
    //       } else {
    //         checkOwe -= amount;
    //       }
    //       if (crossed == false) {
    //         addToExpense.push(settle);
    //       } else upDatedSettle.push(settle);
    //       if (checkOwe === owe) {
    //         crossed = true;
    //       }
    //     }
    //     upDatedSettle.reverse();
    //     let ToUpdateTrans = await Friend.findById(mergedFriends._id);
    //     ToUpdateTrans.settledTransactions = [];
    //     ToUpdateTrans.settledTransactions = upDatedSettle;
    //     // let updateExpenses = ToUpdateTrans.transactions.reverse();
    //     for (let tran of addToExpense) {
    //       ToUpdateTrans.transactions.unshift(tran);
    //     }
    //     await ToUpdateTrans.save();
    //   }
    // }

    res.json(trans);
  } catch (err) {
    console.error(err);
  }
});

const AmountUpdates = async (
  trans,
  lentTo,
  owe,
  clicked,
  MatchAmount,
  MatchedCount
) => {
  const mergedFriends = await getMergedFriends(trans.paidBy, lentTo);

  let UpdatingOwe = await Friend.findByIdAndUpdate(
    // changed owe :
    mergedFriends._id,
    { owe: owe }
  );
  await UpdatingOwe.save();
  // dont console with UpdatingOwe , it is asynchronous, might process  after the next line of code
  let updatedMergedFriends = await Friend.findById(mergedFriends._id);
  console.log("updatedFriend owe", updatedMergedFriends.owe);
  // expense 80,40 and settle 40 , still owe 80 , but if i delete 80 or i deleted 80 somewhere in settled then, all are settled ,  so push every trans into settled
  if (updatedMergedFriends.owe === 0) {
    // instead of coming here only owe = 0 , you have to come everytime clicked , and do same as we do in settle , see bug  in notes for better understanding
    for (let transaction of updatedMergedFriends.transactions) {
      updatedMergedFriends.settledTransactions.push({
        transactionId: transaction.transactionId,
      });
    }
    updatedMergedFriends.transactions = [];
    await updatedMergedFriends.save();
  }
  if (clicked === "settle" || MatchedCount === 1) {
    // i put the second condition for (what if user is not clicking settled transactions directly , instead he is clicking settled transactions from all expenses :)
    // this is where u need to add some of settled transactions back to expenses of merged Users
    if (updatedMergedFriends.owe !== 0) {
      let addToExpense = [];
      let upDatedSettle = [];
      let checkOwe = 0;
      let allSettle = updatedMergedFriends.settledTransactions.reverse();
      let crossed = false;

      for (let i = 0; i < allSettle.length; i++) {
        let settle = allSettle[i];
        console.log("before prblm", settle);
        let trans = await Transaction.findById(settle.transactionId);
        let amount = trans.lentedAmount;
        console.log("after prblm", trans);
        if (trans.type === "settle") {
          amount = trans.amount_paid;
        }
        if (updatedMergedFriends.user1.toString() === trans.paidBy.toString()) {
          checkOwe += amount;
        } else {
          checkOwe -= amount;
        }
        if (crossed == false) {
          addToExpense.push(settle);
        } else upDatedSettle.push(settle);
        if (checkOwe === MatchAmount) {
          crossed = true;
        }
      }
      upDatedSettle.reverse();
      let ToUpdateTrans = await Friend.findById(mergedFriends._id);
      ToUpdateTrans.settledTransactions = [];
      ToUpdateTrans.settledTransactions = upDatedSettle;
      // let updateExpenses = ToUpdateTrans.transactions.reverse();
      for (let tran of addToExpense) {
        ToUpdateTrans.transactions.unshift(tran);
      }
      await ToUpdateTrans.save();
    }
  }
  return;
};

// edit expense

app.put(
  "/edit/:id",
  [
    // body('amount').isNumeric(),
    check("description", "Description should be a string").not().isEmpty(),
    check("amount")
      .isFloat()
      .custom((value) => {
        // console.log(value)
        if (value < 0) {
          throw new Error("Amound should be greater than or equal to zero");
        }
        return true;
      }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Enter valid description or amount" });
    }
    try {
      let { id } = req.params;
      const { amount, description, clicked, updatedBy } = req.body;
      console.log(amount, description, clicked);
      let trans = await Transaction.findById({ _id: id });
      if (!trans) return res.status(404).json({ msg: "No Transaction found" });
      let entered = false;
      // --------------------- make a for loop ------------------------------
      for (let lentedTo of trans.lentTo) {
        const mergedFriends = await getMergedFriends(
          trans.paidBy,
          lentedTo.userID
        );
        let Owe = mergedFriends.owe;
        const owner = mergedFriends.user1;
        let totalFriends = trans.lentTo.length;
        let changedAmount = amount - trans.amount_paid; // new - old  this can be used to track of unsettled expenses after editing in settle expenses
        if (owner.toString() !== trans.paidBy.toString()) {
          changedAmount *= -1;
        }

        console.log("changed amount", changedAmount);
        // get newLentedAmount

        let newLentedAmount = amount - trans.amount_paid; // for settle
        let newTotalLentedAmount = 0;
        if (trans.type === "expense") {
          let calcAmount = newLentedAmount / (totalFriends + 1);
          newTotalLentedAmount =
            trans.totalLentedAmount + (newLentedAmount - calcAmount);

          newLentedAmount = calcAmount; //
        }
        let updateOweWith = newLentedAmount; // the reason why i take this is  , don't update newLentedAmount directly by considering owner or not ,
        if (owner.toString() !== trans.paidBy.toString()) {
          updateOweWith *= -1;
        }
        //change owe
        let newOwe = Owe + updateOweWith;

        console.log("new lented , owe", newLentedAmount, newOwe);

        console.log("Oldowe, newOWe", Owe, newOwe);

        let changeLent = trans.lentedAmount + newLentedAmount;

        // changing lentedAmount in settle
        if (trans.type === "settle") {
          // i dont need this anyway ,  i am not using lentedAmount in settled trans ,
          if (changeLent < 0) changeLent = 0;
          // let canChangeLent = trans.lentedAmount - newLentedAmount;
          // if (canChangeLent < 0) {
          //   canChangeLent = 0;
          // }
          // changeLent = canChangeLent;
          // let updateSettle = await Transaction.findByIdAndUpdate(trans._id, {
          //   lentedAmount: canChangeLent,
          // });
          // let updateSettle = await Transaction.updateOne(
          //   { _id: trans._id },
          //   { $set: { lentedAmount: canChangeLent } }
          // )
        }
        if (changedAmount === 0) {
          newOwe = Owe;
          changeLent = trans.lentedAmount;
        }
        //  ---------------------------------------------------- update trans only once -------------------------
        if (entered === false) {
          let updateTrans = await Transaction.findByIdAndUpdate(trans._id, {
            amount_paid: amount,
            description: description,
            lentedAmount: changeLent,
            totalLentedAmount: newTotalLentedAmount,
          });
          // {userId:____,amount:{original:__,updated:___},description:{original:___,updated:___}}

          if (changedAmount !== 0 || description !== trans.description) {
            updateTrans.notes.push({
              updatedBy: updatedBy,
              amount: { original: trans.amount_paid, updated: amount },
              date: new Date().toISOString().slice(0, 10),
              description: {
                original: trans.description,
                updated: description,
              },
            });
          }

          await updateTrans.save();
          entered = true;
          getNotes(updateTrans._id, res);
          console.log("updated transaction : ", updateTrans);
        }

        // let changedBy = await User.findById({ _id: updatedBy });  // last changed ---> better to do it in front-end
        let settledTransOfMerge = await Friend.findOne({
          settledTransactions: { $elemMatch: { transactionId: id } },
        });
        // await settledTransOfMerge.save(); // just for checking , i saved this
        console.log("hehe", settledTransOfMerge);
        let matchedCount = 0;
        if (settledTransOfMerge) {
          matchedCount = 1;
        }
        if (changedAmount !== 0) {
          await AmountUpdates(
            trans,
            lentedTo.userID,
            newOwe,
            clicked,
            changedAmount,
            matchedCount
          );
        }
      }
      // populating user in notes

      // res.status(200).json({ notes:updateTrans.notes, changedBy: changedBy.username });

      // let updatedSettle = await Settlement.updateOne(
      //   { transactionId: id },
      //   { $set: { lentedAmount: newLentedAmount } }
      // )

      // let changedLent = changedAmount / 2;
      // if (trans.type === "settle") {
      //   changedLent = changedAmount; // no need to half , give full
      // }

      // let upDatedLentedAmount = trans.lentedAmount;
      // let calcLent = (amount - trans.amount_paid) / 2 ;
      // if(trans.type === "settle"){
      // calcLent = trans.amount_paid;
      // }

      // save new transaction first
    } catch (err) {
      console.error(err);
    }
  }
);

const getNotes = (id, res) => {
  try {
    Transaction.findById(id)
      .populate("notes.updatedBy")
      .exec()
      .then((trans) => {
        const notes = trans.notes;
        res.json(notes);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console.error(err);
  }
};

app.get("/getNotes/:id", (req, res) => {
  try {
    const { id } = req.params;
    getNotes(id, res);
  } catch (err) {
    console.error(err);
  }
});

// comments

app.post(
  "/add/comment/:id",
  [check("comment.text", "comment should not be empty").not().isEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ msg: "Must add comment" });
    }
    try {
      const { id } = req.params;
      let trans = await Transaction.findById(id);
      if (!trans) {
        return res.status(404).send({ error: "Something went wrong" });
      }
      const { user, comment } = req.body;
      const newcomment = new Comment({
        text: comment.text,
        owner: {
          id: user._id,
          username: user.username,
        },
      });
      await newcomment.save();
      try {
        const transaction = await Transaction.findById(id);
        transaction.comments.push({ commentId: newcomment._id });
        await transaction.save();
        res.send({ commentId: newcomment });
      } catch (err) {
        console.error(err);
      }
      console.log(user._id);
    } catch (err) {
      console.error(err);
    }
  }
);

app.get("/getComments/:id", (req, res) => {
  const { id } = req.params;
  getComments(id, res);
});
const getComments = (id, res) => {
  try {
    Transaction.findById(id)
      .populate("comments.commentId")
      .exec()
      .then((trans) => {
        const comments = trans.comments;
        res.json(comments);
      })
      .catch((err) => {
        console.error(err);
      });
  } catch (err) {
    console;
  }
};

app.delete("/delete/comment/:id1/:id2", async (req, res) => {
  try {
    const transactionId = req.params.id1;
    const commentId = req.params.id2;
    let trans = await Transaction.updateOne(
      { comments: { $elemMatch: { commentId: commentId } } },
      { $pull: { comments: { commentId: commentId } } }
    );
    if (!trans) {
      return res.status(404).send("No such transaction or comment");
    }

    let comment = await Comment.findByIdAndDelete(commentId);
    res.json({ comment });
  } catch (err) {
    console.error(err);
  }
});

// invitation

const crypto = require("crypto"); // Import crypto module
const Invitation = require("./models/Invitation");
function generateInvitationToken() {
  return new Promise((resolve, reject) => {
    crypto.randomBytes(32, (err, buffer) => {
      if (err) {
        reject(err);
      } else {
        const token = buffer.toString("hex");
        resolve(token);
      }
    });
  });
}

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com", // Gmail's SMTP server host
  port: 587, // Standard port for TLS/SSL
  // secure: true, // Enable TLS/SSL encryption
  auth: {
    user: "mukheshkumaryedla2004@gmail.com", // Replace with environment variable
    pass: "fofs uydj bykl mddi",
    // Replace with environment variable
  },
});
const emailInvitationTemplate = (senderName, invitationLink) => {
  return `
    Hi there,

    ${senderName} invites you to join Splitwise, a handy app for managing shared expenses!

    Click on the link below to register and start splitting expenses with ease:

    ${invitationLink}

    See you there!

    The Splitwise Team
  `;
};

app.post("/api/invitations", async (req, res) => {
  const { friendEmail, user } = req.body;
  // console.log(friendEmail,user)

  // Validate email address
  if (!isValidEmail(friendEmail)) {
    return res.status(400).json({ message: "Invalid email address" });
  }

  try {
    // Check if friend is already registered
    const existingUser = await User.findOne({ email: friendEmail });
    if (existingUser) {
      console.log("already there in your friend list");
      return res.status(400).json({ message: "Email already registered" });
    }

    // Logged-in user (replace with your authentication middleware)
    const loggedInUser = user; // Hypothetical user object

    // Generate invitation token
    const token = await generateInvitationToken();

    // Create invitation object
    const invitation = new Invitation({
      token,
      sender: loggedInUser._id,
      recipientEmail: friendEmail,
    });

    // Save invitation to database
    await invitation.save();

    // Generate invitation link (replace 'your_frontend_url' with your actual URL)
    const invitationLink = `http://localhost:3000/register?invitation=${token}`;

    // Send email invitation
    console.log("invitation will be expired in ", invitation.expiresAt);
    const emailContent = emailInvitationTemplate(
      loggedInUser.username,
      invitationLink
    ); // Add sender's name

    const mailOptions = {
      from: "Splitwise Invitations <invitations@splitwise.com>", // Replace with your sender email
      to: friendEmail,
      subject: "Join Splitwise - Manage expenses with ease!",
      html: emailContent,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ message: "Error sending invitation" });
      }
      console.log("Email sent: %s", info.messageId);
      res.json({ message: "Invitation sent successfully!" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});

app.get("/invite/register", async (req, res) => {
  const invitationToken = req.query.invitationToken;

  if (!invitationToken) {
    console.log("haha lol ");
    // return res.redirect("/register"); // Redirect to regular registration page if no invitation token
    res.status(401).json({ msg: "Invalid or missing invitation token." });
  }

  try {
    // Validate invitation token
    const invitationRecord = await Invitation.findOne({
      token: invitationToken,
    });
    if (!invitationRecord) {
      return res.status(404).json({ msg: "Invalid invitation link" });
    }

    // Check if invitation has expired (if expiration is implemented)
    if (invitationRecord.expiresAt && invitationRecord.expiresAt < Date.now()) {
      return res.status(400).json({ msg: "Invitation expired" });
    }

    // res.redirect(`/register?prefilledEmail=${invitationRecord.recipientEmail}`); // Redirect to registration with pre-filled email
    res.json(invitationRecord);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Internal server error" });
  }
});

function isValidEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

app.listen(port, () => {
  console.log("Server started");
});
