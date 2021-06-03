import React, { Component } from 'react';
import { FieldTextStateless } from '../src';

export default class StatelessExample extends Component {
  state = {
    value: '',
  };

  setValue = (e) => this.setState({ value: e.target.value });

  render() {
    return (
      <div>
        <p>The field should not break outside the coloured flex container.</p>
        <div style={{ display: 'flex', width: 150, backgroundColor: '#fea' }}>
          <FieldTextStateless />
        </div>
      </div>
    );
  }
}
