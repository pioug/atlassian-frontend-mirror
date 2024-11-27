/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { type FileIdentifier } from '@atlaskit/media-client';

import { MediaSVGError } from './errors';
import type { ContentSource, MediaSvgProps } from './types';

const svgRendererMaxDimensionStyles = css({
	maxWidth: '100%',
	maxHeight: '100%',
});

const svgRendererStyles = css({
	objectFit: 'contain',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: 'white', // This background color is for transparency
});

export type SvgRendererProps = {
	identifier: FileIdentifier;
	testId: MediaSvgProps['testId'];
	dimensions: MediaSvgProps['dimensions'];
	onError: MediaSvgProps['onError'];
	alt: MediaSvgProps['alt'];
	svgUrl: string;
	source: ContentSource;
	onLoad: MediaSvgProps['onLoad'];
	onMouseDown: MediaSvgProps['onMouseDown'];
	style: MediaSvgProps['style'];
};

export const SvgRenderer = forwardRef<HTMLImageElement, SvgRendererProps>(
	(
		{
			identifier: { id, collectionName },
			testId,
			svgUrl,
			source,
			dimensions,
			onError,
			alt,
			onLoad,
			onMouseDown,
			style,
		},
		ref,
	) => {
		const { width, height } = dimensions || style || {};
		return (
			// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
			<img
				data-testid={testId}
				data-fileid={id}
				data-filecollection={collectionName}
				data-source={source}
				src={svgUrl}
				alt={alt}
				css={[svgRendererStyles, !width && !height && svgRendererMaxDimensionStyles]}
				style={{
					// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
					...style,
					width: dimensions?.width || style?.width,
					height: dimensions?.height || style?.height,
				}}
				onLoad={onLoad}
				onMouseDown={onMouseDown}
				onError={() => {
					onError && onError(new MediaSVGError('img-error'));
				}}
				ref={ref}
			/>
		);
	},
);
