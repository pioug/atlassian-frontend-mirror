import React, { Fragment, type SyntheticEvent, useMemo, useState } from 'react';

import { defineMessages } from 'react-intl-next';

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

function CustomMessagesExample() {
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

	const customMessages = defineMessages({
		linkLabel: {
			id: 'fabric.editor.custom.linkLabel',
			defaultMessage: 'This is a custom label',
			description: 'Label for the link input',
		},
		linkPlaceholder: {
			id: 'fabric.editor.custom.linkPlaceholder',
			defaultMessage: 'This is a custom placeholder text',
			description: 'Placeholder for the link input',
		},
		linkTextLabel: {
			id: 'fabric.editor.custom.linkTextLabel',
			defaultMessage: 'This is a custom label',
			description: 'Label for the link display text',
		},
		linkTextPlaceholder: {
			id: 'fabric.editor.custom.linkTextPlaceholder',
			defaultMessage: 'This is a custom placeholder text',
			description: 'Placeholder for the link display text',
		},
		submitButtonLabel: {
			id: 'fabric.editor.custom.submitButtonLabel',
			defaultMessage: 'This is a custom button label',
			description: 'Label for the submit button',
		},
	});

	const linkPicker = isLinkPickerVisible && (
		<LinkPicker
			plugins={plugins}
			url={link.url}
			displayText={link.displayText}
			onSubmit={handleSubmit}
			onCancel={handleCancel}
			customMessages={customMessages}
		/>
	);

	return (
		<Fragment>
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ paddingBottom: token('space.250', '20px') }}>
				<a id="test-link" href={link.url} target="_blank" onClick={handleClick}>
					{link.displayText || link.url}
				</a>
			</div>
			{linkPicker}
		</Fragment>
	);
}

export default function CustomMessagesExampleWrapper() {
	return (
		<PageWrapper>
			<CustomMessagesExample />
		</PageWrapper>
	);
}
