/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { Fragment, useCallback, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';

import type { FileIdentifier } from '@atlaskit/media-client';
import type { SSR } from '@atlaskit/media-common';
import { getRandomHex } from '@atlaskit/media-common';
import { useFilePreview } from '@atlaskit/media-file-preview/use-file-preview';
import { MediaImage } from '@atlaskit/media-ui/mediaImage';
import { isExperimentEnabled } from '@atlaskit/platform-feature-experiments/is-experiment-enabled';

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
	alt?: string;
	crop?: boolean;
	dimensions?: Dimensions;
	identifier: FileIdentifier;
	isLazy?: boolean;
	renderError: (props: { error: Error }) => JSX.Element | null;
	ssr?: SSR;
	stretch?: boolean;
}): JSX.Element | null => {
	// Generate unique traceId for file
	const traceContext = useMemo(
		() => ({
			traceId: getRandomHex(8),
		}),
		[],
	);

	// Ignored via go/ees007
	// eslint-disable-next-line @atlaskit/editor/enforce-todo-comment-format
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

	const memoizedOnImageLoad = useCallback(() => {
		onImageLoad(preview);
	}, [onImageLoad, preview]);

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
				onImageLoad={
					isExperimentEnabled('platform_editor_perf_lint_cleanup')
						? memoizedOnImageLoad
						: () => {
								onImageLoad(preview);
							}
				}
				onImageError={onImageError}
				loading={isLazy ? 'lazy' : undefined}
				forceSyncDisplay={!!ssr}
				crop={crop}
				stretch={stretch}
				ref={copyNodeRef}
			/>
			{getSsrScriptProps && (
				// eslint-disable-next-line react/jsx-props-no-spreading
				<script {...(getSsrScriptProps() as Omit<ReturnType<typeof getSsrScriptProps>, 'css'>)} />
			)}
		</Fragment>
	);
};
