import { formatDate } from '../../formatDate';

describe('#formatDate()', () => {
  it('should format date', () => {
    expect(formatDate(1621568300000)).toBe('21 May 2021, 03:38 AM');
  });
});
