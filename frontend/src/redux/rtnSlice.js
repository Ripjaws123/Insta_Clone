import { createSlice } from "@reduxjs/toolkit";

const rtnSlice = createSlice({
  name: "rtmnotification",
  initialState: {
    likenotification: [],
  },
  reducers: {
    setLikeNotification: (state, action) => {
      if (action.payload.type === "like") {
        state.likenotification.push(action.payload);
      } else if(action.payload.type === 'dislike') {
        state.likenotification = state.likenotification.filter((like) => like.userId !== action.payload.userId);
      }
    },
  },
});

export const { setLikeNotification } = rtnSlice.actions;
export default rtnSlice.reducer;
