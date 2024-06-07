/**
 * This can be used to mock local storage for Edge and other browsers that have disabled local storage setting
 */

export const STORAGE_MOCK: Storage = {
	_data: {},
	length: 0,
	setItem: function (id: string, val: string) {
		return (this._data[id] = String(val));
	},
	getItem: function (id: string) {
		return this._data.hasOwnProperty(id) ? this._data[id] : undefined;
	},
	removeItem: function (id: string) {
		return delete this._data[id];
	},
	clear: function () {
		return (this._data = {});
	},
	key: function (index: number) {
		return Object.keys(this._data)[index];
	},
};

export const mockWindowStorage = (
	storageToMock: ('localStorage' | 'sessionStorage')[] = ['localStorage', 'sessionStorage'],
) => {
	for (const storageToMockElement of storageToMock) {
		Object.defineProperty(window, storageToMockElement, {
			value: { ...STORAGE_MOCK },
			configurable: true,
		});
	}
};
