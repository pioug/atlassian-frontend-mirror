/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Lozenge from '@atlaskit/lozenge';
import { gridSize } from '@atlaskit/theme/constants';

import Spinner, { Size } from '../src';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge', 80];
const grid: number = gridSize();

const containerStyles = css({
  display: 'flex',
  gap: 2 * grid,
  flexWrap: 'wrap',
});

const itemStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: grid,
  flexDirection: 'column',
});

export default function Example() {
  return (
    <div css={containerStyles}>
      {sizes.map((size: Size) => (
        <div key={size} css={itemStyles}>
          <Spinner size={size} />
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
