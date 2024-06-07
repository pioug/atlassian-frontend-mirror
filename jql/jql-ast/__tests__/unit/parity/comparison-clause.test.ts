import { invalid, valid } from '../../../test-utils/data/comparison-clause.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('Comparison clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
