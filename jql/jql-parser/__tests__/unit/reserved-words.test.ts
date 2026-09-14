import { invalid, valid } from '../../test-utils/data/reserved-words.json';
import { assertInvalid } from '../../test-utils/util/assertInvalid';
import { assertValid } from '../../test-utils/util/assertValid';

describe('Reserved words', () => {
	assertValid(valid);
	assertInvalid(invalid);
});
