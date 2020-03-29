import React from 'react';
import Button from '@atlaskit/button';

import Tooltip from '../src';

export default () => (
  <Tooltip content="Hello World" hideTooltipOnMouseDown>
    <React.Fragment>
      <Button>Mousedown event hides the tooltip</Button>
      <p>
        Tooltip will hides when mouse down event is triggered (when you start
        clicking). It avoids the tooltip to be displayed when content is removed
      </p>
    </React.Fragment>
  </Tooltip>
);
