import { useEffect, useRef } from 'react';

import { logException } from '@atlaskit/editor-common/monitoring/error';

import { fireInteractivityEvent } from './analytics/fire-interactivity-event';
import type { SessionMode } from './analytics/interactivity-snapshot';
import { InteractivityCollector } from './collector/interactivity-collector';
import type { InteractivityRegion } from './collector/region-event-observer';
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
		const editorRegionRef = useRef<InteractivityRegion | undefined>(undefined);

		useEffect(() => {
			try {
				// The provider resolves asynchronously after mount, and `contextIdentifierPlugin` resets
				// its state to the configured provider on transactions that do not carry a new one, so
				// the id goes missing for a moment on a document that never changed.
				const readObjectId = () =>
					api?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider?.objectId;
				const readSessionMode = (): SessionMode | undefined => {
					const mode = api?.editorViewMode?.sharedState.currentState()?.mode;
					if (mode === undefined) {
						return undefined;
					}
					return mode === 'view' ? 'reading' : 'editing';
				};

				const collector = new InteractivityCollector({
					regions: ['editor'],
					rotateReasons: ['navigation', 'modeChange'],
					// Confluence live pages navigate and switch between reading and editing without
					// remounting the editor. A session covers one document in one mode, because
					// interactions with a read-only page are a different population from interactions
					// while editing.
					sessionKeys: { objectId: readObjectId(), mode: readSessionMode() },
					emit: ({ regions, sessionKeys, ...snapshot }) =>
						fireInteractivityEvent(api?.analytics?.actions, {
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
						}),
				});

				// Effects run in declaration order, so the one below always finds it.
				editorRegionRef.current = collector.region('editor');

				if (!collector.start()) {
					return;
				}

				const unsubscribeFromObjectId = api?.contextIdentifier?.sharedState.onChange(() =>
					collector.setSessionKeys({
						values: { objectId: readObjectId() },
						rotateReason: 'navigation',
					}),
				);
				const unsubscribeFromViewMode = api?.editorViewMode?.sharedState.onChange(() =>
					collector.setSessionKeys({
						values: { mode: readSessionMode() },
						rotateReason: 'modeChange',
					}),
				);

				return () => {
					unsubscribeFromObjectId?.();
					unsubscribeFromViewMode?.();
					collector.stop();
				};
			} catch (error) {
				// Instrumentation must not fail the editor around it, but a failure that hits every
				// browser of one engine would be invisible without this.
				void logException(error as Error, { location: 'editor-plugin-interactivity/start' });
			}
			// `api` is deliberately not a dependency: a preset reconfigure hands out a new
			// proxy object, but the one captured here keeps resolving plugins from the same
			// live registry, and restarting the session on a reconfigure would split one
			// editor session in two.
		}, [editorView]);

		useEffect(() => {
			const editorRegion = editorRegionRef.current;
			if (!editorRegion || !wrapperElement) {
				return;
			}

			try {
				return editorRegion.addElement(wrapperElement);
			} catch (error) {
				void logException(error as Error, { location: 'editor-plugin-interactivity/observe' });
			}
			// `editorView` too: a new view brings a new collector, whose region needs the element even
			// when the element stays the same.
		}, [editorView, wrapperElement]);
	},
});
