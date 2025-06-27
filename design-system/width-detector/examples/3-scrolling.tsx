/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

import { cssMap, jsx } from '@compiled/react';

import { WidthObserver } from '@atlaskit/width-detector';

const styles = cssMap({
	resultBox: {
		position: 'relative',
		backgroundColor: 'rebeccapurple',
		color: 'white',
	},
	text: {
		width: '100%',
	},
	aside: {
		position: 'fixed',
		bottom: 0,
		left: 0,
		right: 0,
		background: '#000',
		color: '#fff',
		display: 'flex',
	},
	label: {
		marginLeft: 'auto',
	},
});

const Lorem = () => (
	<p css={styles.text}>
		Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
		labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco
		laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in
		voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat
		non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
	</p>
);

export default function Example() {
	const [width, setWidth] = React.useState<number>(0);
	const [offscreen, setOffscreen] = React.useState(false);
	const onChange = React.useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => setOffscreen(e.target.checked),
		[setOffscreen],
	);

	return (
		<div css={styles.resultBox} data-frame>
			<WidthObserver setWidth={setWidth} offscreen={offscreen} />
			<div css={styles.aside}>
				<output name="width">{width}</output>
				<label css={styles.label}>
					offscreen
					<input name="offscreen" type="checkbox" checked={offscreen} onChange={onChange} />
				</label>
			</div>
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
			<Lorem />
		</div>
	);
}
