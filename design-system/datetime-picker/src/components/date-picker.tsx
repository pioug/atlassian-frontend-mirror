/** @jsx jsx */
import { Component, CSSProperties } from 'react';

import { jsx } from '@emotion/react';
import { format, isValid, lastDayOfMonth, parseISO } from 'date-fns';
import pick from 'lodash/pick';

import {
  createAndFireEvent,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { CalendarRef } from '@atlaskit/calendar';
import CalendarIcon from '@atlaskit/icon/glyph/calendar';
import {
  createLocalizationProvider,
  LocalizationProvider,
} from '@atlaskit/locale';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import Select, {
  ActionMeta,
  DropdownIndicatorProps,
  InputActionMeta,
  mergeStyles,
  OptionType,
  ValueType,
} from '@atlaskit/select';
import { token } from '@atlaskit/tokens';

import {
  defaultDateFormat,
  EmptyComponent,
  padToTwo,
  placeholderDatetime,
} from '../internal';
import { Menu } from '../internal/menu';
import {
  getSafeCalendarValue,
  getShortISOString,
} from '../internal/parse-date';
import { convertTokens } from '../internal/parse-tokens';
import { makeSingleValue } from '../internal/single-value';
import { Appearance, DatePickerBaseProps, Spacing } from '../types';

const packageName = process.env._PACKAGE_NAME_ as string;
const packageVersion = process.env._PACKAGE_VERSION_ as string;

type DatePickerProps = typeof datePickerDefaultProps & DatePickerBaseProps;

interface State {
  isOpen: boolean;
  /**
   * When being cleared from the icon the DatePicker is blurred.
   * This variable defines whether the default onSelectBlur or onSelectFocus
   * events should behave as normal.
   */
  isFocused: boolean;
  clearingFromIcon: boolean;
  value: string;
  calendarValue: string;
  selectInputValue: string;
  l10n: LocalizationProvider;
  locale: string;
}

const datePickerDefaultProps = {
  appearance: 'default' as Appearance,
  autoFocus: false,
  defaultIsOpen: false,
  defaultValue: '',
  disabled: [] as string[],
  disabledDateFilter: (_: string) => false,
  hideIcon: false,
  icon: CalendarIcon as unknown as React.ComponentType<
    DropdownIndicatorProps<OptionType>
  >,
  id: '',
  innerProps: {},
  isDisabled: false,
  isInvalid: false,
  name: '',
  // These disables are here for proper typing when used as defaults. They
  // should *not* use the `noop` function.
  /* eslint-disable @repo/internal/react/use-noop */
  onBlur: (_event: React.FocusEvent<HTMLInputElement>) => {},
  onChange: (_value: string) => {},
  onFocus: (_event: React.FocusEvent<HTMLInputElement>) => {},
  /* eslint-enable @repo/internal/react/use-noop */
  selectProps: {},
  spacing: 'default' as Spacing,
  locale: 'en-US',
  // Not including a default prop for value as it will
  // Make the component a controlled component
};

class DatePicker extends Component<DatePickerProps, State> {
  static defaultProps = datePickerDefaultProps;
  calendarRef: CalendarRef | null = null;
  containerRef: HTMLElement | null = null;

  constructor(props: any) {
    super(props);

    this.state = {
      isOpen: this.props.defaultIsOpen,
      isFocused: false,
      clearingFromIcon: false,
      selectInputValue: this.props.selectProps.inputValue || '',
      value: this.props.value || this.props.defaultValue,
      calendarValue:
        this.props.value ||
        this.props.defaultValue ||
        getShortISOString(new Date()),
      l10n: createLocalizationProvider(this.props.locale),
      locale: this.props.locale,
    };
  }

  static getDerivedStateFromProps(
    nextProps: Readonly<DatePickerProps>,
    prevState: State,
  ) {
    if (nextProps.locale !== prevState.locale) {
      return {
        l10n: createLocalizationProvider(nextProps.locale),
        locale: nextProps.locale,
      };
    } else {
      return null;
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

    this.setState({ calendarValue: newIso });
  };

  onCalendarSelect = ({ iso }: { iso: string }) => {
    this.setState({
      selectInputValue: '',
      isOpen: false,
      calendarValue: iso,
      value: iso,
    });

    this.props.onChange(iso);
  };

  onInputClick = () => {
    if (!this.props.isDisabled && !this.getSafeState().isOpen) {
      this.setState({ isOpen: true });
    }
  };

  onContainerBlur = (event: React.FocusEvent<HTMLElement>) => {
    const newlyFocusedElement = event.relatedTarget as HTMLElement;

    if (!this.containerRef?.contains(newlyFocusedElement)) {
      this.setState({ isOpen: false });
    }
  };

  onSelectBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const newlyFocusedElement = event.relatedTarget as HTMLElement;

    if (this.getSafeState().clearingFromIcon) {
      // Don't close menu if blurring after the user has clicked clear
      this.setState({ clearingFromIcon: false });
    } else if (!this.containerRef?.contains(newlyFocusedElement)) {
      // Don't close menu if focus is staying within the date picker's
      // container. Makes keyboard accessibility of calendar possible
      this.setState({ isOpen: false, isFocused: false });
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
        calendarValue: value,
        isFocused: true,
      });
    }

    this.props.onFocus(event);
  };

  onTextInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;

    if (value) {
      const parsed = this.parseDate(value);
      // Only try to set the date if we have month & day
      if (parsed && isValid(parsed)) {
        // We format the parsed date to YYYY-MM-DD here because
        // this is the format expected by the @atlaskit/calendar component
        this.setState({ calendarValue: getShortISOString(parsed) });
      }
    }

    this.setState({ isOpen: true });
  };

  onInputKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const { value, calendarValue } = this.getSafeState();

    const keyPressed = event.key.toLowerCase();
    switch (keyPressed) {
      case 'escape':
        // Yes, this is not ideal. The alternative is to be able to place a ref
        // on the inner input of Select itself, which would require a lot of
        // extra stuff in the Select component for only this one thing. While
        // this would be more "React-y", it doesn't seem to pose any other
        // benefits. Performance-wise, we are only searching within the
        // container, so it's quick.
        const innerCombobox: HTMLInputElement | undefined | null =
          this.containerRef?.querySelector('[role="combobox"]');
        innerCombobox?.focus();
        this.setState({ isOpen: false });
        break;
      case 'backspace':
      case 'delete': {
        const inputCount = getBooleanFF(
          'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
        )
          ? 1
          : 0;

        if (
          value &&
          event.target instanceof HTMLInputElement &&
          event.target.value.length <= inputCount
        ) {
          // If being cleared from keyboard, don't change behaviour
          this.setState({ clearingFromIcon: false, value: '' });
        }
        break;
      }
      case 'enter':
        if (!this.state.isOpen) {
          return;
        }
        // Prevent form submission when a date is selected
        // using enter. See https://product-fabric.atlassian.net/browse/DSP-2501
        // for more details.
        event.preventDefault();
        if (!this.isDateDisabled(calendarValue)) {
          // Get a safe `calendarValue` in case the value exceeds the maximum
          // allowed by ISO 8601
          const safeCalendarValue = getSafeCalendarValue(calendarValue);
          const valueChanged = safeCalendarValue !== value;
          this.setState({
            selectInputValue: '',
            isOpen: false,
            value: safeCalendarValue,
            calendarValue: safeCalendarValue,
          });
          if (valueChanged) {
            this.props.onChange(safeCalendarValue);
          }
        }
        break;
      default:
        break;
    }
  };

  onClear = () => {
    let changedState: {} = {
      value: '',
      calendarValue: this.props.defaultValue || getShortISOString(new Date()),
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

  onSelectChange = (_value: ValueType<OptionType>, action: ActionMeta) => {
    // Used for native clear event in React Select
    // Triggered when clicking ClearIndicator or backspace with no value
    if (action.action === 'clear') {
      this.onClear();
    }
  };

  refCalendar = (ref: CalendarRef | null) => {
    this.calendarRef = ref;
  };

  handleSelectInputChange = (
    selectInputValue: string,
    actionMeta: InputActionMeta,
  ) => {
    const { onInputChange } = this.props.selectProps;
    if (onInputChange) {
      onInputChange(selectInputValue, actionMeta);
    }
    this.setState({ selectInputValue });
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

  /**
   * There are two props that can change how the date is parsed.
   * The priority of props used is:
   *   1. `parseInputValue`
   *   2. `locale`
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
   *   1. `formatDisplayLabel`
   *   2. `dateFormat`
   *   3. `locale`
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
      nextMonthLabel,
      previousMonthLabel,
      selectProps,
      spacing,
      locale,
      testId,
      weekStartDay,
    } = this.props;

    const { value, calendarValue, isOpen, selectInputValue } =
      this.getSafeState();

    let actualSelectInputValue;

    if (
      getBooleanFF(
        'platform.design-system-team.date-picker-input-a11y-fix_cbbxs',
      )
    ) {
      actualSelectInputValue =
        selectInputValue || (value ? this.formatDate(value) : undefined);
    } else {
      actualSelectInputValue = selectInputValue;
    }

    const menuIsOpen = isOpen && !isDisabled;

    const showClearIndicator = Boolean(
      (value || selectInputValue) && !hideIcon,
    );

    const dropDownIcon =
      appearance === 'subtle' || hideIcon || showClearIndicator ? null : icon;

    const SingleValue = makeSingleValue({ lang: this.props.locale });

    const selectComponents = {
      DropdownIndicator: dropDownIcon,
      Menu,
      SingleValue,
      ...(!showClearIndicator && { ClearIndicator: EmptyComponent }),
    };

    const { styles: selectStyles = {} } = selectProps;
    const disabledStyle: CSSProperties = isDisabled
      ? {
          pointerEvents: 'none',
          color: token('color.icon.disabled', 'inherit'),
        }
      : {};

    const calendarProps = {
      calendarContainerRef: this.containerRef,
      calendarRef: this.refCalendar,
      calendarDisabled: disabled,
      calendarDisabledDateFilter: disabledDateFilter,
      calendarMaxDate: maxDate,
      calendarMinDate: minDate,
      calendarValue: value && getShortISOString(parseISO(value)),
      calendarView: calendarValue,
      onCalendarChange: this.onCalendarChange,
      onCalendarSelect: this.onCalendarSelect,
      calendarLocale: locale,
      calendarWeekStartDay: weekStartDay,
      nextMonthLabel,
      previousMonthLabel,
    };

    return (
      // These event handlers must be on this element because the events come
      // from different child elements.
      <div
        {...innerProps}
        role="presentation"
        onBlur={this.onContainerBlur}
        onClick={this.onInputClick}
        onInput={this.onTextInput}
        onKeyDown={this.onInputKeyDown}
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
          appearance={this.props.appearance}
          enableAnimation={false}
          menuIsOpen={menuIsOpen}
          closeMenuOnSelect
          autoFocus={autoFocus}
          inputId={id}
          isDisabled={isDisabled}
          onBlur={this.onSelectBlur}
          onFocus={this.onSelectFocus}
          inputValue={actualSelectInputValue}
          onInputChange={this.handleSelectInputChange}
          components={selectComponents}
          onChange={this.onSelectChange}
          styles={mergeStyles(selectStyles, {
            control: (base: any) => ({
              ...base,
              ...disabledStyle,
            }),
            indicatorsContainer: (base) => ({
              ...base,
              paddingLeft: token('space.025', '2px'), // ICON_PADDING = 2
              paddingRight: token('space.075', '6px'), // 8 - ICON_PADDING = 6
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
          isInvalid={isInvalid}
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
