/**
 * @jsxRuntime classic
 * @jsx jsx
 * Compiled migration: platform_editor_core_non_ecc_static_css
 */
/**
 * Compiled branch of the `platform_editor_core_non_ecc_static_css` experiment.
 * Used via `componentWithCondition` in `index.tsx`.
 *
 * Cleanup: delete this file once the `platform_editor_core_non_ecc_static_css` experiment has shipped.
 */
import { useMemo } from 'react';
import type { CSSProperties, HTMLAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

import { akEditorContextPanelWidth } from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const getContextPanelWidthStyle = ({
	customWidth,
	visible,
}: {
	customWidth?: number;
	visible: boolean;
}): CSSProperties | undefined => {
	if (!visible) {
		return {
			width: 0,
		};
	}

	if (customWidth) {
		return { width: `${customWidth}px` };
	}

	return undefined;
};

const panelStyles = cssMap({
	panel: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${akEditorContextPanelWidth}px`,
		height: '100%',
		overflow: 'hidden',
		boxShadow: `inset 2px 0 0 0 ${token('color.border')}`,
	},
	content: {
		boxSizing: 'border-box',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${akEditorContextPanelWidth}px`,
		height: '100%',
		overflowY: 'auto',
	},
	padding: {
		paddingTop: token('space.200'),
		paddingRight: token('space.200'),
		paddingBottom: token('space.0'),
		paddingLeft: token('space.200'),
	},
	customWidthOverflow: {
		overflowX: 'hidden',
	},
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

export const ContextPanelWrapperCompiled = ({
	children,
	customWidth,
	visible,
	...rest
}: ContextPanelWrapperProps): React.JSX.Element => {
	const widthStyle = useMemo(
		() => getContextPanelWidthStyle({ customWidth, visible }),
		[customWidth, visible],
	);

	return (
		<div
			css={[panelStyles.panel, customWidth ? panelStyles.customWidthOverflow : undefined]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic width cannot be expressed as static compiled CSS
			style={widthStyle}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			{children}
		</div>
	);
};

// eslint-disable-next-line @atlaskit/volt-strict-mode/no-multiple-exports
export const ContextPanelContentCompiled = ({
	children,
	customWidth,
	visible,
	hasPadding,
	...rest
}: ContextPanelContentProps): React.JSX.Element => {
	const widthStyle = useMemo(
		() => getContextPanelWidthStyle({ customWidth, visible }),
		[customWidth, visible],
	);

	return (
		<div
			css={[
				panelStyles.content,
				hasPadding && panelStyles.padding,
				customWidth ? panelStyles.customWidthOverflow : undefined,
			]}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic width cannot be expressed as static compiled CSS
			style={widthStyle}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...rest}
		>
			{children}
		</div>
	);
};
