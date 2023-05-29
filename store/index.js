import {
  configureStore,
  createSerializableStateInvariantMiddleware,
} from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import pointsReducer from "./pointsReducer";

const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, pointsReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: [createSerializableStateInvariantMiddleware()],
});
export const persistor = persistStore(store);
