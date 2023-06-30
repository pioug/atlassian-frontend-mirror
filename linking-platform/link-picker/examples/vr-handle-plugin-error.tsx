import React from 'react';

import {
  MockLinkPickerPromisePlugin,
  UnstableMockLinkPickerPlugin,
} from '@atlaskit/link-test-helpers/link-picker';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

const plugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'tab1',
  }),
  new UnstableMockLinkPickerPlugin({
    tabKey: 'tab2',
    tabTitle: 'Unstable',
  }),
  new UnstableMockLinkPickerPlugin({
    tabKey: 'tab3',
    tabTitle: 'Unauth',
    errorFallback: (error, retry) => null,
  }),
];

export default function VrHandlePluginError() {
  return (
    <PageWrapper>
      <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
    </PageWrapper>
  );
}
