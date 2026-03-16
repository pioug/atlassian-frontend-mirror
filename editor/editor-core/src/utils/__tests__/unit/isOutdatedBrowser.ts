import { eeTest } from '@atlaskit/tmp-editor-statsig/editor-experiments-test-utils';

import { isOutdatedBrowser } from '../../outdatedBrowsers';

// To see the database of the available userAgent - https://developers.whatismybrowser.com/useragents/explore/
// User agents that are SUPPORTED with the thresholds (Chrome >= 123, Firefox >= 124, Edge >= 123, Safari >= 17)
const supportedUserAgents = [
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36', // Chrome 130 on macOS
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36', // Chrome 123 on Windows 10
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36 Edg/125.0.0.0', // Edge 125 on Windows 10
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36 Edg/123.0.0.0', // Edge 123 on macOS
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:130.0) Gecko/20100101 Firefox/130.0', // Firefox 130 on macOS
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36', // Chrome 126 on Linux
	'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1', // Safari 18 on iOS 18 Apple iPhone
	'Mozilla/5.0 (Linux; Android 10; Lenovo TB-X606F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36', // Chrome 125 on Android 10 Lenovo
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15', // Safari 17 on macOS
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:124.0) Gecko/20100101 Firefox/124.0', // Firefox 124 on Windows 10
];
// User agents that are UNSUPPORTED with the thresholds (below Chrome 123, Firefox 124, Edge 123, Safari 17, or other browsers)
const unsupportedUserAgents = [
	'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/44.0.2403.157 Safari/537.36', // Chrome 44 on Linux
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36', // Chrome 103 on macOS
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36', // Chrome 122 on Windows
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.127 Safari/537.36 Edg/100.0.1185.50', // Edge 100 on Windows 10
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:102.0) Gecko/20100101 Firefox/102.0', // Firefox 102 on macOS
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:123.0) Gecko/20100101 Firefox/123.0', // Firefox 123 on Windows
	'Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko', // Internet Explorer 11 on Windows 10
	'Mozilla/5.0 (iPhone; U; CPU iPhone OS 11_0_9 like Mac OS X; en-US) AppleWebKit/602.5.3 (KHTML, like Gecko) Version/11.0.3 Mobile/8F48a Safari/6533.18.5', // Safari 11.0.3 on iOS 11.0.9
	'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.5 Safari/605.1.15', // Safari 15.5 on macOS
	'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1', // Safari 16.6 on iOS
	'Mozilla/5.0 (iPhone; CPU iPhone OS 15_4_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_25.1.1 JsSdk/2.0 NetType/WIFI Channel/App Store ByteLocale/en Region/US ByteFullLocale/en isDarkMode/1 WKWebView/1 BytedanceWebview/d8a21c6 FalconTag/', // WebView based browser on iOS 15.4
	'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/98.0.4758.82 Safari/537.36 OPR/84.0.4316.14', // Opera 84 on Windows 10
];

eeTest
	.describe('platform_editor_outdated_browser_update', 'outdated-browsers')
	.variant(true, () => {
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
