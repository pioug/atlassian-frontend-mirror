import { getNetworkFields } from './index';

describe('getNetworkFields', () => {
  it('should return null values if not provided with a `Response`', () => {
    const attributes = getNetworkFields(new Error());

    expect(attributes).toStrictEqual({
      traceId: null,
      status: null,
      path: null,
    });
  });

  it('should return fields if provided a `Response`', () => {
    const response = new Response(null, {
      status: 400,
      headers: { 'x-trace-id': 'some-traceid' },
    });

    Object.defineProperty(response, 'url', {
      value: 'https://atlassian.com/some-path?some-query-params',
    });

    const attributes = getNetworkFields(response);

    expect(attributes).toStrictEqual({
      traceId: 'some-traceid',
      status: 400,
      path: '/some-path',
    });
  });

  it('should not throw if `Response.url` is not a valid URL', () => {
    const response = new Response(null, { status: 400 });

    const attributes = getNetworkFields(response);

    expect(attributes).toStrictEqual({
      traceId: null,
      status: 400,
      path: 'Failed to parse pathname from url',
    });
  });
});
