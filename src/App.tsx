import { useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"

import { DataTable } from "./pages/DataTable"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"

import { useAppDispatch, useAppSelector } from "./redux/hooks"
import { fetchAuthMe } from "./redux/slices/authSlice"

function App() {
	const dispatch = useAppDispatch()
	const { error, loading, data } = useAppSelector((state) => state.auth)

	useEffect(() => {
		dispatch(fetchAuthMe(null))
	}, [])

	return (
		<div className='App'>
			<BrowserRouter>
				<Routes>
					<Route path='/' element={<DataTable />}></Route>
					<Route path='/auth/register' element={<Register />}></Route>
					<Route path='/auth/login' element={<Login />}></Route>
				</Routes>
			</BrowserRouter>
		</div>
	)
}

export default App
