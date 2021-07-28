/** @jsx jsx */
import { css, jsx } from '@emotion/core';

import { B400, B500, N0, N20 } from '@atlaskit/theme/colors';
import { borderRadius } from '@atlaskit/theme/constants';
import { token } from '@atlaskit/tokens';

import Badge from '../src';

const itemStyles = css({
  display: 'flex',
  maxWidth: '300px',
  marginBottom: '4px',
  padding: '0.6em 1em',
  alignItems: 'center',
  justifyContent: 'space-between',
  background: 'none',
  borderRadius: `${borderRadius()}px`,
  color: 'inherit',
  '&:hover': {
    backgroundColor: token('color.background.subtleNeutral.hover', N20),
  },
});

const invertedItemStyles = css({
  background: token('color.background.boldBrand.resting', B400),
  color: token('color.text.onBold', N0),
  '&:hover': {
    backgroundColor: token('color.background.boldBrand.hover', B500),
  },
});

export default function Example() {
  return (
    <div>
      <div css={itemStyles}>
        <p>Added</p>
        <Badge appearance="added" max={99} testId="badge">
          {3000}
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Default</p>
        <Badge testId="badge-default">{5}</Badge>
      </div>
      <div css={itemStyles}>
        <p>Default (∞)</p>
        <Badge max={Infinity} testId="badge">
          {Infinity}
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Important</p>
        <Badge appearance="important" testId="badge">
          {25}
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Primary</p>
        <Badge appearance="primary" testId="badge">
          {-5}
        </Badge>
      </div>
      <div css={[itemStyles, invertedItemStyles]}>
        <p>Primary Inverted</p>
        <Badge appearance="primaryInverted" testId="badge">
          {5}
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Removed</p>
        <Badge appearance="removed" testId="badge">
          {100}
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Added code</p>
        <Badge appearance="added" testId="badge">
          +100
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Removed code</p>
        <Badge appearance="removed" testId="badge">
          -100
        </Badge>
      </div>
      <div css={itemStyles}>
        <p>Added</p>
        <Badge appearance="added" max={4000} testId="badge">
          {3000}
        </Badge>
      </div>
    </div>
  );
}
