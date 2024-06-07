import { invalid, valid } from '../../test-utils/data/query.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Query', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
