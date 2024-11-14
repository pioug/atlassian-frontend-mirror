import React from 'react';

import overview from './content/card-in-editor';
import { TabName } from './utils';
import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';

export default customMd`

${(<ContentTabs showQuickLinks={true} tabs={[{ name: TabName.Overview, content: overview }]} />)}

`;
