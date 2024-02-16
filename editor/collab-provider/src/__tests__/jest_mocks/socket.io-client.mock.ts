export const mockIo = {
  io: jest.fn().mockImplementation((_url: string, opt: any) => {
    const events = new Map<string, (...args: any) => {}>();
    const managerEvents = new Map<string, (...args: any) => {}>();

    // Mocking auth callback invocation
    // WARNING this is a very vague implementation of how the actual socket.io-client does this
    const authCb = jest.fn();
    const auth = opt.auth;
    if (typeof auth === 'function') {
      auth(authCb);
    }

    return {
      _authCb: authCb,
      id: 'mock-socket.io-client',
      connect: jest.fn().mockImplementation(() => {
        // Mock calling auth callback on connect.
        if (typeof auth === 'function') {
          auth(authCb);
        }
        // Connect event, triggered by SocketIO Client
        events?.get('connect')?.();
        // Fake response to imitate NCS actions on connection
        events?.get('presence')?.({
          userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
        });

        // Fake initial document
        events?.get('data')?.({
          type: 'initial',
          userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
          metadata: { expire: 1680844522, title: 'Notes' },
          doc: {
            type: 'doc',
            content: [
              { type: 'paragraph', content: [{ type: 'text', text: 'lol' }] },
            ],
          },
          version: 3,
        });

        // Fake other participant joining
        events?.get('participant:updated')?.({
          sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
          timestamp: 1680759407071,
          data: {
            sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
            userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
            clientId: 3274991230,
            permit: {
              isPermittedToEdit: true,
              isPermittedToView: true,
              isPermittedToComment: true,
            },
          },
        });
        events?.get('presence:joined')?.({
          sessionId: 'NX5-eFC6rmgE7Y3PAH1D',
          timestamp: 1680759407925,
        });

        // Fake change coming from remote
        events?.get('steps:added')?.({
          version: 3, // Fake version so the steps get considered valid (0 + length of steps 3)
          steps: [
            {
              stepType: 'replace',
              from: 160, // Don't look too closely, this is not a valid change for the doc
              to: 160,
              slice: {
                content: [
                  {
                    type: 'text',
                    text: 'l',
                  },
                ],
              },
              clientId: 71949442,
              userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
              createdAt: 1680680084434,
            },
            {
              stepType: 'replace',
              from: 161,
              to: 161,
              slice: {
                content: [
                  {
                    type: 'text',
                    text: 'o',
                  },
                ],
              },
              clientId: 71949442,
              userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
              createdAt: 1680680084434,
            },
            {
              stepType: 'replace',
              from: 162,
              to: 162,
              slice: {
                content: [
                  {
                    type: 'text',
                    text: 'l',
                  },
                ],
              },
              clientId: 71949442,
              userId: '70121:8fce2c13-5f60-40be-a9f2-956c6f041fbe',
              createdAt: 1680680084434,
            },
          ],
        });
      }),
      close: jest.fn(),
      events,
      on: jest
        .fn()
        .mockImplementation((eventName, callback) =>
          events.set(eventName, callback),
        ),
      onAnyOutgoing: jest.fn().mockImplementation((event, ...args) => null),
      emit: jest.fn().mockImplementation((event: string, ...args: any[]) => {
        const handler = events.get(event);
        if (handler) {
          handler(...args);
        }
      }),
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
        emit: jest.fn().mockImplementation((event: string, ...args: any[]) => {
          const handler = managerEvents.get(event);
          if (handler) {
            handler(...args);
          }
        }),
      },
    };
  }),
};

jest.mock('socket.io-client', () => mockIo);
