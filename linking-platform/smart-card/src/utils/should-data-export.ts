import type { JsonLd } from '@atlaskit/json-ld-types';

export const getIsDataExportEnabled = (
	shouldControlDataExport: boolean = false,
	response?: JsonLd.Response,
): boolean =>
	Boolean(shouldControlDataExport && response?.meta?.supportedFeature?.includes('ExportBlocked'));
