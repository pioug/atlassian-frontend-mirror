/* eslint-disable @repo/internal/react/use-primitives */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { B400, B500, N0, N20 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Badge from '../src';

const itemStyles = css({
  display: 'flex',
  maxWidth: '300px',
  marginBottom: token('space.050', '4px'),
  padding: '0.6em 1em',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'none',
  borderRadius: `${borderRadius()}px`,
  color: 'inherit',
  '&:hover': {
    backgroundColor: token('color.background.neutral.hovered', N20),
  },
});

const invertedItemStyles = css({
  background: token('color.background.brand.bold', B400),
  color: token('color.text.inverse', N0),
  '&:hover': {
    backgroundColor: token('color.background.brand.bold.hovered', B500),
  },
});

export default function Example() {
  return (
    <div data-testid="badge">
      <div css={itemStyles}>
        <p>Added</p>
        <Badge appearance="added" max={99}>
          {3000}
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Default</p>
        <Badge testId="badge-default">{5}</Badge>
      </div>
      <div css={itemStyles}>
        <p>Default (∞)</p>
        <Badge max={Infinity}>{Infinity}</Badge>
      </div>
      <div css={itemStyles}>
        <p>Important</p>
        <Badge appearance="important">{25}</Badge>
      </div>
      <div css={itemStyles}>
        <p>Primary</p>
        <Badge appearance="primary">{-5}</Badge>
      </div>
      <div css={[itemStyles, invertedItemStyles]}>
        <p>Primary Inverted</p>
        <Badge appearance="primaryInverted">{5}</Badge>
      </div>
      <div css={itemStyles}>
        <p>Removed</p>
        <Badge appearance="removed">{100}</Badge>
      </div>
      <div css={itemStyles}>
        <p>Added code</p>
        <Badge appearance="added">+100</Badge>
      </div>
      <div css={itemStyles}>
        <p>Removed code</p>
        <Badge appearance="removed">-100</Badge>
      </div>
      <div css={itemStyles}>
        <p>Added</p>
        <Badge appearance="added" max={4000}>
          {3000}
        </Badge>
      </div>
    </div>
  );
}
