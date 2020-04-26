export const mockEvents = {
  resolvedEvent: jest
    .fn()
    .mockReturnValue({ attributes: { componentName: 'smart-cards' } }),
  unresolvedEvent: jest.fn(),
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
