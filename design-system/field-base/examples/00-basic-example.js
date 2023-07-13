/* eslint-disable jsx-a11y/label-has-associated-control */
/* TODO: Make all examples use simple but accessible implementations (DSP-11464) */

import React, { PureComponent } from 'react';
import Textfield from '@atlaskit/textfield';

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
          <Textfield />
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
          <Textfield />
        </FieldBase>
        <Label label="With isInvalid" />
        <FieldBase isInvalid invalidMessage="This is an invalid field message">
          <Textfield />
        </FieldBase>
        <Label label="With isCompact" />
        <FieldBase isCompact>
          <Textfield />
        </FieldBase>
        <Label label="With isLoading" />
        <FieldBase isLoading>
          <Textfield />
        </FieldBase>
        <Label label="With isRequired, maxWidth(100) & isPaddingDisabled" />
        <FieldBase isRequired maxWidth={100} isPaddingDisabled>
          <Textfield />
        </FieldBase>
        <Label label="With appearance none" />
        <FieldBase appearance="none">
          <Textfield />
        </FieldBase>
        <Label label="With appearance subtle" />
        <FieldBase appearance="subtle">
          <Textfield />
        </FieldBase>
        <Label label="With isFitContainerWidthEnabled" />
        <FieldBase isFitContainerWidthEnabled>
          <Textfield />
        </FieldBase>
      </div>
    );
  }
}
