import React from 'react';
import MentionTextInput from '../example-helpers/demo-mention-text-input';
import {
  onSelection,
  resourceProvider,
  MockPresenceResource,
} from '../example-helpers';

export default function Example() {
  return (
    <MentionTextInput
      label="User search"
      onSelection={onSelection}
      resourceProvider={resourceProvider}
      presenceProvider={new MockPresenceResource()}
    />
  );
}
