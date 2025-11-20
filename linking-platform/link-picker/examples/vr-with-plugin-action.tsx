import React, { Fragment, useMemo } from 'react';

import { token } from '@atlaskit/tokens';

import { PageWrapper } from '../example-helpers/common';
import { LinkPicker } from '../src';
import { MockLinkPickerPromisePlugin } from '../src/__tests__/__helpers/mock-plugins';

const link = {
	url: '',
	displayText: null,
	title: null,
	meta: {
		inputMethod: 'manual',
	},
};

export default function VrWithPluginAction(): React.JSX.Element {
	const plugins = useMemo(
		() => [
			new MockLinkPickerPromisePlugin({
				action: {
					label: {
						id: 'test',
						defaultMessage: 'Action',
						description: 'test action',
					},
					callback: () => {},
				},
			}),
		],
		[],
	);

	return (
		<PageWrapper>
			<Fragment>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ paddingBottom: token('space.250', '20px') }}>
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
					<a id="test-link" href={link.url} target="_blank">
						{link.displayText || link.url}
					</a>
				</div>
				<LinkPicker
					plugins={plugins}
					url={link.url}
					displayText={link.displayText}
					onSubmit={() => {}}
					onCancel={() => {}}
				/>
			</Fragment>
		</PageWrapper>
	);
}
