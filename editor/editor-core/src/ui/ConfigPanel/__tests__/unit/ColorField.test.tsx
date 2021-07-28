import React from 'react';
import { shallow, ReactWrapper } from 'enzyme';
import { mountWithIntl } from '@atlaskit/editor-test-helpers/enzyme';
import { FieldComponent, FieldComponentProps } from '../../FormContent';
import ColorPickerField from '../../Fields/ColorPicker';
import ColorPickerButton from '../../../ColorPickerButton';

describe('ColorField', () => {
  it('should render a color field when given the props with type: "color"', () => {
    const props: FieldComponentProps = {
      field: { label: 'color picker', name: 'color-picker', type: 'color' },
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };
    const wrapper = shallow(<FieldComponent {...props} />);
    expect(wrapper.find(ColorPickerField).exists()).toBeTruthy();
  });

  it("should have default value of '' for currentColor if no value is passed in parameters", () => {
    const props: FieldComponentProps = {
      field: { label: 'color-picker', name: 'color-picker', type: 'color' },
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };
    const wrapper = mountWithIntl(<FieldComponent {...props} />);
    const colorButton = wrapper.find(ColorPickerButton);
    expect(colorButton.exists()).toBeTruthy();
    expect(colorButton.props().currentColor).toEqual('');
  });

  it('should set initial value to match the given value in parameters', () => {
    const props: FieldComponentProps = {
      field: { label: 'color-picker', name: 'color-picker', type: 'color' },
      parameters: { 'color-picker': '#2A0000' },
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };
    const wrapper = mountWithIntl(<FieldComponent {...props} />);
    const colorButton = wrapper.find(ColorPickerButton);
    expect(colorButton.exists()).toBeTruthy();
    expect(colorButton.props().currentColor).toEqual('#2A0000');
  });

  it('should change color to be selected color', () => {
    const mockOnBlur = jest.fn();
    const props: FieldComponentProps = {
      field: { label: 'color-picker', name: 'color-picker', type: 'color' },
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: mockOnBlur,
    };
    const wrapper = mountWithIntl(<FieldComponent {...props} />);

    //   click the ColorPickerButton
    wrapper.find('button').simulate('click');

    //   click the Light Blue color
    wrapper
      .find('Color')
      .findWhere(
        (node: ReactWrapper): boolean => node.prop('label') === 'Light Blue',
      )
      .find('button')
      .simulate('click');

    const colorButton = wrapper.find(ColorPickerButton);
    expect(colorButton.props().currentColor).toEqual('#7AB2FFFF');
    expect(mockOnBlur).toHaveBeenCalledWith('color-picker', true);
  });
});
