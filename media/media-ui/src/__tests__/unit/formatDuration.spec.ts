import { formatDuration } from '../../formatDuration';

describe('formatDuration', () => {
  const minute = 60;
  const hour = 60 * minute;
  it('should format seconds into readable format', () => {
    expect(formatDuration(0)).toEqual('0:00');
    expect(formatDuration(5)).toEqual('0:05');
    expect(formatDuration(10)).toEqual('0:10');
    expect(formatDuration(1 * minute + 20)).toEqual('1:20');
    expect(formatDuration(41 * minute)).toEqual('41:00');
    expect(formatDuration(2 * hour + 10)).toEqual('2:00:10');
    expect(formatDuration(12 * hour + 30 * minute + 10)).toEqual('12:30:10');
    expect(formatDuration(36 * hour + 30 * minute + 10)).toEqual('36:30:10');
  });

  it('should deal with edge numerical cases', () => {
    expect(formatDuration(NaN)).toEqual('0:00');
    expect(formatDuration(Infinity)).toEqual('0:00');
    expect(formatDuration(-33)).toEqual('0:00');
  });
});
