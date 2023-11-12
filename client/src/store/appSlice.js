import { createSlice } from "@reduxjs/toolkit";
import * as action from './asynAction'


export const appSlice = createSlice({
    name: 'app',
    initialState: {
        categories: null,
    },
    reducers: {

    },
    extraReducers: (builder) => {
        // builder.addCase(action.getCategories.pending, (state) => {
        //     state.isLoading = true;
        // }); 
        builder.addCase(action.getCategories.fulfilled, (state, action) => {
            console.log(action);
            state.isLoading = false;
            state.categories = action.payload;
        });
        builder.addCase(action.getCategories.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    }
})
// export const { } = productSlice.actions

export default appSlice.reducer