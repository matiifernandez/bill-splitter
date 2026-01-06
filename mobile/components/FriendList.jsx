import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function FriendList({
  friends,
  splitBaseAmount,
  onUpdateExpense,
  onDeleteFriend,
}) {
  if (friends.length === 0) {
    return <Text style={styles.emptyText}>No friends yet...</Text>;
  }

  return (
    <View>
      {friends.map((friend) => {
        const totalForFriend = splitBaseAmount + friend.expense;

        return (
          <View key={friend.id} style={styles.card}>
            <View style={styles.infoContainer}>
              <Text style={styles.name}>{friend.name}</Text>
              <View style={styles.row}>
                <Text style={styles.details}>
                  Base: ${splitBaseAmount.toFixed(2)} + Extra:
                </Text>
                {/* textInput in RN handles only strings we need to convert */}
                <TextInput
                  style={styles.input}
                  keyboardType="numeric"
                  placeholder="0"
                  value={friend.expense.toString()}
                  onChangeText={(text) => onUpdateExpense(friend.id, text)}
                />
              </View>
            </View>

            <View style={styles.totalContainer}>
              <Text style={styles.totalAmount}>
                ${totalForFriend.toFixed(2)}
              </Text>

              <TouchableOpacity
                onPress={() => onDeleteFriend(friend.id)}
                style={styles.deleteBtn}
              >
                <Text style={styles.deleteText}>✕</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
    </View>
  );
}

// In RN the styles are defined with StyleSheet.create and they are JS objects
const styles = StyleSheet.create({
  emptyText: { textAlign: "center", color: "#888", marginTop: 20 },
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: "row", // Flexbox is the default in RN
    justifyContent: "space-between",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2, // Shadow for Android
  },
  infoContainer: { flex: 1 },
  name: { fontWeight: "bold", fontSize: 16 },
  row: { flexDirection: "row", alignItems: "center", marginTop: 5 },
  details: { fontSize: 12, color: "#666" },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    width: 40,
    textAlign: "center",
    marginLeft: 5,
    padding: 0,
  },
  totalContainer: { alignItems: "flex-end" },
  totalAmount: { fontWeight: "bold", color: "#2ecc71", fontSize: 16 },
  deleteBtn: {
    backgroundColor: "#ff4444",
    borderRadius: 4,
    padding: 4,
    marginTop: 5,
  },
  deleteText: { color: "white", fontSize: 12, fontWeight: "bold" },
});
