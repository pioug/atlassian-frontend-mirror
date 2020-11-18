import React from 'react';

import GlobalTheme from '@atlaskit/theme/components';

import Tag from '../src/tag/removable-tag';

export default () => (
  <div>
    <GlobalTheme.Provider value={() => ({ mode: 'dark' })}>
      <Tag
        text="Removable Tag Dark "
        removeButtonLabel="Remove"
        testId="removableTag"
      />
      <Tag
        text="Removable Tag Dark"
        color="purpleLight"
        removeButtonLabel="Remove"
        testId="removableTagColor"
      />
    </GlobalTheme.Provider>
  </div>
);
