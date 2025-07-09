import { createSlice , configureStore } from '@reduxjs/toolkit'

export const AppSlice = createSlice({
  name: 'module',
  initialState: {
    moduleProfile: {}
  },
  reducers: {
    update: (state, action) => 
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes
       ({ ...state, moduleProfile: action.payload })
  }
})

// Action creators are generated for each case reducer function
export const { update } = AppSlice.actions
export const selectModuleProfile = (state) => state.module.moduleProfile;
export default configureStore({
  reducer: {
    module: AppSlice.reducer
  }
})

