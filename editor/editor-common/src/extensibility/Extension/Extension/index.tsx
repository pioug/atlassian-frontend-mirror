/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import type { CSSProperties } from 'react';
import React, { Fragment } from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';
import classnames from 'classnames';

import type { Node as PmNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { token } from '@atlaskit/tokens';

import type { ExtensionProvider, ReferenceEntity } from '../../../extensions';
import { useSharedPluginStateWithSelector } from '../../../hooks';
import type { ProsemirrorGetPosHandler } from '../../../react-node-view';
import type { EditorAppearance, EditorContainerWidth } from '../../../types';
import type { OverflowShadowProps, OverflowShadowState, ShadowObserver } from '../../../ui';
import { overflowShadow } from '../../../ui';
import { calculateBreakoutStyles } from '../../../utils';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from '../../types';
import { shouldExtensionBreakout } from '../../utils/should-extension-breakout';
import { LegacyContentHeader } from '../LegacyContentHeader';
import ExtensionLozenge from '../Lozenge';
import { overlay } from '../styles';

import { isEmptyBodiedMacro } from './extension-utils';
import {
	content,
	contentWrapper,
	extensionContent,
	header,
	overflowWrapperStyles,
	widerLayoutClassName,
	wrapperStyleInheritedCursor,
} from './styles';
export interface Props {
	children?: React.ReactNode;
	editorAppearance?: EditorAppearance;
	extensionProvider?: ExtensionProvider;
	getPos: ProsemirrorGetPosHandler;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	hideFrame?: boolean;
	isLivePageViewMode?: boolean;
	isNodeHovered?: boolean;
	isNodeNested?: boolean;
	isNodeSelected?: boolean;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	node: PmNode;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	references?: ReferenceEntity[];
	setIsNodeHovered?: (isHovered: boolean) => void;
	setShowBodiedExtensionRendererView?: (showBodiedExtensionRendererView: boolean) => void;
	showBodiedExtensionRendererView?: boolean;
	showLivePagesBodiedMacrosRendererView?: boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: boolean;
	view: EditorView;
}

const hoverStyles = css({
	'&:hover': {
		boxShadow: `0 0 0 1px ${token('color.border.input')}`,
	},
});

const containerStyle = css({
	containerType: 'inline-size',
});

type WidthStateProps = { widthState: EditorContainerWidth };
interface ExtensionWithPluginStateProps extends Props, OverflowShadowProps, WidthStateProps {}
function ExtensionWithPluginState(props: ExtensionWithPluginStateProps) {
	const {
		node,
		handleContentDOMRef,
		children,
		widthState,
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

	const isLegacyContentMacroExtension = (extensionNode: PmNode) =>
		extensionNode.type.name === 'extension' &&
		extensionNode.attrs?.extensionType === 'com.atlassian.confluence.migration' &&
		extensionNode.attrs?.extensionKey === 'legacy-content';
	const showLegacyContentHeader =
		fg('platform_editor_legacy_content_macro_visual_update') && isLegacyContentMacroExtension(node);

	const hasBody = ['bodiedExtension', 'multiBodiedExtension'].includes(node.type.name);

	const hasChildren = !!children;

	const removeBorder = showMacroInteractionDesignUpdates || !!(hideFrame && !hasBody);

	// Some native bodied macros (e.g Content properties) have this param to hide in view mode
	// which we want to also hide in live page view mode too
	const macroParamHiddenValue = node?.attrs?.parameters?.macroParams?.hidden?.value;
	const shouldHideInLivePageViewMode = isLivePageViewMode && macroParamHiddenValue === 'true'; // it is stored as a string

	const { getPos, view } = props;
	const isTopLevelNode = React.useMemo(() => {
		const pos: number | undefined = typeof getPos === 'function' ? getPos() : undefined;

		return typeof pos !== 'undefined' && !isNaN(pos) && view.state.doc.resolve(pos).depth === 0;
	}, [view, getPos]);

	const layout = node.attrs.layout;
	const legacyShouldBreakout =
		['full-width', 'wide'].includes(layout) && isTopLevelNode && editorAppearance !== 'full-width';
	const tinymceFullWidthModeEnabled = expValEquals(
		'confluence_max_width_content_appearance',
		'isEnabled',
		true,
	);
	const breakoutExtensionFixEnabled = expValEquals(
		'confluence_max_width_breakout_extension_fix',
		'isEnabled',
		true,
	);
	const shouldUseBreakoutFix = tinymceFullWidthModeEnabled && breakoutExtensionFixEnabled;
	const shouldBreakout = shouldUseBreakoutFix
		? shouldExtensionBreakout({
				layout,
				isTopLevelNode,
				editorAppearance,
			})
		: legacyShouldBreakout;

	// We don't want to show border for non-empty 1p bodied extensions in live pages
	const show1PBodiedExtensionBorder = showUpdatedLivePages1PBodiedExtensionUI
		? isEmptyBodiedMacro(node)
		: true;

	const classNames = classnames('extension-container', 'block', shadowClassNames, {
		'with-overlay': !hasBody && !showMacroInteractionDesignUpdates,
		'with-bodied-border':
			showMacroInteractionDesignUpdates &&
			(hasBody || isLegacyContentMacroExtension(node)) &&
			!showBodiedExtensionRendererView &&
			show1PBodiedExtensionBorder,
		'with-margin-styles':
			showMacroInteractionDesignUpdates && !isNodeNested && !showBodiedExtensionRendererView,
		'with-hover-border': expValEquals(
			'cc_editor_ttvc_release_bundle_one',
			'extensionHoverRefactor',
			true,
		)
			? false
			: showMacroInteractionDesignUpdates && isNodeHovered,
		'with-danger-overlay': showMacroInteractionDesignUpdates,
		'without-frame': removeBorder,
		'legacy-content': showLegacyContentHeader,
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

	const extensionContentStyles = expValEquals('platform_editor_extension_styles', 'isEnabled', true)
		? extensionContent
		: content;

	return (
		<Fragment>
			{showLegacyContentHeader && (
				<LegacyContentHeader
					isNodeSelected={isNodeSelected}
					isNodeHovered={isNodeHovered}
					onMouseEnter={() => handleMouseEvent(true)}
					onMouseLeave={() => handleMouseEvent(false)}
				/>
			)}
			{!showLegacyContentHeader && showMacroInteractionDesignUpdates && !isLivePageViewMode && (
				<ExtensionLozenge
					isNodeSelected={isNodeSelected}
					isNodeHovered={isNodeHovered}
					isNodeNested={isNodeNested}
					node={node}
					showMacroInteractionDesignUpdates={showMacroInteractionDesignUpdates}
					customContainerStyles={customContainerStyles}
					setIsNodeHovered={setIsNodeHovered}
					isBodiedMacro={hasBody || isLegacyContentMacroExtension(node)}
					showLivePagesBodiedMacrosRendererView={showLivePagesBodiedMacrosRendererView}
					showUpdatedLivePages1PBodiedExtensionUI={showUpdatedLivePages1PBodiedExtensionUI}
					showBodiedExtensionRendererView={showBodiedExtensionRendererView}
					setShowBodiedExtensionRendererView={setShowBodiedExtensionRendererView}
					pluginInjectionApi={pluginInjectionApi}
				/>
			)}
			<div
				data-testid="extension-container"
				ref={handleRef}
				data-layout={node.attrs.layout}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={classNames}
				css={[
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
					wrapperStyleInheritedCursor,
					showMacroInteractionDesignUpdates &&
						!isLivePageViewMode &&
						expValEquals('cc_editor_ttvc_release_bundle_one', 'extensionHoverRefactor', true) &&
						hoverStyles,
				]}
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={customContainerStyles}
				// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
				onMouseEnter={() => handleMouseEvent(true)}
				// eslint-disable-next-line @atlassian/a11y/mouse-events-have-key-events
				onMouseLeave={() => handleMouseEvent(false)}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-classname-prop, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766 */}
				<div
					data-testid="extension-overflow-wrapper"
					// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop
					className={overflowClassNames}
					css={[
						// eslint-disable-next-line @atlaskit/design-system/consistent-css-prop-usage, @atlaskit/ui-styling-standard/no-imported-style-values
						overflowWrapperStyles,
						fg('platform_fix_macro_renders_in_layouts') && containerStyle,
					]}
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
							{!shouldHideInLivePageViewMode && (
								<div
									data-testid="extension-content"
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/design-system/consistent-css-prop-usage -- Ignored via go/DSP-18766
									css={extensionContentStyles}
									// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
									className={contentClassNames}
								>
									{/* NOTE: this is a way around a bit strange issue where ref is always null on SSR
								    when `css` property is provided to the component. */}
									<div ref={handleContentDOMRef} />
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</Fragment>
	);
}

const Extension = (props: Props & OverflowShadowProps) => {
	const { pluginInjectionApi } = props;
	const { lineLength, width } = useSharedPluginStateWithSelector(
		pluginInjectionApi,
		['width'],
		(states) => ({
			width: states.widthState?.width ?? 0,
			lineLength: states.widthState?.lineLength,
		}),
	);

	// Ignored via go/ees005
	return (
		<ExtensionWithPluginState
			widthState={{
				width: width ?? 0,
				lineLength,
			}}
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...props}
		/>
	);
};

const _default_1: {
	new (props: Props & OverflowShadowProps): {
		calcOverflowDiff: () => number;
		calcScrollableWidth: () => number;
		componentDidCatch?: (error: Error, errorInfo: React.ErrorInfo) => void;
		componentDidMount?: () => void;
		componentDidUpdate: () => void;
		componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		componentWillUnmount: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		container?: HTMLElement;
		context: unknown;
		diff?: number;
		forceUpdate: (callback?: (() => void) | undefined) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getSnapshotBeforeUpdate?: (
			prevProps: Readonly<Props & OverflowShadowProps>,
			prevState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		) => any;
		handleContainer: (container: HTMLElement | null) => void;
		handleScroll: (event: Event) => void;
		initShadowObserver: () => void;
		overflowContainer?: HTMLElement | null;
		overflowContainerWidth: number;
		readonly props: Readonly<Props & OverflowShadowProps>;
		refs: {
			[key: string]: React.ReactInstance;
		};
		render: () => React.JSX.Element;
		scrollable?: NodeList;
		setState: <K extends keyof OverflowShadowState>(
			state:
				| OverflowShadowState
				| ((
						prevState: Readonly<OverflowShadowState>,
						props: Readonly<Props & OverflowShadowProps>,
				  ) => OverflowShadowState | Pick<OverflowShadowState, K> | null)
				| Pick<OverflowShadowState, K>
				| null,
			callback?: (() => void) | undefined,
		) => void;
		shadowObserver?: ShadowObserver;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		shouldComponentUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => boolean;
		showLeftShadow: (overflowContainer: HTMLElement | null | undefined) => boolean;
		state: {
			showLeftShadow: boolean;
			showRightShadow: boolean;
		};
		UNSAFE_componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		updateShadows: () => void;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (
		props: Props & OverflowShadowProps,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		context: any,
	): {
		calcOverflowDiff: () => number;
		calcScrollableWidth: () => number;
		componentDidCatch?: (error: Error, errorInfo: React.ErrorInfo) => void;
		componentDidMount?: () => void;
		componentDidUpdate: () => void;
		componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		componentWillUnmount: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		container?: HTMLElement;
		context: unknown;
		diff?: number;
		forceUpdate: (callback?: (() => void) | undefined) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		getSnapshotBeforeUpdate?: (
			prevProps: Readonly<Props & OverflowShadowProps>,
			prevState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
		) => any;
		handleContainer: (container: HTMLElement | null) => void;
		handleScroll: (event: Event) => void;
		initShadowObserver: () => void;
		overflowContainer?: HTMLElement | null;
		overflowContainerWidth: number;
		readonly props: Readonly<Props & OverflowShadowProps>;
		refs: {
			[key: string]: React.ReactInstance;
		};
		render: () => React.JSX.Element;
		scrollable?: NodeList;
		setState: <K extends keyof OverflowShadowState>(
			state:
				| OverflowShadowState
				| ((
						prevState: Readonly<OverflowShadowState>,
						props: Readonly<Props & OverflowShadowProps>,
				  ) => OverflowShadowState | Pick<OverflowShadowState, K> | null)
				| Pick<OverflowShadowState, K>
				| null,
			callback?: (() => void) | undefined,
		) => void;
		shadowObserver?: ShadowObserver;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		shouldComponentUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => boolean;
		showLeftShadow: (overflowContainer: HTMLElement | null | undefined) => boolean;
		state: {
			showLeftShadow: boolean;
			showRightShadow: boolean;
		};
		UNSAFE_componentWillMount?: () => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillReceiveProps?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		UNSAFE_componentWillUpdate?: (
			nextProps: Readonly<Props & OverflowShadowProps>,
			nextState: Readonly<OverflowShadowState>,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			nextContext: any,
		) => void;
		updateShadows: () => void;
	};
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	contextType?: React.Context<any> | undefined;
} = overflowShadow(Extension, {
	overflowSelector: '.extension-overflow-wrapper',
});
export default _default_1;
