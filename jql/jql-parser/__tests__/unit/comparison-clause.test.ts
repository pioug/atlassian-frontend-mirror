import { invalid, valid } from '../../test-utils/data/comparison-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Comparison clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
