import React, { useEffect, useState } from 'react';
import { type MediaClient, type MediaFileArtifacts, type MediaType } from '@atlaskit/media-client';

type NativeMediaViewerProps = {
	id: string;
	mediaClient: MediaClient;
};

const getMimeTypeFromArtifact = (artifact: keyof MediaFileArtifacts) => {
	switch (artifact) {
		case 'image.png':
			return 'image/png';
		case 'document.pdf':
			return 'application/pdf';
		case 'video_640.mp4':
		case 'video_1280.mp4':
			return 'video/mp4';
		case 'audio.mp3':
			return 'audio/mpeg';
		default:
			return '';
	}
};

const getArtifactUrl = (
	client: MediaClient,
	artifacts: MediaFileArtifacts,
	artifact: keyof MediaFileArtifacts,
) =>
	client.mediaStore
		.getArtifactURL(artifacts, artifact)
		.then((url) => fetch(url))
		.then((res) => res.blob())
		.then((blob) => blob.slice(0, blob.size, getMimeTypeFromArtifact(artifact)))
		.then((blob) => URL.createObjectURL(blob));

export const NativeMediaViewer = ({ id, mediaClient }: NativeMediaViewerProps) => {
	const [url, setUrl] = useState('');
	const [mediaType, setMediaType] = useState<MediaType | null>(null);

	useEffect(() => {
		const setArtifactUrl = (artifacts: MediaFileArtifacts, artifact: keyof MediaFileArtifacts) => {
			getArtifactUrl(mediaClient, artifacts, artifact).then((url) => setUrl(url));
		};
		if (id) {
			const subscribable = mediaClient.file.getFileState(id);
			const { unsubscribe } = subscribable.subscribe((state) => {
				if (state.status === 'processed') {
					if (state.artifacts['document.pdf']) {
						setArtifactUrl(state.artifacts, 'document.pdf');
						setMediaType('doc');
					} else if (state.artifacts['video_640.mp4']) {
						setArtifactUrl(state.artifacts, 'video_640.mp4');
						setMediaType('video');
					} else if (state.artifacts['audio.mp3']) {
						setArtifactUrl(state.artifacts, 'audio.mp3');
						setMediaType('audio');
					} else if (state.artifacts['image.png']) {
						setArtifactUrl(state.artifacts, 'image.png');
						setMediaType('image');
					} else {
						setMediaType('unknown');
					}
				} else if (state.status === 'failed-processing') {
					setMediaType('unknown');
				}
			});

			return unsubscribe;
		}
		return () => {};
	}, [id, mediaClient]);

	switch (mediaType) {
		case 'image':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlassian/a11y/alt-text -- Ignored via go/DSP-18766
			return <img style={{ width: '100%' }} src={url} />;
		case 'video':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlassian/a11y/media-has-caption -- Ignored via go/DSP-18766
			return <video style={{ width: '100%' }} src={url} />;
		case 'audio':
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop, @atlassian/a11y/media-has-caption -- Ignored via go/DSP-18766
			return <audio style={{ width: '100%' }} src={url} />;
		case 'doc':
			return (
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				<object type="application/pdf" style={{ width: '100%' }} data={url}>
					<embed type="application/pdf" src={url} />
				</object>
			);
		case null:
			return <div>Loading file ...</div>;
		case 'unknown':
			return <div>Unable to display file</div>;
		default:
			return <div>Unable to display file</div>;
	}
};
