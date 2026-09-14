jest.doMock('../../../utils/analytics/analytics');
jest.doMock('../../../utils/analytics/fireSmartLinkEvent');
jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) => data.children);

export {};
