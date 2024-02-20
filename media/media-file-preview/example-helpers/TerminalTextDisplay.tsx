/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
/* eslint-disable @atlaskit/design-system/prefer-primitives */
import React, { ReactNode } from 'react';

type TerminalTextDisplayProps = {
  children: ReactNode;
};

export const TerminalTextDisplay: React.FC<TerminalTextDisplayProps> = ({
  children,
}): React.ReactElement | null => (
  <div
    style={{
      backgroundColor: '#000000',
      color: '#33FF00',
      borderRadius: 5,
      // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
      padding: 20,
      fontFamily: 'Courier New, monospace',
      lineHeight: '1.4',
      maxWidth: 600,
      width: '100%',
      fontSize: '1.1em',
      whiteSpace: 'pre-wrap',
      overflow: 'auto',
    }}
  >
    {children}
  </div>
);
