// CategoriasScreen.js
import React, { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Pressable, Animated, Dimensions } from "react-native";
import { ProgressChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useTransactions } from "../context/TransactionContext";
import { useTheme } from "../context/ThemeContext";

const screenWidth = Dimensions.get('window').width;

export default function CategoriasScreen() {
  const { categorias, loading } = useTransactions();
  const { theme } = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, []);
  
  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        {[...Array(5)].map((_, index) => (
          <Animated.View
            key={index}
            style={[
              styles.card, 
              { 
                backgroundColor: theme.cardSecondary, 
                borderColor: theme.border,
                opacity: fadeAnim
              }
            ]}
          >
            <View style={[styles.skeleton, { backgroundColor: theme.border }]} />
            <View style={[styles.skeletonSmall, { backgroundColor: theme.border }]} />
          </Animated.View>
        ))}
      </View>
    );
  }
  
  if (categorias.length === 0) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }]}>
        <Animated.View style={{ opacity: fadeAnim }}>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>Nenhuma categoria ainda</Text>
          <Text style={[styles.emptySubText, { color: theme.textSecondary }]}>As categorias aparecerão quando você adicionar gastos</Text>
        </Animated.View>
      </View>
    );
  }

  const handleCategoryPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const chartConfig = {
    backgroundColor: theme.card,
    backgroundGradientFrom: theme.card,
    backgroundGradientTo: theme.card,
    color: (opacity = 1) => theme.primary + Math.round(opacity * 255).toString(16).padStart(2, '0'),
    strokeWidth: 2,
    barPercentage: 0.5,
  };

  const progressData = {
    labels: categorias.slice(0, 4).map(cat => cat.nome.substring(0, 8)),
    data: categorias.slice(0, 4).map(cat => cat.percentual / 100)
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: theme.background, opacity: fadeAnim }]}>
      {categorias.length > 0 && (
        <View style={[styles.chartCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <View style={styles.chartHeader}>
            <Ionicons name="stats-chart-outline" size={20} color={theme.primary} />
            <Text style={[styles.chartTitle, { color: theme.text, marginLeft: 8 }]}>Visão Geral</Text>
          </View>
          <ProgressChart
            data={progressData}
            width={screenWidth - 60}
            height={180}
            strokeWidth={8}
            radius={25}
            chartConfig={chartConfig}
            hideLegend={false}
          />
        </View>
      )}
      
      {categorias.map((cat, index) => (
        <View key={cat.id}>
          <Pressable
            onPress={handleCategoryPress}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: theme.cardSecondary,
                borderColor: theme.border,
                transform: [{ scale: pressed ? 0.98 : 1 }],
                opacity: pressed ? 0.8 : 1,
              }
            ]}
          >
            <View style={styles.cardContent}>
              <Text style={[styles.nome, { color: theme.text }]}>{cat.nome}</Text>
              <Text style={[styles.total, { color: theme.textSecondary }]}>R$ {cat.total?.toFixed(2) || '0.00'}</Text>
            </View>
            <View style={styles.percentContainer}>
              <Text style={[styles.percent, { color: theme.primary }]}>{cat.percentual}%</Text>
              <View style={[styles.progressBar, { backgroundColor: theme.border }]}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      backgroundColor: theme.primary,
                      width: `${cat.percentual}%`
                    }
                  ]} 
                />
              </View>
            </View>
          </Pressable>
        </View>
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  chartCard: {
    padding: 20,
    marginBottom: 20,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: 'center',
  },
  chartHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardContent: {
    flex: 1,
  },
  nome: { 
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  total: {
    fontSize: 14,
  },
  percentContainer: {
    alignItems: 'flex-end',
    minWidth: 80,
  },
  percent: { 
    fontSize: 16, 
    fontWeight: "700",
    marginBottom: 8,
  },
  progressBar: {
    width: 60,
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 10,
  },
  emptySubText: {
    fontSize: 14,
    textAlign: "center",
  },
  skeleton: {
    width: 120,
    height: 20,
    borderRadius: 4,
    opacity: 0.3,
  },
  skeletonSmall: {
    width: 60,
    height: 20,
    borderRadius: 4,
    opacity: 0.3,
  },
});
