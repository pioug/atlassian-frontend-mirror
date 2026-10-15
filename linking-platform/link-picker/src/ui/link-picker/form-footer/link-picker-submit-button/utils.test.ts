import { checkSubmitDisabled } from './utils';

describe('checkSubmitDisabled', () => {
	describe('isSubmitting', () => {
		it('should return true when isSubmitting is true regardless of other args', () => {
			expect(checkSubmitDisabled(true, true, null, 'http://www.atlassian.com', null, null)).toBe(
				true,
			);
		});
	});

	describe('manual URL insert', () => {
		it('should return false when url is a valid URL and disableManualUrlInsert is not set', () => {
			expect(checkSubmitDisabled(false, false, null, 'http://www.atlassian.com', null, null)).toBe(
				false,
			);
		});

		it('should return false when url is a valid URL and disableManualUrlInsert is false', () => {
			expect(
				checkSubmitDisabled(false, false, null, 'http://www.atlassian.com', null, null, false),
			).toBe(false);
		});

		it('should disable insert for a manually typed valid URL when disableManualUrlInsert is true and queryState is null', () => {
			// Even with a valid URL typed and no loading, insert must be disabled
			// because no result has been selected from the list.
			expect(
				checkSubmitDisabled(false, false, null, 'http://www.atlassian.com', null, null, true),
			).toBe(true);
		});

		it('should disable insert when disableManualUrlInsert is true and queryState is set but items is empty', () => {
			expect(
				checkSubmitDisabled(
					false,
					false,
					null,
					'http://www.atlassian.com',
					{ query: 'atlassian' },
					[],
					true,
				),
			).toBe(true);
		});

		it('should enable insert when disableManualUrlInsert is true and a result item is present', () => {
			const items = [
				{
					objectId: '1',
					name: 'Atlassian',
					url: 'http://www.atlassian.com',
					container: '',
					icon: '',
					iconAlt: '',
				},
			];
			expect(
				checkSubmitDisabled(
					false,
					false,
					null,
					'http://www.atlassian.com',
					{ query: 'atlassian' },
					items,
					true,
				),
			).toBe(false);
		});
	});

	describe('loading and error states', () => {
		it('should return true when isLoading is true', () => {
			expect(checkSubmitDisabled(true, false, null, '', null, null)).toBe(true);
		});

		it('should return true when error is present', () => {
			expect(checkSubmitDisabled(false, false, new Error('fail'), '', null, null)).toBe(true);
		});

		it('should return true when isLoading is true and disableManualUrlInsert is true with stale items', () => {
			// isLoading is checked before disableManualUrlInsert, so the button stays
			// disabled even when stale items are present.
			const staleItems = [
				{
					objectId: '1',
					name: 'Atlassian',
					url: 'http://www.atlassian.com',
					container: '',
					icon: '',
					iconAlt: '',
				},
			];
			expect(
				checkSubmitDisabled(true, false, null, '', { query: 'atlassian' }, staleItems, true),
			).toBe(true);
		});

		it('should return true when error is present and disableManualUrlInsert is true with stale items', () => {
			// error is checked before disableManualUrlInsert, so the button stays
			// disabled even when stale items are present.
			const staleItems = [
				{
					objectId: '1',
					name: 'Atlassian',
					url: 'http://www.atlassian.com',
					container: '',
					icon: '',
					iconAlt: '',
				},
			];
			expect(
				checkSubmitDisabled(
					false,
					false,
					new Error('fail'),
					'',
					{ query: 'atlassian' },
					staleItems,
					true,
				),
			).toBe(true);
		});
	});

	describe('empty results', () => {
		it('should return true when queryState is set and items is empty', () => {
			expect(checkSubmitDisabled(false, false, null, '', { query: 'something' }, [])).toBe(true);
		});

		it('should return false when queryState is set but items has entries', () => {
			const items = [
				{
					objectId: '1',
					name: 'Atlassian',
					url: 'http://www.atlassian.com',
					container: '',
					icon: '',
					iconAlt: '',
				},
			];
			expect(checkSubmitDisabled(false, false, null, '', { query: 'something' }, items)).toBe(
				false,
			);
		});
	});

	describe('default state', () => {
		it('should return false when nothing is set (no url, no queryState, no error, not loading)', () => {
			expect(checkSubmitDisabled(false, false, null, '', null, null)).toBe(false);
		});
	});
});
