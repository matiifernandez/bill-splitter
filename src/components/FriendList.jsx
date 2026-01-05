function FriendList({ friends, splitAmount }) {
  if (friends.length === 0) {
    return <p style={{ color: "#888" }}>No friends added yet.</p>;
  }
  return (
    <ul>
      {friends.map((friend) => (
        <li key={friend.id}>
          {friend.name} pays <strong>${splitAmount.toFixed(2)}</strong>
        </li>
      ))}
    </ul>
  );
}

export default FriendList;
