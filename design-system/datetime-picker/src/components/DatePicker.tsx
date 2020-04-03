import Calendar, { CalendarClassType, ArrowKeys } from '@atlaskit/calendar';
import pick from 'lodash.pick';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import Select, { mergeStyles } from '@atlaskit/select';
import styled from '@emotion/styled';
import {
  createLocalizationProvider,
  LocalizationProvider,
} from '@atlaskit/locale';
import { borderRadius, layers, gridSize } from '@atlaskit/theme/constants';
import { N20, B100 } from '@atlaskit/theme/colors';
import { e200 } from '@atlaskit/theme/elevation';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
  createAndFireEvent,
} from '@atlaskit/analytics-next';
// eslint-disable-next-line no-restricted-imports
import { format, isValid, parse, lastDayOfMonth } from 'date-fns';
import React, { CSSProperties } from 'react';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import {
  ClearIndicator,
  defaultDateFormat,
  padToTwo,
  placeholderDatetime,
} from '../internal';
import FixedLayer from '../internal/FixedLayer';
import { SelectProps, Appearance, Spacing } from '../types';

/* eslint-disable react/no-unused-prop-types */
export interface Props extends WithAnalyticsEventsProps {
  /** Defines the appearance which can be default or subtle - no borders, background or icon.
   * Appearance values will be ignored if styles are parsed via the selectProps.
   */
  appearance?: Appearance;
  /** Whether or not to auto-focus the field. */
  autoFocus: boolean;
  /** Default for `isOpen`. */
  defaultIsOpen: boolean;
  /** Default for `value`. */
  defaultValue: string;
  /** An array of ISO dates that should be disabled on the calendar. */
  disabled: string[];
  /** The icon to show in the field. */
  icon: React.ReactNode;
  /** The id of the field. Currently, react-select transforms this to have a "react-select-" prefix, and an "--input" suffix when applied to the input. For example, the id "my-input" would be transformed to "react-select-my-input--input". Keep this in mind when needing to refer to the ID. This will be fixed in an upcoming release. */
  id: string;
  /** Props to apply to the container. **/
  innerProps: React.AllHTMLAttributes<HTMLElement>;
  /** Whether or not the field is disabled. */
  isDisabled?: boolean;
  /** Whether or not the dropdown is open. */
  isOpen?: boolean;
  /** The name of the field. */
  name: string;
  /** Called when the field is blurred. */
  onBlur: React.FocusEventHandler<HTMLInputElement>;
  /** Called when the value changes. The only argument is an ISO time or empty string. */
  onChange: (value: string) => void;
  /** Called when the field is focused. */
  onFocus: React.FocusEventHandler<HTMLInputElement>;
  /** A function for parsing input characters and transforming them into a Date object. By default parses the date string based off the locale */
  parseInputValue?: (date: string, dateFormat: string) => Date;
  /** DEPRECATED - Use locale instead. A function for formatting the date displayed in the input. By default composes together [date-fn's parse method](https://date-fns.org/v1.29.0/docs/parse) and [date-fn's format method](https://date-fns.org/v1.29.0/docs/format) to return a correctly formatted date string*/
  formatDisplayLabel?: (value: string, dateFormat: string) => string;
  /** Props to apply to the select. This can be used to set options such as placeholder text.
   *  See [here](/packages/core/select) for documentation on select props. */
  selectProps: SelectProps;
  /* This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5  */
  spacing?: Spacing;
  /** The ISO time that should be used as the input value. */
  value?: string;
  /** Indicates current value is invalid & changes border color */
  isInvalid?: boolean;
  /** Hides icon for dropdown indicator. */
  hideIcon?: boolean;
  /** DEPRECATED - Use locale instead. Format the date with a string that is accepted by [date-fns's format function](https://date-fns.org/v1.29.0/docs/format). */
  dateFormat?: string;
  /** Placeholder text displayed in input */
  placeholder?: string;
  /** Locale used to format the the date and calendar. See [DateTimeFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/DateTimeFormat) */
  locale: string;

  /**
   * A `testId` prop is provided for specified elements, which is a unique string that appears as a data attribute `data-testid` in the rendered code, serving as a hook for automated tests
   *  - `{testId}--container` wrapping element of date-picker
   **/
  testId?: string;
}

interface State {
  isOpen: boolean;
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
  const date: Date = parse(iso);

  return isValid(date) ? getDateObj(date) : {};
}

const StyledMenu = styled.div`
  background-color: ${N20};
  border-radius: ${borderRadius()}px;
  z-index: ${layers.dialog};
  ${e200};
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
      <StyledMenu>
        <Calendar
          {...getValidDate(selectProps.calendarValue)}
          {...getValidDate(selectProps.calendarView)}
          disabled={selectProps.calendarDisabled}
          onChange={selectProps.onCalendarChange}
          onSelect={selectProps.onCalendarSelect}
          ref={selectProps.calendarRef}
          selected={[selectProps.calendarValue]}
          innerProps={innerProps}
          locale={selectProps.calendarLocale}
          testId={selectProps.testId}
        />
      </StyledMenu>
    }
  />
);

function noop() {}

class DatePicker extends React.Component<Props, State> {
  calendarRef: CalendarClassType | null = null;
  containerRef: HTMLElement | null = null;

  static defaultProps = {
    appearance: 'default' as Appearance,
    autoFocus: false,
    defaultIsOpen: false,
    defaultValue: '',
    disabled: [],
    hideIcon: false,
    icon: CalendarIcon,
    id: '',
    innerProps: {},
    isDisabled: false,
    isInvalid: false,
    name: '',
    onBlur: noop,
    onChange: noop,
    onFocus: noop,
    selectProps: {},
    spacing: 'default' as Spacing,
    locale: 'en-US',
    // Not including a default prop for value as it will
    // Make the component a controlled component
  };

  constructor(props: any) {
    super(props);

    const { day, month, year } = getDateObj(new Date());

    this.state = {
      isOpen: this.props.defaultIsOpen,
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

  componentWillReceiveProps(nextProps: Readonly<Props>): void {
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

    const parsedDate: number = parseInt(date, 10);
    const parsedMonth: number = parseInt(month, 10);
    const parsedYear: number = parseInt(year, 10);

    const lastDayInMonth: number = lastDayOfMonth(
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
    if (!this.getSafeState().isOpen) this.setState({ isOpen: true });
  };

  onSelectBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    this.setState({ isOpen: false });
    this.props.onBlur(event);
  };

  onSelectFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    const { value } = this.getSafeState();

    this.setState({
      isOpen: true,
      view: value,
    });

    this.props.onFocus(event);
  };

  onSelectInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value: string = event.target.value;

    if (value) {
      const parsed: Date | null = this.parseDate(value);
      // Only try to set the date if we have month & day
      if (parsed && isValid(parsed)) {
        // We format the parsed date to YYYY-MM-DD here because
        // this is the format expected by the @atlaskit/calendar component
        this.setState({ view: format(parsed, 'YYYY-MM-DD') });
      }
    }

    this.setState({ isOpen: true });
  };

  onSelectKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key, target } = event;
    const { view, selectedValue } = this.getSafeState();

    const keyPressed = key.toLowerCase();
    switch (keyPressed) {
      case 'arrowup':
      case 'arrowdown':
        if (this.calendarRef) {
          event.preventDefault();
          const key: ArrowKeys = keyPressed === 'arrowup' ? 'up' : 'down';
          this.calendarRef.navigate(key);
        }
        this.setState({ isOpen: true });
        break;
      case 'arrowleft':
      case 'arrowright':
        if (this.calendarRef) {
          event.preventDefault();
          const key: ArrowKeys = keyPressed === 'arrowleft' ? 'left' : 'right';
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
          target instanceof HTMLInputElement &&
          target.value.length < 1
        ) {
          this.setState({
            selectedValue: '',
            value: '',
            view: this.props.defaultValue || format(new Date(), 'YYYY-MM-DD'),
          });
          this.props.onChange('');
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

  refCalendar = (ref: CalendarClassType | null) => {
    this.calendarRef = ref;
  };

  handleInputChange = (inputValue: string, actionMeta: {}) => {
    const { onInputChange } = this.props.selectProps;
    if (onInputChange) onInputChange(inputValue, actionMeta);
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
  parseDate = (date: string): Date | null => {
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
  formatDate = (value: string): string => {
    const { formatDisplayLabel, dateFormat } = this.props;
    const { l10n } = this.getSafeState();

    if (formatDisplayLabel) {
      return formatDisplayLabel(value, dateFormat || defaultDateFormat);
    }

    const date = parse(value);
    if (dateFormat) {
      return format(date, dateFormat);
    }

    return l10n.formatDate(date);
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
      isInvalid,
      name,
      selectProps,
      spacing,
      locale,
      testId,
    } = this.props;
    const BORDER_WIDTH = 2;
    const ICON_PADDING = 2;

    const { value, view, isOpen, inputValue } = this.getSafeState();
    const dropDownIcon = appearance === 'subtle' || hideIcon ? null : icon;
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
      calendarValue: value,
      calendarView: view,
      onCalendarChange: this.onCalendarChange,
      onCalendarSelect: this.onCalendarSelect,
      calendarLocale: locale,
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
        <input name={name} type="hidden" value={value} />
        <Select
          menuIsOpen={isOpen && !isDisabled}
          openMenuOnFocus
          closeMenuOnSelect
          autoFocus={autoFocus}
          instanceId={id}
          isDisabled={isDisabled}
          onBlur={this.onSelectBlur}
          onFocus={this.onSelectFocus}
          inputValue={inputValue}
          onInputChange={this.handleInputChange}
          components={{
            ClearIndicator,
            DropdownIndicator: dropDownIcon,
            Menu,
          }}
          styles={mergeStyles(selectStyles, {
            control: base => ({
              ...base,
              ...controlStyles,
              ...disabledStyle,
            }),
            indicatorsContainer: base => ({
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
