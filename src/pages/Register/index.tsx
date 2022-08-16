import React from "react"

import {
	Box,
	Button,
	FormControl,
	FormHelperText,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material"
import { Visibility, VisibilityOff } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import SendIcon from "@mui/icons-material/Send"

import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { schema } from "./schema"

import { IAuth } from "../../models/IAuth"
import { Link, Navigate } from "react-router-dom"

import { useAppDispatch, useAppSelector } from "../../redux/hooks"
import { fetchRegister } from "../../redux/slices/authSlice"

export const Register: React.FC = () => {
	const [showPassword, setShowPassword] = React.useState<Boolean>(false)
	const { loading, data: auth } = useAppSelector((state) => state.auth)
	const dispatch = useAppDispatch()

	const {
		control,
		handleSubmit,
		formState: { errors },
	} = useForm<IAuth>({ mode: "onBlur", resolver: yupResolver(schema) })

	const onSubmit: SubmitHandler<IAuth> = async (obj) => {
		const { payload } = await dispatch(fetchRegister(obj))
		if (!payload) {
			alert("Не удалось зарегистрироваться!")
		}
		if (typeof payload === "object") {
			window.localStorage.setItem("token", payload.token ?? "")
		}
	}

	if (auth) {
		return <Navigate to='/' />
	}

	const style = {
		position: "absolute" as "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		bgcolor: "background.paper",
		border: "1px solid #000",
		boxShadow: 24,
		p: 4,
		flexGrow: 1,
		display: "flex",
		flexDirection: "column",
	}

	return (
		<Box
			component='form'
			sx={style}
			noValidate
			autoComplete='off'
			onSubmit={handleSubmit(onSubmit)}
		>
			<Controller
				control={control}
				name='fullName'
				defaultValue=''
				render={({ field }) => (
					<TextField
						{...field}
						sx={{ mb: 2 }}
						id='outlined-basic-fullName'
						label='Full Name'
						type='fullName'
						error={!!errors.fullName}
						helperText={errors.fullName ? errors.fullName?.message : ""}
						disabled={loading}
					/>
				)}
			/>
			<Controller
				control={control}
				name='email'
				defaultValue=''
				render={({ field }) => (
					<TextField
						sx={{ mb: 2 }}
						{...field}
						id='outlined-basic-email'
						label='Email'
						type='email'
						error={!!errors.email}
						helperText={errors.email ? errors.email?.message : ""}
						disabled={loading}
					/>
				)}
			/>
			<FormControl variant='outlined' error={!!errors.password}>
				<InputLabel htmlFor='outlined-adornment-password'>Password</InputLabel>
				<Controller
					control={control}
					name='password'
					defaultValue=''
					render={({ field }) => (
						<OutlinedInput
							{...field}
							id='outlined-adornment-password'
							type={showPassword ? "text" : "password"}
							label='password'
							disabled={loading}
							endAdornment={
								<InputAdornment position='end'>
									<IconButton
										aria-label='toggle password visibility'
										onClick={() => setShowPassword(!showPassword)}
										onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) => e.preventDefault()}
										edge='end'
									>
										{showPassword ? <VisibilityOff /> : <Visibility />}
									</IconButton>
								</InputAdornment>
							}
						/>
					)}
				/>
				{errors.password && (
					<FormHelperText>{errors.password ? errors.password.message : ""}</FormHelperText>
				)}
			</FormControl>
			<LoadingButton
				sx={{ mt: 2, mb: 2 }}
				type='submit'
				endIcon={<SendIcon />}
				loading={loading}
				loadingPosition='end'
				variant='contained'
			>
				Register
			</LoadingButton>
			<Link to='auth/login'>
				<Button variant='contained' sx={{ width: "100%" }}>
					Login
				</Button>
			</Link>
		</Box>
	)
}
