import { createUrl, extendHeaders } from '../helpers';

describe('createUrl', () => {
  test.each([[null], [undefined]])(
    '(%s) params should be stripped out',
    (replaceFileId) => {
      const url = 'http://fake.com';
      const params = {
        collection: 'MediaServicesSample',
        occurrenceKey: 'a18b1b92',
        replaceFileId,
      };
      const result = createUrl(url, {
        params,
      });
      expect(result).toBe(
        `${url}/?collection=${params.collection}&occurrenceKey=${params.occurrenceKey}`,
      );
    },
  );

  test.each([[0], [false], ['test'], ['']])(
    '(%s) params should not be stripped out',
    (replaceFileId) => {
      const url = 'http://fake.com';
      const params = {
        collection: 'MediaServicesSample',
        occurrenceKey: 'a18b1b92',
        replaceFileId,
      };
      const result = createUrl(url, {
        params,
      });
      expect(result).toBe(
        `${url}/?collection=${params.collection}&occurrenceKey=${params.occurrenceKey}&replaceFileId=${params.replaceFileId}`,
      );
    },
  );
});

describe('extendHeaders()', () => {
  it('returns undefined if no parameters are provided', () => {
    expect(extendHeaders()).toBeUndefined();
  });

  it('returns headers if no auth or traceContext are provided', () => {
    expect(extendHeaders({ someHeader: 'someHeader' })).toStrictEqual({
      someHeader: 'someHeader',
    });
  });

  it('attatches client based auth headers to the provided headers', () => {
    expect(
      extendHeaders(
        { someHeader: 'someHeader' },
        {
          clientId: 'client-client-id',
          token: 'client-based-token',
          baseUrl: 'base-url',
        },
      ),
    ).toStrictEqual({
      someHeader: 'someHeader',
      'X-Client-Id': 'client-client-id',
      Authorization: 'Bearer client-based-token',
    });
  });

  it('attatches asap based auth headers to the provided headers', () => {
    expect(
      extendHeaders(
        { someHeader: 'someHeader' },
        {
          asapIssuer: 'some-asapIssuer',
          token: 'asap-based-token',
          baseUrl: 'asap-base-url',
        },
      ),
    ).toStrictEqual({
      someHeader: 'someHeader',
      'X-Issuer': 'some-asapIssuer',
      Authorization: 'Bearer asap-based-token',
    });
  });

  it('attatches trace context headers to the provided headers', () => {
    expect(
      extendHeaders({ someHeader: 'someHeader' }, undefined, {
        traceId: 'some-trace-id',
        spanId: 'some-span-id',
      }),
    ).toStrictEqual({
      someHeader: 'someHeader',
      'x-b3-traceid': 'some-trace-id',
      'x-b3-spanid': 'some-span-id',
    });
  });
});
