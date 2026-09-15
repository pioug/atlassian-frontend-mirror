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

import { akEditorContextPanelWidth } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const panelHidden = css({
	width: 0,
});

const panel = css({
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	width: `${akEditorContextPanelWidth}px`,
	height: '100%',
	overflow: 'hidden',
	boxShadow: `inset 2px 0 0 0 ${token('color.border')}`,
});

const content = css({
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
	visible: boolean;
}

export interface ContextPanelContentProps extends HTMLAttributes<HTMLDivElement> {
	customWidth?: number;
	hasPadding: boolean;
	visible: boolean;
}

export const ContextPanelWrapperEmotion = ({
	children,
	customWidth,
	visible,
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
			]}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const ContextPanelContentEmotion = ({
	children,
	customWidth,
	visible,
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
			]}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			{children}
		</div>
	);
};
