import { extractLatestCommit } from '../index';
import { JsonLd } from 'json-ld-types';
import {
  TEST_BASE_DATA,
  TEST_DATA_WITH_LATEST_COMMIT_OBJ,
  TEST_DATA_WITH_LATEST_COMMIT_TEXT,
} from '../../../common/__mocks__/jsonld';

const TEST_COMMIT = '83f45c9';

describe('extractors.latestCommit', () => {
  it('should return undefined when latestCommit object is not presentIN JSON-LD', () => {
    expect(
      extractLatestCommit(TEST_BASE_DATA as JsonLd.Data.SourceCodeRepository),
    ).toBeUndefined();
  });

  it('should return correct value when latestCommit object is presentIN JSON-LD', () => {
    expect(
      extractLatestCommit(
        TEST_DATA_WITH_LATEST_COMMIT_OBJ as JsonLd.Data.SourceCodeRepository,
      ),
    ).toEqual(TEST_COMMIT);
  });

  it('should return the passed string if latestCommit object is a string', () => {
    expect(
      extractLatestCommit(
        TEST_DATA_WITH_LATEST_COMMIT_TEXT as JsonLd.Data.SourceCodeRepository,
      ),
    ).toEqual(TEST_COMMIT);
  });
});
