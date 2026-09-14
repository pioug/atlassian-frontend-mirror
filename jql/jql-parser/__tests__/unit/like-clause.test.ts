import { invalid, valid } from '../../test-utils/data/like-clause.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Like clause', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
