import React from 'react';
import Form from '@atlaskit/form';
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

  it('should have undefined for defaultValue and currentColor if no value is passed in parameters', () => {
    const props: FieldComponentProps = {
      field: { label: 'color-picker', name: 'color-picker', type: 'color' },
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };
    const wrapper = mountWithIntl(<FieldComponent {...props} />);
    const field = wrapper.find('Field');
    const colorPickerButton = wrapper.find(ColorPickerButton);
    expect(field.props().defaultValue).toBeUndefined();
    expect(colorPickerButton.props().currentColor).toBeUndefined();
  });

  it('should set initial value to match the given value in parameters', () => {
    const props: FieldComponentProps = {
      field: { label: 'color-picker', name: 'color-picker', type: 'color' },
      parameters: { 'color-picker': '#2A0000' },
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };
    const wrapper = mountWithIntl(<FieldComponent {...props} />);
    const colorPickerButton = wrapper.find(ColorPickerButton);
    expect(colorPickerButton.exists()).toBeTruthy();
    expect(colorPickerButton.props().currentColor).toEqual('#2A0000');
  });

  it('should change color to be selected color', () => {
    const mockOnBlur = jest.fn();
    const props: FieldComponentProps = {
      field: { label: 'color-picker', name: 'color-picker', type: 'color' },
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: mockOnBlur,
    };

    const formSubmit = () => {};
    const formCallback = () => {
      return <FieldComponent {...props} />;
    };
    const wrapper = mountWithIntl(
      <Form onSubmit={formSubmit}>{formCallback}</Form>,
    );

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

    const colorPickerButton = wrapper.find(ColorPickerButton);
    expect(colorPickerButton.props().currentColor).toEqual('#7AB2FFFF');
    expect(mockOnBlur).toHaveBeenCalledWith('color-picker', true);
  });

  it('should update defaultValue and currentColor when parameters change', () => {
    const props: FieldComponentProps = {
      field: { label: 'color-picker', name: 'color-picker', type: 'color' },
      parameters: { 'color-picker': '#2A0000' },
      extensionManifest: {} as any,
      onFieldChange: () => {},
    };

    let localSetFieldValue: (name: string, value: any) => void;
    const wrapper = mountWithIntl(
      <Form onSubmit={() => {}}>
        {({ setFieldValue }) => {
          localSetFieldValue = setFieldValue;
          return <FieldComponent {...props} />;
        }}
      </Form>,
    );

    let colorPickerButton = wrapper.find('ColorPickerButton');
    expect(colorPickerButton.exists()).toBeTruthy();
    expect(colorPickerButton.prop('currentColor')).toEqual('#2A0000');

    const newColor = '#f9wafa';
    localSetFieldValue!('color-picker', newColor);
    wrapper.update();

    colorPickerButton = wrapper.find('ColorPickerButton');
    expect(colorPickerButton.prop('currentColor')).toEqual(newColor);
  });
});
