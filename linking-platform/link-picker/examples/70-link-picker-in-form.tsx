import React, { Fragment, type SyntheticEvent, useMemo, useState } from 'react';

import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { token } from '@atlaskit/tokens';
import { AtlassianLinkPickerPlugin, Scope } from '@atlassian/link-picker-atlassian-plugin';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import { PageWrapper } from '../example-helpers/common';
import { mockPluginEndpoints } from '../example-helpers/mock-plugin-endpoints';
import { MOCK_DATA_V3 as mockRecentData } from '../example-helpers/mock-recents-data';
import { LinkPicker, type LinkPickerProps } from '../src';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

mockPluginEndpoints();
mockEndpoints(undefined, undefined, mockRecentData);

function Basic() {
	const [link, setLink] = useState<OnSubmitPayload>({
		url: '',
		displayText: null,
		title: null,
		meta: {
			inputMethod: 'manual',
		},
	});
	const [isLinkPickerVisible, setIsLinkPickerVisible] = useState(true);
	const linkAnalytics = useSmartLinkLifecycleAnalytics();

	const handleSubmit: LinkPickerProps['onSubmit'] = (payload, analytic) => {
		console.log('link picker onSubmit called');
		setLink(payload);
		linkAnalytics.linkCreated(payload, analytic);
		setIsLinkPickerVisible(false);
	};

	const handleClick = (e: SyntheticEvent) => {
		e.preventDefault();
		e.stopPropagation();
		setIsLinkPickerVisible(true);
	};

	const handleCancel = () => setIsLinkPickerVisible(false);

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

	const linkPicker = isLinkPickerVisible && (
		<form>
			<LinkPicker
				plugins={plugins}
				url={link.url}
				displayText={link.displayText}
				onSubmit={handleSubmit}
				onCancel={handleCancel}
			/>
		</form>
	);

	return (
		<Fragment>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ paddingBottom: token('space.250', '20px') }}>
				<p>
					Open the isolated view and ensure React 18 is being used (`IS_REACT_18=true yarn start
					link-picker`). Without `onSubmitCapture` the entire page reloads when submitting the link
					picker.
				</p>
				{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
				<a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
					{link.displayText || link.url}
				</a>
			</div>
			{linkPicker}
		</Fragment>
	);
}

export default function BasicWrapper() {
	return (
		<PageWrapper>
			<Basic />
		</PageWrapper>
	);
}
