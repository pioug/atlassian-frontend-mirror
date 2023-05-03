import React, { PureComponent } from 'react';
import Textfield from '@atlaskit/textfield';
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
        <Textfield />
      </FieldBaseStateless>
    );
  }
}
