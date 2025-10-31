import React from 'react';

import { md } from '@atlaskit/docs';

import Base from './base-document/base';

const apiReferences: React.ReactElement = md`
    ${(<Base content={require('!!raw-loader!./markdown-files/api-references.md')} />)}
`;
export default apiReferences;
