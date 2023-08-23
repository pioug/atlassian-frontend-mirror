import { invalid, valid } from '../../../test-utils/data/was-clause.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('Was clause', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
