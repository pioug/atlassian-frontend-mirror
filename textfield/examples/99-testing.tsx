import React, { Component } from 'react';
import Textfield from '../src';

export default class TextfieldExample extends Component {
  render() {
    return (
      <div>
        <label htmlFor="event-handlers">Basic textfield</label>
        <Textfield
          name="event-handlers"
          testId="the-textfield"
          defaultValue="I have a data-testid"
        />
      </div>
    );
  }
}
