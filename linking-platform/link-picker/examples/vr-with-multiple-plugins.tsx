import React from 'react';

import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';

import { LinkPicker } from '../src';
import { PageWrapper } from '../example-helpers/common';

const plugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'tab1',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab2',
    tabTitle: 'tab2',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab3',
    tabTitle: 'tab3',
  }),
];

export default function VrMultiplePlugins() {
  return (
    <PageWrapper>
      <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
    </PageWrapper>
  );
}
