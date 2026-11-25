/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import { useState } from 'react';

import { cssMap, jsx } from '@compiled/react';

import Button from '@atlaskit/button/default/button';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	stage: { position: 'relative', height: '240px', overflow: 'hidden' },
	panel: {
		position: 'absolute',
		insetInlineEnd: 0,
		insetBlock: 0,
		width: '160px',
		backgroundColor: token('elevation.surface.sunken'),
	},
	floating: {
		'--inline-direction': '-1',
		position: 'absolute',
		insetBlockEnd: token('space.200'),
		insetInlineEnd: token('space.200'),
		transform: 'translateX(0)',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors
		"[dir='rtl'] &": { '--inline-direction': '1' },
		'@media (prefers-reduced-motion: no-preference)': {
			transition: token('motion.floating.controls.follow.panel.exit'),
		},
	},
	open: {
		transform: 'translateX(calc(var(--inline-direction) * 160px))',
		'@media (prefers-reduced-motion: no-preference)': {
			transition: token('motion.floating.controls.follow.panel.enter'),
		},
	},
});

export default function FloatingPanelMotionExample(): JSX.Element {
	const [open, setOpen] = useState(false);
	return (
		<div>
			<Button onClick={() => setOpen(!open)}>{open ? 'Close panel' : 'Open panel'}</Button>
			<div css={styles.stage}>
				{open && <div css={styles.panel}>Panel space</div>}
				<div css={[styles.floating, open && styles.open]}>
					<Button>Floating control</Button>
				</div>
			</div>
		</div>
	);
}
