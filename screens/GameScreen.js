import { Component, useState } from "react";
import {
  View,
  Text,
  TouchableHighlight,
  Button,
  StyleSheet,
  Image,
  ImageBackground,
  Animated,
  Dimensions,
} from "react-native";
import SwappableGrid from "../components/SwappableGrid";
import HighScores from "../lib/HighScores";
import { connect } from "react-redux";

import ImageTypes from "../lib/Images";

let playButton = require("../assets/PlayButton.png");
let justClouds = require("../assets/CloudsBackground.png");

const GameScreen = () => {
  const [showGrid, setShowGrid] = useState(false);

  return (
    <ImageBackground source={justClouds} style={styles.backGroundImage}>
      {points >= 50 ? (
        <SwappableGrid points={points} />
      ) : (
        <TouchableHighlight
          underlayColor="transparent"
          onPress={() => setShowGrid(true)}
        >
          <Image source={playButton} style={styles.playButton} />
        </TouchableHighlight>
      )}
    </ImageBackground>
  );
};

const mapStateToProps = (state) => ({
  points: state.points,
});

let Window = Dimensions.get("window");
let windowWidth = Window.width;
let windowHeight = Window.height;

let styles = StyleSheet.create({
  backGroundImage: {
    flex: 1,
    width: windowWidth,
    height: windowHeight,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  playButton: {
    width: 100,
    height: 100,
  },
});

export default connect(mapStateToProps)(GameScreen);
