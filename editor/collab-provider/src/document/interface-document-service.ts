import type { ResolvedEditorState, SyncUpErrorFunction } from '@atlaskit/editor-common/collab';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { InternalError } from '../errors/internal-errors';
import type { GetResolvedEditorStateReason } from '@atlaskit/editor-common/types';

// This interface is to make sure both DocumentService and NullDocumentService have same signatures
export interface DocumentServiceInterface {
	getCurrentPmVersion: () => number;
	getCurrentState: () => Promise<ResolvedEditorState>;
	getFinalAcknowledgedState: (reason: GetResolvedEditorStateReason) => Promise<ResolvedEditorState>;
	getIsNamespaceLocked: () => boolean;
	getUnconfirmedSteps: () => readonly ProseMirrorStep[] | undefined;
	onErrorHandled: (error: InternalError) => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onRestore: (params: { doc: any; metadata: any; version: number }) => void;
	onStepRejectedError: () => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onStepsAdded: (data: { steps: any[]; version: number }) => void;
	send: (
		tr: Transaction | null,
		oldState: EditorState | null,
		newState: EditorState,
		sendAnalyticsEvent?: boolean,
	) => void;
	sendStepsFromCurrentState: (
		sendAnalyticsEvent?: boolean,
		reason?: GetResolvedEditorStateReason,
	) => void;
	setup: (params: {
		clientId: number | string | undefined;
		getState: () => EditorState;
		onSyncUpError?: SyncUpErrorFunction;
	}) => this;
	throttledCatchupv2: () => void;
	updateDocument: (params: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		doc: any;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		metadata: any;
		reserveCursor?: boolean;
		version: number;
	}) => void;
}
