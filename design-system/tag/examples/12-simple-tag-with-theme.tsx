import React from 'react';

import GlobalTheme from '@atlaskit/theme/components';

import Tag from '../src/tag/simple-tag';

export default () => (
  <div>
    <GlobalTheme.Provider value={() => ({ mode: 'dark' })}>
      <Tag text="Standard Tag" testId="standard" />
      <Tag text="Linked Tag" testId="linkTag" href="/components/tag" />
    </GlobalTheme.Provider>
  </div>
);
