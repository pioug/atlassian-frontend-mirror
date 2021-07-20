import React, { CSSProperties } from 'react';

import styled from '@emotion/styled';
// eslint-disable-next-line no-restricted-imports
import { format, isValid, lastDayOfMonth, parseISO } from 'date-fns';
import pick from 'lodash/pick';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import Calendar, { CalendarRef } from '@atlaskit/calendar';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import {
  createLocalizationProvider,
  LocalizationProvider,
} from '@atlaskit/locale';
import Select, {
  ActionMeta,
  IndicatorComponentType,
  IndicatorProps,
  mergeStyles,
  OptionType,
  SelectComponentsConfig,
  ValueType,
} from '@atlaskit/select';
import { B100, N20 } from '@atlaskit/theme/colors';
import { borderRadius, gridSize, layers } from '@atlaskit/theme/constants';
import { e200 } from '@atlaskit/theme/elevation';

import {
  defaultDateFormat,
  EmptyClearIndicator,
  padToTwo,
  placeholderDatetime,
} from '../internal';
import FixedLayer from '../internal/FixedLayer';
import { Appearance, SelectProps, Spacing } from '../types';

import { convertTokens } from './utils';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

/* eslint-disable react/no-unused-prop-types */
export interface Props extends WithAnalyticsEventsProps {
  /**
    Set the appearance of the picker.

    `subtle` will remove the borders, background, and icon.

    **NOTE:** Appearance values will be ignored if styles are parsed through `selectProps`.
   */
  appearance?: Appearance;
  /** Set the picker to autofocus on mount. */
  autoFocus?: boolean;
  /** The default for `isOpen`. Will be `false` if not provided. */
  defaultIsOpen?: boolean;
  /** The default for `value`. */
  defaultValue?: string;
  /** An array of ISO dates that should be disabled on the calendar. This does not affect what users can type into the picker. */
  disabled?: string[];
  /**
    A filter function for disabling dates on the calendar. This does not affect what users can type into the picker.
   
    The function is called with a date string in the format `YYYY-MM-DD` and should return `true` if the date should be disabled.
   */
  disabledDateFilter?: (date: string) => boolean;
  /** The latest enabled date. Dates after this are disabled on the calendar. This does not affect what users can type into the picker. */
  maxDate?: string;
  /** The earliest enabled date. Dates before this are disabled on the calendar. This does not affect what users can type into the picker. */
  minDate?: string;
  /** The icon shown in the picker. */
  icon?: IndicatorComponentType<OptionType>;
  /**
    The id of the field. Currently, react-select transforms this to have a `react-select-` prefix, and an `--input` suffix when applied to the input. For example, the id `my-input` would be transformed to `react-select-my-input--input`.

    Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release.
   */
  id?: string;
  /** Props to apply to the container. **/
  innerProps?: React.AllHTMLAttributes<HTMLElement>;
  /** Set if the picker is disabled. */
  isDisabled?: boolean;
  /** Set if the picker is open. */
  isOpen?: boolean;
  /** The name of the field. */
  name?: string;
  /** Called when the field is blurred. */
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  /** Called when the value changes. The only argument is an ISO time or empty string. */
  onChange?: (value: string) => void;
  /** Called when the field is focused. */
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  /** A function for parsing input characters and transforming them into a Date object. By default parses the date string based off the locale. */
  parseInputValue?: (date: string, dateFormat: string) => Date;
  /** A function for formatting the date displayed in the input. By default composes together [date-fn's parse method](https://date-fns.org/v1.29.0/docs/parse) and [date-fn's format method](https://date-fns.org/v1.29.0/docs/format) to return a correctly formatted date string. */
  formatDisplayLabel?: (value: string, dateFormat: string) => string;
  /** Props to apply to the select. This can be used to set options such as placeholder text.
   *  See [the `Select` documentation for further information](/components/select). */
  selectProps?: SelectProps;
  /**
    The spacing for the select control.
   
    Compact is `gridSize() * 4`, default is `gridSize * 5`.
   */
  spacing?: Spacing;
  /** The ISO time used as the input value. */
  value?: string;
  /** Set if the picker has an invalid value. */
  isInvalid?: boolean;
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean;
  /** Format the date with a string that is accepted by [date-fn's format function](https://date-fns.org/v1.29.0/docs/format). */
  dateFormat?: string;
  /** Placeholder text displayed in input */
  placeholder?: string;
  /** Locale used to format the date and calendar. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat). */
  locale?: string;
  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--container` wrapping element of date-picker
   *  - `{testId}--calendar--container` nested calendar component
   **/
  testId?: string;
  /**
   * Start day of the week for the calendar.
   * - `0` sunday (default value)
   * - `1` monday
   * - `2` tuesday
   * - `3` wednesday
   * - `4` thursday
   * - `5` friday
   * - `6` saturday
   */
  weekStartDay?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
}

type DatePickerProps = typeof datePickerDefaultProps & Props;

interface State {
  isOpen: boolean;
  /**
   * When being cleared from the icon the DatePicker is blurred.
   * This variable defines whether the default onSelectBlur or onSelectFocus
   * events should behave as normal
   */
  clearingFromIcon: boolean;
  value: string;
  /** Value to be shown in the calendar as selected.  */
  selectedValue: string;
  view: string;
  inputValue: string;
  l10n: LocalizationProvider;
}

type DateObj = {
  day: number;
  month: number;
  year: number;
};

function getDateObj(date: Date): DateObj {
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  };
}

function getValidDate(iso: string) {
  const date = parseISO(iso);
  return isValid(date) ? getDateObj(date) : {};
}

const StyledMenu = styled.div`
  background-color: ${N20};
  border-radius: ${borderRadius()}px;
  z-index: ${layers.dialog};
  ${e200()};
`;

const Menu = ({
  selectProps,
  innerProps,
}: {
  selectProps: SelectProps;
  innerProps: React.AllHTMLAttributes<HTMLElement>;
}) => (
  <FixedLayer
    inputValue={selectProps.inputValue}
    containerRef={selectProps.calendarContainerRef}
    content={
      <StyledMenu {...innerProps}>
        <Calendar
          {...getValidDate(selectProps.calendarValue)}
          {...getValidDate(selectProps.calendarView)}
          disabled={selectProps.calendarDisabled}
          disabledDateFilter={selectProps.calendarDisabledDateFilter}
          minDate={selectProps.calendarMinDate}
          maxDate={selectProps.calendarMaxDate}
          onChange={selectProps.onCalendarChange}
          onSelect={selectProps.onCalendarSelect}
          calendarRef={selectProps.calendarRef}
          selected={[selectProps.calendarValue]}
          locale={selectProps.calendarLocale}
          testId={selectProps.testId && `${selectProps.testId}--calendar`}
          weekStartDay={selectProps.calendarWeekStartDay}
        />
      </StyledMenu>
    }
    testId={selectProps.testId}
  />
);

const datePickerDefaultProps = {
  appearance: 'default' as Appearance,
  autoFocus: false,
  defaultIsOpen: false,
  defaultValue: '',
  disabled: [] as string[],
  disabledDateFilter: (_: string) => false,
  hideIcon: false,
  icon: (CalendarIcon as unknown) as React.ComponentType<
    IndicatorProps<OptionType>
  >,
  id: '',
  innerProps: {},
  isDisabled: false,
  isInvalid: false,
  name: '',
  onBlur: (event: React.FocusEvent<HTMLInputElement>) => {},
  onChange: (value: string) => {},
  onFocus: (event: React.FocusEvent<HTMLInputElement>) => {},
  selectProps: {},
  spacing: 'default' as Spacing,
  locale: 'en-US',
  // Not including a default prop for value as it will
  // Make the component a controlled component
};

class DatePicker extends React.Component<DatePickerProps, State> {
  static defaultProps = datePickerDefaultProps;
  calendarRef: CalendarRef | null = null;
  containerRef: HTMLElement | null = null;

  constructor(props: any) {
    super(props);

    const { day, month, year } = getDateObj(new Date());

    this.state = {
      isOpen: this.props.defaultIsOpen,
      clearingFromIcon: false,
      inputValue: this.props.selectProps.inputValue,
      selectedValue: this.props.value || this.props.defaultValue,
      value: this.props.defaultValue,
      view:
        this.props.value ||
        this.props.defaultValue ||
        `${year}-${padToTwo(month)}-${padToTwo(day)}`,
      l10n: createLocalizationProvider(this.props.locale),
    };
  }

  componentWillReceiveProps(nextProps: Readonly<DatePickerProps>): void {
    if (this.props.locale !== nextProps.locale) {
      this.setState({
        l10n: createLocalizationProvider(nextProps.locale),
      });
    }
  }

  // All state needs to be accessed via this function so that the state is mapped from props
  // correctly to allow controlled/uncontrolled usage.
  getSafeState = () => {
    return {
      ...this.state,
      ...pick(this.props, ['value', 'isOpen']),
      ...pick(this.props.selectProps, ['inputValue']),
    };
  };

  isDateDisabled = (date: string) => {
    return this.props.disabled.indexOf(date) > -1;
  };

  onCalendarChange = ({ iso }: { iso: string }) => {
    const [year, month, date] = iso.split('-');
    let newIso = iso;

    const parsedDate = parseInt(date, 10);
    const parsedMonth = parseInt(month, 10);
    const parsedYear = parseInt(year, 10);

    const lastDayInMonth = lastDayOfMonth(
      new Date(
        parsedYear,
        parsedMonth - 1, // This needs to be -1, because the Date constructor expects an index of the given month
      ),
    ).getDate();

    if (lastDayInMonth < parsedDate) {
      newIso = `${year}-${padToTwo(parsedMonth)}-${padToTwo(lastDayInMonth)}`;
    } else {
      newIso = `${year}-${padToTwo(parsedMonth)}-${padToTwo(parsedDate)}`;
    }

    this.setState({ view: newIso });
  };

  onCalendarSelect = ({ iso }: { iso: string }) => {
    this.setState({
      inputValue: '',
      isOpen: false,
      selectedValue: iso,
      view: iso,
      value: iso,
    });

    this.props.onChange(iso);
  };

  onInputClick = () => {
    if (!this.props.isDisabled && !this.getSafeState().isOpen) {
      this.setState({ isOpen: true });
    }
  };

  onSelectBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    if (this.getSafeState().clearingFromIcon) {
      // Don't close menu if blurring after the user has clicked clear
      this.setState({ clearingFromIcon: false });
    } else {
      this.setState({ isOpen: false });
    }
    this.props.onBlur(event);
  };

  onSelectFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { clearingFromIcon, value } = this.getSafeState();

    if (clearingFromIcon) {
      // Don't open menu if focussing after the user has clicked clear
      this.setState({ clearingFromIcon: false });
    } else {
      this.setState({
        isOpen: true,
        view: value,
      });
    }

    this.props.onFocus(event);
  };

  onSelectInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value) {
      const parsed = this.parseDate(value);
      // Only try to set the date if we have month & day
      if (parsed && isValid(parsed)) {
        // We format the parsed date to YYYY-MM-DD here because
        // this is the format expected by the @atlaskit/calendar component
        this.setState({
          view: format(parsed, convertTokens('YYYY-MM-DD')),
        });
      }
    }

    this.setState({ isOpen: true });
  };

  onSelectKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { view, selectedValue } = this.getSafeState();

    const keyPressed = event.key.toLowerCase();
    switch (keyPressed) {
      case 'arrowup':
      case 'arrowdown':
        if (this.calendarRef) {
          event.preventDefault();
          const key = keyPressed === 'arrowup' ? 'up' : 'down';
          this.calendarRef.navigate(key);
        }
        this.setState({ isOpen: true });
        break;
      case 'arrowleft':
      case 'arrowright':
        if (this.calendarRef) {
          event.preventDefault();
          const key = keyPressed === 'arrowleft' ? 'left' : 'right';
          this.calendarRef.navigate(key);
        }
        break;
      case 'escape':
      case 'tab':
        this.setState({ isOpen: false });
        break;
      case 'backspace':
      case 'delete':
        if (
          selectedValue &&
          event.target instanceof HTMLInputElement &&
          event.target.value.length < 1
        ) {
          // If being cleared from keyboard, don't change behaviour
          this.setState({ clearingFromIcon: false });
        }
        break;
      case 'enter':
        if (!this.isDateDisabled(view)) {
          this.setState({
            inputValue: '',
            isOpen: false,
            selectedValue: view,
            value: view,
            view,
          });
          this.props.onChange(view);
        }
        break;
      default:
        break;
    }
  };

  onClear = () => {
    let changedState: {} = {
      selectedValue: '',
      value: '',
      view:
        this.props.defaultValue ||
        format(new Date(), convertTokens('YYYY-MM-DD')),
    };

    if (!this.props.hideIcon) {
      changedState = {
        ...changedState,
        clearingFromIcon: true,
      };
    }
    this.setState(changedState);
    this.props.onChange('');
  };

  onSelectChange = (value: ValueType<OptionType>, action: ActionMeta) => {
    // Used for native clear event in React Select
    // Triggered when clicking ClearIndicator or backspace with no value
    if (action.action === 'clear') {
      this.onClear();
    }
  };

  refCalendar = (ref: CalendarRef | null) => {
    this.calendarRef = ref;
  };

  handleInputChange = (inputValue: string, actionMeta: {}) => {
    const { onInputChange } = this.props.selectProps;
    if (onInputChange) {
      onInputChange(inputValue, actionMeta);
    }
    this.setState({ inputValue });
  };

  getContainerRef = (ref: HTMLElement | null) => {
    const oldRef = this.containerRef;
    this.containerRef = ref;
    // Cause a re-render if we're getting the container ref for the first time
    // as the layered menu requires it for dimension calculation
    if (oldRef == null && ref != null) {
      this.forceUpdate();
    }
  };

  getSubtleControlStyles = (isOpen: boolean) => ({
    border: `2px solid ${isOpen ? B100 : `transparent`}`,
    backgroundColor: 'transparent',
    padding: '1px',
  });

  /**
   * There are two props that can change how the date is parsed.
   * The priority of props used is:
   *   1. parseInputValue
   *   2. locale
   */
  parseDate = (date: string) => {
    const { parseInputValue, dateFormat } = this.props;

    if (parseInputValue) {
      return parseInputValue(date, dateFormat || defaultDateFormat);
    }

    const { l10n } = this.getSafeState();

    return l10n.parseDate(date);
  };

  /**
   * There are multiple props that can change how the date is formatted.
   * The priority of props used is:
   *   1. formatDisplayLabel
   *   2. dateFormat
   *   3. locale
   */
  formatDate = (value: string) => {
    const { formatDisplayLabel, dateFormat } = this.props;
    const { l10n } = this.getSafeState();

    if (formatDisplayLabel) {
      return formatDisplayLabel(value, dateFormat || defaultDateFormat);
    }

    const date = parseISO(value);

    return dateFormat
      ? format(date, convertTokens(dateFormat))
      : l10n.formatDate(date);
  };

  getPlaceholder = () => {
    const { placeholder } = this.props;
    if (placeholder) {
      return placeholder;
    }

    const { l10n } = this.getSafeState();
    return l10n.formatDate(placeholderDatetime);
  };

  render() {
    const {
      appearance,
      autoFocus,
      disabled,
      hideIcon,
      icon,
      id,
      innerProps,
      isDisabled,
      disabledDateFilter,
      maxDate,
      minDate,
      isInvalid,
      name,
      selectProps,
      spacing,
      locale,
      testId,
      weekStartDay,
    } = this.props;
    const BORDER_WIDTH = 2;
    const ICON_PADDING = 2;

    const { value, view, isOpen, inputValue } = this.getSafeState();

    const menuIsOpen = isOpen && !isDisabled;

    const showClearIndicator = Boolean((value || inputValue) && !hideIcon);

    const dropDownIcon: IndicatorComponentType<OptionType> | null =
      appearance === 'subtle' || hideIcon || showClearIndicator ? null : icon;

    const selectComponents: SelectComponentsConfig<OptionType> = {
      DropdownIndicator: dropDownIcon,
      Menu,
    };
    if (!showClearIndicator) {
      selectComponents.ClearIndicator = EmptyClearIndicator;
    }

    const { styles: selectStyles = {} } = selectProps;
    const controlStyles =
      appearance === 'subtle' ? this.getSubtleControlStyles(isOpen) : {};
    const disabledStyle: CSSProperties = isDisabled
      ? { pointerEvents: 'none' }
      : {};

    const calendarProps = {
      calendarContainerRef: this.containerRef,
      calendarRef: this.refCalendar,
      calendarDisabled: disabled,
      calendarDisabledDateFilter: disabledDateFilter,
      calendarMaxDate: maxDate,
      calendarMinDate: minDate,
      calendarValue:
        value && format(parseISO(value), convertTokens('YYYY-MM-DD')),
      calendarView: view,
      onCalendarChange: this.onCalendarChange,
      onCalendarSelect: this.onCalendarSelect,
      calendarLocale: locale,
      calendarWeekStartDay: weekStartDay,
    };

    return (
      <div
        {...innerProps}
        role="presentation"
        onClick={this.onInputClick}
        onInput={this.onSelectInput}
        onKeyDown={this.onSelectKeyDown}
        ref={this.getContainerRef}
        data-testid={testId && `${testId}--container`}
      >
        <input
          name={name}
          type="hidden"
          value={value}
          data-testid={testId && `${testId}--input`}
        />
        <Select
          enableAnimation={false}
          menuIsOpen={menuIsOpen}
          closeMenuOnSelect
          autoFocus={autoFocus}
          instanceId={id}
          isDisabled={isDisabled}
          onBlur={this.onSelectBlur}
          onFocus={this.onSelectFocus}
          inputValue={inputValue}
          onInputChange={this.handleInputChange}
          components={selectComponents}
          onChange={this.onSelectChange}
          styles={mergeStyles(selectStyles, {
            control: (base: any) => ({
              ...base,
              ...controlStyles,
              ...disabledStyle,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              paddingLeft: ICON_PADDING,
              paddingRight: gridSize() - BORDER_WIDTH,
            }),
          })}
          placeholder={this.getPlaceholder()}
          value={
            value && {
              label: this.formatDate(value),
              value,
            }
          }
          {...selectProps}
          {...calendarProps}
          isClearable
          spacing={spacing}
          validationState={isInvalid ? 'error' : 'default'}
          testId={testId}
        />
      </div>
    );
  }
}

export { DatePicker as DatePickerWithoutAnalytics };

export default withAnalyticsContext({
  componentName: 'datePicker',
  packageName,
  packageVersion,
})(
  withAnalyticsEvents({
    onChange: createAndFireEvent('atlaskit')({
      action: 'selectedDate',
      actionSubject: 'datePicker',
      attributes: {
        componentName: 'datePicker',
        packageName,
        packageVersion,
      },
    }),
  })(DatePicker),
);
