import React from 'react';
import { render } from '@testing-library/react';
import { TableCell } from '../../nodes/tableCell';
import { ffTest } from '@atlassian/feature-flags-test-utils';
import { setGlobalTheme } from '@atlaskit/tokens';

describe('custom table cell background colors inversion in dark mode', () => {
  ffTest(
    'platform.editor.dm-invert-tablecell-bgcolor_9fz6s',
    async () => {
      await setGlobalTheme({ colorMode: 'dark' });
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell background="#ff00cc">test</TableCell>
            </tr>
          </tbody>
        </table>,
      );

      const td = container.querySelector('td')!;
      expect(td!).toHaveStyle('background-color: #00FF33');
    },
    async () => {
      await setGlobalTheme({ colorMode: 'light' });
      const { container } = render(
        <table>
          <tbody>
            <tr>
              <TableCell background="#ff00cc">test</TableCell>
            </tr>
          </tbody>
        </table>,
      );

      const td = container.querySelector('td')!;
      expect(td!).toHaveStyle('background-color: #ff00cc');
    },
  );
});
