import { invalid, valid } from '../../test-utils/data/was-in-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Was in clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
