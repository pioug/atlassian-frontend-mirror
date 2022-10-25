import React from 'react';

import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';

import { LinkPicker } from '../src';
import { PageWrapper } from '../example-helpers/common';

const plugins = [new MockLinkPickerPlugin()];

export default function VrSinglePlugin() {
  return (
    <PageWrapper>
      <LinkPicker
        plugins={plugins}
        url={'http://atlassian.com'}
        onSubmit={() => {}}
        onCancel={() => {}}
      />
    </PageWrapper>
  );
}
