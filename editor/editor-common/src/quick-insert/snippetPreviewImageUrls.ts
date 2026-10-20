type SnippetPreviewImageUrls = { dark: string; light: string };

const DAM_CDN_LINK = 'https://dam-cdn.atl.orangelogic.com/CDNLink';

/**
 * Keyed by `snippetKey`, which is the same for every product's copy of a GLOBAL template.
 */
const snippetPreviewImageUrlsByKey: Readonly<Record<string, SnippetPreviewImageUrls>> = {
	'action-items': {
		light: `${DAM_CDN_LINK}/AT12OVLE.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJI.png`,
	},
	'bug-report': {
		light: `${DAM_CDN_LINK}/AT12OVMN.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ6.png`,
	},
	'campaign-brief': {
		light: `${DAM_CDN_LINK}/AT12OVMY.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJE.png`,
	},
	'colourful-layout': {
		light: `${DAM_CDN_LINK}/AT12OVN6.png`,
		dark: `${DAM_CDN_LINK}/AT12OVIG.png`,
	},
	'colourful-numbered-table': {
		light: `${DAM_CDN_LINK}/AT12OVN7.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJL.png`,
	},
	'colourful-summary': {
		light: `${DAM_CDN_LINK}/AT12OVN4.png`,
		dark: `${DAM_CDN_LINK}/AT12OVIE.png`,
	},
	'colourful-table': {
		light: `${DAM_CDN_LINK}/AT12OVMJ.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJM.png`,
	},
	'competitive-snapshot': {
		light: `${DAM_CDN_LINK}/AT12OVMR.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJC.png`,
	},
	'criteria-rubric': {
		light: `${DAM_CDN_LINK}/AT12OVMA.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ1.png`,
	},
	'customer-quote': {
		light: `${DAM_CDN_LINK}/AT12OVLF.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJK.png`,
	},
	'decision-log': {
		light: `${DAM_CDN_LINK}/AT12OVMT.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ9.png`,
	},
	'launch-checklist': {
		light: `${DAM_CDN_LINK}/AT12OVKW.png`,
		dark: `${DAM_CDN_LINK}/AT12OVHN.png`,
	},
	'meeting-agenda': {
		light: `${DAM_CDN_LINK}/AT12OVMU.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJD.png`,
	},
	'project-status-snapshot': {
		light: `${DAM_CDN_LINK}/AT12OVMO.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJU.png`,
	},
	'pros-and-cons': {
		light: `${DAM_CDN_LINK}/AT12OVN5.png`,
		dark: `${DAM_CDN_LINK}/AT12OVHY.png`,
	},
	'quick-project-update': {
		light: `${DAM_CDN_LINK}/AT12OVNA.png`,
		dark: `${DAM_CDN_LINK}/AT12OVI5.png`,
	},
	'risks-and-assumptions': {
		light: `${DAM_CDN_LINK}/AT12OVMQ.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJ7.png`,
	},
	'roles-and-responsibilities-matrix': {
		light: `${DAM_CDN_LINK}/AT12OVM8.png`,
		dark: `${DAM_CDN_LINK}/AT12OVHG.png`,
	},
	'run-sheet': {
		light: `${DAM_CDN_LINK}/AT12OVMZ.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJB.png`,
	},
	'started-now': {
		light: `${DAM_CDN_LINK}/AT12OVN8.png`,
		dark: `${DAM_CDN_LINK}/AT12OVJQ.png`,
	},
	'weekly-calendar': {
		light: `${DAM_CDN_LINK}/AT12OVN2.png`,
		dark: `${DAM_CDN_LINK}/AT12OVIJ.png`,
	},
};

/**
 * Returns the preview image URLs for a GLOBAL template's `snippetKey`.
 */
export const getSnippetPreviewImageUrls = (
	snippetKey: string,
): SnippetPreviewImageUrls | undefined =>
	Object.prototype.hasOwnProperty.call(snippetPreviewImageUrlsByKey, snippetKey)
		? snippetPreviewImageUrlsByKey[snippetKey]
		: undefined;
