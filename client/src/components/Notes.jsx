import { useState } from "react";

const { default: Comments } = require("./Comments");

const TotalNotes = ({ transactions, Notes }) => {
  const [Calender, setCalender] = useState([
    "JAN",
    "FEB",
    "MAR",
    "APR",
    "MAY",
    "JUN",
    "JUL",
    "AUG",
    "SEP",
    "OCT",
    "NOV",
    "DEC",
  ]);
  const getDate = (transDate) => {
    let date = new Date(transDate);
    return date.getDate();
  };
  const getMonth = (transDate) => {
    let date = new Date(transDate);
    return Calender[date.getMonth()];
  };
  const getYear = (transDate) => {
    let date = new Date(transDate);
    return date.getFullYear();
  };
  return (
    <div>
      
        <div className="flex-1">
          <div className="text-xs">Notes and Comments</div>
          {Notes.map((notes) => (
            <div className="text-xs " key={notes._id}>
              <div className="border text-xs p-1 m-1 rounded-lg  border-gray-300 ">
                SplitWise{" "}
                <span className="text-gray-500">
                  {getMonth(notes.date)} {getDate(notes.date)}
                </span>
                <div>{notes.updatedBy.username} updated this transaction</div>
                {notes.amount.original === notes.amount.updated ? null : (
                  <div>
                    - Cost changed from ₹{notes.amount.original} to ₹
                    {notes.amount.updated}
                  </div>
                )}
                {notes.description.original ===
                notes.description.updated ? null : (
                  <div>
                    - Cost changed from {notes.description.original} to{" "}
                    {notes.description.updated}
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* comments */}
          <div>
            <Comments transactionId={transactions._id} />
          </div>
        </div>
    </div>
  );
};

export default TotalNotes;
