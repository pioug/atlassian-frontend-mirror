const events = new Map<string, (...args: any) => {}>();

export function Channel(config: any) {
  return {
    getSocket: () => ({
      emit: (event: string, ...args: any[]) => {
        const handler = events.get(event);
        if (handler) {
          handler(...args);
        }
      },
    }),
    on: jest.fn().mockImplementation(function (this: any, eventName, callback) {
      events.set(eventName, callback);
      return this;
    }),
    connect: jest.fn(),
    broadcast: () => jest.fn(),
  };
}
