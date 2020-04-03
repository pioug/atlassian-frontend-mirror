import React, { PureComponent } from 'react';
import Input from '@atlaskit/input';
import { FieldBaseStateless } from '../src';

export default class StatelessExample extends PureComponent {
  render() {
    return (
      <FieldBaseStateless
        appearance="standard"
        onBlur={() => {}}
        onFocus={() => {}}
        isFitContainerWidthEnabled
        isRequired
      >
        <Input isEditing />
      </FieldBaseStateless>
    );
  }
}
