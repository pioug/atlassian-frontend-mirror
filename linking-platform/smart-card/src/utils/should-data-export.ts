import type { JsonLd } from '@atlaskit/json-ld-types';

export const getIsDataExportEnabled = (
	shouldControlDataExport: boolean = false,
	response?: JsonLd.Response,
) =>
	Boolean(shouldControlDataExport && response?.meta?.supportedFeature?.includes('ExportBlocked'));
