import { formatLargeNumber, formatStringWithDecimal } from './utils';

describe('utils', () => {
  it('should handle numbers below 1000', () => {
    expect(formatLargeNumber(8)).toEqual('8');
    expect(formatLargeNumber(17)).toEqual('17');
    expect(formatLargeNumber(983)).toEqual('983');
  });

  it('should handle nunbers >= 1000 and < 1000000', () => {
    expect(formatLargeNumber(1000)).toEqual('1K');
    expect(formatLargeNumber(2340)).toEqual('2.3K');
    expect(formatLargeNumber(10000)).toEqual('10K');
    expect(formatLargeNumber(55555)).toEqual('55.5K');
    expect(formatLargeNumber(897651)).toEqual('897.6K');
    expect(formatLargeNumber(646000)).toEqual('646K');
  });

  it('should handle numbers >= 1000000', () => {
    expect(formatLargeNumber(1000000)).toEqual('1M');
    expect(formatLargeNumber(1800000)).toEqual('1.8M');
    expect(formatLargeNumber(30000000)).toEqual('30M');
    expect(formatLargeNumber(70700000)).toEqual('70.7M');
    expect(formatLargeNumber(900000000)).toEqual('900M');
    expect(formatLargeNumber(865707700)).toEqual('865.7M');
    expect(formatLargeNumber(1234567890)).toEqual('999.9M+');
  });

  it('should format numbers with decimals', () => {
    expect(formatStringWithDecimal('123.5', 1)).toEqual('123.5');
    expect(formatStringWithDecimal('98.000', 0)).toEqual('98');
    expect(formatStringWithDecimal('8.897654', 1)).toEqual('8.8');
    expect(formatStringWithDecimal('650.7189', 0)).toEqual('650');
    expect(formatStringWithDecimal('9.54321', 3)).toEqual('9.543');
    expect(formatStringWithDecimal('876', 0)).toEqual('876');
  });
});
