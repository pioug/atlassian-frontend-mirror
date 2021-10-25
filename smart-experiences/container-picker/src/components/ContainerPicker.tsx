import React from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import memoizeOne from 'memoize-one';
// eslint-disable-next-line import/no-extraneous-dependencies
import debounce from 'lodash/debounce';
// eslint-disable-next-line import/no-extraneous-dependencies

import Select, { FormatOptionLabelMeta, ValueType } from '@atlaskit/select';
import {
  WithAnalyticsEventsProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';

import { client } from '../service';
import ContainerMenuItem from './DefaultContainerMenuItem';
import {
  ContainerPickerProps,
  ContainerPickerState as State,
  ContainerOption,
  ContainerPickerState,
  ContainerOptionValue,
  OptionToSelectableOptions,
  SearchContext,
  AtlasKitSelectChange,
  Value,
} from '../types';
import {
  EventCreator,
  createAndFireEventInElementsChannel,
  Session,
  startSession,
  getSessionId,
  focusEvent,
  selectEvent,
  cancelEvent,
  searchedEvent,
  requestContainersEvent,
  successfulRequestContainersEvent,
  failedRequestContainersEvent,
} from '../analytics';

type Props = ContainerPickerProps & WithAnalyticsEventsProps;

const MAX_REQUEST_OPTIONS = 100;

const optionToSelectableOption = (
  option: ContainerOptionValue,
): ContainerOption => ({
  label: option.name,
  value: option,
});

const optionToSelectableOptions = memoizeOne((defaultValue: Value) => {
  if (!defaultValue) {
    return null;
  }
  if (Array.isArray(defaultValue)) {
    return defaultValue.map(optionToSelectableOption);
  }
  return optionToSelectableOption(defaultValue);
}) as OptionToSelectableOptions;

export class ContainerPickerWithoutAnalytics extends React.Component<
  Props,
  State
> {
  state: State = {
    error: false,
    inputValue: '',
    loading: false,
    menuIsOpen: false,
    options: [],
  };

  static defaultProps = {
    isMulti: false,
    maxOptions: 30,
    principalId: 'Context',
    maxRequestOptions: MAX_REQUEST_OPTIONS,
  };

  private session?: Session;

  private journeyId?: string;

  static getDerivedStateFromProps(nextProps: Partial<ContainerPickerProps>) {
    const derivedState: Partial<ContainerPickerState> = {};
    if (nextProps.value !== undefined) {
      derivedState.value = optionToSelectableOptions(nextProps.value);
    }

    return derivedState;
  }

  componentDidUpdate(_: ContainerPickerProps, prevState: ContainerPickerState) {
    const { menuIsOpen, options } = this.state;
    // load options when the picker open
    if (menuIsOpen && !prevState.menuIsOpen) {
      if (!this.session) {
        // session should have been created onFocus
        this.startSession();
      }
    }

    if (!menuIsOpen && prevState.menuIsOpen && this.session) {
      this.fireEvent(cancelEvent, prevState);
      this.session = startSession();
      this.journeyId = this.session.id;
      // this.session = undefined;
    }

    if (
      menuIsOpen &&
      ((!prevState.menuIsOpen && options.length > 0) ||
        options.length !== prevState.options.length)
    ) {
      this.fireEvent(searchedEvent);
    }
  }

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
    this.journeyId = this.session.id;
    this.fireEvent(focusEvent);
  };

  loadContainers = async (query: string) => {
    const {
      cloudId,
      product,
      baseUrl,
      contextType,
      maxRequestOptions,
    } = this.props;
    const sessionId = getSessionId(this.session);
    const context: SearchContext = {
      cloudId,
      sessionId,
      baseUrl,
    };
    const startTime = window.performance.now();
    try {
      this.fireEvent(requestContainersEvent);
      const containers = await client(
        product,
        context,
        contextType,
        maxRequestOptions || MAX_REQUEST_OPTIONS,
        query,
      );
      // prevent race condition
      if (sessionId === getSessionId(this.session)) {
        this.setState({ options: containers, loading: false });
      }
      const elapsedTimeMilli = window.performance.now() - startTime;
      this.fireEvent(successfulRequestContainersEvent, { elapsedTimeMilli });
    } catch (e) {
      if (context.sessionId === getSessionId(this.session)) {
        this.setState({ options: [], loading: false });
      }
      const elapsedTimeMilli = window.performance.now() - startTime;
      this.fireEvent(failedRequestContainersEvent, { elapsedTimeMilli });
    }
  };

  debouncedLoadContainers = debounce(
    this.loadContainers,
    this.props.debounceTime || 0,
  );

  private resetInputState = () => {
    this.setState({
      inputValue: '',
    });
  };

  handleChange: AtlasKitSelectChange = (value, { action, option }) => {
    this.resetInputState();
    const { isMulti } = this.props;
    if (action === 'select-option') {
      this.fireEvent(selectEvent, isMulti ? option : value);
      if (isMulti) {
        this.session = startSession();
        this.fireEvent(searchedEvent);
      }
    }
    if (!this.props.value) {
      this.setState({ value });
    }
  };

  handleFocus = () => {
    const { menuIsOpen, options } = this.state;
    if (!menuIsOpen && !this.session) {
      // && !this.session
      this.startSession();
    }
    if (options.length === 0) {
      this.setState({
        loading: true,
      });
      this.debouncedLoadContainers('');
    }
    this.setState({ menuIsOpen: true });
  };

  handleBlur = () => {
    this.resetInputState();
    this.debouncedLoadContainers.cancel();
    const options =
      this.state.inputValue.length === 0 ? this.state.options : [];
    this.setState({ loading: false, menuIsOpen: false, options });
  };

  onInputChange = (query: string) => {
    if (query !== this.state.inputValue) {
      this.setState({ loading: true, inputValue: query });
      this.debouncedLoadContainers(query);
    }
  };

  formatOptionLabel = (
    container: ContainerOption,
    context: FormatOptionLabelMeta<ContainerOption>,
  ): React.ReactNode => {
    if (this.props.formatOptionLabel) {
      return this.props.formatOptionLabel(container, context);
    }
    return <ContainerMenuItem {...container} />;
  };

  getOptionValue = (option: ContainerOption): string => option.value.id;

  getOptions = (): ContainerOption[] => {
    const options = this.state.options || [];
    const { maxOptions, isMulti } = this.props;
    const { value } = this.state;
    let filteredOptions = options;
    // Filter out previously selected options
    if (isMulti && Array.isArray(value)) {
      const valueIds: string[] = value.map((item) => item.value.id);
      filteredOptions = options.filter(
        (option) => valueIds.indexOf(option.value.id) === -1,
      );
    }
    if (!isMulti && value) {
      filteredOptions = options.filter(
        (option) => option.value.id === (value as ContainerOption).value.id,
      );
    }
    return filteredOptions.slice(0, maxOptions);
  };

  render() {
    const { inputValue, menuIsOpen, value } = this.state;
    const { isMulti, isLoading } = this.props;
    return (
      <Select
        backspaceRemovesValue={isMulti}
        blurInputOnSelect={!isMulti}
        className="multi-select"
        classNamePrefix="react-select"
        closeMenuOnSelect={!isMulti}
        enableAnimation={isMulti}
        formatOptionLabel={this.formatOptionLabel}
        getOptionValue={this.getOptionValue}
        hideSelectedOptions
        inputValue={inputValue}
        isClearable
        isLoading={isLoading || this.state.loading}
        isMulti={isMulti as false}
        isSearchable
        isFocused={menuIsOpen}
        menuIsOpen={menuIsOpen}
        onInputChange={this.onInputChange}
        onChange={this.handleChange}
        onFocus={this.handleFocus}
        onBlur={this.handleBlur}
        onClose={this.handleBlur}
        options={this.getOptions()}
        placeholder="Choose a Container"
        value={value as ValueType<ContainerOption, false>}
      />
    );
  }
}

export const ContainerPicker = withAnalyticsEvents()(
  ContainerPickerWithoutAnalytics,
);
