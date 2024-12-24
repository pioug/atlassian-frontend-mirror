/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { FileIdentifier } from '@atlaskit/media-client';
import type { SSR } from '@atlaskit/media-common';
import { getRandomHex } from '@atlaskit/media-common';
import { useFilePreview } from '@atlaskit/media-file-preview';
import { MediaImage } from '@atlaskit/media-ui';

import type { Dimensions } from './types';
import { InlineImageCardLoadingView } from './views/loading-view';

export const InlineImageCard = ({
	dimensions,
	identifier,
	renderError,
	alt,
	isLazy,
	ssr,
	crop,
	stretch,
}: {
	identifier: FileIdentifier;
	renderError: (props: { error: Error }) => JSX.Element | null;
	dimensions?: Dimensions;
	isLazy?: boolean;
	alt?: string;
	ssr?: SSR;
	crop?: boolean;
	stretch?: boolean;
}) => {
	// Generate unique traceId for file
	const traceContext = useMemo(
		() => ({
			traceId: getRandomHex(8),
		}),
		[],
	);

	// TODO do we need to handle nonCriticalError
	const {
		preview,
		error: previewError,
		onImageError,
		onImageLoad,
		getSsrScriptProps,
		copyNodeRef,
	} = useFilePreview({
		identifier,
		ssr,
		dimensions,
		traceContext,
	});

	if (previewError) {
		return renderError({ error: previewError });
	}

	if (!preview) {
		return <InlineImageCardLoadingView />;
	}

	return (
		<Fragment>
			<MediaImage
				dataURI={preview.dataURI}
				alt={alt}
				previewOrientation={preview.orientation}
				onImageLoad={() => {
					onImageLoad(preview);
				}}
				onImageError={onImageError}
				loading={isLazy ? 'lazy' : undefined}
				forceSyncDisplay={!!ssr}
				crop={crop}
				stretch={stretch}
				ref={copyNodeRef}
			/>
			{getSsrScriptProps && (
				<script
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...getSsrScriptProps()}
				/>
			)}
		</Fragment>
	);
};
