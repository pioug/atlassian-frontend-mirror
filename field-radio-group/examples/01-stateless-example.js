import React, { Component } from 'react';
import { AkFieldRadioGroup } from '../src';

export default class StatelessExample extends Component {
  state = {
    value: '',
    items: [
      { name: 'color2', value: 'red', label: 'Red' },
      { name: 'color2', value: 'blue', label: 'Blue' },
      { name: 'color2', value: 'yellow', label: 'Yellow' },
    ],
  };

  setValue = e => {
    this.setState({
      value: e.target.value,
    });
  };

  render() {
    return (
      <div>
        <AkFieldRadioGroup
          items={this.state.items}
          label="Pick a color (Checked state isn't managed by the component):"
          onRadioChange={this.setValue}
        />
        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          onRadioChange called with value: {this.state.value}
        </div>
      </div>
    );
  }
}
