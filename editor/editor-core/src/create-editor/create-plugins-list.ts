import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next/types';
import type { EditorPluginInjectionAPI, EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { EditorPlugin } from '@atlaskit/editor-common/types';
import type { ScrollGutterPluginOptions } from '@atlaskit/editor-plugins/base';
import type { BlockTypePluginOptions } from '@atlaskit/editor-plugins/block-type';

import type { DefaultPresetPluginOptions } from '../../src/presets/default';
import type { EditorProps } from '../types';
import type { EditorPluginFeatureProps } from '../types/editor-props';
import { createFeatureFlagsFromProps } from '../utils/feature-flags-from-props';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';

const isCodeBlockAllowed = (options?: Pick<BlockTypePluginOptions, 'allowBlockType'>) => {
	const exclude =
		options && options.allowBlockType && options.allowBlockType.exclude
			? options.allowBlockType.exclude
			: [];

	return exclude.indexOf('codeBlock') === -1;
};

export function getScrollGutterOptions(props: EditorProps): ScrollGutterPluginOptions | undefined {
	const { appearance } = props;

	if (fullPageCheck(appearance)) {
		// Full Page appearance uses a scrollable div wrapper.
		return {
			getScrollElement: () => document.querySelector('.fabric-editor-popup-scroll-parent'),
		};
	}
	return undefined;
}

export function getDefaultPresetOptionsFromEditorProps(
	props: EditorProps,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
	// Omit placeholder since it's an existing prop in `DefaultPresetPluginOptions` and will get overridden there
): DefaultPresetPluginOptions & Omit<EditorPluginFeatureProps, 'placeholder'> {
	const appearance = props.appearance;

	const cardOptions = props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards;

	return {
		...props,
		createAnalyticsEvent,
		typeAhead: {
			isMobile: false,
		},
		featureFlags: createFeatureFlagsFromProps(props.featureFlags),
		paste: {
			cardOptions,
			sanitizePrivateContent: props.sanitizePrivateContent,
			pasteWarningOptions: props.pasteWarningOptions,
		},
		base: {
			allowInlineCursorTarget: true,
			allowScrollGutter: getScrollGutterOptions(props),
		},
		blockType: {
			lastNodeMustBeParagraph: appearance === 'comment' || appearance === 'chromeless',
			allowBlockType: props.allowBlockType,
			isUndoRedoButtonsEnabled: props.allowUndoRedoButtons,
		},
		placeholder: {
			placeholder: props.placeholder,
			placeholderBracketHint: props.placeholderBracketHint,
		},
		textFormatting: {
			...(props.textFormatting || {}),
			responsiveToolbarMenu:
				props.textFormatting?.responsiveToolbarMenu != null
					? props.textFormatting.responsiveToolbarMenu
					: props.allowUndoRedoButtons,
		},
		submitEditor: props.onSave,
		quickInsert: {
			enableElementBrowser: props.elementBrowser && props.elementBrowser.showModal,
			elementBrowserHelpUrl: props.elementBrowser && props.elementBrowser.helpUrl,
			disableDefaultItems:
				(props.quickInsert &&
					typeof props.quickInsert !== 'boolean' &&
					props.quickInsert.disableDefaultItems) ||
				false,
			headless: false,
			emptyStateHandler: props.elementBrowser && props.elementBrowser.emptyStateHandler,
			prioritySortingFn:
				(props.quickInsert &&
					typeof props.quickInsert !== 'boolean' &&
					props.quickInsert.prioritySortingFn) ||
				undefined,
			onInsert:
				(props.quickInsert &&
					typeof props.quickInsert !== 'boolean' &&
					props.quickInsert.onInsert) ||
				undefined,
		},
		selection: { useLongPressSelection: false },
		hyperlinkOptions: {
			editorAppearance: props.appearance,
			linkPicker: props.linking?.linkPicker,
			onClickCallback: cardOptions?.onClickCallback,
			platform: 'web',
			autoLinkOnBlur: props.linking?.autoLinkOnBlur,
		},
		codeBlock: {
			...props.codeBlock,
			useLongPressSelection: false,
			allowCompositionInputOverride: false,
		},
	};
}

/**
 * Maps EditorProps to EditorPlugins
 *
 * Note: The order that presets are added determines
 * their placement in the editor toolbar.
 */
export default function createPluginsList(
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	preset: EditorPresetBuilder<any, any>,
	props: Pick<EditorProps, 'allowBlockType'>,
	pluginInjectionAPI?: EditorPluginInjectionAPI,
): EditorPlugin[] {
	const excludes = new Set<string>();

	if (!isCodeBlockAllowed({ allowBlockType: props.allowBlockType })) {
		excludes.add('codeBlock');
	}
	return preset.build({ pluginInjectionAPI, excludePlugins: excludes });
}
