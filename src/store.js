import rootReducer from "./reducers";
import { createStore } from "redux";
import { persistStore, persistReducer } from "redux-persist";
import storageSession from "redux-persist/lib/storage/session";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";

const persistConfig = {
  key: "root",
  storage: storageSession,
  blacklist: ["socketConnected"],
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
const enhancer = composeWithDevTools();
const store = createStore(persistedReducer, enhancer);
const persistor = persistStore(store);
export { store, persistor };
