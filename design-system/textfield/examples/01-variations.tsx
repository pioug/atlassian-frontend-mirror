import React, { useState } from 'react';

import Textfield from '../src';

const eventResultStyle = {
  borderStyle: 'dashed',
  borderWidth: '1px',
  borderColor: '#ccc',
  padding: '0.5em',
  color: '#ccc',
  margin: '0.5em 0',
};

export default function VariationsExample() {
  const [eventResult, setEventResult] = useState(
    'Click into & out of the input above to trigger onBlur & onFocus.',
  );

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventResult(`onChange called with value: ${e.target.value}`);
  };

  const handleOnBlur = () => {
    setEventResult('onBlur called');
  };

  const handleOnFocus = () => {
    setEventResult('onFocus called');
  };

  return (
    <div>
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="event-handlers">Event Handlers</label>
      <Textfield
        testId="event-handlers"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
      />
      <div style={eventResultStyle}>{eventResult}</div>

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="default-value">
        Default value (not the same as a placeholder)
      </label>
      <Textfield testId="default-value" defaultValue="candy" />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="disabled">Disabled</label>
      <Textfield
        testId="disabled"
        isDisabled
        defaultValue="can't touch this..."
      />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="required">Required</label>
      <Textfield testId="required" isRequired />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="invalid">Invalid</label>
      <Textfield testId="invalid" isInvalid />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="placeholder">Placeholder</label>
      <Textfield testId="placeholder" placeholder="Click here to input..." />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="auto-focus">Auto Focus</label>
      <Textfield
        testId="auto-focus"
        autoFocus
        defaultValue="Text is normal font"
      />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="spell-check">Spell Check, Monospaced</label>
      <Textfield
        testId="spell-check"
        spellCheck
        isMonospaced
        defaultValue="Text is monospaced font"
      />

      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control,jsx-a11y/label-has-for */}
      <label htmlFor="compact">Compact</label>
      <Textfield testId="compact" isCompact />
    </div>
  );
}
