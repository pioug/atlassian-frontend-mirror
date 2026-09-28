import { wb, type WorkbenchExample } from '@atlassian/workbench';

import { default as KitchenSinkExample } from './0-kitchen-sink';
import { default as BasicComposableEditorExample } from './1-basic-composable-editor';
import { default as ChromelessEditorComponentComposableExample } from './1-chromeless-editor-component-composable';
import { default as CommentEditorComponentComposableExample } from './1-comment-editor-component-composable';
import { default as ComposableEditorCustomToolbarExample } from './1-composable-editor-custom-toolbar';
import { default as ComposableEditorOnBlurExample } from './1-composable-editor-on-blur';
import { default as FullPageEditorComposableExample } from './1-full-page-editor-composable';
import { default as LabsAsyncCollapsedEditorExample } from './1-labs-async-collapsed-editor';
import { default as LazyNodeExampleExample } from './1-lazy-node-example';
import { default as LegacyEditorMigratorExample } from './1-legacy-editor-migrator';
import { default as LiveViewComposableEditorExample } from './1-live-view-composable-editor';
import { default as CommentExample } from './2-comment';
import { default as CommentBitbucketExample } from './2-comment-bitbucket';
import { default as CommentConfluenceExample } from './2-comment-confluence';
import { default as CommentJiraBentoExample } from './2-comment-jira-bento';
import { default as CommentMaxContentSizeExample } from './2-comment-max-content-size';
import { default as CommentWithJiraCardsExample } from './2-comment-with-jira-cards';
import { default as CommentWithResizingExample } from './2-comment-with-resizing';
import { default as ConfluenceBasicExample } from './2-confluence-basic';
import { default as CollabExample } from './3-collab';
import { default as SsrTablesExample } from './4-ssr-tables';
import { default as FullPageExample } from './5-full-page';
import { default as FullPageCompanyHubExample } from './5-full-page-company-hub';
import { default as FullPageConfluenceExample } from './5-full-page-confluence';
import { default as FullPageConfluenceHydratableExample } from './5-full-page-confluence-hydratable';
import { default as FullPageConfluenceLimitedModeExample } from './5-full-page-confluence-limited-mode';
import { default as FullPageMinimalExample } from './5-full-page-minimal';
import { default as FullPageTemplateContextPanelExample } from './5-full-page-template-context-panel';
import { default as FullPageTemplateContextPanelAlwaysOpenExample } from './5-full-page-template-context-panel-always-open';
import { default as FullPageWithConfluenceFlexibleBlockCardsExample } from './5-full-page-with-confluence-flexible-block-cards';
import { default as FullPageWithConfluenceLazySmartCardsExample } from './5-full-page-with-confluence-lazy-smart-cards';
import { default as FullPageWithConfluenceSmartCardsExample } from './5-full-page-with-confluence-smart-cards';
import { default as FullPageWithContentExample } from './5-full-page-with-content';
import { default as FullPageWithContentDisabledFlexiTablesExample } from './5-full-page-with-content-disabled-flexi-tables';
import { default as FullPageWithCustomPanelExample } from './5-full-page-with-custom-panel';
import { default as FullPageWithCustomStepsExample } from './5-full-page-with-custom-steps';
import { default as FullPageWithInviteFromMentionExample } from './5-full-page-with-invite-from-mention';
import { default as FullPageWithMediaCaptionExample } from './5-full-page-with-media-caption';
import { default as FullPageWithMediaCaptionDisabledExample } from './5-full-page-with-media-caption-disabled';
import { default as FullPageWithMediaPluginsExample } from './5-full-page-with-media-plugins';
import { default as FullPageWithToolbarExample } from './5-full-page-with-toolbar';
import { default as FullPageWithXExtensionsExample } from './5-full-page-with-x-extensions';
import { default as FullPageWithoutEditCustomPanelExample } from './5-full-page-without-edit-custom-panel';
import { default as CopyPasteExample } from './6-copy-paste';
import { default as ChromelessExample } from './10-chromeless';
import { default as CustomDropzoneExample } from './11-custom-dropzone';
import { default as PopupsExample } from './12-popups';
import { default as JsonSchemaExample } from './13-json-schema';
import { default as OverrideLanguageNamesExample } from './14-override-language-names';
import { default as ExternalMediaUrlsExample } from './15-external-media-urls';
import { default as ValidateSmartValueExample } from './16-validate-smart-value';
import { default as TablePerfTestExample } from './18-table-perf-test';
import { default as TableRowShufflerExample } from './19-table-row-shuffler';
import { default as CollaborativeEditingExample } from './21-collaborative-editing';
import { default as DiffingExample } from './23-diffing';
import { default as DocBuilderExample } from './25-doc-builder';
import { default as FullPageLagLabExample } from './25-full-page-lag-lab';
import { default as AnnotationExperimentExample } from './26-annotation-experiment';
import { default as AnnotationsSimplifiedExample } from './26-annotations-simplified';
import { default as AnnotationsWithManagerExample } from './26-annotations-with-manager';
import { default as ScaledEditorsExample } from './27-scaled-editors';
import { default as ElementBrowserExample } from './29-element-browser';
import { default as JiraCloneExample } from './30-jira-clone';
import { default as AdfViewerDACExample } from './31-adf-viewer-DAC';
import { default as FullPageClickToEditExample } from './32-full-page-click-to-edit';
import { default as JiraCloneRightPanelExample } from './33-jira-clone-right-panel';
import { default as BasicCompiledHydrationExample } from './40-basic-compiled-hydration';
import { default as MentionsProfileCardOptionsExample } from './41-mentions-profile-card-options';
import { default as CopyPasteTestingExample } from './99-copy-paste-testing';
import { default as LibraExample } from './99-libra';
import { default as LibraComposableEditorExample } from './99-libra-composable-editor';
import { default as LibraConfluenceFullPageEditorExample } from './99-libra-confluence-full-page-editor';
import { default as LibraNcsViewModeExample } from './99-libra-ncs-view-mode';
import { default as MultiFormatStreamingExample } from './99-multi-format-streaming';
import { default as RovodevExample } from './99-rovodev';
import { default as TestingExample } from './99-testing';
import { default as VrTestingExample } from './99-vr-testing';
import { default as EditorCommentInModalExample } from './999-editor-comment-in-modal';
import { default as ResizerBasicExample } from './1000-resizer-basic';
import { default as ResizerStickyScrollExample } from './1000-resizer-sticky-scroll';

export const KitchenSink: WorkbenchExample<typeof KitchenSinkExample> = wb(KitchenSinkExample);
export const BasicComposableEditor: WorkbenchExample<typeof BasicComposableEditorExample> = wb(
	BasicComposableEditorExample,
);
export const ChromelessEditorComponentComposable: WorkbenchExample<
	typeof ChromelessEditorComponentComposableExample
> = wb(ChromelessEditorComponentComposableExample);
export const CommentEditorComponentComposable: WorkbenchExample<
	typeof CommentEditorComponentComposableExample
> = wb(CommentEditorComponentComposableExample);
export const ComposableEditorCustomToolbar: WorkbenchExample<
	typeof ComposableEditorCustomToolbarExample
> = wb(ComposableEditorCustomToolbarExample);
export const ComposableEditorOnBlur: WorkbenchExample<typeof ComposableEditorOnBlurExample> = wb(
	ComposableEditorOnBlurExample,
);
export const FullPageEditorComposable: WorkbenchExample<typeof FullPageEditorComposableExample> =
	wb(FullPageEditorComposableExample);
export const LabsAsyncCollapsedEditor: WorkbenchExample<typeof LabsAsyncCollapsedEditorExample> =
	wb(LabsAsyncCollapsedEditorExample);
export const LazyNodeExample: WorkbenchExample<typeof LazyNodeExampleExample> =
	wb(LazyNodeExampleExample);
export const LegacyEditorMigrator: WorkbenchExample<typeof LegacyEditorMigratorExample> = wb(
	LegacyEditorMigratorExample,
);
export const LiveViewComposableEditor: WorkbenchExample<typeof LiveViewComposableEditorExample> =
	wb(LiveViewComposableEditorExample);
export const Chromeless: WorkbenchExample<typeof ChromelessExample> = wb(ChromelessExample);
export const ResizerBasic: WorkbenchExample<typeof ResizerBasicExample> = wb(ResizerBasicExample);
export const ResizerStickyScroll: WorkbenchExample<typeof ResizerStickyScrollExample> = wb(
	ResizerStickyScrollExample,
);
export const CustomDropzone: WorkbenchExample<typeof CustomDropzoneExample> =
	wb(CustomDropzoneExample);
export const Popups: WorkbenchExample<typeof PopupsExample> = wb(PopupsExample);
export const JsonSchema: WorkbenchExample<typeof JsonSchemaExample> = wb(JsonSchemaExample);
export const OverrideLanguageNames: WorkbenchExample<typeof OverrideLanguageNamesExample> = wb(
	OverrideLanguageNamesExample,
);
export const ExternalMediaUrls: WorkbenchExample<typeof ExternalMediaUrlsExample> =
	wb(ExternalMediaUrlsExample);
export const ValidateSmartValue: WorkbenchExample<typeof ValidateSmartValueExample> =
	wb(ValidateSmartValueExample);
export const TablePerfTest: WorkbenchExample<typeof TablePerfTestExample> =
	wb(TablePerfTestExample);
export const TableRowShuffler: WorkbenchExample<typeof TableRowShufflerExample> =
	wb(TableRowShufflerExample);
export const CommentBitbucket: WorkbenchExample<typeof CommentBitbucketExample> =
	wb(CommentBitbucketExample);
export const CommentConfluence: WorkbenchExample<typeof CommentConfluenceExample> =
	wb(CommentConfluenceExample);
export const CommentJiraBento: WorkbenchExample<typeof CommentJiraBentoExample> =
	wb(CommentJiraBentoExample);
export const CommentMaxContentSize: WorkbenchExample<typeof CommentMaxContentSizeExample> = wb(
	CommentMaxContentSizeExample,
);
export const CommentWithJiraCards: WorkbenchExample<typeof CommentWithJiraCardsExample> = wb(
	CommentWithJiraCardsExample,
);
export const CommentWithResizing: WorkbenchExample<typeof CommentWithResizingExample> = wb(
	CommentWithResizingExample,
);
export const Comment: WorkbenchExample<typeof CommentExample> = wb(CommentExample);
export const ConfluenceBasic: WorkbenchExample<typeof ConfluenceBasicExample> =
	wb(ConfluenceBasicExample);
export const CollaborativeEditing: WorkbenchExample<typeof CollaborativeEditingExample> = wb(
	CollaborativeEditingExample,
);
export const Diffing: WorkbenchExample<typeof DiffingExample> = wb(DiffingExample);
export const DocBuilder: WorkbenchExample<typeof DocBuilderExample> = wb(DocBuilderExample);
export const FullPageLagLab: WorkbenchExample<typeof FullPageLagLabExample> =
	wb(FullPageLagLabExample);
export const AnnotationExperiment: WorkbenchExample<typeof AnnotationExperimentExample> = wb(
	AnnotationExperimentExample,
);
export const AnnotationsSimplified: WorkbenchExample<typeof AnnotationsSimplifiedExample> = wb(
	AnnotationsSimplifiedExample,
);
export const AnnotationsWithManager: WorkbenchExample<typeof AnnotationsWithManagerExample> = wb(
	AnnotationsWithManagerExample,
);
export const ScaledEditors: WorkbenchExample<typeof ScaledEditorsExample> =
	wb(ScaledEditorsExample);
export const ElementBrowser: WorkbenchExample<typeof ElementBrowserExample> =
	wb(ElementBrowserExample);
export const Collab: WorkbenchExample<typeof CollabExample> = wb(CollabExample);
export const JiraClone: WorkbenchExample<typeof JiraCloneExample> = wb(JiraCloneExample);
export const AdfViewerDAC: WorkbenchExample<typeof AdfViewerDACExample> = wb(AdfViewerDACExample);
export const FullPageClickToEdit: WorkbenchExample<typeof FullPageClickToEditExample> = wb(
	FullPageClickToEditExample,
);
export const JiraCloneRightPanel: WorkbenchExample<typeof JiraCloneRightPanelExample> = wb(
	JiraCloneRightPanelExample,
);
export const SsrTables: WorkbenchExample<typeof SsrTablesExample> = wb(SsrTablesExample);
export const BasicCompiledHydration: WorkbenchExample<typeof BasicCompiledHydrationExample> = wb(
	BasicCompiledHydrationExample,
);
export const MentionsProfileCardOptions: WorkbenchExample<
	typeof MentionsProfileCardOptionsExample
> = wb(MentionsProfileCardOptionsExample);
export const FullPageCompanyHub: WorkbenchExample<typeof FullPageCompanyHubExample> =
	wb(FullPageCompanyHubExample);
export const FullPageConfluenceHydratable: WorkbenchExample<
	typeof FullPageConfluenceHydratableExample
> = wb(FullPageConfluenceHydratableExample);
export const FullPageConfluenceLimitedMode: WorkbenchExample<
	typeof FullPageConfluenceLimitedModeExample
> = wb(FullPageConfluenceLimitedModeExample);
export const FullPageConfluence: WorkbenchExample<typeof FullPageConfluenceExample> =
	wb(FullPageConfluenceExample);
export const FullPageMinimal: WorkbenchExample<typeof FullPageMinimalExample> =
	wb(FullPageMinimalExample);
export const FullPageTemplateContextPanelAlwaysOpen: WorkbenchExample<
	typeof FullPageTemplateContextPanelAlwaysOpenExample
> = wb(FullPageTemplateContextPanelAlwaysOpenExample);
export const FullPageTemplateContextPanel: WorkbenchExample<
	typeof FullPageTemplateContextPanelExample
> = wb(FullPageTemplateContextPanelExample);
export const FullPageWithConfluenceFlexibleBlockCards: WorkbenchExample<
	typeof FullPageWithConfluenceFlexibleBlockCardsExample
> = wb(FullPageWithConfluenceFlexibleBlockCardsExample);
export const FullPageWithConfluenceLazySmartCards: WorkbenchExample<
	typeof FullPageWithConfluenceLazySmartCardsExample
> = wb(FullPageWithConfluenceLazySmartCardsExample);
export const FullPageWithConfluenceSmartCards: WorkbenchExample<
	typeof FullPageWithConfluenceSmartCardsExample
> = wb(FullPageWithConfluenceSmartCardsExample);
export const FullPageWithContentDisabledFlexiTables: WorkbenchExample<
	typeof FullPageWithContentDisabledFlexiTablesExample
> = wb(FullPageWithContentDisabledFlexiTablesExample);
export const FullPageWithContent: WorkbenchExample<typeof FullPageWithContentExample> = wb(
	FullPageWithContentExample,
);
export const FullPageWithCustomPanel: WorkbenchExample<typeof FullPageWithCustomPanelExample> = wb(
	FullPageWithCustomPanelExample,
);
export const FullPageWithCustomSteps: WorkbenchExample<typeof FullPageWithCustomStepsExample> = wb(
	FullPageWithCustomStepsExample,
);
export const FullPageWithInviteFromMention: WorkbenchExample<
	typeof FullPageWithInviteFromMentionExample
> = wb(FullPageWithInviteFromMentionExample);
export const FullPageWithMediaCaptionDisabled: WorkbenchExample<
	typeof FullPageWithMediaCaptionDisabledExample
> = wb(FullPageWithMediaCaptionDisabledExample);
export const FullPageWithMediaCaption: WorkbenchExample<typeof FullPageWithMediaCaptionExample> =
	wb(FullPageWithMediaCaptionExample);
export const FullPageWithMediaPlugins: WorkbenchExample<typeof FullPageWithMediaPluginsExample> =
	wb(FullPageWithMediaPluginsExample);
export const FullPageWithToolbar: WorkbenchExample<typeof FullPageWithToolbarExample> = wb(
	FullPageWithToolbarExample,
);
export const FullPageWithXExtensions: WorkbenchExample<typeof FullPageWithXExtensionsExample> = wb(
	FullPageWithXExtensionsExample,
);
export const FullPageWithoutEditCustomPanel: WorkbenchExample<
	typeof FullPageWithoutEditCustomPanelExample
> = wb(FullPageWithoutEditCustomPanelExample);
export const FullPage: WorkbenchExample<typeof FullPageExample> = wb(FullPageExample);
export const CopyPaste: WorkbenchExample<typeof CopyPasteExample> = wb(CopyPasteExample);
export const CopyPasteTesting: WorkbenchExample<typeof CopyPasteTestingExample> =
	wb(CopyPasteTestingExample);
export const LibraComposableEditor: WorkbenchExample<typeof LibraComposableEditorExample> = wb(
	LibraComposableEditorExample,
);
export const LibraConfluenceFullPageEditor: WorkbenchExample<
	typeof LibraConfluenceFullPageEditorExample
> = wb(LibraConfluenceFullPageEditorExample);
export const LibraNcsViewMode: WorkbenchExample<typeof LibraNcsViewModeExample> =
	wb(LibraNcsViewModeExample);
export const Libra: WorkbenchExample<typeof LibraExample> = wb(LibraExample);
export const MultiFormatStreaming: WorkbenchExample<typeof MultiFormatStreamingExample> = wb(
	MultiFormatStreamingExample,
);
export const Rovodev: WorkbenchExample<typeof RovodevExample> = wb(RovodevExample);
export const Testing: WorkbenchExample<typeof TestingExample> = wb(TestingExample);
export const VrTesting: WorkbenchExample<typeof VrTestingExample> = wb(VrTestingExample);
export const EditorCommentInModal: WorkbenchExample<typeof EditorCommentInModalExample> = wb(
	EditorCommentInModalExample,
);
