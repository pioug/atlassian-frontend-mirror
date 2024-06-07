import { invalid, valid } from '../../test-utils/data/like-clause.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Like clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
