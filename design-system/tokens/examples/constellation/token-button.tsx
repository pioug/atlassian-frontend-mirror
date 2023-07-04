import React from 'react';

import Button from '@atlaskit/button';

// eslint-disable-next-line @atlassian/tangerine/import/no-relative-package-imports
import { Example } from '../../../../../services/design-system-docs/src/__DO_NOT_ADD_TO_THIS_FOLDER__/gatsby-theme-brisk/components/example/Example';

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
