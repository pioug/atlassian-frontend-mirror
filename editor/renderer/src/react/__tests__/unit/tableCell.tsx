import React from 'react';
import { render } from '@testing-library/react';
import { TableCell } from '../../nodes/tableCell';

import { setGlobalTheme } from '@atlaskit/tokens';

describe('custom table cell background colors inversion in dark mode', () => {
  it('inverts in dark mode', async () => {
    await setGlobalTheme({ colorMode: 'dark' });
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell
              // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
              background="#ff00cc"
            >
              test
            </TableCell>
          </tr>
        </tbody>
      </table>,
    );

    const td = container.querySelector('td')!;
    expect(td!).toHaveStyle('background-color: #CE00A1');
  });

  it('does not invert in light mode', async () => {
    await setGlobalTheme({ colorMode: 'light' });
    const { container } = render(
      <table>
        <tbody>
          <tr>
            <TableCell
              // eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage/preview
              background="#ff00cc"
            >
              test
            </TableCell>
          </tr>
        </tbody>
      </table>,
    );

    const td = container.querySelector('td')!;
    expect(td!).toHaveStyle('background-color: #ff00cc');
  });
});
