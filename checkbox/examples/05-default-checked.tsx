import React, { Component } from 'react';
import { Checkbox } from '../src';

export default class ControlledExample extends Component<void> {
  render() {
    return (
      <div>
        Default Checked Checkbox
        <Checkbox
          defaultChecked
          label="Default Checked Checkbox"
          value="Default Checked Checkbox"
          name="default-checked-checkbox"
        />
      </div>
    );
  }
}
