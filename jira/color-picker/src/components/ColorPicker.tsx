/** @jsx jsx */
import React from 'react';
import { PopupSelect, PopupSelectProps, ValueType } from '@atlaskit/select';
import Trigger from './Trigger';
import { Color, Palette, SwatchSize } from '../types';
import * as components from './components';
import { KEY_ARROW_DOWN, KEY_ARROW_UP, KEY_TAB } from '../constants';
import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { getOptions } from '../utils';
import { css, jsx } from '@emotion/react';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

export interface Props {
  /** color picker button label */
  label?: string;
  /** list of available colors */
  palette: Palette;
  /** selected color */
  selectedColor?: string;
  /** maximum column length */
  cols?: number;
  /** color of checkmark on selected color */
  checkMarkColor?: string;
  /** props for react-popper */
  popperProps?: PopupSelectProps['popperProps'];
  /** onChange handler */
  onChange: (value: string, analyticsEvent?: object) => void;
  /** You should not be accessing this prop under any circumstances. It is provided by @atlaskit/analytics-next. */
  createAnalyticsEvent?: any;
  /** swatch button size */
  selectedColourSwatchSize?: SwatchSize;
  /** swatch button default color */
  showDefaultSwatchColor?: boolean;
  /** diasble swatch button */
  isDisabledSelectedSwatch?: boolean;
}

const defaultPopperProps: Partial<PopupSelectProps['popperProps']> = {
  strategy: 'fixed',
  modifiers: [{ name: 'offset', options: { offset: [0, 8] } }],
  placement: 'bottom-start',
};

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

export class ColorPickerWithoutAnalytics extends React.Component<Props> {
  createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

  state = { isTabbing: false };

  changeAnalyticsCaller = () => {
    const { createAnalyticsEvent } = this.props;

    if (createAnalyticsEvent) {
      return this.createAndFireEventOnAtlaskit({
        action: 'clicked',
        actionSubject: 'color-picker',

        attributes: {
          componentName: 'color-picker',
          packageName,
          packageVersion,
        },
      })(createAnalyticsEvent);
    }
    return undefined;
  };

  onChangeSelect = (option: ValueType<Color>) => {
    this.props.onChange((option as Color).value, this.changeAnalyticsCaller());
  };

  onOptionKeyDown = (value: string) => {
    this.props.onChange(value, this.changeAnalyticsCaller());
  };

  onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    const key = e.key;
    if (key === KEY_TAB) {
      this.setState({ isTabbing: true });
    } else if (key === KEY_ARROW_UP || key === KEY_ARROW_DOWN) {
      this.setState({ isTabbing: false });
    } else if (
      getBooleanFF('platform.color-picker-radio-button-functionality_6hkcy') &&
      key === 'Escape'
    ) {
      e.stopPropagation();
    }
  };

  render() {
    const {
      palette,
      selectedColor,
      checkMarkColor,
      cols,
      popperProps = defaultPopperProps,
      label = 'Color picker',
      selectedColourSwatchSize,
      showDefaultSwatchColor = true,
      isDisabledSelectedSwatch,
    } = this.props;
    const { options, value } = getOptions(
      palette,
      selectedColor,
      showDefaultSwatchColor,
    );
    const fullLabel = value.label && `${label}, ${value.label} selected`;

    return (
      <PopupSelect<Color>
        target={({ ref, isOpen }) => (
          <div css={colorCardWrapperStyles} ref={ref}>
            <Trigger
              {...value}
              label={fullLabel}
              expanded={isOpen}
              {...(getBooleanFF(
                'platform.color-picker-radio-button-functionality_6hkcy',
              ) && {
                swatchSize: selectedColourSwatchSize,
                isDisabled: isDisabledSelectedSwatch,
              })}
            />
          </div>
        )}
        popperProps={popperProps}
        maxMenuWidth="auto"
        minMenuWidth="auto"
        options={options}
        aria-label={fullLabel}
        value={value}
        components={components}
        onChange={this.onChangeSelect}
        // never show search input
        searchThreshold={Number.MAX_VALUE}
        // palette props
        cols={cols}
        checkMarkColor={checkMarkColor}
        onKeyDown={this.onKeyDown}
        isTabbing={this.state.isTabbing}
        onOptionKeyDown={this.onOptionKeyDown}
      />
    );
  }
}

export default withAnalyticsContext({
  componentName: 'color-picker',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(ColorPickerWithoutAnalytics));

const colorCardWrapperStyles = css({
  display: 'inline-block',
});
