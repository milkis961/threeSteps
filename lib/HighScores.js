import React from "react";
import { View, Text, StyleSheet } from "react-native";

const HighScores = ({ scores }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>High Scores</Text>
      {scores.map((score, index) => (
        <Text key={index} style={styles.scoreText}>
          {index + 1}. {score}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    marginBottom: 5,
  },
});

export default HighScores;
