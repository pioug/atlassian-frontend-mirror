import React, { useEffect, useState } from 'react';

import { type MediaClient, type Identifier, type MediaFileArtifacts } from '@atlaskit/media-client';
import { Pressable, xcss } from '@atlaskit/primitives';

type NativeMediaViewerProps = {
	identifier: Identifier;
	mediaClient: MediaClient;
	onClick: () => void;
};

const nativePreviewButtonStyles = xcss({
	height: '125px',
	width: '156px',
	backgroundColor: 'color.background.neutral.subtle',
	overflow: 'hidden',
	padding: 'space.0',
});

export const NativeMediaPreview = ({
	identifier,
	mediaClient,
	onClick,
}: NativeMediaViewerProps) => {
	const [url, setUrl] = useState('dataURI' in identifier ? identifier.dataURI : '');
	const [isPreviewUnavailable, setIsPreviewUnavailable] = useState(false);

	useEffect(() => {
		if ('id' in identifier) {
			const subsribable = mediaClient.file.getFileState(identifier.id);

			const setArtifactUrl = (artifacts: MediaFileArtifacts, artifact: keyof MediaFileArtifacts) =>
				mediaClient.mediaStore.getArtifactURL(artifacts, artifact).then((url) => setUrl(url));

			const { unsubscribe } = subsribable.subscribe({
				next: (state) => {
					if (state.status === 'processed') {
						if (state.artifacts['image.png']) {
							setArtifactUrl(state.artifacts, 'image.png');
						} else if (state.artifacts['image.jpg']) {
							setArtifactUrl(state.artifacts, 'image.jpg');
						} else if (state.artifacts['thumb.jpg']) {
							setArtifactUrl(state.artifacts, 'thumb.jpg');
						} else {
							setIsPreviewUnavailable(true);
						}
					} else if (state.status === 'failed-processing') {
						setIsPreviewUnavailable(true);
					}
				},
				error: () => {
					setIsPreviewUnavailable(true);
				},
			});

			return unsubscribe;
		}
		return () => {};
	}, [identifier, mediaClient]);

	if (isPreviewUnavailable) {
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<Pressable testId="media-native-preview" xcss={nativePreviewButtonStyles} onClick={onClick}>
				Preview Unavailable
			</Pressable>
		);
	}

	if (url) {
		return (
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			<Pressable testId="media-native-preview" xcss={nativePreviewButtonStyles} onClick={onClick}>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, jsx-a11y/alt-text -- Ignored via go/DSP-18766 */}
				<img style={{ maxWidth: '100%' }} src={url} />
			</Pressable>
		);
	}

	return <div>Loading file ...</div>;
};
