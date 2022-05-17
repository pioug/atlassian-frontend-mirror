import React from 'react';

import { md } from '@atlaskit/docs';

import Base from './base-document/base';

export default md`
    ${(
      <Base
        content={require('!!raw-loader!./markdown-files/api-references.md')}
      />
    )}
`;
