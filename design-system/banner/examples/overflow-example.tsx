import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';

import Banner from '../src';

const Padded = ({ children }: { children: React.ReactNode }) => (
  <div style={{ padding: 16 }}>{children}</div>
);

export default () => (
  <div style={{ width: 400 }}>
    <Banner icon={<WarningIcon label="" secondaryColor="inherit" />} isOpen>
      JIRA Service Desk pricing has been updated. Please migrate within 3
      months.
    </Banner>
    <Padded>
      There should only be 1 line of text, with ellipsis (…) shown when text
      overflows.
    </Padded>
  </div>
);
