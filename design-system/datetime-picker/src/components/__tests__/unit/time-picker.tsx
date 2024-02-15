import React from 'react';

import { fireEvent, render, screen } from '@testing-library/react';
import cases from 'jest-in-case';
import moment from 'moment';

import { CreatableSelect, OptionsType } from '@atlaskit/select';

import { TimePickerWithoutAnalytics as TimePicker } from '../../time-picker';

jest.mock('@atlaskit/select', () => {
  const actual = jest.requireActual('@atlaskit/select');

  return {
    __esModule: true,
    ...actual,
    CreatableSelect: jest.fn(),
  };
});

describe('TimePicker', () => {
  beforeEach(() => {
    (CreatableSelect as unknown as jest.Mock).mockImplementation((props) => {
      const options: OptionsType = props.options || [];

      return (
        <>
          <button
            type="button"
            // @ts-ignore hack to pass data from tests
            onClick={(event) => props.onCreateOption(event.target.value)}
          >
            Create Item
          </button>
          <select
            value={props.value}
            onChange={(event) => props.onChange(event.target, 'select-option')}
            onFocus={props.onFocus}
            onBlur={props.onBlur}
            data-testid={props.testId}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </>
      );
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('locale', () => {
    const time = new Date('2000-01-01T15:30:00.000');
    const hour = time.getHours();
    const minute = time.getMinutes();
    const timeValue = `${hour}:${minute}`;

    it('should apply `lang` attribute to inner input field', () => {
      const lang = 'en-GB';

      const { getByText } = render(
        <TimePicker locale={lang} value={timeValue} testId="test" />,
      );

      const value = getByText(timeValue);

      expect(value).toHaveAttribute('lang', expect.stringContaining(lang));
    });

    cases(
      'should format time using provided locale',
      ({ locale, result }: { locale: string; result: string }) => {
        render(<TimePicker locale={locale} value={timeValue} />);

        expect(screen.getByText(result)).toBeInTheDocument();
      },
      [
        { locale: 'en-GB', result: `${hour}:${minute}` },
        { locale: 'id', result: `${hour}.${minute}` },
      ],
    );
  });

  it('should render the time in a custom timeFormat', () => {
    render(<TimePicker value="12:00" timeFormat="HH--mm--SSS" testId="test" />);
    const container = screen.getByTestId('test--container');

    expect(container).toHaveTextContent('12--00--000');
  });

  it('should render a customized display label', () => {
    render(
      <TimePicker
        formatDisplayLabel={(time: string) =>
          time === '12:00' ? 'midday' : time
        }
        value="12:00"
      />,
    );
    const label = screen.queryByText('midday');
    expect(label).toBeInTheDocument();
  });

  it('should call custom parseInputValue - AM', () => {
    const onChangeSpy = jest.fn();
    render(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        parseInputValue={() => new Date('1970-01-02 01:15:00')}
      />,
    );

    const createButton = screen.getByRole('button', {
      name: 'Create Item',
    });
    fireEvent.click(createButton, {
      target: {
        value: 'asdf', // our custom parseInputValue ignores this
      },
    });

    expect(onChangeSpy).toBeCalledWith('01:15');
  });

  it('should call default parseInputValue', () => {
    const onChangeSpy = jest.fn();
    render(<TimePicker timeIsEditable onChange={onChangeSpy} />);

    const createButton = screen.getByRole('button', {
      name: 'Create Item',
    });
    fireEvent.click(createButton, {
      target: {
        value: '01:30',
      },
    });

    expect(onChangeSpy).toBeCalledWith('01:30');
  });

  it('should return AM time with default parseInputValue', () => {
    const onChangeSpy = jest.fn();
    render(<TimePicker timeIsEditable onChange={onChangeSpy} />);

    const createButton = screen.getByRole('button', {
      name: 'Create Item',
    });
    fireEvent.click(createButton, {
      target: {
        value: '01:44am',
      },
    });

    expect(onChangeSpy).toBeCalledWith('01:44');
  });

  it('should return PM time with default parseInputValue', () => {
    const onChangeSpy = jest.fn();
    render(<TimePicker timeIsEditable onChange={onChangeSpy} />);

    const createButton = screen.getByRole('button', {
      name: 'Create Item',
    });
    fireEvent.click(createButton, {
      target: {
        value: '3:32pm',
      },
    });

    expect(onChangeSpy).toBeCalledWith('15:32');
  });

  it('should correctly parseInputValue with default timeFormat', () => {
    const onChangeSpy = jest.fn();
    const onParseInputValueSpy = jest
      .fn()
      .mockReturnValue(moment('3:32pm', 'h:mma').toDate());
    render(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        parseInputValue={onParseInputValueSpy}
      />,
    );

    const createButton = screen.getByRole('button', {
      name: 'Create Item',
    });
    fireEvent.click(createButton, {
      target: {
        value: '3:32pm',
      },
    });

    expect(onParseInputValueSpy).toBeCalledWith('3:32pm', 'h:mma');
    expect(onChangeSpy).toBeCalledWith('15:32');
  });

  it('should return PM time with default parseInputValue and custom timeFormat', () => {
    const onChangeSpy = jest.fn();
    render(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        timeFormat="hh:mm:ss a"
      />,
    );

    const createButton = screen.getByRole('button', {
      name: 'Create Item',
    });

    fireEvent.click(createButton, {
      target: { value: '11:22:33 pm' },
    });

    expect(onChangeSpy).toBeCalledWith('23:22:33');
  });

  it('should correctly parseInputValue with custom timeFormat', () => {
    const onChangeSpy = jest.fn();
    const onParseInputValueSpy = jest
      .fn()
      .mockReturnValue(moment('3:32pm', 'h:mma').toDate());
    render(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        parseInputValue={onParseInputValueSpy}
        timeFormat="HH--mm:A"
      />,
    );

    const createButton = screen.getByRole('button', {
      name: 'Create Item',
    });
    fireEvent.click(createButton, {
      target: { value: '3:32pm' },
    });

    expect(onParseInputValueSpy).toBeCalledWith('3:32pm', 'HH--mm:A');
    expect(onChangeSpy).toBeCalledWith('15:32');
  });

  it('should clear the value if the backspace key is pressed', () => {
    const onChangeSpy = jest.fn();
    render(<TimePicker value="15:32" onChange={onChangeSpy} />);

    const selectInput = screen.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('should clear the value if the delete key is pressed', () => {
    const onChangeSpy = jest.fn();
    render(<TimePicker value="15:32" onChange={onChangeSpy} />);

    const selectInput = screen.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('should clear the value if the clear button is pressed and the menu should stay closed', () => {
    const onChangeSpy = jest.fn();
    render(<TimePicker value="15:32" onChange={onChangeSpy} testId="test" />);

    const clearButton = screen.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith('');
    expect(
      screen.queryByTestId(`test--popper--container`),
    ).not.toBeInTheDocument();
  });

  it('should clear the value and leave the menu open if the clear button is pressed while menu is open', () => {
    const onChangeSpy = jest.fn();
    const testId = 'test';

    render(
      <TimePicker
        value={'15:32'}
        onChange={onChangeSpy}
        testId="test"
        defaultIsOpen
        selectProps={{ testId: testId }}
      />,
    );

    const clearButton = screen.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith('');
    expect(screen.queryByTestId('test--popper--container')).toBeInTheDocument();
  });

  it('should never apply an ID to the hidden input', () => {
    const id = 'test';
    const testId = 'testId';
    const allImplementations = [
      <TimePicker testId={testId} />,
      <TimePicker testId={testId} id={id} />,
      <TimePicker testId={testId} selectProps={{ inputId: id }} />,
    ];

    allImplementations.forEach((jsx) => {
      const { getByTestId, unmount } = render(jsx);

      const hiddenInput = getByTestId(`${testId}--input`);

      expect(hiddenInput).toHaveAttribute('type', 'hidden');
      expect(hiddenInput).not.toHaveAttribute('id');

      unmount();
    });
  });
});
