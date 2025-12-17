import React, { useMemo, useRef, useLayoutEffect } from 'react';
import type { IntlShape } from 'react-intl-next';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorView, DecorationSet, type NodeView } from '@atlaskit/editor-prosemirror/view';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer, type Mark, type Schema } from '@atlaskit/editor-prosemirror/model';
import type { PMPluginFactoryParams, EditorPlugin } from '@atlaskit/editor-common/types';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { EventDispatcher, createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

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
	plugins: EditorPlugin[];
	portalProviderAPI: PortalProviderAPI;
	schema: Schema;
}

class SSREditorView extends EditorView {
	override update(): void {
		// Skip any updates in SSR
	}
	override setProps(): void {
		// Skip any updates in SSR
	}
	override dispatchEvent(): void {
		// Don't notify about events in SSR
	}
	override dispatch(): void {
		// Don't notify about events in SSR
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
	...divProps
}: Props): React.JSX.Element {
	// PMPluginFactoryParams use `getIntl` function to get current intl instance,
	// so we don't need to add `intl` as a dependency to `useMemo`.
	// We will store intl in ref and access to it dynamically in `getIntl` function call.
	const intlRef = useRef(intl);
	intlRef.current = intl;

	const pmPlugins = useMemo(() => {
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
	}, [plugins, portalProviderAPI, schema]);

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

	const editorView = useMemo(() => {
		return new SSREditorView(null, {
			state: EditorState.create({
				doc,
				schema,
				plugins: pmPlugins,
			}),
		});
	}, [doc, pmPlugins, schema]);

	const { serializer, nodePositions } = useMemo(() => {
		const nodePositions = new WeakMap<PMNode, number>();

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
						if (
							nodeViewInstance.contentDOM &&
							// if (this.node.isTextblock) updater.addTextblockHacks()
							node.isTextblock &&
							// !lastChild || // Empty textblock
							!node.lastChild
							// NOT IMPLEMENTED CASE !(lastChild instanceof TextViewDesc) ||
							// NOT IMPLEMENTED CASE /\n$/.test(lastChild.node.text!) ||
							// NOT IMPLEMENTED CASE (this.view.requiresGeckoHackNode && /\s$/.test(lastChild.node.text!))
						) {
							const br = document.createElement('br');
							br.classList.add('ProseMirror-trailingBreak');
							nodeViewInstance.contentDOM.appendChild(br);
						}

						return {
							dom: nodeViewInstance.dom,
							contentDOM: nodeViewInstance.contentDOM,
						};
					},
				];
			}),
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
				...nodeViewRenderers,
				text: renderText,
			},
			{
				...toDomMarkRenderers,
				...markViewRenderers,
			},
		);

		return { serializer, nodePositions };
	}, [editorView, markViews, nodeViews, schema.marks, schema.nodes]);

	const editorHTML = useMemo(() => {
		if (!doc) {
			return undefined;
		}

		try {
			doc.descendants((node, pos) => {
				nodePositions.set(node, pos);
			});

			return serializer.serializeFragment(doc.content);
		} catch {
			return undefined;
		}
	}, [doc, serializer, nodePositions]);

	const containerRef = useRef<HTMLDivElement>(null);

	useLayoutEffect(() => {
		if (containerRef.current && editorHTML) {
			containerRef.current.innerHTML = '';
			containerRef.current.appendChild(editorHTML);
		}
	}, [editorHTML]);

	return (
		<div
			ref={containerRef}
			id={divProps.id}
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={divProps.className}
			aria-label={divProps['aria-label']}
			aria-describedby={divProps['aria-describedby']}
			data-editor-id={divProps['data-editor-id']}
			data-vc-ignore-if-no-layout-shift={true}
			aria-multiline={true}
			role="textbox"
			// @ts-expect-error - contenteditable is not exist in div attributes
			contenteditable="true"
			data-gramm="false"
			translate="no"
		/>
	);
}

function renderText(node: PMNode) {
	return node.text || '';
}
