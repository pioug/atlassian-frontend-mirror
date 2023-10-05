/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { Bleed } from '@atlaskit/primitives';
import { N0, N300A, N30A, N60A } from '@atlaskit/theme/colors';

import token from '../../src/get-token';

const TokenNegativeSpaceCodeBlock = `
import { token } from '@atlaskit/tokens';

// Container styles
paddingInline: token('space.200', '16px'),

// Divider styles
marginInline: token('space.negative.200', '-16px'),
`;

const containerStyles = css({
  width: 300,
  height: 200,
  padding: token('space.200', '16px'),
  backgroundColor: token('elevation.surface.overlay', N0),
  boxShadow: token(
    'elevation.shadow.overlay',
    `0 0 0 1px ${N30A}, 0 2px 1px ${N30A}, 0 0 20px -6px ${N60A}`,
  ),
});

const dividerStyles = css({
  border: 'none',
  borderBlockEnd: `1px solid ${token('color.border', N300A)}`,
});

const TokenNegativeSpace = () => {
  return (
    <div css={containerStyles}>
      <p>A container with an inset</p>
      <Bleed inline="space.200">
        <hr css={dividerStyles}></hr>
      </Bleed>
    </div>
  );
};

export default {
  example: TokenNegativeSpace,
  code: TokenNegativeSpaceCodeBlock,
};
