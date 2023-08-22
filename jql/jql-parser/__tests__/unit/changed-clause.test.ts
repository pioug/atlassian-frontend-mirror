import { invalid, valid } from '../../test-utils/data/changed-clause.json';
import { assertInvalid, assertValid } from '../../test-utils/util';

describe('Changed clause', () => {
  assertValid(valid);
  assertInvalid(invalid);
});
