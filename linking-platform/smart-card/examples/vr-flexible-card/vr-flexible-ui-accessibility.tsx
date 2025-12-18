import React from 'react';

import { IntlProvider } from 'react-intl-next';

import ShortcutIcon from '@atlaskit/icon/core/link-external';
import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { AsanaTask } from '@atlaskit/link-test-helpers';
import { token } from '@atlaskit/tokens';

import { type ActionItem, ActionName, Card, SmartLinkPosition, TitleBlock } from '../../src';
import { getJsonLdResponse } from '../utils/flexible-ui';
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

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<IntlProvider locale="en">
			<Provider client={new CustomClient('staging')}>
				<Card appearance="inline" ui={{ clickableContainer: true }} url="https://link-url">
					<TitleBlock
						actions={actions}
						position={SmartLinkPosition.Center}
						showActionOnHover={true}
						hideTitleTooltip={true}
						testId="keyboard-1"
					/>
				</Card>
			</Provider>
		</IntlProvider>
	</VRTestWrapper>
);
