/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
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

const InlineExtension = (props: Props) => {
	const {
		node,
		pluginInjectionApi,
		macroInteractionDesignFeatureFlags,
		isNodeSelected,
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
		'with-hover-border': expValEquals(
			'cc_editor_ttvc_release_bundle_one',
			'extensionHoverRefactor',
			true,
		)
			? false
			: showMacroInteractionDesignUpdates && isNodeHovered,
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
					isNodeSelected={isNodeSelected}
					isNodeHovered={isNodeHovered}
					showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
					setIsNodeHovered={setIsNodeHovered}
					pluginInjectionApi={pluginInjectionApi}
				/>
			)}
			{/* eslint-disable-next-line @atlassian/a11y/no-static-element-interactions*/}
			<div
				data-testid="inline-extension-wrapper"
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					wrapperStyle,
					inlineWrapperStyles,
					showMacroInteractionDesignUpdates &&
						!isLivePageViewMode &&
						expValEquals('cc_editor_ttvc_release_bundle_one', 'extensionHoverRefactor', true) &&
						hoverStyles,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
				onMouseEnter={() => handleMouseEvent(true)}
				// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
				onMouseLeave={() => handleMouseEvent(false)}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766  */}
				<div css={overlay} className="extension-overlay" />
				{children ? (
					children
				) : (
					<ExtensionLozenge
						node={node}
						isNodeSelected={isNodeSelected}
						showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
						pluginInjectionApi={pluginInjectionApi}
					/>
				)}
			</div>
		</Fragment>
	);
	return (
		<WidthContext.Provider value={createWidthContext(rendererContainerWidth)}>
			{inlineExtensionInternal}
		</WidthContext.Provider>
	);
};

export default InlineExtension;
