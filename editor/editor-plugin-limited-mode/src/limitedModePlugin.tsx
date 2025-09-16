import React, { useRef, useEffect, useCallback } from 'react';

import { bind } from 'bind-event-listener';
import { useIntl } from 'react-intl-next';

import { usePluginStateEffect } from '@atlaskit/editor-common/use-plugin-state-effect';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import { Anchor } from '@atlaskit/primitives/compiled';
import { expVal } from '@atlaskit/tmp-editor-statsig/expVal';

import type { LimitedModePlugin } from './limitedModePluginType';
import { createPlugin, limitedModePluginKey } from './pm-plugins/main';
import messages from './pm-plugins/messages';

export const limitedModePlugin: LimitedModePlugin = ({ config: options = {}, api }) => {
	return {
		name: 'limitedMode',
		pmPlugins() {
			return [
				{
					name: 'limitedModePlugin',
					plugin: createPlugin,
				},
			];
		},
		getSharedState(editorState: EditorState | undefined) {
			if (editorState) {
				return {
					get enabled() {
						return (
							limitedModePluginKey.getState(editorState)?.documentSizeBreachesThreshold ?? false
						);
					},
					limitedModePluginKey,
				};
			}
			return { enabled: false, limitedModePluginKey };
		},
		usePluginHook: ({ editorView }) => {
			const hasEditorBeenFocusedRef = useRef(false);
			const hasShownFlagRef = useRef(false);

			const { formatMessage } = useIntl();

			// Reset hasEditorBeenFocusedRef so live-to-live page navigation refreshes the flag. We rely on the page's contentId for this.
			useEffect(() => {
				hasShownFlagRef.current = false;
				// eslint-disable-next-line react-hooks/exhaustive-deps
			}, [options.contentId]);

			const checkAndShowFlag = useCallback(
				(isLimitedModeEnabled: boolean) => {
					const learnMoreLink = expVal('cc_editor_limited_mode', 'learnMoreLink', '');

					if (isLimitedModeEnabled && hasEditorBeenFocusedRef.current && !hasShownFlagRef.current) {
						void options.showFlag?.({
							title: formatMessage(messages.limitedModeTitle),
							description: learnMoreLink
								? formatMessage(messages.limitedModeDescriptionWithLink, {
										learnMoreLink: (chunks: React.ReactNode[]) => (
											<Anchor target="_blank" href={learnMoreLink}>
												{chunks}
											</Anchor>
										),
									})
								: formatMessage(messages.limitedModeDescriptionWithoutLink),
							close: 'auto',
						});
						hasShownFlagRef.current = true;
					}
				},
				[formatMessage],
			);

			// Track if the editor has been focused. On focus, check if the flag should be shown.
			useEffect(() => {
				const handleFocus = () => {
					hasEditorBeenFocusedRef.current = true;
					// Get current state when focus happens
					const isLimitedModeEnabled =
						api?.limitedMode?.sharedState.currentState()?.enabled ?? false;

					checkAndShowFlag(isLimitedModeEnabled);
				};

				const unbind = bind(editorView.dom, {
					type: 'focus',
					listener: handleFocus,
				});

				return () => {
					unbind();
				};
			}, [editorView, checkAndShowFlag]);

			// On change of the limited mode enabled state, check if the flag should be shown.
			usePluginStateEffect(api, ['limitedMode'], ({ limitedModeState }) => {
				const isLimitedModeEnabled = limitedModeState?.enabled ?? false;
				checkAndShowFlag(isLimitedModeEnabled);
			});
		},
	};
};
