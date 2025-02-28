/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { css, jsx } from '@compiled/react';

const HEIGHT = 120;

const noResultsSVGStyles = css({
	height: `${HEIGHT}px`,
	display: 'block',
});

export const NoResultsSVG = (): JSX.Element => {
	const id = 'link-picker-ui-no-results-svg';

	return (
		<svg
			css={noResultsSVGStyles}
			height="120"
			viewBox="0 0 208 191"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
		>
			<g clipPath={`url(#${id}-a)`}>
				<path
					opacity=".3"
					d="M105.28 190.44c-.93.03-1.86.05-2.79.06-1.3.01-2.36-1.04-2.36-2.34-.01-1.27 1-2.32 2.27-2.36h.07c5.93-.03 11.95-.67 17.74-1.9a2.352 2.352 0 0 1 .98 4.6 94.236 94.236 0 0 1-15.91 1.94ZM89.77 189.649c-.13 0-.27 0-.41-.02a91.17 91.17 0 0 1-18.27-4.49 2.353 2.353 0 1 1 1.59-4.43 85.94 85.94 0 0 0 17.32 4.25c1.29.18 2.19 1.36 2.01 2.65-.15 1.16-1.12 2-2.24 2.04ZM133.08 184.98c-.99.03-1.93-.56-2.29-1.54-.45-1.22.17-2.57 1.39-3.02a87.114 87.114 0 0 0 16.01-7.87 2.35 2.35 0 1 1 2.5 3.98c-5.32 3.33-11 6.13-16.87 8.3-.25.1-.49.14-.74.15ZM60.25 180.089c-.4.01-.81-.07-1.18-.27a92.004 92.004 0 0 1-15.61-10.48 2.35 2.35 0 0 1-.31-3.31c.83-1 2.31-1.14 3.31-.31a87.13 87.13 0 0 0 14.81 9.94c1.15.61 1.58 2.03.97 3.18a2.31 2.31 0 0 1-1.99 1.25ZM35.79 161.01c-.67.02-1.35-.24-1.83-.77a91.583 91.583 0 0 1-11.11-15.17 2.353 2.353 0 1 1 4.06-2.38c3 5.13 6.55 9.97 10.54 14.39.87.96.8 2.45-.17 3.32-.43.39-.96.59-1.49.61ZM179.7 145.469c-.42.01-.86-.08-1.25-.31a2.346 2.346 0 0 1-.87-3.21 86.618 86.618 0 0 0 7.22-16.31c.4-1.24 1.73-1.91 2.96-1.51 1.24.4 1.91 1.73 1.51 2.96a91.279 91.279 0 0 1-7.62 17.19c-.41.74-1.16 1.16-1.95 1.19ZM19.3 134.749c-.96.03-1.88-.53-2.26-1.47a90.64 90.64 0 0 1-5.23-18.06 2.35 2.35 0 0 1 1.9-2.73c1.28-.23 2.5.62 2.73 1.9a87.04 87.04 0 0 0 4.96 17.13c.49 1.2-.09 2.58-1.3 3.06-.26.1-.53.16-.8.17ZM190.19 116.26a2.346 2.346 0 0 1-2.4-2.74c1-5.84 1.39-11.83 1.18-17.8l-.01-.2c-.05-1.3.97-2.39 2.27-2.43 1.3-.05 2.39.97 2.43 2.27l.01.2c.22 6.29-.2 12.6-1.25 18.76a2.345 2.345 0 0 1-2.23 1.94ZM12.82 104.36c-1.3.05-2.39-.92-2.43-2.22v-.1c-.22-6.26.19-12.54 1.23-18.66a2.36 2.36 0 0 1 2.71-1.93 2.36 2.36 0 0 1 1.93 2.71 87.974 87.974 0 0 0-1.17 17.7c.05 1.31-.97 2.45-2.27 2.5ZM190 85.05a2.35 2.35 0 0 1-2.39-1.93A86.803 86.803 0 0 0 182.63 66a2.36 2.36 0 0 1 1.29-3.07c1.2-.49 2.58.09 3.07 1.29 2.36 5.8 4.13 11.88 5.25 18.06.23 1.28-.61 2.5-1.89 2.74l-.35.03ZM17.07 73.668c-.27.01-.54-.03-.81-.11a2.347 2.347 0 0 1-1.51-2.96 91.288 91.288 0 0 1 7.6-17.2 2.355 2.355 0 0 1 3.21-.88c1.13.64 1.52 2.08.88 3.21a87.027 87.027 0 0 0-7.21 16.32c-.32.96-1.2 1.59-2.16 1.62ZM179.22 55.98a2.34 2.34 0 0 1-2.11-1.16 87.748 87.748 0 0 0-10.56-14.38c-.87-.96-.8-2.45.17-3.32.96-.87 2.45-.8 3.32.17 4.22 4.66 7.96 9.75 11.13 15.15.66 1.12.28 2.56-.84 3.22-.35.2-.73.3-1.11.32ZM31.61 46.26c-.53.02-1.07-.14-1.53-.5a2.354 2.354 0 0 1-.41-3.3 92.27 92.27 0 0 1 13.01-13.57 2.36 2.36 0 0 1 3.32.27c.84.99.72 2.47-.27 3.32a87.993 87.993 0 0 0-12.35 12.88c-.44.57-1.1.88-1.77.9ZM159.12 32.35c-.56.02-1.12-.16-1.58-.54-4.59-3.8-9.57-7.14-14.83-9.93a2.35 2.35 0 0 1-.98-3.18 2.359 2.359 0 0 1 3.18-.98 91.78 91.78 0 0 1 15.62 10.46c1 .83 1.14 2.31.31 3.31-.44.54-1.08.83-1.72.86ZM54.62 25.45c-.81.03-1.61-.36-2.08-1.1a2.35 2.35 0 0 1 .74-3.24 91.806 91.806 0 0 1 16.87-8.32c1.22-.45 2.57.17 3.02 1.39.45 1.22-.17 2.57-1.39 3.02a86.792 86.792 0 0 0-16 7.89c-.36.23-.76.35-1.16.36ZM132.16 16.979c-.29.01-.59-.03-.87-.14-5.6-2-11.43-3.42-17.33-4.23a2.353 2.353 0 0 1 .64-4.66c6.22.85 12.36 2.35 18.27 4.46 1.22.44 1.86 1.78 1.42 3.01-.33.93-1.2 1.53-2.13 1.56ZM83.36 13.78a2.352 2.352 0 0 1-.57-4.65 93.98 93.98 0 0 1 18.69-2.03 2.356 2.356 0 0 1 .1 4.71h-.07c-5.93.03-11.95.69-17.74 1.92-.14.03-.28.04-.41.05Z"
					fill="#B3BAC5"
				/>
				<path
					opacity=".3"
					d="M190.8 34.81a.522.522 0 0 1-.39-.56l.06-.45c.05-.29.11-.6.19-.92.3-1.15.85-2.18 1.64-3.09.79-.91 1.93-1.67 3.4-2.26l2.48-1.01c1.48-.59 2.39-1.57 2.75-2.92.13-.49.17-.99.12-1.51a3.44 3.44 0 0 0-.47-1.46c-.27-.45-.64-.86-1.13-1.22-.49-.36-1.09-.63-1.81-.82-.78-.2-1.47-.23-2.09-.09-.62.14-1.17.39-1.65.74s-.88.8-1.2 1.34c-.33.54-.57 1.12-.73 1.72-.05.18-.09.36-.12.52-.09.47-.56.75-1.02.61L187 22.26c-.36-.11-.61-.46-.57-.83.01-.12.03-.24.05-.36.06-.34.13-.66.21-.98.3-1.15.81-2.22 1.53-3.21.72-.99 1.61-1.8 2.67-2.43 1.06-.63 2.26-1.04 3.62-1.24 1.36-.2 2.84-.08 4.45.34 1.67.44 3.07 1.07 4.2 1.89 1.14.82 2.03 1.74 2.68 2.75.65 1.02 1.06 2.1 1.22 3.25.16 1.15.1 2.27-.19 3.36-.45 1.72-1.23 3.09-2.32 4.11-1.1 1.02-2.41 1.82-3.95 2.39l-2.09.79c-.59.19-1.47.58-2.2 1.38-.07.08-.37.41-.67.92-.22.38-.38.75-.49 1.07-.09.26-.37.4-.63.33l-3.72-.98Zm-3.06 5.87c.25-.95.79-1.67 1.63-2.17.84-.5 1.73-.63 2.68-.38.95.25 1.67.8 2.17 1.65.5.85.62 1.75.37 2.7-.25.95-.8 1.66-1.65 2.15-.85.48-1.75.6-2.69.35-.95-.25-1.67-.79-2.15-1.62-.49-.84-.61-1.73-.36-2.68ZM18.51 21.94a.518.518 0 0 1-.35-.58l.09-.45c.07-.29.15-.59.26-.9.38-1.13.99-2.12 1.85-2.97.85-.86 2.03-1.53 3.55-2.03l2.54-.84c1.51-.49 2.49-1.4 2.94-2.73.16-.48.24-.98.22-1.5-.01-.52-.14-1.02-.37-1.49-.23-.47-.58-.9-1.05-1.29-.46-.39-1.05-.7-1.75-.94-.76-.26-1.46-.33-2.08-.23-.63.1-1.19.31-1.69.63s-.93.74-1.29 1.26a6.16 6.16 0 0 0-.86 1.67c-.06.18-.11.35-.15.51-.12.46-.61.71-1.06.54l-3.74-1.42a.803.803 0 0 1-.51-.87c.02-.12.05-.24.08-.36.08-.33.17-.65.28-.96.38-1.13.96-2.16 1.75-3.1s1.73-1.69 2.82-2.25c1.1-.56 2.33-.89 3.69-.99 1.37-.1 2.84.11 4.41.64 1.63.55 2.99 1.27 4.07 2.17 1.08.9 1.91 1.87 2.49 2.93.58 1.06.92 2.16 1 3.32a8.52 8.52 0 0 1-.42 3.34c-.57 1.69-1.43 3-2.6 3.94-1.16.94-2.53 1.65-4.1 2.12l-2.14.64c-.6.15-1.51.48-2.29 1.23-.08.08-.4.39-.73.87-.25.37-.43.72-.56 1.03a.52.52 0 0 1-.65.29l-3.65-1.23Zm-3.45 5.65c.31-.93.9-1.62 1.77-2.06.87-.44 1.77-.51 2.7-.2.93.31 1.61.91 2.05 1.79.44.88.5 1.79.19 2.72-.31.93-.91 1.61-1.79 2.03-.88.42-1.78.48-2.71.17-.93-.31-1.61-.9-2.04-1.77-.42-.85-.48-1.75-.17-2.68ZM12.39 180.998c-.24.09-.52 0-.64-.23-.07-.13-.14-.27-.21-.41-.13-.27-.25-.56-.37-.86a7.553 7.553 0 0 1-.43-3.47c.13-1.2.62-2.47 1.49-3.81l1.45-2.25c.87-1.33 1.06-2.66.57-3.97a4.47 4.47 0 0 0-.77-1.31c-.34-.4-.74-.71-1.22-.93-.48-.22-1.02-.33-1.63-.35-.61-.01-1.26.11-1.95.37-.75.28-1.34.65-1.77 1.13-.43.47-.73.99-.92 1.55-.19.56-.26 1.16-.22 1.79.04.63.17 1.24.39 1.83.07.18.13.34.2.49a.8.8 0 0 1-.48 1.09l-3.8 1.24a.788.788 0 0 1-.94-.36c-.06-.11-.11-.22-.17-.33-.15-.31-.28-.62-.39-.92a9.594 9.594 0 0 1-.59-3.51c.02-1.23.28-2.4.79-3.52.5-1.12 1.25-2.15 2.25-3.09s2.28-1.7 3.84-2.27c1.62-.6 3.12-.89 4.52-.87 1.4.02 2.66.26 3.78.71 1.12.46 2.07 1.11 2.86 1.96.79.85 1.38 1.8 1.77 2.86.62 1.67.77 3.24.46 4.7s-.93 2.87-1.86 4.23l-1.26 1.85c-.37.5-.87 1.32-1.01 2.39-.01.11-.07.55-.02 1.13.04.44.12.83.22 1.15a.53.53 0 0 1-.33.64l-3.61 1.35Zm.87 6.56c-.34-.92-.31-1.82.09-2.72.4-.89 1.06-1.51 1.98-1.85.92-.34 1.83-.3 2.72.11.9.41 1.52 1.08 1.86 2 .34.92.3 1.82-.12 2.7-.42.88-1.09 1.49-2 1.83-.92.34-1.82.31-2.7-.09-.88-.4-1.49-1.06-1.83-1.98Z"
					fill="#C1C7D0"
				/>
				<path
					d="m149.36 134.209-7.15-6.93-9.63 9.95 7.15 6.93c1.83 1.77 3.11 4.02 3.71 6.49.6 2.47 1.89 4.72 3.71 6.49l29.03 28.1c4.4 4.26 11.41 4.14 15.67-.25 4.26-4.4 4.14-11.41-.25-15.67l-29.03-28.1a13.457 13.457 0 0 0-6.61-3.5 13.65 13.65 0 0 1-6.6-3.51Z"
					fill="#CFD4DB"
				/>
				<path
					d="M155.68 137.628c-2.37-.55-4.56-1.73-6.31-3.43l-2.18-2.11a6.92 6.92 0 0 0-9.79.16 6.92 6.92 0 0 0 .16 9.79l2.18 2.11c1.75 1.7 3 3.84 3.63 6.19 2.35-1.78 4.57-3.75 6.66-5.91 2.07-2.13 3.95-4.41 5.65-6.8Z"
					fill="#B3BAC5"
				/>
				<path
					d="M101.95 156.619c-15.47.25-30.11-5.54-41.22-16.3-22.95-22.21-23.54-58.95-1.33-81.9 10.76-11.11 25.21-17.37 40.67-17.63 15.47-.25 30.11 5.54 41.22 16.3 11.12 10.76 17.37 25.21 17.63 40.67.25 15.47-5.54 30.11-16.3 41.22-10.75 11.13-25.2 17.39-40.67 17.64Zm-1.65-102c-11.78.19-22.77 4.96-30.97 13.42-16.91 17.47-16.46 45.44 1.01 62.35 8.46 8.19 19.61 12.6 31.39 12.41 11.78-.19 22.77-4.96 30.97-13.42 8.19-8.46 12.6-19.61 12.41-31.39-.19-11.78-4.96-22.77-13.42-30.97-8.47-8.18-19.61-12.59-31.39-12.4Z"
					fill={`url(#${id}-b)`}
				/>
				<path
					d="m118.92 85.84-5.34-5.25c-.79-.77-2.05-.76-2.83.03l-9.79 9.97-9.97-9.79c-.79-.77-2.05-.76-2.83.03l-5.25 5.34c-.77.79-.76 2.05.03 2.83l9.97 9.79-9.79 9.97c-.77.79-.76 2.05.03 2.83l5.34 5.25c.79.77 2.05.76 2.83-.03l9.79-9.97 9.97 9.79c.79.77 2.05.76 2.83-.03l5.25-5.34c.77-.79.76-2.05-.03-2.83l-9.97-9.79 9.79-9.97c.77-.79.76-2.06-.03-2.83Z"
					fill="#C1C7D0"
				/>
			</g>
			<defs>
				<linearGradient
					id={`${id}-b`}
					x1="60.062"
					y1="139.664"
					x2="141.969"
					y2="57.757"
					gradientUnits="userSpaceOnUse"
				>
					<stop offset=".557" stopColor="#C1C7D0" />
					<stop offset=".966" stopColor="#E9EBEF" stopOpacity=".5" />
				</linearGradient>
				<clipPath id={`${id}-a`}>
					<path fill="#fff" transform="translate(0 .62)" d="M0 0h207.16v189.87H0z" />
				</clipPath>
			</defs>
		</svg>
	);
};
