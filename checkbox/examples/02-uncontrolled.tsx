import React, { PureComponent } from 'react';
import { Checkbox } from '../src';

interface State {
  onChangeResult: string;
}

export default class UncontrolledExample extends PureComponent<void, State> {
  state = {
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };
  onChange: React.ChangeEventHandler<HTMLInputElement> = event => {
    this.setState({
      onChangeResult: `this.state.isChecked: ${String(
        event.currentTarget.checked,
      )}`,
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          onChange={this.onChange}
          label="Uncontrolled Checkbox"
          value="Uncontrolled Checkbox"
          name="uncontrolled-checkbox"
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
