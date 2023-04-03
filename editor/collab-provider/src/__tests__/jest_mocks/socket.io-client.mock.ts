export const mockIo = {
  io: jest.fn().mockImplementation((_url: string, opt: any) => {
    const events = new Map<string, (...args: any) => {}>();
    const managerEvents = new Map<string, (...args: any) => {}>();

    // Mocking auth callback invocation
    // WARNING this is a very vague implementation of how the actual socket.io-client does this
    const auth = opt.auth;
    if (typeof auth === 'function') {
      const authCb = jest.fn();
      auth(authCb);
    }

    return {
      id: 'mock-socket.io-client',
      connect: jest.fn(),
      close: jest.fn(),
      events,
      on: jest
        .fn()
        .mockImplementation((eventName, callback) =>
          events.set(eventName, callback),
        ),
      emit: (event: string, ...args: any[]) => {
        const handler = events.get(event);
        if (handler) {
          handler(...args);
        }
      },
      io: {
        opts: {
          transportOptions: opt.transportOptions,
        },
        managerEvents,
        on: jest
          .fn()
          .mockImplementation((eventName, callback) =>
            managerEvents.set(eventName, callback),
          ),
        emit: (event: string, ...args: any[]) => {
          const handler = managerEvents.get(event);
          if (handler) {
            handler(...args);
          }
        },
      },
    };
  }),
};

jest.mock('socket.io-client', () => mockIo);
