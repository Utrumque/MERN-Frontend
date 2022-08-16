import React, { useEffect, useState } from "react"
import axios from "../../axios"

import { styled } from "@mui/material/styles"
import Table from "@mui/material/Table"
import TableBody from "@mui/material/TableBody"
import TableCell, { tableCellClasses } from "@mui/material/TableCell"
import TableContainer from "@mui/material/TableContainer"
import TableHead from "@mui/material/TableHead"
import TableRow from "@mui/material/TableRow"
import Paper from "@mui/material/Paper"
import { Box, InputAdornment, TextField, Typography, IconButton } from "@mui/material"
import LogoutIcon from "@mui/icons-material/Logout"
import SearchIcon from "@mui/icons-material/Search"
import CheckIcon from "@mui/icons-material/Check"
import CancelIcon from "@mui/icons-material/Cancel"
import EditIcon from "@mui/icons-material/Edit"
import DeleteIcon from "@mui/icons-material/Delete"

import { ModalForm } from "../../components/ModalForm"
import { IUser } from "../../models/IUser"

import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchRows, deleteRow } from "../../redux/slices/rowsSlice"
import { logOut } from "../../redux/slices/authSlice"

import { useTranslation } from "react-i18next"
import { Changelang } from "../../components/Changelang"
import { Navigate } from "react-router-dom"

export const DataTable: React.FC = React.memo(() => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()
	const { data: auth } = useAppSelector((state) => state.auth)
	const { data, error, loading } = useAppSelector((state) => state.rows)
	const [searchValue, setSearchValue] = useState("")
	const [editable, setEditable] = React.useState<string>("")
	const [editForm, setEditForm] = useState({
		iban: "",
		fullName: "",
		email: "",
		phone: "",
		city: "",
		password: "",
	})

	useEffect(() => {
		dispatch(fetchRows(searchValue))
	}, [searchValue])

	const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(event.target.value.toLowerCase())
	}

	const onLogOut = () => {
		if (window.confirm("Are you sure you want to log out?")) {
			dispatch(logOut())
			window.localStorage.removeItem("token")
		}
	}

	const handlePost = async (id: string) => {
		try {
			await axios.patch(`posts/${id}`, editForm)
			dispatch(fetchRows(""))
			setEditable("")
		} catch (err) {
			console.log(err)
		}
	}

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		setEditForm({ ...editForm, [e.target.name]: e.target.value })
	}

	const handleEdit = async (id: string) => {
		if (editable === id) {
			setEditable("")
		}
		try {
			const { data } = await axios.get(`posts/${id}`)
			setEditForm({
				iban: data.iban,
				fullName: data.fullName,
				email: data.email,
				phone: data.phone,
				city: data.city,
				password: data.password,
			})

			setEditable(id)
		} catch (err) {
			console.log(err)
		}
	}

	const handleDelete = (id: number | string) => {
		if (window.confirm("Are you sure you want to delete?")) {
			dispatch(deleteRow(id))
			dispatch(fetchRows(""))
		}
	}

	const StyledTableCell = styled(TableCell)(({ theme }) => ({
		[`&.${tableCellClasses.head}`]: {
			backgroundColor: theme.palette.common.black,
			color: theme.palette.common.white,
		},
		[`&.${tableCellClasses.body}`]: {
			fontSize: 14,
		},
	}))
	const StyledTableRow = styled(TableRow)(({ theme }) => ({
		"&:nth-of-type(odd)": {
			backgroundColor: theme.palette.action.hover,
		},
		"&:last-child td, &:last-child th": {
			border: 0,
		},
	}))

	if (!window.localStorage.getItem("token") && !auth) {
		return <Navigate to='/auth/login' />
	}

	return (
		<>
			<Box sx={{ display: "flex", alignItems: "center", mb: 1, justifyContent: "space-between" }}>
				<Changelang />
				<ModalForm />
				<TextField
					id='outlined-name'
					value={searchValue}
					onChange={handleSearch}
					label='Search...'
					InputProps={{
						startAdornment: (
							<InputAdornment position='start'>
								<SearchIcon />
							</InputAdornment>
						),
					}}
				/>
				<LogoutIcon
					sx={{ borderRadius: 1, "&:hover": { transform: "scale(1.1)", cursor: "pointer" } }}
					onClick={onLogOut}
				/>
			</Box>
			<Box component='form' noValidate autoComplete='off'>
				<TableContainer component={Paper}>
					<Table sx={{ minWidth: 700 }} aria-label='customized table'>
						<TableHead>
							<TableRow>
								<StyledTableCell>{t("iban")}</StyledTableCell>
								<StyledTableCell>{t("fullName")}</StyledTableCell>
								<StyledTableCell>{t("city")}</StyledTableCell>
								<StyledTableCell>{t("email")}</StyledTableCell>
								<StyledTableCell>{t("password")}</StyledTableCell>
								<StyledTableCell>{t("phone")}</StyledTableCell>
								<StyledTableCell sx={{ maxWidth: "10px" }}>Edit</StyledTableCell>
								<StyledTableCell sx={{ maxWidth: "30px" }}>Delete</StyledTableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{data.map((row: IUser, i: number) =>
								editable == row._id ? (
									<StyledTableRow key={row._id}>
										<StyledTableCell>
											<TextField
												variant='standard'
												name='iban'
												value={editForm.iban}
												onChange={handleChange}
												disabled={editable !== row._id}
											/>
										</StyledTableCell>
										<StyledTableCell>
											<TextField
												variant='standard'
												value={editForm.fullName}
												disabled={editable !== row._id}
												onChange={handleChange}
												name='fullName'
											/>
										</StyledTableCell>
										<StyledTableCell>
											<TextField
												variant='standard'
												value={editForm.city}
												disabled={editable !== row._id}
												onChange={handleChange}
												name='city'
											/>
										</StyledTableCell>
										<StyledTableCell>
											<TextField
												variant='standard'
												value={editForm.email}
												disabled={editable !== row._id}
												onChange={handleChange}
												name='email'
											/>
										</StyledTableCell>
										<StyledTableCell>
											<TextField
												variant='standard'
												value={editForm.password}
												disabled={editable !== row._id}
												onChange={handleChange}
												name='password'
											/>
										</StyledTableCell>
										<StyledTableCell>
											<TextField
												variant='standard'
												value={editForm.phone}
												disabled={editable !== row._id}
												onChange={handleChange}
												name='phone'
											/>
										</StyledTableCell>
										<StyledTableCell sx={{ maxWidth: "10px" }}>
											<IconButton
												disabled={editable !== row._id}
												sx={{
													color: "#76ff03",
													"&:hover": {
														color: "#52b202",
														cursor: "pointer",
														transform: "scale(1.1)",
														bgcolor: "transparent",
													},
												}}
												onClick={() => handlePost(row._id ?? "")}
											>
												<CheckIcon />
											</IconButton>
										</StyledTableCell>
										<StyledTableCell sx={{ maxWidth: "30px" }}>
											<IconButton
												onClick={() => setEditable("")}
												disabled={editable !== row._id}
												sx={{
													color: "#ff4569",
													"&:hover": {
														color: "#b2102f",
														cursor: "pointer",
														transform: "scale(1.1)",
														bgcolor: "transparent",
													},
												}}
											>
												<CancelIcon />
											</IconButton>
										</StyledTableCell>
									</StyledTableRow>
								) : (
									<StyledTableRow key={row._id}>
										<StyledTableCell>{row.iban}</StyledTableCell>
										<StyledTableCell>{row.fullName}</StyledTableCell>
										<StyledTableCell>{row.city}</StyledTableCell>
										<StyledTableCell>{row.email}</StyledTableCell>
										<StyledTableCell>{row.password} </StyledTableCell>
										<StyledTableCell>{row.phone} </StyledTableCell>
										{row.user?._id === auth?._id ? (
											<>
												<StyledTableCell sx={{ maxWidth: "20px" }}>
													<IconButton
														onClick={() => handleEdit(row._id ?? "")}
														sx={{
															color: "#007bb2",
															"&:hover": {
																color: "#00a0b2",
																cursor: "pointer",
																transform: "scale(1.1)",
																bgcolor: "transparent",
															},
														}}
													>
														<EditIcon />
													</IconButton>
												</StyledTableCell>
												<StyledTableCell sx={{ maxWidth: "20px" }}>
													<IconButton
														onClick={() => handleDelete(row._id ?? "")}
														sx={{
															color: "#ff4569",
															"&:hover": {
																color: "#b2102f",
																cursor: "pointer",
																transform: "scale(1.1)",
																bgcolor: "transparent",
															},
														}}
													>
														<DeleteIcon />
													</IconButton>
												</StyledTableCell>
											</>
										) : (
											<>
												<StyledTableCell sx={{ maxWidth: "20px" }}></StyledTableCell>
												<StyledTableCell sx={{ maxWidth: "20px" }}></StyledTableCell>
											</>
										)}
									</StyledTableRow>
								)
							)}
						</TableBody>
					</Table>
					{loading && (
						<Typography
							variant='h4'
							mt={4}
							style={{
								position: "absolute",
								left: "50%",
								transform: "translateX(-50%)",
							}}
						>
							{t("loading")}
						</Typography>
					)}
					{error && (
						<Typography
							variant='h4'
							mt={4}
							style={{
								position: "absolute",
								left: "50%",
								transform: "translateX(-50%)",
							}}
						>
							{t("error")}
						</Typography>
					)}
				</TableContainer>
			</Box>
		</>
	)
})
