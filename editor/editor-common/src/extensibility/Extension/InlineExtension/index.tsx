/** @jsx jsx */
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import classnames from 'classnames';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import { akEditorGutterPaddingDynamic } from '@atlaskit/editor-shared-styles';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';

import { useSharedPluginState } from '../../../hooks';
import { createWidthContext, WidthContext } from '../../../ui';
import type { ExtensionsPluginInjectionAPI } from '../../types';
import ExtensionLozenge from '../Lozenge';
import { overlay } from '../styles';

import { inlineWrapperStyles, wrapperStyle } from './styles';

export interface Props {
	node: PmNode;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	children?: React.ReactNode;
	showMacroInteractionDesignUpdates?: boolean;
	isNodeSelected?: boolean;
	isNodeHovered?: boolean;
	setIsNodeHovered?: (isHovered: boolean) => void;
}

const InlineExtension = (props: Props) => {
	const {
		node,
		pluginInjectionApi,
		showMacroInteractionDesignUpdates,
		isNodeSelected,
		children,
		isNodeHovered,
		setIsNodeHovered,
	} = props;
	const { widthState } = useSharedPluginState(pluginInjectionApi, ['width']);

	const hasChildren = !!children;

	const classNames = classnames('extension-container', 'inline', {
		'with-overlay': !showMacroInteractionDesignUpdates,
		'with-children': hasChildren,
		'with-danger-overlay': showMacroInteractionDesignUpdates,
		'with-hover-border': showMacroInteractionDesignUpdates && isNodeHovered,
	});

	const rendererContainerWidth = widthState
		? widthState.width - akEditorGutterPaddingDynamic() * 2
		: 0;

	const extendedInlineExtension =
		getBooleanFF('platform.editor.inline_extension.extended_lcqdn') || false;

	const handleMouseEvent = (didHover: boolean) => {
		if (setIsNodeHovered) {
			setIsNodeHovered(didHover);
		}
	};

	const inlineExtensionInternal = (
		<Fragment>
			{showMacroInteractionDesignUpdates && (
				<ExtensionLozenge
					node={node}
					isNodeSelected={isNodeSelected}
					isNodeHovered={isNodeHovered}
					showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
					setIsNodeHovered={setIsNodeHovered}
				/>
			)}
			<div
				data-testid="inline-extension-wrapper"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={[wrapperStyle, extendedInlineExtension && inlineWrapperStyles]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				onMouseEnter={() => handleMouseEvent(true)}
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
					/>
				)}
			</div>
		</Fragment>
	);
	if (extendedInlineExtension) {
		return (
			<WidthContext.Provider value={createWidthContext(rendererContainerWidth)}>
				{inlineExtensionInternal}
			</WidthContext.Provider>
		);
	}
	return inlineExtensionInternal;
};

export default InlineExtension;
