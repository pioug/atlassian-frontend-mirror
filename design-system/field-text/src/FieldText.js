/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import FieldTextStateless from './FieldTextStateless';

export default class FieldText extends Component {
  static defaultProps = {
    onChange: () => {},
  };

  input;

  focus() {
    if (this.input) {
      this.input.focus();
    }
  }

  state = {
    value: this.props.value,
  };

  handleOnChange = (e) => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) {
      this.props.onChange(e);
    }
  };

  render() {
    return (
      <FieldTextStateless
        {...this.props}
        value={this.state.value}
        onChange={this.handleOnChange}
        innerRef={(fieldRef) => {
          this.input = fieldRef;
        }}
      />
    );
  }
}
