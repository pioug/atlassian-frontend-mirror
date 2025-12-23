import React from 'react';

// @ts-ignore - TS1192 TypeScript 5.9.2 upgrade
import fetchMock from 'fetch-mock/cjs/client';
import { IntlProvider } from 'react-intl-next';

import { cssMap } from '@atlaskit/css';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { Box } from '@atlaskit/primitives/compiled';
import { ReactRenderer } from '@atlaskit/renderer';
import { token } from '@atlaskit/tokens';

import { getEmojiProviderForCloudId } from '../src/provider';

import adfDoc from './__mocks__/adfDoc.json';
import emojiMockData from './__mocks__/emojiData.json';

// Unmatched routes will fallback to the network
fetchMock.config.fallbackToNetwork = true;

// Mocking the emoji API endpoint
fetchMock.mock('path:/gateway/api/emoji/standard', emojiMockData, {
	overwriteRoutes: true,
});

const mockCloudId = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';
const mockUser = {
	accountId: '627bf65fa20bd0006fda4d67',
};

const styles = cssMap({
	container: {
		width: '800px',
		paddingTop: token('space.300'),
		paddingRight: token('space.300'),
		paddingBottom: token('space.300'),
		paddingLeft: token('space.300'),
	},
});

const Renderer = () => {
	const dataProviders = ProviderFactory.create({
		emojiProvider: getEmojiProviderForCloudId(mockCloudId, mockUser.accountId),
	});

	return (
		<Box xcss={styles.container}>
			<ReactRenderer
				appearance="comment"
				document={adfDoc}
				dataProviders={dataProviders}
				media={{
					allowCaptions: true,
				}}
			/>
		</Box>
	);
};
export default function RendererWithProvidersExample(): React.JSX.Element {
	return (
		<IntlProvider locale="en">
			<Renderer />
		</IntlProvider>
	);
}
