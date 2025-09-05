/**
 * This can be used to mock local storage for Edge and other browsers
 * that have disabled local storage setting
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
		const keys = Object.keys(this._data);
		return keys[index] || null;
	},
};

export const mockWindowStorage = (
	storageToMock: ('localStorage' | 'sessionStorage')[] = ['localStorage', 'sessionStorage'],
): void => {
	// Handle SSR environment where window is undefined
	let windowRef: Window & typeof globalThis;
	let replacedWindowRef = false;
	if (typeof window === 'undefined') {
		// Ensure global exists and create window if needed
		if (typeof global !== 'undefined') {
			global.window = global.window || ({} as any);
			windowRef = global.window;
		} else {
			// Fallback for environments where global might not exist
			windowRef = {} as any;
			replacedWindowRef = true;
		}
	} else {
		windowRef = window;
	}

	// Ensure windowRef is always defined and is an object
	if (!windowRef || typeof windowRef !== 'object') {
		windowRef = {} as any;
		replacedWindowRef = true;
	}

	// If we had to replace the window reference, reflect it back to global.window
	if (replacedWindowRef && typeof global !== 'undefined') {
		(global as any).window = windowRef as any;
	}

	for (const storageToMockElement of storageToMock) {
		Object.defineProperty(windowRef, storageToMockElement, {
			value: { ...STORAGE_MOCK },
			configurable: true,
		});
	}
};
