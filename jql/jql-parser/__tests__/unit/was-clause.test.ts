import { invalid, valid } from '../../test-utils/data/was-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Was clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
