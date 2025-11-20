import React, { type SyntheticEvent, useState } from 'react';

import Link from '@atlaskit/link';
import { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';
import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';
import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';
import {
	type LinkPickerPluginsConfiguration,
	useLinkPickerPlugins,
} from '@atlassian/link-picker-plugins';
import { mockEndpoints } from '@atlassian/recent-work-client/mocks';

import { PageHeader, PageWrapper } from '../example-helpers/common';
import { mockAvailableSites } from '../example-helpers/mock-available-sites';
import { MOCK_DATA_V3 as mockRecentData } from '../example-helpers/mock-recents-data';
import { LinkPicker, type LinkPickerProps } from '../src';

type OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];

const smartCardClient = new CardClient('staging');

mockAvailableSites();
mockEndpoints(undefined, undefined, mockRecentData);

const LINK_PICKER_PLUGINS_CONFIG: LinkPickerPluginsConfiguration = {
	cloudId: 'DUMMY-7c8a2b74-595a-41c7-960c-fd32f8572cea',
	activityClientEndpoint: 'https://start.stg.atlassian.com/gateway/api/graphql',
	aggregatorUrl: 'https://sdog.jira-dev.com/gateway/api/xpsearch-aggregator',
	product: 'confluence',
};

function LinkPickerPlugins() {
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

	const { plugins, isLoading } = useLinkPickerPlugins(LINK_PICKER_PLUGINS_CONFIG);

	const linkPicker = isLinkPickerVisible && (
		<LinkPicker
			plugins={plugins}
			isLoadingPlugins={isLoading}
			url={link.url}
			displayText={link.displayText}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
		/>
	);

	return (
		<PageWrapper>
			<PageHeader>
				<p>
					Integration with <b>link-picker-plugins</b>.
				</p>
			</PageHeader>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ paddingBottom: token('space.250', '20px') }}>
				{fg('dst-a11y__replace-anchor-with-link__linking-platfo') ? (
					<Link id="test-link" href={link.url} target="_blank" onClick={handleClick}>
						{link.displayText || link.url}
					</Link>
				) : (
					// eslint-disable-next-line @atlaskit/design-system/no-html-anchor
					<a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
						{link.displayText || link.url}
					</a>
				)}
			</div>
			{linkPicker}
		</PageWrapper>
	);
}

export default function LinkPickerPluginsWrapper(): React.JSX.Element {
	return (
		<SmartCardProvider client={smartCardClient}>
			<LinkPickerPlugins />
		</SmartCardProvider>
	);
}
