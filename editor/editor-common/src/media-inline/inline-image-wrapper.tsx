/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties, ReactElement } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';

import { hexToEditorBorderPaletteColor } from '@atlaskit/editor-palette';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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
	aspectRatio?: number | string;
	borderColor?: string;
	borderSize?: number;
	children: ReactElement;
	htmlAttrs?: { [key: string]: string | number | undefined };
	isSelected?: boolean;
	onClick: React.EventHandler<React.MouseEvent | React.KeyboardEvent>;
};

export const InlineImageWrapper = ({
	children,
	isSelected,
	aspectRatio,
	borderSize,
	borderColor,
	htmlAttrs = {},
	onClick,
}: React.PropsWithChildren<Props>): jsx.JSX.Element => {
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

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true)) {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				onClick(e);
			}
		}
		return undefined;
	};

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
			role={
				expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true) ? 'button' : undefined
			}
			tabIndex={
				expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true) ? 0 : undefined
			}
			onClick={onClick}
			onKeyDown={onKeyDown}
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...htmlAttrs}
		>
			<span css={sizeWrapperStyle}>{children}</span>
		</span>
	);
};
