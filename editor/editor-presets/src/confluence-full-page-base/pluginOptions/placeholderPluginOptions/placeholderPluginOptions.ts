import type { IntlShape } from 'react-intl';

import type { DocNode } from '@atlaskit/adf-schema';
import { createADFFromHTML } from '@atlaskit/editor-common/utils/create-adf-from-html';
import type { ViewMode } from '@atlaskit/editor-plugin-editor-viewmode';
import type { PlaceholderPluginOptions } from '@atlaskit/editor-plugin-placeholder';
import { fg } from '@atlaskit/platform-feature-flags';
import { expValEquals } from '@atlaskit/tmp-editor-statsig/exp-val-equals';
import { editorExperiment } from '@atlaskit/tmp-editor-statsig/experiments';

import { i18n } from './i18n';

interface Props {
	intl: IntlShape;
	options: {
		enableLoadingSpinner?: boolean;
		isAIEnabled: boolean;
		isPlaceholderHidden?: boolean;
		isRovoLLMEnabled: boolean;
		viewMode: ViewMode | undefined;
	};
}

export function placeholderPluginOptions({ intl, options }: Props): PlaceholderPluginOptions {
	const shouldShowSpaceShortcut = options.isAIEnabled && fg('platform_editor_ai_aifc_streaming');

	const placeholder = (() => {
		// SECTION: From confluence/next/packages/full-page-editor/src/FullPageEditorComponent.tsx `const placeholderText = `
		if (options.viewMode === 'view') {
			return undefined;
		}
		// END SECTION

		// We disable the placeholder here becuase we want to use the new ADF placeholder, see below.
		if (shouldShowSpaceShortcut) {
			return undefined;
		}

		// SECTION: From confluence/next/packages/full-page-editor/src/FullPageEditorComponent.tsx `_getPlaceholderText()`
		if (!options.isAIEnabled && editorExperiment('platform_editor_ai_quickstart_command', true)) {
			return intl.formatMessage(i18n.editorEmptyDocumentPlaceholderAI);
		}

		if (editorExperiment('platform_editor_controls', 'variant1')) {
			return intl.formatMessage(i18n.defaultPlaceholder);
		}

		if (!options.isAIEnabled) {
			return intl.formatMessage(i18n.aiPlaceholder);
		}

		return intl.formatMessage(i18n.easyMentionsPlaceholder);
		// END SECTION
	})();

	const placeholderADF: DocNode | undefined = (() => {
		if (options.viewMode === 'view') {
			return undefined;
		}

		if (shouldShowSpaceShortcut && fg('platform_editor_ai_aifc_space_shortcut')) {
			return createADFFromHTML(
				intl.formatMessage(i18n.placeholderADF, {
					code: (parts) => `<code>${parts}</code>`,
				}),
			);
		}
		return undefined;
	})();

	return {
		placeholder,
		placeholderADF,
		isPlaceholderHidden: options.isPlaceholderHidden,
		withEmptyParagraph: fg('platform_editor_ai_aifc_streaming'),
		isRovoLLMEnabled: options.isRovoLLMEnabled,
		enableLoadingSpinner:
			options.enableLoadingSpinner ??
			expValEquals('confluence_load_editor_title_on_transition', 'contentPlaceholder', true),
	};
}
