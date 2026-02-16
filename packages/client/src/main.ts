import Phaser from "phaser";
import { HomeScene } from "./scenes/HomeScene.js";
import { InstanceScene } from "./scenes/InstanceScene.js";

/** Design size: portrait-only (OGate is button-driven, OGame-style). */
const PORTRAIT_WIDTH = 480;
const PORTRAIT_HEIGHT = 800;

const game = new Phaser.Game({
  type: Phaser.AUTO,
  parent: "game-container",
  width: PORTRAIT_WIDTH,
  height: PORTRAIT_HEIGHT,
  backgroundColor: "#0a0a14",
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [HomeScene, InstanceScene],
});

export default game;
