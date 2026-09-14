import { invalid, valid } from '../../test-utils/data/field.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Field', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
