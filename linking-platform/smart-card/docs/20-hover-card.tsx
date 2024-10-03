import React from 'react';
import overview from './content/hover-card';
import examples from './content/hover-card/examples';
import reference from './content/hover-card/reference';
import { TabName } from './utils';

import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';
import InProgressMessage from './utils/in-progress-message';

export default customMd`

${(<InProgressMessage />)}

${(<DocQuickLinks />)}

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Overview, content: overview },
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
