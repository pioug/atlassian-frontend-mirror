import React, { useState } from 'react';

import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

const defaultPlugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'Confluence',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab2',
    tabTitle: 'Bitbucket',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab3',
    tabTitle: 'Jira',
  }),
];

export default function VrHideDisplayTextMultiplePlugins() {
  const [plugins] = useState(defaultPlugins);
  return (
    <PageWrapper>
      <LinkPicker
        plugins={plugins}
        onSubmit={() => {}}
        onCancel={() => {}}
        hideDisplayText={true}
      />
    </PageWrapper>
  );
}
