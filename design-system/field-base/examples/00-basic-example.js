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
        <Label
          htmlFor="example-1"
          label="With onBlur & onFocus event handlers"
        />
        <FieldBase onBlur={this.onBlur} onFocus={this.onFocus}>
          <Textfield id="example-1" />
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
        <Label label="With isDisabled" htmlFor="example-2" />
        <FieldBase isDisabled>
          <Textfield id="example-2" />
        </FieldBase>
        <Label label="With isInvalid" htmlFor="example-3" />
        <FieldBase isInvalid invalidMessage="This is an invalid field message">
          <Textfield id="example-3" />
        </FieldBase>
        <Label label="With isCompact" htmlFor="example-4" />
        <FieldBase isCompact>
          <Textfield id="example-4" />
        </FieldBase>
        <Label label="With isLoading" htmlFor="example-5" />
        <FieldBase isLoading>
          <Textfield id="example-5" />
        </FieldBase>
        <Label
          label="With isRequired, maxWidth(100) & isPaddingDisabled"
          htmlFor="example-6"
        />
        <FieldBase isRequired maxWidth={100} isPaddingDisabled>
          <Textfield id="example-6" />
        </FieldBase>
        <Label label="With appearance none" htmlFor="example-7" />
        <FieldBase appearance="none">
          <Textfield id="example-7" />
        </FieldBase>
        <Label label="With appearance subtle" htmlFor="example-8" />
        <FieldBase appearance="subtle">
          <Textfield id="example-8" />
        </FieldBase>
        <Label label="With isFitContainerWidthEnabled" htmlFor="example-9" />
        <FieldBase isFitContainerWidthEnabled>
          <Textfield id="example-9" />
        </FieldBase>
      </div>
    );
  }
}
