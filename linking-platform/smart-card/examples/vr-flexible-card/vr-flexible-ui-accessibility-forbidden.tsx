/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { IntlProvider } from 'react-intl-next';

import ShortcutIcon from '@atlaskit/icon/core/migration/link-external--shortcut';
import { token } from '@atlaskit/tokens';

import { AsanaTask } from '../../examples-helpers/_jsonLDExamples';
import {
	type ActionItem,
	ActionName,
	Client,
	Provider,
	SmartLinkPosition,
	TitleBlock,
} from '../../src';
import FlexibleCard from '../../src/view/FlexibleCard';
import { getCardState, getJsonLdResponse } from '../utils/flexible-ui';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		const response = getJsonLdResponse(url, AsanaTask.meta, AsanaTask.data);
		return Promise.resolve(response);
	}
}

const actions: ActionItem[] = [
	{
		content: 'Open',
		hideContent: true,
		name: ActionName.CustomAction,
		icon: <ShortcutIcon label="open in new tab" color={token('color.icon', '#44546F')} />,
		iconPosition: 'before',
		onClick: () => console.log('Custom action!'),
		testId: 'action-item-custom',
	},
	{
		hideContent: true,
		name: ActionName.EditAction,
		onClick: () => console.log('Edit action!'),
	},
	{
		hideContent: true,
		name: ActionName.DeleteAction,
		onClick: () => console.log('Delete action!'),
	},
];

const renderForbiddenView = () => {
	const cardState = getCardState({
		data: undefined,
		meta: {
			visibility: 'restricted',
			access: 'forbidden',
			auth: [
				{
					key: 'some-flow',
					displayName: 'Flow',
					url: 'https://outbound-auth/flow',
				},
			],
		},
		status: 'forbidden',
	});
	return (
		<FlexibleCard
			cardState={cardState}
			url={`https://${status}-url?s=something%20went%20wrong`}
			onAuthorize={() => {}}
		>
			<TitleBlock
				actions={actions}
				position={SmartLinkPosition.Center}
				hideTitleTooltip={true}
				testId="keyboard-2"
			/>
		</FlexibleCard>
	);
};

export default () => (
	<VRTestWrapper>
		<IntlProvider locale="en">
			<Provider client={new CustomClient('staging')}>
				<h5>Keyboard navigation</h5>
				{renderForbiddenView()}
			</Provider>
		</IntlProvider>
	</VRTestWrapper>
);
