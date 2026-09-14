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
import { default as ChromelessExample } from './10-chromeless';
import { default as ResizerBasicExample } from './1000-resizer-basic';
import { default as ResizerStickyScrollExample } from './1000-resizer-sticky-scroll';
import { default as CustomDropzoneExample } from './11-custom-dropzone';
import { default as PopupsExample } from './12-popups';
import { default as JsonSchemaExample } from './13-json-schema';
import { default as OverrideLanguageNamesExample } from './14-override-language-names';
import { default as ExternalMediaUrlsExample } from './15-external-media-urls';
import { default as ValidateSmartValueExample } from './16-validate-smart-value';
import { default as TablePerfTestExample } from './18-table-perf-test';
import { default as TableRowShufflerExample } from './19-table-row-shuffler';
import { default as CommentBitbucketExample } from './2-comment-bitbucket';
import { default as CommentConfluenceExample } from './2-comment-confluence';
import { default as CommentJiraBentoExample } from './2-comment-jira-bento';
import { default as CommentMaxContentSizeExample } from './2-comment-max-content-size';
import { default as CommentWithJiraCardsExample } from './2-comment-with-jira-cards';
import { default as CommentWithResizingExample } from './2-comment-with-resizing';
import { default as CommentExample } from './2-comment';
import { default as ConfluenceBasicExample } from './2-confluence-basic';
import { default as CollaborativeEditingExample } from './21-collaborative-editing';
import { default as DiffingExample } from './23-diffing';
import { default as DocBuilderExample } from './25-doc-builder';
import { default as FullPageLagLabExample } from './25-full-page-lag-lab';
import { default as AnnotationExperimentExample } from './26-annotation-experiment';
import { default as AnnotationsSimplifiedExample } from './26-annotations-simplified';
import { default as AnnotationsWithManagerExample } from './26-annotations-with-manager';
import { default as ScaledEditorsExample } from './27-scaled-editors';
import { default as ElementBrowserExample } from './29-element-browser';
import { default as CollabExample } from './3-collab';
import { default as JiraCloneExample } from './30-jira-clone';
import { default as AdfViewerDACExample } from './31-adf-viewer-DAC';
import { default as FullPageClickToEditExample } from './32-full-page-click-to-edit';
import { default as JiraCloneRightPanelExample } from './33-jira-clone-right-panel';
import { default as SsrTablesExample } from './4-ssr-tables';
import { default as BasicCompiledHydrationExample } from './40-basic-compiled-hydration';
import { default as MentionsProfileCardOptionsExample } from './41-mentions-profile-card-options';
import { default as FullPageCompanyHubExample } from './5-full-page-company-hub';
import { default as FullPageConfluenceHydratableExample } from './5-full-page-confluence-hydratable';
import { default as FullPageConfluenceLimitedModeExample } from './5-full-page-confluence-limited-mode';
import { default as FullPageConfluenceExample } from './5-full-page-confluence';
import { default as FullPageMinimalExample } from './5-full-page-minimal';
import { default as FullPageTemplateContextPanelAlwaysOpenExample } from './5-full-page-template-context-panel-always-open';
import { default as FullPageTemplateContextPanelExample } from './5-full-page-template-context-panel';
import { default as FullPageWithConfluenceFlexibleBlockCardsExample } from './5-full-page-with-confluence-flexible-block-cards';
import { default as FullPageWithConfluenceLazySmartCardsExample } from './5-full-page-with-confluence-lazy-smart-cards';
import { default as FullPageWithConfluenceSmartCardsExample } from './5-full-page-with-confluence-smart-cards';
import { default as FullPageWithContentDisabledFlexiTablesExample } from './5-full-page-with-content-disabled-flexi-tables';
import { default as FullPageWithContentExample } from './5-full-page-with-content';
import { default as FullPageWithCustomPanelExample } from './5-full-page-with-custom-panel';
import { default as FullPageWithCustomStepsExample } from './5-full-page-with-custom-steps';
import { default as FullPageWithInviteFromMentionExample } from './5-full-page-with-invite-from-mention';
import { default as FullPageWithMediaCaptionDisabledExample } from './5-full-page-with-media-caption-disabled';
import { default as FullPageWithMediaCaptionExample } from './5-full-page-with-media-caption';
import { default as FullPageWithMediaPluginsExample } from './5-full-page-with-media-plugins';
import { default as FullPageWithToolbarExample } from './5-full-page-with-toolbar';
import { default as FullPageWithXExtensionsExample } from './5-full-page-with-x-extensions';
import { default as FullPageWithoutEditCustomPanelExample } from './5-full-page-without-edit-custom-panel';
import { default as FullPageExample } from './5-full-page';
import { default as CopyPasteExample } from './6-copy-paste';
import { default as CopyPasteTestingExample } from './99-copy-paste-testing';
import { default as LibraComposableEditorExample } from './99-libra-composable-editor';
import { default as LibraConfluenceFullPageEditorExample } from './99-libra-confluence-full-page-editor';
import { default as LibraNcsViewModeExample } from './99-libra-ncs-view-mode';
import { default as LibraExample } from './99-libra';
import { default as MultiFormatStreamingExample } from './99-multi-format-streaming';
import { default as RovodevExample } from './99-rovodev';
import { default as TestingExample } from './99-testing';
import { default as VrTestingExample } from './99-vr-testing';
import { default as EditorCommentInModalExample } from './999-editor-comment-in-modal';

export const KitchenSink: WorkbenchExample = wb(KitchenSinkExample);
export const BasicComposableEditor: WorkbenchExample = wb(BasicComposableEditorExample);
export const ChromelessEditorComponentComposable: WorkbenchExample = wb(
	ChromelessEditorComponentComposableExample,
);
export const CommentEditorComponentComposable: WorkbenchExample = wb(
	CommentEditorComponentComposableExample,
);
export const ComposableEditorCustomToolbar: WorkbenchExample = wb(
	ComposableEditorCustomToolbarExample,
);
export const ComposableEditorOnBlur: WorkbenchExample = wb(ComposableEditorOnBlurExample);
export const FullPageEditorComposable: WorkbenchExample = wb(FullPageEditorComposableExample);
export const LabsAsyncCollapsedEditor: WorkbenchExample = wb(LabsAsyncCollapsedEditorExample);
export const LazyNodeExample: WorkbenchExample = wb(LazyNodeExampleExample);
export const LegacyEditorMigrator: WorkbenchExample = wb(LegacyEditorMigratorExample);
export const LiveViewComposableEditor: WorkbenchExample = wb(LiveViewComposableEditorExample);
export const Chromeless: WorkbenchExample = wb(ChromelessExample);
export const ResizerBasic: WorkbenchExample = wb(ResizerBasicExample);
export const ResizerStickyScroll: WorkbenchExample = wb(ResizerStickyScrollExample);
export const CustomDropzone: WorkbenchExample = wb(CustomDropzoneExample);
export const Popups: WorkbenchExample = wb(PopupsExample);
export const JsonSchema: WorkbenchExample = wb(JsonSchemaExample);
export const OverrideLanguageNames: WorkbenchExample = wb(OverrideLanguageNamesExample);
export const ExternalMediaUrls: WorkbenchExample = wb(ExternalMediaUrlsExample);
export const ValidateSmartValue: WorkbenchExample = wb(ValidateSmartValueExample);
export const TablePerfTest: WorkbenchExample = wb(TablePerfTestExample);
export const TableRowShuffler: WorkbenchExample = wb(TableRowShufflerExample);
export const CommentBitbucket: WorkbenchExample = wb(CommentBitbucketExample);
export const CommentConfluence: WorkbenchExample = wb(CommentConfluenceExample);
export const CommentJiraBento: WorkbenchExample = wb(CommentJiraBentoExample);
export const CommentMaxContentSize: WorkbenchExample = wb(CommentMaxContentSizeExample);
export const CommentWithJiraCards: WorkbenchExample = wb(CommentWithJiraCardsExample);
export const CommentWithResizing: WorkbenchExample = wb(CommentWithResizingExample);
export const Comment: WorkbenchExample = wb(CommentExample);
export const ConfluenceBasic: WorkbenchExample = wb(ConfluenceBasicExample);
export const CollaborativeEditing: WorkbenchExample = wb(CollaborativeEditingExample);
export const Diffing: WorkbenchExample = wb(DiffingExample);
export const DocBuilder: WorkbenchExample = wb(DocBuilderExample);
export const FullPageLagLab: WorkbenchExample = wb(FullPageLagLabExample);
export const AnnotationExperiment: WorkbenchExample = wb(AnnotationExperimentExample);
export const AnnotationsSimplified: WorkbenchExample = wb(AnnotationsSimplifiedExample);
export const AnnotationsWithManager: WorkbenchExample = wb(AnnotationsWithManagerExample);
export const ScaledEditors: WorkbenchExample = wb(ScaledEditorsExample);
export const ElementBrowser: WorkbenchExample = wb(ElementBrowserExample);
export const Collab: WorkbenchExample = wb(CollabExample);
export const JiraClone: WorkbenchExample = wb(JiraCloneExample);
export const AdfViewerDAC: WorkbenchExample = wb(AdfViewerDACExample);
export const FullPageClickToEdit: WorkbenchExample = wb(FullPageClickToEditExample);
export const JiraCloneRightPanel: WorkbenchExample = wb(JiraCloneRightPanelExample);
export const SsrTables: WorkbenchExample = wb(SsrTablesExample);
export const BasicCompiledHydration: WorkbenchExample = wb(BasicCompiledHydrationExample);
export const MentionsProfileCardOptions: WorkbenchExample = wb(MentionsProfileCardOptionsExample);
export const FullPageCompanyHub: WorkbenchExample = wb(FullPageCompanyHubExample);
export const FullPageConfluenceHydratable: WorkbenchExample = wb(
	FullPageConfluenceHydratableExample,
);
export const FullPageConfluenceLimitedMode: WorkbenchExample = wb(
	FullPageConfluenceLimitedModeExample,
);
export const FullPageConfluence: WorkbenchExample = wb(FullPageConfluenceExample);
export const FullPageMinimal: WorkbenchExample = wb(FullPageMinimalExample);
export const FullPageTemplateContextPanelAlwaysOpen: WorkbenchExample = wb(
	FullPageTemplateContextPanelAlwaysOpenExample,
);
export const FullPageTemplateContextPanel: WorkbenchExample = wb(
	FullPageTemplateContextPanelExample,
);
export const FullPageWithConfluenceFlexibleBlockCards: WorkbenchExample = wb(
	FullPageWithConfluenceFlexibleBlockCardsExample,
);
export const FullPageWithConfluenceLazySmartCards: WorkbenchExample = wb(
	FullPageWithConfluenceLazySmartCardsExample,
);
export const FullPageWithConfluenceSmartCards: WorkbenchExample = wb(
	FullPageWithConfluenceSmartCardsExample,
);
export const FullPageWithContentDisabledFlexiTables: WorkbenchExample = wb(
	FullPageWithContentDisabledFlexiTablesExample,
);
export const FullPageWithContent: WorkbenchExample = wb(FullPageWithContentExample);
export const FullPageWithCustomPanel: WorkbenchExample = wb(FullPageWithCustomPanelExample);
export const FullPageWithCustomSteps: WorkbenchExample = wb(FullPageWithCustomStepsExample);
export const FullPageWithInviteFromMention: WorkbenchExample = wb(
	FullPageWithInviteFromMentionExample,
);
export const FullPageWithMediaCaptionDisabled: WorkbenchExample = wb(
	FullPageWithMediaCaptionDisabledExample,
);
export const FullPageWithMediaCaption: WorkbenchExample = wb(FullPageWithMediaCaptionExample);
export const FullPageWithMediaPlugins: WorkbenchExample = wb(FullPageWithMediaPluginsExample);
export const FullPageWithToolbar: WorkbenchExample = wb(FullPageWithToolbarExample);
export const FullPageWithXExtensions: WorkbenchExample = wb(FullPageWithXExtensionsExample);
export const FullPageWithoutEditCustomPanel: WorkbenchExample = wb(
	FullPageWithoutEditCustomPanelExample,
);
export const FullPage: WorkbenchExample = wb(FullPageExample);
export const CopyPaste: WorkbenchExample = wb(CopyPasteExample);
export const CopyPasteTesting: WorkbenchExample = wb(CopyPasteTestingExample);
export const LibraComposableEditor: WorkbenchExample = wb(LibraComposableEditorExample);
export const LibraConfluenceFullPageEditor: WorkbenchExample = wb(
	LibraConfluenceFullPageEditorExample,
);
export const LibraNcsViewMode: WorkbenchExample = wb(LibraNcsViewModeExample);
export const Libra: WorkbenchExample = wb(LibraExample);
export const MultiFormatStreaming: WorkbenchExample = wb(MultiFormatStreamingExample);
export const Rovodev: WorkbenchExample = wb(RovodevExample);
export const Testing: WorkbenchExample = wb(TestingExample);
export const VrTesting: WorkbenchExample = wb(VrTestingExample);
export const EditorCommentInModal: WorkbenchExample = wb(EditorCommentInModalExample);
