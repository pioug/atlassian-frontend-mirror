import React, { useState } from 'react';
import {
	createStorybookMediaClientConfig,
	defaultCollectionName,
} from '@atlaskit/media-test-helpers';
import { type Identifier, MediaClient } from '@atlaskit/media-client';
import { NativeMediaPreview } from '../example-helpers/NativeMediaPreview';
import { imageItem } from '../example-helpers';
import { MediaViewer } from '../src';

const mediaClientConfig = createStorybookMediaClientConfig();
const mediaClient = new MediaClient(mediaClientConfig);

const Example = () => {
	const [selectedIdentifier, setSelectedIdentifier] = useState<Identifier | undefined>();

	return (
		<>
			<NativeMediaPreview
				identifier={imageItem}
				mediaClient={mediaClient}
				onClick={() => setSelectedIdentifier(imageItem)}
			/>
			{selectedIdentifier && (
				<MediaViewer
					mediaClientConfig={mediaClientConfig}
					selectedItem={selectedIdentifier}
					items={[selectedIdentifier]}
					collectionName={defaultCollectionName}
					onClose={() => setSelectedIdentifier(undefined)}
				/>
			)}
		</>
	);
};

export default Example;
