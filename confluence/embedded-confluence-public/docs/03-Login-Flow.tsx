import React from 'react';

import { md } from '@atlaskit/docs';

import Base from './base-document/base';

const loginFlow: React.ReactElement = md`
    ${(<Base content={require('!!raw-loader!./markdown-files/login-flow.md')} />)}
`;
export default loginFlow;
