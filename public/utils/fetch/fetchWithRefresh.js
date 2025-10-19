export async function fetchWithRefresh(fetchCallback, token) {
  const response = await fetchCallback(token)

  console.log('response ____', response)
  
  // token is invalid or expired
  if (response.status === 403) {
    const res = await fetch('/refresh')
    if (res.ok) {
      const { access_token } = await res.json()
      fetchCallback(access_token)
    }
  } else if (response.status === 401) {
    return response
  } else {
    const { data } = await response.json()
    console.log('data >>>>>', data);
    
    return data
  }
}
