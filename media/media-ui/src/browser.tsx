type mockedNavigator = {
  userAgent: string;
  platform: string;
};

let webkitSupported: boolean | undefined;

/*
 * Function to get the whether the browser is webkit supported. Mocked optional navigator purely for testing purposes
 * Memoization so that the browser is only calculated if it's not cached already
 */
export function isWebkitSupported(mockedNavigator?: mockedNavigator): boolean {
  const navigatorUsed =
    mockedNavigator !== undefined ? mockedNavigator : navigator;

  if (mockedNavigator !== undefined) {
    webkitSupported = undefined;
  }

  if (webkitSupported === undefined) {
    if (typeof navigatorUsed !== 'undefined') {
      const ieEdge = /Edge\/(\d+)/.exec(navigatorUsed.userAgent);
      const ieUpTo10 = /MSIE \d/.test(navigatorUsed.userAgent);
      const ie11up = /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(
        navigatorUsed.userAgent,
      );

      const opera =
        /Opera/.test(navigatorUsed.platform) ||
        /OPR/.test(navigatorUsed.platform);

      const ie = !!(ieUpTo10 || ie11up || ieEdge);
      const firefox = /Firefox/.test(navigatorUsed.userAgent);
      const browser_supported = !ie && !opera && !firefox;

      return browser_supported;
    }
    return false;
  }

  return webkitSupported;
}
