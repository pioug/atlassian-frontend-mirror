import React, { useState } from 'react';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import { MockLinkPickerPromisePlugin } from '../src/__tests__/__helpers/mock-plugins';

const defaultPlugins = [
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab1',
		tabTitle: 'Confluence',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab2',
		tabTitle: 'Bitbucket',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab3',
		tabTitle: 'Jira',
	}),
];

export default function VrHideDisplayTextMultiplePlugins(): React.JSX.Element {
	const [plugins] = useState(defaultPlugins);
	return (
		<PageWrapper>
			<LinkPicker
				plugins={plugins}
				onSubmit={() => {}}
				onCancel={() => {}}
				hideDisplayText={true}
			/>
		</PageWrapper>
	);
}
