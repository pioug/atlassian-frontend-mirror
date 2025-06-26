/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { UnicornResolvedClient } from '@atlaskit/link-test-helpers';
import { Stack } from '@atlaskit/primitives/compiled';
import { Card, SmartLinkSize, SmartLinkTheme, TitleElement } from '@atlaskit/smart-card';

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
						<TitleElement size={SmartLinkSize.XLarge} />
						<TitleElement size={SmartLinkSize.Large} />
						<TitleElement size={SmartLinkSize.Medium} />
						<TitleElement size={SmartLinkSize.Small} />
						<TitleElement theme={SmartLinkTheme.Black} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.XLarge} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.Large} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.Medium} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.Small} />
					</Stack>
				</Card>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
