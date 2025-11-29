import { tokens } from '../../index.js'

export async function fetchWithRefresh({url, options = {}, beforeFetchCallback, afterFetchSuccessCallback}) {
  let result

  async function fetchData(urlToFetch) {
    return fetch(urlToFetch, {
      ...options,
      headers: {
        ...options.headers,
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
    const contentType = response.headers.get('Content-Type')

    if (contentType.includes('application/json')) {
      const { data } = await response.json()
      result = data
    } 
    // handle text
    else if (contentType.startsWith('text/plain') || contentType.startsWith('text/html')) {
      const { data } = await response.text()
      result = data
    }
    // handle binary (image, video, etc.)
    else {
      result = await response.blob()
    }
  }

  afterFetchSuccessCallback?.(result)

  return result
}
