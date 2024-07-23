/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css({
					flexBasis: '0',
					flexGrow: '1',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					backgroundColor: tokenSet.backgroundColor,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					border: tokenSet.border,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					boxShadow: tokenSet.shadow,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					color: tokenSet.color,
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
					cursor: isInteractive ? 'pointer' : 'default',
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					':hover': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						backgroundColor: tokenSet.hoverBackgroundColor,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						boxShadow: tokenSet.hoverShadow || tokenSet.shadow || 'none',
					},
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
					':active': {
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
						backgroundColor: tokenSet.activeBackgroundColor,
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
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
