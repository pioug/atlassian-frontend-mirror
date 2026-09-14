import { invalid, valid } from '../../test-utils/data/value-operand.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Value operand', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
