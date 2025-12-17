import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Animated,
  ScrollView,
  TouchableWithoutFeedback,
  Dimensions,
  Alert,
} from "react-native";
import * as Haptics from 'expo-haptics';
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";
import AddTransactionModal from "../components/AddTransactionModal";
import DashboardScreen from "./DashboardScreen";
import TransacoesScreen from "./TransacoesScreen";
import CategoriasScreen from "./CategoriasScreen";
import GraficosScreen from "./GraficosScreen";
import ConfiguracoesScreen from "./ConfiguracoesScreen";


function AjudaScreen({ theme }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: theme.background }}>
      <Text style={[styles.screenTitle, { color: theme.text }]}>Ajuda</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        Aqui você encontra informações e suporte sobre o uso do app.{"\n\n"}
        • Dúvidas frequentes{"\n"}
        • Como gerenciar suas finanças{"\n"}
        • Contato com o suporte
      </Text>
    </ScrollView>
  );
}

function SobreScreen({ theme }) {
  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: theme.background }}>
      <Text style={[styles.screenTitle, { color: theme.text }]}>Sobre</Text>
      <Text style={[styles.text, { color: theme.textSecondary }]}>
        App Financeiro v1.0{"\n"}
        Gerencie suas finanças pessoais{"\n"}
        Desenvolvido com React Native
      </Text>
    </ScrollView>
  );
}

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function MainAppScreen() {
  const { adicionarTransacao } = useTransactions();
  const { theme, isDark } = useTheme();
  const [selectedTab, setSelectedTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const sidebarX = useRef(new Animated.Value(-220)).current;

  
  const toggleSidebar = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    Animated.spring(sidebarX, {
      toValue: sidebarOpen ? -220 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 8,
    }).start();
    setSidebarOpen(!sidebarOpen);
  };

  const closeSidebar = () => {
    if (sidebarOpen) {
      Animated.spring(sidebarX, {
        toValue: -220,
        useNativeDriver: false,
        tension: 100,
        friction: 8,
      }).start();
      setSidebarOpen(false);
    }
  };

  const handleAddTransaction = async (novaTransacao) => {
    const sucesso = await adicionarTransacao(novaTransacao);
    if (sucesso) {
      Alert.alert("Sucesso", "Transação adicionada!");
    } else {
      Alert.alert("Erro", "Não foi possível adicionar a transação");
    }
  };

 
  const sidebarItems = [
    { name: "Dashboard", icon: <Ionicons name="home-outline" size={22} color={theme.text} /> },
    { name: "Transações", icon: <Ionicons name="list-outline" size={22} color={theme.text} /> },
    { name: "Gráficos", icon: <Ionicons name="bar-chart-outline" size={22} color={theme.text} /> },
    { name: "Categorias", icon: <Ionicons name="pricetag-outline" size={22} color={theme.text} /> },
    { name: "Configurações", icon: <Ionicons name="settings-outline" size={22} color={theme.text} /> },
    { name: "Ajuda", icon: <MaterialIcons name="help-outline" size={22} color={theme.text} /> },
    { name: "Sobre", icon: <FontAwesome5 name="info-circle" size={22} color={theme.text} /> },
  ];


  const renderScreen = () => {
    const screens = {
      Dashboard: <DashboardScreen />,
      Transações: <TransacoesScreen />,
      Gráficos: <GraficosScreen />,
      Categorias: <CategoriasScreen />,
      Configurações: <ConfiguracoesScreen />,
      Ajuda: <AjudaScreen theme={theme} />,
      Sobre: <SobreScreen theme={theme} />,
    };

    return screens[selectedTab] || <DashboardScreen />;
  };

  
  const bottomTabs = [
    { tab: "Dashboard", icon: "home-outline" },
    { tab: "Transações", icon: "list-outline" },
    { tab: "Gráficos", icon: "bar-chart-outline" },
    { tab: "Configurações", icon: "settings-outline" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.backgroundSecondary }]}>
      
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Pressable 
          onPress={toggleSidebar} 
          style={({ pressed }) => [
            styles.menuBtn,
            { opacity: pressed ? 0.7 : 1, transform: [{ scale: pressed ? 0.95 : 1 }] }
          ]}
        >
          <Ionicons name="menu" size={32} color={theme.text} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: theme.text }]}>{selectedTab}</Text>

        <Ionicons name="wallet-outline" size={32} color={theme.text} />
      </View>

      
      {sidebarOpen && (
        <TouchableWithoutFeedback onPress={closeSidebar}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

   
      <Animated.View style={[styles.sidebar, { left: sidebarX, backgroundColor: theme.card, borderRightColor: theme.border }]}>
        <Text style={[styles.logo, { color: theme.text }]}>Menu</Text>

        {sidebarItems.map((item, index) => (
          <Pressable
            key={item.name}
            style={({ pressed }) => [
              styles.menuItem, 
              { 
                borderBottomColor: theme.border,
                backgroundColor: pressed ? theme.backgroundSecondary : 'transparent',
                transform: [{ scale: pressed ? 0.98 : 1 }]
              }
            ]}
            onPress={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              setSelectedTab(item.name);
              closeSidebar();
            }}
          >
            <View style={styles.iconText}>
              {item.icon}
              <Text style={[styles.menuText, { color: theme.text }]}>{item.name}</Text>
            </View>
          </Pressable>
        ))}
      </Animated.View>

     
      <View style={{ flex: 1 }}>{renderScreen()}</View>

      
      <View style={[styles.bottomTabs, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
        {bottomTabs.map((item) => {
          const isActive = selectedTab === item.tab;
          return (
            <Pressable
              key={item.tab}
              style={({ pressed }) => [
                styles.tabButton,
                { 
                  opacity: pressed ? 0.7 : 1,
                  transform: [{ scale: pressed ? 0.95 : 1 }]
                }
              ]}
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                setSelectedTab(item.tab);
                closeSidebar();
              }}
            >
              <View style={[
                styles.tabIconContainer,
                { 
                  backgroundColor: isActive ? theme.primary + '20' : 'transparent',
                }
              ]}>
                <Ionicons
                  name={isActive ? item.icon.replace('-outline', '') : item.icon}
                  size={24}
                  color={isActive ? theme.primary : theme.textSecondary}
                />
              </View>
              <Text style={[
                styles.tabText, 
                { 
                  color: isActive ? theme.primary : theme.textSecondary,
                  fontWeight: isActive ? '600' : '400'
                }
              ]}>
                {item.tab}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Botão flutuante para adicionar transação */}
      <Pressable
        style={({ pressed }) => [
          styles.floatingButton, 
          { 
            backgroundColor: theme.primary,
            transform: [{ scale: pressed ? 0.9 : 1 }]
          }
        ]}
        onPress={() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          setModalVisible(true);
        }}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>

      {/* Modal para adicionar transação */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={handleAddTransaction}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1
  },

  /* ---------------- HEADER ---------------- */

  header: {
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingTop: 30,
    borderBottomWidth: 1,
  },

  menuBtn: { 
    padding: 5 
  },

  headerTitle: { 
    fontSize: 22, 
    fontWeight: "600"
  },

  /* ---------------- SIDEBAR ---------------- */

  sidebar: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 220,
    paddingTop: 100,
    paddingHorizontal: 20,
    zIndex: 10,
    borderRightWidth: 1,
  },

  logo: { 
    fontSize: 22, 
    fontWeight: "700", 
    marginBottom: 30
  },

  menuItem: { 
    paddingVertical: 15, 
    borderBottomWidth: 1
  },

  menuText: { 
    fontSize: 16, 
    marginLeft: 10,
    fontWeight: "500"
  },

  iconText: { 
    flexDirection: "row", 
    alignItems: "center" 
  },

  /* ---------------- OVERLAY ---------------- */

  overlay: { 
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 5,
  },

  /* ---------------- BOTTOM TABS ---------------- */

  bottomTabs: {
    height: 100,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    paddingBottom: 40,
  },

  tabButton: { 
    justifyContent: "center", 
    alignItems: "center",
    flex: 1,
    paddingVertical: 8,
  },

  tabIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 4,
  },

  tabText: { 
    fontSize: 11,
    textAlign: "center",
  },

  /* ---------------- SCREENS ---------------- */

  screenTitle: { 
    fontSize: 24, 
    fontWeight: "700", 
    marginBottom: 15
  },

  text: { 
    fontSize: 16, 
    lineHeight: 22 
  },

  /* ---------------- FLOATING BUTTON ---------------- */

  floatingButton: {
    position: "absolute",
    bottom: 120,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
