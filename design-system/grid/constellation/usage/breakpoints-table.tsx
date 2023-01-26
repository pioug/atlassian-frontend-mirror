/** @jsx jsx */
import { jsx } from '@emotion/react';

import { BREAKPOINTS } from '../../src/config';

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
      {Object.entries(BREAKPOINTS).map(([breakpoint, config]) => (
        <tr key={breakpoint}>
          <td>{breakpoint}</td>
          <td>{config.min}px</td>
          <td>
            {config.max === Number.MAX_SAFE_INTEGER
              ? 'Infinity'
              : `${config.max}px`}
          </td>
          <td>{config.columns}</td>
        </tr>
      ))}
    </tbody>
  </table>
);
