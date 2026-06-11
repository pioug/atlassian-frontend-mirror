import React from 'react';

type StorageValueType = 'string' | 'number' | 'boolean' | 'json';

type UseLocalStorageStateOptions<T> = {
	defaultValue: T;
	deserialize?: (storedValue: string) => T;
	serialize?: (value: T) => string;
	storageKey: string;
	type?: StorageValueType;
};

export function useLocalStorageState<T>(
	options: UseLocalStorageStateOptions<T>,
): [T, React.Dispatch<React.SetStateAction<T>>] {
	const { storageKey, defaultValue, type = 'string', deserialize: customDeserialize, serialize: customSerialize } =
		options;
	const valueType = type;
	const deserialize = React.useCallback(
		(storedValue: string): T => {
			if (customDeserialize) {
				return customDeserialize(storedValue);
			}

			switch (valueType) {
				case 'string':
					return storedValue as T;
				case 'number': {
					const parsed = Number(storedValue);
					if (Number.isNaN(parsed)) {
						console.warn(
							`[useLocalStorageState] Invalid number for key "${storageKey}". Falling back to default value.`,
						);
						return defaultValue;
					}
					return parsed as T;
				}
				case 'boolean':
					if (storedValue === 'true') {
						return true as T;
					}
					if (storedValue === 'false') {
						return false as T;
					}
					console.warn(
						`[useLocalStorageState] Invalid boolean for key "${storageKey}". Falling back to default value.`,
					);
					return defaultValue;
				case 'json':
				default:
					try {
						return JSON.parse(storedValue) as T;
					} catch {
						console.warn(
							`[useLocalStorageState] Invalid JSON for key "${storageKey}". Falling back to default value.`,
						);
						return defaultValue;
					}
			}
		},
		[customDeserialize, defaultValue, storageKey, valueType],
	);
	const serialize = React.useCallback(
		(value: T): string => {
			if (customSerialize) {
				return customSerialize(value);
			}

			switch (valueType) {
				case 'string':
				case 'number':
				case 'boolean':
					return String(value);
				case 'json':
				default:
					return JSON.stringify(value);
			}
		},
		[customSerialize, valueType],
	);
	const [state, setState] = React.useState<T>(() => {
		const storedValue = localStorage.getItem(storageKey);
		if (storedValue === null) {
			return defaultValue;
		}
		try {
			return deserialize(storedValue);
		} catch {
			console.warn(
				`[useLocalStorageState] Failed to deserialize key "${storageKey}". Falling back to default value.`,
			);
			return defaultValue;
		}
	});

	React.useEffect(() => {
		try {
			localStorage.setItem(storageKey, serialize(state));
		} catch {
			console.warn(`[useLocalStorageState] Failed to persist key "${storageKey}" to localStorage.`);
		}
	}, [serialize, state, storageKey]);

	return [state, setState];
}
