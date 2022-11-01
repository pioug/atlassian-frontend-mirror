/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import Spinner from '../src';

/**
 * For VR testing purposes we are overriding the animation timing
 * for both the fade-in and the rotating animations. This will
 * freeze the spinner, avoiding potential for VR test flakiness.
 */
const animationStyles = css({
  // eslint-disable-next-line @repo/internal/styles/no-nested-styles
  'svg, span': {
    animationDuration: '0s',
    animationTimingFunction: 'step-end',
  },
});

const tableStyles = css({
  width: 100,
  // TODO Delete this comment after verifying spacing token -> previous value `8`
  margin: token('spacing.scale.100', '8px'),
});

const tableCellStyles = css({
  border: `1px solid ${token('color.border', 'black')}`,
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
