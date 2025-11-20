import React from 'react';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import { MockLinkPickerPlugin } from '../src/__tests__/__helpers/mock-plugins';

const plugins = [new MockLinkPickerPlugin()];

export default function VrHideDisplayTextSinglePlugin(): React.JSX.Element {
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
