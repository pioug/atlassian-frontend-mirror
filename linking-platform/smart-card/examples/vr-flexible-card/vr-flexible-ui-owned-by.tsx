/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { Stack } from '@atlaskit/primitives/compiled';
import { Card, OwnedByElement, TitleElement } from '@atlaskit/smart-card';

import { SmartCardProvider } from '../../src/state';
import { UnicornResolvedClient } from '../utils/custom-client';
import VRTestWrapper from '../utils/vr-test-wrapper';

export default () => {
	return (
		<VRTestWrapper>
			<SmartCardProvider client={new UnicornResolvedClient()}>
				<Card
					appearance="block"
					url="https://some.url"
					ui={{
						removeBlockRestriction: true,
					}}
				>
					<Stack space="space.100">
						<TitleElement />
						<OwnedByElement />
						<OwnedByElement textPrefix="textPrefix" />
						<OwnedByElement textPrefix="textPrefix" hideFormat />
					</Stack>
				</Card>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
