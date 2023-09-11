/** @jsx jsx */
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { BadgeProps } from './types';

const badgeContainerStyles = css({
  position: 'absolute',
  top: `${token('space.negative.050', '-4px')}`,
  right: `${token('space.negative.025', '-2px')}`,
  pointerEvents: 'none',
});

const containerStyles = css({
  position: 'relative',
});

// Not exported to consumers
// eslint-disable-next-line @repo/internal/react/require-jsdoc
export const BadgeContainer = (props: BadgeProps) => {
  const { id: badgeId, badge: Badge, children } = props;
  return (
    <div css={containerStyles}>
      {children}
      <div css={badgeContainerStyles} id={badgeId} aria-hidden={true}>
        <Badge />
      </div>
    </div>
  );
};
