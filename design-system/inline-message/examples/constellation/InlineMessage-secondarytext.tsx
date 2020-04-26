import React from 'react';

import InlineMessage from '../../src';

export default function InlineMessageConfirmation() {
  return (
    <InlineMessage secondaryText="Secondary text">
      <p>Dialog</p>
    </InlineMessage>
  );
}
