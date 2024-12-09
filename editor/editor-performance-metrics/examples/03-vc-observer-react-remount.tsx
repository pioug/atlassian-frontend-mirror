/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useEffect, useMemo, useState } from 'react';

import { css, jsx } from '@compiled/react';

const mainStyles = css({
	minWidth: '100vw',
	minHeight: '100vh',
	maxHeight: '100vh',
	backgroundColor: '#c0c2c23d',
	display: 'flex',
	alignItems: 'center',
	justifyContent: 'center',
});

const contentDivStyle = css({
	backgroundColor: '#f9f9f9',
	padding: '20px',
	marginBottom: '10px',
	borderRadius: '4px',
	width: '700px',
	height: '400px',
	boxShadow: '0 0 5px rgba(0,0,0,0.1)',
});

const SectionContentOne = () => {
	return (
		<div data-testid="inside-content" css={[contentDivStyle]}>
			Content Div
		</div>
	);
};

const SectionContentTwo = () => {
	return (
		<div data-testid="inside-content" css={[contentDivStyle]}>
			Content Div
		</div>
	);
};

const Inside = () => {
	const [showTwo, setTwo] = useState(false);
	const child = useMemo(() => {
		if (showTwo) {
			return <SectionContentTwo />;
		}

		return <SectionContentOne />;
	}, [showTwo]);

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			setTwo(true);
			(window as any).__editor_metrics_tests_tick?.call();
		}, 500);

		return () => {
			clearTimeout(timeoutId);
		};
	}, []);

	return <div data-testid="inside-div">{child}</div>;
};

export default function Example() {
	return (
		<main id="app-main" css={mainStyles}>
			<Inside />
		</main>
	);
}
