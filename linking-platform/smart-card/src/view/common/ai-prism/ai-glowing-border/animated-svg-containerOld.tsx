/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

import { OUTER_BORDER_RADIUS } from '../constants';

import type { AnimatedSvgContainerProps } from './types';

let namespaceUUID = 0;

const svgStyles = css({
	position: 'absolute',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	borderRadius: OUTER_BORDER_RADIUS,
});

const blurredStyles = css({
	width: `calc(100% - ${token('space.050', '4px')})`,
	height: `calc(100% - ${token('space.050', '4px')})`,
	top: token('space.050', '4px'),
	left: token('space.050', '4px'),
	filter: `blur(${token('space.100', '8px')})`,

	// for safari... : https://stackoverflow.com/a/71353198
	backfaceVisibility: 'hidden',
	transform: 'translate3d(0, 0, 0)',
});

const notBlurredStyles = css({
	left: 0,
	top: 0,
	width: '100%',
	height: '100%',
});

/**
 * The bulk of this file is originally from
 * https://bitbucket.org/atlassian/barrel/src/master/ui/platform/ui-kit/ai
 * with modifications.
 */
const AnimatedSvgContainerOld = ({
	palette,
	isMoving,
	isGlowing,
	additionalCss,
}: AnimatedSvgContainerProps) => {
	const svgRef = useRef<SVGSVGElement>(null);
	const namespaceId = useRef<number>();

	if (namespaceId.current === undefined) {
		namespaceId.current = namespaceUUID;
		namespaceUUID += 1;
	}

	useEffect(() => {
		if (isMoving) {
			const svg = svgRef.current;

			// Schedule animation to begin before next browser paint
			const beginReq = requestAnimationFrame(() => {
				svg?.querySelectorAll('animate').forEach((node) => node.beginElement());
			});
			return () => {
				// Ensure any pending animation frame is cancelled as the element animation does not end properly if it
				// begins in the same event tick, i.e. isLoading synchronously changes to true then false.
				cancelAnimationFrame(beginReq);
				requestAnimationFrame(() => {
					svg?.querySelectorAll('animate').forEach((node) => node.endElement());
				});
			};
		}
		return undefined;
	}, [isMoving]);

	return (
		<svg
			// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
			css={[svgStyles, isGlowing ? blurredStyles : notBlurredStyles, additionalCss]}
			ref={svgRef}
			viewBox="0 0 24 24"
			preserveAspectRatio="none"
		>
			<defs>
				<linearGradient
					id={`${namespaceId.current}_lg1`}
					gradientUnits="userSpaceOnUse"
					x1="0%"
					y1="0"
					x2="400%"
					y2="0"
					spreadMethod="reflect"
				>
					<animate
						begin="indefinite"
						attributeName="x1"
						from="0%"
						to="400%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<animate
						begin="indefinite"
						attributeName="x2"
						from="400%"
						to="800%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<stop offset="0" stopColor={palette.blue} />
					<stop offset="0.25" stopColor={palette.teal} />
					<stop offset="0.5" stopColor={palette.yellow} />
					<stop offset="0.75" stopColor={palette.teal} />
					<stop offset="1" stopColor={palette.blue} />
				</linearGradient>
				<linearGradient
					id={`${namespaceId.current}_lg2`}
					gradientUnits="userSpaceOnUse"
					x1="0"
					y1="-100%"
					x2="0"
					y2="300%"
					spreadMethod="reflect"
				>
					<animate
						begin="indefinite"
						attributeName="y1"
						from="-100%"
						to="300%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<animate
						begin="indefinite"
						attributeName="y2"
						from="300%"
						to="700%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<stop offset="0" stopColor={palette.blue} />
					<stop offset="0.25" stopColor={palette.teal} />
					<stop offset="0.5" stopColor={palette.yellow} />
					<stop offset="0.75" stopColor={palette.teal} />
					<stop offset="1" stopColor={palette.blue} />
				</linearGradient>
				<linearGradient
					id={`${namespaceId.current}_lg3`}
					gradientUnits="userSpaceOnUse"
					x1="300%"
					y1="0"
					x2="700%"
					y2="0"
					spreadMethod="reflect"
				>
					<animate
						begin="indefinite"
						attributeName="x1"
						from="300%"
						to="-100%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<animate
						begin="indefinite"
						attributeName="x2"
						from="700%"
						to="300%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<stop offset="0" stopColor={palette.blue} />
					<stop offset="0.25" stopColor={palette.teal} />
					<stop offset="0.5" stopColor={palette.yellow} />
					<stop offset="0.75" stopColor={palette.teal} />
					<stop offset="1" stopColor={palette.blue} />
				</linearGradient>

				<linearGradient
					id={`${namespaceId.current}_lg4`}
					gradientUnits="userSpaceOnUse"
					x1="0"
					y1="0"
					x2="0"
					y2="400%"
					spreadMethod="reflect"
				>
					<animate
						begin="indefinite"
						attributeName="y1"
						from="0%"
						to="-400%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<animate
						begin="indefinite"
						attributeName="y2"
						from="400%"
						to="0%"
						repeatCount="indefinite"
						dur="3s"
					/>
					<stop offset="0" stopColor={palette.blue} />
					<stop offset="0.25" stopColor={palette.teal} />
					<stop offset="0.5" stopColor={palette.yellow} />
					<stop offset="0.75" stopColor={palette.teal} />
					<stop offset="1" stopColor={palette.blue} />
				</linearGradient>
			</defs>

			<g strokeWidth="8">
				<path
					stroke={`url(#${namespaceId.current}_lg1)`}
					d="M0 0h24"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					stroke={`url(#${namespaceId.current}_lg2)`}
					d="M24 0v24"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					stroke={`url(#${namespaceId.current}_lg3)`}
					d="M24 24H0"
					vectorEffect="non-scaling-stroke"
				/>
				<path
					stroke={`url(#${namespaceId.current}_lg4)`}
					d="M0 24V0"
					vectorEffect="non-scaling-stroke"
				/>
			</g>
		</svg>
	);
};

export default AnimatedSvgContainerOld;
