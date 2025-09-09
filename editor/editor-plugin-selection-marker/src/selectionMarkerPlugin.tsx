import React, { useEffect, useRef } from 'react';

import { useSharedPluginStateWithSelector } from '@atlaskit/editor-common/hooks';
import type { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';

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

			const { hasFocus, isOpen, editorDisabled, showToolbar } = useSharedPluginStateWithSelector(
				api,
				['focus', 'typeAhead', 'editorDisabled', 'toolbar'],
				(states) => ({
					hasFocus: states.focusState?.hasFocus,
					isOpen: states.typeAheadState?.isOpen,
					editorDisabled: states.editorDisabledState?.editorDisabled,
					showToolbar: states.toolbarState?.shouldShowToolbar,
				}),
			);
			const isForcedHidden = useSharedPluginStateSelector(api, 'selectionMarker.isForcedHidden');
			useEffect(() => {
				// On editor init we should use this latch to keep the marker hidden until
				// editor has received focus. This means editor will be initially hidden until
				// the first focus occurs, and after first focus the normal above rules will
				// apply
				if (hasFocus === true) {
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
					(config?.hideCursorOnInit && editorHasNotBeenFocused.current) ||
					hasFocus ||
					(isOpen ?? false) ||
					isForcedHidden ||
					(editorDisabled ?? false) ||
					(expValEquals('platform_editor_toolbar_aifc_patch_1', 'isEnabled', true) &&
						(showToolbar ?? false)) ||
					expValEquals('platform_editor_ai_aifc', 'isEnabled', true);

				requestAnimationFrame(() => dispatchShouldHideDecorations(editorView, shouldHide));
			}, [editorView, hasFocus, isOpen, isForcedHidden, editorDisabled, showToolbar]);
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
