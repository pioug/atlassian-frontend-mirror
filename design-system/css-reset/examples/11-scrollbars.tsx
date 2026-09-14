/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { type CSSProperties, useEffect, useState } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';
import { CURRENT_SURFACE_CSS_VAR } from '@atlaskit/tokens/constants';

const rootAttribute = 'data-scrollbar-harmonisation';

const styles = cssMap({
	page: {
		paddingBlock: token('space.300'),
		paddingInline: token('space.300'),
		color: token('color.text'),
		backgroundColor: token('elevation.surface'),
	},
	control: {
		display: 'flex',
		alignItems: 'center',
		gap: token('space.100'),
		marginBlockEnd: token('space.300'),
	},
	grid: {
		display: 'grid',
		gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
		gap: token('space.300'),
	},
	panel: {
		minInlineSize: 0,
	},
	scrollContainer: {
		boxSizing: 'border-box',
		inlineSize: '100%',
		blockSize: '220px',
		overflow: 'auto',
		borderColor: token('color.border'),
		borderStyle: 'solid',
		borderWidth: token('border.width'),
		borderRadius: token('radius.medium'),
		backgroundColor: token('utility.elevation.surface.current'),
	},
	overlaySurface: {
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
		backgroundColor: token('elevation.surface.overlay'),
	},
	oversizedContent: {
		boxSizing: 'border-box',
		inlineSize: '560px',
		minBlockSize: '440px',
		paddingBlock: token('space.200'),
		paddingInline: token('space.200'),
	},
});

const ScrollContent = (): React.JSX.Element => (
	<div css={styles.oversizedContent}>
		<p>Scroll vertically and horizontally to compare the track, thumb, and hover state.</p>
		{Array.from({ length: 12 }, (_, index) => (
			<p key={index}>Scrollable comparison row {index + 1}</p>
		))}
	</div>
);

export default function Example(): React.JSX.Element {
	const [isEnabled, setIsEnabled] = useState(true);

	useEffect(() => {
		document.documentElement.toggleAttribute(rootAttribute, isEnabled);

		return () => document.documentElement.removeAttribute(rootAttribute);
	}, [isEnabled]);

	return (
		<main css={styles.page}>
			<h1>Scrollbar appearance</h1>
			<p>
				This example changes scrollbar color and track surface. The browser still controls
				visibility and width.
			</p>
			<div css={styles.control}>
				<label htmlFor="harmonised-scrollbars">Use harmonised appearance</label>
				<input
					id="harmonised-scrollbars"
					type="checkbox"
					checked={isEnabled}
					onChange={(event) => setIsEnabled(event.currentTarget.checked)}
				/>
			</div>
			<div css={styles.grid}>
				<section css={styles.panel}>
					<h2>Default surface</h2>
					<div css={styles.scrollContainer}>
						<ScrollContent />
					</div>
				</section>
				<section
					css={styles.overlaySurface}
					style={
						{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Current surface is a contextual CSS variable, not a style property supported by cssMap.
							[CURRENT_SURFACE_CSS_VAR]: token('elevation.surface.overlay'),
						} as CSSProperties
					}
				>
					<h2>Overlay surface</h2>
					<div css={styles.scrollContainer}>
						<ScrollContent />
					</div>
				</section>
			</div>
		</main>
	);
}
