import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import debounce from 'lodash/debounce';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  cancelEvent,
  clearEvent,
  createAndFireEventInElementsChannel,
  deleteEvent,
  EventCreator,
  failedEvent,
  focusEvent,
  searchedEvent,
  selectEvent,
  startSession,
  UserPickerSession,
} from '../analytics';
import {
  Appearance,
  AtlasKitSelectChange,
  InputActionTypes,
  Option,
  OptionData,
  UserPickerProps,
  UserPickerState,
} from '../types';
import { batchByKey } from './batch';
import { messages } from './i18n';
import {
  callCallback,
  extractOptionValue,
  getOptions,
  isIterable,
  isPopupUserPickerByComponent,
  isSingleValue,
  optionToSelectableOptions,
} from './utils';

export type BaseUserPickerProps = UserPickerProps & {
  SelectComponent: React.ComponentClass<any>;
  pickerProps?: any;
  styles: any;
  components: any;
  width: string | number;
};

const loadingMessage = () => null;

export class BaseUserPickerWithoutAnalytics extends React.Component<
  BaseUserPickerProps,
  UserPickerState
> {
  static defaultProps = {
    isMulti: false,
    subtle: false,
    noBorder: false,
    textFieldBackgroundColor: false,
    isClearable: true,
  };

  static getDerivedStateFromProps(
    nextProps: Partial<UserPickerProps>,
    prevState: UserPickerState,
  ) {
    const derivedState: Partial<UserPickerState> = {};
    if (nextProps.open !== undefined) {
      derivedState.menuIsOpen = nextProps.open;
    }
    if (nextProps.value !== undefined) {
      derivedState.value = optionToSelectableOptions(nextProps.value);
    } else if (
      nextProps.defaultValue &&
      Array.isArray(nextProps.defaultValue) &&
      nextProps.defaultValue.length > 0 &&
      !prevState.isDefaultSet
    ) {
      derivedState.value = optionToSelectableOptions(nextProps.defaultValue);
      derivedState.isDefaultSet = true;
    }
    if (
      nextProps.search !== undefined &&
      nextProps.search !== prevState.inputValue
    ) {
      derivedState.inputValue = nextProps.search;
    }

    if (nextProps.options !== undefined) {
      derivedState.options = nextProps.options;
    }

    return derivedState;
  }

  private selectRef: any | null;

  private session?: UserPickerSession;

  // session id for focus to blur
  private journeyId?: string;

  constructor(props: BaseUserPickerProps) {
    super(props);
    this.state = {
      options: [],
      isDefaultSet: false,
      inflightRequest: 0,
      count: 0,
      hoveringClearIndicator: false,
      menuIsOpen: !!this.props.open,
      inputValue: props.search || '',
      resolving: false,
    };
  }

  private getSessionId = () =>
    this.session && this.session.id ? this.session.id : undefined;

  private withSelectRef = (callback: (selectRef: any) => void) => () => {
    if (this.selectRef) {
      callback(this.selectRef.select.select);
    }
  };

  public nextOption = this.withSelectRef((select) =>
    select.focusOption('down'),
  );

  public previousOption = this.withSelectRef((select) =>
    select.focusOption('up'),
  );

  public focus = () => {
    if (this.selectRef && this.selectRef.focus) {
      this.selectRef.focus();
    }
  };

  public blur = () => {
    if (this.selectRef && this.selectRef.blur) {
      this.selectRef.blur();
    }
  };

  public selectOption = this.withSelectRef((select) => {
    const focusedOption = select.state.focusedOption;
    select.selectOption(focusedOption);
  });

  // value = null if user deletes the last item in the user picker
  private handleChange: AtlasKitSelectChange = (
    value,
    { action, removedValue, option },
  ) => {
    if (removedValue && removedValue.data.fixed) {
      return;
    }
    this.resetInputState();
    const { onChange, onSelection, onClear, isMulti } = this.props;
    callCallback(onChange, extractOptionValue(value), action);

    switch (action) {
      case 'select-option':
        if (value && !Array.isArray(value)) {
          callCallback(onSelection, value.data, this.getSessionId());
        }
        this.fireEvent(selectEvent, isMulti ? option : value);
        this.session = isMulti ? startSession() : undefined;
        break;
      case 'clear':
        callCallback(onClear);
        this.fireEvent(clearEvent);
        break;
      case 'remove-value':
      case 'pop-value':
        if (removedValue) {
          this.fireEvent(deleteEvent, removedValue.data);
        }
        break;
    }
    this.fireEvent(searchedEvent);

    if (removedValue && this.state.value && Array.isArray(this.state.value)) {
      const remainingValues = this.state.value.filter(
        (val: Option) => val.data.id !== removedValue.data.id,
      );
      this.setState({ value: remainingValues ? remainingValues : [] });
    }

    if (!this.props.value) {
      this.setState({ value: value ? value : [] });
    }
  };

  private handleSelectRef = (ref: any | null) => {
    this.selectRef = ref;
  };

  private addOptions = batchByKey(
    (request: string, newOptions: (OptionData | OptionData[])[]) => {
      const { resolving } = this.state;

      this.setState(({ inflightRequest, options, count }) => {
        if (inflightRequest.toString() === request) {
          return {
            options: (resolving ? options : []).concat(
              newOptions.reduce<OptionData[]>(
                (nextOptions, item) =>
                  Array.isArray(item)
                    ? nextOptions.concat(item[0])
                    : nextOptions.concat(item),
                [],
              ),
            ),
            count: count - newOptions.length,
            resolving: count - newOptions.length !== 0,
          };
        }
        return null;
      });
    },
  );

  private handleLoadOptionsError = () => {
    const { count } = this.state;
    const newCount = count - 1;
    this.setState({
      count: newCount,
      resolving: newCount !== 0,
    });
    this.fireEvent(failedEvent);
  };

  private debouncedLoadOptions = debounce((search?: string) => {
    const { loadOptions } = this.props;
    if (loadOptions) {
      this.setState(({ inflightRequest: previousRequest }) => {
        const inflightRequest = previousRequest + 1;
        const result =
          this.session && this.session.id
            ? loadOptions(search, this.session.id)
            : loadOptions(search);
        const addOptions = this.addOptions.bind(
          this,
          inflightRequest.toString(),
        ) as (value: OptionData | OptionData[]) => void | PromiseLike<void>;
        let count = 0;
        if (isIterable(result)) {
          for (const value of result) {
            Promise.resolve(value)
              .then(addOptions)
              .catch(this.handleLoadOptionsError);
            count++;
          }
        } else {
          Promise.resolve(result)
            .then(addOptions)
            .catch(this.handleLoadOptionsError);
          count++;
        }
        return {
          inflightRequest,
          count,
          resolving: count !== 0,
          options: [],
        };
      });
    }
  }, 200);

  private executeLoadOptions = (search?: string) => {
    const { loadOptions } = this.props;
    if (loadOptions) {
      this.setState({ resolving: true }, () =>
        this.debouncedLoadOptions(search),
      );
    }
  };

  private handleFocus = (event: React.FocusEvent) => {
    const { value, menuIsOpen } = this.state;
    if (!menuIsOpen || !this.session) {
      this.startSession();
    }
    callCallback(this.props.onFocus, this.getSessionId());
    this.setState({ menuIsOpen: true });
    if (!this.props.isMulti && isSingleValue(value)) {
      const input = event.target;
      this.setState({ inputValue: value.label }, () => {
        if (input instanceof HTMLInputElement) {
          input.select();
        }
      });
    }
  };

  private resetInputState = () => {
    // Prevent filter if query typed, then blurred with no selection
    this.setState({
      inputValue: '',
    });
    callCallback(this.props.onInputChange, '', this.getSessionId());
  };

  private handleBlur = () => {
    callCallback(this.props.onBlur, this.getSessionId());
    if (isPopupUserPickerByComponent(this.props.SelectComponent)) {
      return;
    }
    this.resetInputState();
    this.setState({
      menuIsOpen: false,
      options: [],
    });
  };

  private handleClose = () => {
    this.resetInputState();
    callCallback(this.props.onClose, this.getSessionId());
    this.setState({
      menuIsOpen: false,
      options: [],
    });
  };

  private handleInputChange = (
    search: string,
    { action }: { action: InputActionTypes },
  ) => {
    if (action === 'input-change' || action === 'set-value') {
      callCallback(this.props.onInputChange, search, this.getSessionId());
      this.setState({ inputValue: search });

      this.executeLoadOptions(search);
    }
  };

  private fireEvent = (eventCreator: EventCreator, ...args: any[]) => {
    const { createAnalyticsEvent } = this.props;
    if (createAnalyticsEvent) {
      createAndFireEventInElementsChannel(
        eventCreator(
          this.props,
          this.state,
          this.session,
          this.journeyId,
          ...args,
        ),
      )(createAnalyticsEvent);
    }
  };

  private startSession = () => {
    this.session = startSession();
    this.journeyId = this.getSessionId();
    this.fireEvent(focusEvent);
  };

  componentDidMount() {
    const { open, search } = this.props;
    // load options when the picker open
    if (open) {
      if (!this.session) {
        this.startSession();
      }
      this.executeLoadOptions(search);
    }
  }

  componentDidUpdate(_: UserPickerProps, prevState: UserPickerState) {
    const { menuIsOpen, options } = this.state;
    // load options when the picker open
    if (menuIsOpen && !prevState.menuIsOpen) {
      if (!this.session) {
        // session should have been created onFocus
        this.startSession();
      }
      this.executeLoadOptions();
    }

    if (!menuIsOpen && prevState.menuIsOpen && this.session) {
      this.fireEvent(cancelEvent, prevState);
      this.session = undefined;
    }

    if (
      menuIsOpen &&
      ((!prevState.menuIsOpen && options.length > 0) ||
        options.length !== prevState.options.length)
    ) {
      this.fireEvent(searchedEvent);
    }

    if (this.state.inputValue !== prevState.inputValue) {
      if (this.session) {
        this.session.inputChangeTime = Date.now();
      }
    }
  }

  private handleKeyDown = (event: React.KeyboardEvent) => {
    // Escape
    if (event.keyCode === 27) {
      this.blur();
    }

    // Space
    if (event.keyCode === 32 && !this.state.inputValue) {
      event.preventDefault();
      this.setState({ inputValue: ' ' });
    }

    if (this.session) {
      this.session.lastKey = event.keyCode;
      switch (event.keyCode) {
        // KeyUp 38
        case 38:
          this.session.upCount++;
          break;
        // KeyDown 40
        case 40:
          this.session.downCount++;
          break;
      }
    }
  };

  handleClearIndicatorHover = (hoveringClearIndicator: boolean) => {
    this.setState({ hoveringClearIndicator });
  };

  private getOptions = (): Option[] => {
    const options = getOptions(this.state.options) || [];
    const { maxOptions, isMulti } = this.props;
    if (maxOptions === 0) {
      return [];
    }
    if (maxOptions && maxOptions > 0 && maxOptions < options.length) {
      const { value } = this.state;
      let filteredOptions = options;
      // Filter out previously selected options
      if (isMulti && Array.isArray(value)) {
        const valueIds: string[] = value.map((item) => item.data.id);
        filteredOptions = options.filter(
          (option) => valueIds.indexOf(option.data.id) === -1,
        );
      }
      return filteredOptions.slice(0, maxOptions);
    }

    return options;
  };

  private getAppearance = (): Appearance =>
    this.props.appearance ? this.props.appearance : 'normal';

  render() {
    const {
      isMulti,
      isLoading,
      subtle,
      noBorder,
      placeholder,
      isClearable,
      isDisabled,
      clearValueLabel,
      menuMinWidth,
      menuPortalTarget,
      addMoreMessage,
      noOptionsMessage,
      disableInput,
      components,
      pickerProps,
      SelectComponent,
      styles,
      autoFocus,
      fieldId,
      inputId,
      maxPickerHeight,
      textFieldBackgroundColor,
    } = this.props;

    const {
      count,
      hoveringClearIndicator,
      menuIsOpen,
      value,
      inputValue,
      resolving,
    } = this.state;
    const appearance = this.getAppearance();

    return (
      <SelectComponent
        value={value}
        autoFocus={autoFocus !== undefined ? autoFocus : menuIsOpen}
        ref={this.handleSelectRef}
        isMulti={isMulti}
        options={this.getOptions()}
        styles={styles}
        enableAnimation={isMulti}
        components={components}
        inputValue={inputValue}
        menuIsOpen={menuIsOpen}
        isLoading={count > 0 || resolving || isLoading}
        loadingMessage={loadingMessage}
        menuPlacement="auto"
        placeholder={
          placeholder ?? <FormattedMessage {...messages.placeholder} />
        }
        addMoreMessage={addMoreMessage}
        classNamePrefix="fabric-user-picker"
        hoveringClearIndicator={hoveringClearIndicator}
        appearance={appearance}
        isClearable={isClearable}
        noBorder={noBorder}
        subtle={subtle}
        blurInputOnSelect={!isMulti}
        closeMenuOnSelect={!isMulti}
        noOptionsMessage={noOptionsMessage}
        openMenuOnFocus
        isDisabled={isDisabled}
        isFocused={menuIsOpen}
        backspaceRemovesValue={isMulti}
        filterOption={null} // disable local filtering
        clearValueLabel={clearValueLabel}
        menuMinWidth={menuMinWidth}
        menuPortalTarget={menuPortalTarget}
        disableInput={disableInput || isDisabled}
        instanceId={fieldId}
        inputId={inputId}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClose={this.handleClose}
        onInputChange={this.handleInputChange}
        onClearIndicatorHover={this.handleClearIndicatorHover}
        onKeyDown={this.handleKeyDown}
        maxPickerHeight={maxPickerHeight}
        textFieldBackgroundColor={textFieldBackgroundColor}
        {...pickerProps}
      />
    );
  }
}

export const BaseUserPicker = withAnalyticsEvents()(
  BaseUserPickerWithoutAnalytics,
);
