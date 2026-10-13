import React from 'react';

import MediaInlineCard from '@atlaskit/media-card/loader';
import type { FileIdentifier } from '@atlaskit/media-client/identifier';
import type { MediaClientConfig } from '@atlaskit/media-core/auth';

type MediaInlineCardExampleProps = {
	mediaClientConfig: MediaClientConfig;
	identifier: FileIdentifier;
	resolveFileName: (fileId: string) => Promise<string>;
};

export default function MediaInlineCardExample({
	mediaClientConfig,
	identifier,
	resolveFileName,
}: MediaInlineCardExampleProps): React.JSX.Element {
	return (
		<p>
			Review the attached{' '}
			<MediaInlineCard
				mediaClientConfig={mediaClientConfig}
				identifier={identifier}
				shouldOpenMediaViewer
				fallbackMediaNameFetcher={resolveFileName}
			/>{' '}
			before you send the update.
		</p>
	);
}
