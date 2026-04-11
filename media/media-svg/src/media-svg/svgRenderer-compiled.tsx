/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef, type ForwardRefExoticComponent, type RefAttributes } from 'react';

import { css, jsx } from '@compiled/react';

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

export const SvgRenderer: ForwardRefExoticComponent<
	SvgRendererProps & RefAttributes<HTMLImageElement>
> = forwardRef<HTMLImageElement, SvgRendererProps>(
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
			style,
			...rest
		},
		ref,
	) => {
		const { width, height } = dimensions || style || {};
		return (
			<img
				{...rest}
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
				onError={() => {
					onError && onError(new MediaSVGError('img-error'));
				}}
				ref={ref}
			/>
		);
	},
);
