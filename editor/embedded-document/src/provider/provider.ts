import { Document } from '../model';

export interface Provider {
  getDocument(documentId: string, language?: string): Promise<Document | null>;
  getDocumentByObjectId(
    objectId: string,
    language?: string,
  ): Promise<Document | null>;
  updateDocument(
    documentId: string,
    body: string,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null>;
  createDocument(
    body: string,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null>;
}
