import React, { Fragment, useMemo, useState } from 'react';

import Range from '@atlaskit/range';
import { AtlassianLinkPickerPlugin, Scope } from '@atlassian/link-picker-atlassian-plugin';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import { PageWrapper } from '../example-helpers/common';
import { mockPluginEndpoints } from '../example-helpers/mock-plugin-endpoints';
import { MOCK_DATA_V3 as mockRecentData } from '../example-helpers/mock-recents-data';
import { LinkPicker } from '../src';

mockPluginEndpoints();
mockEndpoints(undefined, undefined, mockRecentData);

const NOOP = () => {};

function CustomPaddingExample() {
	const [paddingLeft, setPaddingLeft] = useState(16);
	const [paddingRight, setPaddingRight] = useState(16);
	const [paddingTop, setPaddingTop] = useState(16);
	const [paddingBottom, setPaddingBottom] = useState(16);
	const plugins = useMemo(
		() => [
			new AtlassianLinkPickerPlugin({
				cloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
				scope: Scope.ConfluenceContentType,
				aggregatorUrl: 'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',
				activityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',
			}),
		],
		[],
	);

	return (
		<Fragment>
			{[
				{
					side: 'Left',
					value: paddingLeft,
					onChange: setPaddingLeft,
				},
				{
					side: 'Right',
					value: paddingRight,
					onChange: setPaddingRight,
				},
				{
					side: 'Top',
					value: paddingTop,
					onChange: setPaddingTop,
				},
				{
					side: 'Bottom',
					value: paddingBottom,
					onChange: setPaddingBottom,
				},
			].map(({ side, value, onChange }) => {
				return (
					<Fragment key={side}>
						<label>
							Padding {side} ({value}px)
						</label>
						<Range step={1} value={value} onChange={(value) => onChange(value)} />
					</Fragment>
				);
			})}

			<LinkPicker
				plugins={plugins}
				onSubmit={NOOP}
				onCancel={NOOP}
				paddingLeft={`${paddingLeft}px`}
				paddingRight={`${paddingRight}px`}
				paddingTop={`${paddingTop}px`}
				paddingBottom={`${paddingBottom}px`}
			/>
		</Fragment>
	);
}

export default function CustomPaddingExampleWrapper() {
	return (
		<PageWrapper>
			<CustomPaddingExample />
		</PageWrapper>
	);
}
