/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import Spinner from '../src';

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
  // eslint-disable-next-line @atlaskit/design-system/no-nested-styles
  'svg, span': {
    animationDuration: '0s',
    animationTimingFunction: 'step-end',
  },
});

const tableStyles = css({
  width: 100,
  margin: token('space.100', '8px'),
});

const tableCellStyles = css({
  border: `1px solid ${token('color.border')}`,
  textAlign: 'center',
});

export default function TableCellAlignment() {
  return (
    <table data-testid="spinner-table" css={[tableStyles, animationStyles]}>
      <tr>
        <td css={tableCellStyles}>
          <Spinner />
        </td>
      </tr>
    </table>
  );
}
