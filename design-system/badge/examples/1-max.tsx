import React from 'react';
import Badge from '../src';

export default function Example() {
  return (
    <div>
      <p>with no value</p>
      <Badge />
      <p>with a negative value</p>
      <Badge>{5}</Badge>
      <p>with a value greater than max value</p>
      <Badge max={99}>{500}</Badge>
      <p>with a value less than max value</p>
      <Badge max={99}>{50}</Badge>
      <p>with a value equal to max value</p>
      <Badge max={99}>{99}</Badge>
    </div>
  );
}
