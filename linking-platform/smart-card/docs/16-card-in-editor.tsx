import React from 'react';
import customMd from './utils/custom-md';
import InProgressMessage from './utils/in-progress-message';
import DocQuickLinks from './utils/doc-quick-links';

export default customMd`

${(<InProgressMessage />)}

${(<DocQuickLinks />)}

`;
