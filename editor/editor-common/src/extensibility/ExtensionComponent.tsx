/* eslint-disable @repo/internal/react/no-class-components */
import React, { Component, useEffect, useLayoutEffect, useRef, useState } from 'react';

import memoizeOne from 'memoize-one';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { NodeSelection } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { fg } from '@atlaskit/platform-feature-flags';

import type { EventDispatcher } from '../event-dispatcher';
import { getExtensionModuleNodePrivateProps, getNodeRenderer } from '../extensions';
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
import { getExtensionRenderer } from '../utils';

import Extension from './Extension/Extension';
import InlineExtension from './Extension/InlineExtension';
import MultiBodiedExtension from './MultiBodiedExtension';
import type { ExtensionsPluginInjectionAPI, MacroInteractionDesignFeatureFlags } from './types';

export interface Props {
	editorView: EditorView;
	node: PMNode;
	getPos: ProsemirrorGetPosHandler;
	handleContentDOMRef: (node: HTMLElement | null) => void;
	extensionHandlers: ExtensionHandlers;
	extensionProvider?: Promise<ExtensionProvider>;
	references?: ReferenceEntity[];
	editorAppearance?: EditorAppearance;
	pluginInjectionApi: ExtensionsPluginInjectionAPI;
	eventDispatcher?: EventDispatcher;
	macroInteractionDesignFeatureFlags?: MacroInteractionDesignFeatureFlags;
}

export interface State {
	extensionProvider?: ExtensionProvider;
	extensionHandlersFromProvider?: ExtensionHandlers;
	_privateProps?: {
		__hideFrame?: boolean;
	};
	activeChildIndex?: number; // Holds the currently active Frame/Tab/Card
	isNodeHovered?: boolean;
}

/* temporary type until FG cleaned up */
export type PropsNew = Omit<Props, 'extensionProvider'> & {
	extensionProvider?: ExtensionProvider;
};

/* temporary type until FG cleaned up */
export type StateNew = Omit<State, 'extensionProvider'>;

export class ExtensionComponentOld extends Component<Props, State> {
	private privatePropsParsed = false;

	state: State = {};
	mounted = false;

	UNSAFE_componentWillMount() {
		this.mounted = true;
	}

	componentDidMount() {
		const { extensionProvider } = this.props;

		if (extensionProvider) {
			this.setStateFromPromise('extensionProvider', extensionProvider);
		}
	}

	componentDidUpdate() {
		this.parsePrivateNodePropsIfNeeded();
	}

	componentWillUnmount() {
		this.mounted = false;
	}

	UNSAFE_componentWillReceiveProps(nextProps: Props) {
		const { extensionProvider } = nextProps;
		if (extensionProvider && this.props.extensionProvider !== extensionProvider) {
			this.setStateFromPromise('extensionProvider', extensionProvider);
		}
	}

	// memoized to avoid rerender on extension state changes
	getNodeRenderer = memoizeOne(getNodeRenderer);
	getExtensionModuleNodePrivateProps = memoizeOne(getExtensionModuleNodePrivateProps);

	setIsNodeHovered = (isHovered: boolean) => {
		this.setState({
			isNodeHovered: isHovered,
		});
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
		} = this.props;

		const { selection } = editorView.state;
		const selectedNode = selection instanceof NodeSelection && (selection as NodeSelection).node;

		const position = typeof getPos === 'function' && getPos();

		const resolvedPosition = position && editorView.state.doc.resolve(position);

		const isNodeNested = !!(resolvedPosition && resolvedPosition.depth > 0);

		if (node.type.name === 'multiBodiedExtension') {
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
					isNodeNested={isNodeNested}
					isNodeHovered={this.state.isNodeHovered}
					setIsNodeHovered={this.setIsNodeHovered}
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
						extensionProvider={this.state.extensionProvider}
						handleContentDOMRef={handleContentDOMRef}
						view={editorView}
						editorAppearance={editorAppearance}
						hideFrame={this.state._privateProps?.__hideFrame}
						pluginInjectionApi={pluginInjectionApi}
						macroInteractionDesignFeatureFlags={macroInteractionDesignFeatureFlags}
						isNodeSelected={selectedNode === node}
						isNodeHovered={this.state.isNodeHovered}
						isNodeNested={isNodeNested}
						setIsNodeHovered={this.setIsNodeHovered}
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
						isNodeHovered={this.state.isNodeHovered}
						setIsNodeHovered={this.setIsNodeHovered}
					>
						{extensionHandlerResult}
					</InlineExtension>
				);
			default:
				return null;
		}
	}

	private setStateFromPromise = (stateKey: keyof State, promise?: Promise<any>) => {
		promise &&
			promise.then((p) => {
				if (!this.mounted) {
					return;
				}

				this.setState({
					[stateKey]: p,
				});
			});
	};

	/**
	 * Parses any private nodes once an extension provider is available.
	 *
	 * We do this separately from resolving a node renderer component since the
	 * private props come from extension provider, rather than an extension
	 * handler which only handles `render`/component concerns.
	 */
	private parsePrivateNodePropsIfNeeded = async () => {
		if (this.privatePropsParsed || !this.state.extensionProvider) {
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
				this.state.extensionProvider,
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
		const { extensionHandlers, editorView } = this.props;
		const { extensionType, extensionKey, parameters, text } = pmNode.attrs;
		const isBodiedExtension = pmNode.type.name === 'bodiedExtension';

		if (isBodiedExtension) {
			return;
		}

		const fragmentLocalId = pmNode?.marks?.find((m) => m.type.name === 'fragment')?.attrs?.localId;

		const node: ExtensionParams<Parameters> = {
			type: pmNode.type.name as
				| 'extension'
				| 'inlineExtension'
				| 'bodiedExtension'
				| 'multiBodiedExtension',
			extensionType,
			extensionKey,
			parameters,
			content: text,
			localId: pmNode.attrs.localId,
			fragmentLocalId,
		};

		let result;

		if (extensionHandlers && extensionHandlers[extensionType]) {
			const render = getExtensionRenderer(extensionHandlers[extensionType]);
			result = render(node, editorView.state.doc, actions);
		}

		if (!result) {
			const extensionHandlerFromProvider =
				this.state.extensionProvider &&
				this.getNodeRenderer(this.state.extensionProvider, extensionType, extensionKey);

			if (extensionHandlerFromProvider) {
				const NodeRenderer = extensionHandlerFromProvider;
				if (node.type === 'multiBodiedExtension') {
					return <NodeRenderer node={node} references={this.props.references} actions={actions} />;
				} else {
					return <NodeRenderer node={node} references={this.props.references} />;
				}
			}
		}

		return result;
	};
}

export const ExtensionComponentNew = (props: Props) => {
	const { extensionProvider: extensionProviderResolver, ...restProps } = props;
	const [extensionProvider, setExtensionProvider] = useState<ExtensionProvider | undefined>(
		undefined,
	);
	const mountedRef = useRef(true);

	useLayoutEffect(() => {
		mountedRef.current = true;
		return () => {
			mountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		extensionProviderResolver?.then((provider) => {
			if (mountedRef.current) {
				setExtensionProvider(provider);
			}
		});
	}, [extensionProviderResolver]);

	return <ExtensionComponentInner {...restProps} extensionProvider={extensionProvider} />;
};

class ExtensionComponentInner extends Component<PropsNew, StateNew> {
	private privatePropsParsed = false;

	state: StateNew = {};

	componentDidUpdate() {
		this.parsePrivateNodePropsIfNeeded();
	}

	// memoized to avoid rerender on extension state changes
	getNodeRenderer = memoizeOne(getNodeRenderer);
	getExtensionModuleNodePrivateProps = memoizeOne(getExtensionModuleNodePrivateProps);

	setIsNodeHovered = (isHovered: boolean) => {
		this.setState({
			isNodeHovered: isHovered,
		});
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
		} = this.props;

		const { selection } = editorView.state;
		const selectedNode = selection instanceof NodeSelection && (selection as NodeSelection).node;

		const position = typeof getPos === 'function' && getPos();

		const resolvedPosition = position && editorView.state.doc.resolve(position);

		const isNodeNested = !!(resolvedPosition && resolvedPosition.depth > 0);

		if (node.type.name === 'multiBodiedExtension') {
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
					isNodeNested={isNodeNested}
					isNodeHovered={this.state.isNodeHovered}
					setIsNodeHovered={this.setIsNodeHovered}
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
						hideFrame={this.state._privateProps?.__hideFrame}
						pluginInjectionApi={pluginInjectionApi}
						macroInteractionDesignFeatureFlags={macroInteractionDesignFeatureFlags}
						isNodeSelected={selectedNode === node}
						isNodeHovered={this.state.isNodeHovered}
						isNodeNested={isNodeNested}
						setIsNodeHovered={this.setIsNodeHovered}
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
						isNodeHovered={this.state.isNodeHovered}
						setIsNodeHovered={this.setIsNodeHovered}
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
		const { extensionHandlers, editorView } = this.props;
		const { extensionType, extensionKey, parameters, text } = pmNode.attrs;
		const isBodiedExtension = pmNode.type.name === 'bodiedExtension';

		if (isBodiedExtension) {
			return;
		}

		const fragmentLocalId = pmNode?.marks?.find((m) => m.type.name === 'fragment')?.attrs?.localId;

		const node: ExtensionParams<Parameters> = {
			type: pmNode.type.name as
				| 'extension'
				| 'inlineExtension'
				| 'bodiedExtension'
				| 'multiBodiedExtension',
			extensionType,
			extensionKey,
			parameters,
			content: text,
			localId: pmNode.attrs.localId,
			fragmentLocalId,
		};

		let result;

		if (extensionHandlers && extensionHandlers[extensionType]) {
			const render = getExtensionRenderer(extensionHandlers[extensionType]);
			result = render(node, editorView.state.doc, actions);
		}

		if (!result) {
			const extensionHandlerFromProvider =
				this.props.extensionProvider &&
				this.getNodeRenderer(this.props.extensionProvider, extensionType, extensionKey);

			if (extensionHandlerFromProvider) {
				const NodeRenderer = extensionHandlerFromProvider;
				if (node.type === 'multiBodiedExtension') {
					return <NodeRenderer node={node} references={this.props.references} actions={actions} />;
				} else {
					return <NodeRenderer node={node} references={this.props.references} />;
				}
			}
		}

		return result;
	};
}

export const ExtensionComponent = (props: Props) => {
	if (fg('platform_editor_react18_extension_component')) {
		return <ExtensionComponentNew {...props} />;
	}
	return <ExtensionComponentOld {...props} />;
};
