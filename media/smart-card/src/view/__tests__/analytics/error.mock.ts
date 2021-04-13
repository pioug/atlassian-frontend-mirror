jest.mock('../../../client/api', () => ({
  ...jest.requireActual<Object>('../../../client/api'),
  request: jest.fn(),
}));
jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.mock('../../../utils/analytics/analytics');
