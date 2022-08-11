import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { LinkPicker } from '../src';
import {
  MockLinkPickerPromisePlugin,
  UnstableMockLinkPickerPlugin,
} from '@atlaskit/link-test-helpers/link-picker';

const plugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'tab1',
  }),
  new UnstableMockLinkPickerPlugin({
    tabKey: 'tab2',
    tabTitle: 'Unstable',
  }),
];

export default function Unstable() {
  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
      </IntlProvider>
    </div>
  );
}
