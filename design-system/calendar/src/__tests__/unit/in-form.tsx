import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import { ffTest } from '@atlassian/feature-flags-test-utils';

import Calendar from '../../index';

const testId = 'testing';
const testIdMonth = `${testId}--month`;
const testIdWeek = `${testId}--week`;
const testIdSelectedDay = `${testId}--selected-day`;

describe('Calendar should not submit form', () => {
  const onSubmit = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  describe('Day selection does not trigger form (click)', () => {
    ffTest(
      'platform.design-system-team.calendar-keyboard-accessibility_967h1',
      () => {
        const { getAllByTestId, getByTestId } = render(
          <form onSubmit={onSubmit}>
            <Calendar testId={testId} />
          </form>,
        );

        const weekContainer = getAllByTestId(testIdWeek);

        expect(() => getByTestId(testIdSelectedDay)).toThrow();

        // WeekDayGrid > role="gridcell" > button
        fireEvent.click(weekContainer[0].children[0].children[0]);

        expect(onSubmit).toHaveBeenCalledTimes(0);

        // but the day _is_ now selected
        expect(getByTestId(testIdSelectedDay)).toBeTruthy();
      },
      () => {
        const { getAllByTestId, getByTestId } = render(
          <form onSubmit={onSubmit}>
            <Calendar testId={testId} />
          </form>,
        );

        const weekContainer = getAllByTestId(testIdWeek);

        expect(() => getByTestId(testIdSelectedDay)).toThrow();

        fireEvent.click(weekContainer[0].children[0]);

        expect(onSubmit).toHaveBeenCalledTimes(0);

        // but the day _is_ now selected
        expect(getByTestId(testIdSelectedDay)).toBeTruthy();
      },
    );
  });

  it('Day selection does not trigger form (enter)', () => {
    const { getByTestId } = render(
      <form onSubmit={onSubmit}>
        <Calendar testId={testId} />
      </form>,
    );

    const monthContainer = getByTestId(testIdMonth);

    expect(() => getByTestId(testIdSelectedDay)).toThrow();

    // this is 'a day'
    fireEvent.keyDown(monthContainer.children[0], {
      key: 'Enter',
      code: 13,
    });

    expect(onSubmit).toHaveBeenCalledTimes(0);

    // but the day _is_ now selected
    expect(getByTestId(testIdSelectedDay)).toBeTruthy();
  });
});
