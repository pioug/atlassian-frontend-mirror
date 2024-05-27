/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import Lozenge from '@atlaskit/lozenge';
import { token } from '@atlaskit/tokens';

import Spinner, { type Size } from '../src';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge', 80];

const containerStyles = css({
  display: 'flex',
  gap: token('space.200', '16px'),
  flexWrap: 'wrap',
});

const itemStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  gap: token('space.100', '8px'),
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
