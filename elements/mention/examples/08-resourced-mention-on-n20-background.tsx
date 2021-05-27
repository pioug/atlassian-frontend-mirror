import React from 'react';
import { AnalyticsListener, UIAnalyticsEvent } from '@atlaskit/analytics-next';
import { N20 } from '@atlaskit/theme/colors';
import debug from '../src/util/logger';
import { onMentionEvent } from '../example-helpers/index';
import { mockMentionData as mentionData } from '../src/__tests__/unit/_test-helpers';
import { mentionResourceProviderWithResolver } from '@atlaskit/util-data-test/mention-story-data';
import { ELEMENTS_CHANNEL } from '../src/_constants';
import ResourcedMention from '../src/components/Mention/ResourcedMention';
import { IntlProvider } from 'react-intl';

const style = {
  backgroundColor: N20,
  width: '100%',
  padding: '20px',
};

const padding = { padding: '10px' };

const listenerHandler = (e: UIAnalyticsEvent) => {
  debug(
    'Analytics Next handler - payload:',
    e.payload,
    ' context: ',
    e.context,
  );
};

export default function Example() {
  const mentionProvider = Promise.resolve(mentionResourceProviderWithResolver);

  return (
    <IntlProvider locale="en">
      <div style={style}>
        <div style={padding}>
          <AnalyticsListener
            onEvent={listenerHandler}
            channel={ELEMENTS_CHANNEL}
          >
            <ResourcedMention
              {...mentionData}
              accessLevel={'CONTAINER'}
              mentionProvider={mentionProvider}
              onClick={onMentionEvent}
              onMouseEnter={onMentionEvent}
              onMouseLeave={onMentionEvent}
            />
          </AnalyticsListener>
        </div>
        <div style={padding}>
          <ResourcedMention
            id="oscar"
            text="@Oscar Wallhult"
            mentionProvider={mentionProvider}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
        <div style={padding}>
          <ResourcedMention
            {...mentionData}
            accessLevel={'NONE'}
            mentionProvider={mentionProvider}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
        <div style={padding}>
          <ResourcedMention
            {...mentionData}
            text=""
            mentionProvider={mentionProvider}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
        <div style={padding}>
          <ResourcedMention
            id="unknown"
            text=""
            mentionProvider={mentionProvider}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
        <div style={padding}>
          <ResourcedMention
            id="service_error"
            text=""
            mentionProvider={mentionProvider}
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
      </div>
    </IntlProvider>
  );
}
