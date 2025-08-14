import type { ResolvedEditorState, SyncUpErrorFunction } from '@atlaskit/editor-common/collab';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { InternalError } from '../errors/internal-errors';
import type { GetResolvedEditorStateReason } from '@atlaskit/editor-common/types';

// This interface is to make sure both DocumentService and NullDocumentService have same signatures
export interface DocumentServiceInterface {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	setup(params: {
		getState: () => EditorState;
		onSyncUpError?: SyncUpErrorFunction;
		clientId: number | string | undefined;
	}): this;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	updateDocument(params: {
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		doc: any;
		version: number;
		// Ignored via go/ees005
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		metadata: any;
		reserveCursor?: boolean;
	}): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	onRestore(params: { doc: any; version: number; metadata: any }): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	onStepsAdded(data: { version: number; steps: any[] }): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	onStepRejectedError(): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	send(
		tr: Transaction | null,
		oldState: EditorState | null,
		newState: EditorState,
		sendAnalyticsEvent?: boolean,
	): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	sendStepsFromCurrentState(
		sendAnalyticsEvent?: boolean,
		reason?: GetResolvedEditorStateReason,
	): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	throttledCatchupv2(): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getCurrentState(): Promise<ResolvedEditorState>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getFinalAcknowledgedState(reason: GetResolvedEditorStateReason): Promise<ResolvedEditorState>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getIsNamespaceLocked(): boolean;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getUnconfirmedSteps(): readonly ProseMirrorStep[] | undefined;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getCurrentPmVersion(): number;
	onErrorHandled: (error: InternalError) => void;
}
