// Regional exceptions from Unicode CLDR 48; all other regions use Monday.
// https://github.com/unicode-org/cldr-json/blob/48.0.0/cldr-json/cldr-core/supplemental/weekData.json
const firstDays: Record<string, number> = {
	AF: 6,
	AG: 7,
	AS: 7,
	BD: 7,
	BH: 6,
	BR: 7,
	BS: 7,
	BT: 7,
	BW: 7,
	BZ: 7,
	CA: 7,
	CO: 7,
	DJ: 6,
	DM: 7,
	DO: 7,
	DZ: 6,
	EG: 6,
	ET: 7,
	GT: 7,
	GU: 7,
	HK: 7,
	HN: 7,
	ID: 7,
	IL: 7,
	IN: 7,
	IQ: 6,
	IR: 6,
	IS: 7,
	JM: 7,
	JO: 6,
	JP: 7,
	KE: 7,
	KH: 7,
	KR: 7,
	KW: 6,
	LA: 7,
	LY: 6,
	MH: 7,
	MM: 7,
	MO: 7,
	MT: 7,
	MV: 5,
	MX: 7,
	MZ: 7,
	NI: 7,
	NP: 7,
	OM: 6,
	PA: 7,
	PE: 7,
	PH: 7,
	PK: 7,
	PR: 7,
	PT: 7,
	PY: 7,
	QA: 6,
	SA: 7,
	SD: 6,
	SG: 7,
	SV: 7,
	SY: 6,
	TH: 7,
	TT: 7,
	TW: 7,
	UM: 7,
	US: 7,
	VE: 7,
	VI: 7,
	WS: 7,
	YE: 7,
	ZA: 7,
	ZW: 7,
};

// Only regular territories may override a locale's region (CLDR 48 region validity data).
// https://github.com/unicode-org/cldr/blob/release-48/common/validity/region.xml
const regularRegions = new Set(
	[
		'AC AD AE AF AG AI AL AM AO AQ AR AS AT AU AW AX AZ BA BB BD BE BF',
		'BG BH BI BJ BL BM BN BO BQ BR BS BT BV BW BY BZ CA CC CD CF CG CH',
		'CI CK CL CM CN CO CP CQ CR CU CV CW CX CY CZ DE DG DJ DK DM DO DZ',
		'EA EC EE EG EH ER ES ET FI FJ FK FM FO FR GA GB GD GE GF GG GH GI',
		'GL GM GN GP GQ GR GS GT GU GW GY HK HM HN HR HT HU IC ID IE IL IM',
		'IN IO IQ IR IS IT JE JM JO JP KE KG KH KI KM KN KP KR KW KY KZ LA',
		'LB LC LI LK LR LS LT LU LV LY MA MC MD ME MF MG MH MK ML MM MN MO',
		'MP MQ MR MS MT MU MV MW MX MY MZ NA NC NE NF NG NI NL NO NP NR NU',
		'NZ OM PA PE PF PG PH PK PL PM PN PR PS PT PW PY QA RE RO RS RU RW',
		'SA SB SC SD SE SG SH SI SJ SK SL SM SN SO SR SS ST SV SX SY SZ TA',
		'TC TD TF TG TH TJ TK TL TM TN TO TR TT TV TW TZ UA UG UM US UY UZ',
		'VA VC VE VG VI VN VU WF WS XK YE YT ZA ZM ZW',
	]
		.join(' ')
		.split(' '),
);

type WeekInfo = { firstDay: number };

// Read only Unicode keywords, excluding other extensions and private-use subtags.
const getUnicodeKeyword = (locale: Intl.Locale, key: string): string | undefined => {
	const extensions = locale.toString().split('-');
	const start = extensions.indexOf('u');
	const privateUse = extensions.indexOf('x');
	if (start === -1 || (privateUse !== -1 && privateUse < start)) {
		return undefined;
	}
	for (let index = start + 1; index < extensions.length; index++) {
		if (extensions[index].length === 1) {
			break;
		}
		if (extensions[index] === key) {
			const value: string[] = [];
			while (extensions[index + 1]?.length > 2) {
				value.push(extensions[++index]);
			}
			return value.join('-');
		}
	}
	return undefined;
};

// Canonicalize aliases before rejecting unknown, private-use, and macroregion overrides.
const getOverrideRegion = (value: string | undefined): string | undefined => {
	if (!value) {
		return undefined;
	}
	const region = new Intl.Locale(`und-${value}`).region;
	return region && regularRegions.has(region) ? region : undefined;
};

/**
 * A local fallback for browsers with Intl.Locale but neither version of the week-info API.
 */
export const getWeekInfo = (locale: Intl.Locale): WeekInfo => {
	if (typeof locale.getWeekInfo === 'function') {
		return locale.getWeekInfo();
	}
	const legacyWeekInfo = (locale as Intl.Locale & { weekInfo?: WeekInfo }).weekInfo;
	if (legacyWeekInfo) {
		return legacyWeekInfo;
	}

	const regionOverride = getOverrideRegion(
		getUnicodeKeyword(locale, 'rg')?.match(/^([a-z]{2}|[0-9]{3})zzzz$/)?.[1],
	);
	const subdivision = getOverrideRegion(
		getUnicodeKeyword(locale, 'sd')?.match(/^([a-z]{2}|[0-9]{3})[a-z0-9]+$/)?.[1],
	);
	const region =
		regionOverride || locale.region || subdivision || locale.maximize().region || '001';
	const preferredDay = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'].indexOf(
		getUnicodeKeyword(locale, 'fw') || '',
	);
	const firstDay =
		preferredDay !== -1
			? preferredDay + 1
			: !regionOverride && locale.calendar === 'iso8601'
				? 1
				: firstDays[region] || 1;

	return { firstDay };
};
