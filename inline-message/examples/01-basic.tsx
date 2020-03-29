import React from 'react';
import InlineMessage from '../src';

export default () => (
  <div>
    <InlineMessage
      title="Inline Message Title Example"
      secondaryText="Secondary Text"
    >
      <p>Primary and secondary text dialog</p>
    </InlineMessage>
    <br />
    <InlineMessage title="Inline Message Title Only">
      <p>Title only dialog</p>
    </InlineMessage>
    <br />
    <InlineMessage secondaryText="Secondary Text Only">
      <p>Secondary text only dialog</p>
    </InlineMessage>
    <br />
    <InlineMessage title="Display Message Beside Text" placement="right-end">
      <p>Dialog beside text</p>
    </InlineMessage>
  </div>
);
