import React, { useState } from 'react';
import { Card } from '../src';
import { Box, Flex } from '@atlaskit/primitives';
import Heading from '@atlaskit/heading';
import { type MediaClientConfig } from '@atlaskit/media-client';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import { ToggleBox } from '../example-helpers/svg-helpers';

import { MainWrapper } from '../example-helpers';
import { useCreateMockedMediaClientProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';

const dummyMediaClientConfig = {} as MediaClientConfig;

const initialItems = [
	generateItemWithBinaries.abuse.image(),
	generateItemWithBinaries.abuse.svg(),
	generateItemWithBinaries.workingPdfWithRemotePreview.pdfAnatomy(),
];

export default () => {
	const [reloadKey, setReloadkey] = useState(0);
	const [enforceDataSecurityPolicy, setEnforceDataSecurityPolicy] = useState(false);

	const { identifiers, items, MockedMediaClientProvider } =
		useCreateMockedMediaClientProviderWithBinaries({
			initialItems,
			mediaClientConfig: { enforceDataSecurityPolicy },
		});

	return (
		<MainWrapper developmentOnly>
			<ToggleBox
				label={'Enforce Data Security Policy'}
				isChecked={enforceDataSecurityPolicy}
				onChange={(v) => {
					setReloadkey(reloadKey + 1);
					setEnforceDataSecurityPolicy(v);
				}}
			/>
			<MockedMediaClientProvider key={`${reloadKey}`}>
				<Flex gap="space.100">
					{identifiers.map((identifier, i) => {
						const abuseClassification =
							items[i].fileItem.details.abuseClassification?.classification;

						return (
							<Box key={`media-card-${i}`}>
								<Heading size="medium">
									{!!abuseClassification ? abuseClassification : 'No Abuse'}
								</Heading>
								<Card
									mediaClientConfig={dummyMediaClientConfig}
									identifier={identifier}
									isLazy={false}
									shouldOpenMediaViewer
									mediaViewerItems={identifiers}
									useInlinePlayer
									disableOverlay={false}
									shouldEnableDownloadButton
								/>
							</Box>
						);
					})}
				</Flex>
			</MockedMediaClientProvider>
		</MainWrapper>
	);
};
