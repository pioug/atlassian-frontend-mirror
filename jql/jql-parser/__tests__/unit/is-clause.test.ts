import { invalid, valid } from '../../test-utils/data/is-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Is clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
