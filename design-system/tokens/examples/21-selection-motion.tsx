/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { type JSX, useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	checkbox: {
		color: token('color.background.input'),
		fill: token('color.icon.inverse'),
		transition: token('motion.input.selection'),
		'@media (prefers-reduced-motion: reduce)': { transition: 'none' },
	},
	selected: { color: token('color.background.selected.bold') },
	border: {
		stroke: token('color.border.input'),
		transition: token('motion.input.selection'),
		'@media (prefers-reduced-motion: reduce)': { transition: 'none' },
	},
	selectedBorder: { stroke: token('color.background.selected.bold') },
	indicator: {
		opacity: 0,
		transition: token('motion.input.selection'),
		'@media (prefers-reduced-motion: reduce)': { transition: 'none' },
	},
	radio: {
		display: 'inline-block',
		width: 16,
		height: 16,
		borderRadius: token('radius.full'),
		backgroundColor: token('color.background.selected.bold'),
		opacity: 0,
		transition: token('motion.input.selection'),
		'@media (prefers-reduced-motion: reduce)': { transition: 'none' },
	},
	visible: { opacity: 1 },
});

export default function SelectionMotionExample(): JSX.Element {
	const [selected, setSelected] = useState(false);
	return (
		<div>
			<Button onClick={() => setSelected(!selected)} aria-pressed={selected}>
				Toggle selection motion
			</Button>
			<svg
				width="24"
				height="24"
				viewBox="0 0 24 24"
				aria-hidden="true"
				css={[styles.checkbox, selected && styles.selected]}
			>
				<rect
					x="4"
					y="4"
					width="16"
					height="16"
					rx="2"
					fill="currentColor"
					css={[styles.border, selected && styles.selectedBorder]}
				/>
				<path
					d="M6 11L10 15L18 7L19 8L10 17L5 12Z"
					css={[styles.indicator, selected && styles.visible]}
				/>
			</svg>
			<span aria-hidden="true" css={[styles.radio, selected && styles.visible]} />
		</div>
	);
}
