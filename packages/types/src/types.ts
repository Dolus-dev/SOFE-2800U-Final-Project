/** This is where we can export common code between the front and backend. Functions, interfaces, and the like */

export type Email = `${string}@${string}.${string}`;
export type Password = string & { readonly _brand: "Password" };

export type LoginFormData = {
	username: string;
	email: Email | string;
	password: string;
};

export type AccountRegistrationData = {
	username: string;
	email: Email | string;
	password: Password | null;
	Fname: string;
	Lname: string;
};
