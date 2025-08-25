import { createContext } from 'react';
import { type Document } from '../model';

export interface ContextType {
	actions: Actions;
	// Ignored via go/ees005
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	renderProps: any;
	value: State;
}

export interface State {
	doc?: Document;
	hasError?: boolean;
	isLoading?: boolean;
	mode?: Mode;
}

export type Mode = 'view' | 'edit' | 'create';

export interface Actions {
	createDocument: (body: string, title?: string, language?: string) => Promise<Document>;
	getDocument: (documentId: string, language?: string) => void;
	getDocumentByObjectId: (objectId: string, language?: string) => void;
	setDocumentMode: (mode: Mode) => void;
	updateDocument: (body: string, title?: string, language?: string) => Promise<Document>;
}

const noop = () => {};

export const Context = createContext<ContextType>({
	value: {},
	actions: {
		getDocument: noop,
		getDocumentByObjectId: noop,
		setDocumentMode: noop,
		// Ignored via go/ees005
		// eslint-disable-next-line require-await
		updateDocument: async () => {
			throw new Error('Not implemented.');
		},
		// Ignored via go/ees005
		// eslint-disable-next-line require-await
		createDocument: async () => {
			throw new Error('Not implemented.');
		},
	},
	renderProps: {},
});
