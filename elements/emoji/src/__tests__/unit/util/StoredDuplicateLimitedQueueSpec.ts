import * as sinon from 'sinon';

import StoredDuplicateLimitedQueue, {
  StoredQueueOptions,
} from '../../../util/StoredDuplicateLimitedQueue';

describe('StoredDuplicateLimitedQueue', () => {
  const storagePrefix = 'monkey.trousers';
  let mockStorage: Storage;
  let mockGetItem: sinon.SinonStub;
  let mockSetItem: sinon.SinonStub;
  let mockRemoveItem: sinon.SinonSpy;
  let queueOptions: StoredQueueOptions;

  beforeEach(() => {
    mockGetItem = sinon.stub();
    mockSetItem = sinon.stub();
    mockRemoveItem = sinon.spy();
    mockStorage = <Storage>{};
    mockStorage.getItem = mockGetItem;
    mockStorage.setItem = mockSetItem;
    mockStorage.removeItem = mockRemoveItem;

    queueOptions = {
      maxDuplicates: 4,
      minUniqueItems: 3,
      storage: mockStorage,
      storagePrefix: storagePrefix,
    };
  });

  describe('initialising empty', () => {
    it('should construct an empty queue when no data found in storage', () => {
      mockGetItem.returns(null);
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
      expect(mockGetItem.calledWith(`${storagePrefix}.lastUsed`));
      expect(queue.getItemsOrderedByDuplicateCount()).toHaveLength(0);
    });

    it('should construct an empty queue when empty array found in storage', () => {
      mockGetItem.returns(JSON.stringify([]));
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
      expect(mockGetItem.calledWith(`${storagePrefix}.lastUsed`));
      expect(queue.getItemsOrderedByDuplicateCount()).toHaveLength(0);
    });

    it('should construct an empty queue when wrong type of data found in storage', () => {
      const wrongData = new Map();
      wrongData.set(5, 10);
      mockGetItem.returns(JSON.stringify(wrongData));
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
      expect(mockGetItem.calledWith(`${storagePrefix}.lastUsed`));
      expect(queue.getItemsOrderedByDuplicateCount()).toHaveLength(0);
    });

    it('should construct an empty queue when unparsable data found in storage', () => {
      mockGetItem.returns(' a "b:" ] c []');
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
      expect(mockGetItem.calledWith(`${storagePrefix}.lastUsed`));
      expect(queue.getItemsOrderedByDuplicateCount()).toHaveLength(0);
    });
  });

  describe('loading initial data', () => {
    it('should load and reorder data', () => {
      const list = ['d', 'a', 'd', 'b', 'c', 'b', 'd', 'b', 'b', 'a'];
      mockGetItem.returns(JSON.stringify(list));
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
      const orderedList = queue.getItemsOrderedByDuplicateCount();
      expect(orderedList).toHaveLength(4);
      expect(orderedList[0]).toEqual('b');
      expect(orderedList[1]).toEqual('d');
      expect(orderedList[2]).toEqual('a');
      expect(orderedList[3]).toEqual('c');
    });

    it('should load, reorder and discard excess data', () => {
      // our test queue is 12 long
      const list = [
        'Z',
        'Y',
        'X',
        'W',
        'V',
        'U',
        'T',
        'S',
        'R',
        'Q',
        'P',
        'O',
        'N',
        'M',
        'L',
      ];
      mockGetItem.returns(JSON.stringify(list));
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
      const orderedList = queue.getItemsOrderedByDuplicateCount();
      expect(orderedList).toHaveLength(12);
      expect(orderedList.sort()).toEqual([
        'L',
        'M',
        'N',
        'O',
        'P',
        'Q',
        'R',
        'S',
        'T',
        'U',
        'V',
        'W',
      ]);
    });
  });

  describe('storage write', () => {
    it('should update storage for enqueue', () => {
      const list = ['a', 'b'];
      mockGetItem.returns(JSON.stringify(list));
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);

      queue.enqueue('c');
      expect(mockSetItem.callCount).toEqual(1);
      expect(mockSetItem.getCall(0).args[0]).toEqual(
        `${storagePrefix}.lastUsed`,
      );
      expect(mockSetItem.getCall(0).args[1]).toEqual(
        JSON.stringify(['a', 'b', 'c']),
      );
    });

    it('should fail silently when storage write fails', () => {
      const list = ['a', 'b'];
      mockGetItem.returns(JSON.stringify(list));
      const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
      mockSetItem.throws(new Error('storage error'));

      queue.enqueue('c');
      expect(queue.getItemsOrderedByDuplicateCount()).toHaveLength(3);
      expect(queue.getItemsOrderedByDuplicateCount().sort()).toEqual([
        'a',
        'b',
        'c',
      ]);
    });
  });

  it('should clear local storage and the queue', () => {
    const list = ['a', 'b'];
    mockGetItem.returns(JSON.stringify(list));
    const queue = new StoredDuplicateLimitedQueue<string>(queueOptions);
    expect(queue.getItemsOrderedByDuplicateCount()).toHaveLength(2);

    queue.clear();
    expect(queue.getItemsOrderedByDuplicateCount()).toHaveLength(0);
    expect(mockRemoveItem.calledOnce).toEqual(true);
  });
});
