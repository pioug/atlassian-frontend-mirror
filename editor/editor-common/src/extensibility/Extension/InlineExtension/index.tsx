/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment, useMemo } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import {
	akEditorGutterPaddingDynamic,
	akEditorGutterPaddingReduced,
	akEditorFullPageNarrowBreakout,
} from '@atlaskit/editor-shared-styles';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';
import { token } from '@atlaskit/tokens';

import { useSharedPluginStateWithSelector } from '../../../hooks';
import { createWidthContext, WidthContext } from '../../../ui';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from '../../types';
import ExtensionLozenge from '../Lozenge';
import { overlay } from '../styles';

import { wrapperStyle } from './styles';

export interface Props {
	children?: React.ReactNode;
	isLivePageViewMode?: boolean;
	isNodeHovered?: boolean;
	isNodeSelected?: boolean;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	node: PmNode;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	setIsNodeHovered?: (isHovered: boolean) => void;
}

const inlineWrapperStyles = css({
	maxWidth: '100%',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors, @atlaskit/ui-styling-standard/no-unsafe-selectors -- Ignored via go/DSP-18766
	'tr &': {
		maxWidth: 'inherit',
	},
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'.rich-media-item': {
		maxWidth: '100%',
	},
});

const hoverStyles = css({
	'&:hover': {
		boxShadow: `0 0 0 1px ${token('color.border.input')}`,
	},
});

const MemoizedWidthContextProvider = ({
	rendererContainerWidth,
	children,
}: {
	children: React.ReactNode;
	rendererContainerWidth: number;
}): jsx.JSX.Element => {
	const widthContextValue = useMemo(
		() => createWidthContext(rendererContainerWidth),
		[rendererContainerWidth],
	);

	return <WidthContext.Provider value={widthContextValue}>{children}</WidthContext.Provider>;
};

const LegacyWidthContextProvider = ({
	rendererContainerWidth,
	children,
}: {
	children: React.ReactNode;
	rendererContainerWidth: number;
}): jsx.JSX.Element => {
	return (
		<WidthContext.Provider value={createWidthContext(rendererContainerWidth)}>
			{children}
		</WidthContext.Provider>
	);
};

const InlineExtension = (props: Props): jsx.JSX.Element => {
	const {
		node,
		pluginInjectionApi,
		macroInteractionDesignFeatureFlags,
		children,
		isNodeHovered,
		setIsNodeHovered,
		isLivePageViewMode,
	} = props;
	const { showMacroInteractionDesignUpdates } = macroInteractionDesignFeatureFlags || {};

	const { width } = useSharedPluginStateWithSelector(pluginInjectionApi, ['width'], (states) => {
		return {
			width: states.widthState?.width,
		};
	});

	const hasChildren = !!children;

	const classNames = classnames('extension-container', 'inline', {
		'with-overlay': !showMacroInteractionDesignUpdates,
		'with-children': hasChildren,
		'with-danger-overlay': showMacroInteractionDesignUpdates,
	});

	let rendererContainerWidth = 0;
	if (
		editorExperiment('platform_editor_preview_panel_responsiveness', true, {
			exposure: true,
		})
	) {
		if (width) {
			const padding =
				width > akEditorFullPageNarrowBreakout
					? akEditorGutterPaddingDynamic()
					: akEditorGutterPaddingReduced;

			rendererContainerWidth = width - padding * 2;
		}
	} else {
		rendererContainerWidth = width ? width - akEditorGutterPaddingDynamic() * 2 : 0;
	}

	const handleMouseEvent = (didHover: boolean) => {
		if (setIsNodeHovered) {
			setIsNodeHovered(didHover);
		}
	};

	const inlineExtensionInternal = (
		<Fragment>
			{showMacroInteractionDesignUpdates && !isLivePageViewMode && (
				<ExtensionLozenge
					node={node}
					isNodeHovered={isNodeHovered}
					showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
					setIsNodeHovered={setIsNodeHovered}
					pluginInjectionApi={pluginInjectionApi}
				/>
			)}
			<div
				data-testid="inline-extension-wrapper"
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					wrapperStyle,
					inlineWrapperStyles,
					showMacroInteractionDesignUpdates && !isLivePageViewMode && hoverStyles,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				onMouseEnter={() => handleMouseEvent(true)}
				// @atlassian/a11y/mouse-events-have-key-events: hover border is also accessible via keyboard selection.
				// No-ops here satisfy the rule without duplicating state updates.
				onFocus={
					expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true)
						? () => {}
						: undefined
				}
				onMouseLeave={() => handleMouseEvent(false)}
				onBlur={
					expValEquals('editor_a11y__enghealth-46814_fy26', 'isEnabled', true)
						? () => {}
						: undefined
				}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766  */}
				<div css={overlay} className="extension-overlay" />
				{children ? (
					children
				) : (
					<ExtensionLozenge
						node={node}
						showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
						pluginInjectionApi={pluginInjectionApi}
					/>
				)}
			</div>
		</Fragment>
	);

	return expValEquals('enghealth-53346_fix_redaction_marker_editor', 'isEnabled', true) ? (
		<MemoizedWidthContextProvider rendererContainerWidth={rendererContainerWidth}>
			{inlineExtensionInternal}
		</MemoizedWidthContextProvider>
	) : (
		<LegacyWidthContextProvider rendererContainerWidth={rendererContainerWidth}>
			{inlineExtensionInternal}
		</LegacyWidthContextProvider>
	);
};

export default InlineExtension;
