import React from 'react';

import { md } from '@atlaskit/docs';

import Base from './base-document/base';

const embeddedPages: React.ReactElement = md`
    ${(<Base content={require('!!raw-loader!./markdown-files/components-of-embedded-pages.md')} />)}
`;
export default embeddedPages;
