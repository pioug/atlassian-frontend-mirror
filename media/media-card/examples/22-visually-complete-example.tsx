import CardLoader from '../src/card/cardLoader';
import React, { useEffect, useState } from 'react';
import { generateItemWithBinaries } from '@atlaskit/media-test-data';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { getVCObserver } from '@atlaskit/react-ufo/vc';
import { type FileIdentifier } from '@atlaskit/media-client';

import { MainWrapper } from '../example-helpers';
import { createMockedMediaClientProviderWithBinaries } from '../src/utils/__tests__/utils/mockedMediaClientProvider/_MockedMediaClientProviderWithBinaries';
import { closeAction, deleteAction } from '../example-helpers';

const setup = async () => {
	const [fileItem, identifier] =
		await generateItemWithBinaries.workingImgWithRemotePreview.jpgCat();
	const { MockedMediaClientProvider, mediaApi } = createMockedMediaClientProviderWithBinaries({
		initialItemsWithBinaries: [fileItem],
	});

	const originalGetItems = mediaApi.getItems;
	const originalGetImage = mediaApi.getImage;

	mediaApi.getItems = async (...args) => {
		await new Promise((resolve) => setTimeout(resolve, 300));
		return originalGetItems(...args);
	};

	mediaApi.getImage = async (...args) => {
		await new Promise((resolve) => setTimeout(resolve, 600));
		return originalGetImage(...args);
	};
	return { identifier, MockedMediaClientProvider };
};

// @ts-ignore
if (!window.VCObserver) {
	// @ts-ignore
	window.VCObserver = getVCObserver();
	// @ts-ignore
	window.VCObserver.start({ startTime: 0 });
}

export default (): React.JSX.Element | null => {
	const [config, setConfig] = useState<{
		identifier: FileIdentifier;
		MockedMediaClientProvider: any;
	} | null>(null);

	const [vcStatus, setVcStatus] = useState('');

	useEffect(() => {
		setup().then(setConfig);
	}, []);

	useEffect(() => {
		let interval = setInterval(() => {
			setVcStatus(
				// @ts-ignore
				Object.values(window.VCObserver.getVCRawData().componentsLog)
					// @ts-ignore
					.map((val) => val.map((v) => v.targetName).join(' || '))
					.join('\n'),
			);
		}, 1000);

		return () => clearInterval(interval);
	}, []);

	if (!config) {
		return null;
	}
	const { MockedMediaClientProvider, identifier } = config;
	return (
		<MainWrapper developmentOnly>
			<MockedMediaClientProvider>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ display: 'flex', flexDirection: 'row' }}>
					<CardLoader
						mediaClientConfig={{} as MediaClientConfig}
						identifier={identifier}
						isLazy={false}
						actions={[deleteAction, closeAction]}
						shouldOpenMediaViewer
						mediaViewerItems={[identifier]}
						useInlinePlayer
					/>
				</div>
			</MockedMediaClientProvider>
			<div>
				<pre>{vcStatus}</pre>
			</div>
		</MainWrapper>
	);
};
