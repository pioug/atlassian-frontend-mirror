import { Provider, Document } from '../../src';

const demoDoc: Document = {
  documentId: 'demo-doc',
  objectId: 'ari:cloud:demo::document/1',
  createdBy: {},
  body: JSON.stringify({
    type: 'doc',
    version: 1,
    content: [
      {
        type: 'heading',
        attrs: {
          level: 1,
        },
        content: [
          {
            type: 'text',
            text: 'Hello there!',
          },
        ],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This is an Embedded Document!',
          },
        ],
      },
    ],
  }),
};

export default class MockServiceProvider implements Provider {
  private documents: Map<string, Document> = new Map();
  constructor() {
    this.documents.set('demo-doc', demoDoc);
  }

  async getDocument(documentId: string): Promise<Document | null> {
    const document = this.documents.get(documentId);
    if (!document) {
      return null;
    }

    return document;
  }

  async getDocumentByObjectId(objectId: string): Promise<Document | null> {
    const document = this.documents.get(objectId);
    if (!document) {
      return null;
    }

    return document;
  }

  async updateDocument(
    documentId: string,
    body: any,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null> {
    const document: Document = {
      documentId,
      body,
      objectId,
      createdBy: {},
      title,
      language,
    };

    this.documents.set(documentId, document);
    return document;
  }

  async createDocument(
    body: any,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null> {
    const documentId = new Date().getTime().toString();
    const document: Document = {
      documentId,
      body,
      objectId,
      createdBy: {},
      title,
      language,
    };

    this.documents.set(documentId, document);
    return document;
  }
}
