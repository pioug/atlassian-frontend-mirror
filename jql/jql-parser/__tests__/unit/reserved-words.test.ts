import { invalid, valid } from '../../test-utils/data/reserved-words.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Reserved words', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
