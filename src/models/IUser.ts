import { IAuth } from "./IAuth"

export interface IUser {
	_id: string
	iban: string
	fullName: string
	city: string
	email: string
	password: string
	phone: string
	user: IAuth
	createdAt?: string
	updatedAt?: string
	__v?: number
}
