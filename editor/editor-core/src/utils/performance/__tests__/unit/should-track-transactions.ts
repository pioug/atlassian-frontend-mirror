import { shouldTrackTransaction } from '../../should-track-transaction';

describe('shouldTrackTransaction', () => {
  const options = {
    enabled: true,
  };

  it('should return true 4 times within the threshold of 5 when run 20 times', () => {
    // call to increment counter
    const results = new Array(20)
      .fill(false)
      .map(() => shouldTrackTransaction({ enabled: true, samplingRate: 5 }))
      .filter(bool => bool);

    expect(results).toHaveLength(4);
  });

  it('should return false until threshold of 100', () => {
    expect(shouldTrackTransaction(options)).toBeFalsy();
  });

  it('should return true once within the threshold of 100', () => {
    // call to increment counter
    const results = new Array(100)
      .fill(false)
      .map(() => shouldTrackTransaction(options))
      .filter(bool => bool);

    expect(results).toHaveLength(1);
  });

  it('should return true twice when called 200 times', () => {
    // call to increment counter
    const results = new Array(200)
      .fill(false)
      .map(() => shouldTrackTransaction(options))
      .filter(bool => bool);

    expect(results).toHaveLength(2);
  });
});
