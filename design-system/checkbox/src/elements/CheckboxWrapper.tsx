/** @jsx jsx */
import { jsx } from '@emotion/core';

export default ({ children }: { children: React.ReactNode }) => (
  <span
    css={{
      display: 'flex;',
      flexShrink: 0,
      position: 'relative',
    }}
  >
    {children}
  </span>
);
