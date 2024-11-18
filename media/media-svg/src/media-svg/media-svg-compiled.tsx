/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { forwardRef } from 'react';

import { jsx } from '@compiled/react';
import { ErrorBoundary } from 'react-error-boundary';

import { createUnexpectedErrorCallback } from './errors';
import { Loading } from './loading-compiled';
import { SvgRenderer } from './svgRenderer-compiled';
import type { MediaSvgProps } from './types';
import { useResolveSvg } from './useResolveSvg';

const MediaSvg = forwardRef<HTMLImageElement, MediaSvgProps>(
	(
		{ testId, identifier, dimensions, onError, alt, onLoad, onMouseDown, style }: MediaSvgProps,
		ref,
	) => {
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
						// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop
						style={style}
						ref={ref}
					/>
				) : (
					<Loading dimensions={dimensions} />
				)}
			</ErrorBoundary>
		);
	},
);
export default MediaSvg;
