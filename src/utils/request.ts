function Http(accessToken: string) {
  let _accessToken = accessToken

  const headers: Record<'Authorization' | 'timeout' | string, string> = {}

  if (_accessToken)
    headers.Authorization = `Bearer ${_accessToken}`

  function post<T = any>(url: string, data: Record<string, any> | any) {
    return HTTP.post<T>(url, data, { headers: { Authorization: `Bearer ${_accessToken}` } })
  }
  function fetch<T = any>(url: string, data: FetchRequestOption) {
    return HTTP.fetch<T>(url, {
      ...data,
      headers: {
        ...data.headers,
        Authorization: `Bearer ${_accessToken}`,
      },
    })
  }

  function updateAccessToken(token: string) {
    _accessToken = token
  }

  return { post, fetch, updateAccessToken }
}
export { Http }
