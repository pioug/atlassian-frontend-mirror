export interface Document {
	body: string;
	containerId?: string;
	createdBy: User;
	documentId: string;
	language?: string;
	objectId: string;
	title?: string;
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
