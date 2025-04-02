import React, { useEffect, useRef } from 'react';

import { useSharedPluginState } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { fg } from '@atlaskit/platform-feature-flags';

import { createPlugin, dispatchShouldHideDecorations, key } from './pm-plugins/main';
import type { ReleaseHiddenDecoration, SelectionMarkerPlugin } from './selectionMarkerPluginType';
import { GlobalStylesWrapper } from './ui/global-styles';

export const selectionMarkerPlugin: SelectionMarkerPlugin = ({ config, api }) => {
	return {
		name: 'selectionMarker',

		pmPlugins() {
			return [
				{
					name: 'selectionMarkerPmPlugin',
					plugin: () => createPlugin(api),
				},
			];
		},

		getSharedState(editorState) {
			if (!editorState) {
				return undefined;
			}
			return {
				isForcedHidden: key.getState(editorState)?.forceHide ?? false,
				isMarkerActive: !key.getState(editorState)?.shouldHideDecorations,
			};
		},

		actions: {
			// For now this is a very simple locking mechanism that only allows one
			// plugin to hide / release at a time.
			hideDecoration: () => {
				if (api?.selectionMarker?.sharedState.currentState()?.isForcedHidden) {
					return undefined;
				}
				const success = api?.core?.actions.execute(({ tr }) =>
					tr.setMeta(key, { forceHide: true }),
				);
				if (!success) {
					return undefined;
				}

				return cleanupHiddenDecoration(api);
			},

			queueHideDecoration: (setCleanup: (cb: ReleaseHiddenDecoration | undefined) => void) => {
				const result = api?.selectionMarker.actions.hideDecoration();
				if (result === undefined) {
					const cleanup = api?.selectionMarker?.sharedState.onChange(({ nextSharedState }) => {
						if (
							nextSharedState?.isForcedHidden === false &&
							nextSharedState?.isMarkerActive === false
						) {
							const result = api?.selectionMarker.actions.hideDecoration();
							setCleanup(result);
							cleanup?.();
						}
					});
					return cleanup;
				}
				setCleanup(result);
				return () => {};
			},
		},

		usePluginHook({ editorView }) {
			const editorHasNotBeenFocused = useRef<boolean>(true);
			useEffect(() => {
				// relatch when editorView changes (pretty good signal for reinit)
				editorHasNotBeenFocused.current = true;
			}, [editorView]);

			const { focusState, typeAheadState, editorDisabledState } = useSharedPluginState(api, [
				'focus',
				'typeAhead',
				'editorDisabled',
				'selectionMarker',
			]);
			const isForcedHidden = useSharedPluginStateSelector(api, 'selectionMarker.isForcedHidden');
			useEffect(() => {
				if (fg('platform_editor_no_cursor_on_live_doc_init')) {
					// On editor init we should use this latch to keep the marker hidden until
					// editor has received focus. This means editor will be initially hidden until
					// the first focus occurs, and after first focus the normal above rules will
					// apply
					if (focusState?.hasFocus === true) {
						editorHasNotBeenFocused.current = false;
					}

					/**
					 * There are a number of conditions we should not show the marker,
					 * - Editor has not been focused: to keep the marker hidden until first focus if config is set
					 * - Focus: to ensure it doesn't interrupt the normal cursor
					 * - Typeahead Open: To ensure it doesn't show when we're typing in the typeahead
					 * - Disabled: So that it behaves similar to the renderer in live pages/disabled
					 * - Via the API: If another plugin has requested it to be hidden (force hidden).
					 */
					const shouldHide =
						((config?.hideCursorOnInit && editorHasNotBeenFocused.current) ||
							focusState?.hasFocus ||
							(typeAheadState?.isOpen ?? false) ||
							isForcedHidden ||
							(editorDisabledState?.editorDisabled ?? false)) ??
						true;

					requestAnimationFrame(() => dispatchShouldHideDecorations(editorView, shouldHide));
				} else {
					/**
					 * There are a number of conditions we should not show the marker,
					 * - Focus: to ensure it doesn't interrupt the normal cursor
					 * - Typeahead Open: To ensure it doesn't show when we're typing in the typeahead
					 * - Disabled: So that it behaves similar to the renderer in live pages/disabled
					 * - Via the API: If another plugin has requested it to be hidden (force hidden).
					 */
					const shouldHide =
						(focusState?.hasFocus ||
							(typeAheadState?.isOpen ?? false) ||
							isForcedHidden ||
							(editorDisabledState?.editorDisabled ?? false)) ??
						true;
					requestAnimationFrame(() => dispatchShouldHideDecorations(editorView, shouldHide));
				}
			}, [editorView, focusState, typeAheadState, isForcedHidden, editorDisabledState]);
		},

		contentComponent() {
			return <GlobalStylesWrapper />;
		},
	};
};

function cleanupHiddenDecoration(api: ExtractInjectionAPI<SelectionMarkerPlugin> | undefined) {
	let hasRun = false;
	return () => {
		if (!hasRun && api?.selectionMarker?.sharedState.currentState()?.isForcedHidden) {
			hasRun = true;
			return api?.core?.actions.execute(({ tr }) => tr.setMeta(key, { forceHide: false }));
		}
	};
}
