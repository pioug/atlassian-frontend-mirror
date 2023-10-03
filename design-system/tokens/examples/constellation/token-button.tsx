import React from 'react';

import { Example } from '@af/design-system-docs-ui';
import Button from '@atlaskit/button';

const TokensButtonCodeBlock = `import { B300, B400, B500, N0 } from '@atlaskit/theme/colors';
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

const TokensButton = () => {
  return <Button appearance="primary">Default button</Button>;
};

/**
 * __Tokens button example__
 *
 * A tokens button example {description}.
 */
const TokensButtonExample = () => {
  return (
    <Example
      Component={TokensButton}
      source={TokensButtonCodeBlock}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokensButtonExample;
