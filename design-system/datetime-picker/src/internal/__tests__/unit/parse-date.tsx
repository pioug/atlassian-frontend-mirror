import { getSafeCalendarValue, getShortISOString } from '../../parse-date';

describe('getShortISOString', () => {
  it('should return a string', () => {
    expect(typeof getShortISOString(new Date())).toBe('string');
  });

  it('should return an ISO date', () => {
    expect(getShortISOString(new Date())).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});

describe('getSafeCalendarValue', () => {
  const today = new Date();
  const todayISODate = `${today.getFullYear()}-${String(
    today.getMonth() + 1,
  ).padStart(2, '0')}-${today.getDate()}`;

  it('should return a string', () => {
    expect(typeof getSafeCalendarValue('1969-04-20')).toBe('string');
  });

  it("should return today's date as an ISO string if year exceeds 10000", () => {
    expect(getSafeCalendarValue('10000-01-01')).toBe(todayISODate);
  });

  it('should return the date as is if year does not exceed 10000', () => {
    expect(getSafeCalendarValue(todayISODate)).toBe(todayISODate);
    const differentDate = '1969-04-20';
    expect(getSafeCalendarValue(differentDate)).toBe(differentDate);
  });
});
