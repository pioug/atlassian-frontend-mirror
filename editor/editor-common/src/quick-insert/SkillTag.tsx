/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// SVG fills use background and border colour tokens, which @atlaskit/css's schema does not allow for `fill`.
import { cssMap as fillCssMap, jsx } from '@compiled/react';

import { cssMap } from '@atlaskit/css';
import { token } from '@atlaskit/tokens';

// The edges fill the tag background, and the slash is a coloured stripe over the start edge.
const START_EDGE_PATH =
	'M4.88566 1.4253C5.13945 0.579336 5.91809 0 6.80131 0H7.31325V20H2.00131C0.661586 20 -0.299308 18.7085 0.0856588 17.4253L4.88566 1.4253Z';
const END_EDGE_PATH =
	'M4.39518 1.91565C4.73628 0.778646 5.78281 0 6.96988 0V20H3.00197C0.99238 20 -0.448963 18.0628 0.128488 16.138L4.39518 1.91565Z';
const SLASH_PATH =
	'M5.06145 1.4253C5.31524 0.579336 6.09388 0 6.9771 0H7.48904L1.48904 20C0.49224 20 -0.222695 19.0391 0.0637328 18.0843L5.06145 1.4253Z';

const styles = cssMap({
	tag: {
		display: 'inline',
		overflowWrap: 'anywhere',
		whiteSpace: 'normal',
	},
	text: {
		color: token('color.text'),
		font: token('font.body'),
	},
	textDisabled: {
		color: token('color.text.disabled'),
	},
	// Keeps each edge on the same line as the slug character beside it.
	noWrap: {
		whiteSpace: 'nowrap',
	},
	// `display: inline` lets a long slug wrap like normal text, and `boxDecorationBreak: 'clone'`
	// gives each wrapped line its own background.
	highlight: {
		backgroundColor: token('color.background.neutral'),
		boxDecorationBreak: 'clone',
		display: 'inline',
	},
	highlightDisabled: {
		backgroundColor: token('color.background.disabled'),
	},
	highlightStart: {
		paddingInlineStart: token('space.025'),
	},
	highlightEnd: {
		paddingInlineEnd: token('space.025'),
	},
	// An empty inline box is as tall as the slug's background, so the absolutely positioned edge
	// matches it whatever the font metrics are.
	edge: {
		display: 'inline',
		paddingInlineStart: token('space.100'),
		position: 'relative',
	},
	edgeShape: {
		height: '100%',
		insetBlockStart: token('space.0'),
		insetInlineStart: token('space.0'),
		position: 'absolute',
		width: '100%',
	},
});

const fillStyles = fillCssMap({
	edge: {
		fill: token('color.background.neutral'),
	},
	edgeDisabled: {
		fill: token('color.background.disabled'),
	},
	slashDisabled: {
		fill: token('color.border.disabled'),
	},
});

const slashColorStyles = fillCssMap({
	LIME: { fill: token('color.border.accent.lime') },
	RED: { fill: token('color.border.accent.red') },
	ORANGE: { fill: token('color.border.accent.orange') },
	YELLOW: { fill: token('color.border.accent.yellow') },
	GREEN: { fill: token('color.border.accent.green') },
	TEAL: { fill: token('color.border.accent.teal') },
	BLUE: { fill: token('color.border.accent.blue') },
	PURPLE: { fill: token('color.border.accent.purple') },
	MAGENTA: { fill: token('color.border.accent.magenta') },
	GRAY: { fill: token('color.border.accent.gray') },
	DEFAULT: { fill: token('color.border') },
});

const SKILL_TAG_COLORS = [
	'LIME',
	'RED',
	'ORANGE',
	'YELLOW',
	'GREEN',
	'TEAL',
	'BLUE',
	'PURPLE',
	'MAGENTA',
	'GRAY',
	'DEFAULT',
] as const;

export type SkillTagColor = (typeof SKILL_TAG_COLORS)[number];

const isSkillTagColor = (color?: string): color is SkillTagColor =>
	SKILL_TAG_COLORS.includes(color as SkillTagColor);

export type SkillTagProps = {
	/** Skill colour; tints the slash. Unknown colours use the default colour. */
	color?: string;
	isDisabled?: boolean;
	slug: string;
};

const Edge = ({
	children,
	isDisabled,
}: {
	children: React.ReactNode;
	isDisabled: boolean;
}): React.JSX.Element => (
	<span aria-hidden="true" css={styles.edge}>
		<svg
			css={[styles.edgeShape, fillStyles.edge, isDisabled && fillStyles.edgeDisabled]}
			focusable="false"
			preserveAspectRatio="none"
			viewBox="0 0 8 20"
		>
			{children}
		</svg>
	</span>
);

const Highlight = ({
	children,
	isDisabled,
	side,
}: {
	children: string;
	isDisabled: boolean;
	side?: 'start' | 'end';
}): React.JSX.Element => (
	<span
		css={[
			styles.highlight,
			isDisabled && styles.highlightDisabled,
			side === 'start' && styles.highlightStart,
			side === 'end' && styles.highlightEnd,
		]}
	>
		{children}
	</span>
);

export const SkillTag = ({ color, slug, isDisabled = false }: SkillTagProps): React.JSX.Element => {
	const slashColor = isSkillTagColor(color) ? color : 'DEFAULT';
	// The first and last characters share a no-wrap span with the edge beside them, so a long slug
	// can wrap without leaving an edge alone at the start or end of a line.
	const firstCharacter = slug.slice(0, 1);
	const middleCharacters = slug.slice(1, -1);
	const lastCharacter = slug.slice(1).slice(-1);

	return (
		<span css={[styles.tag, styles.text, isDisabled && styles.textDisabled]}>
			<span css={styles.noWrap}>
				<Edge isDisabled={isDisabled}>
					<path d={START_EDGE_PATH} transform="translate(0.686 0)" />
					<path
						css={[slashColorStyles[slashColor], isDisabled && fillStyles.slashDisabled]}
						d={SLASH_PATH}
						transform="translate(0.511 0)"
					/>
				</Edge>
				<Highlight isDisabled={isDisabled} side="start">
					{firstCharacter}
				</Highlight>
			</span>
			{middleCharacters && <Highlight isDisabled={isDisabled}>{middleCharacters}</Highlight>}
			<span css={styles.noWrap}>
				<Highlight isDisabled={isDisabled} side="end">
					{lastCharacter}
				</Highlight>
				<Edge isDisabled={isDisabled}>
					<path d={END_EDGE_PATH} transform="rotate(180 4 10) translate(1.03 0)" />
				</Edge>
			</span>
		</span>
	);
};
