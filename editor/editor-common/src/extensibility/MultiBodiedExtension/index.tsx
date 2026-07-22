/* eslint-disable @atlaskit/design-system/prefer-primitives */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */

import React, { Fragment, useEffect, useRef, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled, @typescript-eslint/consistent-type-imports -- Ignored via go/DSP-18766; jsx required at runtime for @jsxRuntime classic
import { css, jsx } from '@emotion/react';
import { bind } from 'bind-event-listener';
import classnames from 'classnames';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { Selection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import EditorFileIcon from '@atlaskit/icon/core/file';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { EventDispatcher } from '../../event-dispatcher';
import type { MultiBodiedExtensionActions } from '../../extensions';
import { useSharedPluginStateWithSelector } from '../../hooks';
import type { EditorAppearance, EditorContainerWidth } from '../../types';
import type { OverflowShadowProps } from '../../ui';
import {
	removeMarginsAndBorder,
	sharedMultiBodiedExtensionStyles,
} from '../../ui/MultiBodiedExtension';
import { calculateBreakoutStyles, getExtensionLozengeData } from '../../utils';
import ExtensionLozenge from '../Extension/Lozenge';
import { ExtensionFloatingLabel } from '../Extension/Lozenge/ExtensionFloatingLabel';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from '../types';
import { shouldExtensionBreakout } from '../utils/should-extension-breakout';

import { useMultiBodiedExtensionActions } from './action-api';
import {
	mbeExtensionWrapperCSSStyles,
	mbeExtensionWrapperCSSStylesOld,
	overlayStyles,
	overlayStylesOld,
} from './styles';

const getContainerCssExtendedStyles = (
	activeChildIndex: number,
	showMacroInteractionDesignUpdates?: boolean,
) =>
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
	css(sharedMultiBodiedExtensionStyles.mbeExtensionContainer, {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		[`.multiBodiedExtension-content-dom-wrapper > [data-extension-frame='true']:nth-of-type(${
			activeChildIndex + 1
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
		})`]: css(
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			sharedMultiBodiedExtensionStyles.extensionFrameContent,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-unsafe-values, @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
			showMacroInteractionDesignUpdates && removeMarginsAndBorder,
		),
	});

const imageStyles = css({
	maxHeight: '24px',
	maxWidth: '24px',
});

const hoverStyles = css({
	'&:hover': {
		boxShadow: `0 0 0 1px ${token('color.border')}`,
	},
});

const hoverStylesOld = css({
	'&:hover': {
		boxShadow: `0 0 0 1px ${token('color.border.input')}`,
	},
});

export type TryExtensionHandlerType = (
	actions: MultiBodiedExtensionActions | undefined,
) => React.ReactElement | null;

type Props = {
	allowBodiedOverride?: boolean;
	editorAppearance?: EditorAppearance;
	editorView: EditorView;
	eventDispatcher?: EventDispatcher;
	getPos: () => number | undefined;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	isLivePageViewMode?: boolean;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	isNodeSelected?: boolean;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	node: PmNode;
	pluginInjectionApi?: ExtensionsPluginInjectionAPI;
	setIsNodeHovered?: (isHovered: boolean) => void;
	tryExtensionHandler: TryExtensionHandlerType;
};

type PropsWithWidth = Props & {
	widthState?: EditorContainerWidth;
};

interface CustomImageData {
	height?: number;
	url: string;
	width?: number;
}
type ImageData = CustomImageData | undefined;

const MultiBodiedExtensionFrames = ({
	articleRef,
}: {
	articleRef: (node: HTMLElement | null) => void;
}) => {
	return (
		<article
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="multiBodiedExtension--frames"
			data-testid="multiBodiedExtension--frames"
			data-multibodiedextension-frames
			ref={articleRef}
		/>
	);
};

const isSelectionInsideNode = (
	selection: Selection | undefined,
	node: PmNode,
	getPos: () => number | undefined,
) => {
	const nodeStartPosition = getPos();

	if (typeof nodeStartPosition !== 'number' || !selection) {
		return false;
	}

	const nodeEndPosition = nodeStartPosition + node.nodeSize;

	/*
		selection starts within MBE ||
		selection ends within MBE ||
		selection includes MBE
	*/
	return (
		(nodeStartPosition < selection.from && selection.from < nodeEndPosition) ||
		(nodeStartPosition < selection.to && selection.to < nodeEndPosition) ||
		(nodeStartPosition >= selection.from && selection.to >= nodeEndPosition)
	);
};

const useIsSelectionInsideNode = (
	editorView: EditorView,
	node: PmNode,
	getPos: () => number | undefined,
	enabled: boolean,
) => {
	const nodeRef = useRef(node);
	const [isSelectionInside, setIsSelectionInside] = useState(
		() => enabled && isSelectionInsideNode(editorView.state.selection, node, getPos),
	);

	nodeRef.current = node;

	useEffect(() => {
		if (!enabled) {
			return;
		}

		let animationFrameId: number | undefined;

		const updateSelectionInsideNode = () => {
			setIsSelectionInside(
				isSelectionInsideNode(editorView.state.selection, nodeRef.current, getPos),
			);
		};

		const scheduleUpdateSelectionInsideNode = () => {
			if (animationFrameId !== undefined) {
				cancelAnimationFrame(animationFrameId);
			}

			animationFrameId = requestAnimationFrame(updateSelectionInsideNode);
		};

		const ownerDocument = editorView.dom.ownerDocument;
		const unbindSelectionChange = bind(ownerDocument, {
			listener: scheduleUpdateSelectionInsideNode,
			type: 'selectionchange',
		});
		const unbindKeyUp = bind(editorView.dom, {
			listener: scheduleUpdateSelectionInsideNode,
			type: 'keyup',
		});
		const unbindMouseUp = bind(editorView.dom, {
			listener: scheduleUpdateSelectionInsideNode,
			type: 'mouseup',
		});

		return () => {
			if (animationFrameId !== undefined) {
				cancelAnimationFrame(animationFrameId);
			}

			unbindSelectionChange();
			unbindKeyUp();
			unbindMouseUp();
		};
	}, [editorView, getPos, enabled]);

	return enabled && isSelectionInside;
};

// Similar to the one in platform/packages/editor/editor-common/src/extensibility/Extension/Lozenge.tsx
const getWrapperTitleContent = (
	imageData: ImageData,
	title: string,
	showMacroInteractionDesignUpdates?: boolean,
) => {
	if (showMacroInteractionDesignUpdates) {
		return null;
	}
	if (imageData) {
		const { url, ...rest } = imageData;
		return (
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			<div className="extension-title">
				<img
					css={imageStyles}
					src={url}
					// Ignored via go/ees005
					// eslint-disable-next-line react/jsx-props-no-spreading
					{...rest}
					alt={title}
				/>
				{title}
			</div>
		);
	}
	return (
		<div
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className="extension-title"
			data-testid={'multiBodiedExtension-default-lozenge'}
		>
			<EditorFileIcon label={title} />
			{title}
		</div>
	);
};

const MultiBodiedExtensionWithWidth = ({
	node,
	handleContentDOMRef,
	getPos,
	tryExtensionHandler,
	editorView,
	eventDispatcher,
	widthState,
	editorAppearance,
	macroInteractionDesignFeatureFlags,
	isNodeSelected,
	isNodeHovered,
	isNodeNested,
	setIsNodeHovered,
	pluginInjectionApi,
	isLivePageViewMode,
	allowBodiedOverride = false,
}: PropsWithWidth) => {
	const { showMacroInteractionDesignUpdates } = macroInteractionDesignFeatureFlags || {};
	const { parameters, extensionKey } = node.attrs;
	const title =
		(parameters && parameters.extensionTitle) ||
		(parameters && parameters.macroMetadata && parameters.macroMetadata.title) ||
		extensionKey ||
		node.type.name;
	const imageData: ImageData = getExtensionLozengeData({ node, type: 'image' });

	const [activeChildIndex, setActiveChildIndex] = useState<number>(0);
	// Adding to avoid aliasing `this` for the callbacks
	const updateActiveChild = React.useCallback(
		(index: number) => {
			if (typeof index !== 'number') {
				setActiveChildIndex(0);
				throw new Error('Index is not valid');
			}

			setActiveChildIndex(index);
			return true;
		},
		[setActiveChildIndex],
	);

	const articleRef = React.useCallback(
		(node: HTMLElement | null) => {
			return handleContentDOMRef(node);
		},
		[handleContentDOMRef],
	);

	const childrenContainer = React.useMemo(() => {
		return <MultiBodiedExtensionFrames articleRef={articleRef} />;
	}, [articleRef]);

	const actions = useMultiBodiedExtensionActions({
		updateActiveChild,
		editorView,
		getPos,
		node,
		eventDispatcher,
		allowBodiedOverride,
		childrenContainer,
	});

	const extensionHandlerResult = React.useMemo(() => {
		return tryExtensionHandler(actions);
	}, [tryExtensionHandler, actions]);

	const layout = node.attrs.layout;
	const legacyShouldBreakout =
		['full-width', 'wide'].includes(layout) && editorAppearance !== 'full-width';
	const tinymceFullWidthModeEnabled = expValEquals(
		'confluence_max_width_content_appearance',
		'isEnabled',
		true,
	);
	const shouldUseBreakoutFix = tinymceFullWidthModeEnabled;
	const shouldBreakout = shouldUseBreakoutFix
		? shouldExtensionBreakout({
				layout,
				editorAppearance,
				isTopLevelNode: true,
			})
		: legacyShouldBreakout;

	let mbeWrapperStyles = {};
	if (shouldBreakout) {
		const { ...breakoutStyles } = calculateBreakoutStyles({
			mode: node.attrs.layout,
			widthStateLineLength: widthState?.lineLength,
			widthStateWidth: widthState?.width,
		});
		mbeWrapperStyles = breakoutStyles;
	}

	const shouldUseUpdatedChrome = expValEquals(
		'confluence_native_tabs_experiment',
		'isEnabled',
		true,
	);
	const isSelectionInsideMultiBodiedExtension = useIsSelectionInsideNode(
		editorView,
		node,
		getPos,
		shouldUseUpdatedChrome && !isLivePageViewMode,
	);
	const isMultiBodiedExtensionActive = isNodeSelected || isSelectionInsideMultiBodiedExtension;
	const shouldShowChromeOnInteraction = isNodeHovered || isMultiBodiedExtensionActive;
	const shouldShowMultiBodiedExtensionChrome = shouldUseUpdatedChrome
		? !isLivePageViewMode && shouldShowChromeOnInteraction
		: true;

	const wrapperClassNames = classnames(
		'multiBodiedExtension--wrapper',
		'extension-container',
		'block',
		{
			'with-border': showMacroInteractionDesignUpdates && shouldShowMultiBodiedExtensionChrome,
			'with-selected-border':
				showMacroInteractionDesignUpdates &&
				shouldUseUpdatedChrome &&
				!isLivePageViewMode &&
				isNodeSelected,
			'with-danger-overlay': showMacroInteractionDesignUpdates,
			'with-padding-background-styles': showMacroInteractionDesignUpdates,
			'with-margin-styles': showMacroInteractionDesignUpdates && !isNodeNested,
		},
	);

	const containerClassNames = classnames('multiBodiedExtension--container', {
		'remove-padding': showMacroInteractionDesignUpdates,
	});

	const bodyContainerClassNames = classnames('multiBodiedExtension--body-container');

	const navigationClassNames = classnames('multiBodiedExtension--navigation', {
		'remove-margins': showMacroInteractionDesignUpdates,
		'remove-border': showMacroInteractionDesignUpdates,
	});

	const overlayClassNames = classnames('multiBodiedExtension--overlay', {
		'with-margin': showMacroInteractionDesignUpdates,
	});

	const handleMouseEvent = (didHover: boolean) => {
		if (setIsNodeHovered) {
			setIsNodeHovered(didHover);
		}
	};
	const shouldRenderExtensionLozenge =
		showMacroInteractionDesignUpdates && !isLivePageViewMode && !shouldUseUpdatedChrome;
	const shouldRenderFloatingLabel =
		showMacroInteractionDesignUpdates &&
		!isLivePageViewMode &&
		shouldUseUpdatedChrome &&
		shouldShowChromeOnInteraction;

	return (
		<Fragment>
			{shouldRenderExtensionLozenge && (
				<ExtensionLozenge
					node={node}
					showMacroInteractionDesignUpdates={true}
					customContainerStyles={mbeWrapperStyles}
					isNodeHovered={isNodeHovered}
					isNodeNested={isNodeNested}
					setIsNodeHovered={setIsNodeHovered}
					isBodiedMacro={true}
					pluginInjectionApi={pluginInjectionApi}
				/>
			)}
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={wrapperClassNames}
				css={[
					/* eslint-disable @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */
					shouldUseUpdatedChrome ? mbeExtensionWrapperCSSStyles : mbeExtensionWrapperCSSStylesOld,
					/* eslint-enable @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage */
					showMacroInteractionDesignUpdates &&
						!isLivePageViewMode &&
						(shouldUseUpdatedChrome ? hoverStyles : hoverStylesOld),
				]}
				data-testid="multiBodiedExtension--wrapper-editor"
				data-layout={node.attrs.layout}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={mbeWrapperStyles}
				onMouseEnter={() => handleMouseEvent(true)}
				// @atlassian/a11y/mouse-events-have-key-events: hover border is also applied via .ak-editor-selected-node
				// CSS on keyboard selection. No-ops here satisfy the rule without duplicating state updates.
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
				{shouldRenderFloatingLabel && (
					<ExtensionFloatingLabel
						title={title}
						isSelected={isNodeSelected}
						testId="multiBodiedExtension-floating-label"
					/>
				)}
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					css={shouldUseUpdatedChrome ? overlayStyles : overlayStylesOld}
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={overlayClassNames}
					data-testid="multiBodiedExtension--overlay"
				/>
				{getWrapperTitleContent(imageData, title, showMacroInteractionDesignUpdates)}
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
					className={containerClassNames}
					// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					css={getContainerCssExtendedStyles(activeChildIndex, showMacroInteractionDesignUpdates)}
					data-testid="multiBodiedExtension--container"
					data-multiBodiedExtension-container
					data-active-child-index={activeChildIndex}
				>
					{allowBodiedOverride ? (
						<div
							// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
							className={bodyContainerClassNames}
							data-testid="multiBodiedExtension--body-container"
						>
							{extensionHandlerResult}
						</div>
					) : (
						<Fragment>
							<nav
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
								className={navigationClassNames}
								// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
								css={sharedMultiBodiedExtensionStyles.mbeNavigation}
								data-testid="multiBodiedExtension-navigation"
							>
								{extensionHandlerResult}
							</nav>

							{childrenContainer}
						</Fragment>
					)}
				</div>
			</div>
		</Fragment>
	);
};

const MultiBodiedExtension = (props: Props & OverflowShadowProps): jsx.JSX.Element => {
	const { pluginInjectionApi } = props;
	const { width, lineLength } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['width'],
		(states) => ({
			width: states.widthState?.width,
			lineLength: states.widthState?.lineLength,
		}),
	);
	// Ignored via go/ees005
	return (
		<MultiBodiedExtensionWithWidth
			widthState={width === undefined ? undefined : { width, lineLength }}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
};

export default MultiBodiedExtension;
