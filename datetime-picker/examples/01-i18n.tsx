import React from 'react';
import { Label } from '@atlaskit/field-base';
import LocaleSelect, { Locale } from '@atlaskit/locale/LocaleSelect';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

interface ControlledState {
  value: string;
  isOpen: boolean;
}

interface ControlledProps {
  initialValue?: string;
  initialIsOpen?: boolean;
  children: (value: {
    value: string;
    onValueChange: (value: string) => void;
    isOpen: boolean;
    onBlur: () => void;
  }) => React.ReactNode;
}

class Controlled extends React.Component<ControlledProps, ControlledState> {
  state: ControlledState;
  recentlySelected: boolean = false;
  recSelTimeoutId: number | null = null;

  constructor(props: ControlledProps) {
    super(props);
    this.state = {
      value: props.initialValue || '',
      isOpen: props.initialIsOpen || false,
    };
  }

  componentWillUnmount() {
    if (this.recSelTimeoutId != null) {
      clearTimeout(this.recSelTimeoutId);
      this.recSelTimeoutId = null;
    }
  }

  handleClick = () => {
    if (!this.recentlySelected) {
      this.setState({ isOpen: true });
    }
  };

  onValueChange = (value: string) => {
    console.log(value);
    this.recentlySelected = true;
    this.setState(
      {
        value,
        isOpen: false,
      },
      () => {
        this.recSelTimeoutId = window.setTimeout(() => {
          this.recSelTimeoutId = null;
          this.recentlySelected = false;
        }, 200);
      },
    );
  };

  onBlur = () => {
    this.setState({
      isOpen: false,
    });
  };

  onFocus = () => {
    this.setState({
      isOpen: false,
    });
  };

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div onClick={this.handleClick}>
        {this.props.children({
          value: this.state.value,
          onValueChange: this.onValueChange,
          isOpen: this.state.isOpen,
          onBlur: this.onBlur,
        })}
      </div>
    );
  }
}

const onChange = (value: string) => {
  console.log(value);
};

interface IntlState {
  locale: string;
}

export default class extends React.Component<Object, IntlState> {
  state = {
    locale: 'ja-JP',
  };

  onLocaleChange = (locale: Locale) => this.setState({ locale: locale.value });

  render() {
    const { locale } = this.state;
    return (
      <div>
        <LocaleSelect
          onLocaleChange={this.onLocaleChange}
          defaultLocale={{ value: 'ja-JP', label: '日本語 (日本)' }}
        />
        <h3>Date picker</h3>
        <Label htmlFor="react-select-datepicker-1--input" label="default" />
        <DatePicker
          id="datepicker-1"
          onChange={onChange}
          locale={locale}
          testId={'datePicker'}
        />

        <Label
          htmlFor="react-select-datepicker-2--input"
          label="controlled (value)"
        />
        <Controlled initialValue="2018-01-02">
          {({ value, onValueChange, onBlur }) => (
            <DatePicker
              id="datepicker-2"
              value={value}
              onChange={onValueChange}
              onBlur={onBlur}
              locale={locale}
            />
          )}
        </Controlled>

        <Label
          htmlFor="react-select-datepicker-3--input"
          label="uncontrolled (defaultValue)"
        />
        <DatePicker
          id="datepicker-3"
          defaultValue="2018-01-02"
          onChange={onChange}
          locale={locale}
        />

        <h3>Time picker</h3>
        <Label htmlFor="react-select-timepicker-1--input" label="default" />
        <TimePicker
          id="timepicker-1"
          onChange={onChange}
          selectProps={{ classNamePrefix: 'timepicker-select' }}
          locale={locale}
        />

        <Label
          htmlFor="react-select-timepicker-2--input"
          label="controlled (value, isOpen)"
        />
        <Controlled initialValue="14:30">
          {({ value, onValueChange, isOpen, onBlur }) => (
            <TimePicker
              selectProps={{ classNamePrefix: 'timepicker-select' }}
              id="timepicker-2"
              value={value}
              onChange={onValueChange}
              onBlur={onBlur}
              isOpen={isOpen}
              locale={locale}
            />
          )}
        </Controlled>

        <Label
          htmlFor="react-select-timepicker-3--input"
          label="uncontrolled (defaultValue)"
        />
        <TimePicker
          selectProps={{ classNamePrefix: 'timepicker-select' }}
          id="timepicker-3"
          defaultValue="14:30"
          onChange={onChange}
          locale={locale}
        />

        <Label
          htmlFor="react-select-timepicker-4--input"
          label="editable times"
        />
        <TimePicker
          selectProps={{ classNamePrefix: 'timepicker-select' }}
          id="timepicker-4"
          defaultValue="14:30"
          onChange={onChange}
          timeIsEditable
          locale={locale}
          testId={'timePicker'}
        />

        <h3>Date / time picker</h3>
        <Label htmlFor="react-select-datetimepicker-1--input" label="default" />
        <DateTimePicker
          id="datetimepicker-1"
          onChange={onChange}
          locale={locale}
          testId={'dateTimePicker'}
        />

        <Label
          htmlFor="react-select-datetimepicker-2--input"
          label="controlled (UTC-08:00)"
        />
        <Controlled initialValue="2018-01-02T14:30-08:00">
          {({ value, onValueChange }) => (
            <DateTimePicker
              id="datetimepicker-2"
              value={value}
              onChange={onValueChange}
              locale={locale}
            />
          )}
        </Controlled>

        <Label
          htmlFor="react-select-datetimepicker-3--input"
          label="uncontrolled (UTC+10:00)"
        />
        <DateTimePicker
          id="datetimepicker-3"
          defaultValue="2018-01-02T14:30+10:00"
          onChange={onChange}
          locale={locale}
        />

        <Label
          htmlFor="react-select-datetimepicker-4--input"
          label="editable times (UTC+10:00)"
        />
        <DateTimePicker
          id="datetimepicker-4"
          defaultValue="2018-01-02T14:30+10:00"
          onChange={onChange}
          timeIsEditable
          locale={locale}
        />
      </div>
    );
  }
}
