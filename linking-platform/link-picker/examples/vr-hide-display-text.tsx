import React from 'react';

import { LinkPicker } from '../src';
import { PageWrapper } from '../example-helpers/common';

export default function VrHideDisplayText() {
  return (
    <PageWrapper>
      <LinkPicker
        onSubmit={() => {}}
        onCancel={() => {}}
        hideDisplayText={true}
      />
    </PageWrapper>
  );
}
