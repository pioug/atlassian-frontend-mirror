import React from 'react';
import Form from '@atlaskit/form';
import userEvent from '@testing-library/user-event';
// eslint-disable-next-line
import { shallow, ReactWrapper } from 'enzyme';
import { mountWithIntl } from '../../../../__tests__/__helpers/enzyme';
// eslint-disable-next-line import/no-extraneous-dependencies -- Removed import for fixing circular dependencies
import { renderWithIntl } from '@atlaskit/editor-test-helpers/rtl';
import { FieldComponent } from '../../FormContent';
import ColorPickerField, {
  extendedColorPalette,
  EXPANDED_COLOR_PICKER_COLUMNS,
} from '../../Fields/ColorPicker';
import { ColorPickerButton } from '@atlaskit/editor-common/ui-menu';
import type { FieldComponentProps } from '../../types';
import ReactEditorViewContext from '../../../../create-editor/ReactEditorViewContext';

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
    const editorRef = {
      current: document.createElement('div'),
    };
    const wrapper = mountWithIntl(
      <ReactEditorViewContext.Provider value={{ editorRef }}>
        <Form onSubmit={formSubmit}>{formCallback}</Form>
      </ReactEditorViewContext.Provider>,
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
    expect(colorPickerButton.props().currentColor).toEqual(
      'var(--ds-background-accent-blue-subtle, #7AB2FF)',
    );
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

  it('should render expanded chart colors', async () => {
    const props: FieldComponentProps = {
      field: {
        label: 'color picker',
        name: 'color-picker',
        type: 'color',
        defaultValue: '#7AB2FFFF',
      },
      parameters: {},
      extensionManifest: {} as any,
      onFieldChange: () => {},
      featureFlags: {},
    };
    const editorRef = {
      current: document.createElement('div'),
    };
    const { queryAllByRole, getByRole } = renderWithIntl(
      <ReactEditorViewContext.Provider
        value={{
          editorRef,
        }}
      >
        <FieldComponent {...props} />
      </ReactEditorViewContext.Provider>,
    );
    await userEvent.click(getByRole('button'));
    expect(queryAllByRole('radio')).toHaveLength(extendedColorPalette.length);
    expect(queryAllByRole('radiogroup')).toHaveLength(
      extendedColorPalette.length / EXPANDED_COLOR_PICKER_COLUMNS,
    );
  });
});
