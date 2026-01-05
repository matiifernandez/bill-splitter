// src/components/FriendList.jsx

// We receive 'onUpdateExpense' y 'splitBaseAmount'
function FriendList({ friends, splitBaseAmount, onUpdateExpense }) {
  if (friends.length === 0) {
    return <p style={{ color: "#888" }}>No friends yet...</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {friends.map((friend) => {
        // Individual total for this friend
        const totalForFriend = splitBaseAmount + friend.expense;

        return (
          <li
            key={friend.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              background: "#f9f9f9",
              padding: "10px",
              marginBottom: "5px",
              borderRadius: "5px",
            }}
          >
            <div>
              <strong>{friend.name}</strong>
              <div style={{ fontSize: "0.8rem", color: "#666" }}>
                Base: ${splitBaseAmount.toFixed(2)} + Extra:
                {/* INPUT FOR INDIVIDUAL EXPENSE */}
                <input
                  type="number"
                  value={friend.expense}
                  placeholder="0"
                  style={{
                    width: "60px",
                    marginLeft: "5px",
                    display: "inline-block",
                    margin: "0 5px",
                  }}
                  // Here's the magic: We notify the parent (App) that this ID changed
                  onChange={(e) => onUpdateExpense(friend.id, e.target.value)}
                />
              </div>
            </div>

            <div style={{ fontWeight: "bold", color: "#2ecc71" }}>
              ${totalForFriend.toFixed(2)}
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default FriendList;
