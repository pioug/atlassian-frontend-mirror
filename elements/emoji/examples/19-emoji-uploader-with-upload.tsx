import React from 'react';
import EmojiUploader from '../src/components/uploader/EmojiUploader';

// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
// eslint-disable-next-line import/no-extraneous-dependencies
import { loggedUser } from '@atlaskit/util-data-test/logged-user';

import { lorem } from '../example-helpers';
import type { EmojiProvider } from '../src/resource';
import { IntlProvider } from 'react-intl-next';

export default function EmojiUploaderWithUpload(): React.JSX.Element {
	const emojiProvider: Promise<EmojiProvider> = getEmojiResource({
		uploadSupported: true,
		currentUser: { id: loggedUser },
	});

	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ padding: '10px' }}>
				<EmojiUploader emojiProvider={emojiProvider} />
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<p style={{ width: '400px' }}>
					{lorem}
					{lorem}
				</p>
			</div>
		</IntlProvider>
	);
}
