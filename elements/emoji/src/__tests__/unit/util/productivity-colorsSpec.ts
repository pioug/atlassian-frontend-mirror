import { selectedProductivityColorStorageKey } from '../../../util/constants';
import type * as ProductivityColors from '../../../util/productivity-colors';

describe('productivity-colors', () => {
	let productivityColors: typeof ProductivityColors;

	beforeEach(() => {
		jest.resetModules();
		productivityColors = require('../../../util/productivity-colors');
	});

	afterEach(() => {
		localStorage.clear();
		jest.clearAllMocks();
		jest.restoreAllMocks();
	});

	it('stores the selected productivity colour in localStorage', () => {
		productivityColors.storeProductivityColor('red');

		expect(localStorage.setItem).toHaveBeenCalledWith(selectedProductivityColorStorageKey, 'red');
	});

	it('loads a stored productivity colour from localStorage', () => {
		jest.mocked(localStorage.getItem).mockReturnValue('magenta');

		expect(productivityColors.getStoredProductivityColor()).toBe('magenta');
		expect(localStorage.getItem).toHaveBeenCalledWith(selectedProductivityColorStorageKey);
	});

	it('falls back to the default productivity colour when the stored value is invalid', () => {
		jest.mocked(localStorage.getItem).mockReturnValue('not-a-colour');

		expect(productivityColors.getStoredProductivityColor()).toBe(
			productivityColors.defaultProductivityColor,
		);
	});

	it('uses the in-memory productivity colour when localStorage does not update', () => {
		jest.mocked(localStorage.getItem).mockReturnValue('purple');

		productivityColors.storeProductivityColor('orange');

		expect(productivityColors.getStoredProductivityColor()).toBe('orange');
		expect(localStorage.setItem).toHaveBeenCalledWith(
			selectedProductivityColorStorageKey,
			'orange',
		);
	});
});
