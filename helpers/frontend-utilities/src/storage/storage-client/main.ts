import { mockWindowStorage } from '../local-storage';

type ExceptionHandlers = {
	captureException?: (e: Error, tags?: Record<string, string>) => void;
};

type StoredItem = {
	expires?: number;
	value: any;
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

		if (
			typeof window === 'undefined' ||
			!Object.prototype.hasOwnProperty.call(window, storageEngine)
		) {
			mockWindowStorage([storageEngine]);
		}

		// Get window reference after mockWindowStorage has potentially created it
		const windowRef = typeof window !== 'undefined' ? window : global.window;
		this.client = windowRef[storageEngine] as Storage;
	}

	private captureException(e: Error, tags?: Record<string, string>) {
		if (this.handlers?.captureException) {
			this.handlers.captureException(e, tags);
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
	): any => {
		const item = this.client.getItem(this.itemKey(key));
		if (item) {
			try {
				const parsedItem: StoredItem = JSON.parse(item);
				if (parsedItem.expires && new Date(parsedItem.expires) < new Date()) {
					if (!useExpiredItem) {
						return undefined;
					}
				}
				return parsedItem.value;
			} catch (e) {
				this.captureException(e as Error);
				return undefined; // Return undefined on parsing error
			}
		}
		return undefined;
	};

	removeItem = (key: string): void => {
		try {
			this.client.removeItem(this.itemKey(key));
		} catch (e) {
			this.captureException(e as Error);
		}
	};

	setItemWithExpiry = (key: string, value: any, expireInMS?: number): void => {
		const itemWithExpiry: StoredItem = {
			value,
			expires: typeof expireInMS === 'number' ? Date.now() + expireInMS : undefined,
		};
		try {
			this.client.setItem(this.itemKey(key), JSON.stringify(itemWithExpiry));
		} catch (e) {
			this.captureException(e as Error);
		}
	};
}
