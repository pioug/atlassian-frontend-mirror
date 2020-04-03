import { object } from './_fixtures';
import { createTestsForObject } from './_createTestsForObject';
import { extractPropsFromObject } from '../../extractPropsFromObject';

describe('extractPropsFromObject()', () => {
  createTestsForObject(object, extractPropsFromObject);
});
