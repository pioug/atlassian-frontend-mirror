// Inline cards refresh personalization in the background even when there is no cached trait data.
// Keep VR fixtures independent of live tenant and personalization services.
export const mockPersonalizationRequests: {
	body: string;
	contentType: string;
	urlPattern: RegExp;
}[] = [
	{
		urlPattern: /\/_edge\/tenant_info/,
		body: JSON.stringify({ cloudId: 'vr-mock-tenant-cloud-id' }),
		contentType: 'application/json',
	},
	{
		urlPattern: /\/gateway\/api\/tap-delivery\/api\/v3\/personalization\//,
		body: JSON.stringify({ attributes: [] }),
		contentType: 'application/json',
	},
];
