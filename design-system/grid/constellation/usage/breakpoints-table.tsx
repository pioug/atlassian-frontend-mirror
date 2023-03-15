/** @jsx jsx */
import { jsx } from '@emotion/react';

import { UNSAFE_BREAKPOINTS_CONFIG } from '@atlaskit/primitives/responsive';

// TODO: This needs a new home.  We may want to show this here, but where does this live?
export const BreakpointsTable = () => (
  <table>
    <thead>
      <tr>
        <th>Breakpoint</th>
        <th>Min width</th>
        <th>Max width</th>
        <th># of columns</th>
      </tr>
    </thead>
    <tbody>
      {Object.entries(UNSAFE_BREAKPOINTS_CONFIG).map(([breakpoint, config]) => (
        <tr key={breakpoint}>
          <td>{breakpoint}</td>
          <td>{config.min}px</td>
          <td>
            {config.max === Number.MAX_SAFE_INTEGER
              ? 'Infinity'
              : `${config.max}px`}
          </td>
          <td>12</td>
        </tr>
      ))}
    </tbody>
  </table>
);
