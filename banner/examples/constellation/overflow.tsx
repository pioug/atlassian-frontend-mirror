import React from 'react';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import Banner from '../../src';

const long: string =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis, odio egestas pulvinar sodales, neque justo tempor tellus, eget venenatis arcu ante non purus. Pellentesque tellus eros, rutrum vel enim non, tempor faucibus felis. Nullam pharetra erat sed magna porttitor, eget tincidunt odio finibus';

export default function OverflowDemo() {
  return (
    <div style={{ maxWidth: 400, margin: 'auto' }}>
      <Banner
        isOpen
        appearance="warning"
        icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
      >
        {long}
      </Banner>
    </div>
  );
}
