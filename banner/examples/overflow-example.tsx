import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../src';

const Padded = (props: { children: React.ReactNode }) => (
  <div style={{ padding: 16 }} {...props} />
);

export default () => (
  <div style={{ width: 400 }}>
    <Banner
      icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
      isOpen
    >
      JIRA Service Desk pricing has been updated. Please migrate within 3
      months.
    </Banner>
    <Padded>
      There should only be 1 line of text, with elipsis (…) shown when text
      overflows.
    </Padded>
  </div>
);
