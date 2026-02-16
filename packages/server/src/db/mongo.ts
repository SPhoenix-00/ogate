import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/ogate";

export async function connectMongo(): Promise<void> {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("[MongoDB] Connected to", MONGO_URI);
  } catch (err) {
    console.error("[MongoDB] Connection failed:", err);
    console.warn("[MongoDB] Running without persistence — data will not be saved.");
  }
}

const playerSchema = new mongoose.Schema({
  playerId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  resources: {
    ore: { type: Number, default: 500 },
    biomass: { type: Number, default: 300 },
    energy: { type: Number, default: 200 },
    nanites: { type: Number, default: 0 },
    artifacts: { type: Number, default: 0 },
    capacitors1MW: { type: Number, default: 3 },
    capacitors1GW: { type: Number, default: 0 },
  },
  fleet: {
    ships: { type: Array, default: [] },
    totalMass: { type: Number, default: 0 },
  },
}, { timestamps: true });

export const PlayerModel = mongoose.model("Player", playerSchema);
