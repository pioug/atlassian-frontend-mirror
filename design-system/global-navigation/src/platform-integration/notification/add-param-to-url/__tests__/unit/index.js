import addParamToUrl from '../../index';

describe('Add param to URL', () => {
  it('should return the url as it is when no query params are passed', () => {
    const url = 'http://www.example.com';

    expect(addParamToUrl(url)).toEqual(url);
  });

  it('should add a single query param to the url', () => {
    const url = 'http://www.example.com';
    const expectedUrl = 'http://www.example.com?search=queryParam';

    expect(addParamToUrl(url, 'search', 'queryParam')).toEqual(expectedUrl);
  });

  it('should add multiple query params', () => {
    const url = 'http://www.example.com?search=queryParam';
    const expectedUrl = 'http://www.example.com?search=queryParam&client=ios';

    expect(addParamToUrl(url, 'client', 'ios')).toEqual(expectedUrl);
  });
});
