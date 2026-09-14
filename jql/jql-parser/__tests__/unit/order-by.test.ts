import { invalid, valid } from '../../test-utils/data/order-by.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Order by', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
