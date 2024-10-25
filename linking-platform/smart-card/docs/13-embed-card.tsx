import React from 'react';

import overview from './content/embed-card';
import examples from './content/embed-card/examples';
import faq from './content/embed-card/faq';
import reference from './content/embed-card/reference';
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
			{ name: TabName.FAQ, content: faq },
		]}
	/>
)}


`;
