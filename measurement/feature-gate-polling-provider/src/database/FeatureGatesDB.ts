import {
	CLIENT_SDK_KEY_TIMESTAMP_INDEX,
	EXPERIMENT_VALUES_TIMESTAMP_INDEX,
	FEATURE_GATES_DB_NAME,
	INDEXEDDB_TIMEOUT,
	StoreName,
} from '../database/constants';

import {
	type ClientSdkKeyEntry,
	type ClientSdkKeyEntryWithoutKey,
	type ExperiemntValuesEntry as ExperimentValuesEntry,
	type RequestEvent,
} from './types';
import { commitTransaction, getClientSdkKeyDBKey, requestToPromise } from './utils';

// Expire after 7 days
export const EXPERIMENT_VALUES_EXPIRY_PERIOD = 1000 * 60 * 60 * 24 * 7;

// Expire after 1 day
export const CLIENT_SDK_KEY_EXPIRY_PERIOD = 1000 * 60 * 60 * 24 * 1;

export default class FeatureGatesDB {
	private db: Promise<IDBDatabase>;

	constructor() {
		if (!window.indexedDB) {
			throw new Error();
		}

		this.db = this.startDB();
	}

	private async startDB(): Promise<IDBDatabase> {
		return new Promise(async (resolve, reject) => {
			if (typeof window !== 'undefined') {
				const dbTimeout = window.setTimeout(() => {
					const message = 'IndexedDB timed out.';
					// eslint-disable-next-line no-console
					console.warn(message);
					reject(new Error(message));
				}, INDEXEDDB_TIMEOUT);

				/*
				 * The database version number can never change.
				 * An upgrade transaction is limited to only one connection to the database.
				 * Once this is done, we cannot open any connections with older versions of the schema.
				 * https://www.w3.org/TR/IndexedDB/#upgrade-transaction-construct
				 *
				 * Due to the nature of how Feature Gates client is used (multiple tabs that are very long lived),
				 * we will not be able to run version upgrades via indexeddb.
				 *
				 * This does not mean we cant change what is stored in the tables,
				 * this limitation just prevents us from:
				 *   - Creating new ObjectStores in this database connection, and
				 *   - Creating new indexes on our ObjectStores
				 *
				 * Any upgrades we wish to run in the future will have to create a new database,
				 * and migrate all the data from older databases.
				 *
				 * This also means any migrations we make will have to be supported until we have evidence
				 * that no events are coming from old versions of the database.
				 * This may take a long time.
				 */
				const request = window.indexedDB.open(FEATURE_GATES_DB_NAME, 1);
				request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
					if (event.oldVersion !== 0) {
						throw new Error('We cannot upgrade the database. Do not do this.');
					}
					const db: IDBDatabase = request.result;
					const clientSdkKeyStore = db.createObjectStore(StoreName.CLIENT_SDK_KEY_STORE_NAME, {
						keyPath: 'dbKey',
					});
					clientSdkKeyStore.createIndex(CLIENT_SDK_KEY_TIMESTAMP_INDEX, 'timestamp', {
						unique: false,
					});

					const experimentValuesStore = db.createObjectStore(
						StoreName.EXPERIMENT_VALUES_STORE_NAME,
						{
							keyPath: 'profileHash',
						},
					);
					experimentValuesStore.createIndex(EXPERIMENT_VALUES_TIMESTAMP_INDEX, 'timestamp', {
						unique: false,
					});
				};

				try {
					await requestToPromise(request);
					return resolve(request.result);
				} catch (error) {
					// eslint-disable-next-line no-console
					console.warn('IndexedDB failed to initialise.', error);
					reject(error);
				} finally {
					window.clearTimeout(dbTimeout);
				}
			} else {
				const message = "IndexedDB failed to initialise. No 'window' object.";
				// eslint-disable-next-line no-console
				console.warn(message);
				reject(new Error(message));
			}
		});
	}

	async setExperimentValues(entry: ExperimentValuesEntry): Promise<void> {
		this.setItem<ExperimentValuesEntry>(
			StoreName.CLIENT_SDK_KEY_STORE_NAME,
			entry.profileHash,
			entry,
		);
	}

	async getExperimentValues(profileHash: string): Promise<ExperimentValuesEntry | null> {
		return this.getItem<ExperimentValuesEntry>(StoreName.EXPERIMENT_VALUES_STORE_NAME, profileHash);
	}

	async setClientSdkKey(entry: ClientSdkKeyEntryWithoutKey): Promise<void> {
		const dbKey = getClientSdkKeyDBKey(entry);
		this.setItem<ClientSdkKeyEntry>(StoreName.CLIENT_SDK_KEY_STORE_NAME, dbKey, {
			...entry,
			dbKey,
		});
	}

	async getClientSdkKey(entry: {
		targetApp: string;
		environment: string;
		perimeter?: string;
	}): Promise<ClientSdkKeyEntry | null> {
		return this.getItem<ClientSdkKeyEntry>(
			StoreName.CLIENT_SDK_KEY_STORE_NAME,
			getClientSdkKeyDBKey(entry),
		);
	}

	async purgeStaleEntries(): Promise<void> {
		await Promise.all([this.purgeStaleExperimentValues(), this.purgeStaleClientSdkKeys()]);
	}

	private async purgeStaleExperimentValues(): Promise<void> {
		this.purgeOldEntries<ExperimentValuesEntry>(
			StoreName.EXPERIMENT_VALUES_STORE_NAME,
			EXPERIMENT_VALUES_TIMESTAMP_INDEX,
			EXPERIMENT_VALUES_EXPIRY_PERIOD,
			(entry) => entry.profileHash,
		);
	}

	private async purgeStaleClientSdkKeys(): Promise<void> {
		this.purgeOldEntries<ClientSdkKeyEntry>(
			StoreName.CLIENT_SDK_KEY_STORE_NAME,
			CLIENT_SDK_KEY_TIMESTAMP_INDEX,
			CLIENT_SDK_KEY_EXPIRY_PERIOD,
			(entry) => entry.targetApp,
		);
	}

	private async getObjectStoreAndTransaction(
		storeName: StoreName,
		mode: IDBTransactionMode,
	): Promise<{ transaction: IDBTransaction; objectStore: IDBObjectStore }> {
		const transaction = (await this.db).transaction(storeName, mode);
		const objectStore = transaction.objectStore(storeName);
		return {
			transaction,
			objectStore,
		};
	}

	private async deleteItem(
		objectStore: IDBObjectStore,
		id: IDBValidKey | IDBKeyRange,
	): Promise<void> {
		try {
			await requestToPromise(objectStore.delete(id));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error('Failed to delete item:', id, error);
			throw error;
		}
	}

	private async getItem<T>(storeName: StoreName, key: string | string[]): Promise<T | null> {
		try {
			const { transaction, objectStore } = await this.getObjectStoreAndTransaction(
				storeName,
				'readonly',
			);
			const request = objectStore.get(key);
			const event = (await requestToPromise(request)) as RequestEvent<T>;
			await commitTransaction(transaction);
			return event.target.result;
		} catch {
			// eslint-disable-next-line no-console
			console.warn(`Error when trying to get item in store ${storeName} for key ${key}`);
		}
		return null;
	}

	private async setItem<T>(storeName: StoreName, key: string, value: T): Promise<void> {
		try {
			const { transaction, objectStore } = await this.getObjectStoreAndTransaction(
				storeName,
				'readwrite',
			);
			const request = objectStore.put(value, key);
			await requestToPromise(request);
			await commitTransaction(transaction);
		} catch {
			// eslint-disable-next-line no-console
			console.warn(`Error when trying to set item in store ${storeName} with key ${key}`);
		}
	}

	private async purgeOldEntries<T>(
		storename: StoreName,
		timestampIndexKey: string,
		expiryPeriod: number,
		getKey: (entry: T) => string,
	): Promise<void> {
		const { transaction, objectStore } = await this.getObjectStoreAndTransaction(
			storename,
			'readwrite',
		);
		try {
			objectStore.getAll();
			const timeIndex = objectStore.index(timestampIndexKey);

			const upperBoundOpenKeyRange = IDBKeyRange.upperBound(
				Date.now() - EXPERIMENT_VALUES_EXPIRY_PERIOD,
			);
			const request = timeIndex.getAll(upperBoundOpenKeyRange);
			const event = (await requestToPromise(request)) as RequestEvent<T[]>;

			const deletePromises = event.target.result.map((entry: T) =>
				this.deleteItem(objectStore, getKey(entry)),
			);
			await commitTransaction(transaction);
			await Promise.all(deletePromises);
		} catch (error) {
			// eslint-disable-next-line no-console
			console.warn('Failed to delete items from indexeddb.', error);
			throw error;
		}
	}
}
