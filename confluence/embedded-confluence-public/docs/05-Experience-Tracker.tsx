import React from 'react';

import { md } from '@atlaskit/docs';

import Base from './base-document/base';

const experienceTracker: React.ReactElement = md`
    ${(<Base content={require('!!raw-loader!./markdown-files/experience-tracker.md')} />)}
`;
export default experienceTracker;
