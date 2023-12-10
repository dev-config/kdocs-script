function sleep(d: number) {
  for (let t = Date.now(); Date.now() - t <= d;);
}
export { sleep }
