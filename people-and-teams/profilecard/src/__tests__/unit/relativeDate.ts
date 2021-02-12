import relativeDate from '../../internal/relative-date';

import mockGlobalDate from './helper/_mock-global-date';

describe('RelativeDate', () => {
  const TODAY = new Date(2018, 10, 20, 17, 30, 0, 0);
  const TODAY_2 = new Date(new Date(TODAY).setHours(5));
  const YESTERDAY = new Date(new Date(TODAY).setDate(19));
  const THIS_WEEK = new Date(new Date(TODAY).setDate(18));
  const THIS_MONTH = new Date(new Date(TODAY).setDate(1));
  const LAST_MONTH = new Date(new Date(TODAY).setMonth(9));
  const A_FEW_MONTHS = new Date(new Date(TODAY).setMonth(8));
  const SEVERAL_MONTHS = new Date(new Date(TODAY).setMonth(2));
  const MORE_THAN_A_YEAR = new Date(new Date(TODAY).setMonth(-3));
  const INVALID_DATE = new Date('');
  const FUTURE_DATE = new Date(new Date(TODAY).setMonth(11));

  beforeAll(() => {
    mockGlobalDate.setToday(TODAY);
  });

  afterAll(() => {
    mockGlobalDate.reset();
  });

  it('should match when date prop is today', () => {
    const relativeDateKey = relativeDate(TODAY_2, TODAY);
    expect(relativeDateKey).toEqual('ThisWeek');
  });

  it('should match when date prop is yesterday', () => {
    const relativeDateKey = relativeDate(YESTERDAY, TODAY);
    expect(relativeDateKey).toEqual('ThisWeek');
  });

  it('should match when date prop is in this week', () => {
    const relativeDateKey = relativeDate(THIS_WEEK, TODAY);
    expect(relativeDateKey).toEqual('ThisWeek');
  });

  it('should match when date prop is in this month', () => {
    const relativeDateKey = relativeDate(THIS_MONTH, TODAY);
    expect(relativeDateKey).toEqual('ThisMonth');
  });

  it('should match when date prop is in last month', () => {
    const relativeDateKey = relativeDate(LAST_MONTH, TODAY);
    expect(relativeDateKey).toEqual('LastMonth');
  });

  it('should match when date prop is a few months ago', () => {
    const relativeDateKey = relativeDate(A_FEW_MONTHS, TODAY);
    expect(relativeDateKey).toEqual('AFewMonths');
  });

  it('should match when date prop is several months ago', () => {
    const relativeDateKey = relativeDate(SEVERAL_MONTHS, TODAY);
    expect(relativeDateKey).toEqual('SeveralMonths');
  });

  it('should match when date prop is more than a year ago', () => {
    const relativeDateKey = relativeDate(MORE_THAN_A_YEAR, TODAY);
    expect(relativeDateKey).toEqual('MoreThanAYear');
  });

  it('should match when date prop is invalid date', () => {
    const relativeDateKey = relativeDate(INVALID_DATE, TODAY);
    expect(relativeDateKey).toEqual(null);
  });

  it('should match when date prop is a future date', () => {
    const relativeDateKey = relativeDate(FUTURE_DATE, TODAY);
    expect(relativeDateKey).toEqual(null);
  });
});
