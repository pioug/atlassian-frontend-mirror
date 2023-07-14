import React from 'react';

import Textfield from '../src';

export default function TestingExample() {
  return (
    <div>
      <label htmlFor="event-handlers">Basic textfield</label>
      <Textfield
        name="event-handlers"
        testId="the-textfield"
        defaultValue="I have a data-testid"
        id="event-handlers"
      />
    </div>
  );
}
