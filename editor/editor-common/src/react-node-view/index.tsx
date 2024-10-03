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

	constructor(
		node: PMNode,
		view: EditorView,
		getPos: getPosHandler,
		portalProviderAPI: PortalProviderAPI,
		eventDispatcher: EventDispatcher,
		reactComponentProps?: P,
		reactComponent?: React.ComponentType<React.PropsWithChildren<any>>,
		viewShouldUpdate?: shouldUpdate,
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

		this.portalProviderAPI.render(componentWithErrorBoundary, this.domRef!, this.key);
	}

	createDomRef(): HTMLElement {
		if (!this.node.isInline) {
			return document.createElement('div');
		}

		const htmlElement = document.createElement('span');
		return htmlElement;
	}

	getContentDOM(): { dom: HTMLElement; contentDOM?: HTMLElement | null | undefined } | undefined {
		return undefined;
	}

	handleRef = (node: HTMLElement | null) => this._handleRef(node);

	private _handleRef(node: HTMLElement | null) {
		const contentDOM = this.contentDOMWrapper || this.contentDOM;
		// @ts-ignore
		let oldIgnoreMutation: any;

		let selectionBookmark: SelectionBookmark;
		let parentOffset = 0;
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

			// ... and capture parent offset before DOM change
			if (this.view.state.selection?.ranges.length > 0) {
				parentOffset = this.view.state.selection?.ranges[0].$from?.parentOffset ?? 0;
			}

			node.appendChild(contentDOM);

			requestAnimationFrame(() => {
				// Reset ignoreMutation after frame ....
				// @ts-ignore - this may not have been declared by implementing class
				this.ignoreMutation = oldIgnoreMutation;

				// only trigger selection re-sync if the selection is not at the start of the
				// node, and DOM mutations were ignored
				if (selectionBookmark && mutationsIgnored && parentOffset > 0) {
					// ... and dispatch expected selection state
					this.view.dispatch(
						this.view.state.tr.setSelection(selectionBookmark.resolve(this.view.state.tr.doc)),
					);
				}
			});
		}
	}

	render(props: P, forwardRef?: ForwardRef): React.ReactElement<any> | null {
		return this.reactComponent ? (
			<this.reactComponent
				view={this.view}
				getPos={this.getPos}
				node={this.node}
				forwardRef={forwardRef}
				{...props}
			/>
		) : null;
	}

	update(
		node: PMNode,
		decorations: ReadonlyArray<Decoration>,
		_innerDecorations?: DecorationSource,
		validUpdate: (currentNode: PMNode, newNode: PMNode) => boolean = () => true,
	) {
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
		// TODO: ED-13910 Fix viewShouldUpdate readonly decoration array
		if (!this.viewShouldUpdate(node, decorations as Decoration[])) {
			this.node = node;
			return true;
		}

		this.node = node;

		this.renderReactComponent(() => this.render(this.reactComponentProps, this.handleRef));

		return true;
	}

	viewShouldUpdate(nextNode: PMNode, decorations?: Array<Decoration>): boolean {
		if (this._viewShouldUpdate) {
			return this._viewShouldUpdate(nextNode);
		}

		return true;
	}

	/**
	 * Copies the attributes from a ProseMirror Node to a DOM node.
	 * @param node The Prosemirror Node from which to source the attributes
	 */
	setDomAttrs(node: PMNode, element: HTMLElement) {
		Object.keys(node.attrs || {}).forEach((attr) => {
			element.setAttribute(attr, node.attrs[attr]);
		});
	}

	get dom() {
		return this.domRef as HTMLElement;
	}

	destroy() {
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
