import { formatDateTimeZoneIntoIso } from '../../../internal';
import {
  convertTo24hrTime,
  isValid,
  removeSpacer,
} from '../../../internal/parse-time';

// ParseTime
const correctTimes = [
  '12:45:15am',
  '12:45pm',
  '1:13pm',
  '1:23:45 pm',
  '1:13 PM ',
  ' 1:13 PM ',
  '2:33 p M ',
  '1',
  '113pm',
  '01',
  '123456',
  '01pm',
];

const incorrectTimes = ['watermelon', '34675y83u4534ui59', '1111111'];

const convertedTimes = [
  { hour: 0, minute: 45, seconds: 15 },
  { hour: 12, minute: 45, seconds: 0 },
  { hour: 13, minute: 13, seconds: 0 },
  { hour: 13, minute: 23, seconds: 45 },
  { hour: 13, minute: 13, seconds: 0 },
  { hour: 13, minute: 13, seconds: 0 },
  { hour: 14, minute: 33, seconds: 0 },
  { hour: 1, minute: 0, seconds: 0 },
  { hour: 13, minute: 13, seconds: 0 },
  { hour: 1, minute: 0, seconds: 0 },
  { hour: 12, minute: 34, seconds: 56 },
  { hour: 13, minute: 0, seconds: 0 },
];

test('"isValid" - accept valid times.', () => {
  correctTimes.forEach((time) => {
    expect(isValid(time)).toEqual(true);
  });
});

test('"isValid" - reject invalid times.', () => {
  incorrectTimes.forEach((time) => {
    expect(isValid(time)).toEqual(false);
  });
});

test('"convertTo24hrTime" - takes a time and returns an object with parsed 24hr times', () => {
  correctTimes.forEach((time, i) => {
    const tester = removeSpacer(time);
    expect(convertTo24hrTime(tester)).toEqual(convertedTimes[i]);
  });
});

test('"formatDateTimeZoneIntoIso" - double digit hours without leading zero time returns ISO str', () => {
  const dateStr = '2020-02-07';
  const timeStr = '10:30';
  const zoneStr = '+1100';
  const expectedISOOutput = '2020-02-07T10:30+1100';

  expect(formatDateTimeZoneIntoIso(dateStr, timeStr, zoneStr)).toEqual(
    expectedISOOutput,
  );
});

test('"formatDateTimeZoneIntoIso" - single digit hours without leading zero time returns ISO str', () => {
  const dateStr = '2020-02-07';
  const timeStr = '1:00';
  const zoneStr = '+0800';
  const expectedISOOutput = '2020-02-07T01:00+0800';

  expect(formatDateTimeZoneIntoIso(dateStr, timeStr, zoneStr)).toEqual(
    expectedISOOutput,
  );
});

test('"formatDateTimeZoneIntoIso" - single digit hours with leading zero time returns ISO str', () => {
  const dateStr = '2020-02-07';
  const timeStr = '01:00';
  const zoneStr = '+0800';
  const expectedISOOutput = '2020-02-07T01:00+0800';

  expect(formatDateTimeZoneIntoIso(dateStr, timeStr, zoneStr)).toEqual(
    expectedISOOutput,
  );
});
