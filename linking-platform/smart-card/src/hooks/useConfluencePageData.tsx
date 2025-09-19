import { useEffect, useMemo } from 'react';

import { fg } from '@atlaskit/platform-feature-flags';
import { setGlobalTheme, type ThemeColorModes, themeStringToObject } from '@atlaskit/tokens';

export enum userType {
	ATLASSIAN_ACCOUNT = 'atlassianAccount',
	HASHED_EMAIL = 'hashedEmail',
	LOOM = 'loom',
	TRELLO = 'trello',
	OPSGENIE = 'opsgenie',
	JA_USER_ID = 'jiraAlign',
	HALP = 'halp',
}

export type PageAllowedFeatures = {
	edit: string[];
	view: string[];
};

export enum EMBEDDED_CONFLUENCE_MODE {
	VIEW_MODE = 'view',
	EDIT_MODE = 'edit',
}

export enum CONFLUENCE_EXTENSION_KEYS {
	PAGE = 'integration-confluence-object-provider',
	CANVAS = 'canvas-native-object-provider',
}

export const useConfluencePageData = (url: string, extensionKey: string) => {
	const parsedData = useMemo(() => {
		if (!fg('platform_deprecate_lp_cc_embed')) {
			return undefined;
		}
		if (
			!url ||
			typeof url !== 'string' ||
			(!url.startsWith('http://') && !url.startsWith('https://')) ||
			!extensionKey ||
			!Object.values(CONFLUENCE_EXTENSION_KEYS).find((key) => key === extensionKey)
		) {
			return undefined;
		}

		let urlObj;
		try {
			urlObj = new URL(url);
		} catch {
			return undefined;
		}

		const { searchParams, hash } = urlObj;
		const hostname = searchParams?.get('hostname') || '';
		const contentId = searchParams?.get('contentId') || '';
		const spaceKey = searchParams?.get('spaceKey') || '';

		// Early return for invalid URLs
		if (!contentId || !hostname) {
			return undefined;
		}

		const themeState = searchParams?.get('themeState') || '';
		const themeMode = searchParams?.get('themeMode') as ThemeColorModes;
		const enableInlineComments = searchParams?.get('enableInlineComments') === 'true';
		const enablePageComments = searchParams?.get('enablePageComments') === 'true';
		const userId = searchParams?.get('userId') || '';
		const userIdType =
			(searchParams?.get('userInfo') as (typeof userType)[keyof typeof userType]) || undefined;
		const parentProduct = searchParams?.get('parentProduct') || '';

		const inlineComments: PageAllowedFeatures['view'] = enableInlineComments
			? ['inline-comments']
			: [];
		const pageComments: PageAllowedFeatures['view'] = enablePageComments ? ['page-comments'] : [];

		// Calculate theme state object here
		let calculatedThemeStateObject;
		if (themeState) {
			calculatedThemeStateObject = themeStringToObject(decodeURIComponent(themeState));
		} else if (themeMode) {
			calculatedThemeStateObject = { colorMode: themeMode };
		}

		const calculatedUserInfo = userId && userIdType ? { userId, userIdType } : undefined;

		return {
			hostname,
			spaceKey,
			contentId,
			parentProduct,
			userInfo: calculatedUserInfo,
			hash: hash || '',
			enableInlineComments,
			enablePageComments,
			themeStateObject: calculatedThemeStateObject,
			allowedFeatures: {
				edit: ['delete-draft'],
				view: [
					'byline-contributors',
					'byline-extensions',
					'page-reactions',
					...pageComments,
					...inlineComments,
				],
			},
			mode: EMBEDDED_CONFLUENCE_MODE.VIEW_MODE,
			locale: 'en',
		};
	}, [url, extensionKey]);

	// Handle theme side effect - only when theme object changes
	useEffect(() => {
		if (parsedData?.themeStateObject) {
			setGlobalTheme(parsedData.themeStateObject);
		}
	}, [parsedData?.themeStateObject]);

	return parsedData;
};
