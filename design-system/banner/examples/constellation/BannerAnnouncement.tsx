import React from 'react';

import Banner from '../../src';

const message: string =
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum lobortis, odio egestas pulvinar sodales, neque justo tempor tellus, eget venenatis arcu ante non purus. Pellentesque tellus eros, rutrum vel enim non, tempor faucibus felis. Nullam pharetra erat sed magna porttitor, eget tincidunt odio finibus';

export default () => (
  <Banner appearance="announcement" isOpen>
    {message}
  </Banner>
);
