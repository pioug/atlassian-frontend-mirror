import React from 'react';

import { fireEvent, render, within } from '@testing-library/react';
import cases from 'jest-in-case';

import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';

import Calendar from '../../index';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

describe('Calendar analytics', () => {
  const setup = (analyticsContext = {}) => {
    const onChange = jest.fn();
    const onSelect = jest.fn();
    const onAnalyticsEvent = jest.fn();
    const selectedDay = 15;

    const renderResult = render(
      <AnalyticsListener channel="atlaskit" onEvent={onAnalyticsEvent}>
        <Calendar
          testId="calendar"
          onChange={onChange}
          onSelect={onSelect}
          defaultDay={selectedDay}
          analyticsContext={analyticsContext}
        />
      </AnalyticsListener>,
    );

    const changeEventResult = {
      payload: {
        action: 'changed',
        actionSubject: 'calendar',
        attributes: {
          componentName: 'calendar',
          packageName,
          packageVersion,
        },
      },
    };

    const selectEventResult = {
      payload: {
        action: 'selected',
        actionSubject: 'calendar',
        attributes: {
          componentName: 'calendar',
          packageName,
          packageVersion,
        },
      },
    };

    return {
      renderResult,
      onChange,
      onSelect,
      onAnalyticsEvent,
      selectedDay,
      changeEventResult,
      selectEventResult,
    };
  };

  describe('send change event to atlaskit/analytics', () => {
    it('when switched to previous month', () => {
      const {
        renderResult,
        onChange,
        onAnalyticsEvent,
        changeEventResult,
      } = setup();

      const previousMonthButton = renderResult.getByTestId(
        'calendar--previous-month',
      );

      fireEvent.click(previousMonthButton);

      expect(onChange).toHaveBeenCalledTimes(1);

      // calendar and button analytics
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining(changeEventResult),
        'atlaskit',
      );
    });

    it('when switched to next month', () => {
      const {
        renderResult,
        onChange,
        onAnalyticsEvent,
        changeEventResult,
      } = setup();

      const nextMonthButton = renderResult.getByTestId('calendar--next-month');

      fireEvent.click(nextMonthButton);

      expect(onChange).toHaveBeenCalledTimes(1);

      // calendar and button analytics
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(2);

      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining(changeEventResult),
        'atlaskit',
      );
    });

    cases(
      'when navigated using following keys',
      ({ key, code }: { key: string; code: string }) => {
        const {
          renderResult,
          onChange,
          onAnalyticsEvent,
          changeEventResult,
        } = setup();

        fireEvent.keyDown(renderResult.container.firstChild as HTMLDivElement, {
          key,
          code,
        });

        expect(onChange).toHaveBeenCalledTimes(1);

        // calendar analytics
        expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);

        expect(onAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining(changeEventResult),
          'atlaskit',
        );
      },
      [
        {
          name: 'ArrowDown',
          key: 'ArrowDown',
          code: 'ArrowDown',
        },
        {
          name: 'ArrowLeft',
          key: 'ArrowLeft',
          code: 'ArrowLeft',
        },
        {
          name: 'ArrowRight',
          key: 'ArrowRight',
          code: 'ArrowRight',
        },
        {
          name: 'ArrowUp',
          key: 'ArrowUp',
          code: 'ArrowUp',
        },
      ],
    );
  });

  describe('send select event to atlaskit/analytics', () => {
    it('when day is clicked', () => {
      const {
        renderResult,
        onSelect,
        onAnalyticsEvent,
        selectEventResult,
        selectedDay,
      } = setup();

      const stringifiedSelectedDay = selectedDay.toString();

      const selectedDayElement = renderResult.getAllByRole(
        (content, element) =>
          content === 'gridcell' &&
          element.textContent === stringifiedSelectedDay,
      )[0];
      const selectedDayElementInnerElement = within(
        selectedDayElement,
      ).getByText(stringifiedSelectedDay);

      fireEvent.click(selectedDayElementInnerElement);

      expect(onSelect).toHaveBeenCalledTimes(1);

      // calendar analytics
      expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);

      expect(onAnalyticsEvent).toHaveBeenCalledWith(
        expect.objectContaining(selectEventResult),
        'atlaskit',
      );
    });

    cases(
      'when day is selected using following keys',
      ({ key, code }: { key: string; code: string }) => {
        const {
          renderResult,
          onSelect,
          onAnalyticsEvent,
          selectEventResult,
        } = setup();

        fireEvent.keyDown(renderResult.container.firstChild as HTMLDivElement, {
          key,
          code,
        });

        expect(onSelect).toHaveBeenCalledTimes(1);

        // calendar analytics
        expect(onAnalyticsEvent).toHaveBeenCalledTimes(1);

        expect(onAnalyticsEvent).toHaveBeenCalledWith(
          expect.objectContaining(selectEventResult),
          'atlaskit',
        );
      },
      [
        { name: 'Enter', key: 'Enter', code: 'Enter' },
        { name: 'Space', key: ' ', code: 'Space' },
      ],
    );
  });

  describe('context', () => {
    it('should not error if there is no analytics provider', () => {
      const error = jest.spyOn(console, 'error');

      render(<Calendar />);

      expect(error).not.toHaveBeenCalled();

      error.mockRestore();
    });

    it('should allow the addition of additional context', () => {
      const analyticsContext = { key: 'value' };
      const { renderResult, onChange, changeEventResult } = setup(
        analyticsContext,
      );

      const nextMonthButton = renderResult.getByTestId('calendar--next-month');

      fireEvent.click(nextMonthButton);

      const expected: UIAnalyticsEvent = new UIAnalyticsEvent({
        ...changeEventResult,
        context: [
          {
            componentName: 'calendar',
            packageName,
            packageVersion,
            ...analyticsContext,
          },
        ],
      });

      expect(onChange).toHaveBeenCalledTimes(1);
      expect(onChange.mock.calls[0][1].payload).toEqual(expected.payload);
      expect(onChange.mock.calls[0][1].context).toEqual(expected.context);
    });
  });
});
