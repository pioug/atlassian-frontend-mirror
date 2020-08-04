import React, { PureComponent } from 'react';

import { Checkbox } from '../../src';

interface State {
  isChecked: boolean;
  onChangeResult: string;
}

export default class ControlledExample extends PureComponent<void, State> {
  state = {
    isChecked: true,
    onChangeResult: 'true',
  };

  onChange = (event: any) => {
    this.setState({
      isChecked: !this.state.isChecked,
      onChangeResult: `${event.target.checked}`,
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          isChecked={this.state.isChecked}
          onChange={this.onChange}
          label={`Controlled checkbox, with this.state.isChecked: ${this.state.onChangeResult}`}
          value="Controlled Checkbox"
          name="controlled-checkbox"
        />
      </div>
    );
  }
}
