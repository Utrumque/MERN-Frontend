import { createSlice, PayloadAction, createAsyncThunk, AnyAction } from "@reduxjs/toolkit"
import axios from "../../axios"
import { IUser } from "../../models/IUser"

export const fetchRows = createAsyncThunk<IUser[], string, { rejectValue: string }>(
	"rows/fetchRows",
	async (query, { rejectWithValue }) => {
		const { data } = await axios.get(`posts?q=${query}`)
		if (!data) {
			return rejectWithValue("Server Error!")
		}
		return data
	}
)

export const deleteRow = createAsyncThunk<IUser[], number | string, { rejectValue: string }>(
	"rows/deleteRow",
	async (id, { rejectWithValue }) => {
		const { data } = await axios.delete(`posts/${id}`)
		if (!data) {
			return rejectWithValue("Server Error!")
		}
		return data
	}
)

interface IState {
	data: IUser[]
	loading: boolean
	error: string | null
}

const initialState: IState = {
	data: [],
	loading: true,
	error: null,
}

const rowsSlice = createSlice({
	name: "rows",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			// Получение строк
			.addCase(fetchRows.pending, (state) => {
				state.loading = true
				state.error = null
			})
			.addCase(fetchRows.fulfilled, (state, action) => {
				state.data = action.payload
				state.loading = false
			})
			// Удаление строки
			.addCase(deleteRow.pending, (state, action) => {
				state.loading = true
				state.error = null
				state.data = state.data.filter((obj) => obj._id !== action.payload)
			})
			// Отлов ошибок
			.addMatcher(isError, (state, action: PayloadAction<string>) => {
				state.error = action.payload
				state.loading = false
			})
	},
})

export default rowsSlice.reducer

function isError(action: AnyAction) {
	return action.type.endsWith("rejected")
}
