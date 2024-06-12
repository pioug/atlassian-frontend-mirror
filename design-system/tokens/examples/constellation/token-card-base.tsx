/** @jsx jsx */

import { css, jsx } from '@emotion/react';

import WorldIcon from '@atlaskit/icon/glyph/world';
import { borderRadius } from '@atlaskit/theme/constants';

const cardStyles = css({
	display: 'flex',
	width: 'auto',
	minWidth: 'fit-content',
	padding: '1em',
	alignItems: 'center',
	columnGap: '8px',
	borderRadius: `${borderRadius()}px`,
	fontSize: '24px',
	transition: 'box-shadow 200ms, background 200ms, border 200ms',
});

const Card = ({ tokenSet }: { tokenSet: Record<string, string> }) => {
	const isInteractive = tokenSet.activeBackgroundColor || tokenSet.activeShadow;
	return (
		<span
			css={[
				cardStyles,
				css({
					flexBasis: '0',
					flexGrow: '1',
					backgroundColor: tokenSet.backgroundColor,
					border: tokenSet.border,
					boxShadow: tokenSet.shadow,
					color: tokenSet.color,
					cursor: isInteractive ? 'pointer' : 'default',
					':hover': {
						backgroundColor: tokenSet.hoverBackgroundColor,
						boxShadow: tokenSet.hoverShadow || tokenSet.shadow || 'none',
					},
					':active': {
						backgroundColor: tokenSet.activeBackgroundColor,
						boxShadow: tokenSet.activeShadow || tokenSet.shadow || 'none',
					},
				}),
			]}
		>
			<WorldIcon label="" primaryColor={tokenSet.iconColor} />
			{tokenSet.label || 'Text'}
		</span>
	);
};

export default Card;
