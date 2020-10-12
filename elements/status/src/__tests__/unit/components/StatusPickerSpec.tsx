import {
  shallowWithIntl,
  mountWithIntl,
} from '@atlaskit/editor-test-helpers/enzyme';
import TextField from '@atlaskit/textfield';
import React from 'react';
import { StatusPicker } from '../../..';
import ColorPalette from '../../../components/internal/color-palette';

describe('StatusPicker', () => {
  it('should render color palette', () => {
    const onColorClick = jest.fn();
    const onColorHover = jest.fn();

    const component = shallowWithIntl(
      <StatusPicker
        selectedColor="red"
        text=""
        onColorClick={onColorClick}
        onColorHover={onColorHover}
        onTextChanged={() => {}}
        onEnter={() => {}}
      />,
    );
    const colorPalette = component.find(ColorPalette);
    expect(colorPalette.length).toBe(1);
    expect(colorPalette.prop('selectedColor')).toBe('red');
    expect(colorPalette.prop('onClick')).toBe(onColorClick);
    expect(colorPalette.prop('onHover')).toBe(onColorHover);
  });

  it('should render field text', () => {
    const component = shallowWithIntl(
      <StatusPicker
        selectedColor="red"
        text="In progress"
        onColorClick={() => {}}
        onTextChanged={() => {}}
        onEnter={() => {}}
      />,
    );

    expect(component.find(TextField).length).toBe(1);
    expect(component.find(TextField).prop('value')).toBe('In progress');
    expect(component.find(TextField).prop('autoComplete')).toBe('off');
    expect(component.find(TextField).prop('spellCheck')).toBe(false);
  });

  describe('autofocus', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should defer autofocus', function () {
      const component = mountWithIntl(
        <StatusPicker
          selectedColor="red"
          text="In progress"
          onColorClick={() => {}}
          onTextChanged={() => {}}
          onEnter={() => {}}
          autoFocus={true}
        />,
      );

      const input = component.find('input').getDOMNode() as HTMLElement;
      const spyFocus = jest.spyOn(input, 'focus');

      jest.runAllTimers();
      expect(spyFocus).toHaveBeenCalled();
    });
  });

  it('should pass onColorClick handler prop to color palette', () => {
    const onColorClick = () => {};
    const component = shallowWithIntl(
      <StatusPicker
        selectedColor="red"
        text=""
        onColorClick={onColorClick}
        onTextChanged={() => {}}
        onEnter={() => {}}
      />,
    );

    expect(component.find(ColorPalette).prop('onClick')).toBe(onColorClick);
  });

  it('should call onTextChanged on text field change', () => {
    const onTextChanged = jest.fn();
    const component = shallowWithIntl(
      <StatusPicker
        selectedColor="red"
        text=""
        onColorClick={() => {}}
        onTextChanged={onTextChanged}
        onEnter={() => {}}
      />,
    );

    component.find(TextField).simulate('change', { target: { value: 'Done' } });
    expect(onTextChanged).toHaveBeenCalledWith('Done');
  });

  it('should call onEnter on enter in text field', () => {
    const onEnter = jest.fn();
    const component = shallowWithIntl(
      <StatusPicker
        selectedColor="red"
        text=""
        onColorClick={() => {}}
        onTextChanged={() => {}}
        onEnter={onEnter}
      />,
    );

    component.find(TextField).simulate('keypress', { key: 'Enter' });
    expect(onEnter).toHaveBeenCalled();
  });
});
