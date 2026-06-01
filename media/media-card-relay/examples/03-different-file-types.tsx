/**
 * @jsxRuntime classic
 * @jsx jsx
 *
 * Example showing MediaCardRelay with different file types.
 *
 * Demonstrates how MediaCardRelay handles various mediaType values:
 * - image (JPEG)
 * - video (MP4)
 * - doc (PDF)
 * - audio (MP3)
 * - unknown (binary file)
 */

import { css, jsx } from '@compiled/react';

import type { FileIdentifier } from '@atlaskit/media-client';
import { MediaProvider } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import {
	audioFileId,
	imageFileId,
	largePdfFileId,
	unknownFileId,
	videoFileId,
} from '@atlaskit/media-test-helpers';

import { MediaCardRelay } from '../src';

import RelayMock, {
	useMockMediaItemRef,
	MOCK_IMAGE_ITEM,
	MOCK_VIDEO_ITEM,
	MOCK_PDF_ITEM,
	MOCK_AUDIO_ITEM,
	MOCK_UNKNOWN_ITEM,
} from './utils/relay-mock';
import { useMockMediaConfig } from './utils/useMockMediaConfig';

const cellStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '8px',
});

const cellLabelStyles = css({
	fontSize: '12px',
	color: '#626262',
	textAlign: 'center',
	marginTop: '4px',
});

const gridStyles = css({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
	gap: '24px',
	padding: '24px',
	backgroundColor: '#fafbfc',
	borderRadius: '4px',
});

/**
 * Grid cell component that wraps a MediaCardRelay with a label. The fixture drives
 * the synthetic SSR seed; the identifier points at a real test file resolved
 * by the storybook MSW backend so the Card renders real metadata.
 */
function FileTypeCell({
	fixture,
	identifier,
	label,
	mediaClientConfig,
}: {
	fixture: Parameters<typeof useMockMediaItemRef>[0];
	identifier: FileIdentifier;
	label: string;
	mediaClientConfig: MediaClientConfig;
}) {
	const mediaItemRef = useMockMediaItemRef(fixture);

	return (
		<div css={cellStyles}>
			<MediaCardRelay
				mediaItemRef={mediaItemRef}
				identifier={identifier}
				mediaClientConfig={mediaClientConfig}
				dimensions={{ width: 200, height: 150 }}
			/>
			<div css={cellLabelStyles}>{label}</div>
		</div>
	);
}

/**
 * Example component displaying MediaCardRelay with different file types in a grid.
 */
export default function DifferentFileTypesExample(): JSX.Element {
	const mediaClientConfig = useMockMediaConfig();

	if (!mediaClientConfig) {
		return <div css={gridStyles}>Loading auth…</div>;
	}

	return (
		<RelayMock>
			<MediaProvider mediaClientConfig={mediaClientConfig}>
				<div css={gridStyles}>
					<FileTypeCell
						fixture={MOCK_IMAGE_ITEM}
						identifier={imageFileId}
						label="Image (JPEG)"
						mediaClientConfig={mediaClientConfig}
					/>
					<FileTypeCell
						fixture={MOCK_VIDEO_ITEM}
						identifier={videoFileId}
						label="Video (MP4)"
						mediaClientConfig={mediaClientConfig}
					/>
					<FileTypeCell
						fixture={MOCK_PDF_ITEM}
						identifier={largePdfFileId}
						label="Document (PDF)"
						mediaClientConfig={mediaClientConfig}
					/>
					<FileTypeCell
						fixture={MOCK_AUDIO_ITEM}
						identifier={audioFileId}
						label="Audio (MP3)"
						mediaClientConfig={mediaClientConfig}
					/>
					<FileTypeCell
						fixture={MOCK_UNKNOWN_ITEM}
						identifier={unknownFileId}
						label="Unknown (Binary)"
						mediaClientConfig={mediaClientConfig}
					/>
				</div>
			</MediaProvider>
		</RelayMock>
	);
}
