/** Extracted into its own file so the mock variables can be instantiated before other imports in the test file that would otherwise be hoisted before it */
import {
  mockConfluencePrefetchedData,
  mockJiraPrefetchedData,
} from '../../../__tests__/unit/mocks/_mockPrefetchResults';

jest.mock('../../../api/prefetchResults', () => ({
  getConfluencePrefetchedData: mockConfluencePrefetchedData,
  getJiraPrefetchedData: mockJiraPrefetchedData,
}));
