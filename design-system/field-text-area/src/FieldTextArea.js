/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import FieldTextAreaStateless from './FieldTextAreaStateless';

export default class FieldTextArea extends Component {
  input; // eslint-disable-line react/sort-comp

  static defaultProps = {
    onChange: () => {},
    enableResize: false,
  };

  state = {
    value: this.props.value,
  };

  handleOnChange = (e) => {
    this.setState({ value: e.target.value });
    if (this.props.onChange) this.props.onChange(e);
  };

  focus = () => {
    this.input.focus();
  };

  render() {
    return (
      <FieldTextAreaStateless
        {...this.props}
        value={this.state.value}
        onChange={this.handleOnChange}
        ref={(fieldRef) => {
          this.input = fieldRef;
        }}
      />
    );
  }
}
