/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef, useState } from 'react';

import { css, jsx } from '@compiled/react';

import UFOLoadHold from '@atlaskit/react-ufo/load-hold';
import UFOSegment from '@atlaskit/react-ufo/segment';

const mainStyles = css({
	minWidth: '100vw',
	minHeight: '100vh',
	maxHeight: '100vh',
	backgroundColor: '#c0c2c23d',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
});

const contentDivStyle = css({
	backgroundColor: '#f9f9f9',
	height: '20vh',
	minWidth: '100vw',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

const SectionContentOne = () => {
	const ref = useRef<HTMLDivElement | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		const timeoutId = setTimeout(() => {
			if (!ref.current) {
				return;
			}

			// yes, forced layout reflow for test purposes
			const rect = ref.current.getBoundingClientRect();
			const height = rect.height;

			ref.current.style.height = `${height * 2}px`;
			requestAnimationFrame(() => {
				setIsLoading(false);
			});
		}, 500);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return (
		<div ref={ref} data-testid="content-to-mutate" css={contentDivStyle}>
			<UFOLoadHold name="content-to-mutate__layout-shift" hold={isLoading} />
			Content Top
		</div>
	);
};

const SectionContentTwo = () => {
	return (
		<div data-testid="content-to-be-moved" css={contentDivStyle}>
			Content Bottom
		</div>
	);
};

export default function Example(): JSX.Element {
	return (
		<UFOSegment name="app-root">
			<main data-testid="main" css={mainStyles}>
				<SectionContentOne />
				<SectionContentTwo />
			</main>
		</UFOSegment>
	);
}
