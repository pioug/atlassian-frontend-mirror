import { invalid, valid } from '../../test-utils/data/in-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('In clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
