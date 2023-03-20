import { ReplaySubject } from 'rxjs/ReplaySubject';
import { MediaCollectionItem, MediaCollectionItemDetails } from '../..';
import { getFileStreamsCache } from '../../file-streams-cache';
import {
  CollectionFetcher,
  collectionCache,
} from '../../client/collection-fetcher';

const setup = (nextInclusiveStartKey: string | null = 'first-key') => {
  const firstItem: MediaCollectionItem = {
    id: '1',
    details: {
      artifacts: {},
      mediaType: 'image',
      mimeType: 'png',
      name: 'foo',
      processingStatus: 'pending',
      size: 1,
    },
    insertedAt: 1,
    occurrenceKey: '12',
  };
  const secondItem: MediaCollectionItem = {
    id: '2',
    details: {
      artifacts: {},
      mediaType: 'image',
      mimeType: 'png',
      name: 'bar',
      processingStatus: 'succeeded',
      size: 1,
    },
    insertedAt: 1,
    occurrenceKey: '123',
  };
  const newItem: MediaCollectionItem = {
    id: '0',
    details: {
      artifacts: {},
      mediaType: 'image',
      mimeType: 'png',
      name: 'bar',
      processingStatus: 'pending',
      size: 1,
    },
    insertedAt: 1,
    occurrenceKey: '1234',
  };
  const contents: MediaCollectionItem[] = [firstItem, secondItem];
  const getCollectionItems = jest.fn().mockResolvedValue({
    data: {
      contents,
      nextInclusiveStartKey,
    },
  });
  const removeCollectionFile = jest.fn().mockResolvedValue({});
  const mediaStore: any = {
    getCollectionItems,
    removeCollectionFile,
  };
  const collectionFetcher = new CollectionFetcher(mediaStore);

  return {
    collectionFetcher,
    getCollectionItems,
    removeCollectionFile,
    contents,
    newItem,
  };
};

describe('CollectionFetcher', () => {
  beforeEach(() => {
    getFileStreamsCache().removeAll();
    delete collectionCache.recents;
  });

  describe('removeFile()', () => {
    beforeEach(() => {
      collectionCache['some-collection-name'] = {
        items: [
          {
            id: 'some-id',
            insertedAt: 42,
            occurrenceKey: '',
            details: {} as MediaCollectionItemDetails,
          },
        ],
        subject: new ReplaySubject<MediaCollectionItem[]>(1),
        isLoadingNextPage: false,
      };
    });

    it('should call store.removeCollectionFile', async () => {
      const { collectionFetcher, removeCollectionFile } = setup();
      await collectionFetcher.removeFile(
        'some-id',
        'some-collection-name',
        'some-occurrence-key',
        {
          traceId: 'test-trace-id',
        },
      );

      expect(removeCollectionFile).toHaveBeenCalledWith(
        'some-id',
        'some-collection-name',
        'some-occurrence-key',
        {
          traceId: 'test-trace-id',
        },
      );
    });

    it("should NOT remove items from cache and cache collection if ID doesn't exist", async () => {
      const { collectionFetcher } = setup();

      const removeSpy = spyOn(getFileStreamsCache(), 'remove');
      await collectionFetcher.removeFile(
        'some-inexistent-id',
        'some-collection-name',
        'some-occurrence-key',
      );
      expect(collectionCache['some-collection-name'].items).toHaveLength(1);
      expect(removeSpy).not.toHaveBeenCalled();
    });

    it('should remove item from cache', async () => {
      const { collectionFetcher } = setup();

      const removeSpy = spyOn(getFileStreamsCache(), 'remove');
      await collectionFetcher.removeFile(
        'some-id',
        'some-collection-name',
        'some-occurrence-key',
      );
      expect(collectionCache['some-collection-name'].items).toHaveLength(0);
      expect(removeSpy).toHaveBeenCalledWith('some-id');
    });

    it('should propagate the change in cached observable', async () => {
      const { collectionFetcher } = setup();

      const updatedItems = await new Promise(async (resolve) => {
        collectionCache['some-collection-name'].subject.subscribe({
          next: (items) => {
            resolve(items);
          },
        });

        await collectionFetcher.removeFile(
          'some-id',
          'some-collection-name',
          'some-occurrence-key',
        );
      });
      expect(updatedItems).toEqual([]);
    });
  });
});
