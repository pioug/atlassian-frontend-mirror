export const io = (url: String) => {
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
  };
};

export default io;
