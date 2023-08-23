import { invalid, valid } from '../../../test-utils/data/in-clause.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('In clause', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
