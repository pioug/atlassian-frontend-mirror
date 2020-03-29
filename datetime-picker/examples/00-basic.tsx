import React from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

interface Props {
  initialValue?: string;
  initialIsOpen?: boolean;
  children: (value: {
    value: string;
    onValueChange: (value: string) => void;
    isOpen: boolean;
    onBlur: () => void;
  }) => React.ReactNode;
}

interface State {
  value: string;
  isOpen: boolean;
}

class Controlled extends React.Component<Props, State> {
  state: State;

  recentlySelected: boolean = false;
  recSelTimeoutId: number | null = null;

  constructor(props: Props) {
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

const onChange = (value: unknown) => {
  console.log(value);
};

export default () => {
  return (
    <div>
      <h3>Date picker</h3>
      <Label htmlFor="react-select-datepicker-1--input" label="default" />
      <DatePicker id="datepicker-1" onChange={onChange} />

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
      />

      <h3>Time picker</h3>
      <Label htmlFor="react-select-timepicker-1--input" label="default" />
      <TimePicker
        id="timepicker-1"
        onChange={onChange}
        selectProps={{ classNamePrefix: 'timepicker-select' }}
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
      />

      <h3>Date / time picker</h3>
      <Label htmlFor="react-select-datetimepicker-1--input" label="default" />
      <DateTimePicker
        id="datetimepicker-1"
        onChange={onChange}
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
      />
    </div>
  );
};
