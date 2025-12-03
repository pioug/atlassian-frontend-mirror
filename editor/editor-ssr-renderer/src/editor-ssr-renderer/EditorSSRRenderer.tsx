import React, { useMemo, useRef, useLayoutEffect } from 'react';
import { useIntl } from 'react-intl-next';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorView, DecorationSet, type NodeView } from '@atlaskit/editor-prosemirror/view';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Node as PMNode, DOMSerializer, type Mark } from '@atlaskit/editor-prosemirror/model';
import type { DocNode } from '@atlaskit/adf-schema';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { EventDispatcher, createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import type { EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import { getBrowserInfo } from '@atlaskit/editor-common/browser';

// The copy of type from prosemirror-view.
// Probably, we need to fix this package exports and add `NodeViewConstructor` and `MarkViewConstructor` types here.
type MarkViewConstructor = (mark: Mark, view: EditorView, inline: boolean) => NodeView;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface Props<Preset extends EditorPresetBuilder<any, any> = EditorPresetBuilder<any, any>> {
	adf: DocNode;
	preset: Preset;
}

class SSREditorView extends EditorView {
	override update(): void {
		// Skip any updates in SSR
	}
	override setProps(): void {
		// Skip any updates in SSR
	}
	override updateState(): void {
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

class SSRPortalProviderAPI implements PortalProviderAPI {
	destroy() {}
	remove() {}
	render() {}
}

export function EditorSSRRenderer({ adf, preset }: Props) {
	const intl = useIntl();
	const plugins = useMemo(() => preset.build(), [preset]);

	const pmPlugins = useMemo(() => {
		const eventDispatcher = new SSREventDispatcher();
		const portalProviderAPI = new SSRPortalProviderAPI();
		const providerFactory = new ProviderFactory();

		const pmPluginFactoryParams: PMPluginFactoryParams = {
			dispatch: createDispatch(eventDispatcher),
			dispatchAnalyticsEvent: () => {},
			eventDispatcher,
			featureFlags: {},
			getIntl: () => intl,
			nodeViewPortalProviderAPI: portalProviderAPI,
			portalProviderAPI: portalProviderAPI,
			providerFactory,
			schema: defaultSchema,
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
	}, [intl, plugins]);

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
				schema: defaultSchema,
				plugins: pmPlugins,
			}),
		});
	}, [pmPlugins]);

	const serializer = useMemo(() => {
		const toDomNodeRenderers = Object.fromEntries(
			Object.entries(defaultSchema.nodes)
				.map(([nodeName, nodeType]) => {
					return [nodeName, nodeType.spec.toDOM];
				})
				.filter(([, toDOM]) => !!toDOM),
		);
		const toDomMarkRenderers = Object.fromEntries(
			Object.entries(defaultSchema.marks)
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
							() => 0,
							[],
							DecorationSet.create(node, []),
						);

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

		return new DOMSerializer(
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
	}, [editorView, markViews, nodeViews]);

	const editorHTML = useMemo(() => {
		try {
			const pmDoc = PMNode.fromJSON(defaultSchema, adf);
			return serializer.serializeFragment(pmDoc.content);
		} catch {
			return undefined;
		}
	}, [adf, serializer]);

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
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-classname-prop -- Ignored via go/DSP-18766
			className={`ProseMirror ${getUAPrefix()}`}
		/>
	);
}

function renderText(node: PMNode) {
	return node.text || '';
}

// Copy from platform/packages/editor/editor-core/src/create-editor/ReactEditorView/getUAPrefix.ts
export function getUAPrefix() {
	const browser = getBrowserInfo();

	if (browser.chrome) {
		return 'ua-chrome';
	} else if (browser.ie) {
		return 'ua-ie';
	} else if (browser.gecko) {
		return 'ua-firefox';
	} else if (browser.safari) {
		return 'ua-safari';
	}

	return '';
}
