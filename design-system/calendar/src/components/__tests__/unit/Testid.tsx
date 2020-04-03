import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Calendar from '../../..';

const testIdNextMonth = 'testing--next-month';
const testIdPrevMonth = 'testing--previous-month';
const testIdMonth = 'testing--month';
const testIdSelectedDay = 'testing--selected-day';

describe('Test Id', () => {
  it('Next month button is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId="testing" />);

    expect(getByTestId(testIdNextMonth)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdNextMonth)).toThrow();
  });

  it('Previous month button is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId="testing" />);

    expect(getByTestId(testIdPrevMonth)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdPrevMonth)).toThrow();
  });

  it('Month container is accessible via data-testid', () => {
    const { getByTestId, rerender } = render(<Calendar testId="testing" />);

    expect(getByTestId(testIdMonth)).toBeTruthy();

    rerender(<Calendar />);

    expect(() => getByTestId(testIdMonth)).toThrow();
  });

  it('Selected day is accessible via data-testid', () => {
    const { getByTestId } = render(<Calendar testId="testing" />);

    const monthContainer = getByTestId(testIdMonth);

    expect(() => getByTestId(testIdSelectedDay)).toThrow();

    fireEvent.click(monthContainer.children[0].children[0]);

    expect(getByTestId(testIdSelectedDay)).toBeTruthy();
  });
});
