import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isConnected: false,
};

const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setIsConnected(state, action) {
      state.isConnected = action.payload;
    }
  },
  extraReducers: (builder) => {
    // Add any extra reducers if needed
  },
});

export const { setIsConnected } = socketSlice.actions;
export default socketSlice.reducer;
