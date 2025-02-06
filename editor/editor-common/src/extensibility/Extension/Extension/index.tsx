/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties } from 'react';
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { jsx } from '@emotion/react';
import classnames from 'classnames';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { ExtensionProvider, ReferenceEntity } from '../../../extensions';
import { useSharedPluginState } from '../../../hooks';
import type { ProsemirrorGetPosHandler } from '../../../react-node-view';
import type { EditorAppearance, EditorContainerWidth } from '../../../types';
import { overflowShadow } from '../../../ui';
import type { OverflowShadowProps } from '../../../ui';
import { calculateBreakoutStyles } from '../../../utils';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from '../../types';
import ExtensionLozenge from '../Lozenge';
import { overlay } from '../styles';

import { isEmptyBodiedMacro } from './extension-utils';
import {
	content,
	contentWrapper,
	header,
	overflowWrapperStyles,
	widerLayoutClassName,
	wrapperStyle,
	wrapperStyleInheritedCursor,
} from './styles';

export interface Props {
	node: PmNode;
	getPos: ProsemirrorGetPosHandler;
	view: EditorView;
	extensionProvider?: ExtensionProvider;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	children?: React.ReactNode;
	references?: ReferenceEntity[];
	hideFrame?: boolean;
	editorAppearance?: EditorAppearance;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	isNodeSelected?: boolean;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	setIsNodeHovered?: (isHovered: boolean) => void;
	showLivePagesBodiedMacrosRendererView?: boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: boolean;
	showBodiedExtensionRendererView?: boolean;
	setShowBodiedExtensionRendererView?: (showBodiedExtensionRendererView: boolean) => void;
	isLivePageViewMode?: boolean;
}

type WidthStateProps = { widthState?: EditorContainerWidth };
interface ExtensionWithPluginStateProps extends Props, OverflowShadowProps, WidthStateProps {}
function ExtensionWithPluginState(props: ExtensionWithPluginStateProps) {
	const {
		node,
		handleContentDOMRef,
		children,
		widthState = { width: 0 },
		handleRef,
		shadowClassNames,
		hideFrame,
		editorAppearance,
		macroInteractionDesignFeatureFlags,
		isNodeSelected,
		isNodeHovered,
		isNodeNested,
		setIsNodeHovered,
		showLivePagesBodiedMacrosRendererView,
		showUpdatedLivePages1PBodiedExtensionUI,
		showBodiedExtensionRendererView,
		setShowBodiedExtensionRendererView,
		pluginInjectionApi,
		isLivePageViewMode,
	} = props;

	const { showMacroInteractionDesignUpdates } = macroInteractionDesignFeatureFlags || {};
	const hasBody = ['bodiedExtension', 'multiBodiedExtension'].includes(node.type.name);

	const hasChildren = !!children;
	const removeBorder = showMacroInteractionDesignUpdates || !!(hideFrame && !hasBody);

	const { getPos, view } = props;
	const isTopLevelNode = React.useMemo(() => {
		const pos: number | undefined = typeof getPos === 'function' ? getPos() : undefined;

		return typeof pos !== 'undefined' && !isNaN(pos) && view.state.doc.resolve(pos).depth === 0;
	}, [view, getPos]);

	const shouldBreakout =
		// Extension should breakout when the layout is set to 'full-width' or 'wide'.
		['full-width', 'wide'].includes(node.attrs.layout) &&
		// Extension breakout state should only be respected for top level nodes.
		isTopLevelNode &&
		// Extension breakout state should not be respected when the editor appearance is full-width mode
		editorAppearance !== 'full-width';

	// We don't want to show border for non-empty 1p bodied extensions in live pages
	const show1PBodiedExtensionBorder = showUpdatedLivePages1PBodiedExtensionUI
		? isEmptyBodiedMacro(node)
		: true;

	const classNames = classnames('extension-container', 'block', shadowClassNames, {
		'with-overlay': !hasBody && !showMacroInteractionDesignUpdates,
		'with-bodied-border':
			showMacroInteractionDesignUpdates &&
			hasBody &&
			!showBodiedExtensionRendererView &&
			show1PBodiedExtensionBorder,
		'with-margin-styles':
			showMacroInteractionDesignUpdates && !isNodeNested && !showBodiedExtensionRendererView,
		'with-hover-border': showMacroInteractionDesignUpdates && isNodeHovered,
		'with-danger-overlay': showMacroInteractionDesignUpdates,
		'without-frame': removeBorder,
		[widerLayoutClassName]: shouldBreakout,
	});

	const overflowClassNames = classnames('extension-overflow-wrapper', {
		'with-body': hasBody,
		'with-margin-styles':
			showMacroInteractionDesignUpdates && !isNodeNested && !showBodiedExtensionRendererView,
		// Adding extra padding for renderer view so users can have a touch target to click on the extension
		'with-padding-styles': showMacroInteractionDesignUpdates && showBodiedExtensionRendererView,
	});

	const headerClassNames = classnames({
		'with-children': hasChildren,
		'without-frame': removeBorder,
	});

	const newContentClassNames = classnames({
		'with-padding-styles': showMacroInteractionDesignUpdates,
		'with-bodied-padding-styles': hasBody && showMacroInteractionDesignUpdates,
	});

	const contentClassNames = classnames('extension-content', 'block', {
		'remove-border': showMacroInteractionDesignUpdates,
		'hide-content': showBodiedExtensionRendererView,
	});

	let customContainerStyles: CSSProperties = {
		width: '100%',
	};

	let newContentStyles = {};

	if (shouldBreakout) {
		const { type, ...breakoutStyles } = calculateBreakoutStyles({
			mode: node.attrs.layout,
			widthStateWidth: widthState.width,
			widthStateLineLength: widthState.lineLength,
		});

		newContentStyles = { ...breakoutStyles };

		customContainerStyles = breakoutStyles;
	}

	newContentStyles = {
		...newContentStyles,
		...contentWrapper,
	};

	const handleMouseEvent = (didHover: boolean) => {
		if (setIsNodeHovered) {
			setIsNodeHovered(didHover);
		}
	};

	return (
		<Fragment>
			{showMacroInteractionDesignUpdates && !isLivePageViewMode && (
				<ExtensionLozenge
					isNodeSelected={isNodeSelected}
					isNodeHovered={isNodeHovered}
					isNodeNested={isNodeNested}
					node={node}
					showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
					customContainerStyles={customContainerStyles}
					setIsNodeHovered={setIsNodeHovered}
					isBodiedMacro={hasBody}
					showLivePagesBodiedMacrosRendererView={showLivePagesBodiedMacrosRendererView}
					showUpdatedLivePages1PBodiedExtensionUI={showUpdatedLivePages1PBodiedExtensionUI}
					showBodiedExtensionRendererView={showBodiedExtensionRendererView}
					setShowBodiedExtensionRendererView={setShowBodiedExtensionRendererView}
					pluginInjectionApi={pluginInjectionApi}
				/>
			)}
			{/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
			<div
				data-testid="extension-container"
				ref={handleRef}
				data-layout={node.attrs.layout}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				css={
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					fg('platform_editor_legacy_content_macro') ? wrapperStyleInheritedCursor : wrapperStyle
				}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={customContainerStyles}
				onMouseEnter={() => handleMouseEvent(true)}
				onMouseLeave={() => handleMouseEvent(false)}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div
					data-testid="extension-overflow-wrapper"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={overflowClassNames}
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
					css={overflowWrapperStyles}
				>
					{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
					<div className={'extension-overlay'} css={overlay} />
					<div
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						css={header}
						contentEditable={false}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={headerClassNames}
					>
						{!removeBorder && (
							<ExtensionLozenge
								isNodeSelected={isNodeSelected}
								node={node}
								showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
								pluginInjectionApi={pluginInjectionApi}
							/>
						)}
						{children}
					</div>
					{hasBody && (
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
						<div
							// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage
							css={newContentStyles}
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
							className={newContentClassNames}
							data-testid="extension-new-content"
						>
							<div
								data-testid="extension-content"
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
								css={content}
								ref={handleContentDOMRef}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={contentClassNames}
							/>
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
}

const Extension = (props: Props & OverflowShadowProps) => {
	const { pluginInjectionApi } = props;
	const { widthState } = useSharedPluginState(pluginInjectionApi, ['width']);
	// Ignored via go/ees005
	// eslint-disable-next-line react/jsx-props-no-spreading
	return <ExtensionWithPluginState widthState={widthState} {...props} />;
};

export default overflowShadow(Extension, {
	overflowSelector: '.extension-overflow-wrapper',
});
