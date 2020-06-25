import React from 'react';

import StarFilledIcon from '@atlaskit/icon/glyph/star-filled';

import Button from '../../src';

export default () => (
  <Button
    iconAfter={<StarFilledIcon label="Star icon" size="small" />}
    appearance="primary"
  >
    Icon after
  </Button>
);
