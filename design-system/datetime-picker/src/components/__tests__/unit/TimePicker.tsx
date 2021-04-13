import React from 'react';

import { fireEvent, render } from '@testing-library/react';
import { mount } from 'enzyme';
import moment from 'moment';

import { TimePickerWithoutAnalytics as TimePicker } from '../../../components/TimePicker';

describe('TimePicker', () => {
  it('should render the time in a custom timeFormat', () => {
    const { getByTestId } = render(
      <TimePicker value="12:00" timeFormat="HH--mm--SSS" testId="test" />,
    );
    const container = getByTestId('test--container');

    expect(container.innerText).toEqual('12--00--000');
  });

  it('should render a customized display label', () => {
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker
        formatDisplayLabel={(time: string) =>
          time === '12:00' ? 'midday' : time
        }
        value="12:00"
      />,
    );
    const label = timePickerWrapper.text();

    expect(label).toEqual('midday');
  });

  it('should call custom parseInputValue - AM', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        parseInputValue={() => new Date('1970-01-02 01:15:00')}
      />,
    );

    timePickerWrapper.instance().onCreateOption('asdf');

    expect(onChangeSpy).toBeCalledWith('01:15');
  });

  it('should call default parseInputValue', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker timeIsEditable onChange={onChangeSpy} />,
    );

    timePickerWrapper.instance().onCreateOption('01:30');

    expect(onChangeSpy).toBeCalledWith('01:30');
  });

  it('should return AM time with default parseInputValue', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker timeIsEditable onChange={onChangeSpy} />,
    );

    timePickerWrapper.instance().onCreateOption('1:44am');

    expect(onChangeSpy).toBeCalledWith('01:44');
  });

  it('should return PM time with default parseInputValue', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker timeIsEditable onChange={onChangeSpy} />,
    );

    timePickerWrapper.instance().onCreateOption('3:32pm');

    expect(onChangeSpy).toBeCalledWith('15:32');
  });

  it('should correctly parseInputValue with default timeFormat', () => {
    const onChangeSpy = jest.fn();
    const onParseInputValueSpy = jest
      .fn()
      .mockReturnValue(moment('3:32pm', 'h:mma').toDate());
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        parseInputValue={onParseInputValueSpy}
      />,
    );

    timePickerWrapper.instance().onCreateOption('3:32pm');

    expect(onParseInputValueSpy).toBeCalledWith('3:32pm', 'h:mma');
    expect(onChangeSpy).toBeCalledWith('15:32');
  });

  it('should correctly parseInputValue with custom timeFormat', () => {
    const onChangeSpy = jest.fn();
    const onParseInputValueSpy = jest
      .fn()
      .mockReturnValue(moment('3:32pm', 'h:mma').toDate());
    const timePickerWrapper = mount<TimePicker>(
      <TimePicker
        timeIsEditable
        onChange={onChangeSpy}
        parseInputValue={onParseInputValueSpy}
        timeFormat="HH--mm:A"
      />,
    );

    timePickerWrapper.instance().onCreateOption('3:32pm');

    expect(onParseInputValueSpy).toBeCalledWith('3:32pm', 'HH--mm:A');
    expect(onChangeSpy).toBeCalledWith('15:32');
  });

  it('should clear the value if the backspace key is pressed', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = render(
      <TimePicker value="15:32" onChange={onChangeSpy} />,
    );

    const selectInput = timePickerWrapper.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Backspace', keyCode: 8 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('should clear the value if the delete key is pressed', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = render(
      <TimePicker value="15:32" onChange={onChangeSpy} />,
    );

    const selectInput = timePickerWrapper.getByDisplayValue('');
    fireEvent.keyDown(selectInput, { key: 'Delete', keyCode: 46 });

    expect(onChangeSpy).toBeCalledWith('');
  });

  it('should clear the value if the clear button is pressed and the menu should stay closed', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = render(
      <TimePicker value="15:32" onChange={onChangeSpy} testId="test" />,
    );

    const clearButton = timePickerWrapper.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith('');
    expect(
      timePickerWrapper.queryByTestId(`test--popper--container`),
    ).toBeNull();
  });

  it('should clear the value and leave the menu open if the clear button is pressed while menu is open', () => {
    const onChangeSpy = jest.fn();
    const timePickerWrapper = render(
      <TimePicker
        value={'15:32'}
        onChange={onChangeSpy}
        testId="test"
        defaultIsOpen
      />,
    );

    const clearButton = timePickerWrapper.getByLabelText('clear').parentElement;
    if (!clearButton) {
      throw new Error('Expected button to be non-null');
    }

    fireEvent.mouseOver(clearButton);
    fireEvent.mouseMove(clearButton);
    fireEvent.mouseDown(clearButton);

    expect(onChangeSpy).toBeCalledWith('');
    expect(
      timePickerWrapper.queryByTestId('test--popper--container'),
    ).not.toBeNull();
  });
});
