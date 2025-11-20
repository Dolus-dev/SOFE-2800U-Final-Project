'use server'



export default async function handleLogin(formData: FormData) {
  const {login, password} = {
    login: String(formData.get('username/email')),
    password: String(formData.get('password'))
  }
 

  console.log(formData)
 
 if (!login || !password) throw new Error('Missing Credentials')


  const res = await fetch(`http://localhost:3001/auth/signin`, {
    method: 'POST',
    headers: {'Content-Type': "application/json"},
    body: JSON.stringify({login, password})
  })

  if (!res.ok) throw new Error(`Auth API error: ${res.status}`);

  return res.json();


 

}