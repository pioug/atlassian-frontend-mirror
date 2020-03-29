import React from 'react';
import InlineMessage from '../../src';

export default function InlineMessagePlacement() {
  return (
    <InlineMessage
      placement="right"
      title="Title"
      secondaryText="Secondary text"
    >
      <p>Dialog to the right</p>
    </InlineMessage>
  );
}
