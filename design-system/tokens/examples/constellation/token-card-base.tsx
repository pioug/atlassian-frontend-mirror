/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import { cssMap, type CSSProperties, jsx } from '@compiled/react';

import GlobeIcon from '@atlaskit/icon/core/globe';
import { type NewGlyphColorProps } from '@atlaskit/icon/types';
import { token } from '@atlaskit/tokens';

const backgroundColorCssVar = '--card-background-color';
const borderCssVar = '--card-border';
const shadowCssVar = '--card-shadow';
const colorCssVar = '--card-color';
const hoverBackgroundColorCssVar = '--card-hover-background-color';
const activeBackgroundColorCssVar = '--card-active-background-color';
const hoverShadowCssVar = '--card-hover-shadow';
const activeShadowCssVar = '--card-active-shadow';

const styles = cssMap({
	card: {
		display: 'flex',
		width: 'auto',
		minWidth: 'fit-content',
		padding: '1em',
		alignItems: 'center',
		columnGap: token('space.100'),
		borderRadius: token('radius.small'),
		fontSize: '24px',
		transition: 'box-shadow 200ms, background 200ms, border 200ms',
		flexBasis: '0',
		flexGrow: '1',
		backgroundColor: `var(${backgroundColorCssVar})`,
		border: `var(${borderCssVar})`,
		boxShadow: `var(${shadowCssVar})`,
		color: `var(${colorCssVar})`,
		'&:hover': {
			backgroundColor: `var(${hoverBackgroundColorCssVar})`,
			boxShadow: `var(${hoverShadowCssVar})`,
		},
		'&:active': {
			backgroundColor: `var(${activeBackgroundColorCssVar})`,
			boxShadow: `var(${activeShadowCssVar})`,
		},
	},
	cardInteractive: {
		cursor: 'pointer',
	},
});

const Card = ({ tokenSet }: { tokenSet: Record<string, string> }) => {
	const isInteractive = tokenSet.activeBackgroundColor || tokenSet.activeShadow;
	return (
		<span
			css={[styles.card, isInteractive && styles.cardInteractive]}
			style={
				{
					[backgroundColorCssVar]: tokenSet.backgroundColor,
					[borderCssVar]: tokenSet.border,
					[shadowCssVar]: tokenSet.shadow,
					[colorCssVar]: tokenSet.color,
					[hoverBackgroundColorCssVar]: tokenSet.hoverBackgroundColor,
					[activeBackgroundColorCssVar]: tokenSet.activeBackgroundColor,
					[hoverShadowCssVar]: tokenSet.hoverShadow,
					[activeShadowCssVar]: tokenSet.activeShadow,
				} as CSSProperties
			}
		>
			<GlobeIcon
				label=""
				color={tokenSet.iconColor as NewGlyphColorProps['color']}
				spacing="spacious"
			/>
			{tokenSet.label || 'Text'}
		</span>
	);
};

export default Card;
