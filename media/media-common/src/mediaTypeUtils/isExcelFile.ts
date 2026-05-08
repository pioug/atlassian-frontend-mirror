// MS Excel MIME types — covers all native Microsoft spreadsheet formats.
// Stored in their canonical form (RFC 4288 mimetypes are case-sensitive;
// the media backend always sends them in this exact casing).
const EXCEL_MIME_TYPES = new Set([
	'application/vnd.ms-excel',
	'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	'application/vnd.ms-excel.sheet.binary.macroEnabled.12',
	'application/vnd.ms-excel.sheet.macroEnabled.12',
]);

export const isExcelFile = (mimeType: string): boolean => EXCEL_MIME_TYPES.has(mimeType);
