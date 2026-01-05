// It's not longer required to import React in scope for JSX files in React 17+
// But we'll import useState for state management.
import { useState } from "react";
// Let's imagine this as our temporal schema.
import "./App.css";
// Import my new Friend List component
import FriendList from "./components/FriendList.jsx";

function App() {
  // 1. State (instance variables @bill, @tip, @friends)
  const [bill, setBill] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);
  const [friends, setFriends] = useState([]);

  // 2. Logic (Model Methods and controllers)

  // Add a friend (Think about it as Friend.create)
  const addFriend = (name) => {
    const newFriend = { id: Date.now(), name: name, expense: 0 };
    setFriends([...friends, newFriend]); // IMPORTANT: In react, always create a new array/object to trigger re-render
  };

  // Update a friend's expense (Think about it as Friend.update)
  const handleExpenseChange = (id, value) => {
    // Map through friends and update the one with matching id
    const updatedFriends = friends.map((friend) => {
      if (friend.id === id) {
        return { ...friend, expense: Number(value) };
      }
      return friend;
    });

    setFriends(updatedFriends);
  };
  // Calculate each friend's share
  const tipMultiplier = 1 + tipPercentage / 100;
  const sharedBillWithTip = bill * tipMultiplier;
  const splitBaseAmount =
    friends.length > 0 ? sharedBillWithTip / friends.length : 0;

  return (
    <div className="container">
      <h1>💰 Bill Splitter</h1>
      <p>Calculate how to split a bill among friends easily!</p>
      {/* Section 1: inputs for bill and tip  */}
      <div className="card">
        <label>Total ($)</label>
        <input
          type="number"
          value={bill}
          onChange={(e) => setBill(Number(e.target.value))}
        />
        <label>Tip {tipPercentage}(%)</label>
        <input
          type="range"
          min="0"
          max="30"
          value={tipPercentage}
          onChange={(e) => setTipPercentage(Number(e.target.value))}
        />
      </div>

      {/* Section 2: Real time summary */}
      <h3>Base with Tip: ${sharedBillWithTip.toFixed(2)}</h3>

      {/* Section 3: Add friends */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const name = e.target.friendName.value;
          if (name) {
            addFriend(name);
            e.target.reset();
          }
        }}
      >
        <input type="text" name="friendName" placeholder="Friend's Name" />
        <button type="submit">Add Friend</button>
      </form>
      {/* Section 4: Friend List Component - it was replaced for a component */}
      <FriendList
        friends={friends}
        splitBaseAmount={splitBaseAmount}
        onUpdateExpense={handleExpenseChange}
      />
    </div>
  );
}

export default App;
