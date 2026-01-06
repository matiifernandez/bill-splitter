import { useState, useEffect } from "react";
// Import native components
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Tu nueva DB
import FriendList from "./components/FriendList";

export default function App() {
  // 1. STATE
  // In RN, we initialize empty because Storage loading is asynchronous
  const [friends, setFriends] = useState([]);
  const [bill, setBill] = useState(""); // We use string to better handle empty input
  const [tipPercentage, setTipPercentage] = useState(10);
  const [newFriendName, setNewFriendName] = useState(""); // State for the add input

  // 2. EFFECTS (Initial load)
  useEffect(() => {
    loadData();
  }, []);

  // 3. EFFECTS (Auto save on changes)
  useEffect(() => {
    saveData();
  }, [friends, bill, tipPercentage]);

  // Persistence Functions (AsyncStorage always returns Promises)
  const loadData = async () => {
    try {
      const savedFriends = await AsyncStorage.getItem("friends");
      const savedBill = await AsyncStorage.getItem("bill");
      const savedTip = await AsyncStorage.getItem("tipPercentage");

      if (savedFriends) setFriends(JSON.parse(savedFriends));
      if (savedBill) setBill(savedBill);
      if (savedTip) setTipPercentage(Number(savedTip));
    } catch (e) {
      console.error("Error loading data", e);
    }
  };

  const saveData = async () => {
    try {
      await AsyncStorage.setItem("friends", JSON.stringify(friends));
      await AsyncStorage.setItem("bill", bill.toString());
      await AsyncStorage.setItem("tipPercentage", tipPercentage.toString());
    } catch (e) {
      console.error("Error saving data", e);
    }
  };

  // 4. BUSINESS LOGIC (Identical to Web, just parsing the bill)
  const billAmount = Number(bill) || 0;
  const totalWithTip = billAmount + billAmount * (tipPercentage / 100);

  const totalIndividualExpenses = friends.reduce(
    (acc, friend) => acc + friend.expense,
    0
  );
  const remainingToSplit = totalWithTip - totalIndividualExpenses;
  const splitBaseAmount =
    friends.length > 0 ? remainingToSplit / friends.length : 0;

  // Actions
  const addFriend = () => {
    if (!newFriendName.trim()) return;
    const newFriend = { id: Date.now(), name: newFriendName, expense: 0 };
    setFriends([...friends, newFriend]);
    setNewFriendName(""); // Clear input
  };

  const deleteFriend = (id) => {
    Alert.alert("Delete Friend", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, delete",
        onPress: () => setFriends(friends.filter((f) => f.id !== id)),
      },
    ]);
  };

  const handleExpenseChange = (id, value) => {
    // RN returns empty string if you delete everything, need to handle it
    const numValue = value === "" ? 0 : parseFloat(value);

    setFriends(
      friends.map((f) =>
        f.id === id ? { ...f, expense: isNaN(numValue) ? 0 : numValue } : f
      )
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>💰 Bill Splitter</Text>

      <ScrollView style={styles.scrollView}>
        {/* Bill Card */}
        <View style={styles.card}>
          <Text style={styles.label}>Total Bill ($)</Text>
          <TextInput
            style={styles.inputLarge}
            keyboardType="numeric"
            value={bill}
            onChangeText={setBill} // RN passes the text directly
            placeholder="0.00"
          />

          <Text style={styles.label}>Tip: {tipPercentage}%</Text>
          {/* Using simple buttons for tip for now */}
          <View style={styles.tipButtons}>
            {[0, 10, 15, 20].map((tip) => (
              <TouchableOpacity
                key={tip}
                onPress={() => setTipPercentage(tip)}
                style={[
                  styles.tipBtn,
                  tipPercentage === tip && styles.tipBtnActive,
                ]}
              >
                <Text
                  style={[
                    styles.tipText,
                    tipPercentage === tip && styles.tipTextActive,
                  ]}
                >
                  {tip}%
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={styles.summaryText}>
            Total: ${totalWithTip.toFixed(2)}
          </Text>
          <Text style={styles.summarySubtext}>
            Remaining to split: ${remainingToSplit.toFixed(2)}
          </Text>
        </View>

        {/* Add Friend */}
        <View style={styles.addFriendContainer}>
          <TextInput
            style={styles.inputName}
            placeholder="Friend's name..."
            value={newFriendName}
            onChangeText={setNewFriendName}
          />
          <TouchableOpacity onPress={addFriend} style={styles.addBtn}>
            <Text style={styles.addBtnText}>Add</Text>
          </TouchableOpacity>
        </View>

        {/* Friend List Component */}
        <FriendList
          friends={friends}
          splitBaseAmount={splitBaseAmount}
          onUpdateExpense={handleExpenseChange}
          onDeleteFriend={deleteFriend}
        />

        {/* Extra space at the bottom for scroll */}
        <View style={{ height: 50 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  scrollView: { flex: 1 },
  card: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 15,
    marginBottom: 20,
    elevation: 3,
  },
  label: { fontSize: 14, color: "#7f8c8d", marginBottom: 5 },
  inputLarge: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2c3e50",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    marginBottom: 20,
  },
  tipButtons: { flexDirection: "row", gap: 10 },
  tipBtn: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: "#ecf0f1",
  },
  tipBtnActive: { backgroundColor: "#2c3e50" },
  tipText: { color: "#2c3e50", fontWeight: "bold" },
  tipTextActive: { color: "white" },
  summary: { marginBottom: 20, alignItems: "center" },
  summaryText: { fontSize: 22, fontWeight: "bold", color: "#2c3e50" },
  summarySubtext: { color: "#7f8c8d" },
  addFriendContainer: { flexDirection: "row", marginBottom: 20, gap: 10 },
  inputName: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 10,
    fontSize: 16,
  },
  addBtn: {
    backgroundColor: "#2980b9",
    justifyContent: "center",
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  addBtnText: { color: "white", fontWeight: "bold" },
});
