import {
  isEmptyFile,
  EMPTY_FILE_HOURS_ELAPSED_TOLERANCE_MS,
} from '../../detectEmptyFile';
import { MediaCollectionItemFullDetails } from '../../../models/media';

describe('Detect Empty Files', () => {
  const NOW = 1613978306455;

  describe('isEmptyFile()', () => {
    // note: this case is necessary to simulate the real world shape returned from empty file.
    const emptyFileDetails = ({
      createdAt: NOW,
    } as unknown) as MediaCollectionItemFullDetails;

    it('should detect empty file if hours since createdAt greater than tolerance', () => {
      expect(
        isEmptyFile(
          emptyFileDetails,
          NOW + EMPTY_FILE_HOURS_ELAPSED_TOLERANCE_MS + 1,
        ),
      ).toBeTruthy();
    });

    it('should not detect empty file if hours since createdAt equal than tolerance', () => {
      expect(
        isEmptyFile(
          emptyFileDetails,
          NOW + EMPTY_FILE_HOURS_ELAPSED_TOLERANCE_MS,
        ),
      ).toBeFalsy();
    });

    it('should not detect empty file if hours since createdAt less than tolerance', () => {
      expect(isEmptyFile(emptyFileDetails, NOW)).toBeFalsy();
    });
  });
});
