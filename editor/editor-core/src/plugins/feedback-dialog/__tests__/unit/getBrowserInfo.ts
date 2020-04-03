import getBrowserInfo from '../../getBrowserInfo';

describe('getBrowserInfo', () => {
  it('should return correct browser and its version', () => {
    expect(
      getBrowserInfo(
        'Mozilla/4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64;Trident/4.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; InfoPath.2)',
      ),
    ).toEqual('Microsoft Internet Explorer 8.0');
    expect(
      getBrowserInfo(
        'Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/35.0.1916.114 Safari/537.36',
      ),
    ).toEqual('Chrome 35.0.1916.114');
    expect(
      getBrowserInfo(
        'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:29.0) Gecko/20100101 Firefox/29.0',
      ),
    ).toEqual('Firefox 29.0');
    expect(
      getBrowserInfo(
        'Mozilla/5.0 (Windows; U; Win98; en-US; rv:0.9.2) Gecko/20010725 Netscape6/6.1',
      ),
    ).toEqual('Netscape6 6.1');
    expect(
      getBrowserInfo(
        'Opera/12.02 (Android 4.1; Linux; Opera Mobi/ADR-1111101157; U; en-US) Presto/2.9.201 Version/12.02',
      ),
    ).toEqual('Opera 12.02');
  });
});
