import type { IntlShape } from 'react-intl-next';

import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type { MediaPluginOptions } from '@atlaskit/editor-plugin-media';

import type { FullPageEditorAppearance } from '../../types';

import { i18n } from './i18n';

interface Props {
	intl: IntlShape;
	options: {
		createCommentExperience: MediaPluginOptions['createCommentExperience'];
		editorAppearance: FullPageEditorAppearance;
		mediaViewerExtensions: MediaPluginOptions['mediaViewerExtensions'];
	};
	providers: {
		mediaProvider: Promise<MediaProvider> | undefined;
		syncMediaProvider: MediaProvider | undefined;
	};
}

/** Builds media plugin options from Confluence editor preset configuration. */
export function mediaPluginOptions({ intl, options, providers }: Props): MediaPluginOptions {
	return {
		// SECTION: From confluence/next/packages/editor-features/src/utils/mediaOptions.ts
		provider: providers.mediaProvider,
		syncProvider: providers.syncMediaProvider,
		allowMediaSingle: true,
		allowResizing: true,
		allowResizingInTables: true,
		allowLinking: true,
		allowAltTextOnImages: true,
		allowCaptions: true,
		allowMediaInlineImages: true,
		allowPixelResizing: true,
		altTextValidator: (text: string) => {
			// @ts-ignore - TS1501 Typescript 5.9.2 upgrade
			const storageSupports = /^([\p{L}\p{N},'\.\s\-_\(\)]|&amp;[0-9]{2};)*$/u;

			if (!storageSupports.test(text)) {
				return [intl.formatMessage(i18n.invalidAltText)];
			}

			return [];
		},
		// END SECTION
		// SECTION: From confluence/next/packages/fabric-media-support/src/mediaFeatureFlags.ts
		featureFlags: {
			mediaInline: true,
		},
		// END SECTION
		// SECTION: From confluence/next/packages/editor-presets/src/full-page/createFullPageEditorPreset.ts
		allowLazyLoading: true,
		allowBreakoutSnapPoints: true,
		allowAdvancedToolBarOptions: true,
		// originally value was Boolean(options.annotationProviders),
		allowCommentsOnMedia: true,
		allowDropzoneDropLine: true,
		allowMediaSingleEditable: true,
		allowRemoteDimensionsFetch: true,
		allowMarkingUploadsAsIncomplete: false,
		allowImagePreview: true,
		fullWidthEnabled: options.editorAppearance === 'full-width',
		createCommentExperience: options.createCommentExperience,
		editorAppearance: options.editorAppearance,
		isCopyPasteEnabled: true,
		alignLeftOnInsert: false,
		allowImageEditing: true,
		// END SECTION
		// SECTION: From confluence/next/packages/full-page-editor/src/FullPageEditorComponent.tsx
		waitForMediaUpload: true,
		// END SECTION
		mediaViewerExtensions: options.mediaViewerExtensions,
	};
}
