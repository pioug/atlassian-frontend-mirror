/* eslint-disable @repo/internal/react/no-class-components */

import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';

import memoizeOne from 'memoize-one';

import type { ADFEntity } from '@atlaskit/adf-utils/types';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { EventDispatcher } from '../event-dispatcher';
import {
	getExtensionModuleNode,
	getExtensionModuleNodePrivateProps,
	getNodeRenderer,
} from '../extensions';
import type {
	ExtensionHandlers,
	ExtensionParams,
	ExtensionProvider,
	MultiBodiedExtensionActions,
	Parameters,
	ReferenceEntity,
} from '../extensions';
import type { ProsemirrorGetPosHandler } from '../react-node-view';
import type { EditorAppearance } from '../types';
import { getExtensionRenderer, nodeToJSON, toJSON } from '../utils';
import Extension from './Extension/Extension';
import { isEmptyBodiedMacro } from './Extension/Extension/extension-utils';
import InlineExtension from './Extension/InlineExtension';
import MultiBodiedExtension from './MultiBodiedExtension';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from './types';

export interface Props {
	editorAppearance?: EditorAppearance;
	editorView: EditorView;
	eventDispatcher?: EventDispatcher;
	extensionHandlers: ExtensionHandlers;
	extensionLoadingHandlers?: ExtensionHandlers;
	extensionProvider?: Promise<ExtensionProvider>;
	getPos: ProsemirrorGetPosHandler;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	isLivePageViewMode?: boolean;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	node: PMNode;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	references?: ReferenceEntity[];
	rendererExtensionHandlers?: ExtensionHandlers;
	setShowBodiedExtensionRendererView?: (showBodiedExtensionRendererView: boolean) => void;
	showBodiedExtensionRendererView?: boolean;
	showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
}

type ProviderNodeRendererProps = {
	actions?: MultiBodiedExtensionActions;
	isSelected?: boolean;
	loadingFallback?: React.ReactNode;
	node: ExtensionParams<Parameters>;
	references?: ReferenceEntity[];
	showUnknownMacroPlaceholder?: boolean;
};

interface PropsInner {
	editorAppearance?: EditorAppearance;
	editorView: EditorView;
	eventDispatcher?: EventDispatcher;
	extensionHandlers: ExtensionHandlers;
	extensionLoadingHandlers?: ExtensionHandlers;
	extensionProvider?: ExtensionProvider;
	getPos: ProsemirrorGetPosHandler;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	isLivePageViewMode?: boolean;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
	node: PMNode;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	references?: ReferenceEntity[];
	rendererExtensionHandlers?: ExtensionHandlers;
	setShowBodiedExtensionRendererView?: (showBodiedExtensionRendererView: boolean) => void;
	showBodiedExtensionRendererView?: boolean;
	showLivePagesBodiedMacrosRendererView?: (node: ADFEntity) => boolean;
	showUpdatedLivePages1PBodiedExtensionUI?: (node: ADFEntity) => boolean;
}

export interface State {
	_privateProps?: {
		__allowBodiedOverride?: boolean; // Allows MBE macro to override the default body; see RFC: https://hello.atlassian.net/wiki/spaces/EDITOR/pages/4843571091/Editor+RFC+064+MultiBodiedExtension+Extensibility
		__hideFrame?: boolean;
	};
	activeChildIndex?: number; // Holds the currently active Frame/Tab/Card
	extensionHandlersFromProvider?: ExtensionHandlers;
	extensionProvider?: ExtensionProvider;
	// True once we know this node exposes no way to configure it, so the "Configure {name}"
	// lozenge label should be hidden. See resolveConfigureAffordanceIfNeeded.
	hideConfigureLabel?: boolean;
	isNodeHovered?: boolean;
	showBodiedExtensionRendererView?: boolean; // Main state which will keep track to show the renderer or editor view of bodied macros in live pages. Controlled via the EditToggle
}

const getBodiedExtensionContent = (node: PMNode): ADFEntity[] | string | undefined => {
	const bodiedExtensionContent: ADFEntity[] = [];
	node.content.forEach((childNode: PMNode) => {
		bodiedExtensionContent.push(nodeToJSON(childNode));
	});

	return !!bodiedExtensionContent.length ? bodiedExtensionContent : node.attrs.text;
};

export const ExtensionComponent = (props: Props): React.JSX.Element => {
	const {
		extensionProvider: extensionProviderResolver,
		showLivePagesBodiedMacrosRendererView,
		node,
		...restProps
	} = props;
	const [extensionProvider, setExtensionProvider] = useState<ExtensionProvider | undefined>(
		undefined,
	);

	const [showBodiedExtensionRendererView, setShowBodiedExtensionRendererView] = useState<boolean>(
		!!showLivePagesBodiedMacrosRendererView?.(nodeToJSON(node)) && !isEmptyBodiedMacro(node),
	);
	const mountedRef = useRef(true);

	useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		extensionProviderResolver?.then((provider: ExtensionProvider) => {
			if (mountedRef.current) {
				setExtensionProvider(provider);
			}
		});
	}, [extensionProviderResolver]);

	return (
		<ExtensionComponentInner
			// Ignored via go/ees005
			// eslint-disable-next-line react/jsx-props-no-spreading
			{...restProps}
			extensionProvider={extensionProvider}
			node={node}
			showLivePagesBodiedMacrosRendererView={showLivePagesBodiedMacrosRendererView}
			showBodiedExtensionRendererView={showBodiedExtensionRendererView}
			setShowBodiedExtensionRendererView={setShowBodiedExtensionRendererView}
		/>
	);
};

class ExtensionComponentInner extends Component<PropsInner, State> {
	private privatePropsParsed = false;
	private configureAffordanceResolved = false;
	private isUnmounted = false;

	state: State = {};

	componentDidMount() {
		this.resolveConfigureAffordanceIfNeeded();
	}

	componentDidUpdate() {
		this.parsePrivateNodePropsIfNeeded();
		this.resolveConfigureAffordanceIfNeeded();
	}

	componentWillUnmount() {
		this.isUnmounted = true;
	}

	// memoized to avoid rerender on extension state changes
	getNodeRenderer = memoizeOne(getNodeRenderer);
	getExtensionModuleNodePrivateProps = memoizeOne(getExtensionModuleNodePrivateProps);

	setIsNodeHovered = (isHovered: boolean) => {
		// Don't want to show hover interactions for live page view mode
		if (!this.props.isLivePageViewMode) {
			this.setState({
				isNodeHovered: isHovered,
			});
		}
	};

	render() {
		const {
			node,
			handleContentDOMRef,
			editorView,
			references,
			editorAppearance,
			pluginInjectionApi,
			getPos,
			eventDispatcher,
			macroInteractionDesignFeatureFlags,
			extensionProvider,
			showLivePagesBodiedMacrosRendererView,
			showUpdatedLivePages1PBodiedExtensionUI,
			showBodiedExtensionRendererView,
			setShowBodiedExtensionRendererView,
			isLivePageViewMode,
		} = this.props;

		const { selection } = editorView.state;
		const selectedNode = selection instanceof NodeSelection && (selection as NodeSelection).node;

		const position = typeof getPos === 'function' && getPos();

		const resolvedPosition = position && editorView.state.doc.resolve(position);

		const isNodeNested = !!(resolvedPosition && resolvedPosition.depth > 0);

		if (node.type.name === 'multiBodiedExtension') {
			const allowBodiedOverride = this.state._privateProps?.__allowBodiedOverride;

			return (
				<MultiBodiedExtension
					node={node}
					editorView={editorView}
					getPos={getPos}
					handleContentDOMRef={handleContentDOMRef}
					tryExtensionHandler={this.tryExtensionHandler.bind(this)}
					eventDispatcher={eventDispatcher}
					pluginInjectionApi={pluginInjectionApi}
					editorAppearance={editorAppearance}
					macroInteractionDesignFeatureFlags={macroInteractionDesignFeatureFlags}
					isNodeSelected={selectedNode === node}
					isNodeHovered={this.state.isNodeHovered}
					isNodeNested={isNodeNested}
					setIsNodeHovered={this.setIsNodeHovered}
					isLivePageViewMode={isLivePageViewMode}
					allowBodiedOverride={allowBodiedOverride}
					hideConfigureLabel={this.state.hideConfigureLabel}
				/>
			);
		}

		const extensionHandlerResult = this.tryExtensionHandler(undefined);
		switch (node.type.name) {
			case 'extension':
			case 'bodiedExtension':
				return (
					<Extension
						node={node}
						getPos={this.props.getPos}
						references={references}
						extensionProvider={extensionProvider}
						handleContentDOMRef={handleContentDOMRef}
						view={editorView}
						editorAppearance={editorAppearance}
						hideConfigureLabel={this.state.hideConfigureLabel}
						hideFrame={this.state._privateProps?.__hideFrame}
						pluginInjectionApi={pluginInjectionApi}
						macroInteractionDesignFeatureFlags={macroInteractionDesignFeatureFlags}
						isNodeSelected={selectedNode === node}
						isNodeNested={isNodeNested}
						showLivePagesBodiedMacrosRendererView={
							!!showLivePagesBodiedMacrosRendererView?.(nodeToJSON(node))
						}
						showUpdatedLivePages1PBodiedExtensionUI={
							!!showUpdatedLivePages1PBodiedExtensionUI?.(nodeToJSON(node))
						}
						showBodiedExtensionRendererView={showBodiedExtensionRendererView}
						setShowBodiedExtensionRendererView={setShowBodiedExtensionRendererView}
						isLivePageViewMode={isLivePageViewMode}
					>
						{extensionHandlerResult}
					</Extension>
				);
			case 'inlineExtension':
				return (
					<InlineExtension
						node={node}
						macroInteractionDesignFeatureFlags={macroInteractionDesignFeatureFlags}
						isNodeSelected={selectedNode === node}
						pluginInjectionApi={pluginInjectionApi}
						isLivePageViewMode={isLivePageViewMode}
						hideConfigureLabel={this.state.hideConfigureLabel}
					>
						{extensionHandlerResult}
					</InlineExtension>
				);
			default:
				return null;
		}
	}

	/**
	 * Parses any private nodes once an extension provider is available.
	 *
	 * We do this separately from resolving a node renderer component since the
	 * private props come from extension provider, rather than an extension
	 * handler which only handles `render`/component concerns.
	 */
	private parsePrivateNodePropsIfNeeded = async () => {
		if (this.privatePropsParsed || !this.props.extensionProvider) {
			return;
		}
		this.privatePropsParsed = true;

		const { extensionType, extensionKey } = this.props.node.attrs;

		/**
		 * getExtensionModuleNodePrivateProps can throw if there are issues in the
		 * manifest
		 */
		try {
			const privateProps = await this.getExtensionModuleNodePrivateProps(
				this.props.extensionProvider,
				extensionType,
				extensionKey,
			);

			this.setState({
				_privateProps: privateProps,
			});
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Provided extension handler has thrown an error\n', e);
			/** We don't want this error to block renderer */
			/** We keep rendering the default content */
		}
	};

	/**
	 * Decides whether the "Configure {name}" lozenge label should be hidden for this node.
	 *
	 * Mirrors how the floating toolbar decides to show its edit button (see
	 * `shouldShowEditButton` and `updateEditButton` in `editor-plugin-extension`):
	 * - a legacy function handler is configurable via the macro browser;
	 * - an object handler is configurable only if it defines `update`;
	 * - otherwise the node module from the extension provider decides via its optional `update`.
	 * Nodes with no way to be configured get no Configure affordance. Anything we cannot
	 * resolve keeps the label, which is the pre-existing behaviour.
	 *
	 * The result is resolved once per node and held in state rather than derived on each render
	 * because the provider path is asynchronous: `getExtensionModuleNode` goes through
	 * `extensionProvider.getExtension`, which returns a Promise. Deriving the synchronous handler
	 * branches in render while the provider branch stays async would let the same node flip
	 * between answers, and would re-run the manifest lookup on every hover re-render. One
	 * resolution keeps the label stable and cheap.
	 */
	private resolveConfigureAffordanceIfNeeded = async () => {
		if (
			this.configureAffordanceResolved ||
			!fg('platform_editor_hide_configure_lozenge_non_configurable')
		) {
			return;
		}

		const { extensionHandlers, extensionProvider, node } = this.props;
		const { extensionType, extensionKey } = node.attrs;
		const extensionHandler = extensionHandlers?.[extensionType];

		if (typeof extensionHandler === 'function') {
			// Legacy macro browser: configurable, keep the label.
			this.configureAffordanceResolved = true;
			return;
		}

		if (extensionHandler && typeof extensionHandler === 'object') {
			this.configureAffordanceResolved = true;
			if (typeof extensionHandler.update !== 'function') {
				this.setState({ hideConfigureLabel: true });
			}
			return;
		}

		if (!extensionProvider) {
			// No handler and no provider yet. The provider usually arrives asynchronously, so try
			// again from componentDidUpdate. If none ever arrives this is the legacy macro browser
			// path, which is configurable, so leaving the label is correct.
			return;
		}

		this.configureAffordanceResolved = true;

		try {
			const extensionModuleNode = await getExtensionModuleNode(
				extensionProvider,
				extensionType,
				extensionKey,
			);

			if (this.isUnmounted) {
				return;
			}

			if (typeof extensionModuleNode?.update !== 'function') {
				this.setState({ hideConfigureLabel: true });
			}
		} catch (e) {
			// Manifest lookups can throw (unknown extension, malformed manifest). Keep the label,
			// which matches the toolbar failing silently and keeping its default. Not logged here on
			// purpose: parsePrivateNodePropsIfNeeded runs the same lookup for the same node and already
			// console.errors the failure, so a second log would double up per unknown extension.
		}
	};

	private tryExtensionHandler(actions: MultiBodiedExtensionActions | undefined) {
		const { node } = this.props;
		try {
			const extensionContent = this.handleExtension(node, actions);
			if (extensionContent && React.isValidElement(extensionContent)) {
				return extensionContent;
			}
		} catch (e) {
			// eslint-disable-next-line no-console
			console.error('Provided extension handler has thrown an error\n', e);
			/** We don't want this error to block renderer */
			/** We keep rendering the default content */
		}
		return null;
	}

	private handleExtension = (pmNode: PMNode, actions: MultiBodiedExtensionActions | undefined) => {
		const {
			extensionHandlers,
			extensionLoadingHandlers,
			editorView,
			showBodiedExtensionRendererView,
			rendererExtensionHandlers,
		} = this.props;
		const { extensionType, extensionKey, parameters, text } = pmNode.attrs;
		const isBodiedExtension = pmNode.type.name === 'bodiedExtension';
		const { selection } = editorView.state;
		const isSelected = selection instanceof NodeSelection && selection.node === pmNode;

		if (isBodiedExtension && !showBodiedExtensionRendererView) {
			return;
		}

		const fragmentLocalId = pmNode?.marks?.find((m) => m.type.name === 'fragment')?.attrs?.localId;
		const content = isBodiedExtension ? getBodiedExtensionContent(pmNode) : text;

		const node: ExtensionParams<Parameters> = {
			type: pmNode.type.name as
				| 'extension'
				| 'inlineExtension'
				| 'bodiedExtension'
				| 'multiBodiedExtension',
			extensionType,
			extensionKey,
			parameters,
			content,
			localId: pmNode.attrs.localId,
			fragmentLocalId,
		};

		if (isBodiedExtension) {
			const rendererExtensionHandler = rendererExtensionHandlers?.[extensionType];
			// Forge bodied extensions don't get rendererExtensionHandlers passed in and use extensionHandlerFromProvider from the below logic instead
			if (rendererExtensionHandler) {
				return getExtensionRenderer(rendererExtensionHandler)(node, toJSON(editorView.state.doc));
			}
		}

		let result;

		const loadingFallback = extensionLoadingHandlers?.[extensionType]
			? getExtensionRenderer(extensionLoadingHandlers[extensionType])(
					node,
					editorView.state.doc,
					actions,
				)
			: undefined;

		if (extensionHandlers && extensionHandlers[extensionType]) {
			const render = getExtensionRenderer(extensionHandlers[extensionType]);
			result = render(node, editorView.state.doc, actions);
		}

		if (!result) {
			const extensionHandlerFromProvider =
				this.props.extensionProvider &&
				this.getNodeRenderer(this.props.extensionProvider, extensionType, extensionKey);

			if (extensionHandlerFromProvider) {
				const NodeRenderer =
					extensionHandlerFromProvider as unknown as React.ComponentType<ProviderNodeRendererProps>;
				if (node.type === 'multiBodiedExtension') {
					return (
						<NodeRenderer
							node={node}
							references={this.props.references}
							actions={actions}
							loadingFallback={loadingFallback}
						/>
					);
				}
				return (
					<NodeRenderer
						node={node}
						references={this.props.references}
						isSelected={isSelected}
						loadingFallback={loadingFallback}
						showUnknownMacroPlaceholder
					/>
				);
			}
		}

		return result ?? loadingFallback;
	};
}
