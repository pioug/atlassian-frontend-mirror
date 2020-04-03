import React from 'react';
import Inline from './inline';

export default function Paragraph({ children }: React.Props<{}>) {
  return (
    <p>
      <Inline>{children}</Inline>
    </p>
  );
}
