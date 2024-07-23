/**
 * @jsxRuntime classic
 * @jsx jsx
 */
// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { token } from '@atlaskit/tokens';

const imageStyles = css({
	width: 200,
	height: 140,
	marginBottom: token('space.200', '16px'),
});

export const ProviderAuthRequiredSVG = () => {
	return (
		<svg
			width="170"
			height="130"
			viewBox="0 0 170 130"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			css={imageStyles}
		>
			<rect width="170" height="130" rx="6.25" fill="white" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M163.75 2H6.25C3.90279 2 2 3.90279 2 6.25V123.75C2 126.097 3.90279 128 6.25 128H163.75C166.097 128 168 126.097 168 123.75V6.25C168 3.90279 166.097 2 163.75 2ZM6.25 0C2.79822 0 0 2.79822 0 6.25V123.75C0 127.202 2.79822 130 6.25 130H163.75C167.202 130 170 127.202 170 123.75V6.25C170 2.79822 167.202 0 163.75 0H6.25Z"
				fill="#091E42"
				fillOpacity="0.14"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M168 14H2V12H168V14Z"
				fill="#091E42"
				fillOpacity="0.14"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M168 43L2 43L2 41L168 41V43Z"
				fill="#091E42"
				fillOpacity="0.14"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M168 72H2V70H168V72Z"
				fill="#091E42"
				fillOpacity="0.14"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M28 128L28 2H30L30 128H28Z"
				fill="#091E42"
				fillOpacity="0.14"
			/>
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M98 128L98 2H100L100 128H98Z"
				fill="#091E42"
				fillOpacity="0.14"
			/>
			<rect x="34" y="24.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect x="104" y="24.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect x="34" y="53.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect x="104" y="53.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect x="34" y="111.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect x="104" y="111.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect x="34" y="82.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect x="104" y="82.5" width="60" height="6" rx="3" fill="#091E42" fillOpacity="0.06" />
			<rect opacity="0.5" x="8" y="20.5" width="14" height="14" rx="2" fill="#1D7AFC" />
			<rect opacity="0.5" x="8" y="49.5" width="14" height="14" rx="2" fill="#1D7AFC" />
			<path
				fillRule="evenodd"
				clipRule="evenodd"
				d="M168 101H2V99H168V101Z"
				fill="#091E42"
				fillOpacity="0.14"
			/>
			<rect opacity="0.5" x="8" y="107.5" width="14" height="14" rx="2" fill="#1D7AFC" />
			<rect opacity="0.5" x="8" y="78.5" width="14" height="14" rx="2" fill="#1D7AFC" />
		</svg>
	);
};
