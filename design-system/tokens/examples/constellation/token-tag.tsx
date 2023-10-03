/* eslint-disable @atlaskit/design-system/ensure-design-token-usage */
import React from 'react';

import { Example } from '@af/design-system-docs-ui';
import { SimpleTag as Tag } from '@atlaskit/tag';

const TokensTagCodeBlock = `
import { N800, P100, P500, P75 } from '@atlaskit/theme/colors';
import { token } from '@atlaskit/tokens';

// purple tag
color: token('color.text.accent.purple.bolder',N800),
background: token('color.background.accent.purple.subtle', colors.P100),

// light purple tag
color: token('color.text.accent.purple', P500),
background: token('color.background.accent.purple.subtler', P75),
`;

const TokensTag = () => {
  return (
    <>
      <Tag text="purple Tag" color="purple" />
      <Tag text="purpleLight Tag" color="purpleLight" />
    </>
  );
};

const TokensTagExample = () => {
  return (
    <Example
      Component={TokensTag}
      source={TokensTagCodeBlock}
      packageName="@atlaskit/tokens"
    />
  );
};

export default TokensTagExample;
