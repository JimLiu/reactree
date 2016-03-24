const { userAgent } = navigator;
const isWindows = userAgent.indexOf('Windows') >= 0;
const isMacintosh = userAgent.indexOf('Macintosh') >= 0;
const isLinux = userAgent.indexOf('Linux') >= 0;

export default {
  isWindows,
  isMacintosh,
  isLinux
}