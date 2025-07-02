import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./Slices/authSlice.js";
import postSlice from './Slices/postSlice.js';
import socketSlice from "./Slices/socketSlice.js"
import chatSlice from "./Slices/chatSlice.js"
import likeSlice from "./Slices/likeSlice.js"


import { 
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'



const persistConfig = {
  key: 'root',
  version: 1,
  storage,
  whitelist: ['auth', 'post', 'like'], // ✅ Thêm slice này vào
};


const rootReducer = combineReducers({
    auth:authSlice,
    post:postSlice,
    socketio:socketSlice,
    chat:chatSlice,
    like:likeSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
});
export default store;