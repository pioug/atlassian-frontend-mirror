import { invalid, valid } from '../../../test-utils/data/was-in-clause.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('Was in clause', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
