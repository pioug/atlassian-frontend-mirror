import { invalid, valid } from '../../../test-utils/data/not-clause.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('Not clause', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
