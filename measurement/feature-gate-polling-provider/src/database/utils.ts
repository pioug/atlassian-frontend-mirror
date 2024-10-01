import { type TransactionsWithCommit } from './types';

// Not to be used on cursors or other requests that may call onsuccess multiple times.
export const requestToPromise = (request: IDBRequest): Promise<Event> => {
	return new Promise((resolve, reject) => {
		request.onsuccess = (event) => {
			resolve(event);
		};

		request.onerror = (event) => {
			reject(event);
		};
	});
};

const transactionToPromise = (transaction: IDBTransaction): Promise<void> => {
	return new Promise((resolve, reject) => {
		// We will have to see how much cost there is to waiting for the transaction to complete in the real world.
		// In theory in some cases we could return as soon as the request is complete and
		// just monitor errors on transactions with the logger.

		// This maybe more of an issue in Safari and other older browsers where commit isnt available
		// and we would have to wait for the transaction to complete itself.
		transaction.oncomplete = () => {
			resolve();
		};

		transaction.onerror = (event) => {
			reject(event);
		};

		transaction.onabort = (event) => {
			reject(event);
		};
	});
};

// Not available on older browsers https://developer.mozilla.org/en-US/docs/Web/API/IDBTransaction/commit
export const commitTransaction = (transaction: TransactionsWithCommit): Promise<void> => {
	try {
		if (typeof transaction.commit === 'function') {
			transaction.commit();
		}
	} catch (error) {
		// eslint-disable-next-line no-console
		console.error('Failed to force commit transaction:', error);
		throw error;
	}
	return transactionToPromise(transaction);
};
