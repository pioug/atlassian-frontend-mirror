import { type JsonLd } from '@atlaskit/json-ld-types';

import { mockConfluenceResponse } from '../../view/BlockCard/views/__tests__/__mocks__/blockCardMocks';
import { getIsDataExportEnabled } from '../should-data-export';

describe('getIsDataExportEnabled', () => {
	const getMockResponse = (meta: Partial<JsonLd.Meta.BaseMeta> = {}) =>
		({
			...mockConfluenceResponse,

			meta: {
				...mockConfluenceResponse.meta,
				...meta,
			},
		}) as JsonLd.Response;

	it('returns false when DataExport is disabled', () => {
		const response = getMockResponse({ supportedFeature: ['ExportBlocked'] });
		const isDataExportEnabled = getIsDataExportEnabled(false, response);
		expect(isDataExportEnabled).toBe(false);
	});

	describe('when DataExport is enabled', () => {
		it('returns true when ExportEnabled is included in supportedFeatures', () => {
			const response = getMockResponse({ supportedFeature: ['ExportBlocked'] });
			const isDataExportEnabled = getIsDataExportEnabled(true, response);
			expect(isDataExportEnabled).toBe(true);
		});

		it('returns false when ExportEnabled is not included in supportedFeatures', () => {
			const response = getMockResponse({ supportedFeature: [] });
			const isDataExportEnabled = getIsDataExportEnabled(true, response);
			expect(isDataExportEnabled).toBe(false);
		});

		it('returns false when link does not have supportedFeatures', () => {
			const response = getMockResponse();
			const isDataExportEnabled = getIsDataExportEnabled(true, response);
			expect(isDataExportEnabled).toBe(false);
		});
	});
});
