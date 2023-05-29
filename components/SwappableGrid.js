import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Animated,
  Dimensions,
} from "react-native";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";

import { getRandomInt, getAllMatches, markAsMatch } from "../lib/GridApi";
import { BEAN_OBJS } from "../lib/Images";
import { TileData } from "../lib/TileData";
import HighScores from "../lib/HighScores";

let numOfCols = 7;
let numOfRows = 6;
let TILE_WIDTH = 50;
const SWIPE_THRESHOLD = 120;

const SwappableGrid = () => {
  const [tileDataSource, setTileDataSource] = useState(
    initializeDataSource(numOfCols, numOfRows)
  );
  const [score, setScore] = useState(0);
  const [maxSwipes] = useState(10);
  const [remainingSwipes, setRemainingSwipes] = useState(maxSwipes);
  const [gameOver, setGameOver] = useState(false);
  const [highScores] = useState([500, 400, 300, 200, 100]);

  const decreaseSwipe = () => {
    setRemainingSwipes((prevRemainingSwipes) => {
      const newRemainingSwipes = prevRemainingSwipes - 1;
      return newRemainingSwipes;
    });
  };

  const updateScore = (points) => {
    setScore((prevScore) => prevScore + points);
  };

  const swap = (i, j, dx, dy) => {
    if (
      i + dx < 0 ||
      i + dx >= tileDataSource.length ||
      j + dy < 0 ||
      j + dy >= tileDataSource[i].length
    ) {
      return;
    }

    const swapStarter = tileDataSource[i][j];
    const swapEnder = tileDataSource[i + dx][j + dy];

    tileDataSource[i][j] = swapEnder;
    tileDataSource[i + dx][j + dy] = swapStarter;

    const animateSwap = Animated.parallel([
      Animated.timing(swapStarter.location, {
        toValue: { x: TILE_WIDTH * (i + dx), y: TILE_WIDTH * (j + dy) },
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(swapEnder.location, {
        toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j },
        duration: 120,
        useNativeDriver: true,
      }),
    ]);

    animateSwap.start(() => {
      let allMatches = getAllMatches(tileDataSource, numOfCols, numOfRows);
      if (allMatches.length !== 0) {
        processMatches(allMatches);
      }
    });
  };

  const processMatches = (matches) => {
    let nextMatches = [];

    setTileDataSource((prevTileDataSource) => {
      let newTileDataSource = prevTileDataSource.map((row) => row.slice());
      markAsMatch(matches, newTileDataSource);
      condenseColumns(newTileDataSource);
      recolorMatches(newTileDataSource);
      nextMatches = getAllMatches(newTileDataSource);
      return newTileDataSource;
    });

    animateValuesToLocations();
    updateScore(matches.length);

    if (nextMatches.length !== 0) {
      processMatches(nextMatches);
    } else {
      switchTurn();
    }
  };

  const switchTurn = () => {
    decreaseSwipe();
    if (remainingSwipes === 0) {
      setGameOver(true);
    }
  };

  const initializeDataSource = (numOfCols, numOfRows) => {
    let dataSource = [];
    for (let i = 0; i < numOfCols; i++) {
      dataSource[i] = [];
      for (let j = 0; j < numOfRows; j++) {
        const randomIndex = getRandomInt(0, BEAN_OBJS.length);
        const randomBean = BEAN_OBJS[randomIndex];
        const location = new Animated.ValueXY({
          x: TILE_WIDTH * i,
          y: TILE_WIDTH * j,
        });
        dataSource[i][j] = new TileData(randomBean, location);
      }
    }
    return dataSource;
  };

  const condenseColumns = (dataSource) => {
    for (let i = 0; i < dataSource.length; i++) {
      for (let j = dataSource[i].length - 1; j >= 0; j--) {
        if (dataSource[i][j].matched) {
          for (let k = j; k > 0; k--) {
            dataSource[i][k] = dataSource[i][k - 1];
          }
          const randomIndex = getRandomInt(0, BEAN_OBJS.length);
          const randomBean = BEAN_OBJS[randomIndex];
          const location = new Animated.ValueXY({
            x: TILE_WIDTH * i,
            y: -TILE_WIDTH,
          });
          dataSource[i][0] = new TileData(randomBean, location);
        }
      }
    }
  };

  const recolorMatches = (dataSource) => {
    for (let i = 0; i < dataSource.length; i++) {
      for (let j = 0; j < dataSource[i].length; j++) {
        if (dataSource[i][j].matched) {
          const randomIndex = getRandomInt(0, BEAN_OBJS.length);
          const randomBean = BEAN_OBJS[randomIndex];
          dataSource[i][j].bean = randomBean;
          dataSource[i][j].matched = false;
        }
      }
    }
  };

  const animateValuesToLocations = () => {
    for (let i = 0; i < tileDataSource.length; i++) {
      for (let j = 0; j < tileDataSource[i].length; j++) {
        const tile = tileDataSource[i][j];
        Animated.timing(tile.location, {
          toValue: { x: TILE_WIDTH * i, y: TILE_WIDTH * j },
          duration: 120,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  const onSwipe = (gestureName, i, j) => {
    switch (gestureName) {
      case swipeDirections.SWIPE_UP:
        swap(i, j, 0, -1);
        break;
      case swipeDirections.SWIPE_DOWN:
        swap(i, j, 0, 1);
        break;
      case swipeDirections.SWIPE_LEFT:
        swap(i, j, -1, 0);
        break;
      case swipeDirections.SWIPE_RIGHT:
        swap(i, j, 1, 0);
        break;
    }
  };

  const renderTiles = () => {
    return tileDataSource.map((row, i) => {
      return row.map((tile, j) => {
        const { bean, location } = tile;
        return (
          <Animated.View
            key={`${i}-${j}`}
            style={[
              styles.tile,
              {
                transform: [
                  { translateX: location.x },
                  { translateY: location.y },
                ],
              },
            ]}
          >
            <GestureRecognizer
              onSwipe={(direction) => onSwipe(direction, i, j)}
              config={gestureConfig}
              style={styles.tileContent}
            >
              <View style={styles.tileBean}>{bean}</View>
            </GestureRecognizer>
          </Animated.View>
        );
      });
    });
  };

  const renderGameOver = () => {
    return (
      <View style={styles.gameOverContainer}>
        <Text style={styles.gameOverText}>Game Over</Text>
        <Text style={styles.scoreText}>Final Score: {score}</Text>
        <Text style={styles.highScoreText}>High Scores:</Text>
        <HighScores scores={highScores} />
        <TouchableHighlight
          underlayColor="transparent"
          onPress={replayGame}
          style={styles.replayButton}
        >
          <Text style={styles.replayButtonText}>Replay</Text>
        </TouchableHighlight>
      </View>
    );
  };

  const replayGame = () => {
    setScore(0);
    setRemainingSwipes(maxSwipes);
    setGameOver(false);
    setTileDataSource(initializeDataSource(numOfCols, numOfRows));
  };

  return (
    <View style={styles.container}>
      {gameOver ? (
        renderGameOver()
      ) : (
        <>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.swipesText}>Swipes: {remainingSwipes}</Text>
          <View style={styles.gridContainer}>{renderTiles()}</View>
        </>
      )}
    </View>
  );
};

const gestureConfig = {
  velocityThreshold: 0.3,
  directionalOffsetThreshold: 80,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tile: {
    width: TILE_WIDTH,
    height: TILE_WIDTH,
  },
  tileContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  tileBean: {
    width: "80%",
    height: "80%",
    borderRadius: TILE_WIDTH / 2,
    backgroundColor: "lightgray",
  },
  scoreText: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  swipesText: {
    fontSize: 16,
    marginBottom: 10,
  },
  gameOverContainer: {
    alignItems: "center",
  },
  gameOverText: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  highScoreText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  replayButton: {
    backgroundColor: "lightgray",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  replayButtonText: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default SwappableGrid;
