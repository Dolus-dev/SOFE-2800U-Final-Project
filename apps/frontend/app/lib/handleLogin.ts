"use server"

import { FormEvent } from "react";


export default async function handleLogin(event: FormEvent<HTMLFormElement>) {
  

  const formData = new FormData(event.currentTarget)
  const payload = Object.fromEntries(formData);

  console.log(payload)
}