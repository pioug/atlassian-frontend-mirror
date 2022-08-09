import React from 'react';

import Tag from '../src/tag/simple-tag';

export default () => (
  <div>
    <Tag text="Base Tag" testId="standard" />
    <Tag text="Linked Tag" testId="linkTag" href="/components/tag" />
  </div>
);
