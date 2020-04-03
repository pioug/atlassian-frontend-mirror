import React, { Component } from 'react';
import Calendar from '../src';

const log = (msg: string) => (e: any) => console.log(msg, e);

interface State {
  disabled: string[];
  previouslySelected: string[];
  selected: string[];
  day: number;
  month: number;
  year: number;
}

interface DateObj {
  day: number;
  month: number;
  year: number;
}

export default class ControlledCalendar extends Component<{}, State> {
  state = {
    disabled: ['2020-12-04'],
    previouslySelected: ['2020-12-06'],
    selected: ['2020-12-08'],
    day: 1,
    month: 12,
    year: 2020,
  };

  handleSelect = (selectedDate: { iso: string }) => {
    this.setState({
      previouslySelected: this.state.selected,
      selected: [selectedDate.iso],
    });
  };

  handleChange = (changedDate: DateObj) => {
    const { day, month, year } = changedDate;
    this.setState({
      day,
      month,
      year,
    });
  };

  render() {
    return (
      <Calendar
        disabled={this.state.disabled}
        previouslySelected={this.state.previouslySelected}
        selected={this.state.selected}
        day={this.state.day}
        month={this.state.month}
        year={this.state.year}
        innerProps={{
          style: {
            border: '1px solid red',
            display: 'inline-block',
          },
        }}
        onBlur={() => log('blur')}
        onChange={this.handleChange}
        onFocus={() => log('focus')}
        onSelect={this.handleSelect}
      />
    );
  }
}
