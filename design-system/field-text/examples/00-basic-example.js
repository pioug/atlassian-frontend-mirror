import React, { PureComponent } from 'react';
import TextField from '../src';

export default class BasicExample extends PureComponent {
  state = {
    eventResult:
      'Click into and out of the input above to trigger onBlur & onFocus in the Fieldbase',
  };

  onChange = (event) => {
    this.setState({
      eventResult: `onChange called with value: ${event.target.value}`,
    });
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
        <TextField
          onChange={this.onChange}
          onBlur={this.onBlur}
          onFocus={this.onFocus}
          label="With change, blur & focus handlers"
        />
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

        <TextField label="hidden label" isLabelHidden />
        <TextField autoFocus label="autofocused" />
        <TextField value="candy" label="With default value" />
        <TextField disabled label="disabled" value="no touching" />
        <TextField required label="Required" />
        <TextField isInvalid label="Is Invalid" />
        <TextField placeholder="Click here to input" label="With Placeholder" />
        <TextField
          invalidMessage="Modal Dialog Text"
          label="with error message"
        />
        <TextField isSpellCheckEnabled={false} label="spell check disabled" />
        <TextField maxLength={5} label="Max length of 5" />
        <TextField type="Number" label="Number typed input" />
      </div>
    );
  }
}
