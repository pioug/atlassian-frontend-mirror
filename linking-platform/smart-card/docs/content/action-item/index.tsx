import React from 'react';
import { TabName } from '../../utils';

import ContentTabs from '../../utils/content-tabs';
import customMd from '../../utils/custom-md';
import examples from './examples';
import reference from './reference';

export default customMd`

## ActionItem

Certain blocks such as TitleBlock and FooterBlock can render link actions.
Each action item accepts an onClick event and provides preset icon and label.
With exception of a custom action which either Icon or label must be provided.

${(
	<ContentTabs
		tabs={[
			{ name: TabName.Examples, content: examples },
			{ name: TabName.Reference, content: reference },
		]}
	/>
)}
`;
