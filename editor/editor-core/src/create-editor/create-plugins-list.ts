import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { EditorPluginInjectionAPI, EditorPresetBuilder } from '@atlaskit/editor-common/preset';
import type { ScrollGutterPluginOptions } from '@atlaskit/editor-plugins/base';
import type { BlockTypePluginOptions } from '@atlaskit/editor-plugins/block-type';

import type { DefaultPresetPluginOptions } from '../../src/presets/default';
import type { EditorPlugin, EditorProps } from '../types';
import type { EditorPluginFeatureProps } from '../types/editor-props';
import { isFullPage as fullPageCheck } from '../utils/is-full-page';

import { createFeatureFlagsFromProps } from './feature-flags-from-props';

const GUTTER_SIZE_MOBILE_IN_PX = 36; // Gutter size for Mobile

const isCodeBlockAllowed = (options?: Pick<BlockTypePluginOptions, 'allowBlockType'>) => {
	const exclude =
		options && options.allowBlockType && options.allowBlockType.exclude
			? options.allowBlockType.exclude
			: [];

	return exclude.indexOf('codeBlock') === -1;
};

export function getScrollGutterOptions(props: EditorProps): ScrollGutterPluginOptions | undefined {
	const { appearance, persistScrollGutter } = props;

	if (fullPageCheck(appearance)) {
		// Full Page appearance uses a scrollable div wrapper.
		return {
			getScrollElement: () => document.querySelector('.fabric-editor-popup-scroll-parent'),
		};
	}
	if (appearance === 'mobile') {
		// Mobile appearance uses body scrolling for improved performance on low powered devices.
		return {
			getScrollElement: () => document.body,
			allowCustomScrollHandler: false,
			persistScrollGutter,
			gutterSize: GUTTER_SIZE_MOBILE_IN_PX,
		};
	}
	return undefined;
}

export function getDefaultPresetOptionsFromEditorProps(
	props: EditorProps,
	createAnalyticsEvent?: CreateUIAnalyticsEvent,
	// Omit placeholder since it's an existing prop in `DefaultPresetPluginOptions` and will get overidden there
): DefaultPresetPluginOptions & Omit<EditorPluginFeatureProps, 'placeholder'> {
	const appearance = props.appearance;
	const isMobile = appearance === 'mobile';

	const inputTracking = props.performanceTracking?.inputTracking;
	const cardOptions = props.linking?.smartLinks || props.smartLinks || props.UNSAFE_cards;

	return {
		...props,
		createAnalyticsEvent,
		typeAhead: {
			isMobile,
		},
		featureFlags: createFeatureFlagsFromProps(props),
		paste: {
			cardOptions,
			sanitizePrivateContent: props.sanitizePrivateContent,
		},
		base: {
			allowInlineCursorTarget: !isMobile,
			allowScrollGutter: getScrollGutterOptions(props),
			inputTracking,
			browserFreezeTracking: props.performanceTracking?.bFreezeTracking,
			ufo: createFeatureFlagsFromProps(props).ufo,
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
			disableDefaultItems: isMobile,
			headless: isMobile,
			emptyStateHandler: props.elementBrowser && props.elementBrowser.emptyStateHandler,
		},
		selection: { useLongPressSelection: false },
		hyperlinkOptions: {
			editorAppearance: props.appearance,
			linkPicker: props.linking?.linkPicker,
			onClickCallback: cardOptions?.onClickCallback,
			platform: isMobile ? 'mobile' : 'web',
		},
		codeBlock: {
			...props.codeBlock,
			useLongPressSelection: false,
			allowCompositionInputOverride: isMobile,
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
	preset: EditorPresetBuilder<any, any>,
	props: EditorProps,
	pluginInjectionAPI?: EditorPluginInjectionAPI,
): EditorPlugin[] {
	const excludes = new Set<string>();

	if (!isCodeBlockAllowed({ allowBlockType: props.allowBlockType })) {
		excludes.add('codeBlock');
	}
	return preset.build({ pluginInjectionAPI, excludePlugins: excludes });
}
