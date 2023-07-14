import { toFormattedParts } from '../toFormattedParts';

describe('toFormattedParts', () => {
  it('converts output of DateTimeFormat.formatToParts into indexed object', () => {
    const formatToPartsOutput: Intl.DateTimeFormatPart[] = [
      { type: 'weekday', value: 'Monday' },
      { type: 'literal', value: ' ' },
      { type: 'day', value: '13' },
      { type: 'month', value: 'July' },
      { type: 'year', value: '2020' },
      { type: 'hour', value: '01' },
      { type: 'minute', value: '56' },
      { type: 'second', value: '19' },
      { type: 'dayPeriod', value: 'am' },
      { type: 'timeZoneName', value: 'Australian Eastern Standard Time' },
    ];

    const expected = {
      weekday: 'Monday',
      literal: ' ',
      day: '13',
      month: 'July',
      year: '2020',
      hour: '01',
      minute: '56',
      second: '19',
      dayPeriod: 'am',
      timeZoneName: 'Australian Eastern Standard Time',
    };

    expect(toFormattedParts(formatToPartsOutput)).toEqual(expected);
  });
});
