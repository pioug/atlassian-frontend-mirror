import { ForgeClient } from '../../client';

describe('ForgeClient', () => {
  it('should return correct endpoint', () => {
    const nativeLocation = window.location;
    const client = new ForgeClient();

    expect(client.getApiEndpoint()).toEqual(
      'https://api-private.stg.atlassian.com/object-resolver',
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
