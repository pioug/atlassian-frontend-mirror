import React from 'react';

import Button from '@atlaskit/button/standard-button';

import Textfield from '../src';

export default function ForwardRefExample() {
  let input: HTMLInputElement | null = null;

  const handleRef = (ref: HTMLInputElement | null) => {
    input = ref;
  };

  const handleFocus = () => {
    if (input) {
      input.focus();
    }
  };

  return (
    <div>
      <Textfield ref={handleRef} aria-label="textfield label" />
      <p>
        <Button appearance="primary" onClick={handleFocus}>
          Focus TextField
        </Button>
      </p>
    </div>
  );
}
