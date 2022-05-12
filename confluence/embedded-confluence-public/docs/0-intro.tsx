import React from 'react';

import { Example, md, Props } from '@atlaskit/docs';

export default md`

  Public release version of Embedded Confluence

  ## Usage

  ${(
    <Example
      packageName="@atlaskit/embedded-confluence"
      title="Basic example"
    />
  )}

  ${(<Props heading="EmbeddedConfluence Props" />)}
`;
