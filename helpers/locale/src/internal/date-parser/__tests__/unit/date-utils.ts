import { getDaysInMonth, isLeapYear, isValid, DateObj } from '../../utils';

describe('date-parser/utils', () => {
  it.each<[number, boolean]>([
    [2000, true],
    [2001, false],
    [2002, false],
    [2003, false],
    [2004, true],
    [2005, false],
    [2006, false],
    [2007, false],
    [2008, true],
    [2009, false],
    [2010, false],
    [2011, false],
    [2012, true],
    [2013, false],
    [2014, false],
    [2015, false],
    [2016, true],
    [2017, false],
    [2018, false],
    [2019, false],
    [2020, true],
    [2021, false],
    [2022, false],
    [2023, false],
    [2024, true],
    [2025, false],
    [2026, false],
    [2027, false],
    [2028, true],
    [2029, false],
    [2030, false],
  ])('isLeapYear(%p)', (date, expected) => {
    expect(isLeapYear(date)).toEqual(expected);
  });

  it.each<[number, number, number]>([
    [2019, 1, 31],
    [2019, 2, 28],
    [2019, 3, 31],
    [2019, 4, 30],
    [2019, 5, 31],
    [2019, 6, 30],
    [2019, 7, 31],
    [2019, 8, 31],
    [2019, 9, 30],
    [2019, 10, 31],
    [2019, 11, 30],
    [2019, 12, 31],
    [2020, 2, 29],
  ])('getDaysInMonth(%d, %d)', (year, month, expected) => {
    expect(getDaysInMonth(year, month)).toEqual(expected);
  });

  it.each<[DateObj, boolean]>([
    [{ year: 2000, month: 2, day: 29 }, true],
    [{ year: 2001, month: 2, day: 29 }, false],
    [{ year: 2000, month: 13, day: 1 }, false],
    [{ year: 2000, month: 1, day: 32 }, false],
    [{ year: NaN, month: NaN, day: NaN }, false],
  ])('isValid(%p)', (date, expected) => {
    expect(isValid(date)).toEqual(expected);
  });
});
