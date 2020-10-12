import React from 'react';
import { Palette, Mode } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import {
  ColorCardWrapper,
  ColorPaletteMenu,
  ColorPaletteContainer,
} from '../styled/ColorPalette';
import ColorCard from './ColorCard';
import { getOptions } from '../utils';

export interface Props {
  /** color picker button label */
  label?: string;
  /** list of available colors */
  palette: Palette;
  /** selected color */
  selectedColor?: string;
  /** maximum column length */
  cols: number;
  /** color of checkmark on selected color */
  checkMarkColor?: string;
  /** onChange handler */
  onChange: (value: string, analyticsEvent?: object) => void;
  /** You should not be accessing this prop under any circumstances. It is provided by @atlaskit/analytics-next. */
  createAnalyticsEvent?: any;
  /** style of the color-picker, either 'Compact' or 'Standard', default value is 'Standard' */
  mode?: Mode;
}

export class ColorPaletteMenuWithoutAnalytics extends React.Component<Props> {
  static defaultProps = {
    cols: 6,
    mode: Mode.Standard,
  };

  createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

  changeAnalyticsCaller = () => {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      return this.createAndFireEventOnAtlaskit({
        action: 'clicked',
        actionSubject: 'color-palette-menu',

        attributes: {
          componentName: 'color-picker',
          packageName,
          packageVersion,
        },
      })(createAnalyticsEvent);
    }
    return undefined;
  };

  onChange = (value: string) => {
    this.props.onChange(value, this.changeAnalyticsCaller());
  };

  render() {
    const {
      palette,
      selectedColor,
      checkMarkColor,
      cols,
      label = 'Color picker',
      mode,
    } = this.props;
    const { options, value: selectedValue } = getOptions(
      palette,
      selectedColor,
    );
    const fullLabel = `${label}, ${selectedValue.label} selected`;

    return (
      <ColorPaletteMenu cols={cols} aria-label={fullLabel} mode={mode}>
        <ColorPaletteContainer mode={mode}>
          {options.map(({ label, value }) => (
            <ColorCardWrapper key={value}>
              <ColorCard
                label={label}
                value={value}
                checkMarkColor={checkMarkColor}
                isOption
                selected={value === selectedValue.value}
                onClick={this.onChange}
                onKeyDown={this.onChange}
              />
            </ColorCardWrapper>
          ))}
        </ColorPaletteContainer>
      </ColorPaletteMenu>
    );
  }
}

export default withAnalyticsContext({
  componentName: 'color-picker',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(ColorPaletteMenuWithoutAnalytics));
