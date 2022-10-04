import { mockWindowStorage } from '../local-storage';

type ExceptionHandlers = {
  captureException?: (e: Error, tags?: Record<string, string>) => void;
};

type StoredItem = {
  value: any;
  expires?: number;
};

export type GetStoredItemOptions = {
  useExpiredItem?: boolean;
};

const DEFAULT_STORAGE_ENGINE = 'localStorage';

export default class StorageClient {
  private readonly client: Storage;
  private readonly clientKey: string;
  private readonly handlers: ExceptionHandlers | undefined;

  constructor(
    clientKey: string,
    options?: {
      handlers?: ExceptionHandlers;
      storageEngine?: 'localStorage' | 'sessionStorage';
    },
  ) {
    this.clientKey = clientKey;
    this.handlers = options?.handlers;

    const storageEngine = options?.storageEngine || DEFAULT_STORAGE_ENGINE;
    if (!Object.prototype.hasOwnProperty.call(window, storageEngine)) {
      mockWindowStorage([storageEngine]);
    }

    this.client = window[storageEngine];
  }

  private captureException(e: Error, tags?: Record<string, string>) {
    if (this.handlers?.captureException) {
      this.handlers?.captureException(e, tags);
    }
  }

  private itemKey(key: string) {
    return `${this.clientKey}_${key}`;
  }

  getItem = (
    key: string,
    { useExpiredItem }: GetStoredItemOptions = {
      useExpiredItem: false,
    },
  ) => {
    const item = this.client.getItem(this.itemKey(key));

    if (item) {
      try {
        const parsedItem: StoredItem = JSON.parse(item);

        // item is expired
        if (parsedItem.expires && new Date(parsedItem.expires) < new Date()) {
          /**
           * Commented out removing this item, as it is a slightly different state
           * to the item not existing that we may want to preserve.
           *  this.client.removeItem(this.itemKey(key));
           */

          if (!useExpiredItem) {
            return undefined;
          }
        }
        return parsedItem.value;
      } catch (e) {
        this.captureException(e as Error);
      }
    }
    return undefined;
  };

  removeItem = (key: string) => {
    try {
      this.client.removeItem(this.itemKey(key));
    } catch (e) {
      this.captureException(e as Error);
    }
  };

  setItemWithExpiry = (key: string, value: any, expireInMS?: number) => {
    const itemWithExpiry: StoredItem = {
      value,
      expires:
        typeof expireInMS === 'number' ? Date.now() + expireInMS : undefined,
    };
    try {
      this.client.setItem(this.itemKey(key), JSON.stringify(itemWithExpiry));
    } catch (e) {
      this.captureException(e as Error);
    }
  };
}
