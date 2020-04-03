export interface Document {
  documentId: string;
  objectId: string;
  containerId?: string;
  createdBy: User;
  language?: string;
  title?: string;
  body: string;
}

export interface User {}

export interface BatchDocumentResponse {
  documentId: string;
  language: {
    [key: string]: {
      versions: Document[];
    };
  };
}
