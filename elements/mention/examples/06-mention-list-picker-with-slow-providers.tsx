import React from 'react';
import { layers } from '@atlaskit/theme/constants';
import MentionTextInput from '../example-helpers/demo-mention-text-input';
import {
  onSelection,
  slowResourceProvider,
  MockPresenceResource,
} from '../example-helpers';

const tallPageStyle: React.CSSProperties = {
  height: '2000px',
};

const downPage: React.CSSProperties = {
  position: 'absolute',
  top: '400px',
};

export default function Example() {
  return (
    <div style={tallPageStyle}>
      <div style={downPage}>
        <MentionTextInput
          label="User search"
          onSelection={onSelection}
          resourceProvider={slowResourceProvider}
          presenceProvider={new MockPresenceResource(200, 500)}
          relativePosition="above"
          zIndex={layers.modal()}
        />
      </div>
    </div>
  );
}
