import React from 'react';
import { Field } from '@atlaskit/form';
import { ColorField } from '@atlaskit/editor-common/extensions';
import { PaletteColor } from '../../../ui/ColorPalette/Palettes';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';
import { OnFieldChange } from '../types';
import { isValidHex } from '../utils';
import styled from 'styled-components';
import { validate } from '../utils';
import { gridSize } from '@atlaskit/theme/constants';
import { RequiredIndicator } from './common/RequiredIndicator';
import { headingSizes } from '@atlaskit/theme/typography';
import FieldMessages from '../FieldMessages';
import ColorPickerButton from '../../ColorPickerButton';

/*
    NOTE: color used here are not yet in atlaskit code
    this is part of extended color pack from ADG, which is yet to be release
    at the time of writing this.

    Colour sequence source: https://product-fabric.atlassian.net/browse/ED-12650?focusedCommentId=204875
*/

const colorPalette: PaletteColor[] = [
  { label: 'Light Blue', value: '#7AB2FFFF' }, // 400
  { label: 'Light Green', value: '#6BE1B0FF' }, // 400
  { label: 'Light Yellow', value: '#FFDB57FF' }, // 400
  { label: 'Light Red', value: '#FF8F73FF' }, // 400
  { label: 'Light Purple', value: '#B5A7FBFF' }, // 400

  { label: 'Blue', value: '#247FFFFF' }, // 600
  { label: 'Green', value: '#23A971FF' }, // 600
  { label: 'Yellow', value: '#FFBE33FF' }, // 600
  { label: 'Red', value: '#FC552CFF' }, // 600
  { label: 'Purple', value: '#8B77EEFF' }, // 600

  { label: 'Dark Blue', value: '#0055CCFF' }, // 800
  { label: 'Dark Green', value: '#177D52FF' }, // 800
  { label: 'Dark Yellow', value: '#FF9D00FF' }, // 800
  { label: 'Dark Red', value: '#D32D03FF' }, // 800
  { label: 'Dark Purple', value: '#5A43D0FF' }, // 800

  { label: 'Darker Blue', value: '#003884FF' }, // 1000
  { label: 'Darker Green', value: '#055C3FFF' }, // 1000
  { label: 'Darker Yellow', value: '#946104FF' }, // 1000
  { label: 'Darker Red', value: '#A32000FF' }, // 1000
  { label: 'Darker Purple', value: '#44368BFF' }, // 1000
].map((color) => ({
  ...color,
  border: DEFAULT_BORDER_COLOR,
}));

const ColorPickerWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${4 * gridSize()}px;
  padding-right: ${gridSize()}px;
`;

const ColorPickerLabel = styled.label`
  font-size: ${headingSizes.h400.size}px;
  margin-top: 0;
`;

interface Props {
  name: string;
  title: string;
  currentColor: string;
  colorPalette: PaletteColor[];
  onChange: (color: string) => void;
  onFieldChange: OnFieldChange;
}

const ColorPicker = (props: Props) => {
  const {
    name,
    title,
    currentColor,
    colorPalette,
    onChange,
    onFieldChange,
  } = props;

  const onColorChange = (color: PaletteColor) => {
    const colorValue = color.value;
    if (!isValidHex(colorValue)) {
      throw new Error('invalid hex value');
    }

    onChange(colorValue);
    onFieldChange(name, currentColor !== colorValue);
  };

  return (
    <ColorPickerButton
      title={title}
      currentColor={currentColor}
      onChange={onColorChange}
      colorPalette={colorPalette}
      cols={5}
      alignX="right"
      placement="ConfigPanel"
      size={{ width: 3 * gridSize(), height: 3 * gridSize() }}
    />
  );
};

const ColorPickerField = ({
  name,
  field,
  onFieldChange,
}: {
  name: string;
  field: ColorField;
  onFieldChange: OnFieldChange;
}) => {
  const { label, defaultValue, isRequired } = field;

  return (
    <Field
      name={name}
      isRequired={isRequired}
      defaultValue={defaultValue}
      validate={(value?: string) => validate<string>(field, value || '')}
    >
      {({ fieldProps, error }) => (
        <>
          <ColorPickerWrapper>
            <ColorPickerLabel>
              {label}
              {isRequired && (
                <RequiredIndicator aria-hidden="true">*</RequiredIndicator>
              )}
            </ColorPickerLabel>
            <ColorPicker
              name={name}
              title={label}
              currentColor={fieldProps.value}
              colorPalette={colorPalette}
              onChange={fieldProps.onChange}
              onFieldChange={onFieldChange}
            />
          </ColorPickerWrapper>
          {error && <FieldMessages error={error} description="" />}
        </>
      )}
    </Field>
  );
};

export default ColorPickerField;
