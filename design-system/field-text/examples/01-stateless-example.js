import React, { Component } from 'react';
import { FieldTextStateless } from '../src';

export default class StatelessExample extends Component {
  state = {
    value: '',
  };

  // eslint-disable-next-line no-undef
  setValue = (e) => this.setState({ value: e.target.value });

  render() {
    return (
      <FieldTextStateless
        label="Stateless Text Input Example"
        onChange={this.setValue}
        value={this.state.value}
      />
    );
  }
}
