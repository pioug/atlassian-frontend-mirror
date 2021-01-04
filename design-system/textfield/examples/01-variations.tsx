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
      <label htmlFor="event-handlers">Event Handlers</label>
      <Textfield
        testId="event-handlers"
        onChange={handleOnChange}
        onBlur={handleOnBlur}
        onFocus={handleOnFocus}
      />
      <div style={eventResultStyle}>{eventResult}</div>

      <label htmlFor="default-value">
        Default value (not the same as a placeholder)
      </label>
      <Textfield testId="default-value" defaultValue="candy" />

      <label htmlFor="disabled">Disabled</label>
      <Textfield
        testId="disabled"
        isDisabled
        defaultValue="can't touch this..."
      />

      <label htmlFor="required">Required</label>
      <Textfield testId="required" isRequired />

      <label htmlFor="invalid">Invalid</label>
      <Textfield testId="invalid" isInvalid />

      <label htmlFor="placeholder">Placeholder</label>
      <Textfield testId="placeholder" placeholder="Click here to input..." />

      <label htmlFor="auto-focus">Auto Focus</label>
      <Textfield
        testId="auto-focus"
        autoFocus
        defaultValue="Text is normal font"
      />

      <label htmlFor="spell-check">Spell Check, Monospaced</label>
      <Textfield
        testId="spell-check"
        spellCheck
        isMonospaced
        defaultValue="Text is monospaced font"
      />

      <label htmlFor="compact">Compact</label>
      <Textfield testId="compact" isCompact />
    </div>
  );
}
