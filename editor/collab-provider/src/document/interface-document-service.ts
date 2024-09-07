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
		doc: any;
		version: number;
		metadata: any;
		reserveCursor?: boolean;
	}): void;
	onRestore(params: { doc: any; version: number; metadata: any }): void;
	onStepsAdded(data: { version: number; steps: any[] }): void;
	onStepRejectedError(): void;
	send(
		tr: Transaction | null,
		oldState: EditorState | null,
		newState: EditorState,
		sendAnalyticsEvent?: boolean,
	): void;
	sendStepsFromCurrentState(sendAnalyticsEvent?: boolean): void;
	throttledCatchupv2(): void;
	getCurrentState(): Promise<ResolvedEditorState>;
	getFinalAcknowledgedState(): Promise<ResolvedEditorState>;
	getUnconfirmedSteps(): readonly ProseMirrorStep[] | undefined;
	getCurrentPmVersion(): number;
	onErrorHandled: (error: InternalError) => void;
}
