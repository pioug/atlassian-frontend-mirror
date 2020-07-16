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
    enableNestedHeaderLinks?: boolean;
  }>,
) {
  const { headingId, dataAttributes, enableNestedHeaderLinks } = props;
  const HX = `h${props.level}` as 'h1';

  return (
    <HX id={headingId} {...dataAttributes}>
      {!!props.showAnchorLink && (
        <CopyTextConsumer>
          {({ copyTextToClipboard }) => {
            return (
              headingId && (
                <AnalyticsContext.Consumer>
                  {({ fireAnalyticsEvent }) => (
                    <HeadingAnchor
                      enableNestedHeaderLinks={enableNestedHeaderLinks}
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
      {props.children}
    </HX>
  );
}

export default Heading;
