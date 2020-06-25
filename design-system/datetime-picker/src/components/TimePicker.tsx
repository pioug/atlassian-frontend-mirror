import React, { CSSProperties } from 'react';

// eslint-disable-next-line no-restricted-imports
import { format, isValid } from 'date-fns';
import pick from 'lodash.pick';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  createLocalizationProvider,
  LocalizationProvider,
} from '@atlaskit/locale';
import Select, {
  ActionMeta,
  components,
  CreatableSelect,
  MenuProps,
  mergeStyles,
  OptionType,
  SelectComponentsConfig,
  SelectProps,
  StylesConfig,
} from '@atlaskit/select';
import { B100 } from '@atlaskit/theme/colors';
import { gridSize } from '@atlaskit/theme/constants';

import {
  defaultTimeFormat,
  defaultTimes,
  DropdownIndicator,
  EmptyClearIndicator,
  placeholderDatetime,
} from '../internal';
import FixedLayer from '../internal/FixedLayer';
import parseTime from '../internal/parseTime';
import { Appearance, Spacing } from '../types';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';

interface Option {
  label: string;
  value: string;
}

/* eslint-disable react/no-unused-prop-types */
export interface Props extends WithAnalyticsEventsProps {
  /** Defines the appearance which can be default or subtle - no borders or background.
   *  Appearance values will be ignored if styles are parsed via the selectProps.
   */
  appearance?: Appearance;
  /** Whether or not to auto-focus the field. */
  autoFocus?: boolean;
  /** Default for `isOpen`. */
  defaultIsOpen?: boolean;
  /** Default for `value`. */
  defaultValue?: string;
  /** DEPRECATED - Use locale instead. Function for formatting the displayed time value in the input. By default parses with an internal time parser, and formats using the [date-fns format function]((https://date-fns.org/v1.29.0/docs/format)) */
  formatDisplayLabel?: (time: string, timeFormat: string) => string;
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id?: string;
  /** Props to apply to the container. **/
  innerProps?: React.AllHTMLAttributes<HTMLElement>;
  /** Whether or not the field is disabled. */
  isDisabled?: boolean;
  /** Whether or not the dropdown is open. */
  isOpen?: boolean;
  /** The name of the field. */
  name?: string;
  /** Called when the field is blurred. */
  onBlur?: React.FocusEventHandler<HTMLElement>;
  /** Called when the value changes. The only argument is an ISO time or empty string. */
  onChange?: (value: string) => void;
  /** Called when the field is focused. */
  onFocus?: React.FocusEventHandler<HTMLElement>;
  parseInputValue?: (time: string, timeFormat: string) => string | Date;
  /** Props to apply to the select. */
  selectProps?: SelectProps<any>;
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: Spacing;
  /** The times to show in the dropdown. */
  times?: string[];
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
  locale?: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--container` wrapping element of time-picker
   **/
  testId?: string;
}

export type TimePickerProps = typeof TimePicker.defaultProps & Props;

interface State {
  isOpen: boolean;
  /**
   * When being cleared from the icon the TimePicker is blurred.
   * This variable defines whether the default onMenuOpen or onMenuClose
   * events should behave as normal
   */
  clearingFromIcon: boolean;
  value: string;
  isFocused: boolean;
  l10n: LocalizationProvider;
}

const menuStyles: CSSProperties = {
  /* Need to remove default absolute positioning as that causes issues with position fixed */
  position: 'static',
  /* Need to add overflow to the element with max-height, otherwise causes overflow issues in IE11 */
  overflowY: 'auto',
  /* React-Popper has already offset the menu so we need to reset the margin, otherwise the offset value is doubled */
  margin: 0,
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
    testId={selectProps.testId}
  />
);

// TODO: Please replace Props with TimePickerProps
// when https://github.com/atlassian/extract-react-types/issues/113 gets resolved
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
    onBlur: (_: React.FocusEvent<HTMLInputElement>) => {},
    onChange: (_: string) => {},
    onFocus: (_: React.FocusEvent<HTMLInputElement>) => {},
    parseInputValue: (time: string, timeFormat: string) => parseTime(time),
    selectProps: {},
    spacing: 'default' as Spacing,
    times: defaultTimes,
    timeIsEditable: false,
    locale: 'en-US',
    // Not including a default prop for value as it will
    // Make the component a controlled component
  };

  state = {
    isOpen: this.getTypeSafeProps().defaultIsOpen,
    clearingFromIcon: false,
    value: this.getTypeSafeProps().defaultValue,
    isFocused: false,
    l10n: createLocalizationProvider(this.getTypeSafeProps().locale),
  };

  componentWillReceiveProps(nextProps: TimePickerProps): void {
    const { locale } = this.getTypeSafeProps();

    if (locale !== nextProps.locale) {
      this.setState({ l10n: createLocalizationProvider(nextProps.locale) });
    }
  }

  // TODO: Please remove this method
  // when https://github.com/atlassian/extract-react-types/issues/113 gets resolved
  getTypeSafeProps() {
    return this.props as TimePickerProps;
  }

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getSafeState = (): State => {
    const typeSafeProps = this.getTypeSafeProps();

    return {
      ...this.state,
      ...pick(typeSafeProps, ['value', 'isOpen']),
    };
  };

  getOptions(): Array<Option> {
    const { times } = this.getTypeSafeProps();

    return times.map(
      (time: string): Option => {
        return {
          label: this.formatTime(time),
          value: time,
        };
      },
    );
  }

  onChange = (v: { value: string } | null, action?: ActionMeta): void => {
    const value = v ? v.value : '';
    let changedState: {} = { value };

    if (action && action.action === 'clear') {
      changedState = {
        ...changedState,
        clearingFromIcon: true,
      };
    }

    this.setState(changedState);

    const { onChange } = this.getTypeSafeProps();

    onChange(value);
  };

  /** Only allow custom times if timeIsEditable prop is true  */
  onCreateOption = (inputValue: any): void => {
    const {
      timeIsEditable,
      parseInputValue,
      timeFormat,
      onChange,
    } = this.getTypeSafeProps();

    if (timeIsEditable) {
      // TODO parseInputValue doesn't accept `timeFormat` as an function arg yet...
      const value =
        format(
          parseInputValue(inputValue, timeFormat || defaultTimeFormat),
          'HH:mm',
        ) || '';
      this.setState({ value });
      onChange(value);
    } else {
      this.onChange(inputValue);
    }
  };

  onMenuOpen = () => {
    // Don't open menu after the user has clicked clear
    if (this.getSafeState().clearingFromIcon) {
      this.setState({ clearingFromIcon: false });
    } else {
      this.setState({ isOpen: true });
    }
  };

  onMenuClose = () => {
    // Don't close menu after the user has clicked clear
    if (this.getSafeState().clearingFromIcon) {
      this.setState({ clearingFromIcon: false });
    } else {
      this.setState({ isOpen: false });
    }
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

    const { onBlur } = this.getTypeSafeProps();

    onBlur(event);
  };

  onFocus = (event: React.FocusEvent<HTMLElement>) => {
    this.setState({ isFocused: true });

    const { onFocus } = this.getTypeSafeProps();

    onFocus(event);
  };

  onSelectKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    const keyPressed = key.toLowerCase();
    if (
      this.getSafeState().clearingFromIcon &&
      (keyPressed === 'backspace' || keyPressed === 'delete')
    ) {
      // If being cleared from keyboard, don't change behaviour
      this.setState({ clearingFromIcon: false });
    }
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
    const { formatDisplayLabel, timeFormat } = this.getTypeSafeProps();
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
    const { placeholder } = this.getTypeSafeProps();
    if (placeholder) {
      return placeholder;
    }

    const { l10n } = this.getSafeState();
    return l10n.formatTime(placeholderDatetime);
  };

  render() {
    const {
      autoFocus,
      hideIcon,
      id,
      innerProps,
      isDisabled,
      name,
      selectProps,
      spacing,
      testId,
      isInvalid,
      appearance,
      timeIsEditable,
    } = this.getTypeSafeProps();
    const ICON_PADDING = 2;
    const BORDER_WIDTH = 2;

    const { value = '', isOpen } = this.getSafeState();
    const validationState = isInvalid ? 'error' : 'default';

    const { styles: selectStyles = {}, ...otherSelectProps } = selectProps;
    const controlStyles =
      appearance === 'subtle' ? this.getSubtleControlStyles(selectStyles) : {};
    const SelectComponent = timeIsEditable ? CreatableSelect : Select;

    const labelAndValue = value && {
      label: this.formatTime(value),
      value,
    };

    const selectComponents: SelectComponentsConfig<OptionType> = {
      DropdownIndicator,
      Menu: FixedLayerMenu,
    };
    if (hideIcon) {
      selectComponents.ClearIndicator = EmptyClearIndicator;
    }

    const renderIconContainer = Boolean(hideIcon && value);

    const mergedStyles = mergeStyles(selectStyles, {
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
        paddingLeft: renderIconContainer ? ICON_PADDING : 0,
        paddingRight: renderIconContainer ? gridSize() - BORDER_WIDTH : 0,
      }),
    });

    return (
      <div
        {...innerProps}
        ref={this.setContainerRef}
        data-testid={testId && `${testId}--container`}
        onKeyDown={this.onSelectKeyDown}
      >
        <input name={name} type="hidden" value={value} />
        <SelectComponent
          autoFocus={autoFocus}
          components={selectComponents}
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
          styles={mergedStyles}
          value={labelAndValue}
          spacing={spacing}
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
