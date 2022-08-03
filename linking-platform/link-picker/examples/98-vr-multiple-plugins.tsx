import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { LinkPicker } from '../src';
import { MockLinkPickerPromisePlugin } from '@atlaskit/link-test-helpers/link-picker';

const plugins = [
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab1',
    tabTitle: 'tab1',
  }),
  new MockLinkPickerPromisePlugin({
    tabKey: 'tab2',
    tabTitle: 'tab2',
  }),
];

export default function Vr() {
  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
      </IntlProvider>
    </div>
  );
}
