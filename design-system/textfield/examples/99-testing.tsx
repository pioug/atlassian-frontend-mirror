import React from 'react';

import Textfield from '../src';

export default function TestingExample() {
  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
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
