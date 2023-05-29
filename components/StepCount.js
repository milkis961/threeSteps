import React, { useState, useEffect } from "react";
import { Accelerometer } from "expo-sensors";
import { Text, View, StyleSheet } from "react-native";
import { connect } from "react-redux";

const StepCount = () => {
  const [steps, setSteps] = useState(100);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const handleIncrementPoints = () => {
    incrementPoints(1);
  };

  const alpha = 0.8;
  const threshold = 1.2;

  useEffect(() => {
    let subscription = Accelerometer.addListener((accelerometerData) => {
      const { x, y, z } = accelerometerData;
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      setData((currentData) => [...currentData, magnitude]);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      const current = data[data.length - 1];
      if (filteredData.length === 0) {
        setFilteredData([current]);
      } else {
        const prev = filteredData[filteredData.length - 1];
        const filtered = alpha * prev + (1 - alpha) * current;
        setFilteredData((currentFilteredData) => [
          ...currentFilteredData,
          filtered,
        ]);
      }
    }
  }, [data]);

  useEffect(() => {
    if (filteredData.length > 2) {
      const current = filteredData[filteredData.length - 1];
      const prev1 = filteredData[filteredData.length - 2];
      const prev2 = filteredData[filteredData.length - 3];

      if (prev1 > prev2 && prev1 > current && prev2 > threshold) {
        setSteps((currentSteps) => currentSteps + 1);
        handleIncrementPoints();
      }
    }
  }, [filteredData]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Step Counting App</Text>
      <Text style={styles.stepCount}>Step count: {steps}</Text>
      <Text style={styles.points}>Points: {points}</Text>
    </View>
  );
};

const mapStateToProps = (state) => ({
  points: state.points,
});

const mapDispatchToProps = (dispatch) => ({
  incrementPoints: (value) =>
    dispatch({ type: "INCREMENT_POINTS", payload: value }),
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  stepCount: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  points: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default connect(mapStateToProps)(mapDispatchToProps)(StepCount);
