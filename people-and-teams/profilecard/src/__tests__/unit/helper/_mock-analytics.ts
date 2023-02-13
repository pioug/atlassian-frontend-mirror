export const createAnalyticsEvent = jest.fn((body) => {
  // Mocking an implementation of this so tests will run successfully
  const event = {
    dummy: 'hello',
    clone: () => ({
      fire: () => undefined,
    }),
  };

  return event as any;
});

export function flexiTime(event: Record<string, any>) {
  return {
    ...event,
    attributes: {
      ...event.attributes,
      firedAt: expect.anything(),
    },
  };
}
