import React from 'react';

import examples from './content/block-card/examples';
import reference from './content/block-card/reference';
import { TabName } from './utils';
import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';
import InProgressMessage from './utils/in-progress-message';
import DocQuickLinks from './utils/doc-quick-links';

export default customMd`

${(<InProgressMessage />)}

${(<DocQuickLinks />)}

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}


`;
