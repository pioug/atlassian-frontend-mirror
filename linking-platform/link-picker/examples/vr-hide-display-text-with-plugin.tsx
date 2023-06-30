import React from 'react';

import { MockLinkPickerPlugin } from '@atlaskit/link-test-helpers/link-picker';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

const plugins = [new MockLinkPickerPlugin()];

export default function VrHideDisplayTextSinglePlugin() {
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
