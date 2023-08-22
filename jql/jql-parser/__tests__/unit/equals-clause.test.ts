import { invalid, valid } from '../../test-utils/data/equals-clause.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Equals clause', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
