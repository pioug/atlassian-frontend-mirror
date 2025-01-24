import React from 'react';

import type { WrappedComponentProps } from 'react-intl-next';
import { injectIntl } from 'react-intl-next';

import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import { nodeViewsMessages as messages } from '@atlaskit/editor-common/media';
import { type PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { WithProviders } from '@atlaskit/editor-common/provider-factory';
import type {
	ContextIdentifierProvider,
	MediaProvider,
	ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import ReactNodeView from '@atlaskit/editor-common/react-node-view';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import {
	isNodeSelectedOrInRange,
	SelectedState,
	setNodeSelection,
} from '@atlaskit/editor-common/utils';
import type { EditorDisabledPluginState } from '@atlaskit/editor-plugin-editor-disabled';
import type { EditorViewModePluginState } from '@atlaskit/editor-plugin-editor-viewmode';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorView, NodeView } from '@atlaskit/editor-prosemirror/view';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import type { Identifier } from '@atlaskit/media-client';
import { getMediaFeatureFlag } from '@atlaskit/media-common';
import type { MediaClientConfig } from '@atlaskit/media-core';
import type { FilmstripItem } from '@atlaskit/media-filmstrip';
import { Filmstrip } from '@atlaskit/media-filmstrip';
import { fg } from '@atlaskit/platform-feature-flags';

import type { MediaNextEditorPluginType } from '../mediaPluginType';
import { stateKey as mediaStateKey } from '../pm-plugins/plugin-key';
import type { MediaPluginState } from '../pm-plugins/types';
import type {
	ForwardRef,
	getPosHandler,
	getPosHandlerNode,
	MediaOptions,
	getPosHandler as ProsemirrorGetPosHandler,
} from '../types';
import { useMediaProvider } from '../ui/hooks/useMediaProvider';

import { MediaGroupNext } from './mediaGroupNext';
import { MediaNodeUpdater } from './mediaNodeUpdater';

type MediaGroupProps = {
	forwardRef?: (ref: HTMLElement) => void;
	node: PMNode;
	view: EditorView;
	getPos: () => number | undefined;
	disabled?: boolean;
	editorViewMode?: boolean;
	allowLazyLoading?: boolean;
	mediaProvider: Promise<MediaProvider>;
	contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
	isCopyPasteEnabled?: boolean;
	// These two numbers have to be passed separately. They can technically be derived from the view, but
	// because the view is *reference* then `shouldComponentUpdate` can't identify changes from incoming props
	anchorPos: number; // This value is required so that shouldComponentUpdate can calculate correctly
	headPos: number; // This value is required so that shouldComponentUpdate can calculate correctly
	mediaOptions: MediaOptions;
} & WrappedComponentProps;

interface MediaGroupState {
	viewMediaClientConfig?: MediaClientConfig;
}

const isMediaGroupSelectedFromProps = (props: MediaGroupProps) => {
	/**
	 *  ED-19831
	 *  There is a getPos issue coming from this code. We need to apply this workaround for now and apply a patch
	 *  directly to confluence since this bug is now in production.
	 */
	let pos: number | undefined;
	try {
		pos = props.getPos ? props.getPos() : undefined;
	} catch (e) {
		pos = undefined;
	}

	if (typeof pos !== 'number') {
		return false;
	}

	return isNodeSelectedOrInRange(props.anchorPos, props.headPos, pos, props.node.nodeSize);
};

const hasSelectionChanged = (oldProps: MediaGroupProps, newProps: MediaGroupProps): boolean => {
	if (isMediaGroupSelectedFromProps(oldProps) !== isMediaGroupSelectedFromProps(newProps)) {
		return true;
	}
	if (isMediaGroupSelectedFromProps(newProps) === SelectedState.selectedInside) {
		return oldProps.anchorPos !== newProps.anchorPos;
	}
	return false;
};

// eslint-disable-next-line @repo/internal/react/no-class-components
class MediaGroup extends React.Component<MediaGroupProps, MediaGroupState> {
	static displayName = 'MediaGroup';

	private mediaPluginState: MediaPluginState | undefined;
	private mediaNodes: PMNode[];

	state: MediaGroupState = {
		viewMediaClientConfig: undefined,
	};

	constructor(props: MediaGroupProps) {
		super(props);
		this.mediaNodes = [];
		this.mediaPluginState = mediaStateKey.getState(props.view.state);

		this.setMediaItems(props);
		this.state = {
			viewMediaClientConfig: undefined,
		};
	}

	componentDidMount() {
		this.updateMediaClientConfig();

		this.mediaNodes.forEach(async (node: PMNode) => {
			if (node.attrs.type === 'external') {
				return;
			}

			const { view, mediaProvider, contextIdentifierProvider } = this.props;
			const mediaNodeUpdater = new MediaNodeUpdater({
				view,
				mediaProvider,
				contextIdentifierProvider,
				node,
				isMediaSingle: false,
			});

			const getPos = () => {
				const pos = this.props.getPos();

				if (typeof pos !== 'number') {
					// That may seems weird, but the previous type wasn't match with the real ProseMirror code. And a lot of Media API was built expecting a number
					// Because the original code would return NaN on runtime
					// We are just make it explict now.
					// We may run a deep investagation on Media code to figure out a better fix. But, for now, we want to keep the current behavior.
					// TODO: ED-13910 prosemirror-bump leftovers
					return NaN;
				}

				return pos + 1;
			};

			const contextId = mediaNodeUpdater.getNodeContextId();
			if (!contextId) {
				await mediaNodeUpdater.updateNodeContextId(getPos);
			}

			const shouldNodeBeDeepCopied = await mediaNodeUpdater.shouldNodeBeDeepCopied();

			if (shouldNodeBeDeepCopied) {
				await mediaNodeUpdater.copyNodeFromPos(getPos, {
					traceId: node.attrs.__mediaTraceId,
				});
			}
		});
	}

	private updateNodeAttrs = (
		props: MediaGroupProps,
		node: PMNode,
		getPos: ProsemirrorGetPosHandler,
	) => {
		const { view, mediaProvider, contextIdentifierProvider } = props;
		const mediaNodeUpdater = new MediaNodeUpdater({
			view,
			mediaProvider,
			contextIdentifierProvider,
			node,
			isMediaSingle: false,
		});

		mediaNodeUpdater.updateNodeAttrs(getPos);
	};

	componentWillUnmount() {
		this.mediaPluginState?.handleMediaGroupUpdate(this.mediaNodes, []);
	}

	// Ignored via go/ees005
	// eslint-disable-next-line react/no-unsafe
	UNSAFE_componentWillReceiveProps(props: MediaGroupProps) {
		this.updateMediaClientConfig();
		this.setMediaItems(props, props.isCopyPasteEnabled || props.isCopyPasteEnabled === undefined);
	}

	shouldComponentUpdate(nextProps: MediaGroupProps) {
		if (
			hasSelectionChanged(this.props, nextProps) ||
			this.props.node !== nextProps.node ||
			this.state.viewMediaClientConfig !== this.mediaPluginState?.mediaClientConfig
		) {
			return true;
		}

		return false;
	}

	updateMediaClientConfig() {
		const { viewMediaClientConfig } = this.state;
		const { mediaClientConfig } = this.mediaPluginState || {};
		if (!viewMediaClientConfig && mediaClientConfig) {
			this.setState({
				viewMediaClientConfig: mediaClientConfig,
			});
		}
	}

	setMediaItems = (props: MediaGroupProps, updatedAttrs = false) => {
		const { node } = props;
		const oldMediaNodes = this.mediaNodes;
		this.mediaNodes = [] as Array<PMNode>;
		node.forEach((item, childOffset) => {
			const getPos = () => {
				const pos = props.getPos();

				if (typeof pos !== 'number') {
					// That may seems weird, but the previous type wasn't match with the real ProseMirror code. And a lot of Media API was built expecting a number
					// Because the original code would return NaN on runtime
					// We are just make it explict now.
					// We may run a deep investagation on Media code to figure out a better fix. But, for now, we want to keep the current behavior.
					// TODO: ED-13910 prosemirror-bump leftovers
					return NaN;
				}

				return pos + childOffset + 1;
			};
			this.mediaNodes.push(item);
			if (updatedAttrs) {
				this.updateNodeAttrs(props, item, getPos);
			}
		});

		this.mediaPluginState?.handleMediaGroupUpdate(oldMediaNodes, this.mediaNodes);
	};

	getIdentifier = (item: PMNode): Identifier => {
		if (item.attrs.type === 'external') {
			return {
				mediaItemType: 'external-image',
				dataURI: item.attrs.url,
			};
		}
		return {
			id: item.attrs.id,
			mediaItemType: 'file',
			collectionName: item.attrs.collection,
		};
	};

	isNodeSelected = (nodePos: number): boolean => {
		const selected = isMediaGroupSelectedFromProps(this.props);
		if (selected === SelectedState.selectedInRange) {
			return true;
		}
		if (selected === SelectedState.selectedInside && this.props.anchorPos === nodePos) {
			return true;
		}
		return false;
	};

	renderChildNodes = () => {
		const { viewMediaClientConfig } = this.state;
		const { getPos, allowLazyLoading, disabled, mediaOptions, editorViewMode } = this.props;
		const items: FilmstripItem[] = this.mediaNodes.map((item, idx) => {
			// We declared this to get a fresh position every time
			const getNodePos = () => {
				const pos = getPos();

				if (typeof pos !== 'number') {
					// That may seems weird, but the previous type wasn't match with the real ProseMirror code. And a lot of Media API was built expecting a number
					// Because the original code would return NaN on runtime
					// We are just make it explict now.
					// We may run a deep investagation on Media code to figure out a better fix. But, for now, we want to keep the current behavior.
					// TODO: ED-13910 prosemirror-bump leftovers
					return NaN;
				}

				return pos + idx + 1;
			};

			// Media Inline creates a floating toolbar with the same options, excludes these options if enabled
			const mediaInlineOptions = (allowMediaInline: boolean = false) => {
				if (!allowMediaInline) {
					return {
						shouldEnableDownloadButton: mediaOptions.enableDownloadButton,
						actions: [
							{
								handler:
									disabled || !this.mediaPluginState
										? () => {}
										: this.mediaPluginState.handleMediaNodeRemoval.bind(
												null,
												undefined,
												getNodePos,
											),
								icon: (
									<EditorCloseIcon
										label={this.props.intl.formatMessage(messages.mediaGroupDeleteLabel)}
									/>
								),
							},
						],
					};
				}
			};

			return {
				identifier: this.getIdentifier(item),
				isLazy: allowLazyLoading,
				selected: this.isNodeSelected(getNodePos()),
				onClick: () => {
					setNodeSelection(this.props.view, getNodePos());
				},
				...mediaInlineOptions(getMediaFeatureFlag('mediaInline', mediaOptions.featureFlags)),
			};
		});

		return (
			<Filmstrip
				items={items}
				mediaClientConfig={viewMediaClientConfig}
				featureFlags={mediaOptions.featureFlags}
				shouldOpenMediaViewer={editorViewMode}
			/>
		);
	};

	render() {
		return this.renderChildNodes();
	}
}

const IntlMediaGroup = injectIntl(MediaGroup);
export default IntlMediaGroup;

interface MediaGroupNodeViewProps {
	allowLazyLoading?: boolean;
	isCopyPasteEnabled?: boolean;
	providerFactory: ProviderFactory;
	mediaOptions: MediaOptions;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}

interface RenderFn {
	editorDisabledPlugin?: EditorDisabledPluginState;
	editorViewModePlugin?: EditorViewModePluginState | null;
	mediaProvider?: MediaProvider | null;
}

interface MediaGroupNodeViewInternalProps {
	renderFn: (props: RenderFn) => JSX.Element | null;
	pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined;
}

function MediaGroupNodeViewInternal({
	renderFn,
	pluginInjectionApi,
}: MediaGroupNodeViewInternalProps) {
	const { editorDisabledState: editorDisabledPlugin, editorViewModeState: editorViewModePlugin } =
		useSharedPluginState(pluginInjectionApi, ['editorDisabled', 'editorViewMode']);
	const mediaProvider = useMediaProvider(pluginInjectionApi);
	return renderFn({
		editorDisabledPlugin,
		editorViewModePlugin,
		mediaProvider,
	});
}

class MediaGroupNodeView extends ReactNodeView<MediaGroupNodeViewProps> {
	render(props: MediaGroupNodeViewProps, forwardRef: ForwardRef) {
		const { providerFactory, mediaOptions, pluginInjectionApi } = props;
		const getPos = this.getPos as getPosHandlerNode;

		return (
			<WithProviders
				providers={['contextIdentifierProvider']}
				providerFactory={providerFactory}
				renderNode={({ contextIdentifierProvider }) => {
					const renderFn = ({
						editorDisabledPlugin,
						editorViewModePlugin,
						mediaProvider: mediaProviderFromState,
					}: RenderFn) => {
						const mediaProvider = mediaProviderFromState
							? Promise.resolve(mediaProviderFromState)
							: undefined;

						if (!mediaProvider) {
							return null;
						}

						if (fg('platform_editor_react18_phase2__media_single')) {
							return (
								<MediaGroupNext
									node={this.node}
									getPos={getPos}
									view={this.view}
									forwardRef={forwardRef}
									disabled={(editorDisabledPlugin || {}).editorDisabled}
									allowLazyLoading={mediaOptions.allowLazyLoading}
									mediaProvider={mediaProvider}
									contextIdentifierProvider={contextIdentifierProvider}
									isCopyPasteEnabled={mediaOptions.isCopyPasteEnabled}
									anchorPos={this.view.state.selection.$anchor.pos}
									headPos={this.view.state.selection.$head.pos}
									mediaOptions={mediaOptions}
									editorViewMode={editorViewModePlugin?.mode === 'view'}
								/>
							);
						}

						return (
							<IntlMediaGroup
								node={this.node}
								getPos={getPos}
								view={this.view}
								forwardRef={forwardRef}
								disabled={(editorDisabledPlugin || {}).editorDisabled}
								allowLazyLoading={mediaOptions.allowLazyLoading}
								mediaProvider={mediaProvider}
								contextIdentifierProvider={contextIdentifierProvider}
								isCopyPasteEnabled={mediaOptions.isCopyPasteEnabled}
								anchorPos={this.view.state.selection.$anchor.pos}
								headPos={this.view.state.selection.$head.pos}
								mediaOptions={mediaOptions}
								editorViewMode={editorViewModePlugin?.mode === 'view'}
							/>
						);
					};
					return (
						<MediaGroupNodeViewInternal
							renderFn={renderFn}
							pluginInjectionApi={pluginInjectionApi}
						/>
					);
				}}
			/>
		);
	}
}

export const ReactMediaGroupNode =
	(
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		providerFactory: ProviderFactory,
		mediaOptions: MediaOptions = {},
		pluginInjectionApi: ExtractInjectionAPI<MediaNextEditorPluginType> | undefined,
	) =>
	(node: PMNode, view: EditorView, getPos: getPosHandler): NodeView => {
		return new MediaGroupNodeView(node, view, getPos, portalProviderAPI, eventDispatcher, {
			providerFactory,
			mediaOptions,
			pluginInjectionApi,
		}).init();
	};
