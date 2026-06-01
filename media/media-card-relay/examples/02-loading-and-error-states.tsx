/**
 * @jsxRuntime classic
 * @jsx jsx
 *
 * Example demonstrating MediaCardRelay with different loading and error states.
 *
 * Shows three columns:
 * 1. Processing state — seeded with `processing` status; polling subscription will start
 * 2. Failed state — demonstrates the error rendering path
 * 3. No fragment ref — fallback behavior; Card will attempt client fetch
 */

import React from 'react';

import { css, jsx } from '@compiled/react';

import { MediaProvider } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { errorFileId, imageFileId } from '@atlaskit/media-test-helpers';

import { MediaCardRelay } from '../src';

import RelayMock, {
	useMockMediaItemRef,
	MOCK_PROCESSING_ITEM,
	MOCK_FAILED_ITEM,
} from './utils/relay-mock';
import { useMockMediaConfig } from './utils/useMockMediaConfig';

const columnStyles = css({
	flex: 1,
	minWidth: '250px',
	padding: '20px',
	borderWidth: '1px',
	borderStyle: 'solid',
	borderColor: '#ccc',
	borderRadius: '4px',
	backgroundColor: '#fafafa',
});

const columnHeadingStyles = css({
	marginTop: 0,
	marginBottom: '8px',
});

const columnDescriptionStyles = css({
	fontSize: '12px',
	color: '#666',
	marginBottom: '16px',
	lineHeight: 1.4,
});

const columnInnerStyles = css({
	minHeight: '200px',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundColor: '#fff',
	borderRadius: '4px',
	padding: '12px',
});

const pageStyles = css({
	padding: '40px',
	backgroundColor: '#f5f5f5',
	minHeight: '100vh',
});

const pageHeadingStyles = css({
	marginTop: 0,
	marginBottom: '32px',
});

const columnRowStyles = css({
	display: 'flex',
	gap: '20px',
	alignItems: 'stretch',
});

/**
 * Column component for organizing each state example with a heading and explanation.
 */
function StateColumn({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}): React.JSX.Element {
	return (
		<div css={columnStyles}>
			<h3 css={columnHeadingStyles}>{title}</h3>
			<p css={columnDescriptionStyles}>{description}</p>
			<div css={columnInnerStyles}>{children}</div>
		</div>
	);
}

/**
 * Inner component for ProcessingStateColumn — rendered inside <RelayMock> so
 * useMockMediaItemRef can access the Relay context provided by RelayMock.
 */
function ProcessingStateContent({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const mediaItemRef = useMockMediaItemRef(MOCK_PROCESSING_ITEM);

	return (
		<MediaProvider mediaClientConfig={mediaClientConfig}>
			<StateColumn
				title="Processing State"
				description="Item is being processed. The Card is seeded with 'processing' status and a polling subscription will start automatically."
			>
				<MediaCardRelay
					mediaItemRef={mediaItemRef}
					identifier={imageFileId}
					mediaClientConfig={mediaClientConfig}
				/>
			</StateColumn>
		</MediaProvider>
	);
}

/**
 * Processing state example — shows a media item seeded with `processing` status.
 * The polling subscription will start automatically once the Card is mounted.
 */
function ProcessingStateColumn({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	return (
		<RelayMock>
			<ProcessingStateContent mediaClientConfig={mediaClientConfig} />
		</RelayMock>
	);
}

/**
 * Inner component for FailedStateColumn — rendered inside <RelayMock> so
 * useMockMediaItemRef can access the Relay context provided by RelayMock.
 */
function FailedStateContent({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	const mediaItemRef = useMockMediaItemRef(MOCK_FAILED_ITEM);

	return (
		<MediaProvider mediaClientConfig={mediaClientConfig}>
			<StateColumn
				title="Failed State"
				description="Item processing has failed. The Card displays the error state with appropriate messaging."
			>
				<MediaCardRelay
					mediaItemRef={mediaItemRef}
					identifier={errorFileId}
					mediaClientConfig={mediaClientConfig}
				/>
			</StateColumn>
		</MediaProvider>
	);
}

/**
 * Failed state example — demonstrates the error rendering path when an item
 * has failed processing.
 */
function FailedStateColumn({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	return (
		<RelayMock>
			<FailedStateContent mediaClientConfig={mediaClientConfig} />
		</RelayMock>
	);
}

/**
 * No fragment ref example — fallback behavior when no mediaItemRef is provided.
 * The Card will attempt a client-side fetch.
 */
function NoFragmentRefColumn({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}): React.JSX.Element {
	return (
		<RelayMock>
			<MediaProvider mediaClientConfig={mediaClientConfig}>
				<StateColumn
					title="No Fragment Ref"
					description="No mediaItemRef provided (null). The Card will attempt to fetch data client-side."
				>
					<MediaCardRelay
						mediaItemRef={null}
						identifier={imageFileId}
						mediaClientConfig={mediaClientConfig}
						testId="card-relay-no-fragment-ref"
					/>
				</StateColumn>
			</MediaProvider>
		</RelayMock>
	);
}

/**
 * Main example component demonstrating loading and error states across three columns.
 */
export const LoadingAndErrorStatesExample = (): React.JSX.Element => {
	const mediaClientConfig = useMockMediaConfig();

	if (!mediaClientConfig) {
		return <div css={pageStyles}>Loading auth…</div>;
	}

	return (
		<div css={pageStyles}>
			<h1 css={pageHeadingStyles}>Loading and Error States</h1>
			<div css={columnRowStyles}>
				<ProcessingStateColumn mediaClientConfig={mediaClientConfig} />
				<FailedStateColumn mediaClientConfig={mediaClientConfig} />
				<NoFragmentRefColumn mediaClientConfig={mediaClientConfig} />
			</div>
		</div>
	);
};

export default LoadingAndErrorStatesExample;
