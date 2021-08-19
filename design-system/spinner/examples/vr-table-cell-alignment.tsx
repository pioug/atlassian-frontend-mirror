/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import { token } from '@atlaskit/tokens';

import Spinner from '../src';

export default function TableCellAlignment() {
  return (
    <table
      data-testid="spinner-table"
      css={css`
        width: 100px;
        margin: 8px;

        td {
          border: 1px solid ${token('color.border.neutral', 'black')};
          text-align: center;
        }
        // For VR testing purposes we are overriding the animation timing
        // for both the fade-in and the rotating animations. This will
        // freeze the spinner, avoiding potential for VR test flakiness.
        span,
        svg {
          animation-timing-function: step-end;
          animation-duration: 0s;
        }
      `}
    >
      <tr>
        <td>
          <Spinner />
        </td>
      </tr>
    </table>
  );
}
