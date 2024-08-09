/* eslint-disable @atlaskit/ui-styling-standard/enforce-style-prop */
// DELETE ME - this is a playground for developing the image from URL contents
// while the popup is developed. It should be tested in the popup once that work
// is done.

import React from 'react';

import { useAnalyticsEvents } from '@atlaskit/analytics-next';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import { MediaFromURL } from '@atlaskit/editor-plugins/media-insert';

import ToolsDrawer from '../example-helpers/ToolsDrawer';

export default function ImageFromURL() {
	const { createAnalyticsEvent } = useAnalyticsEvents();

	return (
		<ToolsDrawer
			renderEditor={({ mediaProvider }: { mediaProvider: Promise<MediaProvider> }) => (
				<div
					style={{
						margin: '3rem auto',
						padding: '1rem',
						width: '340px',
						border: '1px solid #091E4220',
						borderRadius: '3px',
						boxShadow: '0 0 12px #091E4215',
					}}
				>
					<MediaFromURL
						mediaProvider={mediaProvider}
						onInsert={(attrs) => console.log(JSON.stringify(attrs, null, 2))}
						onExternalInsert={(url) => console.log('External image', url)}
						dispatchAnalyticsEvent={(e) => createAnalyticsEvent(e).fire()}
					/>
				</div>
			)}
		/>
	);
}
