import { useLocalStorage } from './useLocalStorage';

export function useLocalStorageRecord<T>(
	key: string,
	initialValue: T[] = [],
	maxLength = 100,
): {
	actions: {
		putRecord: (record: T) => void;
		removeRecord: (query: string) => void;
	};
	records: T[];
} {
	const [records, setRecords] = useLocalStorage<T[]>(key, initialValue);

	const putRecord = (record: T): void => {
		if (!records) {
			setRecords([record]);
			return;
		}
		//just to keep storage limited somehow
		if (maxLength > 0 && records.length > maxLength - 1) {
			records.shift();
		}
		if (records.find((elem) => JSON.stringify(elem) === JSON.stringify(record)) === undefined) {
			setRecords([...records, record]);
		}
	};

	const removeRecord = (query: string): void => {
		if (!records) {
			return;
		}
		const filtered = records.filter((elem) => JSON.stringify(elem).indexOf(`"${query}"`) === -1);
		setRecords(filtered);
	};
	const actions = {
		putRecord,
		removeRecord,
	};
	return { records, actions };
}
