import {
  getConfluenceMaxObjects,
  getJiraMaxObjects,
} from '../../experiment-utils';
import { ABTest, DEFAULT_AB_TEST } from '../../../api/CrossProductSearchClient';

describe('experiment-utils', () => {
  [
    {
      product: 'Jira',
      getMaxObjects: getJiraMaxObjects,
    },
    {
      product: 'Confluence',
      getMaxObjects: getConfluenceMaxObjects,
    },
  ].forEach(({ product, getMaxObjects }) => {
    describe(`get${product}MaxResults`, () => {
      it('should return default if experiment is not grape', () => {
        expect(getMaxObjects(DEFAULT_AB_TEST, 3)).toBe(3);
      });

      it('should return grape max value', () => {
        const grapeAbTest: ABTest = {
          abTestId: 'default_grape-100',
          controlId: 'default',
          experimentId: 'grape-100',
        };
        expect(getMaxObjects(grapeAbTest, 3)).toBe(100);
      });

      it('should return default value if grape max value is not parsable', () => {
        const grapeAbTest: ABTest = {
          abTestId: 'default_grape-abc',
          controlId: 'default',
          experimentId: 'grape-abc',
        };
        expect(getMaxObjects(grapeAbTest, 3)).toBe(3);
      });
    });
  });
});
