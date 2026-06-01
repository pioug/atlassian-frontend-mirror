/**
 * @jsxRuntime classic
 * @jsx jsx
 *
 * Example showing MediaCardRelay with card action props.
 *
 * Demonstrates how MediaCardRelay forwards CardProps to the Card component:
 * - onClick handler with click counter
 * - actions menu with custom handlers
 * - selected state combined with disableOverlay
 */

import { useState } from 'react';

import { css, jsx } from '@compiled/react';

import type { CardAction } from '@atlaskit/media-card';
import { MediaProvider } from '@atlaskit/media-client-react';
import type { MediaClientConfig } from '@atlaskit/media-core';
import { imageFileId } from '@atlaskit/media-test-helpers';

import { MediaCardRelay } from '../src';

import RelayMock, { useMockMediaItemRef, MOCK_IMAGE_ITEM } from './utils/relay-mock';
import { useMockMediaConfig } from './utils/useMockMediaConfig';

const variantStyles = css({
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	gap: '12px',
});

const variantHeadingStyles = css({
	margin: '0 0 8px 0',
	fontSize: '14px',
	fontWeight: 600,
});

const variantFooterStyles = css({
	fontSize: '12px',
	color: '#626262',
	textAlign: 'center',
	marginTop: '4px',
});

const gridStyles = css({
	display: 'grid',
	gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
	gap: '32px',
	padding: '24px',
	backgroundColor: '#fafbfc',
	borderRadius: '4px',
});

/**
 * Variant 1: Card with onClick handler that tracks click count.
 */
function ClickHandlerVariant({ mediaClientConfig }: { mediaClientConfig: MediaClientConfig }) {
	const [clickCount, setClickCount] = useState(0);
	const mediaItemRef = useMockMediaItemRef(MOCK_IMAGE_ITEM);

	const handleClick = () => {
		setClickCount((prev) => prev + 1);
	};

	return (
		<div css={variantStyles}>
			<h3 css={variantHeadingStyles}>With Click Handler</h3>
			<MediaCardRelay
				mediaItemRef={mediaItemRef}
				identifier={imageFileId}
				mediaClientConfig={mediaClientConfig}
				dimensions={{ width: 200, height: 150 }}
				onClick={handleClick}
			/>
			<div css={variantFooterStyles}>
				Clicked {clickCount} {clickCount === 1 ? 'time' : 'times'}
			</div>
		</div>
	);
}

/**
 * Variant 2: Card with actions menu.
 */
function ActionsMenuVariant({ mediaClientConfig }: { mediaClientConfig: MediaClientConfig }) {
	const mediaItemRef = useMockMediaItemRef(MOCK_IMAGE_ITEM);

	const handleDownload = () => {
		alert('Download clicked!');
	};

	const handleShare = () => {
		alert('Share clicked!');
	};

	const actions: CardAction[] = [
		{
			label: 'Download',
			handler: handleDownload,
		},
		{
			label: 'Share',
			handler: handleShare,
		},
	];

	return (
		<div css={variantStyles}>
			<h3 css={variantHeadingStyles}>With Actions Menu</h3>
			<MediaCardRelay
				mediaItemRef={mediaItemRef}
				identifier={imageFileId}
				mediaClientConfig={mediaClientConfig}
				dimensions={{ width: 200, height: 150 }}
				actions={actions}
			/>
			<div css={variantFooterStyles}>Hover to reveal actions</div>
		</div>
	);
}

/**
 * Variant 3: Card with selected state and disabled overlay.
 */
function SelectedWithNoOverlayVariant({
	mediaClientConfig,
}: {
	mediaClientConfig: MediaClientConfig;
}) {
	const mediaItemRef = useMockMediaItemRef(MOCK_IMAGE_ITEM);

	return (
		<div css={variantStyles}>
			<h3 css={variantHeadingStyles}>Selected + No Overlay</h3>
			<MediaCardRelay
				mediaItemRef={mediaItemRef}
				identifier={imageFileId}
				mediaClientConfig={mediaClientConfig}
				dimensions={{ width: 200, height: 150 }}
				selected={true}
				disableOverlay={true}
			/>
			<div css={variantFooterStyles}>Selected state without overlay</div>
		</div>
	);
}

/**
 * Main example component displaying three MediaCardRelay variants with different card action props.
 */
export default function CardActionsExample(): JSX.Element {
	const mediaClientConfig = useMockMediaConfig();

	if (!mediaClientConfig) {
		return <div css={gridStyles}>Loading auth…</div>;
	}

	return (
		<RelayMock>
			<MediaProvider mediaClientConfig={mediaClientConfig}>
				<div css={gridStyles}>
					<ClickHandlerVariant mediaClientConfig={mediaClientConfig} />
					<ActionsMenuVariant mediaClientConfig={mediaClientConfig} />
					<SelectedWithNoOverlayVariant mediaClientConfig={mediaClientConfig} />
				</div>
			</MediaProvider>
		</RelayMock>
	);
}
