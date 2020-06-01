/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Lozenge from '@atlaskit/lozenge';
import { gridSize } from '@atlaskit/theme/constants';

import Spinner, { Size } from '../src';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge', 80];
const grid: number = gridSize();

export default function Example() {
  return (
    <div
      css={css`
        display: flex;
        flex-wrap: wrap;
      `}
    >
      {sizes.map((size: Size) => (
        <div
          key={size}
          css={css`
            display: flex;
            flex-direction: column;
            margin-left: ${grid}px;
            margin-right: ${grid}px;
            align-items: center;
            justify-content: flex-end;
          `}
        >
          <span
            css={css`
              padding: ${grid}px;
            `}
          >
            <Spinner size={size} />
          </span>
          {typeof size === 'number' ? (
            <Lozenge appearance="new">custom</Lozenge>
          ) : (
            <Lozenge appearance="success">{size}</Lozenge>
          )}
        </div>
      ))}
    </div>
  );
}
