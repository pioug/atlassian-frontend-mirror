import React from 'react';
import overview from './content/hooks';
import examples from './content/hooks/examples';
import { TabName } from './utils';

import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';
import DocQuickLinks from './utils/doc-quick-links';

export default customMd`

${(<DocQuickLinks />)}

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Overview, content: overview },
			{ name: TabName.Examples, content: examples },
		]}
	/>
)}
`;
