jest.unmock('socket.io-client');

import { createSocketIOSocket } from '../../socket-io-provider';

describe('socket io provider', () => {
  it('return io with correct path', () => {
    const url = 'http://localhost:8080/ccollab/sessionId/123';
    const socket = createSocketIOSocket(url);
    expect((socket as any).io.engine.path).toEqual('/ccollab/socket.io/');
  });
});
