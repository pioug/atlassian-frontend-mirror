import React, { useEffect } from 'react';
import { type Identifier } from '@atlaskit/media-client';
import {
	createStorybookMediaClientConfig,
	defaultCollectionName,
	I18NWrapper,
} from '@atlaskit/media-test-helpers';
import { generateItemWithBinaries, type ItemWithBinaries } from '@atlaskit/media-test-data';
import { MockedMediaClientProvider } from '@atlaskit/media-client-react/test-helpers';

import { MediaViewer } from '../src';
import { MainWrapper } from '../example-helpers/MainWrapper';

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
