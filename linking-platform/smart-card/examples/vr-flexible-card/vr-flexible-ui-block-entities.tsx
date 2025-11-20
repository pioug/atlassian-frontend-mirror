import React from 'react';

import { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';

import { type ActionItem, ActionName, Card, SmartLinkPosition, TitleBlock } from '../../src';
import { mocks } from '../utils/common';
import VRTestWrapper from '../utils/vr-test-wrapper';

class CustomClient extends Client {
	fetchData(url: string) {
		return Promise.resolve(mocks.entityDataSuccess);
	}
}

const actions: ActionItem[] = [
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
	</VRTestWrapper>
);
