import { getRenderBucket } from '../../render-tracker-bucketing';

describe('utils/render-tracker-bucketing', () => {
  it('should return correct buckets when various durations specified', () => {
    expect(getRenderBucket(1)).toEqual('500');
    expect(getRenderBucket(500.5)).toEqual('1000');
    expect(getRenderBucket(600)).toEqual('1000');
    expect(getRenderBucket(1000)).toEqual('1000');
    expect(getRenderBucket(1200)).toEqual('2000');
    expect(getRenderBucket(2400)).toEqual('4000');
    expect(getRenderBucket(5000)).toEqual('+Inf');
    // Currently, negative values return null.
    expect(getRenderBucket(-100)).toEqual(null);
  });
});
