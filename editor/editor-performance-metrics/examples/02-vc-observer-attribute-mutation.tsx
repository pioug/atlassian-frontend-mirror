/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useRef } from 'react';

import { css, jsx } from '@compiled/react';

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
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	width: '50%',
	height: '100px',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

const SectionContentOne = () => {
	const ref = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (!ref.current) {
			return;
		}

		const timeoutId = setTimeout(() => {
			if (!ref.current) {
				return;
			}

			// First change should cause layout shift
			const rect = ref.current.getBoundingClientRect();
			const height = rect.height;

			ref.current.style.height = `${height + 90}px`;

			(window as any).__editor_metrics_tests_tick?.call();

			requestAnimationFrame(() => {
				setTimeout(() => {
					if (!ref.current) {
						return;
					}

					// First change should not cause layout shift
					ref.current.dataset.myAttr = 'lol';

					(window as any).__editor_metrics_tests_tick?.call();
				}, 200);
			});
		}, 300);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return (
		<div data-testid="content-attr-to-change" ref={ref} css={contentDivStyle}>
			Content That Attribute Changing
		</div>
	);
};

export default function Example() {
	return (
		<main id="app-main" css={mainStyles}>
			<SectionContentOne />
		</main>
	);
}
