import { tokens } from '../../index.js'

export async function fetchWithRefresh(url, beforeFetchCallback, afterFetchSuccessCallback) {
  let result

  async function fetchData(urlToFetch) {
    return fetch(urlToFetch, {
      headers: {
        ['Authorization']: tokens.accessToken ? `Bearer ${tokens.accessToken}` : '',
        ['X-CSRF-Token']: tokens.csrfToken ?? ''
      }
    })
  }

  await beforeFetchCallback?.()
  
  const response = await fetchData(url)
  
  if (response.status === 403) { // token is invalid or expired
    const res = await fetch('/refresh')
    if (res.ok) {
      const tokensFromResponse = await res.json()
      tokens.accessToken = tokensFromResponse.accessToken
      tokens.csrfToken = tokensFromResponse.csrfToken
      fetchWithRefresh(url, beforeFetchCallback, afterFetchSuccessCallback)
    }
  } else if (response.status === 401) { // no token
    result = await response.json()
  } else {
    const { data } = await response.json()
    result = data
  }

  afterFetchSuccessCallback(result)    
}
