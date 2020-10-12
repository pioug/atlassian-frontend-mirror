import DuplicateLimitedQueue, { QueueOptions } from './DuplicateLimitedQueue';
import debug from './logger';

/**
 * The options used to configure a newly constructed queue.
 */
export interface StoredQueueOptions extends QueueOptions {
  /**
   * The Storage that will be used to persist the queue contents.
   */
  storage: Storage;

  /**
   * An identifier to be prefixed on the keys used to store data.
   */
  storagePrefix: string;
}

/**
 * An extension to the DuplicateLimitedQueue that will initialise its contents from the
 * supplied Storage and will also update the storage for every new item enqueued.
 */
export default class StoredDuplicateLimitedQueue<
  T
> extends DuplicateLimitedQueue<T> {
  private static readonly storageKey = 'lastUsed';

  private storage: Storage;
  private prefixedStorageKey: string;

  constructor(options: StoredQueueOptions) {
    super(options);
    this.storage = options.storage;
    this.prefixedStorageKey = `${options.storagePrefix}.${StoredDuplicateLimitedQueue.storageKey}`;
    this.load();
  }

  /**
   * Enqueue the supplied item and also persist the new contents of the queue to storage.
   *
   * @param item the item to be enqueued
   */
  enqueue(item: T): void {
    super.enqueue(item);
    this.save();
  }

  /**
   * Exposed for storybook/testing purposes only. Clear the contents of the queue, and localStorage.
   */
  clear() {
    super.clear();
    this.storage.removeItem(this.prefixedStorageKey);
  }

  /**
   * Initialise the queue contents from the configured Storage. If there is no data found in
   * storage then the queue will have no items added. Likewise, a failure to read or parse stored
   * data will be swallowed and no items are added to the queue.
   */
  private load(): void {
    const itemsJson = this.storage.getItem(this.prefixedStorageKey);
    if (itemsJson) {
      try {
        const items: T[] = JSON.parse(itemsJson);
        this.bulkEnqueue(items);
      } catch (e) {
        debug(
          `Error parsing the queue stored as ${this.prefixedStorageKey} key from storage`,
          e,
        );
      }
    }
  }

  /**
   * Save the current items in the queue, overwriting any previously stored queue.
   * Any failure in saving will be silently ignored with the likely outcome that any previous
   * saved items will remain unchanged in storage.
   */
  private save(): void {
    const itemsJson = JSON.stringify(this.getItems());
    try {
      this.storage.setItem(this.prefixedStorageKey, itemsJson);
    } catch (e) {
      debug(`Error saving the queued items as ${this.prefixedStorageKey}`, e);
    }
  }
}
