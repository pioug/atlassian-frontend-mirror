type SnippetPreviewImageUrls = { dark: string; light: string };

const DAM_ASSET_LINK = 'https://dam-cdn.atl.orangelogic.com/AssetLink';

const snippetPreviewImageUrlsByKey: Readonly<Record<string, SnippetPreviewImageUrls>> = {
	// Action items
	'019e5cd9-5ca1-7258-befd-4f50d491bb42': {
		light: `${DAM_ASSET_LINK}/qq0503l11x2ub0506p2s046o2ep5gw1w.png`,
		dark: `${DAM_ASSET_LINK}/i77e8128ir0e34t8w11mar77ngq53o00.png`,
	},
	// Bug report
	'019e5cd9-5ca1-7258-befd-1c3c59b0aa00': {
		light: `${DAM_ASSET_LINK}/221f56s64c186314ka8a7uaj7m4di32l.png`,
		dark: `${DAM_ASSET_LINK}/1c86e0v3ygh5ct5600luum0w67unpa23.png`,
	},
	// Campaign brief
	'019e5cd9-5ca1-7258-befd-398bb4e40f15': {
		light: `${DAM_ASSET_LINK}/55j1ie55ad1nal6t3awxxui52rp47wn1.png`,
		dark: `${DAM_ASSET_LINK}/36h5jgou0pw7v532411mbl501b8de4hm.png`,
	},
	// Colorful layout
	'019e5cd9-5ca1-7258-befd-53b6eec19427': {
		light: `${DAM_ASSET_LINK}/53j8kth40pkysk4rqs64038r4cw2i867.png`,
		dark: `${DAM_ASSET_LINK}/k7ofa1q6r10dydey04780514v75j3fvx.png`,
	},
	// Colorful numbered table
	'019e5cd9-5ca1-7258-befd-70a282facf16': {
		light: `${DAM_ASSET_LINK}/f02n6041opl0rqvbygs2hv162mt6jq3u.png`,
		dark: `${DAM_ASSET_LINK}/s63mw28263h0oi8we3x052m7rsw2o1k8.png`,
	},
	// Colorful summary
	'019e5cd9-5ca1-7258-befd-7e200502de8e': {
		light: `${DAM_ASSET_LINK}/242qv11f2p7y1u461v71glq85x76b5gp.png`,
		dark: `${DAM_ASSET_LINK}/jeaj3a8g7x61syy45d73c2223647b14j.png`,
	},
	// Colorful table
	'019e5cd9-5ca1-7258-befd-5524d394ba0a': {
		light: `${DAM_ASSET_LINK}/8w8571k707dlx556rxr3hs72gs5q4m42.png`,
		dark: `${DAM_ASSET_LINK}/wkt55v21i5q520pqxjh31x5g2j8upth4.png`,
	},
	// Competitive snapshot
	'019e5cd9-5ca1-7258-befd-40d1947b7b84': {
		light: `${DAM_ASSET_LINK}/k5cm81s2h7i41d4d6832n67c2m767h6t.png`,
		dark: `${DAM_ASSET_LINK}/ks38nc26451n7384d52413lck2qhq4e6.png`,
	},
	// Criteria rubric
	'019e5cd9-5ca1-7258-befd-84723a493931': {
		light: `${DAM_ASSET_LINK}/n00f5ur678kbqdqjj5e13xpij6u3kkuq.png`,
		dark: `${DAM_ASSET_LINK}/54k2y2f7n2tpg2n12is326376102c3b5.png`,
	},
	// Customer quote
	'019e5cd9-5ca1-7258-befd-5fcf6165870f': {
		light: `${DAM_ASSET_LINK}/k8q5l4htp63652mhw572ed6chren37mv.png`,
		dark: `${DAM_ASSET_LINK}/y0leijw14xp7mdpi3265xn0d5ymo5lfm.png`,
	},
	// Decision log
	'019e5cd9-5ca1-7258-befd-30c6e8712ba4': {
		light: `${DAM_ASSET_LINK}/4vuxracm3c33555h1u4ug65q55267574.png`,
		dark: `${DAM_ASSET_LINK}/5445044f626dcb58dbc7s6axr32e4ywl.png`,
	},
	// Launch checklist
	'019e5cd9-5ca1-7258-befd-3ce1c551015e': {
		light: `${DAM_ASSET_LINK}/1o0gj47oprg341fe6iip8fdx8561t54n.png`,
		dark: `${DAM_ASSET_LINK}/lay6kpn21b264q2q8144h3s18uwjud0f.png`,
	},
	// Meeting agenda
	'019e5cd9-5ca1-7258-befd-47559a8d7cfc': {
		light: `${DAM_ASSET_LINK}/2hn6q5dt118vwyqi438725l141u70fb8.png`,
		dark: `${DAM_ASSET_LINK}/r4l0ydb7ujg4lms6n0wrrnsmsd1x65kw.png`,
	},
	// Project status snapshot
	'019e5cd9-5ca1-7258-befd-2943939d1b79': {
		light: `${DAM_ASSET_LINK}/qk6emfe0oa2260ldt11748672gs65y1l.png`,
		dark: `${DAM_ASSET_LINK}/tt36rsll4cmq4607ik7g2d10fxmysyt4.png`,
	},
	// Pros and cons
	'019e5cd9-5ca1-7258-befd-6db9658d75f4': {
		light: `${DAM_ASSET_LINK}/22078yl6viws8rc3au187m76x07xcu61.png`,
		dark: `${DAM_ASSET_LINK}/4tfd6w50y4yxfh4ks75w5ql04u17n7ub.png`,
	},
	// Quick project update
	'019e5cd9-5ca1-7258-befd-820ce1acd7a0': {
		light: `${DAM_ASSET_LINK}/i8cfkp8v6716121f0w054g85mkw15wgu.png`,
		dark: `${DAM_ASSET_LINK}/x7a25y5f33ok60871t31e1my5c7880cr.png`,
	},
	// Risks and assumptions
	'019e5cd9-5ca1-7258-befd-2da95ce98772': {
		light: `${DAM_ASSET_LINK}/yl7w10ms70ptlodhc703f6byo3wf7xty.png`,
		dark: `${DAM_ASSET_LINK}/mn14wqw150cu05w3s358w3f2f1vfgv7r.png`,
	},
	// Roles and responsibilities matrix
	'019e5cd9-5ca1-7258-befd-37cd3a06776d': {
		light: `${DAM_ASSET_LINK}/67hs5t8u4t63c4fepm6ho1c4d5u12bed.png`,
		dark: `${DAM_ASSET_LINK}/wj5s3dy5nvb810t87f7x45cie88783h6.png`,
	},
	// Run sheet
	'019e5cd9-5ca1-7258-befd-4a9979f87235': {
		light: `${DAM_ASSET_LINK}/tt0n285m6jl5lxb46c5v4fn856540351.png`,
		dark: `${DAM_ASSET_LINK}/qcrcqcs14753208xqw1j8r38mgs57w2f.png`,
	},
	// Started → Now
	'019e5cd9-5ca1-7258-befd-74fb1585da6f': {
		light: `${DAM_ASSET_LINK}/5ggat8yryusxvaqj3o800t8v6hcyh22v.png`,
		dark: `${DAM_ASSET_LINK}/287u8yil1jb1j5p1fih0141h07k2f64w.png`,
	},
	// Weekly calendar
	'019e5cd9-5ca1-7258-befd-580c2c95a0a0': {
		light: `${DAM_ASSET_LINK}/na153u604p852n54aji7aj1gf14431o7.png`,
		dark: `${DAM_ASSET_LINK}/sw7m5s5ay718h025c6ed3gaq63orv4gu.png`,
	},
};

export const getSnippetPreviewImageUrls = (
	snippetKey: string,
): SnippetPreviewImageUrls | undefined =>
	Object.prototype.hasOwnProperty.call(snippetPreviewImageUrlsByKey, snippetKey)
		? snippetPreviewImageUrlsByKey[snippetKey]
		: undefined;
