// AppRoutes.js
import React, { useState } from "react";
import { View } from "react-native";
import DashboardScreen from "./DashboardScreen";

export default function AppRoutes() {
  const [selected, setSelected] = useState("Dashboard");

  return (
    <View style={{ flex: 1 }}>
      {selected === "Dashboard" && <DashboardScreen />}
    </View>
  );
}
