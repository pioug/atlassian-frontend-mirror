import { utils, ServiceConfig } from '@atlaskit/util-service-support';
import { Provider } from './provider';
import { Document, BatchDocumentResponse } from '../model';

export interface Config extends ServiceConfig {}

function queryBuilder(data: { [k: string]: string }): string {
  return Object.keys(data)
    .map((key) => {
      return [key, data[key]].map(encodeURIComponent).join('=');
    })
    .join('&');
}

export default class ServiceProvider implements Provider {
  private config: Config;

  constructor(config: Config) {
    this.config = config;
  }

  async getDocument(
    documentId: string,
    language?: string,
  ): Promise<Document | null> {
    try {
      const document = await utils.requestService<Document>(this.config, {
        path: `document/${documentId}/${language || ''}`,
      });
      return document;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to get document: ${JSON.stringify(err)}`);
      return null;
    }
  }

  async getDocumentByObjectId(
    objectId: string,
    language?: string,
  ): Promise<Document | null> {
    try {
      const queryString = queryBuilder({
        objectId,
        ...(language ? { language } : {}),
      });

      const documents = await utils.requestService<
        Array<BatchDocumentResponse>
      >(this.config, {
        path: `document?${queryString}`,
      });
      if (documents && documents.length) {
        return documents[0].language[language || 'default'].versions[0];
      }
      return null;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to get document: ${JSON.stringify(err)}`);
      return null;
    }
  }

  async updateDocument(
    documentId: string,
    body: string,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null> {
    try {
      const document = await utils.requestService<Document>(this.config, {
        path: `document/${documentId}`,
        requestInit: {
          headers: { 'Content-Type': 'application/json' },
          method: 'PUT',
          body: JSON.stringify({
            body,
            objectId,
            title,
            language,
          }),
        },
      });
      return document;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to update document: ${JSON.stringify(err)}`);
      return null;
    }
  }

  async createDocument(
    body: string,
    objectId: string,
    title?: string,
    language?: string,
  ): Promise<Document | null> {
    try {
      const document = await utils.requestService<Document>(this.config, {
        path: `document`,
        requestInit: {
          headers: { 'Content-Type': 'application/json' },
          method: 'POST',
          body: JSON.stringify({
            body,
            objectId,
            title,
            language,
          }),
        },
      });
      return document;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.warn(`Failed to update document: ${JSON.stringify(err)}`);
      return null;
    }
  }
}
