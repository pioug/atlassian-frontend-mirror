/* eslint-disable @atlaskit/design-system/no-unsafe-style-overrides */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { jsx } from '@compiled/react';

import { UnicornResolvedClient } from '@atlaskit/link-test-helpers';
import { Stack } from '@atlaskit/primitives/compiled';
import { Card, SmartLinkSize, SmartLinkTheme, TitleElement } from '@atlaskit/smart-card';

import { SmartLinkInternalTheme } from '../../src/constants';
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
						<TitleElement theme={SmartLinkTheme.Link} size={SmartLinkSize.XLarge} />
						<TitleElement theme={SmartLinkTheme.Link} size={SmartLinkSize.Large} />
						<TitleElement theme={SmartLinkTheme.Link} size={SmartLinkSize.Medium} />
						<TitleElement theme={SmartLinkTheme.Link} size={SmartLinkSize.Small} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.XLarge} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.Large} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.Medium} />
						<TitleElement theme={SmartLinkTheme.Black} size={SmartLinkSize.Small} />
						<TitleElement theme={SmartLinkInternalTheme.Grey} size={SmartLinkSize.XLarge} />
						<TitleElement theme={SmartLinkInternalTheme.Grey} size={SmartLinkSize.Large} />
						<TitleElement theme={SmartLinkInternalTheme.Grey} size={SmartLinkSize.Medium} />
						<TitleElement theme={SmartLinkInternalTheme.Grey} size={SmartLinkSize.Small} />
					</Stack>
				</Card>
			</SmartCardProvider>
		</VRTestWrapper>
	);
};
