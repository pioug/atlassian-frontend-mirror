import type { ResolvedEditorState } from '@atlaskit/editor-common/collab';

import type { DocumentServiceInterface } from './interface-document-service';
import type { GetResolvedEditorStateReason } from '@atlaskit/editor-common/types';

// A Null object for the actual DocumentService class only for the experiment teammate presence  (ATLAS-53155)
export class NullDocumentService implements DocumentServiceInterface {
	setup = () => {
		return this;
	};

	updateDocument(): void {}

	onRestore(): void {}

	onStepsAdded(): void {}

	onStepRejectedError(): void {}

	send(): void {}

	sendStepsFromCurrentState(): void {}

	throttledCatchupv2(): void {}

	getCurrentState() {
		return Promise.resolve({} as ResolvedEditorState);
	}

	getFinalAcknowledgedState(reason: GetResolvedEditorStateReason) {
		return Promise.resolve({} as ResolvedEditorState);
	}

	getIsNamespaceLocked() {
		return false;
	}

	getUnconfirmedSteps() {
		return undefined;
	}

	getUnconfirmedStepsOrigins() {
		return undefined;
	}

	getCurrentPmVersion() {
		return -1;
	}

	onErrorHandled = (): void => {};
}
