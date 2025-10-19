export async function login(form, e) {
  e.preventDefault()
  
  const formData = new FormData(form)

  try {
    const res = await fetch('/login', {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.get("email"),
        password: formData.get("password"),
      })
    })

    if (res.ok) {
      const { access_token } = await res.json()
      
      return access_token
    }    
  } catch(e) {
    console.log('catch', e);
  }
}

export function refreshToken() {
  fetch('/refresh')
}
