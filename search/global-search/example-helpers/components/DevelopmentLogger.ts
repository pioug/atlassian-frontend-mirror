export const DEVELOPMENT_LOGGER = {
  safeError(...rest: any) {
    console.error(...rest);
  },
  safeInfo(...rest: any) {
    console.info(...rest);
  },
  safeWarn(...rest: any) {
    console.warn(...rest);
  },
};
