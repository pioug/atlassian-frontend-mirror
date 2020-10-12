import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import React from 'react';
import { onMentionEvent } from '../example-helpers/index';
import Mention from '../src/components/Mention';
import { ELEMENTS_CHANNEL } from '../src/_constants';
import debug from '../src/util/logger';
import { mockMentionData as mentionData } from '../src/__tests__/unit/_test-helpers';
import { IntlProvider } from 'react-intl';

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
      <div>
        <div style={padding}>
          <AnalyticsListener
            onEvent={listenerHandler}
            channel={ELEMENTS_CHANNEL}
          >
            <Mention
              {...mentionData}
              accessLevel={'CONTAINER'}
              onClick={handler}
              onMouseEnter={onMentionEvent}
              onMouseLeave={onMentionEvent}
            />
          </AnalyticsListener>
        </div>
        <div style={padding}>
          <Mention
            {...mentionData}
            isHighlighted={true}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
        <div style={padding}>
          <Mention
            {...mentionData}
            accessLevel={'NONE'}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
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
