import { AtlaskitThemeProvider } from '@atlaskit/theme/components';
import React from 'react';
import { onMentionEvent } from '../example-helpers/index';
import Mention from '../src/components/Mention';
import { mockMentionData as mentionData } from '../src/__tests__/unit/_test-helpers';
import { IntlProvider } from 'react-intl-next';

const padding = { padding: '10px' };

export default function Example() {
  return (
    <IntlProvider locale="en">
      <AtlaskitThemeProvider mode="dark">
        <div style={padding} data-testid="mention">
          <Mention
            {...mentionData}
            accessLevel="CONTAINER"
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
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
            accessLevel="NONE"
            onClick={onMentionEvent}
            onMouseEnter={onMentionEvent}
            onMouseLeave={onMentionEvent}
          />
        </div>
      </AtlaskitThemeProvider>
    </IntlProvider>
  );
}
