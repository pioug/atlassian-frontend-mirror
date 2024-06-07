import React from 'react';

import ContentTabs from './utils/content-tabs';
import { TabName } from './utils';
import FlexibleUiMessage from './utils/flexible-ui-message';
import examples from './content/action-item/examples';
import reference from './content/action-item/reference';
import FlexibleUiQuickLinks from './utils/flexible-ui-quick-links';
import customMd from './utils/custom-md';

export default customMd`

${(<FlexibleUiMessage />)}

${(<FlexibleUiQuickLinks />)}

## Flexible Smart Links: ActionItem

Certain blocks such as [TitleBlock](./title-block) and [FooterBlock](./footer-block) can render link actions.
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
