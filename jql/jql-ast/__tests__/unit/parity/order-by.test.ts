import { invalid, valid } from '../../../test-utils/data/order-by.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('Order by', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
