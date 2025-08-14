import { type Document } from '../model';

export interface Provider {
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getDocument(documentId: string, language?: string): Promise<Document | null>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	getDocumentByObjectId(objectId: string, language?: string): Promise<Document | null>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	updateDocument(
		documentId: string,
		body: string,
		objectId: string,
		title?: string,
		language?: string,
	): Promise<Document | null>;
	// eslint-disable-next-line @typescript-eslint/method-signature-style -- ignored via go/ees013 (to be fixed)
	createDocument(
		body: string,
		objectId: string,
		title?: string,
		language?: string,
	): Promise<Document | null>;
}
