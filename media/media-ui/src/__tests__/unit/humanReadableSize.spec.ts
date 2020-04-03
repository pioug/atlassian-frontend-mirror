import { toHumanReadableMediaSize } from '../../humanReadableSize';

describe('toHumanReadableMediaSize', () => {
  it('should return no decimal places when the media size is less than 1 MB', () => {
    const oneByte = 1;
    expect(toHumanReadableMediaSize(oneByte)).toEqual('1 B');

    const oneHundredBytes = 100;
    expect(toHumanReadableMediaSize(oneHundredBytes)).toEqual('100 B');

    const oneHundredAndFiftyKiloBytes = 153600;
    expect(toHumanReadableMediaSize(oneHundredAndFiftyKiloBytes)).toEqual(
      '150 KB',
    );
  });

  it('should return one decimal place when the media size is greater than or equal to 1 MB', () => {
    const onePointFiveMegaBytes = 1572864;
    expect(toHumanReadableMediaSize(onePointFiveMegaBytes)).toEqual('1.5 MB');

    const twelvePointThreeMegaBytes = 12897490;
    expect(toHumanReadableMediaSize(twelvePointThreeMegaBytes)).toEqual(
      '12.3 MB',
    );

    const onePointThreeGigaBytes = 1395864375;
    expect(toHumanReadableMediaSize(onePointThreeGigaBytes)).toEqual('1.3 GB');
  });
});
