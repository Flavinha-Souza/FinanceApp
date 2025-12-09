import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export default function PieChart({ data, size = 200, theme }) {
  if (!data || data.length === 0) return null;

  const total = data.reduce((sum, item) => sum + item.value, 0);
  if (total === 0) return null;

  const radius = size / 2;
  const strokeWidth = 40;
  const innerRadius = radius - strokeWidth;
  const circumference = 2 * Math.PI * innerRadius;

  let currentAngle = -90;

  const colors = ['#007AFF', '#FF453A', '#30D158', '#FFD60A', '#BF5AF2', '#FF9F0A', '#5E5CE6'];

  return (
    <View style={styles.container}>
      <Svg width={size} height={size}>
        <G rotation={0} origin={`${radius}, ${radius}`}>
          {data.map((item, index) => {
            const percentage = (item.value / total) * 100;
            const strokeDashoffset = circumference - (circumference * percentage) / 100;
            const rotation = currentAngle;
            currentAngle += (percentage / 100) * 360;

            return (
              <Circle
                key={index}
                cx={radius}
                cy={radius}
                r={innerRadius}
                stroke={colors[index % colors.length]}
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                rotation={rotation}
                origin={`${radius}, ${radius}`}
              />
            );
          })}
        </G>
      </Svg>
      <View style={styles.legend}>
        {data.map((item, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: colors[index % colors.length] }]} />
            <Text style={[styles.legendText, { color: theme.text }]}>
              {item.label}: {((item.value / total) * 100).toFixed(1)}%
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  legend: {
    marginTop: 20,
    width: '100%',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 4,
    marginRight: 8,
  },
  legendText: {
    fontSize: 14,
  },
});
