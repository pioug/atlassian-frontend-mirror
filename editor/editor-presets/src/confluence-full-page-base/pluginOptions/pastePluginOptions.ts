import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import type { PastePluginOptions } from '@atlaskit/editor-plugin-paste';

// SECTION: From confluence/next/packages/editor-features/src/utils/smartCardOptions.ts
/**
 * Supported Jira URLs and Jira Roadmap URLs, GDrive and ODFB will become Smart Links
 * (only supports Cloud single-issue URLs right now)
 */
const SMART_LINKS_BEFORE_MACROS =
	'jira,jiraroadmap,google-drive-sheets,google-drive-docs,OneDrive,google-drive-slides'.split(',');
// END SECTION

interface Props {
	options: never;
	providers: {
		cardProvider: Promise<CardProvider> | undefined;
	};
}

export function pastePluginOptions({ providers }: Props): PastePluginOptions {
	return {
		cardOptions: {
			provider: providers.cardProvider,
			// SECTION: From confluence/next/packages/editor-features/src/utils/smartCardOptions.ts
			allowBlockCards: true,
			allowDatasource: true,
			allowEmbeds: true,
			resolveBeforeMacros: SMART_LINKS_BEFORE_MACROS,
			// END SECTION
		},
		sanitizePrivateContent: true,
		isFullPage: true,
	};
}
