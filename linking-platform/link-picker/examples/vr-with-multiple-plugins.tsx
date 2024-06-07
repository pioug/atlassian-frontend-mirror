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
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab4',
		tabTitle: 'Github',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab5',
		tabTitle: 'Drive',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab6',
		tabTitle: 'Tab long name 3',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab7',
		tabTitle: 'Tab long name 4',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab8',
		tabTitle: 'Tab long name 5',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab9',
		tabTitle: 'Tab long name 6',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab10',
		tabTitle: 'Tab long name 7',
	}),
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab3',
		tabTitle: 'tab3',
	}),
];

export default function VrMultiplePlugins() {
	const [plugins, setPlugins] = useState(defaultPlugins);
	return (
		<PageWrapper>
			<button
				data-test-id="add-tab"
				onClick={() => {
					setPlugins([
						...plugins,
						new MockLinkPickerPromisePlugin({
							tabKey: 'tab11',
							tabTitle: 'Another tab',
						}),
					]);
				}}
			>
				add tab
			</button>
			<LinkPicker
				plugins={plugins}
				onSubmit={() => {}}
				onCancel={() => {}}
				featureFlags={{ scrollingTabs: true }}
			/>
		</PageWrapper>
	);
}
