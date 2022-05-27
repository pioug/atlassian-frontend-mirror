jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.mock('../../../utils/analytics/analytics');
jest.mock('@atlaskit/outbound-auth-flow-client', () => {
  const { AuthError } = jest.requireActual(
    '@atlaskit/outbound-auth-flow-client',
  );
  return {
    auth: jest.fn(),
    AuthError,
  };
});
jest.mock('@atlaskit/link-provider', () => ({
  ...jest.requireActual<Object>('@atlaskit/link-provider'),
  APIError: jest.fn(),
}));
jest.mock('uuid', () => {
  const actualUuid = jest.requireActual('uuid');
  return {
    ...actualUuid,
    __esModule: true,
    default: jest.fn(),
  };
});
