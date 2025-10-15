import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice.js';
import socketReducer from '../features/socket/socketSlice.js';
const store = configureStore({
    reducer: {
        auth: authReducer,
        socket: socketReducer,
    }, 
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        serializableCheck: true,
    }),
});
export default store;