jest.mock('react', () => ({
  useMemo: jest.fn().mockImplementation((fn) => fn()),
  useCallback: jest.fn().mockImplementation((fn) => fn),
}));

// eslint-disable-next-line no-global-assign
performance = ({
  mark: jest.fn(),
  measure: jest.fn(),
  clearMarks: jest.fn(),
} as unknown) as Performance;

jest.doMock('../../../utils/analytics/analytics');
jest.doMock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: jest.fn(),
}));

export const mockGetContext = () => ({
  config: {},
  connections: {
    client: {
      prefetchData: jest.fn(),
      fetchData: jest.fn(),
      postData: jest.fn(),
    },
  },
  store: {
    getState: jest.fn(() => ({})),
    dispatch: jest.fn(),
    subscribe: jest.fn(),
    replaceReducer: jest.fn(),
  },
  prefetchStore: {},
  extractors: {
    getPreview: jest.fn(),
  },
});

jest.doMock('../../context', () => ({
  useSmartLinkContext: jest.fn(() => mockGetContext()),
}));
