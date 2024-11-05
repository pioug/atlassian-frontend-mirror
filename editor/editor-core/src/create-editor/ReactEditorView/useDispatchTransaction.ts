import { useCallback, useEffect, useRef } from 'react';

import type { AnalyticsEventPayload, SimplifiedNode } from '@atlaskit/editor-common/analytics';
import {
	ACTION,
	ACTION_SUBJECT,
	EVENT_TYPE,
	getAnalyticsEventsFromTransaction,
} from '@atlaskit/editor-common/analytics';
import { getDocStructure } from '@atlaskit/editor-common/core-utils';
import { startMeasure, stopMeasure } from '@atlaskit/editor-common/performance-measures';
import type { Node as PMNode } from '@atlaskit/editor-prosemirror/model';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';

import type { EditorViewStateUpdatedCallbackProps } from '../../types/editor-config';
import type { EditorOnChangeHandler } from '../../types/editor-onchange';
import { findChangedNodesFromTransaction } from '../../utils/findChangedNodesFromTransaction';
import { freezeUnsafeTransactionProperties } from '../../utils/performance/safer-transactions';
import { EVENT_NAME_ON_CHANGE } from '../../utils/performance/track-transactions';
import { validateNodes, validNode } from '../../utils/validateNodes';

type DispatchTransaction = (
	view: EditorView | undefined,
	tr: Transaction,
) => EditorState | undefined;

export const useDispatchTransaction = ({
	onChange,
	dispatchAnalyticsEvent,
	onEditorViewUpdated,
}: {
	onChange: EditorOnChangeHandler | undefined;
	dispatchAnalyticsEvent: (payload: AnalyticsEventPayload) => void;
	onEditorViewUpdated: (params: EditorViewStateUpdatedCallbackProps) => void;
}): DispatchTransaction => {
	// We need to have a ref to the latest `onChange` since the `dispatchTransaction` gets captured
	const onChangeRef = useRef(onChange);
	useEffect(() => {
		onChangeRef.current = onChange;
	}, [onChange]);

	const dispatchTransaction = useCallback(
		(view: EditorView | undefined, unsafeTransaction: Transaction) => {
			if (!view) {
				return;
			}

			const nodes: PMNode[] = findChangedNodesFromTransaction(unsafeTransaction);
			const changedNodesValid = validateNodes(nodes);
			const transaction = new Proxy(
				unsafeTransaction,
				freezeUnsafeTransactionProperties<Transaction>({
					dispatchAnalyticsEvent: dispatchAnalyticsEvent,
					pluginKey: 'unknown-reacteditorview',
				}),
			);

			if (changedNodesValid) {
				const oldEditorState = view.state;

				// go ahead and update the state now we know the transaction is good
				const { state: newEditorState, transactions } = view.state.applyTransaction(transaction);
				if (newEditorState === oldEditorState) {
					return;
				}

				view.updateState(newEditorState);

				onEditorViewUpdated({
					originalTransaction: transaction,
					transactions,
					oldEditorState,
					newEditorState,
				});

				if (onChangeRef.current && transaction.docChanged) {
					const source = transaction.getMeta('isRemote') ? 'remote' : 'local';

					startMeasure(EVENT_NAME_ON_CHANGE);
					onChangeRef.current(view, { source });
					stopMeasure(EVENT_NAME_ON_CHANGE, (duration: number, startTime: number) => {
						dispatchAnalyticsEvent({
							action: ACTION.ON_CHANGE_CALLBACK,
							actionSubject: ACTION_SUBJECT.EDITOR,
							eventType: EVENT_TYPE.OPERATIONAL,
							attributes: {
								duration,
								startTime,
							},
						});
					});
				}
				return newEditorState;
			} else {
				const invalidNodes = nodes
					.filter((node) => !validNode(node))
					.map<SimplifiedNode | string>((node) => getDocStructure(node, { compact: true }));

				dispatchAnalyticsEvent({
					action: ACTION.DISPATCHED_INVALID_TRANSACTION,
					actionSubject: ACTION_SUBJECT.EDITOR,
					eventType: EVENT_TYPE.OPERATIONAL,
					attributes: {
						analyticsEventPayloads: getAnalyticsEventsFromTransaction(transaction),
						invalidNodes,
					},
				});
			}
		},
		[dispatchAnalyticsEvent, onEditorViewUpdated],
	);

	return dispatchTransaction;
};
