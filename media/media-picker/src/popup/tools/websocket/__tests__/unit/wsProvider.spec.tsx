jest.mock('../../wsConnectionHolder');

import { Auth } from '@atlaskit/media-core';
import { WsProvider } from '../../wsProvider';
import { WsConnectionHolder } from '../../wsConnectionHolder';

describe('WsProvider', () => {
  const baseUrl = 'https://media.api';
  const firstClient: Auth = {
    clientId: 'first-id',
    token: 'first-token',
    baseUrl,
  };
  const secondClient: Auth = {
    clientId: 'second-id',
    token: 'second-token',
    baseUrl,
  };

  let wsProvider: WsProvider;

  beforeEach(() => {
    wsProvider = new WsProvider();
  });

  afterEach(() => {
    (WsConnectionHolder as any).mockReset();
  });

  it('should create a new instance of WsConnection holder for a client', () => {
    wsProvider.getWsConnectionHolder(firstClient);

    expect(WsConnectionHolder).toHaveBeenCalledTimes(1);
    expect(WsConnectionHolder).toHaveBeenCalledWith(firstClient);
  });

  it('should reuse a WsConnectionHolder for the same client', () => {
    const first = wsProvider.getWsConnectionHolder(firstClient);
    const second = wsProvider.getWsConnectionHolder(firstClient);

    expect(WsConnectionHolder).toHaveBeenCalledTimes(1);
    expect(WsConnectionHolder).toHaveBeenCalledWith(firstClient);
    expect(first).toBe(second);
  });

  it('should create a new instance for the second client', () => {
    const first = wsProvider.getWsConnectionHolder(firstClient);
    expect(WsConnectionHolder).toHaveBeenCalledWith(firstClient);

    const second = wsProvider.getWsConnectionHolder(secondClient);
    expect(WsConnectionHolder).toHaveBeenCalledWith(secondClient);

    expect(WsConnectionHolder).toHaveBeenCalledTimes(2);
    expect(first).not.toBe(second);
  });
});
