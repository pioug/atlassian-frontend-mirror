import type { ResolvedEditorState, SyncUpErrorFunction } from '@atlaskit/editor-common/collab';
import type { Step as ProseMirrorStep } from '@atlaskit/editor-prosemirror/transform';
import type { EditorState, Transaction } from '@atlaskit/editor-prosemirror/state';

import type { InternalError } from '../errors/internal-errors';

// This interface is to make sure both DocumentService and NullDocumentService have same signatures
export interface DocumentServiceInterface {
	setup(params: {
		getState: () => EditorState;
		onSyncUpError?: SyncUpErrorFunction;
		clientId: number | string | undefined;
	}): this;
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
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onRestore(params: { doc: any; version: number; metadata: any }): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	onStepsAdded(data: { version: number; steps: any[] }): void;
	onStepRejectedError(): void;
	send(
		tr: Transaction | null,
		oldState: EditorState | null,
		newState: EditorState,
		sendAnalyticsEvent?: boolean,
	): void;
	sendStepsFromCurrentState(sendAnalyticsEvent?: boolean, forcePublish?: boolean): void;
	throttledCatchupv2(): void;
	getCurrentState(): Promise<ResolvedEditorState>;
	getFinalAcknowledgedState(): Promise<ResolvedEditorState>;
	getIsNamespaceLocked(): boolean;
	getUnconfirmedSteps(): readonly ProseMirrorStep[] | undefined;
	getCurrentPmVersion(): number;
	onErrorHandled: (error: InternalError) => void;
}
