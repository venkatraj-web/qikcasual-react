import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    navClose: ''
}

const adminStyleSlice = createSlice({
    name: 'adminStyle',
    initialState,
    reducers: {
        toggleSideBar: (state) => {
            state.navClose = state.navClose === 'close' ? 'open' : 'close';
        }
    }
});

export const { toggleSideBar } = adminStyleSlice.actions;

export default adminStyleSlice.reducer;