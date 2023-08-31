import React from 'react';

import {
  fireEvent,
  queryByAttribute,
  render,
  RenderResult,
} from '@testing-library/react';
// eslint-disable-next-line no-restricted-imports
import { parseISO } from 'date-fns';
import cases from 'jest-in-case';

import Calendar, { CalendarProps } from '../../index';
import dateToString from '../../internal/utils/date-to-string';
import { TabIndex, WeekDay } from '../../types';

jest.mock('react-uid', () => ({
  useUIDSeed: () => () => 'react-uid',
}));

const getById = queryByAttribute.bind(null, 'id');

const getAnnouncerElementTextContent = (container: HTMLElement) =>
  getById(container, 'announce-react-uid')?.textContent;

const getDayElementButton = (renderResult: RenderResult, textContent: string) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'button' && element?.textContent === textContent,
  )[0];

const getSelectedDay = (renderResult: RenderResult) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'button' && element!.getAttribute('aria-pressed') === 'true',
  )[0];

const weekendFilter = (date: string) => {
  const dayOfWeek = parseISO(date).getDay();
  return dayOfWeek === 0 || dayOfWeek === 6;
};

describe('Calendar', () => {
  const testId = 'calendar';
  const testIdMonth = `${testId}--month`;
  const defaultDay = 1;
  const defaultDisabledDay = 4;
  const defaultPreviouslySelectedDay = 6;
  const defaultSelectedDay = 8;
  const defaultMonth = 12;
  const defaultMonthName = 'December';
  const defaultYear = 2019;
  const defaultTabIndex = 0;

  const setup = (calendarProps: Partial<CalendarProps> = {}) => {
    const props = {
      disabled: [
        dateToString({
          day: defaultDisabledDay,
          month: defaultMonth,
          year: defaultYear,
        }),
      ],
      defaultPreviouslySelected: [
        dateToString({
          day: defaultPreviouslySelectedDay,
          month: defaultMonth,
          year: defaultYear,
        }),
      ],
      defaultSelected: [
        dateToString({
          day: defaultSelectedDay,
          month: defaultMonth,
          year: defaultYear,
        }),
      ],
      defaultDay,
      defaultMonth,
      defaultYear,
      onBlur: jest.fn(),
      onChange: jest.fn(),
      onFocus: jest.fn(),
      onSelect: jest.fn(),
      testId,
    };
    const ref = React.createRef<HTMLDivElement>();

    const renderResult = render(
      <Calendar {...props} {...calendarProps} ref={ref} />,
    );

    return {
      renderResult,
      props,
      ref,
    };
  };

  it('should render announcer date', () => {
    const { renderResult } = setup();
    expect(
      getAnnouncerElementTextContent(renderResult.container),
    ).toBeUndefined();
  });

  describe('Heading', () => {
    it('should render the title', () => {
      const { renderResult } = setup();

      const heading = renderResult.getByRole('heading');
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent('December 2019');
    });

    it('should render month/year section as a live region only after user has interacted with either previous/next month buttons', () => {
      const { renderResult } = setup();

      const headingContainer = renderResult.getByTestId(
        `${testId}--current-month-year--container`,
      );

      expect(headingContainer).not.toHaveAttribute('aria-live');

      const previousMonthButton = renderResult.getByTestId(
        `${testId}--previous-month-icon`,
      );
      fireEvent.click(previousMonthButton);

      expect(headingContainer).toHaveAttribute('aria-live');
    });

    it('should label previous/next buttons with next/previous month/year', () => {
      const firstMonth = 1;
      const lastMonth = 12;

      const { renderResult: firstMonthRenderResult } = setup({
        month: firstMonth,
      });

      expect(
        firstMonthRenderResult.getByTestId(`${testId}--previous-month-icon`),
      ).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/, December 2018$/),
      );

      expect(
        firstMonthRenderResult.getByTestId(`${testId}--next-month-icon`),
      ).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/, February 2019$/),
      );

      firstMonthRenderResult.unmount();

      const { renderResult: lastMonthResnderResult } = setup({
        month: lastMonth,
      });

      expect(
        lastMonthResnderResult.getByTestId(`${testId}--previous-month-icon`),
      ).toHaveAttribute(
        'aria-label',
        expect.stringMatching(/, November 2019$/),
      );

      expect(
        lastMonthResnderResult.getByTestId(`${testId}--next-month-icon`),
      ).toHaveAttribute('aria-label', expect.stringMatching(/, January 2020$/));
    });

    it('should switch to previous month when clicked on left arrow button', () => {
      const { renderResult, props } = setup();

      fireEvent.click(
        renderResult.getByTestId(`${testId}--previous-month-icon`),
      );

      expect(
        renderResult.getByTestId(`${testId}--current-month-year`),
      ).toHaveTextContent('November 2019');

      expect(props.onChange).toHaveBeenCalledWith(
        { day: 1, iso: '2019-11-01', month: 11, type: 'prev', year: 2019 },
        expect.anything(),
      );
    });

    it('should switch to next month when clicked on right arrow button', () => {
      const { renderResult, props } = setup();

      fireEvent.click(renderResult.getByTestId(`${testId}--next-month-icon`));

      expect(
        renderResult.getByTestId(`${testId}--current-month-year`),
      ).toHaveTextContent('January 2020');

      expect(props.onChange).toHaveBeenCalledWith(
        { day: 1, iso: '2020-01-01', month: 1, type: 'next', year: 2020 },
        expect.anything(),
      );
    });

    it('should have month arrow buttons accessible by keyboard', () => {
      const { renderResult } = setup();

      expect(
        renderResult.getByTestId(`${testId}--previous-month`),
      ).toHaveAttribute('tabindex', String(defaultTabIndex));

      expect(renderResult.getByTestId(`${testId}--next-month`)).toHaveAttribute(
        'tabindex',
        String(defaultTabIndex),
      );
    });

    it('should have default aria labels on month arrow buttons', () => {
      const { renderResult } = setup();

      expect(
        renderResult.getByTestId(`${testId}--previous-month-icon`),
      ).toHaveAttribute('aria-label', expect.stringMatching(/^Previous month/));

      expect(
        renderResult.getByTestId(`${testId}--next-month-icon`),
      ).toHaveAttribute('aria-label', expect.stringMatching(/^Next month/));
    });
  });

  describe('Date', () => {
    it('should be labelled by month/year header', () => {
      const { renderResult } = setup();
      const heading = renderResult.getByRole('heading');
      const headingId = heading.getAttribute('id');
      const calendarGrid = renderResult.getByRole('grid');
      expect(calendarGrid.getAttribute('aria-labelledby')).toBe(headingId);
    });

    it('should render default selected day', () => {
      const { renderResult } = setup();

      const selectedDayElement = getSelectedDay(renderResult);

      expect(selectedDayElement).toHaveAttribute('aria-pressed', 'true');
    });

    it('should render each day with a label containing the full date', () => {
      const { renderResult } = setup();

      const selectedDayElement = getSelectedDay(renderResult);

      expect(selectedDayElement).toHaveAttribute(
        'aria-label',
        '8, Sunday December 2019',
      );
    });

    it('should have tabindex="-1" for all days but focused day, which will use tabIndex prop', () => {
      [-1 as TabIndex, 0 as TabIndex].forEach((tabIndex) => {
        const { renderResult } = setup({ tabIndex });

        const dayButtons = renderResult.getAllByRole(
          (content, element) =>
            content === 'button' &&
            element?.parentElement?.getAttribute('role') === 'gridcell',
        );

        dayButtons.forEach((dayButton) => {
          if (dayButton.getAttribute('data-focused') === 'true') {
            expect(dayButton).toHaveAttribute('tabindex', String(tabIndex));
          } else {
            expect(dayButton).toHaveAttribute('tabindex', '-1');
          }
        });

        renderResult.unmount();
      });
    });

    it('should handle day selection behavior', () => {
      const dayAfterSelectedDay = defaultSelectedDay + 1;
      const { renderResult, props } = setup();

      const selectedDay = getSelectedDay(renderResult);

      expect(selectedDay).toHaveAttribute('aria-pressed', 'true');

      const unselectedDay = getDayElementButton(
        renderResult,
        String(dayAfterSelectedDay),
      );

      expect(unselectedDay).toHaveAttribute('aria-pressed', 'false');

      fireEvent.click(unselectedDay);

      expect(unselectedDay).toHaveAttribute('aria-pressed', 'true');
      expect(props.onSelect).toHaveBeenCalledWith(
        {
          day: dayAfterSelectedDay,
          iso: dateToString({
            day: dayAfterSelectedDay,
            month: defaultMonth,
            year: defaultYear,
          }),
          month: defaultMonth,
          year: defaultYear,
        },
        expect.anything(),
      );
    });

    it('should be correctly disabled via disabled array props', () => {
      const { renderResult } = setup();

      const disabledDayElement = getDayElementButton(
        renderResult,
        String(defaultDisabledDay),
      );
      const notDisabledDayElement = getDayElementButton(
        renderResult,
        String(defaultDisabledDay + 1),
      );

      expect(disabledDayElement).toHaveAttribute('aria-disabled', 'true');
      expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
      expect(notDisabledDayElement).not.toHaveAttribute('aria-disabled');
      expect(notDisabledDayElement).not.toHaveAttribute('data-disabled');
    });

    it('should be correctly disabled via minDate and maxDate props', () => {
      const { renderResult } = setup({
        minDate: '2019-12-03',
        maxDate: '2019-12-19',
      });

      const outOfRangeDates = ['2', '20'];
      outOfRangeDates.forEach((date) => {
        const disabledDayElement = getDayElementButton(renderResult, date);
        expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
      });

      const inRangeDates = ['3', '19'];
      inRangeDates.forEach((date) => {
        const disabledDayElement = getDayElementButton(renderResult, date);
        expect(disabledDayElement).not.toHaveAttribute('data-disabled', 'true');
      });
    });

    it('should be correctly disabled via disabledDateFilter props', () => {
      const { renderResult } = setup({
        disabledDateFilter: weekendFilter,
      });

      const disabledDayElement = getDayElementButton(renderResult, '14');
      expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
    });

    it('should not select day if disabled', () => {
      const { renderResult, props } = setup();
      const disabledDayElement = getDayElementButton(
        renderResult,
        String(defaultDisabledDay),
      );
      fireEvent.click(disabledDayElement);
      expect(props.onSelect).not.toHaveBeenCalled();
    });
  });

  describe('Date cell cursor', () => {
    it('show cursor pointer', () => {
      const { renderResult } = setup();
      const cell = getDayElementButton(renderResult, '15');
      expect(cell).toHaveStyle('cursor: pointer');
    });

    it('cursor not-allowed when disabled', () => {
      const { renderResult } = setup();
      const disabledCell = getDayElementButton(renderResult, '4');
      expect(disabledCell).toHaveStyle('cursor: not-allowed');
    });
  });

  it('should propagate tabindex to all interactive elements', () => {
    [-1 as TabIndex, 0 as TabIndex].forEach((tabIndexValue) => {
      const {
        renderResult: { getByTestId, unmount },
      } = setup({ tabIndex: tabIndexValue });

      // Header
      const previousMonthButton = getByTestId(`${testId}--previous-month`);
      const nextMonthButton = getByTestId(`${testId}--next-month`);

      expect(previousMonthButton).toHaveAttribute(
        'tabindex',
        String(tabIndexValue),
      );
      expect(nextMonthButton).toHaveAttribute(
        'tabindex',
        String(tabIndexValue),
      );
      // Body
      const calendarDatesElement = getByTestId(`${testId}--calendar-dates`);

      expect(calendarDatesElement).toHaveAttribute(
        'tabindex',
        String(tabIndexValue),
      );
      unmount();
    });
  });

  it('should set appropriate attributes on focus', () => {
    const { renderResult } = setup();

    const focusedDayElement = getDayElementButton(
      renderResult,
      String(defaultDay),
    );
    const unfocusedDayElement = getDayElementButton(
      renderResult,
      String(defaultDay + 1),
    );

    expect(focusedDayElement).toHaveAttribute('data-focused', 'true');
    expect(unfocusedDayElement).not.toHaveAttribute('data-focused');
  });

  it('should set appropriate attributes when current day', () => {
    const today = new Date();

    const { renderResult } = setup({
      day: today.getDate(),
      month: today.getMonth() + 1,
      year: today.getFullYear(),
    });

    const todayElement = getDayElementButton(
      renderResult,
      String(today.getDate()),
    );
    const notTodayElement = getDayElementButton(
      renderResult,
      String(today.getDate() + 1),
    );

    expect(todayElement).toHaveAttribute('aria-current', 'date');
    expect(notTodayElement).not.toHaveAttribute('aria-current');
  });

  it('should handle onBlur and focus event', () => {
    const { renderResult, props } = setup();

    const { container } = renderResult;
    const calendarContainerElement = container.firstChild as HTMLDivElement;

    fireEvent.focus(calendarContainerElement);

    expect(props.onFocus).toHaveBeenCalledTimes(1);

    fireEvent.blur(calendarContainerElement);

    expect(props.onBlur).toHaveBeenCalledTimes(1);

    fireEvent.focus(calendarContainerElement);

    expect(props.onFocus).toHaveBeenCalledTimes(2);
  });

  cases(
    'should select day when following keys are pressed',
    ({ key, code }: { key: string; code: string }) => {
      const focusedDay = 10;
      const { renderResult, props } = setup({
        defaultDay: focusedDay,
      });

      const currentSelectedDay = getSelectedDay(renderResult);

      expect(currentSelectedDay).toHaveTextContent(String(defaultSelectedDay));

      const calendarGrid = renderResult.getByTestId(testIdMonth);
      const isPrevented = fireEvent.keyDown(calendarGrid as HTMLDivElement, {
        key,
        code,
      });

      const newSelectedDay = getSelectedDay(renderResult);

      expect(newSelectedDay).toHaveTextContent(String(focusedDay));

      expect(isPrevented).toBe(false);
      expect(props.onSelect).toHaveBeenCalledWith(
        {
          day: 10,
          iso: '2019-12-10',
          month: 12,
          year: 2019,
        },
        expect.anything(),
      );
    },
    [
      { name: 'Enter', key: 'Enter', code: 'Enter' },
      { name: 'Space', key: ' ', code: 'Space' },
    ],
  );

  cases(
    'should highlight day when following keys are pressed',
    ({
      key,
      code,
      date,
    }: {
      key: string;
      code: string;
      date: {
        day: number;
        iso: string;
        month: number;
        year: number;
      };
    }) => {
      const { renderResult, props } = setup({
        defaultDay: 15,
      });

      const calendarGrid = renderResult.getByTestId(testIdMonth);
      const isPrevented = fireEvent.keyDown(calendarGrid as HTMLDivElement, {
        key,
        code,
      });

      expect(isPrevented).toBe(false);
      expect(props.onChange).toHaveBeenCalledWith(date, expect.anything());
    },
    [
      {
        name: 'ArrowDown',
        key: 'ArrowDown',
        code: 'ArrowDown',
        date: {
          day: 22,
          iso: '2019-12-22',
          month: 12,
          year: 2019,
          type: 'down',
        },
      },
      {
        name: 'ArrowLeft',
        key: 'ArrowLeft',
        code: 'ArrowLeft',
        date: {
          day: 14,
          iso: '2019-12-14',
          month: 12,
          year: 2019,
          type: 'left',
        },
      },
      {
        name: 'ArrowRight',
        key: 'ArrowRight',
        code: 'ArrowRight',
        date: {
          day: 16,
          iso: '2019-12-16',
          month: 12,
          year: 2019,
          type: 'right',
        },
      },
      {
        name: 'ArrowUp',
        key: 'ArrowUp',
        code: 'ArrowUp',
        date: {
          day: 8,
          iso: '2019-12-08',
          month: 12,
          year: 2019,
          type: 'up',
        },
      },
    ],
  );

  it('should switch to previous month and highlight the day when navigated through arrow keys at the edge', () => {
    const { renderResult, props } = setup({
      defaultDay: 1,
    });

    const calendarGrid = renderResult.getByTestId(testIdMonth);
    const isPrevented = fireEvent.keyDown(calendarGrid as HTMLDivElement, {
      key: 'ArrowUp',
      code: 'ArrowUp',
    });

    expect(isPrevented).toBe(false);
    expect(props.onChange).toHaveBeenCalledWith(
      {
        day: 24,
        iso: '2019-11-24',
        month: 11,
        year: 2019,
        type: 'up',
      },
      expect.anything(),
    );
  });

  it('should assign passed ref to top level element', () => {
    const { renderResult, ref } = setup();

    expect(ref.current).toBe(renderResult.container.firstChild);
  });

  it('should rerender calendar with new date when passed from outside', () => {
    // Can't test with different years/months because then the view changes and
    // the selected date is no longer accessible via visible calendar grid
    const newDay = defaultDay + 1;

    const { renderResult } = setup({
      day: defaultDay,
      month: defaultMonth,
      year: defaultYear,
      selected: [
        dateToString({
          day: defaultDay,
          month: defaultMonth,
          year: defaultYear,
        }),
      ],
    });
    const monthYear = renderResult.getByTestId(`${testId}--current-month-year`);

    expect(monthYear).toHaveTextContent(`${defaultMonthName} ${defaultYear}`);
    expect(getSelectedDay(renderResult)).toHaveTextContent(String(defaultDay));

    renderResult.rerender(
      <Calendar
        day={newDay}
        month={defaultMonth}
        year={defaultYear}
        selected={[
          dateToString({
            day: newDay,
            month: defaultMonth,
            year: defaultYear,
          }),
        ]}
      />,
    );

    expect(monthYear).toHaveTextContent(`${defaultMonthName} ${defaultYear}`);
    expect(getSelectedDay(renderResult)).toHaveTextContent(String(newDay));
  });

  cases(
    'should render weekdays depending on #weekStartDay',
    ({
      weekStartDay,
      expected,
    }: {
      weekStartDay: WeekDay;
      expected: string;
    }) => {
      const headerElements = setup({
        weekStartDay,
      }).renderResult.getAllByTestId(`${testId}--column-headers`)?.[0];
      expect(headerElements.textContent).toBe(expected);
    },
    {
      weekStartDay0: {
        weekStartDay: 0,
        expected: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].join(''),
      },
      weekStartDay1: {
        weekStartDay: 1,
        expected: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].join(''),
      },
    },
  );
});
