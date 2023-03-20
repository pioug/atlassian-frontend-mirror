import React from 'react';

import { MentionItem } from '../src/item';
import { generateMentionItem, onSelection } from '../example-helpers';
import { IntlProvider } from 'react-intl-next';

export default function Example() {
  const mention = {
    id: '666',
    name: 'Craig Petchell',
    mentionName: 'petch',
  };
  const description = 'Simple mention item with no nickname or avatar';
  const component = (
    <IntlProvider locale="en">
      <div data-testid="vr-tested">
        <MentionItem mention={mention} onSelection={onSelection} />
      </div>
    </IntlProvider>
  );

  return generateMentionItem(component, description);
}
