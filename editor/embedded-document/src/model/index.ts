export interface Document {
	documentId: string;
	objectId: string;
	containerId?: string;
	createdBy: User;
	language?: string;
	title?: string;
	body: string;
}

export type User = Object;

export interface BatchDocumentResponse {
	documentId: string;
	language: {
		[key: string]: {
			versions: Document[];
		};
	};
}
