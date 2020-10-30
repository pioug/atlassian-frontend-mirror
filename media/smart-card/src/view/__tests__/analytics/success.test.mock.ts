/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import { mockEvents } from '../../__mocks__/events';

jest.mock('react-lazily-render', () => (data: any) => data.content);
jest.mock('react-transition-group/Transition', () => (data: any) =>
  data.children,
);
jest.mock('../../../utils/analytics', () => mockEvents);
jest.mock('@atlaskit/outbound-auth-flow-client', () => ({
  auth: jest.fn(),
}));
jest.mock('../../../client/errors', () => ({
  APIError: jest.fn(),
}));
