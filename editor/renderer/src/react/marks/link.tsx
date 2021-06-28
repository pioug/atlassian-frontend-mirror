import React from 'react';
import { B400, B300 } from '@atlaskit/theme/colors';
import { LinkAttributes } from '@atlaskit/adf-schema';
import styled from 'styled-components';

import { getEventHandler } from '../../utils';
import { PLATFORM, MODE } from '../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';
import { MarkProps } from '../types';

const StyledAnchor = styled.a`
  color: ${B400};

  &:hover {
    color: ${B300};
    text-decoration: underline;
  }
`;

interface LinkProps extends LinkAttributes {
  target?: string;
  isMediaLink?: boolean;
}

export default function Link(props: MarkProps<LinkProps>) {
  const {
    href,
    target,
    eventHandlers,
    fireAnalyticsEvent,
    isMediaLink,
    dataAttributes,
  } = props;

  const anchorProps: React.AnchorHTMLAttributes<HTMLAnchorElement> = {
    href,
    target,
    title: href,
  };

  if (target === '_blank') {
    anchorProps.rel = 'noreferrer noopener';
  }

  const handler = getEventHandler(eventHandlers, 'link');

  if (isMediaLink) {
    return <>{props.children}</>;
  }

  return (
    <StyledAnchor
      onClick={(e) => {
        if (fireAnalyticsEvent) {
          fireAnalyticsEvent({
            action: ACTION.VISITED,
            actionSubject: ACTION_SUBJECT.LINK,
            eventType: EVENT_TYPE.TRACK,
            attributes: {
              platform: PLATFORM.WEB,
              mode: MODE.RENDERER,
            },
          });
        }

        if (handler) {
          handler(e, href);
        }
      }}
      {...anchorProps}
      {...dataAttributes}
    >
      {props.children}
    </StyledAnchor>
  );
}
