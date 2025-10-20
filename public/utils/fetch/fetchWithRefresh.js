export async function fetchWithRefresh(fetchCallback, token) {
  const response = await fetchCallback(token)
  
  if (response.status === 403) { // token is invalid or expired
    const res = await fetch('/refresh')
    if (res.ok) {
      const { access_token } = await res.json()
      fetchCallback(access_token)
    }
  } else if (response.status === 401) { // no token
    return response
  } else {
    const { data } = await response.json()    
    return data
  }
}
