import React from 'react';

import HeadingAnchor from './heading-anchor';
import Url from 'url-parse';
import {
  ACTION,
  ACTION_SUBJECT,
  ACTION_SUBJECT_ID,
  EVENT_TYPE,
} from '../../analytics/enums';
import AnalyticsContext from '../../analytics/analyticsContext';
import { CopyTextConsumer } from './copy-text-provider';
import { NodeProps } from '../types';
import {
  HeadingAnchorLinksProps,
  HeadingAnchorLinksConfig,
} from '../../ui/Renderer/types';

export type HeadingLevels = 1 | 2 | 3 | 4 | 5 | 6;

const getCurrentUrlWithHash = (hash: string = ''): string => {
  const url = new Url(window.location.href);
  url.set('hash', encodeURIComponent(hash));
  return url.href;
};

function Heading(
  props: NodeProps<{
    level: HeadingLevels;
    headingId?: string;
    showAnchorLink?: boolean;
    allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
  }>,
) {
  const { headingId, dataAttributes, allowHeadingAnchorLinks } = props;
  const HX = `h${props.level}` as 'h1';

  const enableNestedHeaderLinks =
    allowHeadingAnchorLinks &&
    (allowHeadingAnchorLinks as HeadingAnchorLinksConfig)
      .allowNestedHeaderLinks;

  return (
    <HX id={headingId} {...dataAttributes}>
      <>
        {enableNestedHeaderLinks && props.children}
        {!!props.showAnchorLink && (
          <CopyTextConsumer>
            {({ copyTextToClipboard }) => {
              return (
                headingId && (
                  <AnalyticsContext.Consumer>
                    {({ fireAnalyticsEvent }) => (
                      <HeadingAnchor
                        enableNestedHeaderLinks={enableNestedHeaderLinks}
                        level={props.level}
                        onCopyText={() => {
                          fireAnalyticsEvent({
                            action: ACTION.CLICKED,
                            actionSubject: ACTION_SUBJECT.BUTTON,
                            actionSubjectId:
                              ACTION_SUBJECT_ID.HEADING_ANCHOR_LINK,
                            eventType: EVENT_TYPE.UI,
                          });

                          return copyTextToClipboard(
                            getCurrentUrlWithHash(headingId),
                          );
                        }}
                      />
                    )}
                  </AnalyticsContext.Consumer>
                )
              );
            }}
          </CopyTextConsumer>
        )}
        {!enableNestedHeaderLinks && props.children}
      </>
    </HX>
  );
}

export default Heading;
