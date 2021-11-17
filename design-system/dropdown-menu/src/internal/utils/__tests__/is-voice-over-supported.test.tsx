import isVoiceOverSupported from '../is-voice-over-supported';

const chromeInMacOSXUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 11_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36';
const chromeInWindowsUserAgent =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36';

describe('#isVoiceOverSupported', () => {
  it('should return true for browser running in mac os x', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: chromeInMacOSXUserAgent,
      configurable: true,
    });
    const isSupported = isVoiceOverSupported();
    expect(isSupported).toBe(true);
  });

  it('should return false for browser running in mac os x', () => {
    Object.defineProperty(window.navigator, 'userAgent', {
      value: chromeInWindowsUserAgent,
      configurable: true,
    });
    const isSupported = isVoiceOverSupported();
    expect(isSupported).toBe(false);
  });
});
