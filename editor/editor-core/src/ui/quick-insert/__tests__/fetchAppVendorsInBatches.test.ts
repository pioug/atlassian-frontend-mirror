import { fetchAppVendors } from '../app-vendor/fetchAppVendors';
import { fetchAppVendorsInBatches } from '../app-vendor/fetchAppVendorsInBatches';

jest.mock('../app-vendor/fetchAppVendors', () => ({
	fetchAppVendors: jest.fn(),
}));

const lookup = { attempts: 1, id: 'connect:app', kind: 'connect' as const, value: 'app' };

describe('fetchAppVendorsInBatches', () => {
	it('reports a successful batch once even when the callback throws', async () => {
		jest.mocked(fetchAppVendors).mockResolvedValue(new Map([[lookup.id, 'Gliffy']]));
		const error = new Error('Settling failed');
		const onBatch = jest.fn(() => {
			throw error;
		});

		await expect(
			fetchAppVendorsInBatches([lookup], { onBatch, shouldContinue: () => true }),
		).rejects.toBe(error);

		expect(onBatch).toHaveBeenCalledTimes(1);
		expect(onBatch).toHaveBeenCalledWith([lookup], {
			names: new Map([[lookup.id, 'Gliffy']]),
			status: 'fulfilled',
		});
	});
});
