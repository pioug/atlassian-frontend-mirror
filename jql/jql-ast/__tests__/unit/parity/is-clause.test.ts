import { invalid, valid } from '../../../test-utils/data/is-clause.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('Is clause', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
