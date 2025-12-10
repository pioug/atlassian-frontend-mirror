import React, { PureComponent } from 'react';
import { type Actions } from '../context/context';
import { Consumer } from '../consumers/consumer';
import { type Document as DocumentModel } from '../model';

export interface Props {
	render: (actions: DocumentActions) => React.ReactNode;
}

export interface DocumentActions {
	cancelEdit: () => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	createDocument: (value: any) => Promise<DocumentModel>;
	editDocument: () => void;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	updateDocument: (value: any) => Promise<DocumentModel>;
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

	render(): React.JSX.Element {
		return <Consumer actionsMapper={this.actionsMapper}>{this.props.render}</Consumer>;
	}
}
