import React from "react"
import { yupResolver } from "@hookform/resolvers/yup"
import { schema } from "./schema"
import { useForm, Controller, SubmitHandler } from "react-hook-form"
import axios from "../../axios"

import { useAppDispatch } from "../../redux/hooks"
import { fetchRows } from "../../redux/slices/rowsSlice"

import { IUser } from "../../models/IUser"

import PhoneInput from "react-phone-input-2"
import "react-phone-input-2/lib/style.css"

import {
	FormControl,
	FormHelperText,
	Grid,
	Modal,
	Grow,
	IconButton,
	Button,
	InputAdornment,
	InputLabel,
	Box,
	OutlinedInput,
	TextField,
} from "@mui/material"
import Visibility from "@mui/icons-material/Visibility"
import { VisibilityOff } from "@mui/icons-material"
import { LoadingButton } from "@mui/lab"
import SendIcon from "@mui/icons-material/Send"

import { useTranslation } from "react-i18next"

export const ModalForm: React.FC = React.memo(() => {
	const { t } = useTranslation()
	const dispatch = useAppDispatch()

	const [open, setOpen] = React.useState(false)
	const [loading, setLoading] = React.useState(false)
	const [showPassword, setShowPassword] = React.useState<Boolean>(false)

	const handleOpen = () => setOpen(true)
	const handleClose = () => {
		setOpen(false)
	}

	const {
		control,
		handleSubmit,
		formState: { errors, isValid },
		reset,
	} = useForm<IUser>({ mode: "onBlur", resolver: yupResolver(schema) })

	const onSubmit: SubmitHandler<IUser> = async (obj) => {
		try {
			setLoading(true)
			await axios.post("posts", obj)

			dispatch(fetchRows(""))
		} catch (err) {
			console.log(err)
		}
		setLoading(false)
		if (isValid && !!errors) {
			reset({ iban: "", fullName: "", city: "", email: "", password: "", phone: "" })
			handleClose()
		}
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
	}

	return (
		<>
			<Button variant='outlined' onClick={handleOpen}>
				{t("openPostForm")}
			</Button>
			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby='modal-modal-title'
				aria-describedby='modal-modal-description'
			>
				<Grow
					in={open}
					style={{ transformOrigin: "0 0 0", transform: "translate(-50%,-50%)" }}
					{...(open ? { timeout: 1000 } : {})}
				>
					<Box
						component='form'
						sx={style}
						noValidate
						autoComplete='off'
						onSubmit={handleSubmit(onSubmit)}
					>
						<Grid container spacing={2}>
							<Grid item xs={4}>
								<Controller
									control={control}
									name='iban'
									defaultValue=''
									render={({ field }) => (
										<TextField
											{...field}
											id='outlined-basic-iban'
											label={t("iban")}
											type='iban'
											error={!!errors.iban}
											helperText={errors.iban ? errors.iban?.message : ""}
											disabled={loading}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={4}>
								<Controller
									control={control}
									name='fullName'
									defaultValue=''
									render={({ field }) => (
										<TextField
											{...field}
											id='outlined-basic-fullName'
											label={t("fullName")}
											type='fullName'
											error={!!errors.fullName}
											helperText={errors.fullName ? errors.fullName?.message : ""}
											disabled={loading}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={4}>
								<Controller
									control={control}
									name='city'
									defaultValue=''
									render={({ field }) => (
										<TextField
											{...field}
											id='outlined-basic-city'
											label={t("city")}
											type='city'
											error={!!errors.city}
											helperText={errors.city ? errors.city?.message : ""}
											disabled={loading}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={4}>
								<Controller
									control={control}
									name='email'
									defaultValue=''
									render={({ field }) => (
										<TextField
											{...field}
											id='outlined-basic-email'
											label={t("email")}
											type='email'
											error={!!errors.email}
											helperText={errors.email ? errors.email?.message : ""}
											disabled={loading}
										/>
									)}
								/>
							</Grid>
							<Grid item xs={4}>
								<FormControl variant='outlined' error={!!errors.password}>
									<InputLabel htmlFor='outlined-adornment-password'>{t("password")}</InputLabel>
									<Controller
										control={control}
										name='password'
										defaultValue=''
										render={({ field }) => (
											<OutlinedInput
												{...field}
												id='outlined-adornment-password'
												type={showPassword ? "text" : "password"}
												label={t("password")}
												disabled={loading}
												endAdornment={
													<InputAdornment position='end'>
														<IconButton
															aria-label='toggle password visibility'
															onClick={() => setShowPassword(!showPassword)}
															onMouseDown={(e: React.MouseEvent<HTMLButtonElement>) =>
																e.preventDefault()
															}
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
										<FormHelperText>
											{errors.password ? errors.password.message : ""}
										</FormHelperText>
									)}
								</FormControl>
							</Grid>
							<Grid item xs={4}>
								<Controller
									control={control}
									name='phone'
									defaultValue=''
									render={({ field }) => (
										<PhoneInput
											{...field}
											disabled={loading}
											country={"us"}
											inputStyle={{ width: "100%", height: "53px" }}
										/>
									)}
								/>
							</Grid>
						</Grid>
						<LoadingButton
							sx={{ mt: 2 }}
							type='submit'
							endIcon={<SendIcon />}
							loading={loading}
							loadingPosition='end'
							variant='contained'
						>
							{t("post")}
						</LoadingButton>
					</Box>
				</Grow>
			</Modal>
		</>
	)
})
