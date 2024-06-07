import { invalid, valid } from '../../test-utils/data/list-operand.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('List operand', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
