import { createSlice } from "@reduxjs/toolkit";

const postSlice = createSlice({
  name: "post",
  initialState: {
    post: [],
  },
  reducers: {
    // actions
    setPost: (state, acions)=>{
        state.post = acions.payload;
    }
  }
});
export const {setPost} = postSlice.actions;
export default postSlice.reducer;