import { isWebkitSupported } from '../../browser';

//Used this link for navigator.userAgents: https://deviceatlas.com/blog/list-of-user-agent-strings
describe('Browser', () => {
  it('should be unsupported for webkitentry if the Browser is IE/Opera/Firefox', () => {
    [
      {
        userAgent:
          'Mozilla/5.0 (Windows NT 10.0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/42.0.2311.135 Safari/537.36 Edge/12.10136',
        platform: '',
      },
      {
        userAgent: 'OPR',
        platform: 'Opera',
      },
      {
        userAgent:
          'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:15.0) Gecko/20100101 Firefox/15.0.1',
        platform: 'Firefox',
      },
    ].forEach((mockedNavigator) => {
      const browser = isWebkitSupported(mockedNavigator);

      expect(browser).toEqual(false);
    });
  });

  it('should be supported for other browsers: Chrome/Safari/Android', () => {
    [
      {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/69.0.3497.105 Mobile/15E148 Safari/605.1',
        platform: 'Chrome',
      },
      {
        userAgent:
          'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        platform: 'Safari',
      },
      {
        userAgent:
          'Mozilla/5.0 (Linux; Android 8.0.0; SM-G960F Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
        platform: 'Android',
      },
    ].forEach((mockedNavigator) => {
      const browser = isWebkitSupported(mockedNavigator);

      expect(browser).toEqual(true);
    });
  });
});
