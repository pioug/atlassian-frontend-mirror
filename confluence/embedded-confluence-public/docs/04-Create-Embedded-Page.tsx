import React from 'react';

import { md } from '@atlaskit/docs';

import Base from './base-document/base';

const createEmbeddedPage: React.ReactElement = md`
    ${(<Base content={require('!!raw-loader!./markdown-files/create-embedded-page.md')} />)}
`;
export default createEmbeddedPage;
