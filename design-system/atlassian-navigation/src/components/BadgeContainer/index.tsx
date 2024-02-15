/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { BadgeProps } from './types';

const badgeContainerStyles = css({
  position: 'absolute',
  insetBlockStart: `${token('space.negative.050', '-4px')}`,
  insetInlineEnd: `${token('space.negative.025', '-2px')}`,
  pointerEvents: 'none',
});

const containerStyles = css({
  position: 'relative',
});

// Not exported to consumers
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const BadgeContainer = (props: BadgeProps) => {
  const { id: badgeId, badge: Badge, children, role } = props;
  return (
    <div css={containerStyles} role={role}>
      {children}
      <div css={badgeContainerStyles} id={badgeId} aria-hidden={true}>
        <Badge />
      </div>
    </div>
  );
};
