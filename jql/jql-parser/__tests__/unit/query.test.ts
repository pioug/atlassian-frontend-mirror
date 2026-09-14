import { invalid, valid } from '../../test-utils/data/query.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Query', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
