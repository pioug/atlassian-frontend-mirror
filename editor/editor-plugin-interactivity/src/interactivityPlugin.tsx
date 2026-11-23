import { useEffect, useMemo } from 'react';

import { logException } from '@atlaskit/editor-common/monitoring/error';

import { fireInteractivityEvent } from './analytics/fire-interactivity-event';
import type { SessionMode } from './analytics/interactivity-snapshot';
import { InteractivityCollector } from './collector/interactivity-collector';
import { useInteractivityRegionElement } from './collector/use-interactivity-region-element';
import type { InteractivityPlugin } from './interactivityPluginType';

/**
 * Reports session-to-date interaction latency distributions for full page editor sessions
 * as the `editor interactivity` operational event.
 *
 * The session runs for as long as the plugin's hook stays mounted, which is one editor
 * mount: `MountPluginHooks` in editor-core keys hook fibers by plugin name, so a preset
 * reconfigure — which destroys and recreates ProseMirror plugin views — leaves this hook,
 * and the session, in place.
 */
export const interactivityPlugin: InteractivityPlugin = ({ api }) => ({
	name: 'interactivity',

	usePluginHook({ editorView, wrapperElement }) {
		// The provider resolves asynchronously after mount, and `contextIdentifierPlugin` resets its
		// state to the configured provider on transactions that do not carry a new one, so the id
		// goes missing for a moment on a document that never changed.
		const readObjectId = () =>
			api?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider?.objectId;
		const readSessionMode = (): SessionMode | undefined => {
			const mode = api?.editorViewMode?.sharedState.currentState()?.mode;
			if (mode === undefined) {
				return undefined;
			}
			return mode === 'view' ? 'reading' : 'editing';
		};

		// Created during render, so the region is there for the hook below on the first one. It
		// touches nothing until `start`, so a render React throws away leaves nothing behind.
		const collector = useMemo(
			() =>
				new InteractivityCollector({
					regions: ['editor'],
					endReasons: ['navigation', 'modeChange', 'unmount'],
					// Confluence live pages navigate and switch between reading and editing without
					// remounting the editor. A session covers one document in one mode, because
					// interactions with a read-only page are a different population from interactions
					// while editing.
					sessionKeys: { objectId: readObjectId(), mode: readSessionMode() },
					onError: (error) =>
						void logException(error, { location: 'editor-plugin-interactivity/collector' }),
					emit: ({ regions, sessionKeys, ...snapshot }, { immediate }) =>
						fireInteractivityEvent(
							api?.analytics?.actions,
							{
								...snapshot,
								objectId: sessionKeys.objectId,
								sessionMode: sessionKeys.mode,
								editor: regions.editor.all,
								editorTyping: regions.editor.typing,
								editorPointer: regions.editor.pointer,
								editorOther: regions.editor.other,
								// A destroyed view still answers, with the document it was destroyed with, so
								// both report nothing rather than a size the editor no longer has.
								nodeSize: editorView.isDestroyed ? undefined : editorView.state.doc.nodeSize,
								// `getElementsByTagName` counts descendants in the browser engine, so this
								// cannot overflow the stack on very large documents.
								editorDomSize: editorView.isDestroyed
									? undefined
									: editorView.dom.getElementsByTagName('*').length,
							},
							{ immediate },
						),
				}),
			// `api` is deliberately not a dependency: a preset reconfigure hands out a new proxy
			// object, but the one captured here keeps resolving plugins from the same live registry,
			// and a new collector on a reconfigure would split one editor session in two.
			[editorView],
		);

		useInteractivityRegionElement({ region: collector.region('editor'), element: wrapperElement });

		useEffect(() => {
			try {
				if (!collector.start()) {
					return;
				}

				const unsubscribeFromObjectId = api?.contextIdentifier?.sharedState.onChange(() =>
					collector.setSessionKeys({
						values: { objectId: readObjectId() },
						endReason: 'navigation',
					}),
				);
				const unsubscribeFromViewMode = api?.editorViewMode?.sharedState.onChange(() =>
					collector.setSessionKeys({
						values: { mode: readSessionMode() },
						endReason: 'modeChange',
					}),
				);

				return () => {
					unsubscribeFromObjectId?.();
					unsubscribeFromViewMode?.();
					collector.stop({ endReason: 'unmount' });
				};
			} catch (error) {
				// Instrumentation must not fail the editor around it, but a failure that hits every
				// browser of one engine would be invisible without this.
				void logException(error as Error, { location: 'editor-plugin-interactivity/start' });
			}
			// `api` as above.
		}, [collector]);
	},
});
