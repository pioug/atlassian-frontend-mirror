import React, { useEffect } from 'react';

import { MockedMediaClientProvider } from '@atlaskit/media-client-react/mocked-media-client-provider';
import type { Identifier } from '@atlaskit/media-client/identifier';
import { generateItemWithBinaries } from '@atlaskit/media-test-data/items-with-binaries';
import type { ItemWithBinaries } from '@atlaskit/media-test-data/items-with-binaries/types';
import { defaultCollectionName } from '@atlaskit/media-test-helpers/collectionNames';
import { I18NWrapper } from '@atlaskit/media-test-helpers/I18nWrapper';
import { createStorybookMediaClientConfig } from '@atlaskit/media-test-helpers/mediaClientProvider';

import { MainWrapper } from '../example-helpers/MainWrapper';
import { MediaViewer } from '../src';

const prepareItem = async () => {
	const item = await generateItemWithBinaries.passwordPdf.passwordPdf();
	return item;
};
const mediaClientConfig = createStorybookMediaClientConfig();

const Example = (): React.JSX.Element | null => {
	const [selectedIdentifier, setSelectedIdentifier] = React.useState<Identifier | undefined>();

	const [itemWithBinaries, setItemWithBinaries] = React.useState<ItemWithBinaries | undefined>();

	useEffect(() => {
		prepareItem().then(([itemWithBinaries, selectedIdentifier]) => {
			setSelectedIdentifier(selectedIdentifier);
			setItemWithBinaries(itemWithBinaries);
		});
	}, []);

	if (!itemWithBinaries || !selectedIdentifier) {
		return null;
	}

	return (
		<MockedMediaClientProvider
			mockedMediaApi={{
				getFileBinaryURL: async () => itemWithBinaries.binaryUri,
				getItems: async () => ({
					data: {
						items: [itemWithBinaries.fileItem],
					},
				}),
			}}
		>
			<I18NWrapper>
				<MainWrapper>
					{selectedIdentifier && (
						<MediaViewer
							mediaClientConfig={mediaClientConfig}
							selectedItem={selectedIdentifier}
							items={[selectedIdentifier]}
							collectionName={defaultCollectionName}
							onClose={() => setSelectedIdentifier(undefined)}
						/>
					)}
				</MainWrapper>
			</I18NWrapper>
		</MockedMediaClientProvider>
	);
};

export default Example;
