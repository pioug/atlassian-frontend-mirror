import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';
import AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';
import React from 'react';
import { onMentionEvent } from '../example-helpers/index';
import Mention from '../src/components/Mention';
import { ELEMENTS_CHANNEL } from '../src/_constants';
import debug from '../src/util/logger';
import { mockMentionData as mentionData } from '../src/__tests__/unit/_test-helpers';
import {
  MENTION_ID_HIGHLIGHTED,
  MENTION_ID_WITH_CONTAINER_ACCESS,
  MENTION_ID_WITH_NO_ACCESS,
} from '../src/__tests__/unit/_test-constants';
import { IntlProvider } from 'react-intl-next';

const padding = { padding: '10px' };

const listenerHandler = (e: UIAnalyticsEvent) => {
  debug(
    'Analytics Next handler - payload:',
    e.payload,
    ' context: ',
    e.context,
  );
};

const handler = (
  _mentionId: string,
  text: string,
  event?: any,
  analytics?: any,
) => {
  debug(
    'Old Analytics handler: ',
    text,
    ' ',
    event,
    ' - analytics: ',
    analytics,
  );
};

export default function Example() {
  return (
    <IntlProvider locale="en">
      <div data-testid="vr-tested">
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={padding}>
          <AnalyticsListener
            onEvent={listenerHandler}
            channel={ELEMENTS_CHANNEL}
          >
            <Mention
              {...mentionData}
              id={MENTION_ID_WITH_CONTAINER_ACCESS}
              accessLevel={'CONTAINER'}
              onClick={handler}
              onMouseEnter={onMentionEvent}
              onMouseLeave={onMentionEvent}
            />
          </AnalyticsListener>
        </div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={padding}>
          <Mention
            {...mentionData}
            id={MENTION_ID_HIGHLIGHTED}
            isHighlighted={true}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={padding}>
          <Mention
            {...mentionData}
            id={MENTION_ID_WITH_NO_ACCESS}
            accessLevel={'NONE'}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
        <div style={padding}>
          <Mention
            {...mentionData}
            text=""
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
      </div>
    </IntlProvider>
  );
}
