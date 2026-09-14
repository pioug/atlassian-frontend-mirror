import { invalid, valid } from '../../test-utils/data/equals-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Equals clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
