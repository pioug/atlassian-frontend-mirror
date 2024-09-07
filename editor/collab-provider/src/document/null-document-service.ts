import type { ResolvedEditorState } from '@atlaskit/editor-common/collab';

import type { DocumentServiceInterface } from './interface-document-service';

// A Null object for the actual DocumentService class only for the experiment teammate presence  (ATLAS-53155)
export class NullDocumentService implements DocumentServiceInterface {
	setup = () => {
		return this;
	};

	updateDocument() {}

	onRestore() {}

	onStepsAdded() {}

	onStepRejectedError() {}

	send() {}

	sendStepsFromCurrentState() {}

	throttledCatchupv2() {}

	getCurrentState() {
		return Promise.resolve({} as ResolvedEditorState);
	}

	getFinalAcknowledgedState() {
		return Promise.resolve({} as ResolvedEditorState);
	}

	getUnconfirmedSteps() {
		return undefined;
	}

	getCurrentPmVersion() {
		return -1;
	}

	onErrorHandled = () => {};
}
