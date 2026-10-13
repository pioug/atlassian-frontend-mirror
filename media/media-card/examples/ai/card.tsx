import React from 'react';

import Card from '@atlaskit/media-card/cardLoader';
import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';

type MediaCardExampleProps = {
	mediaClientConfig: MediaClientConfig;
	identifier: FileIdentifier;
	fileName: string;
};

export default function MediaCardExample({
	mediaClientConfig,
	identifier,
	fileName,
}: MediaCardExampleProps): React.JSX.Element {
	return (
		<figure>
			<figcaption>{fileName}</figcaption>
			<Card
				mediaClientConfig={mediaClientConfig}
				identifier={identifier}
				alt={`Preview of ${fileName}`}
				shouldOpenMediaViewer
				shouldEnableDownloadButton
			/>
		</figure>
	);
}
