import React from 'react';

import { cleanup, fireEvent, render } from '@testing-library/react';

import Calendar from '../../index';

const testId = 'testing';
const testIdMonth = `${testId}--month`;
const testIdSelectedDay = `${testId}--selected-day`;

describe('Calendar should not submit form', () => {
  const onSubmit = jest.fn();

  afterEach(() => {
    jest.resetAllMocks();
    cleanup();
  });

  it('Day selection does not trigger form (click)', () => {
    const { getByTestId } = render(
      <form onSubmit={onSubmit}>
        <Calendar testId={testId} />
      </form>,
    );

    const monthContainer = getByTestId(testIdMonth);

    expect(() => getByTestId(testIdSelectedDay)).toThrow();

    // this is 'a day'
    fireEvent.click(monthContainer.children[0].children[0]);

    expect(onSubmit).toHaveBeenCalledTimes(0);

    // but the day _is_ now selected
    expect(getByTestId(testIdSelectedDay)).toBeTruthy();
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
    fireEvent.keyDown(monthContainer.children[0].children[0], {
      key: 'Enter',
      code: 13,
    });

    expect(onSubmit).toHaveBeenCalledTimes(0);

    // but the day _is_ now selected
    expect(getByTestId(testIdSelectedDay)).toBeTruthy();
  });
});
