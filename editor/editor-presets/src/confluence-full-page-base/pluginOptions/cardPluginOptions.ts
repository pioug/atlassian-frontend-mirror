import type { OnClickCallback } from '@atlaskit/editor-common/card';
import { isSSR } from '@atlaskit/editor-common/core-utils';
import type { CardProvider } from '@atlaskit/editor-common/provider-factory';
import type { LinkPickerOptions } from '@atlaskit/editor-common/types';
import type { CardPluginOptions } from '@atlaskit/editor-plugin-card';

import type { FullPageEditorAppearance } from '../types';

// SECTION: From confluence/next/packages/editor-features/src/utils/smartCardOptions.ts
/**
 * Supported Jira URLs and Jira Roadmap URLs, GDrive and ODFB will become Smart Links
 * (only supports Cloud single-issue URLs right now)
 */
const SMART_LINKS_BEFORE_MACROS =
	'jira,jiraroadmap,google-drive-sheets,google-drive-docs,OneDrive,google-drive-slides'.split(',');
// END SECTION

interface Props {
	options: {
		__livePage: boolean | undefined;
		CompetitorPrompt?: React.ComponentType<{ linkType?: string; sourceUrl: string }>;
		editorAppearance: FullPageEditorAppearance;
		linkPicker: LinkPickerOptions | undefined;
		onClickCallback: OnClickCallback | undefined;
	};
	providers: {
		cardProvider: Promise<CardProvider> | undefined;
	};
}

declare global {
	interface Window {
		__SSR_RENDERED__?: boolean;
	}
}

/**
 *
 * @param root0
 * @param root0.options
 * @param root0.providers
 * @example
 */
export function cardPluginOptions({ options, providers }: Props): CardPluginOptions {
	return {
		// From confluence/next/packages/full-page-editor/src/FullPageEditorComponent.tsx `CARD_OPTIONS =`
		allowDatasource: true,
		// END SECTION
		// SECTION: From confluence/next/packages/editor-features/src/utils/smartCardOptions.ts
		provider: providers.cardProvider,
		resolveBeforeMacros: SMART_LINKS_BEFORE_MACROS,
		allowBlockCards: true,
		allowEmbeds: true,
		// END SECTION
		onClickCallback: options.onClickCallback,
		fullWidthMode: options.editorAppearance === 'full-width',
		linkPicker: options.linkPicker,
		// SECTION: From confluence/next/packages/editor-features/src/hooks/useEditorFeatureFlags.ts
		lpLinkPicker: true,
		// END SECTION
		editorAppearance: options.editorAppearance,
		// @ts-ignore Temporary solution to check for Live Page editor.
		__livePage: options.__livePage,
		isPageSSRed: Boolean(isSSR() || window.__SSR_RENDERED__),
		CompetitorPrompt: options.CompetitorPrompt,
	};
}
