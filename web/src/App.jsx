// It's not longer required to import React in scope for JSX files in React 17+
// But we'll import useState for state management and useEffect for local storage.
import { useState, useEffect } from "react";
// Let's imagine this as our temporal schema.
import "./App.css";
// Import my new Friend List component
import FriendList from "./components/FriendList.jsx";

function App() {
  // 1. State (instance variables @bill, @tip, @friends)
  const [bill, setBill] = useState(() => {
    const savedBill = localStorage.getItem("bill");
    // convert to number or default to 0 to avoid errors.
    return savedBill ? Number(savedBill) : 0;
  });
  const [tipPercentage, setTipPercentage] = useState(() => {
    const savedTip = localStorage.getItem("tipPercentage");
    return savedTip ? Number(savedTip) : 0;
  });
  const [friends, setFriends] = useState(() => {
    const savedFriends = localStorage.getItem("friends");
    if (savedFriends) {
      return JSON.parse(savedFriends);
    } else {
      return [];
    }
  });

  // Sync friends to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem("friends", JSON.stringify(friends));
  }, [friends]);

  // Sync bill and tips to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("bill", bill);
    localStorage.setItem("tipPercentage", tipPercentage);
  }, [bill, tipPercentage]); // to execute when bill or tipPercentage changes

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

  // Delete a friend (Think about it as Friend.delete)
  const deleteFriend = (id) => {
    // Filter out the friend with the matching id
    const updatedFriends = friends.filter((friends) => friends.id !== id);
    setFriends(updatedFriends);
  };

  // Calculate each friend's share
  const totalWithTip = bill + (bill * tipPercentage) / 100;
  const totalIndividualExpenses = friends.reduce((acc, friend) => {
    return acc + friend.expense;
  }, 0);

  const remainingToSplit = totalWithTip - totalIndividualExpenses;
  const splitBaseAmount =
    friends.length > 0 ? remainingToSplit / friends.length : 0;

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
      <h3>Total with Tip: ${totalWithTip.toFixed(2)}</h3>
      <p style={{ fontSize: "0.9rem", color: "#666" }}>
        (Extra expense: ${totalIndividualExpenses} | $
        {remainingToSplit.toFixed(2)} to split)
      </p>
      {remainingToSplit < 0 && (
        <p style={{ color: "red" }}>
          ⚠️ Warning: Extra expenses exceed total bill with tip!
        </p>
      )}

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
        onDeleteFriend={deleteFriend}
      />
    </div>
  );
}

export default App;
