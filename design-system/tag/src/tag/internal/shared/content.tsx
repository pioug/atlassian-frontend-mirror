/**
 * @jsxRuntime classic
 * @jsx jsx
 */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { fg } from '@atlaskit/platform-feature-flags';
import { token } from '@atlaskit/tokens';

import {
	buttonWidthUnitless,
	cssVar,
	defaultTextPadding,
	maxTextWidth,
	maxTextWidthUnitless,
	textMarginLeft,
	textPaddingRight,
} from '../../../constants';

import type { SimpleTagProps } from './types';

interface ContentProps extends SimpleTagProps {
	isRemovable?: boolean;
}

// To be removed with platform-component-visual-refresh (BLU-2992)
const baseStylesOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: maxTextWidth,
	font: token('font.body'),
	overflow: 'hidden',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingInlineEnd: defaultTextPadding,
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingInlineStart: defaultTextPadding,
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

const baseStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: maxTextWidth,
	font: token('font.body'),
	overflow: 'hidden',
	textOverflow: 'ellipsis',
	whiteSpace: 'nowrap',
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const linkStylesOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	color: `var(${cssVar.color.text.link})`,
	pointerEvents: 'auto',
	textDecoration: 'none',

	'&:hover': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: `var(${cssVar.color.text.hover})`,
		textDecoration: 'underline',
	},

	'&:active': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		color: `var(${cssVar.color.text.active})`,
		textDecoration: 'underline',
	},

	'&:focus': {
		outline: 'none',
	},
});

const linkStyles = css({
	color: token('color.text'),
	pointerEvents: 'auto',
	textDecoration: 'none',

	'&:hover': {
		color: token('color.text'),
		textDecoration: 'underline',
	},

	'&:active': {
		color: token('color.text'),
		textDecoration: 'underline',
	},

	'&:focus': {
		outline: 'none',
	},
});

const hasAfterStylesOld = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: `${maxTextWidthUnitless - buttonWidthUnitless}px`,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingInlineEnd: textPaddingRight,
});

const hasAfterStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: `${maxTextWidthUnitless - buttonWidthUnitless}px`,
});

// To be removed with platform-component-visual-refresh (BLU-2992)
const hasBeforeStyles = css({
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	marginInlineStart: textMarginLeft,
});

const Content = ({
	elemBefore = null,
	isRemovable = true,
	text = '',
	color = 'standard',
	href,
	linkComponent,
}: ContentProps) => {
	const Link = linkComponent ?? 'a';

	if (href) {
		return (
			<Link
				href={href}
				data-color={color}
				css={[
					fg('platform-component-visual-refresh') ? baseStyles : baseStylesOld,
					fg('platform-component-visual-refresh') ? linkStyles : linkStylesOld,
					!fg('platform-component-visual-refresh') && elemBefore && hasBeforeStyles,
					isRemovable && fg('platform-component-visual-refresh') ? hasAfterStyles : undefined,
					isRemovable && !fg('platform-component-visual-refresh') ? hasAfterStylesOld : undefined,
				]}
			>
				{text}
			</Link>
		);
	} else {
		return (
			<span
				css={[
					fg('platform-component-visual-refresh') ? baseStyles : baseStylesOld,
					!fg('platform-component-visual-refresh') && elemBefore && hasBeforeStyles,
					isRemovable && fg('platform-component-visual-refresh') ? hasAfterStyles : undefined,
					isRemovable && !fg('platform-component-visual-refresh') ? hasAfterStylesOld : undefined,
				]}
			>
				{text}
			</span>
		);
	}
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Content;
