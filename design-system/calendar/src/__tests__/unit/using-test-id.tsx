import React from 'react';

import { fireEvent, render } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import Calendar from '../../index';

const testId = 'testing';
const testIdNextMonth = `${testId}--next-month`;
const testIdPrevMonth = `${testId}--previous-month`;
const testIdMonth = `${testId}--month`;
const testIdWeek = `${testId}--week`;
const testIdCalendarDates = `${testId}--calendar-dates`;
const testIdDay = `${testId}--day`;
const testIdSelectedDay = `${testId}--selected-day`;
const testIdCurrentMonthYear = `${testId}--current-month-year`;
const testIdContainer = `${testId}--container`;
const testIdColumnHeader = `${testId}--column-header`;

describe('Calendar should be found by data-testid', () => {
  it('Next month button is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getByTestId(testIdNextMonth)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdNextMonth)).toThrow();
  });

  it('Previous month button is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getByTestId(testIdPrevMonth)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdPrevMonth)).toThrow();
  });

  it('Month container is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getByTestId(testIdMonth)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdMonth)).toThrow();
  });

  it('Week container is accessible via data-testid', () => {
    const { getAllByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getAllByTestId(testIdWeek)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getAllByTestId(testIdWeek)).toThrow();
  });

  it('Day is accessible via data-testid', () => {
    const { getAllByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getAllByTestId(testIdDay).length).toBeGreaterThan(0);

    rerender(<Calendar />);

    expect(() => getAllByTestId(testIdDay)).toThrow();
  });

  describe('Selected day is accessible via data-testid', () => {
    ffTest(
      'platform.design-system-team.calendar-keyboard-accessibility_967h1',
      () => {
        const { getAllByTestId, getByTestId } = render(
          <Calendar testId={testId} />,
        );

        const weekContainer = getAllByTestId(testIdWeek);

        expect(() => getByTestId(testIdSelectedDay)).toThrow();

        // WeekDayGrid > role="gridcell" > button
        fireEvent.click(weekContainer[0].children[0].children[0]);

        expect(getByTestId(testIdSelectedDay)).toBeTruthy();
      },
      () => {
        const { getAllByTestId, getByTestId } = render(
          <Calendar testId={testId} />,
        );

        const weekContainer = getAllByTestId(testIdWeek);

        expect(() => getByTestId(testIdSelectedDay)).toThrow();

        fireEvent.click(weekContainer[0].children[0]);

        expect(getByTestId(testIdSelectedDay)).toBeTruthy();
      },
    );
  });

  it('Text containing current month and year is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getByTestId(testIdCurrentMonthYear)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdCurrentMonthYear)).toThrow();
  });

  it('Calendar dates container is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getByTestId(testIdCalendarDates)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdCalendarDates)).toThrow();
  });

  it('Container is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId={testId} />);

    expect(getByTestId(testIdContainer)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdContainer)).toThrow();
  });

  it('Column header is accessible via data-testid', () => {
    const { getAllByTestId, rerender } = render(<Calendar testId={testId} />);
    expect(getAllByTestId(testIdColumnHeader)).toBeTruthy();
    rerender(<Calendar />);
    expect(() => getAllByTestId(testIdColumnHeader)).toThrow();
  });
});
