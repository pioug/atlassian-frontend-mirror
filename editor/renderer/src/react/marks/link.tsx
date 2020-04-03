import React from 'react';
import { colors } from '@atlaskit/theme';
import { EventHandlers } from '@atlaskit/editor-common';
import styled from 'styled-components';

import { getEventHandler } from '../../utils';
import { AnalyticsEventPayload, PLATFORM, MODE } from '../../analytics/events';
import { ACTION, ACTION_SUBJECT, EVENT_TYPE } from '../../analytics/enums';

const StyledAnchor = styled.a`
  color: ${colors.B400};

  &:hover {
    color: ${colors.B300};
    text-decoration: underline;
  }
`;

export default function Link(
  props: {
    children?: any;
    href: string;
    target?: string;
    eventHandlers?: EventHandlers;
    isMediaLink?: boolean;
    fireAnalyticsEvent?: (event: AnalyticsEventPayload) => void;
  } & React.Props<any>,
) {
  const {
    href,
    target,
    eventHandlers,
    fireAnalyticsEvent,
    isMediaLink,
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
    return props.children;
  }

  return (
    <StyledAnchor
      onClick={e => {
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
    >
      {props.children}
    </StyledAnchor>
  );
}
