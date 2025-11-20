import React from 'react';

import { SmartCardProvider as Provider } from '@atlaskit/link-provider';
import { mocks, ResolvingClient } from '@atlaskit/link-test-helpers';

import {
	type CardProps,
	ElementName,
	SmartLinkPosition,
	SmartLinkSize,
	TitleBlock,
} from '../../src';
import { CardSSR as Card } from '../../src/ssr';
import VRTestWrapper from '../utils/vr-test-wrapper';

const uiOptions: CardProps['ui'] = {
	clickableContainer: true,
	size: SmartLinkSize.Medium,
	removeBlockRestriction: true,
};

export default (): React.JSX.Element => (
	<VRTestWrapper>
		<Provider client={new ResolvingClient()}>
			<Card
				appearance="inline"
				ui={uiOptions}
				url="https://link-url"
				// ANIP-288: placeholderData is not part of the public API for CardProps YET
				{...{ placeholderData: mocks.simpleProjectPlaceholderData }}
			>
				<TitleBlock
					maxLines={1}
					metadata={[
						{
							name: ElementName.State,
						},
					]}
					position={SmartLinkPosition.Center}
					showActionOnHover={true}
					hideTitleTooltip={true}
					testId="with-placeholder-data-1"
				/>
			</Card>
		</Provider>
	</VRTestWrapper>
);
