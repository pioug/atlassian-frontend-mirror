import React, { PureComponent } from 'react';
import { type Actions } from '../context/context';
import { Consumer } from '../consumers/consumer';
import { type Document as DocumentModel } from '../model';

export interface Props {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	render(actions: DocumentActions): React.ReactNode;
}

export interface DocumentActions {
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	createDocument(value: any): Promise<DocumentModel>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	editDocument(): void;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	cancelEdit(): void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/method-signature-style -- method-signature-style ignored via go/ees013 (to be fixed)
	updateDocument(value: any): Promise<DocumentModel>;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class WithDocumentActions extends PureComponent<Props> {
	private actionsMapper = (actions: Actions): DocumentActions => ({
		// Ignored via go/ees005
		// eslint-disable-next-line require-await, @typescript-eslint/no-explicit-any
		async createDocument(value: any) {
			return actions.createDocument(value);
		},

		// Ignored via go/ees005
		// eslint-disable-next-line require-await
		async editDocument() {
			actions.setDocumentMode('edit');
		},

		// Ignored via go/ees005
		// eslint-disable-next-line require-await, @typescript-eslint/no-explicit-any
		async updateDocument(value: any) {
			return actions.updateDocument(value);
		},

		// Ignored via go/ees005
		// eslint-disable-next-line require-await
		async cancelEdit() {
			actions.setDocumentMode('view');
		},
	});

	render() {
		return <Consumer actionsMapper={this.actionsMapper}>{this.props.render}</Consumer>;
	}
}
