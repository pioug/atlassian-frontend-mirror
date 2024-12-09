/* eslint-disable @atlaskit/design-system/no-html-button */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type ChangeEventHandler, useCallback, useEffect, useState } from 'react';

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

const niceBorderStyle = css({
	backgroundColor: '#e0f7fa',
	borderColor: '#00796b',
	borderStyle: 'solid',
	borderWidth: '2px',
});

function blockForALittlebit(abit: number) {
	const start = performance.now();
	let now = start;
	while (now - start < Math.min(50 * abit, 400)) {
		now = performance.now();
	}
}

const SectionContentOne = () => {
	const [content, setContent] = useState('');
	const onChange: ChangeEventHandler<HTMLTextAreaElement> = useCallback((e) => {
		(window as any).__editor_metrics_tests_tick?.call(null, true);
		const size = e.target.value.length;
		blockForALittlebit(size);
		setContent(e.target.value);
		(window as any).__editor_metrics_tests_tick?.call(null, true);
	}, []);

	useEffect(() => {
		if (content.length === 0) {
			return;
		}

		(window as any).__editor_metrics_tests_tick?.call();
	}, [content]);

	return (
		<textarea
			data-testid={`type-me-textarea`}
			css={niceBorderStyle}
			value={content} // ...force the input's value to match the state variable...
			onChange={onChange} // ... and update the state variable on any edits!
		/>
	);
};

export default function Example() {
	return (
		<main id="app-main" css={mainStyles}>
			<SectionContentOne />
		</main>
	);
}
