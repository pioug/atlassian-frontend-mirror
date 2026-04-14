import React from 'react';

import { CardClient, SmartCardProvider } from '@atlaskit/link-provider';

import { Card } from '../src';

import { mocks } from './utils/common';
import ExampleContainer from './utils/example-container';

class CustomClient extends CardClient {
	fetchData(_url: string) {
		return Promise.resolve(mocks.entityDataSuccess);
	}
}

/**
 * VR snapshot for the inline card treatment cohort of
 * rovogrowth-640-inline-action-nudge-exp.
 *
 * Uses the real Card component with appearance="inline" so the snapshot
 * reflects the actual rendering pipeline (provider → resolver → inline view).
 */
const VRInlineCardResolvedRovoActions: {
	(): JSX.Element;
	displayName: string;
} = (): JSX.Element => {
	return (
		<ExampleContainer title="Inline Card with Rovo Actions">
			<SmartCardProvider
				client={new CustomClient('staging')}
				rovoOptions={{ isRovoEnabled: true, isRovoLLMEnabled: true }}
			>
				<Card appearance="inline" url="https://www.mockurl.com" />
			</SmartCardProvider>
		</ExampleContainer>
	);
};

VRInlineCardResolvedRovoActions.displayName = 'VRInlineCardResolvedRovoActions';

export default VRInlineCardResolvedRovoActions;
