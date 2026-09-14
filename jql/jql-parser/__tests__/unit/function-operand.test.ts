import { invalid, valid } from '../../test-utils/data/function-operand.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Function operand', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
