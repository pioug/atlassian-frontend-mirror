import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';

import { Field } from '@atlaskit/form';
import Select, { OptionsType } from '@atlaskit/select';

import {
  datePickerDefaultAriaLabel,
  DateTimePickerWithoutAnalytics as DateTimePicker,
  timePickerDefaultAriaLabel,
} from '../../date-time-picker';

jest.mock('@atlaskit/select', () => {
  const actual = jest.requireActual('@atlaskit/select');

  return {
    __esModule: true,
    ...actual,
    default: jest.fn(),
  };
});

describe('DateTimePicker', () => {
  const firePickerEvent = {
    changeDate(testId: string, value: string) {
      const input = screen.getByTestId(`${testId}--datepicker--input`);
      fireEvent.input(input, {
        target: {
          value,
        },
      });
      fireEvent.keyDown(input, {
        key: 'Enter',
      });
    },
    focusDate(testId: string) {
      const select = screen.getByTestId(`${testId}--datepicker`);
      fireEvent.focus(select);
    },
    blurDate(testId: string) {
      const select = screen.getByTestId(`${testId}--datepicker`);
      fireEvent.blur(select);
    },
    changeTime(testId: string, value: string) {
      const select = screen.getByTestId(`${testId}--timepicker`);
      fireEvent.change(select, {
        target: {
          value,
        },
      });
    },
    focusTime(testId: string) {
      const select = screen.getByTestId(`${testId}--timepicker`);
      fireEvent.focus(select);
    },
    blurTime(testId: string) {
      const select = screen.getByTestId(`${testId}--timepicker`);
      fireEvent.blur(select);
    },
  };

  beforeEach(() => {
    (Select as unknown as jest.Mock).mockImplementation((props) => {
      const options: OptionsType = props.options || [];

      return (
        <select
          {...props}
          onChange={(event) =>
            props.onChange(event.target.value, 'select-option')
          }
          data-testid={props.testId}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should use custom parseValue when accessing state', () => {
    const testId = 'test';
    const onChange = jest.fn();
    const dateValue = new Date('05/02/2018').toISOString();
    const customParseValue = jest.fn().mockImplementation(() => ({
      dateValue,
      timeValue: '08:30',
      zoneValue: '+0800',
    }));

    render(
      <DateTimePicker
        defaultValue="2018-05-02"
        parseValue={customParseValue}
        onChange={onChange}
        testId={testId}
      />,
    );

    expect(customParseValue).toHaveBeenCalledWith('2018-05-02', '', '', '');

    firePickerEvent.changeDate(testId, '06/08/2018');

    expect(customParseValue).toHaveBeenCalledWith(
      '2018-06-08T08:30+0800',
      '2018-06-08',
      '08:30',
      '+0800',
    );

    expect(onChange).toHaveBeenCalledWith('2018-06-08T08:30+0800');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not parse the date time value into the specified timezone', () => {
    const testId = 'test';
    const onChange = jest.fn();
    render(
      <DateTimePicker
        value="2018-05-02T08:00:00.000+0800"
        onChange={onChange}
        testId={testId}
      />,
    );

    firePickerEvent.changeDate(testId, '02/05/2018');

    expect(onChange).toHaveBeenCalledWith('2018-02-05T00:00+0000');
  });

  it('should only be fired onChange when a valid date is supplied', () => {
    const testId = 'test';
    const onChange = jest.fn();
    render(<DateTimePicker onChange={onChange} testId={testId} />);

    firePickerEvent.changeDate(testId, '2018/05/02');
    expect(onChange).not.toHaveBeenCalled();

    firePickerEvent.changeTime(testId, '10:30');
    // iso will use current date (build/configs/jest-config/setup/setup-dates.js)
    // because we triggered date change in incorrect format.
    expect(onChange).toHaveBeenCalledWith('2017-08-16T10:30+0000');

    onChange.mockClear();
    firePickerEvent.changeDate(testId, '02/05/2018');
    // iso will use updated date because we triggered date change in correct format.
    expect(onChange).toHaveBeenCalledWith('2018-02-05T10:30+0000');
  });

  it('should call onChange with the date, time and zone offset in the correct format', () => {
    const testId = 'test';
    const zoneValue = '+0800';
    const customParseValue = jest
      .fn()
      .mockImplementation((_value, date, time, _zone) => {
        return {
          dateValue: date,
          timeValue: time,
          zoneValue: date && time ? zoneValue : '',
        };
      });
    const onChange = jest.fn();

    render(
      <DateTimePicker
        onChange={onChange}
        parseValue={customParseValue}
        testId={testId}
      />,
    );

    firePickerEvent.changeDate(testId, '05/02/2018');
    firePickerEvent.changeTime(testId, '10:30');

    expect(onChange).toHaveBeenCalledWith(`2018-05-02T10:30${zoneValue}`);
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('fires onChange with empty string when the time is cleared, and there is a datetime value', () => {
    const testId = 'test';
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    render(
      <DateTimePicker
        value={dateTimeValue}
        onChange={onChange}
        testId={testId}
      />,
    );

    firePickerEvent.changeTime(testId, '');

    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('fires onChange with empty string when the time is cleared, and there is a default datetime value', () => {
    const testId = 'test';
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    render(
      <DateTimePicker
        defaultValue={dateTimeValue}
        onChange={onChange}
        testId={testId}
      />,
    );

    firePickerEvent.changeTime(testId, '');

    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should not fire onChange when the date or time is cleared, but there is no datetime value', () => {
    const testId = 'test';
    const onChange = jest.fn();

    render(<DateTimePicker onChange={onChange} testId={testId} />);

    firePickerEvent.changeDate(testId, '');
    firePickerEvent.changeTime(testId, '');

    expect(onChange).not.toHaveBeenCalled();
  });

  it('should fire onFocus prop when datepicker is focused', () => {
    const testId = 'test';
    const onFocus = jest.fn();
    render(<DateTimePicker onFocus={onFocus} testId={testId} />);

    firePickerEvent.focusDate(testId);

    expect(onFocus).toHaveBeenCalled();
  });

  it('should fire onBlur prop when datepicker is blurred', () => {
    const testId = 'test';
    const onBlur = jest.fn();
    render(<DateTimePicker onBlur={onBlur} testId={testId} />);

    firePickerEvent.blurDate(testId);

    expect(onBlur).toHaveBeenCalled();
  });

  it('should fire onFocus prop when timepicker is focused', () => {
    const testId = 'test';
    const onFocus = jest.fn();
    render(<DateTimePicker onFocus={onFocus} testId={testId} />);

    firePickerEvent.focusTime(testId);

    expect(onFocus).toHaveBeenCalled();
  });

  it('should fire onBlur prop when timepicker is blurred', () => {
    const testId = 'test';
    const onBlur = jest.fn();
    render(<DateTimePicker onBlur={onBlur} testId={testId} />);

    firePickerEvent.blurTime(testId);

    expect(onBlur).toHaveBeenCalled();
  });

  it('should fire onClear event when cleared', () => {
    const onChange = jest.fn();
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    const { getByRole } = render(
      <DateTimePicker value={dateTimeValue} onChange={onChange} />,
    );

    const clearButton = getByRole('button');
    fireEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith('');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should have a clear button with a tabindex of -1', () => {
    const dateTimeValue = '2018-05-02T08:00:00.000+0800';

    const { getByRole } = render(<DateTimePicker value={dateTimeValue} />);

    const button = getByRole('button');

    expect(button).toHaveProperty('tagName', 'BUTTON');
    expect(button).toHaveAttribute('tabindex', '-1');
  });

  it('should never apply an ID to the hidden input', () => {
    const id = 'test';
    const testId = 'testId';
    const allImplementations = [
      <DateTimePicker testId={testId} />,
      <DateTimePicker testId={testId} id={id} />,
      <DateTimePicker
        testId={testId}
        datePickerSelectProps={{ inputId: id }}
        timePickerSelectProps={{ inputId: id }}
      />,
    ];

    allImplementations.forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const hiddenInput = getByTestId(`${testId}--input`);

      expect(hiddenInput).toHaveAttribute('type', 'hidden');
      expect(hiddenInput).not.toHaveAttribute('id');

      unmount();
    });
  });

  describe('Accessible names', () => {
    const label = 'Hibernation start date';
    const testId = 'test';
    const datePickerTestId = `${testId}--datepicker`;
    const timePickerTestId = `${testId}--timepicker`;

    it('should have a default aria-label on the internal DatePicker and TimePicker', () => {
      const { getByTestId } = render(<DateTimePicker testId={testId} />);

      const datePicker = getByTestId(datePickerTestId);
      const timePicker = getByTestId(timePickerTestId);

      expect(datePicker).toHaveAttribute(
        'aria-label',
        datePickerDefaultAriaLabel,
      );
      expect(timePicker).toHaveAttribute(
        'aria-label',
        timePickerDefaultAriaLabel,
      );
    });

    it('should not use the default aria-label on the internal pickers if `aria-label` prop is provided to internal select props', () => {
      const { getByTestId } = render(
        <DateTimePicker
          datePickerSelectProps={{ 'aria-label': label }}
          timePickerSelectProps={{ 'aria-label': label }}
          testId={testId}
        />,
      );

      const datePicker = getByTestId(datePickerTestId);
      const timePicker = getByTestId(timePickerTestId);

      expect(datePicker).toHaveAttribute('aria-label', label);
      expect(timePicker).toHaveAttribute('aria-label', label);
    });

    it("should set the datetime picker's container to be labelled by the Field if field is used", () => {
      const { getByRole, getByTestId } = render(
        <Field name={label} label={label} testId={'field'}>
          {({ fieldProps }) => (
            <DateTimePicker testId={testId} {...fieldProps} />
          )}
        </Field>,
      );

      const labelElement = getByTestId('field--label');
      const groupElement = getByRole('group');
      const datePicker = getByTestId(datePickerTestId);
      const timePicker = getByTestId(timePickerTestId);

      expect(groupElement).toHaveAttribute('aria-labelledby', labelElement.id);
      expect(datePicker).toHaveAttribute(
        'aria-label',
        datePickerDefaultAriaLabel,
      );
      expect(timePicker).toHaveAttribute(
        'aria-label',
        timePickerDefaultAriaLabel,
      );
    });
  });
});
