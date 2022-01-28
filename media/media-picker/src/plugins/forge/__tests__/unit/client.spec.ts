import { ForgeClient } from '../../client';

describe('ForgeClient', () => {
  it('should return correct endpoint', () => {
    const nativeLocation = window.location;
    const client = new ForgeClient();

    // MEX-946: as we've planned to remove this feature part of MEX-1099 and it's unshipped,
    // we won't support that use case
    expect(() => client.getApiEndpoint()).toThrowError(
      "Non-tenanted API isn't supported",
    );

    Object.defineProperty(window, 'location', {
      configurable: true,
      value: {
        origin: 'https://bitbucket.org',
      },
    });

    expect(client.getApiEndpoint()).toEqual(
      'https://bitbucket.org/gateway/api/object-resolver',
    );

    delete window.location;
    window.location = nativeLocation;
  });
});
