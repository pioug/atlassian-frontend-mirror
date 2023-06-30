import React from 'react';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';

export default function VrNoPlugins() {
  return (
    <PageWrapper>
      <LinkPicker onSubmit={() => {}} onCancel={() => {}} />
    </PageWrapper>
  );
}
