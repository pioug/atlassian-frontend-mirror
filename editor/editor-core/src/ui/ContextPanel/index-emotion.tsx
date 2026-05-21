/**
 * @jsxRuntime classic
 * @jsx jsx
 */
/**
 * Emotion fallback branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `index.tsx`.
 *
 * Cleanup: delete this file once the `platform_editor_core_non_ecc_static_css` experiment has shipped.
 */
import { useMemo } from 'react';
import type { HTMLAttributes } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- intentional: emotion fallback for compiled migration
import { css, jsx } from '@emotion/react';

import {
	akEditorContextPanelWidth,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const ANIM_SPEED_MS = 500;

const panelHidden = css({
	width: 0,
});

const panel = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${akEditorContextPanelWidth}px`,
	height: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `width ${ANIM_SPEED_MS}ms ${akEditorSwoopCubicBezier}`,
	overflow: 'hidden',
	boxShadow: `inset 2px 0 0 0 ${token('color.border')}`,
});

const disablePanelAnimation = css({
	transition: 'none',
});

const content = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	transition: `width 600ms ${akEditorSwoopCubicBezier}`,
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${akEditorContextPanelWidth}px`,
	height: '100%',
	overflowY: 'auto',
});

const paddingStyles = css({
	padding: `${token('space.200')} ${token('space.200')} 0px`,
});

export interface ContextPanelWrapperProps extends HTMLAttributes<HTMLDivElement> {
	customWidth?: number;
	disableAnimation: boolean;
	visible: boolean;
}

export interface ContextPanelContentProps extends HTMLAttributes<HTMLDivElement> {
	customWidth?: number;
	disableAnimation: boolean;
	hasPadding: boolean;
	visible: boolean;
}

export const ContextPanelWrapperEmotion = ({
	children,
	customWidth,
	visible,
	disableAnimation,
	...rest
}: ContextPanelWrapperProps): jsx.JSX.Element => {
	const customPanelWidthStyles = useMemo(
		() =>
			customWidth
				? css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @repo/internal/react/no-class-components
						width: `${customWidth}px`,
						overflowX: 'hidden',
					})
				: undefined,
		[customWidth],
	);

	return (
		<div
			css={[
				panel,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage
				customPanelWidthStyles,
				!visible && panelHidden,
				disableAnimation && disablePanelAnimation,
			]}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			{children}
		</div>
	);
};

export const ContextPanelContentEmotion = ({
	children,
	customWidth,
	visible,
	disableAnimation,
	hasPadding,
	...rest
}: ContextPanelContentProps): jsx.JSX.Element => {
	const customPanelWidthStyles = useMemo(
		() =>
			customWidth
				? css({
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @repo/internal/react/no-class-components
						width: `${customWidth}px`,
						overflowX: 'hidden',
					})
				: undefined,
		[customWidth],
	);

	return (
		<div
			css={[
				content,
				hasPadding && paddingStyles,
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/design-system/consistent-css-prop-usage
				customPanelWidthStyles,
				!visible && panelHidden,
				disableAnimation && disablePanelAnimation,
			]}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			{children}
		</div>
	);
};
