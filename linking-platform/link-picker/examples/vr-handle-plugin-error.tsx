import React from 'react';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import {
	MockLinkPickerPromisePlugin,
	UnstableMockLinkPickerPlugin,
} from '../src/__tests__/__helpers/mock-plugins';

const plugins = [
	new MockLinkPickerPromisePlugin({
		tabKey: 'tab1',
		tabTitle: 'tab1',
	}),
	new UnstableMockLinkPickerPlugin({
		tabKey: 'tab2',
		tabTitle: 'Unstable',
	}),
	new UnstableMockLinkPickerPlugin({
		tabKey: 'tab3',
		tabTitle: 'Unauth',
		errorFallback: (error, retry) => null,
	}),
];

export default function VrHandlePluginError(): React.JSX.Element {
	return (
		<PageWrapper>
			<LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />
		</PageWrapper>
	);
}
