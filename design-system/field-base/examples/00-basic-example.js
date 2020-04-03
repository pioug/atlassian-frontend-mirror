import React, { PureComponent } from 'react';
import Input from '@atlaskit/input';

import FieldBase, { Label } from '../src';

export default class BasicExample extends PureComponent {
  state = {
    eventResult:
      'Click into and out of the input above to trigger onBlur & onFocus in the Fieldbase',
  };

  onBlur = () => {
    this.setState({
      eventResult: 'onBlur called from FieldBase above',
    });
  };

  onFocus = () => {
    this.setState({
      eventResult: 'onFocus called from FieldBase above',
    });
  };

  render() {
    return (
      <div>
        <Label label="With onBlur & onFocus event handlers" />
        <FieldBase onBlur={this.onBlur} onFocus={this.onFocus}>
          <Input isEditing />
        </FieldBase>
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
          {this.state.eventResult}
        </div>
        <Label label="With isDisabled" />
        <FieldBase isDisabled>
          <Input isEditing />
        </FieldBase>
        <Label label="With isInvalid" />
        <FieldBase isInvalid invalidMessage="This is an invalid field message">
          <Input isEditing />
        </FieldBase>
        <Label label="With isCompact" />
        <FieldBase isCompact>
          <Input isEditing />
        </FieldBase>
        <Label label="With isLoading" />
        <FieldBase isLoading>
          <Input isEditing />
        </FieldBase>
        <Label label="With isRequired, maxWidth(100) & isPaddingDisabled" />
        <FieldBase isRequired maxWidth={100} isPaddingDisabled>
          <Input isEditing />
        </FieldBase>
        <Label label="With appearance none" />
        <FieldBase appearance="none">
          <Input isEditing />
        </FieldBase>
        <Label label="With appearance subtle" />
        <FieldBase appearance="subtle">
          <Input isEditing />
        </FieldBase>
        <Label label="With isFitContainerWidthEnabled" />
        <FieldBase isFitContainerWidthEnabled>
          <Input isEditing />
        </FieldBase>
      </div>
    );
  }
}
