import React, { useEffect } from "react"
import cookies from "js-cookie"

import InputLabel from "@mui/material/InputLabel"
import MenuItem from "@mui/material/MenuItem"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"

import i18next from "i18next"
import { useTranslation } from "react-i18next"

import languages from "./languages"
import Flag from "react-world-flags"

export const Changelang = () => {
	const [language, setLanguage] = React.useState("")

	const handleChange = (event: SelectChangeEvent) => {
		setLanguage(event.target.value as string)
	}

	const { t } = useTranslation()
	const currentLanguageCode = cookies.get("i18next") || "en"
	const currentLanguage = languages.find((l) => l.code === currentLanguageCode)

	useEffect(() => {
		document.body.dir = currentLanguage?.dir || "ltr"
		document.title = t("appTitle")
	}, [currentLanguage, t])

	return (
		<FormControl variant='filled' sx={{ minWidth: 120 }}>
			<InputLabel id='demo-simple-select-filled-label'>Language</InputLabel>
			<Select
				value={language}
				onChange={handleChange}
				labelId='demo-simple-select-filled-label'
				id='demo-simple-select-filled'
			>
				{languages.map(({ code, name, country_code }) => (
					<MenuItem
						key={country_code}
						disabled={currentLanguageCode === code}
						value={name}
						onClick={() => {
							i18next.changeLanguage(code)
						}}
					>
						<Flag code={code} height='14' style={{ marginRight: "3px" }} />
						{name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	)
}
