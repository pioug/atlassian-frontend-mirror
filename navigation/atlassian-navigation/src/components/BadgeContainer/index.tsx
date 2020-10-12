/** @jsx jsx */
import { jsx } from '@emotion/core';

import { badgeContainerCSS, containerCSS } from './styles';
import { BadgeProps } from './types';

export const NOTIFICATIONS_BADGE_ID = 'atlassian-navigation-notification-count';

export const BadgeContainer = (props: BadgeProps) => {
  const { badge: Badge, children } = props;
  return (
    <div css={containerCSS}>
      {children}
      <div
        css={badgeContainerCSS}
        id={NOTIFICATIONS_BADGE_ID}
        aria-hidden={true}
      >
        <Badge />
      </div>
    </div>
  );
};
