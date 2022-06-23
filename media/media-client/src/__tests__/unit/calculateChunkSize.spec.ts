import { DATA_UNIT } from '../../models/media';
import {
  calculateChunkSize,
  fileSizeError,
} from '../../uploader/calculateChunkSize';

const chunkSizes = {
  fiveMB: 5242880,
  fiftyMB: 52428800,
  oneHundredMB: 104857600,
  twoHundredTenMB: 220200960,
};

const testCases: [number, string, number][] = [
  [chunkSizes.twoHundredTenMB, '2TB', DATA_UNIT.TB * 2],
  [chunkSizes.twoHundredTenMB, '0.96TB', DATA_UNIT.TB * 0.96],
  [chunkSizes.oneHundredMB, '0.95TB', DATA_UNIT.TB * 0.95],
  [chunkSizes.oneHundredMB, '50.1GB', DATA_UNIT.GB * 50.1],
  [chunkSizes.fiftyMB, '50GB', DATA_UNIT.GB * 50],
  [chunkSizes.fiftyMB, '5.1GB', DATA_UNIT.GB * 5.1],
  [chunkSizes.fiveMB, '5GB', DATA_UNIT.GB * 5],
  [chunkSizes.fiveMB, '5MB', DATA_UNIT.MB * 5],
];

describe('calculateChunkSize', () => {
  it.each(testCases)(
    'chunk size should not be more than 200MB',
    (_, __, fileSize) =>
      expect(calculateChunkSize(fileSize)).toBeLessThanOrEqual(220200960),
  );

  it.each(testCases)(
    'chunk size should not be less than 5MB',
    (_, __, fileSize) =>
      expect(calculateChunkSize(fileSize)).toBeGreaterThanOrEqual(5242880),
  );

  it.each(testCases)(
    'chunk count should not be more than 10000',
    (_, __, fileSize) =>
      expect(fileSize / calculateChunkSize(fileSize)).toBeLessThanOrEqual(
        10000,
      ),
  );

  it.each(testCases)(
    'chunk count should not be less than 1',
    (_, __, fileSize) =>
      expect(fileSize / calculateChunkSize(fileSize)).toBeGreaterThanOrEqual(1),
  );

  it.each(testCases)(
    'to return %i when the file size is %s: %iB )',
    (expected, _, fileSize) =>
      expect(calculateChunkSize(fileSize)).toBe(expected),
  );

  it('should throw an error when the size exceeds 2TB', () =>
    expect(() => calculateChunkSize(2199023255552 + 1)).toThrowError(
      fileSizeError,
    ));
});
