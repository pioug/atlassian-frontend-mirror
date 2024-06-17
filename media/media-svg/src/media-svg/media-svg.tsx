/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { type FileIdentifier } from '@atlaskit/media-client';
import Spinner from '@atlaskit/spinner';

import { MediaSVGError } from './errors';
import type { ContentSource, MediaSvgProps } from './types';
import { useResolveSvg } from './useResolveSvg';

const svgRendererMaxDimensionStyles = css({
	maxWidth: '100%',
	maxHeight: '100%',
});

const loadingStyles = css({
	display: 'inline-flex',
	alignItems: 'center',
	justifyContent: 'center',
	overflow: 'hidden',
});

const svgRendererStyles = css({
	objectFit: 'contain',
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage
	backgroundColor: 'white', // This background color is for transparency
});

type LoadingProps = {
	dimensions: MediaSvgProps['dimensions'];
};
export const Loading = ({ dimensions: { width, height } = {} }: LoadingProps) => (
	<span
		role="status"
		css={loadingStyles}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
		style={{ width, height }}
	>
		<Spinner />
	</span>
);

type SvgRendererProps = {
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

const SvgRenderer = ({
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
}: SvgRendererProps) => {
	const { width, height } = dimensions || style || {};

	return (
		<img
			data-testid={testId}
			data-fileid={id}
			data-filecollection={collectionName}
			data-source={source}
			src={svgUrl}
			alt={alt}
			css={[svgRendererStyles, !width && !height && svgRendererMaxDimensionStyles]}
			style={{
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				...style,
				width: dimensions?.width || style?.width,
				height: dimensions?.height || style?.height,
			}}
			onLoad={onLoad}
			onMouseDown={onMouseDown}
			onError={() => {
				onError && onError(new MediaSVGError('img-error'));
			}}
			onContextMenu={(e) => {
				// Disabled context menu to prevent user from copying the url and open in browser. That causes script execution.
				e.preventDefault();
			}}
		/>
	);
};

export default function MediaSvg({
	testId,
	identifier,
	dimensions,
	onError,
	alt,
	onLoad,
	onMouseDown,
	style,
}: MediaSvgProps) {
	const { svgUrl, source } = useResolveSvg(identifier, onError);

	return svgUrl && source ? (
		<SvgRenderer
			identifier={identifier}
			testId={testId}
			svgUrl={svgUrl}
			source={source}
			dimensions={dimensions}
			onError={onError}
			alt={alt}
			onLoad={onLoad}
			onMouseDown={onMouseDown}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={style}
		/>
	) : (
		<Loading dimensions={dimensions} />
	);
}
