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
import type { HTMLAttributes } from 'react';

import { cssMap, jsx } from '@compiled/react';

import {
	akEditorContextPanelWidth,
	akEditorSwoopCubicBezier,
} from '@atlaskit/editor-shared-styles';
import { token } from '@atlaskit/tokens';

const ANIM_SPEED_MS = 500;

const panelStyles = cssMap({
	panel: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		width: `${akEditorContextPanelWidth}px`,
		height: '100%',
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `width ${ANIM_SPEED_MS}ms ${akEditorSwoopCubicBezier}`,
		overflow: 'hidden',
		boxShadow: `inset 2px 0 0 0 ${token('color.border')}`,
	},
	panelHidden: {
		width: 0,
	},
	disablePanelAnimation: {
		transition: 'none',
	},
	content: {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		transition: `width 600ms ${akEditorSwoopCubicBezier}`,
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
	disableAnimation: boolean;
	visible: boolean;
}

export interface ContextPanelContentProps extends HTMLAttributes<HTMLDivElement> {
	customWidth?: number;
	disableAnimation: boolean;
	hasPadding: boolean;
	visible: boolean;
}

export const ContextPanelWrapperCompiled = ({
	children,
	customWidth,
	visible,
	disableAnimation,
	...rest
}: ContextPanelWrapperProps): React.JSX.Element => (
	<div
		css={[
			panelStyles.panel,
			customWidth ? panelStyles.customWidthOverflow : undefined,
			!visible && panelStyles.panelHidden,
			disableAnimation && panelStyles.disablePanelAnimation,
		]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic width cannot be expressed as static compiled CSS
		style={customWidth && visible ? { width: `${customWidth}px` } : undefined}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...rest}
	>
		{children}
	</div>
);

export const ContextPanelContentCompiled = ({
	children,
	customWidth,
	visible,
	disableAnimation,
	hasPadding,
	...rest
}: ContextPanelContentProps): React.JSX.Element => (
	<div
		css={[
			panelStyles.content,
			hasPadding && panelStyles.padding,
			customWidth ? panelStyles.customWidthOverflow : undefined,
			!visible && panelStyles.panelHidden,
			disableAnimation && panelStyles.disablePanelAnimation,
		]}
		// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- dynamic width cannot be expressed as static compiled CSS
		style={customWidth && visible ? { width: `${customWidth}px` } : undefined}
		// eslint-disable-next-line react/jsx-props-no-spreading
		{...rest}
	>
		{children}
	</div>
);
