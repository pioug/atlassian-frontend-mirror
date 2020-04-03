import React from 'react';
import SectionMessage from '../../src';

const ErrorSectionMessage = () => (
  <SectionMessage title="File not found" appearance="error">
    <p>
      Rather than a beep,
      <br />
      Or a rude error message,
      <br />
      These words: "File not found".
    </p>
  </SectionMessage>
);

export default ErrorSectionMessage;
