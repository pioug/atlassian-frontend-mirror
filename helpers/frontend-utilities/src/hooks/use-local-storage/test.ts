import { act, renderHook } from '@testing-library/react-hooks';

import { useLocalStorage, useLocalStorageRecord } from './index';

const mockStorageClientGetItem = jest.fn();
const mockStorageClientSetItemWithExpiry = jest.fn();

jest.mock('../../storage/storage-client', () => ({
	StorageClient: () => ({
		...jest.requireActual('../../storage/storage-client').StorageClient,
		getItem: mockStorageClientGetItem,
		setItemWithExpiry: mockStorageClientSetItemWithExpiry,
	}),
}));

describe('use local storage', () => {
	let localStorage: Map<string, unknown>;

	beforeEach(() => {
		localStorage = new Map();

		jest.resetAllMocks();
		mockStorageClientGetItem.mockImplementation((key) => localStorage.get(key));
		mockStorageClientSetItemWithExpiry.mockImplementation((key, value) =>
			localStorage.set(key, value),
		);
	});

	test('given nothing saved in local storage > when call hook > should save the initial value to local storage and return the initial value', () => {
		const { result } = renderHook(() => useLocalStorage('key-123', { value: 'initial' }));
		const [value, _setValue] = result.current;

		expect(value).toEqual({ value: 'initial' });
		expect(localStorage.get('key-123')).toEqual({ value: 'initial' });
	});

	test('given value saved in local storage > when get value from hook > should return the previously saved value', () => {
		localStorage.set('key-123', { value: '123' });

		const { result } = renderHook(() => useLocalStorage('key-123', { value: 'initial' }));
		const [value, _setValue] = result.current;

		expect(value).toEqual({ value: '123' });
		expect(localStorage.get('key-123')).toEqual({ value: '123' });
	});

	test('given value in storage > when set new value > should persist value to local storage and return new value', () => {
		localStorage.set('key-123', { value: '123' });

		const { result } = renderHook(() => useLocalStorage('key-123', { value: 'initial' }));
		const [_value1, setValue1] = result.current;
		act(() => setValue1({ value: '234' }));

		const [value2, _setValue2] = result.current;
		expect(value2).toEqual({ value: '234' });
		expect(localStorage.get('key-123')).toEqual({ value: '234' });
	});
});

describe('useLocalStorageRecord', () => {
	let localStorage: Map<string, unknown>;

	beforeEach(() => {
		localStorage = new Map();

		jest.resetAllMocks();
		mockStorageClientGetItem.mockImplementation((key) => localStorage.get(key));
		mockStorageClientSetItemWithExpiry.mockImplementation((key, value) =>
			localStorage.set(key, value),
		);
	});

	type TestRecordType = {
		field1: string;
		field2: number;
	};
	const mockRecord = (number: number): TestRecordType => {
		return { field1: `field value ${number}`, field2: number * 100 };
	};
	const storageKey = 'test1';

	it('initial Storage Is Empty', () => {
		const { result } = renderHook(() => useLocalStorageRecord<TestRecordType>(storageKey, []));
		expect(result.current.records).toEqual([]);
	});
	it('can put records', () => {
		const { result } = renderHook(() => useLocalStorageRecord<TestRecordType>(storageKey, []));
		act(() => result.current.actions.putRecord(mockRecord(1)));
		expect(result.current.records).toHaveLength(1);
		act(() => result.current.actions.putRecord(mockRecord(2)));
		expect(result.current.records).toHaveLength(2);
	});
	it('does not duplicate records', () => {
		const { result } = renderHook(() => useLocalStorageRecord<TestRecordType>(storageKey, []));
		act(() => result.current.actions.putRecord(mockRecord(1)));
		expect(result.current.records).toHaveLength(1);
		act(() => result.current.actions.putRecord(mockRecord(1)));
		expect(result.current.records).toHaveLength(1);
	});
	it('can remove records', () => {
		const { result } = renderHook(() => useLocalStorageRecord<TestRecordType>(storageKey, []));
		act(() => result.current.actions.putRecord(mockRecord(1)));
		expect(result.current.records).toHaveLength(1);
		act(() => result.current.actions.putRecord(mockRecord(2)));
		expect(result.current.records).toHaveLength(2);
		act(() => result.current.actions.removeRecord(mockRecord(1).field1));
		expect(result.current.records).toHaveLength(1);
		act(() => result.current.actions.removeRecord(mockRecord(2).field1));
		expect(result.current.records).toHaveLength(0);
	});
	it('does not remove records when not exists', () => {
		const { result } = renderHook(() => useLocalStorageRecord<TestRecordType>(storageKey, []));
		act(() => result.current.actions.putRecord(mockRecord(1)));
		expect(result.current.records).toHaveLength(1);
		act(() => result.current.actions.putRecord(mockRecord(2)));
		expect(result.current.records).toHaveLength(2);
		result.current.actions.removeRecord('test');
		expect(result.current.records).toHaveLength(2);
		result.current.actions.removeRecord('test2');
		expect(result.current.records).toHaveLength(2);
	});
	it('does not grow more than limit set', () => {
		const limit = 10;
		const { result } = renderHook(() =>
			useLocalStorageRecord<TestRecordType>(storageKey, [], limit),
		);
		for (let i = 1; i <= limit; i++) {
			act(() => result.current.actions.putRecord(mockRecord(i)));
		}
		expect(result.current.records).toHaveLength(limit);
	});
	it('can have more than 100 records when limit set to -1', () => {
		const { result } = renderHook(() => useLocalStorageRecord<TestRecordType>(storageKey, [], -1));
		for (let i = 1; i <= 101; i++) {
			act(() => result.current.actions.putRecord(mockRecord(i)));
		}
		expect(result.current.records).toHaveLength(101);
	});
});
