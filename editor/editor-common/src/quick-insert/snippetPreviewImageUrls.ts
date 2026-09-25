type SnippetPreviewImageUrls = { dark: string; light: string };

const DAM_CDN_LINK = 'https://dam-cdn.atl.orangelogic.com/CDNLink';

const snippetPreviewImageUrlsByKey: Readonly<Record<string, SnippetPreviewImageUrls>> = {
	// Action items
	'019e5cd9-5ca1-7258-befd-4f50d491bb42': {
		light: `${DAM_CDN_LINK}/AT12OVLE.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJI.png`,
	},
	// Bug report
	'019e5cd9-5ca1-7258-befd-1c3c59b0aa00': {
		light: `${DAM_CDN_LINK}/AT12OVMN.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ6.png`,
	},
	// Campaign brief
	'019e5cd9-5ca1-7258-befd-398bb4e40f15': {
		light: `${DAM_CDN_LINK}/AT12OVMY.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJE.png`,
	},
	// Colorful layout
	'019e5cd9-5ca1-7258-befd-53b6eec19427': {
		light: `${DAM_CDN_LINK}/AT12OVN6.png`,
		dark: `${DAM_CDN_LINK}/AT12OVIG.png`,
	},
	// Colorful numbered table
	'019e5cd9-5ca1-7258-befd-70a282facf16': {
		light: `${DAM_CDN_LINK}/AT12OVN7.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJL.png`,
	},
	// Colorful summary
	'019e5cd9-5ca1-7258-befd-7e200502de8e': {
		light: `${DAM_CDN_LINK}/AT12OVN4.png`,
		dark: `${DAM_CDN_LINK}/AT12OVIE.png`,
	},
	// Colorful table
	'019e5cd9-5ca1-7258-befd-5524d394ba0a': {
		light: `${DAM_CDN_LINK}/AT12OVMJ.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJM.png`,
	},
	// Competitive snapshot
	'019e5cd9-5ca1-7258-befd-40d1947b7b84': {
		light: `${DAM_CDN_LINK}/AT12OVMR.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJC.png`,
	},
	// Criteria rubric
	'019e5cd9-5ca1-7258-befd-84723a493931': {
		light: `${DAM_CDN_LINK}/AT12OVMA.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ1.png`,
	},
	// Customer quote
	'019e5cd9-5ca1-7258-befd-5fcf6165870f': {
		light: `${DAM_CDN_LINK}/AT12OVLF.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJK.png`,
	},
	// Decision log
	'019e5cd9-5ca1-7258-befd-30c6e8712ba4': {
		light: `${DAM_CDN_LINK}/AT12OVMT.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ9.png`,
	},
	// Launch checklist
	'019e5cd9-5ca1-7258-befd-3ce1c551015e': {
		light: `${DAM_CDN_LINK}/AT12OVKW.png`,
		dark: `${DAM_CDN_LINK}/AT12OVHN.png`,
	},
	// Meeting agenda
	'019e5cd9-5ca1-7258-befd-47559a8d7cfc': {
		light: `${DAM_CDN_LINK}/AT12OVMU.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJD.png`,
	},
	// Project status snapshot
	'019e5cd9-5ca1-7258-befd-2943939d1b79': {
		light: `${DAM_CDN_LINK}/AT12OVMO.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJU.png`,
	},
	// Pros and cons
	'019e5cd9-5ca1-7258-befd-6db9658d75f4': {
		light: `${DAM_CDN_LINK}/AT12OVN5.png`,
		dark: `${DAM_CDN_LINK}/AT12OVHY.png`,
	},
	// Quick project update
	'019e5cd9-5ca1-7258-befd-820ce1acd7a0': {
		light: `${DAM_CDN_LINK}/AT12OVNA.png`,
		dark: `${DAM_CDN_LINK}/AT12OVI5.png`,
	},
	// Risks and assumptions
	'019e5cd9-5ca1-7258-befd-2da95ce98772': {
		light: `${DAM_CDN_LINK}/AT12OVMQ.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ7.png`,
	},
	// Roles and responsibilities matrix
	'019e5cd9-5ca1-7258-befd-37cd3a06776d': {
		light: `${DAM_CDN_LINK}/AT12OVM8.png`,
		dark: `${DAM_CDN_LINK}/AT12OVHG.png`,
	},
	// Run sheet
	'019e5cd9-5ca1-7258-befd-4a9979f87235': {
		light: `${DAM_CDN_LINK}/AT12OVMZ.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJB.png`,
	},
	// Started → Now
	'019e5cd9-5ca1-7258-befd-74fb1585da6f': {
		light: `${DAM_CDN_LINK}/AT12OVN8.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJQ.png`,
	},
	// Weekly calendar
	'019e5cd9-5ca1-7258-befd-580c2c95a0a0': {
		light: `${DAM_CDN_LINK}/AT12OVN2.png`,
		dark: `${DAM_CDN_LINK}/AT12OVIJ.png`,
	},
};

export const getSnippetPreviewImageUrls = (
	snippetKey: string,
): SnippetPreviewImageUrls | undefined =>
	Object.prototype.hasOwnProperty.call(snippetPreviewImageUrlsByKey, snippetKey)
		? snippetPreviewImageUrlsByKey[snippetKey]
		: undefined;
