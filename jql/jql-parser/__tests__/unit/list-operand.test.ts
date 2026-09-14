import { invalid, valid } from '../../test-utils/data/list-operand.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('List operand', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
