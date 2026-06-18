import { selectedProductivityColorStorageKey } from '../../../util/constants';
import {
	defaultProductivityColor,
	getStoredProductivityColor,
	storeProductivityColor,
} from '../../../util/productivity-colors';

describe('productivity-colors', () => {
	afterEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('stores the selected productivity colour in localStorage', () => {
		storeProductivityColor('red');

		expect(localStorage.setItem).toHaveBeenCalledWith(
			selectedProductivityColorStorageKey,
			'red',
		);
	});

	it('loads a stored productivity colour from localStorage', () => {
		jest.mocked(localStorage.getItem).mockReturnValue('magenta');

		expect(getStoredProductivityColor()).toBe('magenta');
		expect(localStorage.getItem).toHaveBeenCalledWith(selectedProductivityColorStorageKey);
	});

	it('falls back to the default productivity colour when the stored value is invalid', () => {
		jest.mocked(localStorage.getItem).mockReturnValue('not-a-colour');

		expect(getStoredProductivityColor()).toBe(defaultProductivityColor);
	});
});
