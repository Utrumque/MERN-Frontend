import { configureStore } from "@reduxjs/toolkit"
import rows from "./slices/rowsSlice"
import auth from "./slices/authSlice"

export const store = configureStore({
	reducer: {
		rows,
		auth,
	},
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
