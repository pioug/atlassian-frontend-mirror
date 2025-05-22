import { type VideoTextTrack } from '../../react-video-renderer';

const toLocale = (locale: string) => {
	try {
		return new Intl.Locale(locale);
	} catch (error) {
		return new Intl.Locale('en-UK');
	}
};

const matchLocale = (locale1: Intl.Locale, locale2: Intl.Locale, matchRegion = false) => {
	return (
		locale1.language === locale2.language &&
		(matchRegion ? locale1.region === locale2.region : true)
	);
};

const matchTracks = (tracks: VideoTextTrack[], locale?: Intl.Locale, matchRegion = false) =>
	locale ? tracks.findIndex(({ lang }) => matchLocale(toLocale(lang), locale, matchRegion)) : -1;

export const findPreselectedTrackIndex = (
	tracks: VideoTextTrack[],
	appLocale: string,
	userPreferedLocale?: string,
): number => {
	const _userPreferredLocale = userPreferedLocale ? toLocale(userPreferedLocale) : undefined;
	const _appLocale = toLocale(appLocale);

	// Track match language and region with user preferred locale
	const matchLangRegionUser = matchTracks(tracks, _userPreferredLocale, true);
	if (matchLangRegionUser !== -1) {
		return matchLangRegionUser;
	}

	// Track match language with user preferred locale
	const matchLangUser = matchTracks(tracks, _userPreferredLocale);
	if (matchLangUser !== -1) {
		return matchLangUser;
	}

	// Track match language and region with app locale
	const matchLangRegionApp = matchTracks(tracks, _appLocale, true);
	if (matchLangRegionApp !== -1) {
		return matchLangRegionApp;
	}

	// Track match language with app locale
	const matchLangApp = matchTracks(tracks, _appLocale);
	if (matchLangApp !== -1) {
		return matchLangApp;
	}

	return -1;
};
