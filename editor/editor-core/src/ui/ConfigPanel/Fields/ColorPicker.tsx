/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import type { ColorField } from '@atlaskit/editor-common/extensions';
import type { FeatureFlags } from '@atlaskit/editor-common/types';
import type { PaletteColor } from '@atlaskit/editor-common/ui-color';
import { DEFAULT_BORDER_COLOR } from '@atlaskit/editor-common/ui-color';
import type { OnFieldChange } from '../types';
import { validate } from '../utils';
import { token } from '@atlaskit/tokens';
import { requiredIndicator } from './common/RequiredIndicator';
import { headingSizes } from '@atlaskit/theme/typography';
import FieldMessages from '../FieldMessages';
import { ColorPickerButton } from '@atlaskit/editor-common/ui-menu';
import { chartsColorPaletteTooltipMessages } from '@atlaskit/editor-common/ui-color';
/*
    NOTE: color used here are not yet in atlaskit code
    this is part of extended color pack from ADG, which is yet to be release
    at the time of writing this.

    Colour sequence source: https://product-fabric.atlassian.net/browse/ED-12650?focusedCommentId=204875
*/

export const colorPalette: PaletteColor[] = [
  {
    label: 'Light Blue',
    value: token('color.background.accent.blue.subtle', '#7AB2FF'),
  }, // 400
  {
    label: 'Light Green',
    value: token('color.background.accent.green.subtle', '#6BE1B0'),
  }, // 400
  {
    label: 'Light Yellow',
    value: token('color.background.accent.yellow.subtle', '#FFDB57'),
  }, // 400
  {
    label: 'Light Red',
    value: token('color.background.accent.red.subtle', '#FF8F73'),
  }, // 400
  {
    label: 'Light Purple',
    value: token('color.background.accent.purple.subtle', '#B5A7FB'),
  }, // 400

  { label: 'Blue', value: token('color.chart.blue.bold', '#247FFF') }, // 600
  { label: 'Green', value: token('color.chart.green.bold', '#23A971') }, // 600
  { label: 'Yellow', value: token('color.chart.yellow.bold', '#FFBE33') }, // 600
  { label: 'Red', value: token('color.chart.red.bold', '#FC552C') }, // 600
  { label: 'Purple', value: token('color.chart.purple.bold', '#8B77EE') }, // 600

  { label: 'Dark Blue', value: token('color.chart.blue.bolder', '#0055CC') }, // 800
  { label: 'Dark Green', value: token('color.chart.green.bolder', '#177D52') }, // 800
  {
    label: 'Dark Yellow',
    value: token('color.chart.yellow.bolder', '#FF9D00'),
  }, // 800
  { label: 'Dark Red', value: token('color.chart.red.bolder', '#D32D03') }, // 800
  {
    label: 'Dark Purple',
    value: token('color.chart.purple.bolder', '#5A43D0'),
  }, // 800

  { label: 'Darker Blue', value: token('color.chart.blue.boldest', '#003884') }, // 1000
  {
    label: 'Darker Green',
    value: token('color.chart.green.boldest', '#055C3F'),
  }, // 1000
  {
    label: 'Darker Yellow',
    value: token('color.chart.yellow.boldest', '#946104'),
  }, // 1000
  { label: 'Darker Red', value: token('color.chart.red.boldest', '#A32000') }, // 1000
  {
    label: 'Darker Purple',
    value: token('color.chart.purple.boldest', '#44368B'),
  }, // 1000
].map((color) => ({
  ...color,
  border: DEFAULT_BORDER_COLOR,
}));

/**
 * Extended chart colors.
 * Decided here https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3477245015/Tokenising+table+charts+color
 */
export const extendedColorPalette: PaletteColor[] = [
  { label: 'Darker Blue', value: token('color.chart.blue.boldest', '#003884') }, // 1000
  { label: 'Darker Teal', value: token('color.chart.teal.boldest', '#206B74') }, // 1000
  {
    label: 'Darker Green',
    value: token('color.chart.green.boldest', '#055C3F'),
  }, // 1000
  {
    label: 'Darker Yellow',
    value: token('color.chart.yellow.boldest', '#946104'),
  }, // 1000
  {
    label: 'Darker Orange',
    value: token('color.chart.orange.boldest', '#974F0C'),
  }, // 1000
  { label: 'Darker Red', value: token('color.chart.red.boldest', '#A32000') }, // 1000
  {
    label: 'Darker Magenta',
    value: token('color.chart.magenta.boldest', '#943D73'),
  }, // 1000
  {
    label: 'Darker Purple',
    value: token('color.chart.purple.boldest', '#44368B'),
  }, // 1000
  { label: 'Darker Gray', value: token('color.chart.gray.boldest', '#44546F') }, // 1000

  { label: 'Dark Blue', value: token('color.chart.blue.bolder', '#0055CC') }, // 800
  { label: 'Dark Teal', value: token('color.chart.teal.bolder', '#1D7F8C') }, // 800
  { label: 'Dark Green', value: token('color.chart.green.bolder', '#177D52') }, // 800
  {
    label: 'Dark Yellow',
    value: token('color.chart.yellow.bolder', '#FF9D00'),
  }, // 800
  {
    label: 'Dark Orange',
    value: token('color.chart.orange.bolder', '#B65C02'),
  }, // 800
  { label: 'Dark Red', value: token('color.chart.red.bolder', '#D32D03') }, // 800
  {
    label: 'Dark Magenta',
    value: token('color.chart.magenta.bolder', '#CD519D'),
  }, // 800
  {
    label: 'Dark Purple',
    value: token('color.chart.purple.bolder', '#5A43D0'),
  }, // 800
  { label: 'Dark Gray', value: token('color.chart.gray.bolder', '#758195') }, // 800

  { label: 'Blue', value: token('color.chart.blue.bold', '#247FFF') }, // 600
  { label: 'Teal', value: token('color.chart.teal.bold', '#1D9AAA') }, // 600
  { label: 'Green', value: token('color.chart.green.bold', '#23A971') }, // 600
  { label: 'Yellow', value: token('color.chart.yellow.bold', '#FFBE33') }, // 600
  { label: 'Orange', value: token('color.chart.orange.bold', '#D97008') }, // 600
  { label: 'Red', value: token('color.chart.red.bold', '#FC552C') }, // 600
  { label: 'Magenta', value: token('color.chart.magenta.bold', '#DA62AC') }, // 600
  { label: 'Purple', value: token('color.chart.purple.bold', '#8B77EE') }, // 600
  { label: 'Gray', value: token('color.chart.gray.bold', '#8590A2') }, // 600

  {
    label: 'Light Blue',
    value: token('color.background.accent.blue.subtle', '#7AB2FF'),
  }, // 400
  {
    label: 'Light Teal',
    value: token('color.background.accent.teal.subtle', '#60C6D2'),
  }, // 400
  {
    label: 'Light Green',
    value: token('color.background.accent.green.subtle', '#6BE1B0'),
  }, // 400
  {
    label: 'Light Yellow',
    value: token('color.background.accent.yellow.subtle', '#FFDB57'),
  }, // 400
  {
    label: 'Light Orange',
    value: token('color.background.accent.orange.subtle', '#FAA53D'),
  }, // 400
  {
    label: 'Light Red',
    value: token('color.background.accent.red.subtle', '#FF8F73'),
  }, // 400
  {
    label: 'Light Magenta',
    value: token('color.background.accent.magenta.subtle', '#E774BB'),
  }, // 400
  {
    label: 'Light Purple',
    value: token('color.background.accent.purple.subtle', '#B5A7FB'),
  }, // 400
  {
    label: 'Light Gray',
    value: token('color.background.accent.gray.subtle', '#8993A5'),
  }, // 400
].map((color) => ({
  ...color,
  border: DEFAULT_BORDER_COLOR,
}));

const colorPickerWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${token('space.400', '32px')};
  padding-right: ${token('space.100', '8px')};
`;

const colorPickerLabel = css`
  font-size: ${headingSizes.h400.size}px;
  margin-top: 0;
`;

interface Props {
  name: string;
  title: string;
  currentColor: string;
  onChange: (color: string) => void;
  onFieldChange: OnFieldChange;
  featureFlags?: FeatureFlags;
}

export const EXPANDED_COLOR_PICKER_COLUMNS = 9;
export const ORIGINAL_COLOR_PICKER_COLUMNS = 5;

const ColorPicker = (props: Props) => {
  const { name, title, currentColor, onChange, onFieldChange } = props;

  const onColorChange = (color: PaletteColor) => {
    const colorValue = color.value;

    onChange(colorValue);
    onFieldChange(name, currentColor !== colorValue);
  };

  return (
    <ColorPickerButton
      title={title}
      currentColor={currentColor}
      onChange={onColorChange}
      colorPalette={extendedColorPalette}
      paletteColorTooltipMessages={chartsColorPaletteTooltipMessages}
      cols={EXPANDED_COLOR_PICKER_COLUMNS}
      alignX="right"
      placement="ConfigPanel"
      size={{
        width: token('space.300', '24px'),
        height: token('space.300', '24px'),
      }}
    />
  );
};

const ColorPickerField = ({
  name,
  field,
  onFieldChange,
  featureFlags,
}: {
  name: string;
  field: ColorField;
  onFieldChange: OnFieldChange;
  featureFlags?: FeatureFlags;
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
        <Fragment>
          <div css={colorPickerWrapper}>
            <label css={colorPickerLabel}>
              {label}
              {isRequired && (
                <span css={requiredIndicator} aria-hidden="true">
                  *
                </span>
              )}
            </label>
            <ColorPicker
              name={name}
              title={label}
              currentColor={fieldProps.value}
              onChange={fieldProps.onChange}
              onFieldChange={onFieldChange}
              featureFlags={featureFlags}
            />
          </div>
          {error && <FieldMessages error={error} description="" />}
        </Fragment>
      )}
    </Field>
  );
};

export default ColorPickerField;
