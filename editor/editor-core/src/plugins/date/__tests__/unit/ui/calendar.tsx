import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import Calendar from '@atlaskit/calendar';
import type { DateType } from '@atlaskit/editor-plugin-date';

describe('Calendar', () => {
  describe('weekStartDay', () => {
    const testId = 'test';

    it(`should show Monday first when weekStartDay is 1`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };
      const component = renderWithIntl(
        <Calendar
          onChange={() => {}}
          onSelect={() => {}}
          day={exampleDate.day}
          month={exampleDate.month}
          year={exampleDate.year}
          selected={['2020-02-20']}
          ref={() => {}}
          weekStartDay={1}
          testId={testId}
        />,
      );

      const result = component.getAllByTestId(`${testId}--column-headers`)?.[0];
      expect(result).toHaveTextContent('Mon');
    });

    it(`should show Friday first when weekStartDay is 5`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };
      const component = renderWithIntl(
        <Calendar
          onChange={() => {}}
          onSelect={() => {}}
          day={exampleDate.day}
          month={exampleDate.month}
          year={exampleDate.year}
          selected={['2020-02-20']}
          ref={() => {}}
          weekStartDay={5}
          testId={testId}
        />,
      );

      const result = component.getAllByTestId(`${testId}--column-headers`)?.[0];
      expect(result).toHaveTextContent('Fri');
    });

    it(`should show Sunday first when weekStartDay is not provided`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };
      const component = renderWithIntl(
        <Calendar
          onChange={() => {}}
          onSelect={() => {}}
          day={exampleDate.day}
          month={exampleDate.month}
          year={exampleDate.year}
          selected={['2020-02-20']}
          ref={() => {}}
          testId={testId}
        />,
      );

      const result = component.getAllByTestId(`${testId}--column-headers`)?.[0];
      expect(result).toHaveTextContent('Sun');
    });
  });
});
