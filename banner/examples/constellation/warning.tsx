import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../../src';

export default function WarningDemo() {
  return (
    <Banner
      isOpen
      icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
      appearance="warning"
    >
      Warning goes here
    </Banner>
  );
}
