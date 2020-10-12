import cleanProps from '../../cleanProps';

describe('cleanProps', () => {
  it('should remove createAnalyticsEvent but return the rest', () => {
    const props = {
      createAnalyticsEvent: () => null,
      hello: 'goodbye',
      time: 1425,
      letters: ['A', 'B'],
    };

    expect(cleanProps(props)).toEqual({
      hello: 'goodbye',
      time: 1425,
      letters: ['A', 'B'],
    });
  });
});
