jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.mock('../../../utils/analytics/analytics');
// force isIntersectionObserverSupported to be false until support for it is dropped.
jest.mock('@atlaskit/media-ui', () => {
  const actualModule = jest.requireActual('@atlaskit/media-ui');
  return {
    __esModule: true,
    ...actualModule,
    isIntersectionObserverSupported: () => false,
  };
});
