/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { useId } from 'react';

import { cssMap, jsx } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

const styles = cssMap({
	figure: {
		marginBlockStart: token('space.0'),
		marginInlineEnd: token('space.0'),
		marginBlockEnd: token('space.0'),
		marginInlineStart: token('space.0'),
		width: '100%',
	},
	container: { overflowX: 'auto' },
	chart: { display: 'block', width: '100%', minWidth: '480px', height: 'auto' },
	caption: {
		color: token('color.text'),
		font: token('font.heading.small'),
		paddingBlockStart: token('space.200'),
		paddingInlineStart: token('space.300'),
	},
});

export const SvgChart = ({
	title,
	description,
	children,
}: {
	title: string;
	description: string;
	children: React.ReactNode;
}): React.JSX.Element => {
	const id = useId();
	return (
		<figure css={styles.figure}>
			<figcaption id={`${id}-title`} css={styles.caption}>
				{title}
			</figcaption>
			<div css={styles.container}>
				<svg
					css={styles.chart}
					viewBox="0 40 600 280"
					width="600"
					height="280"
					role="group"
					aria-labelledby={`${id}-title`}
					aria-describedby={`${id}-description`}
				>
					<desc id={`${id}-description`}>{description}</desc>
					{children}
				</svg>
			</div>
		</figure>
	);
};
