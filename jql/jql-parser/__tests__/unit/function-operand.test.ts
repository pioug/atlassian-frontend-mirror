import { invalid, valid } from '../../test-utils/data/function-operand.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Function operand', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
