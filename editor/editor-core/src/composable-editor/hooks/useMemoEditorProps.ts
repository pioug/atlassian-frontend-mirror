import { useMemo } from 'react';

import type { EditorNextProps, EditorProps } from '../../types/editor-props';
import { type WithAppearanceComponent } from '../../types/with-appearance-component';

export type Complete<T> = {
	[P in keyof Required<T>]: Pick<T, P> extends Required<Pick<T, P>> ? T[P] : T[P] | undefined;
};

export const useMemoEditorProps = (
	passedProps: EditorProps & EditorNextProps & WithAppearanceComponent,
) => {
	const memodProps: EditorProps & EditorNextProps & WithAppearanceComponent = useMemo(() => {
		type All = Complete<Omit<EditorNextProps, 'trackValidTransactions'>> &
			Complete<Omit<EditorProps, 'trackValidTransactions'>> &
			WithAppearanceComponent;
		// That sounds awful but this is the only way to make sure we didn't missed any EditorProps
		const allProps: All = {
			preset: passedProps.preset,
			appearance: passedProps.appearance,
			contentComponents: passedProps.contentComponents,
			primaryToolbarIconBefore: passedProps.primaryToolbarIconBefore,
			secondaryToolbarComponents: passedProps.secondaryToolbarComponents,
			persistScrollGutter: passedProps.persistScrollGutter,
			quickInsert: passedProps.quickInsert,
			shouldFocus: passedProps.shouldFocus,
			disabled: passedProps.disabled,
			contextPanel: passedProps.contextPanel,
			errorReporterHandler: passedProps.errorReporterHandler,
			contentTransformerProvider: passedProps.contentTransformerProvider,
			maxHeight: passedProps.maxHeight,
			minHeight: passedProps.minHeight,
			placeholder: passedProps.placeholder,
			placeholderBracketHint: passedProps.placeholderBracketHint,
			defaultValue: passedProps.defaultValue,
			assistiveLabel: passedProps.assistiveLabel,
			assistiveDescribedBy: passedProps.assistiveDescribedBy,
			popupsMountPoint: passedProps.popupsMountPoint,
			popupsBoundariesElement: passedProps.popupsBoundariesElement,
			popupsScrollableElement: passedProps.popupsScrollableElement,
			editorActions: passedProps.editorActions,
			onEditorReady: passedProps.onEditorReady,
			onDestroy: passedProps.onDestroy,
			onChange: passedProps.onChange,
			onCancel: passedProps.onCancel,
			extensionProviders: passedProps.extensionProviders,
			UNSAFE_useAnalyticsContext: passedProps.UNSAFE_useAnalyticsContext,
			useStickyToolbar: passedProps.useStickyToolbar,
			featureFlags: passedProps.featureFlags,
			onSave: passedProps.onSave,
			sanitizePrivateContent: passedProps.sanitizePrivateContent,
			media: passedProps.media,
			collabEdit: passedProps.collabEdit,
			primaryToolbarComponents: passedProps.primaryToolbarComponents,
			performanceTracking: passedProps.performanceTracking,
			inputSamplingLimit: passedProps.inputSamplingLimit,
			allowUndoRedoButtons: passedProps.allowUndoRedoButtons,
			linking: passedProps.linking,
			activityProvider: passedProps.activityProvider,
			searchProvider: passedProps.searchProvider,
			annotationProviders: passedProps.annotationProviders,
			collabEditProvider: passedProps.collabEditProvider,
			presenceProvider: passedProps.presenceProvider,
			emojiProvider: passedProps.emojiProvider,
			taskDecisionProvider: passedProps.taskDecisionProvider,
			legacyImageUploadProvider: passedProps.legacyImageUploadProvider,
			mentionProvider: passedProps.mentionProvider,
			autoformattingProvider: passedProps.autoformattingProvider,
			macroProvider: passedProps.macroProvider,
			contextIdentifierProvider: passedProps.contextIdentifierProvider,
			allowExpand: passedProps.allowExpand,
			allowNestedTasks: passedProps.allowNestedTasks,
			allowBlockType: passedProps.allowBlockType,
			allowTasksAndDecisions: passedProps.allowTasksAndDecisions,
			allowBreakout: passedProps.allowBreakout,
			allowRule: passedProps.allowRule,
			allowHelpDialog: passedProps.allowHelpDialog,
			allowPanel: passedProps.allowPanel,
			allowExtension: passedProps.allowExtension,
			allowConfluenceInlineComment: passedProps.allowConfluenceInlineComment,
			allowTemplatePlaceholders: passedProps.allowTemplatePlaceholders,
			allowDate: passedProps.allowDate,
			allowLayouts: passedProps.allowLayouts,
			allowStatus: passedProps.allowStatus,
			allowTextAlignment: passedProps.allowTextAlignment,
			allowIndentation: passedProps.allowIndentation,
			showIndentationButtons: passedProps.showIndentationButtons,
			allowFindReplace: passedProps.allowFindReplace,
			allowBorderMark: passedProps.allowBorderMark,
			allowFragmentMark: passedProps.allowFragmentMark,
			autoScrollIntoView: passedProps.autoScrollIntoView,
			elementBrowser: passedProps.elementBrowser,
			maxContentSize: passedProps.maxContentSize,
			saveOnEnter: passedProps.saveOnEnter,
			feedbackInfo: passedProps.feedbackInfo,
			mention: passedProps.mention,
			mentionInsertDisplayName: passedProps.mentionInsertDisplayName,
			uploadErrorHandler: passedProps.uploadErrorHandler,
			waitForMediaUpload: passedProps.waitForMediaUpload,
			extensionHandlers: passedProps.extensionHandlers,
			allowTextColor: passedProps.allowTextColor,
			allowTables: passedProps.allowTables,
			insertMenuItems: passedProps.insertMenuItems,
			UNSAFE_cards: passedProps.UNSAFE_cards,
			smartLinks: passedProps.smartLinks,
			allowAnalyticsGASV3: passedProps.allowAnalyticsGASV3,
			codeBlock: passedProps.codeBlock,
			textFormatting: passedProps.textFormatting,
			dangerouslyAppendPlugins: passedProps.dangerouslyAppendPlugins,
			__livePage: passedProps.__livePage,
			AppearanceComponent: passedProps.AppearanceComponent,
		};

		const defaultProps: Partial<EditorNextProps> = {
			appearance: 'comment',
			disabled: false,
			quickInsert: true,
		};

		const nextProps = {
			...defaultProps,
			...allProps,
		};

		return nextProps;
	}, [
		passedProps.preset,
		passedProps.appearance,
		passedProps.contentComponents,
		passedProps.primaryToolbarIconBefore,
		passedProps.secondaryToolbarComponents,
		passedProps.persistScrollGutter,
		passedProps.quickInsert,
		passedProps.shouldFocus,
		passedProps.disabled,
		passedProps.contextPanel,
		passedProps.errorReporterHandler,
		passedProps.contentTransformerProvider,
		passedProps.maxHeight,
		passedProps.minHeight,
		passedProps.placeholder,
		passedProps.placeholderBracketHint,
		passedProps.performanceTracking,
		passedProps.inputSamplingLimit,
		passedProps.defaultValue,
		passedProps.assistiveLabel,
		passedProps.assistiveDescribedBy,
		passedProps.popupsMountPoint,
		passedProps.popupsBoundariesElement,
		passedProps.popupsScrollableElement,
		passedProps.editorActions,
		passedProps.onEditorReady,
		passedProps.onDestroy,
		passedProps.onChange,
		passedProps.onCancel,
		passedProps.extensionProviders,
		passedProps.UNSAFE_useAnalyticsContext,
		passedProps.useStickyToolbar,
		passedProps.featureFlags,
		passedProps.onSave,
		passedProps.sanitizePrivateContent,
		passedProps.media,
		passedProps.collabEdit,
		passedProps.primaryToolbarComponents,
		passedProps.allowUndoRedoButtons,
		passedProps.linking,
		passedProps.activityProvider,
		passedProps.searchProvider,
		passedProps.annotationProviders,
		passedProps.collabEditProvider,
		passedProps.presenceProvider,
		passedProps.emojiProvider,
		passedProps.taskDecisionProvider,
		passedProps.legacyImageUploadProvider,
		passedProps.mentionProvider,
		passedProps.autoformattingProvider,
		passedProps.macroProvider,
		passedProps.contextIdentifierProvider,
		passedProps.allowExpand,
		passedProps.allowNestedTasks,
		passedProps.allowBlockType,
		passedProps.allowTasksAndDecisions,
		passedProps.allowBreakout,
		passedProps.allowRule,
		passedProps.allowHelpDialog,
		passedProps.allowPanel,
		passedProps.allowExtension,
		passedProps.allowConfluenceInlineComment,
		passedProps.allowTemplatePlaceholders,
		passedProps.allowDate,
		passedProps.allowLayouts,
		passedProps.allowStatus,
		passedProps.allowTextAlignment,
		passedProps.allowIndentation,
		passedProps.showIndentationButtons,
		passedProps.allowFindReplace,
		passedProps.allowBorderMark,
		passedProps.allowFragmentMark,
		passedProps.autoScrollIntoView,
		passedProps.elementBrowser,
		passedProps.maxContentSize,
		passedProps.saveOnEnter,
		passedProps.feedbackInfo,
		passedProps.mention,
		passedProps.mentionInsertDisplayName,
		passedProps.uploadErrorHandler,
		passedProps.waitForMediaUpload,
		passedProps.extensionHandlers,
		passedProps.allowTextColor,
		passedProps.allowTables,
		passedProps.insertMenuItems,
		passedProps.UNSAFE_cards,
		passedProps.smartLinks,
		passedProps.allowAnalyticsGASV3,
		passedProps.codeBlock,
		passedProps.textFormatting,
		passedProps.dangerouslyAppendPlugins,
		passedProps.__livePage,
		passedProps.AppearanceComponent,
	]);

	return memodProps;
};

export default useMemoEditorProps;
