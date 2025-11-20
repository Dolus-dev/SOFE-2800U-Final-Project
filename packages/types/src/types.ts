/** This is where we can export common code between the front and backend. Functions, interfaces, and the like */

export type Email = `${string}@${string}.${string}`

export type LoginFormData = {
  username: string;
  email: Email | string;
  password: string;
}