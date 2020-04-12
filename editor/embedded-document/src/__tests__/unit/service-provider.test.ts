import fetchMock from 'fetch-mock/cjs/client';
import ServiceProvider from '../../provider/service-provider';
import {
  docId,
  providerUrl,
  validContent,
  validGetResponse,
  validBatchGetResponse,
  validPutResponse,
  updatedContent,
  objectId,
} from './_test-helpers';

describe('ServiceProvider', () => {
  let serviceProvider: ServiceProvider;

  beforeAll(() => {
    serviceProvider = new ServiceProvider({
      url: providerUrl,
    });
  });

  afterEach(() => {
    fetchMock.restore();
  });

  describe('getDocument', () => {
    beforeAll(() => {
      fetchMock.get(`begin:${providerUrl}`, (url: string) => {
        if (url === `${providerUrl}/document/${docId}/`) {
          return validGetResponse;
        }
        return 404;
      });
    });

    it('should return document from service if it exist', async () => {
      const response = await serviceProvider.getDocument(docId);
      expect(response).toEqual(validGetResponse);
    });

    it('should return null if document does not exist', async () => {
      const response = await serviceProvider.getDocument('does-not-exist');
      expect(response).toEqual(null);
    });
  });

  describe('getDocumentByObjectId', () => {
    beforeAll(() => {
      fetchMock.get(`begin:${providerUrl}`, (url: string) => {
        if (
          url ===
          `${providerUrl}/document?objectId=${encodeURIComponent(objectId)}`
        ) {
          return validBatchGetResponse;
        }
        return 404;
      });
    });
    it('should return document from service with objectId', async () => {
      const response = await serviceProvider.getDocumentByObjectId(objectId);
      expect(response).toEqual(validGetResponse);
    });

    it('should return null if document does not exist', async () => {
      const response = await serviceProvider.getDocumentByObjectId(
        'does-not-exist',
      );
      expect(response).toEqual(null);
    });
  });

  describe('updateDocument', () => {
    beforeAll(() => {
      fetchMock.put(`begin:${providerUrl}`, (url: string) => {
        if (url === `${providerUrl}/document/${docId}`) {
          return validPutResponse;
        }

        return 500;
      });
    });

    it('should return updated document from service', async () => {
      const response = await serviceProvider.updateDocument(
        docId,
        JSON.stringify(updatedContent),
        objectId,
      );

      expect(response).toEqual(validPutResponse);
    });

    it('should return null if document does not exist', async () => {
      const response = await serviceProvider.updateDocument(
        'does-not-exist',
        JSON.stringify(updatedContent),
        objectId,
      );

      expect(response).toEqual(null);
    });
  });

  describe('createDocument', () => {
    beforeAll(() => {
      fetchMock.post(`begin:${providerUrl}`, (url: string) => {
        if (url === `${providerUrl}/document`) {
          return validGetResponse;
        }

        return 500;
      });
    });

    it('should return new document from service', async () => {
      const response = await serviceProvider.createDocument(
        JSON.stringify(validContent),
        objectId,
      );

      expect(response).toEqual(validGetResponse);
    });
  });
});
