import React from 'react';
import { IntlProvider } from 'react-intl-next';

import { LinkPicker } from '../src';
import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';

const plugins = [new MockLinkPickerPlugin()];

export default function Vr() {
  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
      </IntlProvider>
    </div>
  );
}
