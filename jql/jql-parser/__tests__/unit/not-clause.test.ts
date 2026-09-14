import { invalid, valid } from '../../test-utils/data/not-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Not clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
