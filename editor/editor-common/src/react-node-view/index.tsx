// Disable no-re-export rule for entry point files
/* eslint-disable @atlaskit/editor/no-re-export */

import React from 'react';

import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { SelectionBookmark } from '@atlaskit/editor-prosemirror/state';
import type {
	Decoration,
	DecorationSource,
	EditorView,
	NodeView,
} from '@atlaskit/editor-prosemirror/view';

import type { AnalyticsDispatch, AnalyticsEventPayload } from '../analytics';
import { ACTION_SUBJECT, ACTION_SUBJECT_ID } from '../analytics';
import type { EventDispatcher } from '../event-dispatcher';
import { createDispatch } from '../event-dispatcher';
import type { PortalProviderAPI } from '../portal';
import { ErrorBoundary } from '../ui/ErrorBoundary';
import {
	getPerformanceOptions,
	startMeasureReactNodeViewRendered,
	stopMeasureReactNodeViewRendered,
} from '../utils';
import { analyticsEventKey } from '../utils/analytics';

import { generateUniqueNodeKey } from './generateUniqueNodeKey';
import type {
	ForwardRef,
	getPosHandler,
	ProsemirrorGetPosHandler,
	ReactComponentProps,
	shouldUpdate,
} from './types';

export type {
	getPosHandler,
	ReactComponentProps,
	shouldUpdate,
	ProsemirrorGetPosHandler,
	ForwardRef,
};
export type { InlineNodeViewComponentProps } from './getInlineNodeViewProducer';
export { getInlineNodeViewProducer, inlineNodeViewClassname } from './getInlineNodeViewProducer';

export default class ReactNodeView<P = ReactComponentProps> implements NodeView {
	private domRef?: HTMLElement;
	private contentDOMWrapper?: Node;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private reactComponent?: React.ComponentType<React.PropsWithChildren<any>>;
	private portalProviderAPI: PortalProviderAPI;
	private _viewShouldUpdate?: shouldUpdate;
	protected eventDispatcher?: EventDispatcher;
	protected decorations: ReadonlyArray<Decoration> = [];

	reactComponentProps: P;

	view: EditorView;
	getPos: getPosHandler;
	contentDOM: HTMLElement | null | undefined;
	node: PMNode;
	key: string;
	shouldRenderImmediatelyInPortal: boolean;

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		reactComponentProps?: P,
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		reactComponent?: React.ComponentType<React.PropsWithChildren<any>>,
		viewShouldUpdate?: shouldUpdate,
		shouldRenderImmediatelyInPortal?: boolean,
	) {
		this.node = node;
		this.view = view;
		this.getPos = getPos;
		this.portalProviderAPI = portalProviderAPI;
		this.reactComponentProps = reactComponentProps || ({} as P);
		this.reactComponent = reactComponent;
		this._viewShouldUpdate = viewShouldUpdate;
		this.eventDispatcher = eventDispatcher;
		this.key = generateUniqueNodeKey();
		this.shouldRenderImmediatelyInPortal = shouldRenderImmediatelyInPortal || false;
	}

	/**
	 * This method exists to move initialization logic out of the constructor,
	 * so object can be initialized properly before calling render first time.
	 *
	 * Example:
	 * Instance properties get added to an object only after super call in
	 * constructor, which leads to some methods being undefined during the
	 * first render.
	 */
	init() {
		this.domRef = this.createDomRef();
		this.setDomAttrs(this.node, this.domRef);

		const { dom: contentDOMWrapper, contentDOM } = this.getContentDOM() || {
			dom: undefined,
			contentDOM: undefined,
		};

		if (this.domRef && contentDOMWrapper) {
			this.domRef.appendChild(contentDOMWrapper);
			this.contentDOM = contentDOM ? contentDOM : contentDOMWrapper;
			this.contentDOMWrapper = contentDOMWrapper || contentDOM;
		}

		// @see ED-3790
		// something gets messed up during mutation processing inside of a
		// nodeView if DOM structure has nested plain "div"s, it doesn't see the
		// difference between them and it kills the nodeView
		this.domRef.classList.add(`${this.node.type.name}View-content-wrap`);

		const { samplingRate, slowThreshold, trackingEnabled } = getPerformanceOptions(this.view);

		trackingEnabled && startMeasureReactNodeViewRendered({ nodeTypeName: this.node.type.name });

		this.renderReactComponent(() => this.render(this.reactComponentProps, this.handleRef));

		trackingEnabled &&
			stopMeasureReactNodeViewRendered({
				nodeTypeName: this.node.type.name,
				dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
				samplingRate,
				slowThreshold,
			});

		return this;
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	private renderReactComponent(component: () => React.ReactElement<any> | null) {
		if (!this.domRef || !component) {
			return;
		}

		const componentWithErrorBoundary = () => (
			<ErrorBoundary
				component={ACTION_SUBJECT.REACT_NODE_VIEW}
				componentId={
					(this?.node?.type?.name ?? ACTION_SUBJECT_ID.UNKNOWN_NODE) as ACTION_SUBJECT_ID
				}
				dispatchAnalyticsEvent={this.dispatchAnalyticsEvent}
			>
				{component()}
			</ErrorBoundary>
		);

		this.portalProviderAPI.render(
			componentWithErrorBoundary,
			// Ignored via go/ees005
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this.domRef!,
			this.key,
			undefined,
			this.shouldRenderImmediatelyInPortal,
		);
	}

	createDomRef(): HTMLElement {
		if (!this.node.isInline) {
			return document.createElement('div');
		}

		const htmlElement = document.createElement('span');
		return htmlElement;
	}

	getContentDOM(): { contentDOM?: HTMLElement | null | undefined; dom: HTMLElement } | undefined {
		return undefined;
	}

	handleRef = (node: HTMLElement | null): void => this._handleRef(node);

	private _handleRef(node: HTMLElement | null) {
		const contentDOM = this.contentDOMWrapper || this.contentDOM;
		// @ts-ignore
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		let oldIgnoreMutation: any;
		let selectionBookmark: SelectionBookmark;
		let mutationsIgnored = false;

		// move the contentDOM node inside the inner reference after rendering
		if (node && contentDOM && !node.contains(contentDOM)) {
			// @ts-ignore - ignoreMutation may not be declared
			oldIgnoreMutation = this.ignoreMutation; // store ref to previous ignoreMutation

			// ignore all mutations caused by ProseMirror's MutationObserver triggering
			// after DOM change, except selection changes
			// @ts-ignore ProseMirror adds selection type to MutationRecord
			this.ignoreMutation = (m) => {
				const isSelectionMutation = m.type === 'selection';
				if (!isSelectionMutation) {
					mutationsIgnored = true;
				}
				return !isSelectionMutation;
			};

			// capture document selection state before React DOM changes triggers ProseMirror selection change transaction
			if (this.view.state.selection.visible) {
				selectionBookmark = this.view.state.selection.getBookmark();
			}

			node.appendChild(contentDOM);

			// After the next frame:
			requestAnimationFrame(() => {
				// Restore the original mutation handler
				// @ts-ignore - this may not have been declared by implementing class
				this.ignoreMutation = oldIgnoreMutation;

				// Restore the selection only if:
				// - We have a selection bookmark
				// - Mutations were ignored during the table move
				// - The bookmarked selection is different from the current selection.
				if (selectionBookmark && mutationsIgnored) {
					const resolvedSelection = selectionBookmark.resolve(this.view.state.tr.doc);
					// Don't set the selection if it's the same as the current selection.
					if (!resolvedSelection.eq(this.view.state.selection)) {
						const tr = this.view.state.tr.setSelection(resolvedSelection);
						tr.setMeta('source', 'ReactNodeView:_handleRef:selection-resync');
						this.view.dispatch(tr);
					}
				}
			});
		}
	}

	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	render(props: P, forwardRef?: ForwardRef): React.ReactElement<any> | null {
		return this.reactComponent ? (
			<this.reactComponent
				view={this.view}
				getPos={this.getPos}
				node={this.node}
				forwardRef={forwardRef}
				// Ignored via go/ees005
				// eslint-disable-next-line react/jsx-props-no-spreading
				{...props}
			/>
		) : null;
	}

	update(
		node: PMNode,
		decorations: ReadonlyArray<Decoration>,
		_innerDecorations?: DecorationSource,
		validUpdate: (currentNode: PMNode, newNode: PMNode) => boolean = () => true,
	): boolean {
		// @see https://github.com/ProseMirror/prosemirror/issues/648
		const isValidUpdate = this.node.type === node.type && validUpdate(this.node, node);

		this.decorations = decorations;

		if (!isValidUpdate) {
			return false;
		}

		if (this.domRef && !this.node.sameMarkup(node)) {
			this.setDomAttrs(node, this.domRef);
		}

		// View should not process a re-render if this is false.
		// We dont want to destroy the view, so we return true.
		// TODO: ED-13910 - Fix viewShouldUpdate readonly decoration array
		if (!this.viewShouldUpdate(node, decorations as Decoration[])) {
			this.node = node;
			return true;
		}

		this.node = node;

		this.renderReactComponent(() => this.render(this.reactComponentProps, this.handleRef));

		return true;
	}

	viewShouldUpdate(nextNode: PMNode, _decorations?: Array<Decoration>): boolean {
		if (this._viewShouldUpdate) {
			return this._viewShouldUpdate(nextNode);
		}

		return true;
	}

	/**
	 * Copies the attributes from a ProseMirror Node to a DOM node.
	 * @param node The Prosemirror Node from which to source the attributes
	 */
	setDomAttrs(node: PMNode, element: HTMLElement): void {
		Object.keys(node.attrs || {}).forEach((attr) => {
			element.setAttribute(attr, node.attrs[attr]);
		});
	}

	get dom() {
		// Ignored via go/ees005
		// eslint-disable-next-line @atlaskit/editor/no-as-casting
		return this.domRef as HTMLElement;
	}

	destroy(): void {
		if (!this.domRef) {
			return;
		}

		this.portalProviderAPI.remove(this.key);
		this.domRef = undefined;
		this.contentDOM = undefined;
	}

	private dispatchAnalyticsEvent = (payload: AnalyticsEventPayload) => {
		if (this.eventDispatcher) {
			const dispatch: AnalyticsDispatch = createDispatch(this.eventDispatcher);
			dispatch(analyticsEventKey, {
				payload,
			});
		}
	};

	static fromComponent(
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		component: React.ComponentType<React.PropsWithChildren<any>>,
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		props?: ReactComponentProps,
		viewShouldUpdate?: (nextNode: PMNode) => boolean,
	) {
		return (node: PMNode, view: EditorView, getPos: getPosHandler) =>
			new ReactNodeView(
				node,
				view,
				getPos,
				portalProviderAPI,
				eventDispatcher,
				props,
				component,
				viewShouldUpdate,
			).init();
	}
}
