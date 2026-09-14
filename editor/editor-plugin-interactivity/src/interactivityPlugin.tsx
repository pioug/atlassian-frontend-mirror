import { useEffect, useRef } from 'react';

import { logException } from '@atlaskit/editor-common/monitoring';

import { fireInteractivityEvent } from './analytics/fire-interactivity-event';
import { InteractivityCollector } from './collector/interactivity-collector';
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
		const collectorRef = useRef<InteractivityCollector | undefined>(undefined);

		useEffect(() => {
			try {
				const collector = new InteractivityCollector({
					emit: (snapshot) => fireInteractivityEvent(api?.analytics?.actions, snapshot),
					getObjectId: () =>
						api?.contextIdentifier?.sharedState.currentState()?.contextIdentifierProvider?.objectId,
					getSessionMode: () => {
						const mode = api?.editorViewMode?.sharedState.currentState()?.mode;
						if (mode === undefined) {
							return undefined;
						}
						return mode === 'view' ? 'reading' : 'editing';
					},
					// A destroyed view still answers, with the document it was destroyed with, so
					// both report nothing rather than a size the editor no longer has.
					getNodeSize: () => (editorView.isDestroyed ? undefined : editorView.state.doc.nodeSize),
					// `getElementsByTagName` counts descendants in the browser engine, so this
					// cannot overflow the stack on very large documents.
					getEditorDomSize: () =>
						editorView.isDestroyed ? undefined : editorView.dom.getElementsByTagName('*').length,
				});

				// Effects run in declaration order, so the one below always finds it.
				collectorRef.current = collector;

				if (!collector.start()) {
					return;
				}

				// Confluence live pages navigate and switch between reading and editing without
				// remounting the editor. A session covers one document in one mode, so either
				// change ends it and starts the next.
				const unsubscribeFromObjectId = api?.contextIdentifier?.sharedState.onChange(() =>
					collector.onObjectIdChanged(),
				);
				const unsubscribeFromViewMode = api?.editorViewMode?.sharedState.onChange(() =>
					collector.onViewModeChanged(),
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
				return;
			}
			// `api` is deliberately not a dependency: a preset reconfigure hands out a new
			// proxy object, but the one captured here keeps resolving plugins from the same
			// live registry, and restarting the session on a reconfigure would split one
			// editor session in two.
		}, [editorView]);

		useEffect(() => {
			try {
				collectorRef.current?.setEditorRoot(wrapperElement);
			} catch (error) {
				void logException(error as Error, { location: 'editor-plugin-interactivity/observe' });
			}
		}, [wrapperElement]);
	},
});
