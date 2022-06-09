import React from 'react';
import { IntlProvider } from 'react-intl-next';
import { AtlassianLinkPickerPlugin } from '@atlassian/link-picker-atlassian-plugin';

import { mockRecentClient, searchProvider } from '../example-helpers/providers';
import { LinkPicker } from '../src';

mockRecentClient();

export default function Vr() {
  return (
    <div className="example" style={{ padding: 50 }}>
      <IntlProvider locale="en">
        <LinkPicker
          plugins={[
            new AtlassianLinkPickerPlugin({
              searchProvider,
            }),
          ]}
          onSubmit={() => {}}
          onCancel={() => {}}
        />
      </IntlProvider>
    </div>
  );
}
