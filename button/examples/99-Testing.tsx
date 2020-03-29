import React from 'react';
import Button from '../src';

export default () => (
  <Button
    testId="MyButtonTestId"
    onClick={() => alert('Button has been clicked!')}
  >
    Button
  </Button>
);
