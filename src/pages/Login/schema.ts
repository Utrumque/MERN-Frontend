import * as yup from "yup"
import i18next from "../../i18n"

export const schema = yup
	.object({
		email: yup
			.string()
			.required(i18next.t("Email is required!"))
			.matches(
				/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
				i18next.t("Wrong email!")
			),
		password: yup
			.string()
			.required(i18next.t("Password is required!"))
			.min(8, i18next.t("At least 8 chars"))
			.matches(/^(?=.{2,}$)\D*\d/, i18next.t("At least 2 digits"))
			.matches(
				/^(?:(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&+=]).*)$/,
				i18next.t("At least one upper + lower case char + special char")
			)
			.matches(
				/^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
				i18next.t("Only eng letters/numbers/special chars")
			),
	})
	.required()
