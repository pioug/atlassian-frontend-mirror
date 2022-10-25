import React from 'react';

import { LinkPicker } from '../src';
import { PageWrapper } from '../example-helpers/common';

export default function VrNoPlugins() {
  return (
    <PageWrapper>
      <LinkPicker onSubmit={() => {}} onCancel={() => {}} />
    </PageWrapper>
  );
}
