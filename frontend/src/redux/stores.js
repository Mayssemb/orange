import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userReducers.js';
import proposalReducer from './proposalReducers';
import authReducer  from './authReducers';

export const store = configureStore({
  reducer: {
    users: userReducer,
    proposals: proposalReducer,
    authReducer:authReducer
  },
});

export default store;
