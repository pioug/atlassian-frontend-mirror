import React from 'react';

import overview from './content/card-ssr';
import examples from './content/card-ssr/examples';
import reference from './content/card-ssr/reference';
import { TabName } from './utils';
import ContentTabs from './utils/content-tabs';
import customMd from './utils/custom-md';

export default customMd`

${(
	<ContentTabs
		showQuickLinks={true}
		tabs={[
			{ name: TabName.Overview, content: overview },
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
