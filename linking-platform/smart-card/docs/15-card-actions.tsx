import React from 'react';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';
import InProgressMessage from './utils/in-progress-message';

// Dev note: List down all smart links action: preview, download, jira status change,
// follow project and goal, ai summary, relate link, automation etc.
export default customMd`

${(<InProgressMessage />)}

${(<DocQuickLinks />)}

`;
