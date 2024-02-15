import React from 'react';

import Button from '@atlaskit/button/new';

const TokenButtonCodeBlock = `import { B300, B400, B500, N0 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// default state
color: token('color.text.inverse', N0),
background: token('color.background.selected.bold', B400),

// hovered state
&:hover {
  background: token('color.background.selected.bold.hovered', B300),
}

// pressed state
&:active {
  background: token('color.background.selected.bold.pressed', B500),
}`;

const TokenButton = () => {
  return <Button appearance="primary">Default button</Button>;
};

export default { example: TokenButton, code: TokenButtonCodeBlock };
