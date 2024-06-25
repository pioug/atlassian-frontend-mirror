/* eslint-disable @atlaskit/design-system/prefer-primitives */
/** @jsx jsx */

import React, { Fragment, useState } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import EditorFileIcon from '@atlaskit/icon/glyph/editor/file';

import type { EventDispatcher } from '../../event-dispatcher';
import type { MultiBodiedExtensionActions } from '../../extensions';
import { useSharedPluginState } from '../../hooks';
import type { EditorAppearance, EditorContainerWidth } from '../../types';
import type { OverflowShadowProps } from '../../ui';
import {
	removeMarginsAndBorder,
	sharedMultiBodiedExtensionStyles,
} from '../../ui/MultiBodiedExtension';
import { calculateBreakoutStyles, getExtensionLozengeData } from '../../utils';
import ExtensionLozenge from '../Extension/Lozenge';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from '../types';

import { useMultiBodiedExtensionActions } from './action-api';
import { mbeExtensionWrapperCSSStyles, overlayStyles } from './styles';

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

export type TryExtensionHandlerType = (
	actions: MultiBodiedExtensionActions | undefined,
) => React.ReactElement | null;

type Props = {
	node: PmNode;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	editorView: EditorView;
	getPos: () => number | undefined;
	tryExtensionHandler: TryExtensionHandlerType;
	eventDispatcher?: EventDispatcher;
	pluginInjectionApi?: ExtensionsPluginInjectionAPI;
	editorAppearance?: EditorAppearance;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	isNodeSelected?: boolean;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	setIsNodeHovered?: (isHovered: boolean) => void;
};

type PropsWithWidth = Props & {
	widthState?: EditorContainerWidth;
};

interface CustomImageData {
	url: string;
	height?: number;
	width?: number;
}
type ImageData = CustomImageData | undefined;

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
				<img css={imageStyles} src={url} {...rest} alt={title} />
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

	const actions = useMultiBodiedExtensionActions({
		updateActiveChild,
		editorView,
		getPos,
		eventDispatcher,
		node,
	});

	const extensionHandlerResult = React.useMemo(() => {
		return tryExtensionHandler(actions);
	}, [tryExtensionHandler, actions]);

	const articleRef = React.useCallback(
		(node: HTMLElement | null) => {
			return handleContentDOMRef(node);
		},
		[handleContentDOMRef],
	);

	const shouldBreakout =
		// Extension should breakout when the layout is set to 'full-width' or 'wide'.
		['full-width', 'wide'].includes(node.attrs.layout) &&
		// Extension breakout state should not be respected when the editor appearance is full-width mode
		editorAppearance !== 'full-width';

	let mbeWrapperStyles = {};
	if (shouldBreakout) {
		const { ...breakoutStyles } = calculateBreakoutStyles({
			mode: node.attrs.layout,
			widthStateLineLength: widthState?.lineLength,
			widthStateWidth: widthState?.width,
		});
		mbeWrapperStyles = breakoutStyles;
	}

	const wrapperClassNames = classnames(
		'multiBodiedExtension--wrapper',
		'extension-container',
		'block',
		{
			'with-border': showMacroInteractionDesignUpdates,
			'with-danger-overlay': showMacroInteractionDesignUpdates,
			'with-padding-background-styles': showMacroInteractionDesignUpdates,
			'with-margin-styles': showMacroInteractionDesignUpdates && !isNodeNested,
			'with-hover-border': showMacroInteractionDesignUpdates && isNodeHovered,
		},
	);

	const containerClassNames = classnames('multiBodiedExtension--container', {
		'remove-padding': showMacroInteractionDesignUpdates,
	});

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

	return (
		<Fragment>
			{showMacroInteractionDesignUpdates && (
				<ExtensionLozenge
					isNodeSelected={isNodeSelected}
					node={node}
					showMacroInteractionDesignUpdates={true}
					customContainerStyles={mbeWrapperStyles}
					isNodeHovered={isNodeHovered}
					isNodeNested={isNodeNested}
					setIsNodeHovered={setIsNodeHovered}
					isBodiedMacro={true}
				/>
			)}
			<div
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={wrapperClassNames}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
				css={mbeExtensionWrapperCSSStyles}
				data-testid="multiBodiedExtension--wrapper"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={mbeWrapperStyles}
				onMouseEnter={() => handleMouseEvent(true)}
				onMouseLeave={() => handleMouseEvent(false)}
			>
				<div
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					css={overlayStyles}
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
					data-active-child-index={activeChildIndex}
				>
					<nav
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className={navigationClassNames}
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values -- Ignored via go/DSP-18766
						css={sharedMultiBodiedExtensionStyles.mbeNavigation}
						data-testid="multiBodiedExtension-navigation"
					>
						{extensionHandlerResult}
					</nav>

					<article
						// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
						className="multiBodiedExtension--frames"
						data-testid="multiBodiedExtension--frames"
						ref={articleRef}
					/>
				</div>
			</div>
		</Fragment>
	);
};

const MultiBodiedExtension = (props: Props & OverflowShadowProps) => {
	const { pluginInjectionApi } = props;
	const { widthState } = useSharedPluginState(pluginInjectionApi, ['width']);
	return <MultiBodiedExtensionWithWidth widthState={widthState} {...props} />;
};

export default MultiBodiedExtension;
