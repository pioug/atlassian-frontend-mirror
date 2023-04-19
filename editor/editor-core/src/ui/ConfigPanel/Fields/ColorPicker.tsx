/** @jsx jsx */
import { jsx, css } from '@emotion/react';
import { Fragment } from 'react';
import { Field } from '@atlaskit/form';
import { ColorField } from '@atlaskit/editor-common/extensions';
import { FeatureFlags } from '@atlaskit/editor-common/types';
import { hexToEditorTableChartsPaletteColor } from '@atlaskit/editor-palette';
import { PaletteColor } from '../../../ui/ColorPalette/Palettes';
import { DEFAULT_BORDER_COLOR } from '../../../ui/ColorPalette/Palettes/common';
import { OnFieldChange } from '../types';
import { validate } from '../utils';
import { gridSize } from '@atlaskit/theme/constants';
import { requiredIndicator } from './common/RequiredIndicator';
import { headingSizes } from '@atlaskit/theme/typography';
import FieldMessages from '../FieldMessages';
import ColorPickerButton from '../../ColorPickerButton';
import { chartsColorPaletteTooltipMessages } from '../../../ui/ColorPalette';
/*
    NOTE: color used here are not yet in atlaskit code
    this is part of extended color pack from ADG, which is yet to be release
    at the time of writing this.

    Colour sequence source: https://product-fabric.atlassian.net/browse/ED-12650?focusedCommentId=204875
*/

export const colorPalette: PaletteColor[] = [
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

/**
 * Extended chart colors.
 * Decided here https://product-fabric.atlassian.net/wiki/spaces/EUXQ/pages/3477245015/Tokenising+table+charts+color
 */
export const extendedColorPalette: PaletteColor[] = [
  { label: 'Darker Blue', value: '#003884' }, // 1000
  { label: 'Darker Teal', value: '#206B74' }, // 1000
  { label: 'Darker Green', value: '#055C3F' }, // 1000
  { label: 'Darker Yellow', value: '#946104' }, // 1000
  { label: 'Darker Orange', value: '#974F0C' }, // 1000
  { label: 'Darker Red', value: '#A32000' }, // 1000
  { label: 'Darker Magenta', value: '#943D73' }, // 1000
  { label: 'Darker Purple', value: '#44368B' }, // 1000
  { label: 'Darker Gray', value: '#44546F' }, // 1000

  { label: 'Dark Blue', value: '#0055CC' }, // 800
  { label: 'Dark Teal', value: '#1D7F8C' }, // 800
  { label: 'Dark Green', value: '#177D52' }, // 800
  { label: 'Dark Yellow', value: '#FF9D00' }, // 800
  { label: 'Dark Orange', value: '#B65C02' }, // 800
  { label: 'Dark Red', value: '#D32D03' }, // 800
  { label: 'Dark Magenta', value: '#CD519D' }, // 800
  { label: 'Dark Purple', value: '#5A43D0' }, // 800
  { label: 'Dark Gray', value: '#758195' }, // 800

  { label: 'Blue', value: '#247FFF' }, // 600
  { label: 'Teal', value: '#1D9AAA' }, // 600
  { label: 'Green', value: '#23A971' }, // 600
  { label: 'Yellow', value: '#FFBE33' }, // 600
  { label: 'Orange', value: '#D97008' }, // 600
  { label: 'Red', value: '#FC552C' }, // 600
  { label: 'Magenta', value: '#DA62AC' }, // 600
  { label: 'Purple', value: '#8B77EE' }, // 600
  { label: 'Gray', value: '#8590A2' }, // 600

  { label: 'Light Blue', value: '#7AB2FF' }, // 400
  { label: 'Light Teal', value: '#60C6D2' }, // 400
  { label: 'Light Green', value: '#6BE1B0' }, // 400
  { label: 'Light Yellow', value: '#FFDB57' }, // 400
  { label: 'Light Orange', value: '#FAA53D' }, // 400
  { label: 'Light Red', value: '#FF8F73' }, // 400
  { label: 'Light Magenta', value: '#E774BB' }, // 400
  { label: 'Light Purple', value: '#B5A7FB' }, // 400
  { label: 'Light Gray', value: '#8993A5' }, // 400
].map((color) => ({
  ...color,
  border: DEFAULT_BORDER_COLOR,
}));

const colorPickerWrapper = css`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: ${4 * gridSize()}px;
  padding-right: ${gridSize()}px;
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
  const { name, title, currentColor, onChange, onFieldChange, featureFlags } =
    props;

  const onColorChange = (color: PaletteColor) => {
    const colorValue = color.value;

    onChange(colorValue);
    onFieldChange(name, currentColor !== colorValue);
  };

  const { useSomewhatSemanticTextColorNames, expandedChartColors } =
    featureFlags ?? {
      useSomewhatSemanticTextColorNames: false,
      expandedChartColors: false,
    };

  return expandedChartColors ? (
    <ColorPickerButton
      title={title}
      // Original color palette had hex code with alpha channel.
      // However, alpha channel was always FF, and it was not used
      // Expanded color palette does not have alpha channel, so
      //  removing last two characters from hex code with alpha here.
      currentColor={currentColor.substring(0, 7)}
      onChange={onColorChange}
      colorPalette={extendedColorPalette}
      hexToPaletteColor={hexToEditorTableChartsPaletteColor}
      paletteColorTooltipMessages={chartsColorPaletteTooltipMessages}
      // We did not want to create new FF or update
      //  useSomewhatSemanticTextColorNames name
      //  because it is temporary and require extra work.
      // So even though it says text color names,
      //  we are going to use for all color pickers
      //  such as text, background and table charts.
      showSomewhatSemanticTooltips={useSomewhatSemanticTextColorNames}
      cols={EXPANDED_COLOR_PICKER_COLUMNS}
      alignX="right"
      placement="ConfigPanel"
      size={{ width: 3 * gridSize(), height: 3 * gridSize() }}
    />
  ) : (
    <ColorPickerButton
      title={title}
      currentColor={currentColor}
      onChange={onColorChange}
      colorPalette={colorPalette}
      cols={ORIGINAL_COLOR_PICKER_COLUMNS}
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
