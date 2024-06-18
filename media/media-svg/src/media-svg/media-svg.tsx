/** @jsx jsx */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import { ErrorBoundary } from 'react-error-boundary';

import { createUnexpectedErrorCallback } from './errors';
import { Loading } from './loading';
import { SvgRenderer } from './svgRenderer';
import type { MediaSvgProps } from './types';
import { useResolveSvg } from './useResolveSvg';

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

	return (
		<ErrorBoundary onError={createUnexpectedErrorCallback(onError)} fallback={null}>
			{svgUrl && source ? (
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
			)}
		</ErrorBoundary>
	);
}
