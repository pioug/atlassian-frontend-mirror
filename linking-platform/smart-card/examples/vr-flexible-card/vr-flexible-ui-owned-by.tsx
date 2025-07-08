/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { UnicornResolvedClient } from '@atlaskit/link-test-helpers';
import { Stack } from '@atlaskit/primitives/compiled';
import { Card, OwnedByElement, TitleElement } from '@atlaskit/smart-card';

import { SmartCardProvider } from '../../src/state';
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
						<OwnedByElement textPrefix="owned_by" />
						<OwnedByElement textPrefix="owned_by_override" />
						<OwnedByElement textPrefix="owned_by_override" hideFormat />
					</Stack>
				</Card>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
