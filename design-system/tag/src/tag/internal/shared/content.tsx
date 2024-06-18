/**
 * @jsxRuntime classic
 */
/** @jsx jsx */

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

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

const baseStyles = css({
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

const linkStyles = css({
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

const hasAfterStyles = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	maxWidth: `${maxTextWidthUnitless - buttonWidthUnitless}px`,
	// eslint-disable-next-line @atlaskit/design-system/ensure-design-token-usage, @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	paddingInlineEnd: textPaddingRight,
});

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
				css={[baseStyles, linkStyles, elemBefore && hasBeforeStyles, isRemovable && hasAfterStyles]}
			>
				{text}
			</Link>
		);
	} else {
		return (
			<span css={[baseStyles, elemBefore && hasBeforeStyles, isRemovable && hasAfterStyles]}>
				{text}
			</span>
		);
	}
};

// eslint-disable-next-line @repo/internal/react/require-jsdoc
export default Content;
