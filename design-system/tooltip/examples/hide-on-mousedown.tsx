import React from 'react';

import Button from '@atlaskit/button/standard-button';

import Tooltip from '../src';

export default () => (
  <React.Fragment>
    <Tooltip content="Hello World" hideTooltipOnMouseDown>
      <Button>Mousedown event hides the tooltip</Button>
    </Tooltip>
    <p>
      Tooltip will hides when mouse down event is triggered (when you start
      clicking). It avoids the tooltip to be displayed when content is removed
    </p>
  </React.Fragment>
);
