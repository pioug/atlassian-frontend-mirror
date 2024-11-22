/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties, ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';

import {
	borderStyle,
	INLINE_IMAGE_ASPECT_RATIO_CSS_VAR_KEY,
	INLINE_IMAGE_BORDER_COLOR_CSS_VAR_KEY,
	INLINE_IMAGE_BORDER_SIZE_CSS_VAR_KEY,
	INLINE_IMAGE_WRAPPER_CLASS_NAME,
	selectedStyle,
	wrapperStyle,
} from './styles';

// The MediaImage component needs to obtain its parent's dimensions.
// To achieve this, we have added an additional wrapper that allows
// for better interaction with the parent element. This is necessary
//  because the parent size changes its box-sizing with the node border.
const sizeWrapperStyle = css({
	display: 'inline-flex',
	width: '100%',
	height: '100%',
});

type Props = {
	children: ReactElement;
	isSelected?: boolean;
	aspectRatio?: number | string;
	borderSize?: number;
	borderColor?: string;
	htmlAttrs?: { [key: string]: string | number | undefined };
	onClick?: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
};

export const InlineImageWrapper = ({
	children,
	isSelected,
	aspectRatio,
	borderSize,
	borderColor,
	htmlAttrs = {},
	onClick,
}: React.PropsWithChildren<Props>) => {
	const borderStyleVars =
		borderSize && borderColor
			? ({
					[INLINE_IMAGE_BORDER_SIZE_CSS_VAR_KEY]: borderSize,
					[INLINE_IMAGE_BORDER_COLOR_CSS_VAR_KEY]:
						hexToEditorBorderPaletteColor(borderColor) || borderColor,
				} as CSSProperties)
			: {};

	const aspectStyleVars = aspectRatio
		? ({
				[INLINE_IMAGE_ASPECT_RATIO_CSS_VAR_KEY]: aspectRatio,
			} as CSSProperties)
		: {};

	return (
		// eslint-disable-next-line @atlaskit/design-system/prefer-primitives
		<span
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
			style={{ ...borderStyleVars, ...aspectStyleVars }}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={INLINE_IMAGE_WRAPPER_CLASS_NAME}
			css={[
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				wrapperStyle,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				borderSize && borderColor && borderStyle,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				isSelected && selectedStyle,
			]}
			data-testid="inline-image-wrapper"
			onClick={onClick}
			{...htmlAttrs}
		>
			<span css={sizeWrapperStyle}>{children}</span>
		</span>
	);
};
