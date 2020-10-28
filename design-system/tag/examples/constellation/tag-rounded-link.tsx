import React from 'react';

import Avatar from '@atlaskit/avatar';

import Tag from '../../src';

export default () => (
  <Tag
    appearance="rounded"
    removeButtonLabel="Remove"
    text="Round removeable link"
    href="/components/tag"
    elemBefore={<Avatar borderColor="transparent" size="xsmall" />}
  />
);
