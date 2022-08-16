import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from "@reduxjs/toolkit"
import axios from "../../axios"
import { IAuth } from "../../models/IAuth"

export const fetchLogin = createAsyncThunk<IAuth, IAuth, { rejectValue: string }>(
	"auth/fetchLogin",
	async (obj, { rejectWithValue }) => {
		const { data } = await axios.post("auth/login", obj)
		if (!data) {
			return rejectWithValue("Server Error!")
		}
		return data
	}
)

export const fetchAuthMe = createAsyncThunk<IAuth, null, { rejectValue: string }>(
	"auth/fetchAuthMe",
	async (_, { rejectWithValue }) => {
		const { data } = await axios.get("auth/me")
		if (!data) {
			return rejectWithValue("Server Error!")
		}
		return data
	}
)

export const fetchRegister = createAsyncThunk<IAuth, IAuth, { rejectValue: string }>(
	"auth/fetchRegister",
	async (obj, { rejectWithValue }) => {
		const { data } = await axios.post("auth/register", obj)
		if (!data) {
			return rejectWithValue("Server Error!")
		}
		return data
	}
)

interface IState {
	data: IAuth | null
	loading: boolean
	error: string | null
}

const initialState: IState = {
	data: null,
	loading: false,
	error: null,
}

const authSlice = createSlice({
	name: "rows",
	initialState,
	reducers: {
		logOut: (state) => {
			state.data = null
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchLogin.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchLogin.fulfilled, (state, action) => {
				state.data = action.payload
				state.loading = false
			})
			.addCase(fetchAuthMe.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchAuthMe.fulfilled, (state, action) => {
				state.data = action.payload
				state.loading = false
			})
			.addCase(fetchRegister.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchRegister.fulfilled, (state, action) => {
				state.data = action.payload
				state.loading = false
			})
			.addMatcher(isError, (state, action: PayloadAction<string>) => {
				state.error = action.payload
				state.loading = false
			})
	},
})

export default authSlice.reducer
export const { logOut } = authSlice.actions

function isError(action: AnyAction) {
	return action.type.endsWith("rejected")
}
