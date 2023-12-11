import { Config } from './config'

function Http(accessToken: string) {
  const { DEFAULT_DEVICE_ID } = Config()
  let _accessToken = accessToken
  let _deviceId = DEFAULT_DEVICE_ID

  const headers: Record<'Authorization' | 'timeout' | string, string> = {
    'Content-Type': 'application/json;charset=UTF-8',
  }

  if (_accessToken)
    headers.Authorization = `Bearer ${_accessToken}`

  if (_deviceId)
    headers['x-device-id'] = _deviceId

  function post<T = any>(url: string, data: Record<string, any> | any) {
    return HTTP.post<T>(url, data, { headers: { Authorization: `Bearer ${_accessToken}` } })
  }
  function fetch<T = any>(url: string, data: FetchRequestOption) {
    return HTTP.fetch<T>(url, {
      ...data,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        'Authorization': `Bearer ${_accessToken}`,
        'x-device-id': _deviceId,
        ...data.headers,
      },
    })
  }

  function updateAccessToken(token: string) {
    _accessToken = token
  }

  function updateDeviceId(deviceId: string) {
    _deviceId = deviceId
  }

  return { post, fetch, updateAccessToken, updateDeviceId }
}
export { Http }
