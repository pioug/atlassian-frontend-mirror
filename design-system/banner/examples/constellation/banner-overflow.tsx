import React from 'react';

import WarningIcon from '@atlaskit/icon/glyph/warning';
import { Box, xcss } from '@atlaskit/primitives';

import Banner from '../../src';

const containerStyles = xcss({
  maxWidth: '400px',
  margin: 'auto',
});

const message =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis, odio egestas pulvinar sodales, neque justo tempor tellus, eget venenatis arcu ante non purus. Pellentesque tellus eros, rutrum vel enim non, tempor faucibus felis. Nullam pharetra erat sed magna porttitor, eget tincidunt odio finibus';

const BannerOverflowExample = () => {
  return (
    <Box xcss={containerStyles}>
      <Banner icon={<WarningIcon label="" secondaryColor="inherit" />}>
        {message}
      </Banner>
    </Box>
  );
};

export default BannerOverflowExample;
