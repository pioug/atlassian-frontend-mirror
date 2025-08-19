import React, { useState } from 'react';
import EmojiUploader from '../src/components/uploader/EmojiUploader';
import Button from '@atlaskit/button/standard-button';

// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling
// eslint-disable-next-line import/no-extraneous-dependencies
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
// eslint-disable-next-line import/no-extraneous-dependencies
import { loggedUser } from '@atlaskit/util-data-test/logged-user';

import type { EmojiProvider } from '../src/resource';
import { IntlProvider } from 'react-intl-next';

export default function EmojiUploaderDisableFocusLock() {
	const [disableFocusLock, setDisableFocusLock] = useState(false);
	
	const emojiProvider: Promise<EmojiProvider> = getEmojiResource({
		uploadSupported: true,
		currentUser: { id: loggedUser },
	});

	return (
		<IntlProvider locale="en">
			{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
			<div style={{ padding: '10px' }}>
				<h3>Emoji Uploader with Focus Lock Control</h3>
				
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<div style={{ marginBottom: '20px' }}>
					<Button
						onClick={() => setDisableFocusLock(!disableFocusLock)}
						appearance="primary"
					>
						{disableFocusLock ? 'Enable Focus Lock' : 'Disable Focus Lock'}
					</Button>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<p style={{ marginTop: '10px', fontWeight: 'bold' }}>
						Focus Lock is currently: {disableFocusLock ? 'DISABLED' : 'ENABLED'}
					</p>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
					<p style={{ fontSize: '14px', color: '#666' }}>
						When Focus Lock is disabled, focus will not be trapped within the emoji uploader.
						This is useful for accessibility scenarios where focus trapping might interfere 
						with screen readers or other assistive technologies.
					</p>
				</div>

				<EmojiUploader 
					emojiProvider={emojiProvider} 
					disableFocusLock={disableFocusLock}
				/>
			</div>
		</IntlProvider>
	);
}