import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function BarChart({ data, theme }) {
  if (!data || data.length === 0) return null;

  const maxValue = Math.max(...data.map(item => item.value));

  return (
    <View style={styles.container}>
      {data.map((item, index) => {
        const height = maxValue > 0 ? (item.value / maxValue) * 150 : 0;
        return (
          <View key={index} style={styles.barContainer}>
            <View style={styles.barWrapper}>
              <Text style={[styles.valueText, { color: theme.text }]}>
                R$ {item.value.toFixed(0)}
              </Text>
              <View
                style={[
                  styles.bar,
                  {
                    height: height,
                    backgroundColor: item.value >= 0 ? theme.success : theme.danger,
                  },
                ]}
              />
            </View>
            <Text style={[styles.labelText, { color: theme.textSecondary }]} numberOfLines={1}>
              {item.label}
            </Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingHorizontal: 10,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  barWrapper: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: 170,
  },
  bar: {
    width: '100%',
    minHeight: 5,
    borderRadius: 4,
    marginTop: 4,
  },
  valueText: {
    fontSize: 11,
    fontWeight: '600',
    marginBottom: 4,
  },
  labelText: {
    fontSize: 10,
    marginTop: 4,
    textAlign: 'center',
  },
});
