import React from 'react';

import { SmartCardProvider } from '@atlaskit/link-provider/smart-card-provider';
import {
	ResolvedClient,
	ResolvedClientEmbedUrl,
	ResolvedClientUrl,
} from '@atlaskit/link-test-helpers/smart-card/mocks/clients';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Box } from '@atlaskit/primitives/box';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Stack } from '@atlaskit/primitives/stack';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { Text } from '@atlaskit/primitives/text';
// eslint-disable-next-line @atlaskit/design-system/no-emotion-primitives -- to be migrated to @atlaskit/primitives/compiled – go/akcss
import { xcss } from '@atlaskit/primitives/xcss/xcss';

import { Card } from '../../src';
import { CardSSR } from '../../src/ssr';

const gapStyles = xcss({ height: '3000px' });

export default (): React.JSX.Element => (
	<SmartCardProvider client={new ResolvedClient('stg')}>
		<Stack grow="fill" space="space.600">
			<Box>
				<CardSSR appearance="inline" url={ResolvedClientUrl} />
			</Box>
			<Box xcss={gapStyles}>
				<Text>Scroll ⇣ to find a lazily loaded Smart Link 👇</Text>
			</Box>
			<Card appearance="block" url={ResolvedClientEmbedUrl} />
		</Stack>
	</SmartCardProvider>
);
