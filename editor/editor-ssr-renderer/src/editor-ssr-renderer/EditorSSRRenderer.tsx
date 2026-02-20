import React, { useMemo, useRef, useLayoutEffect } from 'react';
import type { IntlShape } from 'react-intl-next';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { DecorationSet, type NodeView } from '@atlaskit/editor-prosemirror/view';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Node as PMNode, Slice } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer, type Mark, type Schema } from '@atlaskit/editor-prosemirror/model';
import type { PMPluginFactoryParams, EditorPlugin } from '@atlaskit/editor-common/types';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { EventDispatcher, createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { fg } from '@atlaskit/platform-feature-flags';
import {
	profileSSROperation,
	SSRRenderMeasure,
} from '@atlaskit/editor-common/performance/ssr-measures';

const SSR_TRACE_SEGMENT_NAME = 'reactEditorView/editorSSRRenderer';

// The copy of type from prosemirror-view.
// Probably, we need to fix this package exports and add `NodeViewConstructor` and `MarkViewConstructor` types here.
type MarkViewConstructor = (mark: Mark, view: EditorView, inline: boolean) => NodeView;

interface Props {
	'aria-describedby'?: string;
	'aria-label': string;
	className: string;
	'data-editor-id': string;
	doc: PMNode | undefined;
	id: string;
	intl: IntlShape;
	onEditorStateChanged?: (state: EditorState) => void;
	onSSRMeasure?: (measure: {
		endTimestamp: number;
		segmentName: string;
		startTimestamp: number;
	}) => void;
	plugins: EditorPlugin[];
	portalProviderAPI: PortalProviderAPI;
	schema: Schema;
}

/**
 * A lightweight EditorView implementation for SSR environments.
 *
 * It's kind of aggressive right now, we need to test and see how it works.
 * Probably, we will need to implement more methods/properties in the future.
 *
 * If it doesn't work, we can extend `EditorView` directly instead of implementing `Partial<EditorView>`,
 * but it will perform some DOM operation during the construction.
 */
class SSREditorView implements Pick<EditorView, keyof EditorView> {
	readonly state: EditorState;
	readonly dom: HTMLElement;
	readonly editable: boolean;
	readonly dragging: null;
	readonly composing: boolean;
	readonly props: { state: EditorState };
	readonly root: Document;
	readonly isDestroyed: boolean;

	update() {
		// No-op in SSR
	}
	setProps() {
		// No-op in SSR
	}
	dispatchEvent() {
		// No-op in SSR
	}
	dispatch() {
		// No-op in SSR
	}
	hasFocus() {
		return false;
	}
	focus() {
		// No-op in SSR
	}
	updateRoot() {
		// No-op in SSR
	}
	posAtCoords() {
		return null;
	}
	coordsAtPos() {
		return { left: 0, right: 0, top: 0, bottom: 0 };
	}
	domAtPos() {
		return { node: this.root, offset: 0 };
	}
	nodeDOM() {
		return null;
	}
	posAtDOM() {
		return 0;
	}
	endOfTextblock() {
		return false;
	}
	pasteHTML() {
		return false;
	}
	pasteText() {
		return false;
	}
	destroy() {
		// No-op in SSR
	}
	updateState() {
		// No-op in SSR
	}
	someProp() {
		return undefined;
	}

	serializeForClipboard(slice: Slice): { dom: HTMLElement; slice: Slice; text: string } {
		// No-op in SSR - clipboard operations are not supported
		return {
			dom: document.createElement('div'),
			text: '',
			slice,
		};
	}

	constructor(place: null, props: { state: EditorState }) {
		this.state = props.state;
		this.dom = document.createElement('div');
		this.editable = true;
		this.dragging = null;
		this.composing = false;
		this.props = props;
		this.root = document;
		this.isDestroyed = false;
	}
}

class SSREventDispatcher extends EventDispatcher {
	override emit() {
		// Don't notify about events in SSR
	}
}

export function EditorSSRRenderer({
	plugins,
	schema,
	doc,
	portalProviderAPI,
	intl,
	onSSRMeasure,
	onEditorStateChanged,
	...divProps
}: Props): React.JSX.Element {
	// Should be always the first statement in the component
	const firstRenderStartTimestampRef = useRef(performance.now());

	// PMPluginFactoryParams use `getIntl` function to get current intl instance,
	// so we don't need to add `intl` as a dependency to `useMemo`.
	// We will store intl in ref and access to it dynamically in `getIntl` function call.
	const intlRef = useRef(intl);
	intlRef.current = intl;

	const pmPlugins = useMemo(() => {
		const createPMPlugins = () => {
			const eventDispatcher = new SSREventDispatcher();
			const providerFactory = new ProviderFactory();

			const pmPluginFactoryParams: PMPluginFactoryParams = {
				dispatch: createDispatch(eventDispatcher),
				dispatchAnalyticsEvent: () => {},
				eventDispatcher,
				featureFlags: {},
				getIntl: () => intlRef.current,
				nodeViewPortalProviderAPI: portalProviderAPI,
				portalProviderAPI: portalProviderAPI,
				providerFactory,
				schema,
			};

			return plugins.reduce((acc, editorPlugin) => {
				editorPlugin.pmPlugins?.().forEach(({ plugin }) => {
					try {
						const pmPlugin = plugin(pmPluginFactoryParams);
						if (pmPlugin) {
							acc.push(pmPlugin);
						}
					} catch {}
				});

				return acc;
			}, [] as SafePlugin[]);
		};

		return fg('platform_editor_better_editor_ssr_spans')
			? profileSSROperation(
					`${SSR_TRACE_SEGMENT_NAME}/createPMPlugins`,
					createPMPlugins,
					onSSRMeasure,
				)
			: createPMPlugins();
	}, [plugins, portalProviderAPI, schema, onSSRMeasure]);

	const nodeViews = useMemo(() => {
		return pmPlugins.reduce<Record<string, NodeViewConstructor>>((acc, plugin) => {
			return Object.assign(acc, plugin.props.nodeViews);
		}, {});
	}, [pmPlugins]);

	const markViews = useMemo(() => {
		return pmPlugins.reduce<Record<string, MarkViewConstructor>>((acc, plugin) => {
			return Object.assign(acc, plugin.props.markViews);
		}, {});
	}, [pmPlugins]);

	const editorState = useMemo(() => {
		const createEditorState = () => {
			return EditorState.create({
				doc,
				schema,
				plugins: pmPlugins,
			});
		};

		return fg('platform_editor_better_editor_ssr_spans')
			? profileSSROperation(
					`${SSR_TRACE_SEGMENT_NAME}/createEditorState`,
					createEditorState,
					onSSRMeasure,
				)
			: createEditorState();
	}, [doc, pmPlugins, schema, onSSRMeasure]);

	// In React 19 could be replaced by `useEffectEvent` hook.
	const onEditorStateChangedRef = useRef(onEditorStateChanged);
	onEditorStateChangedRef.current = onEditorStateChanged;
	useLayoutEffect(() => {
		onEditorStateChangedRef.current?.(editorState);
	}, [editorState]);

	const editorView = useMemo(() => {
		return new SSREditorView(null, {
			state: editorState,
		}) as unknown as EditorView;
	}, [editorState]);

	const { serializer, nodePositions } = useMemo(() => {
		const createSerializerAndNodePositions = () => {
			const nodePositions = new WeakMap<PMNode, number>();

			// ProseMirror View adds <br class="ProseMirror-trailingBreak" /> to empty nodes. Because we are using
			// DOMSerializer, we should simulate the same behaviour to get the same HTML document.
			//
			// There are a lot of conditions that check for adding `<br />` but we could implement only the case when we
			// are adding `<br />` to empty texblock, because if we add `<br />` in other cases it will change order of DOM nodes inside
			// this node (`<br />`) will be the first, after will be other nodes. It's because we are adding `<br />` to root node before
			// we are rendering child node.
			//
			// See: https://discuss.prosemirror.net/t/where-can-i-read-about-prosemirror-trailingbreak/6665
			// See: https://github.com/ProseMirror/prosemirror-view/blob/76c7c47f03730b18397b94bd269ece8a9cb7f486/src/viewdesc.ts#L803
			// See: https://github.com/ProseMirror/prosemirror-view/blob/76c7c47f03730b18397b94bd269ece8a9cb7f486/src/viewdesc.ts#L1365
			const addTrailingBreakIfNeeded = (
				node: PMNode,
				contentDOM: HTMLElement | null | undefined,
			) => {
				if (contentDOM && node.isTextblock && !node.lastChild) {
					const br = document.createElement('br');
					br.classList.add('ProseMirror-trailingBreak');
					contentDOM.appendChild(br);
				}
			};

			const toDomNodeRenderers = Object.fromEntries(
				Object.entries(schema.nodes)
					.map(([nodeName, nodeType]) => {
						return [nodeName, nodeType.spec.toDOM];
					})
					.filter(([, toDOM]) => !!toDOM),
			);
			const toDomMarkRenderers = Object.fromEntries(
				Object.entries(schema.marks)
					.map(([markName, markType]) => {
						return [markName, markType.spec.toDOM];
					})
					.filter(([, toDOM]) => !!toDOM),
			);

			const nodeViewRenderers = Object.fromEntries(
				Object.entries(nodeViews).map(([nodeName, nodeViewFactory]) => {
					return [
						nodeName,
						(node: PMNode) => {
							const nodeViewInstance = nodeViewFactory(
								node,
								editorView,
								() => nodePositions.get(node) ?? 0,
								[],
								DecorationSet.create(node, []),
							);

							addTrailingBreakIfNeeded(node, nodeViewInstance.contentDOM);

							return {
								dom: nodeViewInstance.dom,
								// Leaf nodes have no content, ProseMirror will throw an error if we pass contentDOM
								contentDOM: node.isLeaf ? undefined : nodeViewInstance.contentDOM,
							};
						},
					];
				}),
			);

			// Create renderers for textblock nodes that don't have custom NodeViews (e.g. paragraph, heading)
			const textblockRenderers = Object.fromEntries(
				Object.entries(schema.nodes)
					.filter(([nodeName, nodeType]) => {
						// Only handle textblock nodes
						return nodeType.spec.toDOM && nodeType.isTextblock && !nodeViews[nodeName];
					})
					.map(([nodeName, nodeType]) => {
						const toDOM = nodeType.spec.toDOM;
						if (!toDOM) {
							return [nodeName, undefined];
						}

						return [
							nodeName,
							(node: PMNode) => {
								if (!node.lastChild) {
									const result = DOMSerializer.renderSpec(document, toDOM(node));
									addTrailingBreakIfNeeded(node, result.contentDOM);
									return result;
								}

								return toDOM(node);
							},
						];
					})
					.filter(([, renderer]) => !!renderer),
			);

			const markViewRenderers = Object.fromEntries(
				Object.entries(markViews).map(([markName, markViewFactory]) => {
					return [
						markName,
						(mark: Mark) => {
							const markViewInstance = markViewFactory(mark, editorView, false);

							return {
								dom: markViewInstance.dom,
								contentDOM: markViewInstance.contentDOM,
							};
						},
					];
				}),
			);

			const serializer = new DOMSerializer(
				{
					...toDomNodeRenderers,
					...textblockRenderers,
					...nodeViewRenderers,
					text: renderText,
				},
				{
					...toDomMarkRenderers,
					...markViewRenderers,
				},
			);

			return { serializer, nodePositions };
		};

		return fg('platform_editor_better_editor_ssr_spans')
			? profileSSROperation(
					`${SSR_TRACE_SEGMENT_NAME}/createSerializerAndNodePositions`,
					createSerializerAndNodePositions,
					onSSRMeasure,
				)
			: createSerializerAndNodePositions();
	}, [editorView, markViews, nodeViews, schema.marks, schema.nodes, onSSRMeasure]);

	const editorHTML = useMemo(() => {
		const serializeFragment = () => {
			if (!doc) {
				return undefined;
			}

			doc.descendants((node, pos) => {
				nodePositions.set(node, pos);
			});

			return serializer.serializeFragment(doc.content);
		};

		try {
			return fg('platform_editor_better_editor_ssr_spans')
				? profileSSROperation(
						`${SSR_TRACE_SEGMENT_NAME}/serializeFragment`,
						serializeFragment,
						onSSRMeasure,
					)
				: serializeFragment();
		} catch {
			return undefined;
		}
	}, [doc, serializer, nodePositions, onSSRMeasure]);

	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (containerRef.current && editorHTML) {
			containerRef.current.innerHTML = '';
			containerRef.current.appendChild(editorHTML);
		}
	}, [editorHTML]);

	return (
		<SSRRenderMeasure
			segmentName={SSR_TRACE_SEGMENT_NAME}
			startTimestampRef={firstRenderStartTimestampRef}
			onSSRMeasure={fg('platform_editor_better_editor_ssr_spans') ? onSSRMeasure : undefined}
		>
			<div
				ref={containerRef}
				id={divProps.id}
				// For some reason on SSR, the result `class` has a trailing space, that broke UFO,
				// because ReactEditorView produces a div with `class` without space.
				// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
				className={divProps.className.trim()}
				aria-label={divProps['aria-label']}
				aria-describedby={divProps['aria-describedby']}
				data-editor-id={divProps['data-editor-id']}
				data-vc-ignore-if-no-layout-shift={true}
				data-ssr-placeholder={
					expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
						? 'editor-view'
						: undefined
				}
				data-ssr-placeholder-replace={
					expValEquals('platform_editor_hydratable_ui', 'isEnabled', true)
						? 'editor-view'
						: undefined
				}
				aria-multiline={true}
				role="textbox"
				// @ts-expect-error - contenteditable is not exist in div attributes
				contenteditable="true"
				data-gramm="false"
				translate="no"
			/>
		</SSRRenderMeasure>
	);
}

function renderText(node: PMNode) {
	return node.text || '';
}
