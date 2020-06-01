import { expectToEqual } from '@atlaskit/media-test-helpers';
import { overrideMediaTypeIfUnknown } from '../../overrideMediaTypeIfUnknown';
import { ErrorFileState, FileState, MediaType } from '../../..';

describe('overrideMediaTypeIfUnknown()', () => {
  const mediaType: MediaType = 'doc';

  it('should override mediaType when FileState is not in error and mediaType is unknown', () => {
    expectToEqual(
      overrideMediaTypeIfUnknown(
        {
          status: 'processing',
          mediaType: 'unknown',
        } as FileState,
        mediaType,
      ),
      expect.objectContaining({ mediaType }),
    );
  });

  it('should not override mediaType when mediaType is known', () => {
    expectToEqual(
      overrideMediaTypeIfUnknown(
        {
          status: 'processing',
          mediaType: 'image',
        } as FileState,
        mediaType,
      ),
      {},
    );
  });

  it('should not override mediaType when FileState is in error', () => {
    expectToEqual(
      overrideMediaTypeIfUnknown(
        {
          status: 'error',
        } as ErrorFileState,
        mediaType,
      ),
      {},
    );
  });

  it('should not override mediaType when mediaType argument is undefined', () => {
    expectToEqual(
      overrideMediaTypeIfUnknown({
        status: 'processing',
        mediaType: 'unknown',
      } as FileState),
      {},
    );
  });
});
