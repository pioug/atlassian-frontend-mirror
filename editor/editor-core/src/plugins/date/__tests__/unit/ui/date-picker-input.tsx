import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import DatePickerInput from '../../../ui/DatePicker/date-picker-input';
import React from 'react';
import { DateType } from '../../../types';

describe('DatePickerInput', () => {
  describe('autofocus', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it(`should not autofocus by default`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };
      const component = renderWithIntl(
        <DatePickerInput
          date={exampleDate}
          onNewDate={() => {}}
          onSubmitDate={() => {}}
          onEmptySubmit={() => {}}
          locale={'en-AU'}
        />,
      );

      const input = component.getByRole('textbox') as HTMLInputElement;
      const spyFocus = jest.spyOn(input, 'focus');

      jest.runAllTimers();
      expect(spyFocus).toHaveBeenCalledTimes(0);
    });

    it(`should autofocus when told to`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };
      const component = renderWithIntl(
        <DatePickerInput
          date={exampleDate}
          onNewDate={() => {}}
          onSubmitDate={() => {}}
          onEmptySubmit={() => {}}
          locale={'en-AU'}
          autoFocus={true}
        />,
      );

      const input = component.getByRole('textbox') as HTMLInputElement;
      const spyFocus = jest.spyOn(input, 'focus');

      jest.runAllTimers();
      expect(spyFocus).toHaveBeenCalledTimes(1);
    });

    it(`shouldn't autofocus when told to`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };
      const component = renderWithIntl(
        <DatePickerInput
          date={exampleDate}
          onNewDate={() => {}}
          onSubmitDate={() => {}}
          onEmptySubmit={() => {}}
          locale={'en-AU'}
          autoFocus={false}
        />,
      );

      const input = component.getByRole('textbox') as HTMLInputElement;
      const spyFocus = jest.spyOn(input, 'focus');

      jest.runAllTimers();
      expect(spyFocus).toHaveBeenCalledTimes(0);
    });

    it(`should autofocus on prop change`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };

      const component = renderWithIntl(
        <DatePickerInput
          date={exampleDate}
          onNewDate={() => {}}
          onSubmitDate={() => {}}
          onEmptySubmit={() => {}}
          locale={'en-AU'}
          autoFocus={false}
        />,
      );

      const input = component.getByRole('textbox') as HTMLInputElement;
      const spyFocus = jest.spyOn(input, 'focus');

      jest.runAllTimers();
      expect(spyFocus).toHaveBeenCalledTimes(0);

      component.rerender(
        <DatePickerInput
          date={exampleDate}
          onNewDate={() => {}}
          onSubmitDate={() => {}}
          onEmptySubmit={() => {}}
          locale={'en-AU'}
          autoFocus={true}
        />,
      );
      jest.runAllTimers();
      expect(spyFocus).toHaveBeenCalledTimes(1);
    });

    it(`should select all input text when told to`, function () {
      const exampleDate: DateType = {
        year: 2020,
        month: 2,
        day: 20,
      };
      const component = renderWithIntl(
        <DatePickerInput
          date={exampleDate}
          onNewDate={() => {}}
          onSubmitDate={() => {}}
          onEmptySubmit={() => {}}
          locale={'en-AU'}
          autoSelectAll={true}
          autoFocus={true}
        />,
      );

      const input = component.getByRole('textbox') as HTMLInputElement;
      const spySelect = jest.spyOn(input, 'select');
      const spyFocus = jest.spyOn(input, 'focus');

      jest.runAllTimers();
      expect(spySelect).toHaveBeenCalledTimes(1);
      expect(spyFocus).toHaveBeenCalledTimes(1);
    });
  });
});
