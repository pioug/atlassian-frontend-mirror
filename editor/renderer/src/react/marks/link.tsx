/** @jsx jsx */
import React, { Fragment } from 'react';
import { css, jsx } from '@emotion/react';
import { B400, B300, B500 } from '@atlaskit/theme/colors';
import { LinkAttributes } from '@atlaskit/adf-schema';

import { getEventHandler } from '../../utils';
import { PLATFORM, MODE } from '../../analytics/events';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
} from '@atlaskit/editor-common/analytics';
import { MarkProps } from '../types';

import { token } from '@atlaskit/tokens';

const anchorStyles = css`
  color: ${token('color.link', B400)};

  &:hover {
    color: ${token('color.link', B300)};
    text-decoration: underline;
  }

  &:active {
    color: ${token('color.link.pressed', B500)};
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
    return <Fragment>{props.children}</Fragment>;
  }

  return (
    <a
      css={anchorStyles}
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
    </a>
  );
}
