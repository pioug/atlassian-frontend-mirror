import { getUrlParameter } from '../../getUrlParameter';

describe('getUrlParameter helper method', () => {
  it('returns value if parameter exists in url', () => {
    expect(getUrlParameter('value', '?value=123')).toEqual('123');
    expect(getUrlParameter('value', '?text=abc&obj={}&value=345')).toEqual(
      '345',
    );
  });

  it('returns undefined if parameter does not exist', () => {
    expect(getUrlParameter('value', '')).toBeUndefined();
    expect(getUrlParameter('value', '?')).toBeUndefined();
    expect(getUrlParameter('value', '?text=abc&obj={}')).toBeUndefined();
  });
});
