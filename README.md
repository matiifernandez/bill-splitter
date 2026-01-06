# 💰 Bill Splitter (React + React Native)

A bill splitting application built with a **monorepo** architecture to share business logic concepts between a Web Application and a Native Mobile Application.

> **Note:** This project was created to transition from a **Ruby on Rails** background into the **React** ecosystem, focusing on complex state management and cross-platform logic patterns.

## 📱 Quick Look

The project contains two independent applications sharing the same architectural philosophy:

| Platform   | Stack               | Path      |
| :--------- | :------------------ | :-------- |
| **Web**    | React + Vite + CSS  | `/web`    |
| **Mobile** | React Native + Expo | `/mobile` |

## ✨ Key Features

- **Real-time Calculation:** Automatically recalculates total, tip, and split per person instantly.
- **State Management (CRUD):** Dynamically add, remove, and update friends in the list.
- **Individual Expenses:** Support for adding specific extra costs to specific people (Subtractive logic).
- **Data Persistence:**
  - Web: Uses `localStorage`.
  - Mobile: Uses `AsyncStorage`.
- **UX Adaptation:** Handles mobile keyboard interactions (`KeyboardAvoidingView`) and responsive web design.

## 🛠 Prerequisites

- Node.js (v20 Recommended)
- npm or yarn
- **For Mobile:** "Expo Go" app installed on your phone (iOS/Android).

## 🚀 How to Run

Clone the repository and navigate to the project folder.

### 1. Run Web Version

```bash
cd web
npm install
npm run dev
The app will run at http://localhost:5173.

Run Mobile Version
cd mobile
npm install
npx expo start --

Architecture & Key Learnings
Moving from a Rails MVC mindset to React's Component mindset:

State Lifting: The main state lives in the parent (App) and flows down to child components via props (Unidirectional Data Flow).

Immutability: Instead of mutating objects directly (like in Ruby), this project uses .map, .filter, and the spread operator ... to create new state references.

Hooks: Utilization of useEffect to handle side effects, specifically for syncing state with local storage (acting similar to Rails callbacks like after_save).

📄 License
This project is open source and available under the MIT license.
```
