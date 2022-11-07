import { isOutdatedBrowser } from '../outdated-browsers';

// To see the database of the available userAgent - https://developers.whatismybrowser.com/useragents/explore/
const supportedUserAgents = [
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36', // Chrome 103 on macOS (Catalina)
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/101.0.4951.67 Safari/537.36', // Chrome 101 on Windows 10
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50', // Edge 100 on Windows 10
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.5005.124 Safari/537.36 Edg/102.0.1245.44', // Edge 102 on macOS (Catalina)
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0', // Firefox 102 on macOS (Catalina)
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36', // Chrome 103 on Linux
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.6 Mobile/15E148 Safari/604.1', // Safari 15.6 on iOS 15.6 Apple iPhone
  'Mozilla/5.0 (Linux; Android 10; Lenovo TB-X606F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36', // Chrome 103 on Android 10 Lenovo
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15', // Safari 15.5 on macOS (Catalina)
];
const unsupportedUserAgents = [
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36', // Chrome 44 on Linux
  'Mozilla/5.0 (Linux; Android 4.2.2; Lenovo A3500-H Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/47.0.2526.76 Safari/E7FBAF', // Chrome 47 on Android (Jelly Bean) Lenovo
  'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko', // Internet Explorer 11 on Windows 10
  'Mozilla/5.0 (iPhone; U; CPU iPhone OS 11_0_9 like Mac OS X; en-US) AppleWebKit/602.5.3 (KHTML, like Gecko) Version/11.0.3 Mobile/8F48a Safari/6533.18.5', // Safari 11.0.3 on iOS 11.0.9 Apple iPhone
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:56.0) Gecko/20100101 Firefox/56.0', // Firefox 56 on Windows 10
  'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_25.1.1 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/1 WKWebView/1 BytedanceWebview/d8a21c6 FalconTag/', //WebView based browser on iOS 15.4 Apple iPhone
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36 OPR/84.0.4316.14', // Opera 84 on Windows 10
  'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0_9 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/11.0.9 Mobile/16A404 Safari/E7FBAF', // Safari 11 on iOS 11 Apple iPhone
];

describe('outdated-browsers', () => {
  it('should isOutdatedBrowser return false if userAgent matches the supported browser defined', () => {
    expect(typeof isOutdatedBrowser).toBe('function');
    supportedUserAgents.forEach((supportedUserAgent) => {
      expect(isOutdatedBrowser(supportedUserAgent)).toBeFalsy();
    });
  });
  it('should isOutdatedBrowser return true if userAgent does not match the supported browser defined', () => {
    expect(typeof isOutdatedBrowser).toBe('function');
    unsupportedUserAgents.forEach((unsupportedUserAgent) => {
      expect(isOutdatedBrowser(unsupportedUserAgent)).toBeTruthy();
    });
  });
});
