import { Config } from './config'

function Http(accessToken: string) {
  const { DEVICE_ID } = Config()
  let _accessToken = accessToken
  let _deviceId = DEVICE_ID

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

  return { fetch, updateAccessToken, updateDeviceId }
}
export { Http }
