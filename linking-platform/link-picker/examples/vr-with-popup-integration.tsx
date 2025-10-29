import React from 'react';

import Button from '@atlaskit/button/new';
import Popup from '@atlaskit/popup';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import { MockLinkPickerPlugin } from '../src/__tests__/__helpers/mock-plugins';

const plugins = [new MockLinkPickerPlugin()];

export default function VrSinglePlugin() {
	return (
		<PageWrapper>
			<Popup
				isOpen={true}
				autoFocus={false}
				onClose={() => {}}
				content={() => <LinkPicker plugins={plugins} onSubmit={() => {}} onCancel={() => {}} />}
				placement="bottom-start"
				trigger={({ ref, ...triggerProps }) => (
					<Button {...triggerProps} ref={ref} appearance="primary" isSelected>
						Toggle
					</Button>
				)}
			/>
		</PageWrapper>
	);
}
