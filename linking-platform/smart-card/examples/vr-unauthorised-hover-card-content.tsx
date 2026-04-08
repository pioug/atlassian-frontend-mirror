import React from 'react';

import { IntlProvider } from 'react-intl-next';

import { SmartCardProvider } from '@atlaskit/link-provider';

import { CardDisplay } from '../src/constants';
import ContentContainer from '../src/view/HoverCard/components/ContentContainer';
import RovoUnauthorisedView from '../src/view/HoverCard/components/views/unauthorised/RovoUnauthorisedView';
import { flexibleUiOptions } from '../src/view/HoverCard/styled';

import { getCardState } from './utils/flexible-ui';
import VRTestWrapper from './utils/vr-test-wrapper';

const url = 'https://www.mockurl.com';
const cardState = getCardState({
	data: { url },
	meta: {
		access: 'unauthorized',
		visibility: 'restricted',
		auth: [
			{
				key: 'google-object-provider',
				displayName: 'Atlassian Links - Google Drive',
				url: 'https://id.atlassian.com/outboundAuth/start?serviceKey=gdrive',
			},
		],
		definitionId: '440fdd47-25ac-4ac2-851f-1b7526365ade',
		key: 'google-object-provider',
	},
	status: 'unauthorized',
});

const uiOptions = {
	...flexibleUiOptions,
	enableSnippetRenderer: true,
};

const flexibleCardProps = {
	appearance: CardDisplay.HoverCardPreview,
	cardState,
	onClick: () => {},
	onResolve: () => {},
	origin: 'smartLinkPreviewHoverCard' as const,
	renderers: {},
	actionOptions: undefined,
	ui: uiOptions,
	url,
	children: null,
};

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<IntlProvider locale="en">
			<SmartCardProvider>
				<ContentContainer url={url} testId="vr-unauthorised-hover-card" widthAppearance="slim">
					<RovoUnauthorisedView
						url={url}
						flexibleCardProps={flexibleCardProps}
						extensionKey="google-object-provider"
					/>
				</ContentContainer>
			</SmartCardProvider>
		</IntlProvider>
	</VRTestWrapper>
);
