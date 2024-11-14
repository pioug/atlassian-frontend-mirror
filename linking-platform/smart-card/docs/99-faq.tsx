import React from 'react';

import Faq from './content/faq';
import customMd from './utils/custom-md';
import QuickLinks from './utils/quick-links';

export default customMd`

${(<QuickLinks />)}

${(<Faq />)}
`;
