import { isDirtyTransaction } from '@atlaskit/editor-common/collab';
import { SafePlugin } from '@atlaskit/editor-common/safe-plugin';
import { AGENT_ATTRIBUTION_META } from '@atlaskit/editor-common/transaction-agent-attribution';
import { PluginKey } from '@atlaskit/editor-prosemirror/state';
import type { ReadonlyTransaction } from '@atlaskit/editor-prosemirror/state';
import { AddMarkStep, RemoveMarkStep } from '@atlaskit/editor-prosemirror/transform';
import type { Step } from '@atlaskit/editor-prosemirror/transform-override';
import { fg } from '@atlaskit/platform-feature-flags/fg';

import type { LastOrganicChangeMetadata } from '../types';
import { isOrganicChange } from './utils';

export const trackLastOrganicChangePluginKey: PluginKey<LastOrganicChangeMetadata> =
	new PluginKey<LastOrganicChangeMetadata>('collabTrackLastOrganicChangePlugin');

export const createPlugin = (): SafePlugin<LastOrganicChangeMetadata> => {
	return new SafePlugin<LastOrganicChangeMetadata>({
		key: trackLastOrganicChangePluginKey,
		state: {
			init() {
				return {
					...(fg('confluence_ncs_step_diffing_version_history') && {
						localHumanBodyChangeCount: 0,
					}),
					lastLocalOrganicChangeAt: null,
					lastRemoteOrganicChangeAt: null,
					lastLocalOrganicBodyChangeAt: null,
					lastRemoteOrganicBodyChangeAt: null,
				};
			},
			apply(transaction: ReadonlyTransaction, prevPluginState: LastOrganicChangeMetadata) {
				if (Boolean(transaction.getMeta('appendedTransaction'))) {
					return prevPluginState;
				}

				const isRemote = Boolean(transaction.getMeta('isRemote'));
				const isDocumentReplaceFromRemote =
					isRemote && Boolean(transaction.getMeta('replaceDocument'));

				// Inline comment annotations are not considered as edits to the document body
				const isAnnotationStep = !!transaction.steps.find(
					(step: Step) =>
						(step instanceof AddMarkStep || step instanceof RemoveMarkStep) &&
						step.mark?.type?.name === 'annotation',
				);

				if (isDocumentReplaceFromRemote) {
					return prevPluginState;
				}

				if (isDirtyTransaction(transaction)) {
					return prevPluginState;
				}

				if (isOrganicChange(transaction)) {
					if (isRemote) {
						return {
							...(fg('confluence_ncs_step_diffing_version_history') && {
								localHumanBodyChangeCount: prevPluginState.localHumanBodyChangeCount,
							}),
							lastLocalOrganicChangeAt: prevPluginState.lastLocalOrganicChangeAt,
							lastRemoteOrganicChangeAt: Date.now(),
							lastLocalOrganicBodyChangeAt: prevPluginState.lastLocalOrganicBodyChangeAt,
							lastRemoteOrganicBodyChangeAt: isAnnotationStep
								? prevPluginState.lastRemoteOrganicBodyChangeAt
								: Date.now(),
						};
					}
					// Agent transactions can be local (frontend streaming) or remote (NCS).
					// Keep organic-change tracking intact for saving, but track human attribution separately.
					const isAgentChange =
						fg('confluence_ncs_step_diffing_version_history') &&
						Boolean(transaction.getMeta(AGENT_ATTRIBUTION_META));
					return {
						...(fg('confluence_ncs_step_diffing_version_history') && {
							localHumanBodyChangeCount:
								(prevPluginState.localHumanBodyChangeCount ?? 0) +
								(isAnnotationStep || isAgentChange ? 0 : 1),
						}),
						lastLocalOrganicChangeAt: Date.now(),
						lastRemoteOrganicChangeAt: prevPluginState.lastRemoteOrganicChangeAt,
						lastLocalOrganicBodyChangeAt: isAnnotationStep
							? prevPluginState.lastLocalOrganicBodyChangeAt
							: Date.now(),
						lastRemoteOrganicBodyChangeAt: prevPluginState.lastRemoteOrganicBodyChangeAt,
					};
				}

				return prevPluginState;
			},
		},
	});
};
