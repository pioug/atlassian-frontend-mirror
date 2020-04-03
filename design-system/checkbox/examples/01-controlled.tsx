import React, { PureComponent } from 'react';
import { Checkbox } from '../src';

interface State {
  isChecked: boolean;
  onChangeResult: string;
}

export default class ControlledExample extends PureComponent<void, State> {
  state = {
    isChecked: false,
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };

  onChange = (event: any) => {
    this.setState({
      isChecked: !this.state.isChecked,
      onChangeResult: `this.props.isChecked: ${event.target.checked}`,
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          isChecked={this.state.isChecked}
          onChange={this.onChange}
          label="Controlled Checkbox"
          value="Controlled Checkbox"
          name="controlled-checkbox"
        />

        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            margin: '0.5em',
            color: '#ccc',
          }}
        >
          {this.state.onChangeResult}
        </div>
      </div>
    );
  }
}
