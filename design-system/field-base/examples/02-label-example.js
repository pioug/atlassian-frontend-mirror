import React, { PureComponent } from 'react';
import Textfield from '@atlaskit/textfield';
import FieldBase, { Label } from '../src';

export default class LabelExample extends PureComponent {
  render() {
    return (
      <div>
        <Label
          label="Default label for the input below"
          isFirstChild
          htmlFor="input-id-example"
          isRequired
        >
          <FieldBase>
            <Textfield id="input-id-example" />
          </FieldBase>
        </Label>
        {/* TODO: Remove extraneous control or give appropriate control (DSP-11465) */}
        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
        <Label label="Inline edit label" appearance="inline-edit" />
      </div>
    );
  }
}
