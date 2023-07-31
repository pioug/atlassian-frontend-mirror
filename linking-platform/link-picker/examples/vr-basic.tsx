import React from 'react';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import { MockLinkPickerPlugin } from '../src/__tests__/__helpers/mock-plugins';

const plugins = [new MockLinkPickerPlugin()];

export default function VrSinglePlugin() {
  return (
    <PageWrapper>
      <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
    </PageWrapper>
  );
}
