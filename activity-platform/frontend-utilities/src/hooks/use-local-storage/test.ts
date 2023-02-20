import { act, renderHook } from '@testing-library/react-hooks';

import { useLocalStorage } from './index';

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
    mockStorageClientGetItem.mockImplementation(key => localStorage.get(key));
    mockStorageClientSetItemWithExpiry.mockImplementation((key, value) =>
      localStorage.set(key, value),
    );
  });

  test('given nothing saved in local storage > when call hook > should save the initial value to local storage and return the initial value', () => {
    const { result } = renderHook(() =>
      useLocalStorage('key-123', { value: 'initial' }),
    );
    const [value, _setValue] = result.current;

    expect(value).toEqual({ value: 'initial' });
    expect(localStorage.get('key-123')).toEqual({ value: 'initial' });
  });

  test('given value saved in local storage > when get value from hook > should return the previously saved value', () => {
    localStorage.set('key-123', { value: '123' });

    const { result } = renderHook(() =>
      useLocalStorage('key-123', { value: 'initial' }),
    );
    const [value, _setValue] = result.current;

    expect(value).toEqual({ value: '123' });
    expect(localStorage.get('key-123')).toEqual({ value: '123' });
  });

  test('given value in storage > when set new value > should persist value to local storage and return new value', () => {
    localStorage.set('key-123', { value: '123' });

    const { result } = renderHook(() =>
      useLocalStorage('key-123', { value: 'initial' }),
    );
    const [_value1, setValue1] = result.current;
    act(() => setValue1({ value: '234' }));

    const [value2, _setValue2] = result.current;
    expect(value2).toEqual({ value: '234' });
    expect(localStorage.get('key-123')).toEqual({ value: '234' });
  });
});
