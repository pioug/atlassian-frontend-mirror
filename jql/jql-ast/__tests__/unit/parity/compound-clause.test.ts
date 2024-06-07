import { invalid, valid } from '../../../test-utils/data/compound-clause.json';
import { assertInvalid, assertValid } from '../../../test-utils/util';

describe('Compound clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
