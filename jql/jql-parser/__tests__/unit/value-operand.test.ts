import { invalid, valid } from '../../test-utils/data/value-operand.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Value operand', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
