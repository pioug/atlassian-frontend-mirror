import React, { Fragment, type SyntheticEvent, useMemo, useState } from 'react';

import Button from '@atlaskit/button/new';
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

function AdditionalErrorHandling() {
	const [link, setLink] = useState<OnSubmitPayload>({
		url: '',
		displayText: null,
		title: null,
		meta: {
			inputMethod: 'manual',
		},
	});

	const [applicationLink, setApplicationLink] = useState<string>();

	const [error, setError] = useState<string | null>(null);

	const linkAnalytics = useSmartLinkLifecycleAnalytics();

	const handleLinkPickerSubmit: LinkPickerProps['onSubmit'] = (payload, analytic) => {
		setLink(payload);
		linkAnalytics.linkCreated(payload, analytic);
	};

	const handleClick = (e: SyntheticEvent) => {
		e.preventDefault();
	};

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
	const handleFormSubmit = (e: SyntheticEvent) => {
		e.preventDefault();
		if (!link.url) {
			setError('A valid link is required.');
			return;
		}
		setError(null);
		setApplicationLink(link.url);
	};

	return (
		<Fragment>
			<form onSubmit={handleFormSubmit}>
				<div>Link added to application: {applicationLink || 'None'}</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ paddingBottom: token('space.250', '20px') }}>
					Preview:
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-anchor */}
					<a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
						{link.displayText || link.url || 'No link selected'}
					</a>
				</div>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ paddingBottom: token('space.250', '20px') }}>
					<LinkPicker
						plugins={plugins}
						url={link.url}
						displayText={link.displayText}
						onSubmit={handleLinkPickerSubmit}
						previewableLinksOnly
						additionalError={error}
						moveSubmitButton
					/>
				</div>
				<Button type="submit">Submit Form</Button>
			</form>
		</Fragment>
	);
}

export default function AdditionalErrorHandlingWrapper() {
	return (
		<PageWrapper>
			<AdditionalErrorHandling />
		</PageWrapper>
	);
}
