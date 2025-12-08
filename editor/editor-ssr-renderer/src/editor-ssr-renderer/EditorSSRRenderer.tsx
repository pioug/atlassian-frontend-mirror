import React, { useMemo, useRef, useLayoutEffect } from 'react';
import type { IntlShape } from 'react-intl-next';
import type { EditorPluginInjectionAPI, EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { EditorView, DecorationSet, type NodeView } from '@atlaskit/editor-prosemirror/view';
import type { NodeViewConstructor } from '@atlaskit/editor-common/lazy-node-view';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import { DOMSerializer, type Mark, type Schema } from '@atlaskit/editor-prosemirror/model';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { PMPluginFactoryParams } from '@atlaskit/editor-common/types';
import type { PortalProviderAPI } from '@atlaskit/editor-common/portal';
import { EventDispatcher, createDispatch } from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';

// The copy of type from prosemirror-view.
// Probably, we need to fix this package exports and add `NodeViewConstructor` and `MarkViewConstructor` types here.
type MarkViewConstructor = (mark: Mark, view: EditorView, inline: boolean) => NodeView;

interface Props {
	'aria-describedby'?: string;
	'aria-label': string;
	buildDoc: (schema: Schema) => PMNode | undefined;
	className: string;
	'data-editor-id': string;
	id: string;
	intl: IntlShape;
	pluginInjectionAPI?: EditorPluginInjectionAPI;
	portalProviderAPI: PortalProviderAPI;
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	preset: EditorPresetBuilder<any, any>;
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
	preset,
	buildDoc,
	portalProviderAPI,
	intl,
	pluginInjectionAPI,
	...divProps
}: Props) {
	// PMPluginFactoryParams use `getIntl` function to get current intl instance,
	// so we don't need to add `intl` as a dependency to `useMemo`.
	// We will store intl in ref and access to it dynamically in `getIntl` function call.
	const intlRef = useRef(intl);
	intlRef.current = intl;

	const plugins = useMemo(() => preset.build({ pluginInjectionAPI }), [pluginInjectionAPI, preset]);

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
	}, [plugins, portalProviderAPI]);

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
			const pmDoc = buildDoc(editorView.state.schema);
			if (!pmDoc) {
				return undefined;
			}

			return serializer.serializeFragment(pmDoc.content);
		} catch {
			return undefined;
		}
	}, [editorView.state.schema, buildDoc, serializer]);

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
