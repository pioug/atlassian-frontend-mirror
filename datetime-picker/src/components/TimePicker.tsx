import Select, {
  CreatableSelect,
  components,
  mergeStyles,
  StylesConfig,
  MenuProps,
  OptionType,
  SelectProps,
} from '@atlaskit/select';
import {
  createLocalizationProvider,
  LocalizationProvider,
} from '@atlaskit/locale';
import pick from 'lodash.pick';
// eslint-disable-next-line no-restricted-imports
import { format, isValid } from 'date-fns';
import React, { CSSProperties } from 'react';
import {
  withAnalyticsEvents,
  withAnalyticsContext,
  WithAnalyticsEventsProps,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
import { B100 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import { Appearance, Spacing } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import {
  ClearIndicator,
  defaultTimes,
  DropdownIndicator,
  defaultTimeFormat,
  placeholderDatetime,
} from '../internal';
import parseTime from '../internal/parseTime';
import FixedLayer from '../internal/FixedLayer';

interface Option {
  label: string;
  value: string;
}

/* eslint-disable react/no-unused-prop-types */
export interface Props extends WithAnalyticsEventsProps {
  /** Defines the appearance which can be default or subtle - no borders, background or icon.
   *  Appearance values will be ignored if styles are parsed via the selectProps.
   */
  appearance?: Appearance;
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean;
  /** Default for `isOpen`. */
  defaultIsOpen: boolean;
  /** Default for `value`. */
  defaultValue: string;
  /** DEPRECATED - Use locale instead. Function for formatting the displayed time value in the input. By default parses with an internal time parser, and formats using the [date-fns format function]((https://date-fns.org/v1.29.0/docs/format)) */
  formatDisplayLabel?: (time: string, timeFormat: string) => string;
  /** The icon to show in the field. */
  icon?: React.ReactNode;
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string;
  /** Props to apply to the container. **/
  innerProps: React.AllHTMLAttributes<HTMLElement>;
  /** Whether or not the field is disabled. */
  isDisabled: boolean;
  /** Whether or not the dropdown is open. */
  isOpen?: boolean;
  /** The name of the field. */
  name: string;
  /** Called when the field is blurred. */
  onBlur: React.FocusEventHandler<HTMLElement>;
  /** Called when the value changes. The only argument is an ISO time or empty string. */
  onChange: (value: string) => void;
  /** Called when the field is focused. */
  onFocus: React.FocusEventHandler<HTMLElement>;
  parseInputValue: (time: string, timeFormat: string) => string | Date;
  /** Props to apply to the select. */
  selectProps: SelectProps<any>;
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing: Spacing;
  /** The times to show in the dropdown. */
  times: string[];
  /** Allow users to edit the input and add a time */
  timeIsEditable?: boolean;
  /** The ISO time that should be used as the input value. */
  value?: string;
  /** Indicates current value is invalid & changes border color. */
  isInvalid?: boolean;
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean;
  /** DEPRECATED - Use locale instead. Time format that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format)*/
  timeFormat?: string;
  /** Placeholder text displayed in input */
  placeholder?: string;
  locale: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--container` wrapping element of time-picker
   **/
  testId?: string;
}

interface State {
  isOpen: boolean;
  value: string;
  isFocused: boolean;
  l10n: LocalizationProvider;
}

const menuStyles: CSSProperties = {
  /* Need to remove default absolute positioning as that causes issues with position fixed */
  position: 'static',
  /* Need to add overflow to the element with max-height, otherwise causes overflow issues in IE11 */
  overflowY: 'auto',
};

const FixedLayerMenu = ({ selectProps, ...rest }: { selectProps: any }) => (
  <FixedLayer
    inputValue={selectProps.inputValue}
    containerRef={selectProps.fixedLayerRef}
    content={
      <components.Menu
        {...(rest as MenuProps<OptionType>)}
        menuShouldScrollIntoView={false}
      />
    }
  />
);

function noop() {}

class TimePicker extends React.Component<Props, State> {
  containerRef: HTMLElement | null = null;

  static defaultProps = {
    appearance: 'default' as Appearance,
    autoFocus: false,
    defaultIsOpen: false,
    defaultValue: '',
    hideIcon: false,
    id: '',
    innerProps: {},
    isDisabled: false,
    isInvalid: false,
    name: '',
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    parseInputValue: (time: string) => parseTime(time),
    selectProps: {},
    spacing: 'default' as Spacing,
    times: defaultTimes,
    timeIsEditable: false,
    locale: 'en-US',
    // Not including a default prop for value as it will
    // Make the component a controlled component
  };

  state = {
    isOpen: this.props.defaultIsOpen,
    value: this.props.defaultValue,
    isFocused: false,
    l10n: createLocalizationProvider(this.props.locale),
  };

  componentWillReceiveProps(nextProps: Props): void {
    if (this.props.locale !== nextProps.locale) {
      this.setState({ l10n: createLocalizationProvider(nextProps.locale) });
    }
  }

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getSafeState = (): State => {
    return {
      ...this.state,
      ...pick(this.props, ['value', 'isOpen']),
    };
  };

  getOptions(): Array<Option> {
    return this.props.times.map(
      (time: string): Option => {
        return {
          label: this.formatTime(time),
          value: time,
        };
      },
    );
  }

  onChange = (v: { value: string } | null): void => {
    const value = v ? v.value : '';
    this.setState({ value });
    this.props.onChange(value);
  };

  /** Only allow custom times if timeIsEditable prop is true  */
  onCreateOption = (inputValue: any): void => {
    if (this.props.timeIsEditable) {
      const { parseInputValue, timeFormat } = this.props;
      // TODO parseInputValue doesn't accept `timeFormat` as an function arg yet...
      const value =
        format(
          parseInputValue(inputValue, timeFormat || defaultTimeFormat),
          'HH:mm',
        ) || '';
      this.setState({ value });
      this.props.onChange(value);
    } else {
      this.onChange(inputValue);
    }
  };

  onMenuOpen = () => {
    this.setState({ isOpen: true });
  };

  onMenuClose = () => {
    this.setState({ isOpen: false });
  };

  setContainerRef = (ref: HTMLElement | null) => {
    const oldRef = this.containerRef;
    this.containerRef = ref;
    // Cause a re-render if we're getting the container ref for the first time
    // as the layered menu requires it for dimension calculation
    if (oldRef == null && ref != null) {
      this.forceUpdate();
    }
  };

  onBlur = (event: React.FocusEvent<HTMLElement>) => {
    this.setState({ isFocused: false });
    this.props.onBlur(event);
  };

  onFocus = (event: React.FocusEvent<HTMLElement>) => {
    this.setState({ isFocused: true });
    this.props.onFocus(event);
  };

  getSubtleControlStyles = (selectStyles: StylesConfig) =>
    !selectStyles.control
      ? {
          border: `2px solid ${
            this.getSafeState().isFocused ? `${B100}` : `transparent`
          }`,
          backgroundColor: 'transparent',
          padding: '1px',
        }
      : {};

  /**
   * There are multiple props that can change how the time is formatted.
   * The priority of props used is:
   *   1. formatDisplayLabel
   *   2. timeFormat
   *   3. locale
   */
  formatTime = (time: string): string => {
    const { formatDisplayLabel, timeFormat } = this.props;
    const { l10n } = this.getSafeState();

    if (formatDisplayLabel) {
      return formatDisplayLabel(time, timeFormat || defaultTimeFormat);
    }

    const date = parseTime(time);
    if (!(date instanceof Date)) {
      return '';
    }

    if (!isValid(date)) {
      return time;
    }

    if (timeFormat) {
      return format(date, timeFormat);
    }

    return l10n.formatTime(date);
  };

  getPlaceholder = () => {
    const { placeholder } = this.props;
    if (placeholder) {
      return placeholder;
    }

    const { l10n } = this.getSafeState();
    return l10n.formatTime(placeholderDatetime);
  };

  render() {
    const {
      autoFocus,
      id,
      innerProps,
      isDisabled,
      name,
      selectProps,
      spacing,
      testId,
    } = this.props;
    const ICON_PADDING = 2;
    const BORDER_WIDTH = 2;

    const { value = '', isOpen } = this.getSafeState();
    const validationState = this.props.isInvalid ? 'error' : 'default';
    const icon =
      this.props.appearance === 'subtle' || this.props.hideIcon
        ? null
        : this.props.icon;

    const { styles: selectStyles = {}, ...otherSelectProps } = selectProps;
    const controlStyles =
      this.props.appearance === 'subtle'
        ? this.getSubtleControlStyles(selectStyles)
        : {};
    const SelectComponent = this.props.timeIsEditable
      ? CreatableSelect
      : Select;

    const labelAndValue = value && {
      label: this.formatTime(value),
      value,
    };

    return (
      <div
        {...innerProps}
        ref={this.setContainerRef}
        data-testid={testId && `${testId}--container`}
      >
        <input name={name} type="hidden" value={value} />
        <SelectComponent
          autoFocus={autoFocus}
          components={{
            ClearIndicator,
            DropdownIndicator,
            Menu: FixedLayerMenu,
          }}
          instanceId={id}
          isClearable
          isDisabled={isDisabled}
          menuIsOpen={isOpen && !isDisabled}
          menuPlacement="auto"
          openMenuOnFocus
          onBlur={this.onBlur}
          onCreateOption={this.onCreateOption}
          onChange={this.onChange}
          options={this.getOptions()}
          onFocus={this.onFocus}
          onMenuOpen={this.onMenuOpen}
          onMenuClose={this.onMenuClose}
          placeholder={this.getPlaceholder()}
          styles={mergeStyles(selectStyles, {
            control: base => ({
              ...base,
              ...controlStyles,
            }),
            menu: base => ({
              ...base,
              ...menuStyles,
              ...{
                // Fixed positioned elements no longer inherit width from their parent, so we must explicitly set the
                // menu width to the width of our container
                width: this.containerRef
                  ? this.containerRef.getBoundingClientRect().width
                  : 'auto',
              },
            }),
            indicatorsContainer: base => ({
              ...base,
              paddingLeft: icon ? ICON_PADDING : 0,
              paddingRight: icon ? gridSize() - BORDER_WIDTH : 0,
            }),
          })}
          value={labelAndValue}
          spacing={spacing}
          dropdownIndicatorIcon={icon}
          fixedLayerRef={this.containerRef}
          validationState={validationState}
          testId={testId}
          {...otherSelectProps}
        />
      </div>
    );
  }
}

export { TimePicker as TimePickerWithoutAnalytics };

export default withAnalyticsContext({
  componentName: 'timePicker',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEvent('atlaskit')({
      action: 'selectedTime',
      actionSubject: 'timePicker',

      attributes: {
        componentName: 'timePicker',
        packageName,
        packageVersion,
      },
    }),
  })(TimePicker),
);
