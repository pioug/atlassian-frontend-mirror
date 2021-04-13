jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.mock('../../../utils/analytics/analytics');
jest.mock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: jest.fn(),
}));
jest.mock('../../../client/errors', () => ({
  APIError: jest.fn(),
}));
