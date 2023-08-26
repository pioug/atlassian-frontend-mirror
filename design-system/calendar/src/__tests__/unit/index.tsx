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

import { ffTest } from '@atlassian/feature-flags-test-utils';

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

const getDayElementGridcell = (
  renderResult: RenderResult,
  textContent: string,
) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'gridcell' && element?.textContent === textContent,
  )[0];

const getSelectedDayButton = (renderResult: RenderResult) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'button' && element!.getAttribute('aria-pressed') === 'true',
  )[0];

const getSelectedDayGridcell = (renderResult: RenderResult) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'gridcell' &&
      element!.getAttribute('aria-selected') === 'true',
  )[0];

const getSwitchMonthElement = (renderResult: RenderResult, label: string) =>
  renderResult.getAllByRole(
    (content, element) =>
      content === 'img' && element!.getAttribute('aria-label') === label,
    { hidden: true },
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

  describe('should render announcer date', () => {
    ffTest(
      'platform.design-system-team.calendar-keyboard-accessibility_967h1',
      () => {
        const { renderResult } = setup();
        expect(
          getAnnouncerElementTextContent(renderResult.container),
        ).toBeUndefined();
      },
      () => {
        const { renderResult } = setup();
        expect(
          getAnnouncerElementTextContent(renderResult.container),
        ).toContain('Sun Dec 01 2019');
      },
    );
  });
  describe('Heading', () => {
    describe('should render the title', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();

          const heading = renderResult.getByRole('heading');
          expect(heading).toBeInTheDocument();
          expect(heading).toHaveTextContent('December 2019');
        },
        () => {
          const { renderResult } = setup();

          expect(renderResult.getByText('December 2019')).toBeInTheDocument();
        },
      );
    });

    describe('should render month/year section as a live region only after user has interacted with either previous/next month buttons', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
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
        },
        () => {
          const { renderResult } = setup();

          const headingContainer = renderResult.getByTestId(
            `${testId}--current-month-year`,
          );

          expect(headingContainer).not.toHaveAttribute('aria-live');
        },
      );
    });

    describe('should label previous/next buttons with next/previous month/year', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const firstMonth = 1;
          const lastMonth = 12;

          const { renderResult: firstMonthRenderResult } = setup({
            month: firstMonth,
          });

          expect(
            firstMonthRenderResult.getByTestId(
              `${testId}--previous-month-icon`,
            ),
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
            lastMonthResnderResult.getByTestId(
              `${testId}--previous-month-icon`,
            ),
          ).toHaveAttribute(
            'aria-label',
            expect.stringMatching(/, November 2019$/),
          );

          expect(
            lastMonthResnderResult.getByTestId(`${testId}--next-month-icon`),
          ).toHaveAttribute(
            'aria-label',
            expect.stringMatching(/, January 2020$/),
          );
        },
        () => {
          const { renderResult } = setup();

          expect(
            getSwitchMonthElement(renderResult, 'Last month'),
          ).toHaveAttribute('aria-label', expect.stringMatching(/Last month/));

          expect(
            getSwitchMonthElement(renderResult, 'Next month'),
          ).toHaveAttribute('aria-label', expect.stringMatching(/Next month/));
        },
      );
    });

    describe('should switch to previous month when clicked on left arrow button', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
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
        },
        () => {
          const { renderResult, props } = setup();

          fireEvent.click(getSwitchMonthElement(renderResult, 'Last month'));

          expect(renderResult.getByText('November 2019')).toBeInTheDocument();

          expect(
            getAnnouncerElementTextContent(renderResult.container),
          ).toContain('Fri Nov 01 2019');

          expect(props.onChange).toHaveBeenCalledWith(
            { day: 1, iso: '2019-11-01', month: 11, type: 'prev', year: 2019 },
            expect.anything(),
          );
        },
      );
    });

    describe('should switch to next month when clicked on right arrow button', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult, props } = setup();

          fireEvent.click(
            renderResult.getByTestId(`${testId}--next-month-icon`),
          );

          expect(
            renderResult.getByTestId(`${testId}--current-month-year`),
          ).toHaveTextContent('January 2020');

          expect(props.onChange).toHaveBeenCalledWith(
            { day: 1, iso: '2020-01-01', month: 1, type: 'next', year: 2020 },
            expect.anything(),
          );
        },
        () => {
          const { renderResult, props } = setup();

          fireEvent.click(getSwitchMonthElement(renderResult, 'Next month'));

          expect(renderResult.getByText('January 2020')).toBeInTheDocument();

          expect(
            getAnnouncerElementTextContent(renderResult.container),
          ).toContain('Wed Jan 01 2020');

          expect(props.onChange).toHaveBeenCalledWith(
            { day: 1, iso: '2020-01-01', month: 1, type: 'next', year: 2020 },
            expect.anything(),
          );
        },
      );
    });

    describe('should have month arrow buttons accessible by keyboard', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();

          expect(
            renderResult.getByTestId(`${testId}--previous-month`),
          ).toHaveAttribute('tabindex', String(defaultTabIndex));

          expect(
            renderResult.getByTestId(`${testId}--next-month`),
          ).toHaveAttribute('tabindex', String(defaultTabIndex));
        },
        () => {
          const { renderResult } = setup();

          expect(
            renderResult.getByTestId(`${testId}--previous-month`),
          ).toHaveAttribute('tabindex', '-1');

          expect(
            renderResult.getByTestId(`${testId}--next-month`),
          ).toHaveAttribute('tabindex', '-1');
        },
      );
    });

    describe('should have default aria labels on month arrow buttons', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();

          expect(
            renderResult.getByTestId(`${testId}--previous-month-icon`),
          ).toHaveAttribute(
            'aria-label',
            expect.stringMatching(/^Previous month/),
          );

          expect(
            renderResult.getByTestId(`${testId}--next-month-icon`),
          ).toHaveAttribute('aria-label', expect.stringMatching(/^Next month/));
        },
        () => {
          const { renderResult } = setup();

          expect(
            renderResult.getByTestId(`${testId}--previous-month-icon`),
          ).toHaveAttribute('aria-label', expect.stringMatching(/^Last month/));

          expect(
            renderResult.getByTestId(`${testId}--next-month-icon`),
          ).toHaveAttribute('aria-label', expect.stringMatching(/^Next month/));
        },
      );
    });
  });

  describe('Date', () => {
    describe('should be labelled by month/year header', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();
          const heading = renderResult.getByRole('heading');
          const headingId = heading.getAttribute('id');
          const calendarGrid = renderResult.getByRole('grid');
          expect(calendarGrid.getAttribute('aria-labelledby')).toBe(headingId);
        },
        () => {
          const { renderResult } = setup();
          const calendarGrid = renderResult.getByRole('grid');
          expect(calendarGrid).not.toHaveAttribute('aria-labelledby');
        },
      );
    });

    describe('should render default selected day', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();

          const selectedDayElement = getSelectedDayButton(renderResult);

          expect(selectedDayElement).toHaveAttribute('aria-pressed', 'true');
        },
        () => {
          const { renderResult } = setup();

          const selectedDayElement = getSelectedDayGridcell(renderResult);

          expect(selectedDayElement).toHaveAttribute('aria-selected', 'true');
        },
      );
    });

    describe('should render each day with a label containing the full date', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();

          const selectedDayElement = getSelectedDayButton(renderResult);

          expect(selectedDayElement).toHaveAttribute(
            'aria-label',
            '8, Sunday December 2019',
          );
        },
        () => {
          const { renderResult } = setup();

          const selectedDayElement = getSelectedDayGridcell(renderResult);

          expect(selectedDayElement).not.toHaveAttribute('aria-label');
        },
      );
    });

    describe('should have tabindex="-1" for all days but focused day, which will use tabIndex prop', () => {
      const tabIndexValues = [-1 as TabIndex, 0 as TabIndex];

      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          tabIndexValues.forEach((tabIndex) => {
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
        },
        () => {
          const { renderResult } = setup();

          const dayButtons = renderResult.getAllByRole(
            (content, element) => content === 'gridcell',
          );

          // Ensure the selector is getting the days
          expect(dayButtons.length).toBeGreaterThan(28);

          dayButtons.forEach((dayButton) => {
            // This is how it was before the fix, so leaving it.
            if (dayButton.getAttribute('aria-selected') === 'true') {
              expect(dayButton).toHaveAttribute('tabindex', '0');
            } else {
              expect(dayButton).toHaveAttribute('tabindex', '-1');
            }
          });
        },
      );
    });

    describe('should handle day selection behavior', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const dayAfterSelectedDay = defaultSelectedDay + 1;
          const { renderResult, props } = setup();

          const selectedDay = getSelectedDayButton(renderResult);

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
        },
        () => {
          const { renderResult, props } = setup();

          const selectedDayElement = getDayElementGridcell(
            renderResult,
            String(defaultSelectedDay),
          );

          expect(selectedDayElement).toHaveAttribute('aria-selected', 'true');

          const nextUnselectedDayElement =
            selectedDayElement.nextSibling as HTMLButtonElement;

          expect(nextUnselectedDayElement).toHaveAttribute(
            'aria-selected',
            'false',
          );

          fireEvent.click(nextUnselectedDayElement);

          expect(nextUnselectedDayElement).toHaveAttribute(
            'aria-selected',
            'true',
          );
          expect(props.onSelect).toHaveBeenCalledWith(
            {
              day: 9,
              iso: '2019-12-09',
              month: 12,
              year: 2019,
            },
            expect.anything(),
          );
        },
      );
    });

    describe('should be correctly disabled via disabled array props', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
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
        },
        () => {
          const { renderResult } = setup();

          const disabledDayElement = getDayElementGridcell(
            renderResult,
            String(defaultDisabledDay),
          );
          const notDisabledDayElement = getDayElementGridcell(
            renderResult,
            String(defaultDisabledDay + 1),
          );
          expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
          expect(notDisabledDayElement).not.toHaveAttribute(
            'data-disabled',
            'true',
          );
        },
      );
    });

    describe('should be correctly disabled via minDate and maxDate props', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
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
            expect(disabledDayElement).not.toHaveAttribute(
              'data-disabled',
              'true',
            );
          });
        },
        () => {
          const { renderResult } = setup({
            minDate: '2019-12-03',
            maxDate: '2019-12-19',
          });

          const outOfRangeDates = ['2', '20'];
          outOfRangeDates.forEach((date) => {
            const disabledDayElement = getDayElementGridcell(
              renderResult,
              date,
            );
            expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
          });

          const inRangeDates = ['3', '19'];
          inRangeDates.forEach((date) => {
            const disabledDayElement = getDayElementGridcell(
              renderResult,
              date,
            );
            expect(disabledDayElement).not.toHaveAttribute(
              'data-disabled',
              'true',
            );
          });
        },
      );
    });

    describe('should be correctly disabled via disabledDateFilter props', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup({
            disabledDateFilter: weekendFilter,
          });

          const disabledDayElement = getDayElementButton(renderResult, '14');
          expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
        },
        () => {
          const { renderResult } = setup({
            disabledDateFilter: weekendFilter,
          });

          const disabledDayElement = getDayElementGridcell(renderResult, '14');
          expect(disabledDayElement).toHaveAttribute('data-disabled', 'true');
        },
      );
    });

    describe('should not select day if disabled', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult, props } = setup();
          const disabledDayElement = getDayElementButton(
            renderResult,
            String(defaultDisabledDay),
          );
          fireEvent.click(disabledDayElement);
          expect(props.onSelect).not.toHaveBeenCalled();
        },
        () => {
          const { renderResult, props } = setup();
          const disabledDayElement = getDayElementGridcell(
            renderResult,
            String(defaultDisabledDay),
          );
          fireEvent.click(disabledDayElement);
          expect(props.onSelect).not.toHaveBeenCalled();
        },
      );
    });
  });

  describe('Date cell cursor', () => {
    describe('show cursor pointer', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();
          const cell = getDayElementButton(renderResult, '15');
          expect(cell).toHaveStyle('cursor: pointer');
        },
        () => {
          const { renderResult } = setup();
          const cell = getDayElementGridcell(renderResult, '15');
          expect(cell).toHaveStyle('cursor: pointer');
        },
      );
    });

    describe('cursor not-allowed when disabled', () => {
      ffTest(
        'platform.design-system-team.calendar-keyboard-accessibility_967h1',
        () => {
          const { renderResult } = setup();
          const disabledCell = getDayElementButton(renderResult, '4');
          expect(disabledCell).toHaveStyle('cursor: not-allowed');
        },
        () => {
          const { renderResult } = setup();
          const disabledCell = getDayElementGridcell(renderResult, '4');
          expect(disabledCell).toHaveStyle('cursor: not-allowed');
        },
      );
    });
  });

  describe('should propagate tabindex to all interactive elements', () => {
    const tabIndexValues = [-1 as TabIndex, 0 as TabIndex];
    ffTest(
      'platform.design-system-team.calendar-keyboard-accessibility_967h1',
      () => {
        tabIndexValues.forEach((tabIndexValue) => {
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
      },
      () => {
        tabIndexValues.forEach((tabIndexValue) => {
          const {
            renderResult: { getByTestId, unmount },
          } = setup({ tabIndex: tabIndexValue });

          const calendarElement = getByTestId(`${testId}--calendar`);

          expect(calendarElement).toHaveAttribute(
            'tabindex',
            String(tabIndexValue),
          );

          unmount();
        });
      },
    );
  });

  describe('should set appropriate attributes on focus', () => {
    ffTest(
      'platform.design-system-team.calendar-keyboard-accessibility_967h1',
      () => {
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
      },
      () => {
        const { renderResult } = setup();

        const focusedDayElement = getDayElementGridcell(
          renderResult,
          String(defaultDay),
        );
        const unfocusedDayElement = getDayElementGridcell(
          renderResult,
          String(defaultDay + 1),
        );

        expect(focusedDayElement).toHaveAttribute('data-focused', 'true');
        expect(unfocusedDayElement).not.toHaveAttribute('data-focused');
      },
    );
  });

  describe('should set appropriate attributes when current day', () => {
    ffTest(
      'platform.design-system-team.calendar-keyboard-accessibility_967h1',
      () => {
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
      },
      () => {
        const today = new Date();

        const { renderResult } = setup({
          day: today.getDate(),
          month: today.getMonth() + 1,
          year: today.getFullYear(),
        });

        const todayElement = getDayElementGridcell(
          renderResult,
          String(today.getDate()),
        );
        const notTodayElement = getDayElementGridcell(
          renderResult,
          String(today.getDate() + 1),
        );

        expect(todayElement).toHaveAttribute('data-today', 'true');
        expect(notTodayElement).not.toHaveAttribute('data-today');
      },
    );
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

      // Using Gridcell method here because it covers both cases and then I
      // don't have to break out a `cases` call for feature flags. When feature
      // flag is removed, this should be changed to use the Button method
      // instead.
      const currentSelectedDayGridcell = getSelectedDayGridcell(renderResult);

      expect(currentSelectedDayGridcell).toHaveTextContent(
        String(defaultSelectedDay),
      );

      const calendarGrid = renderResult.getByTestId(testIdMonth);
      const isPrevented = fireEvent.keyDown(calendarGrid as HTMLDivElement, {
        key,
        code,
      });

      const newSelectedDayGridcell = getSelectedDayGridcell(renderResult);

      expect(newSelectedDayGridcell).toHaveTextContent(String(focusedDay));

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

  describe('should rerender calendar with new date when passed from outside', () => {
    ffTest(
      'platform.design-system-team.calendar-keyboard-accessibility_967h1',
      () => {
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
        const monthYear = renderResult.getByTestId(
          `${testId}--current-month-year`,
        );

        expect(monthYear).toHaveTextContent(
          `${defaultMonthName} ${defaultYear}`,
        );
        expect(getSelectedDayButton(renderResult)).toHaveTextContent(
          String(defaultDay),
        );

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

        expect(monthYear).toHaveTextContent(
          `${defaultMonthName} ${defaultYear}`,
        );
        expect(getSelectedDayButton(renderResult)).toHaveTextContent(
          String(newDay),
        );
      },
      () => {
        const { renderResult } = setup({
          day: 10,
          month: 5,
          year: 2019,
        });

        expect(
          getAnnouncerElementTextContent(renderResult.container),
        ).toContain('Fri May 10 2019');

        renderResult.rerender(<Calendar day={15} month={5} year={2019} />);

        expect(
          getAnnouncerElementTextContent(renderResult.container),
        ).toContain('Wed May 15 2019');
      },
    );
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
