import React from 'react';

import { ACTION_SUBJECT } from '@atlaskit/editor-common/analytics';
import { ErrorBoundary } from '@atlaskit/editor-common/error-boundary';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import type { ForwardRef, ReactComponentProps } from '@atlaskit/editor-common/react-node-view';
import ReactNodeView, { type getPosHandler } from '@atlaskit/editor-common/react-node-view';
import { BodiedSyncBlockSharedCssClassName } from '@atlaskit/editor-common/sync-block';
import type { ExtractInjectionAPI, PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import { isOfflineMode, type Mode } from '@atlaskit/editor-plugin-connectivity';
import {
	DOMSerializer,
	type DOMOutputSpec,
	type Node as PMNode,
} from '@atlaskit/editor-prosemirror/model';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { SyncedBlockPlugin, SyncedBlockPluginOptions } from '../syncedBlockPluginType';
import { BodiedSyncBlockWrapper } from '../ui/BodiedSyncBlockWrapper';

export interface BodiedSyncBlockNodeViewProps extends ReactComponentProps {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	eventDispatcher: EventDispatcher;
	getPos: getPosHandler;
	node: PMNode;
	pluginOptions: SyncedBlockPluginOptions | undefined;
	portalProviderAPI: PortalProviderAPI;
	view: EditorView;
}

const toDOM = (): DOMOutputSpec => [
	'div',
	{
		class: BodiedSyncBlockSharedCssClassName.content,
		contenteditable: true,
	},
	0,
];

class BodiedSyncBlock extends ReactNodeView<BodiedSyncBlockNodeViewProps> {
	private cleanupConnectivityModeListener?: () => void;
	private cleanupViewModeListener?: () => void;
	private api?: ExtractInjectionAPI<SyncedBlockPlugin>;

	constructor(props: BodiedSyncBlockNodeViewProps) {
		super(
			props.node,
			props.view,
			props.getPos,
			props.portalProviderAPI,
			props.eventDispatcher,
			props,
		);
		this.api = props.api;
		this.handleConnectivityModeChange();
		this.handleViewModeChange();
	}

	private updateContentEditable({
		contentDOM,
		nextConnectivityMode,
		nextViewMode,
	}: {
		contentDOM?: HTMLElement | null;
		nextConnectivityMode?: Mode;
		nextViewMode?: 'view' | 'edit';
	}) {
		const connectivityMode =
			nextConnectivityMode ?? this.api?.connectivity?.sharedState?.currentState()?.mode;
		const viewMode = nextViewMode ?? this.api?.editorViewMode?.sharedState?.currentState()?.mode;

		const isOnline = !isOfflineMode(connectivityMode);
		const isEditMode = viewMode !== 'view';
		const shouldBeEditable = isOnline && isEditMode;

		contentDOM?.setAttribute('contenteditable', shouldBeEditable ? 'true' : 'false');
	}

	private handleConnectivityModeChange() {
		if (this.api?.connectivity) {
			this.cleanupConnectivityModeListener = this.api.connectivity.sharedState.onChange(
				({ nextSharedState }) => {
					this.updateContentEditable({
						contentDOM: this.contentDOM,
						nextConnectivityMode: nextSharedState.mode,
					});
				},
			);
		}
	}

	private handleViewModeChange() {
		if (this.api?.editorViewMode) {
			this.cleanupViewModeListener = this.api.editorViewMode.sharedState.onChange(
				({ nextSharedState }) => {
					this.updateContentEditable({
						contentDOM: this.contentDOM,
						nextViewMode: nextSharedState?.mode,
					});
				},
			);
		}
	}

	createDomRef(): HTMLElement {
		const domRef = document.createElement('div');
		domRef.classList.add(BodiedSyncBlockSharedCssClassName.prefix);

		return domRef;
	}

	render(_props: never, forwardRef: ForwardRef) {
		const syncBlockStore = this.api?.syncedBlock.sharedState?.currentState()?.syncBlockStore;

		if (!syncBlockStore) {
			return null;
		}

		return (
			<ErrorBoundary
				component={ACTION_SUBJECT.SYNCED_BLOCK}
				dispatchAnalyticsEvent={this.api?.analytics?.actions.fireAnalyticsEvent}
				fallbackComponent={null}
			>
				<BodiedSyncBlockWrapper ref={forwardRef} syncBlockStore={syncBlockStore} node={this.node} />
			</ErrorBoundary>
		);
	}

	getContentDOM() {
		const { dom, contentDOM } = DOMSerializer.renderSpec(document, toDOM());
		if (dom instanceof HTMLElement) {
			this.updateContentEditable({ contentDOM });
			return { dom, contentDOM };
		}

		return undefined;
	}

	destroy() {
		if (this.cleanupConnectivityModeListener) {
			this.cleanupConnectivityModeListener();
		}
		if (this.cleanupViewModeListener) {
			this.cleanupViewModeListener();
		}
	}
}

export interface BodiedSyncBlockNodeViewProperties {
	api?: ExtractInjectionAPI<SyncedBlockPlugin>;
	pluginOptions: SyncedBlockPluginOptions | undefined;
	pmPluginFactoryParams: PMPluginFactoryParams;
}

export const bodiedSyncBlockNodeView: (
	props: BodiedSyncBlockNodeViewProperties,
) => (
	node: PMNode,
	view: EditorView,
	getPos: getPosHandler,
) => ReactNodeView<BodiedSyncBlockNodeViewProps> =
	({ pluginOptions, pmPluginFactoryParams, api }: BodiedSyncBlockNodeViewProperties) =>
	(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
	): ReactNodeView<BodiedSyncBlockNodeViewProps> => {
		const { portalProviderAPI, eventDispatcher } = pmPluginFactoryParams;

		return new BodiedSyncBlock({
			api,
			pluginOptions,
			node,
			view,
			getPos,
			portalProviderAPI,
			eventDispatcher,
		}).init();
	};
