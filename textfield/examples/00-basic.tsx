import React, { Component } from 'react';
import Textfield from '../src';

const eventResultStyle = {
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em 0',
};

type State = { eventResult: string };

export default class TextfieldExample extends Component<void, State> {
  state = {
    eventResult:
      'Click into & out of the input above to trigger onBlur & onFocus.',
  };

  handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({
      eventResult: `onChange called with value: ${e.target.value}`,
    });
  };

  handleOnBlur = () => {
    this.setState({ eventResult: 'onBlur called' });
  };

  handleOnFocus = () => {
    this.setState({ eventResult: 'onFocus called' });
  };

  render() {
    const { eventResult } = this.state;

    return (
      <div>
        <label htmlFor="event-handlers">Event Handlers</label>
        <Textfield
          name="event-handlers"
          onChange={this.handleOnChange}
          onBlur={this.handleOnBlur}
          onFocus={this.handleOnFocus}
        />
        <div style={eventResultStyle}>{eventResult}</div>

        <label htmlFor="default-value">
          Default value (not the same as a placeholder)
        </label>
        <Textfield name="default-value" defaultValue="candy" />

        <label htmlFor="disabled">Disabled</label>
        <Textfield
          name="disabled"
          isDisabled
          defaultValue="can't touch this..."
        />

        <label htmlFor="required">Required</label>
        <Textfield name="required" isRequired />

        <label htmlFor="invalid">Invalid</label>
        <Textfield name="invalid" isInvalid />

        <label htmlFor="placeholder">Placeholder</label>
        <Textfield name="placeholder" placeholder="Click here to input..." />

        <label htmlFor="auto-focus">Auto Focus</label>
        <Textfield name="auto-focus" autoFocus />

        <label htmlFor="spell-check">Spell Check</label>
        <Textfield name="spell-check" spellCheck />

        <label htmlFor="compact">Compact</label>
        <Textfield name="compact" isCompact />
      </div>
    );
  }
}
