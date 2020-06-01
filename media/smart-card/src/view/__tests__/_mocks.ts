const mockBaseEvents = {
  resolvedEvent: jest.fn().mockReturnValue({
    action: 'resolved',
    attributes: { componentName: 'smart-cards' },
  }),
  unresolvedEvent: jest.fn().mockReturnValue({
    action: 'unresolved',
    attributes: { componentName: 'smart-cards' },
  }),
  connectSucceededEvent: jest.fn(),
  connectFailedEvent: jest.fn(),
  invokeSucceededEvent: jest.fn(),
  invokeFailedEvent: jest.fn(),
  uiActionClickedEvent: jest.fn(),
  trackAppAccountConnected: jest.fn(),
  uiAuthEvent: jest.fn(),
  uiAuthAlternateAccountEvent: jest.fn(),
  uiCardClickedEvent: jest.fn(),
  uiClosedAuthEvent: jest.fn(),
  screenAuthPopupEvent: jest.fn(),
  fireSmartLinkEvent: jest.fn(),
  uiRenderSuccessEvent: jest.fn(),
  uiRenderFailedEvent: jest.fn(),
};

const instrumentEvent = jest
  .fn()
  .mockImplementation((_id: string, status: string) => {
    if (status === 'resolved') {
      return mockBaseEvents.resolvedEvent();
    } else {
      return mockBaseEvents.unresolvedEvent();
    }
  });

const mockEvents = {
  ...mockBaseEvents,
  instrumentEvent,
};

export { mockEvents };
