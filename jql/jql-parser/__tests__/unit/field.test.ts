import { invalid, valid } from '../../test-utils/data/field.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Field', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
