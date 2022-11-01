/** @jsx jsx */

import { css, jsx } from '@emotion/core';

import Lozenge from '@atlaskit/lozenge';
import { token } from '@atlaskit/tokens';

import Spinner, { Size } from '../src';

const sizes: Size[] = ['xsmall', 'small', 'medium', 'large', 'xlarge', 80];

const containerStyles = css({
  display: 'flex',
  // TODO Delete this comment after verifying spacing token -> previous value `2 * grid`
  gap: token('spacing.scale.200', '16px'),
  flexWrap: 'wrap',
});

const itemStyles = css({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  // TODO Delete this comment after verifying spacing token -> previous value `grid`
  gap: token('spacing.scale.100', '8px'),
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
