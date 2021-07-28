export const mockIo = {
  io: jest.fn().mockImplementation((url: string, opt: any) => {
    const events = new Map<string, (...args: any) => {}>();

    return {
      events,
      on: jest
        .fn()
        .mockImplementation((eventName, callback) =>
          events.set(eventName, callback),
        ),
      connect: jest.fn(),
      emit: (event: string, ...args: any[]) => {
        const handler = events.get(event);
        if (handler) {
          handler(...args);
        }
      },
      id: 'test-sid-asdf',
      ...(opt.transportOptions
        ? {
            io: {
              opts: {
                transportOptions: opt.transportOptions,
              },
            },
          }
        : {}),
    };
  }),
};

jest.mock('socket.io-client', () => mockIo);
