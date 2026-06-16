/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content components from design-system *.docs.tsx files
 *
 * @codegen <<SignedSource::295ec1e9a2e00f56b3fdbb37f170a1c1>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen:atlaskit-components
 */
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
import type { ComponentMcpPayload } from '../get-all-components/types';

export const atlaskitComponents: ComponentMcpPayload[] = [
	{
		name: 'Conversation',
		package: '@atlaskit/conversation',
		description: 'DEPRECATED Render conversation threads',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'conversation', 'atlaskit'],
		category: 'editor',
		examples: [
			"import {\n\tMockProvider as ConversationResource,\n\tgetDataProviderFactory,\n} from '../example-helpers/MockProvider';\nimport { MOCK_USERS } from '../example-helpers/MockData';\nimport { Conversation } from '../src';\nconst provider = new ConversationResource({\n\turl: 'http://mockservice/',\n\tuser: MOCK_USERS[3],\n});\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<Conversation\n\t\t\tobjectId=\"ari:cloud:platform::conversation/demo\"\n\t\t\tprovider={provider}\n\t\t\tdataProviders={getDataProviderFactory()}\n\t\t/>\n\t);\n}",
			"import { MOCK_USERS } from '../example-helpers/MockData';\nimport {\n\tgetDataProviderFactory,\n\tMockProvider as ConversationResource,\n} from '../example-helpers/MockProvider';\nimport { Conversation } from '../src';\nconst provider = new ConversationResource({\n\turl: 'http://mockservice/',\n\tuser: MOCK_USERS[3],\n});\n// Ignored via go/ees005\nexport default class ExistingConversation extends React.Component<{}, { conversationId?: string }> {\n\tstate = {\n\t\tconversationId: undefined,\n\t};\n\tasync componentDidMount(): Promise<void> {\n\t\tconst [conversation] = await provider.getConversations();\n\t\tthis.setState({\n\t\t\tconversationId: conversation.conversationId,\n\t\t});\n\t}\n\trender(): React.JSX.Element | null {\n\t\tconst { conversationId } = this.state;\n\t\tif (!conversationId) {\n\t\t\treturn null;\n\t\t}\n\t\treturn (\n\t\t\t<Conversation\n\t\t\t\tid={conversationId}\n\t\t\t\tobjectId=\"ari:cloud:platform::conversation/demo\"\n\t\t\t\tprovider={provider}\n\t\t\t\tdataProviders={getDataProviderFactory()}\n\t\t\t/>\n\t\t);\n\t}\n}",
			"import type { EditorProps } from '@atlaskit/editor-core';\nimport type { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';\nimport { MOCK_USERS } from '../example-helpers/MockData';\nimport {\n\tgetDataProviderFactory,\n\tMockProvider as ConversationResource,\n} from '../example-helpers/MockProvider';\nimport { Conversation } from '../src';\nconst provider = new ConversationResource({\n\turl: 'http://mockservice/',\n\tuser: MOCK_USERS[3],\n});\n// Ignored via go/ees005\nexport default class ExistingConversation extends React.Component<{}, { conversationId?: string }> {\n\tstate = {\n\t\tconversationId: undefined,\n\t};\n\tasync componentDidMount(): Promise<void> {\n\t\tconst [conversation] = await provider.getConversations();\n\t\tthis.setState({\n\t\t\tconversationId: conversation.conversationId,\n\t\t});\n\t}\n\trender(): React.JSX.Element | null {\n\t\tconst { conversationId } = this.state;\n\t\tif (!conversationId) {\n\t\t\treturn null;\n\t\t}\n\t\treturn (\n\t\t\t<Conversation\n\t\t\t\tid={conversationId}\n\t\t\t\tobjectId=\"ari:cloud:platform::conversation/demo\"\n\t\t\t\tprovider={provider}\n\t\t\t\tdataProviders={getDataProviderFactory()}\n\t\t\t\trenderEditor={(Editor, props) => (\n\t\t\t\t\t<ComposableEditorWrapper {...props} saveOnEnter={true} Editor={Editor} />\n\t\t\t\t)}\n\t\t\t/>\n\t\t);\n\t}\n}\nconst ComposableEditorWrapper = ({\n\tEditor,\n\t...props\n}: EditorProps & { Editor: typeof ComposableEditor }) => {\n\tconst universalPreset = useUniversalPreset({ props });\n\treturn <Editor preset={universalPreset} {...props} />;\n};",
		],
		props: [
			{
				name: 'allowFeedbackAndHelpButtons',
				type: 'boolean',
			},
			{
				name: 'containerId',
				type: 'string',
			},
			{
				name: 'dataProviders',
				type: 'ProviderFactory',
			},
			{
				name: 'disableScrollTo',
				type: 'boolean',
			},
			{
				name: 'id',
				type: 'string',
			},
			{
				name: 'isExpanded',
				type: 'boolean',
			},
			{
				name: 'maxCommentNesting',
				type: 'number',
			},
			{
				name: 'meta',
				type: '{ [key: string]: any; }',
			},
			{
				name: 'objectId',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'onCancel',
				type: '() => void',
			},
			{
				name: 'onEditorChange',
				type: '() => void',
			},
			{
				name: 'onEditorClose',
				type: '() => void',
			},
			{
				name: 'onEditorOpen',
				type: '() => void',
			},
			{
				name: 'placeholder',
				type: 'string',
			},
			{
				name: 'portal',
				type: 'HTMLElement',
			},
			{
				name: 'provider',
				type: 'ResourceProvider',
				isRequired: true,
			},
			{
				name: 'renderAdditionalCommentActions',
				type: '(CommentAction: ForwardRefExoticComponent<Omit<CommentActionItemProps, "ref"> & RefAttributes<HTMLSpanElement>>, comment: Comment) => global.JSX.Element[]',
			},
			{
				name: 'renderAfterComment',
				type: '(comment: Comment) => global.JSX.Element',
			},
			{
				name: 'renderEditor',
				type: '(Editor: (props: EditorNextProps) => JSX.Element, props: EditorProps, comment?: Comment) => global.JSX.Element',
			},
			{
				name: 'showBeforeUnloadWarning',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Editor Core',
		package: '@atlaskit/editor-core',
		description: 'A package contains Atlassian editor core functionality',
		status: 'general-availability',
		usageGuidelines: [
			'Use the comment appearance when the editor is not the primary focus (e.g. comments on a page); use full-page or full-width when the editor is the main focus; use chromeless when you need complete control over the editor UI; use mobile for mobile web.',
			'Configure features via presets (default, universal, or custom). Always include basePlugin; use usePreset or similar memoization so the preset is stable across re-renders.',
			'Use ComposableEditor with a preset; provide providers (e.g. mentionProvider) when the editor needs context from your app.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-core', 'atlaskit'],
		category: 'editor',
		examples: [
			"import { code } from '@atlaskit/docs';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { listPlugin } from '@atlaskit/editor-plugins/list';\nfunction Editor() {\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder.add(basePlugin).add([analyticsPlugin, {}]).add(blockTypePlugin).add(listPlugin),\n\t);\n\treturn <ComposableEditor preset={preset} />;\n}\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<div>\n\t\t\t<p>\n\t\t\t\t{\n\t\t\t\t\t'A basic example of the Composable Editor which has basic text formatting, analytics, headings, and lists.'\n\t\t\t\t}\n\t\t\t</p>\n\t\t\t{code`import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { listPlugin } from '@atlaskit/editor-plugins/list';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nfunction Editor() {\n  const { preset } = usePreset(\n    (builder) =>\n      builder\n        .add(basePlugin)\n        .add(analyticsPlugin)\n        .add(blockTypePlugin)\n        .add(listPlugin),\n    [],\n  );\n  return <ComposableEditor preset={preset} />;\n}`}\n\t\t\t<br />\n\t\t\t<Editor />\n\t\t</div>\n\t);\n}",
			"import { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport { CommentEditor } from '../src/editor-appearances/CommentEditor';\nexport default function Editor(): React.JSX.Element {\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(editorDisabledPlugin)\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(blockTypePlugin)\n\t\t\t.add(copyButtonPlugin)\n\t\t\t.add(decorationsPlugin)\n\t\t\t.add(floatingToolbarPlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add(selectionPlugin)\n\t\t\t.add(widthPlugin)\n\t\t\t.add(contentInsertionPlugin)\n\t\t\t.add(guidelinePlugin)\n\t\t\t.add(tablesPlugin),\n\t);\n\treturn <CommentEditor preset={preset} />;\n}",
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport { FullPageEditor } from '../src/editor-appearances/FullPageEditor';\nimport { FullWidthEditor } from '../src/editor-appearances/FullWidthEditor';\nexport default function Editor(): React.JSX.Element {\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(editorDisabledPlugin)\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(blockTypePlugin)\n\t\t\t.add(copyButtonPlugin)\n\t\t\t.add(decorationsPlugin)\n\t\t\t.add(floatingToolbarPlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add(selectionPlugin)\n\t\t\t.add(widthPlugin)\n\t\t\t.add(contentInsertionPlugin)\n\t\t\t.add(guidelinePlugin)\n\t\t\t.add(tablesPlugin),\n\t);\n\tconst [fullWidth, setFullWidth] = useState(false);\n\treturn (\n\t\t<>\n\t\t\t<Button\n\t\t\t\tonClick={() => {\n\t\t\t\t\tsetFullWidth((current) => !current);\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\t{fullWidth ? 'Use full-page' : 'Use full-width'}\n\t\t\t</Button>\n\t\t\t{fullWidth ? (\n\t\t\t\t<FullWidthEditor preset={preset} />\n\t\t\t) : (\n\t\t\t\t<FullPageEditor appearance=\"full-page\" preset={preset} />\n\t\t\t)}\n\t\t</>\n\t);\n}",
		],
		props: [
			{
				name: '__livePage',
				type: 'boolean',
				description:
					'This is required for accessing whether a page is a live page or not when rendering the appearance component.\n\nAll other consumers should use the editorViewModePlugin to access live page and content mode status.',
				defaultValue: 'false',
			},
			{
				name: 'activityProvider',
				type: 'Promise<ActivityProvider>',
			},
			{
				name: 'allowAnalyticsGASV3',
				type: 'boolean',
			},
			{
				name: 'allowBlockType',
				type: '{ exclude?: AllowedBlockTypes[]; }',
			},
			{
				name: 'allowBorderMark',
				type: 'boolean',
				description:
					'Enable support for the "border" mark.\nRefer to ADF Change proposal #65 for more details.',
			},
			{
				name: 'allowBreakout',
				type: 'boolean',
			},
			{
				name: 'allowConfluenceInlineComment',
				type: 'boolean',
			},
			{
				name: 'allowDate',
				type: 'boolean | DatePluginOptions',
			},
			{
				name: 'allowExpand',
				type: 'boolean | { allowInsertion?: boolean; allowInteractiveExpand?: boolean; }',
			},
			{
				name: 'allowExtension',
				type: 'boolean | ExtensionConfig',
			},
			{
				name: 'allowFindReplace',
				type: 'boolean | FindReplaceOptions',
			},
			{
				name: 'allowFragmentMark',
				type: 'boolean',
				description:
					'Enable support for the "fragment" mark.\nRefer to ADF Change proposal #60 for more details.',
			},
			{
				name: 'allowHelpDialog',
				type: 'boolean',
			},
			{
				name: 'allowIndentation',
				type: 'boolean',
			},
			{
				name: 'allowLayouts',
				type: 'boolean | LayoutPluginOptions',
			},
			{
				name: 'allowNestedTasks',
				type: 'boolean',
			},
			{
				name: 'allowPanel',
				type: 'boolean | PanelPluginConfig',
			},
			{
				name: 'allowRule',
				type: 'boolean',
			},
			{
				name: 'allowStatus',
				type: 'boolean | { menuDisabled: boolean; }',
			},
			{
				name: 'allowTables',
				type: 'boolean | PluginConfig',
			},
			{
				name: 'allowTasksAndDecisions',
				type: 'boolean',
			},
			{
				name: 'allowTemplatePlaceholders',
				type: 'boolean | PlaceholderTextPluginOptions',
			},
			{
				name: 'allowTextAlignment',
				type: 'boolean',
			},
			{
				name: 'allowTextColor',
				type: 'boolean | TextColorPluginConfig',
			},
			{
				name: 'allowUndoRedoButtons',
				type: 'boolean',
			},
			{
				name: 'annotationProviders',
				type: 'AnnotationProviders',
			},
			{
				name: 'appearance',
				type: '"comment" | "full-page" | "full-width" | "max" | "chromeless"',
			},
			{
				name: 'assistiveDescribedBy',
				type: 'string',
			},
			{
				name: 'assistiveLabel',
				type: 'string',
			},
			{
				name: 'autoformattingProvider',
				type: 'Promise<AutoformattingProvider>',
			},
			{
				name: 'autoScrollIntoView',
				type: 'boolean',
				description:
					'Set this to false to opt out of the default behaviour of auto scrolling into view\nwhenever the document is changed',
			},
			{
				name: 'codeBlock',
				type: 'CodeBlockPluginOptions',
			},
			{
				name: 'collabEdit',
				type: '{ provider?: Promise<CollabEditProvider<CollabEvents>>; useNativePlugin?: boolean; userId?: string; } & CollabInviteToEditProps & CollabAnalyticsProps',
			},
			{
				name: 'collabEditProvider',
				type: 'Promise<CollabEditProvider<CollabEvents>>',
			},
			{
				name: 'contentComponents',
				type: 'BeforeAndAfterContentComponents | ReactComponents',
			},
			{
				name: 'contentTransformerProvider',
				type: '(schema: Schema<any, any>) => Transformer<string>',
			},
			{
				name: 'contextIdentifierProvider',
				type: 'Promise<ContextIdentifierProvider>',
			},
			{
				name: 'contextPanel',
				type: 'ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]',
			},
			{
				name: 'defaultValue',
				type: 'string | Object | Node',
			},
			{
				name: 'disabled',
				type: 'boolean',
			},
			{
				name: 'editorActions',
				type: 'EditorActions<any>',
			},
			{
				name: 'elementBrowser',
				type: '{ emptyStateHandler?: EmptyStateHandler; helpUrl?: string; replacePlusMenu?: boolean; showModal?: boolean; }',
			},
			{
				name: 'emojiProvider',
				type: 'Promise<EmojiProvider>',
			},
			{
				name: 'errorReporterHandler',
				type: 'ErrorReportingHandler',
			},
			{
				name: 'extensionHandlers',
				type: 'ExtensionHandlers<any>',
			},
			{
				name: 'extensionProviders',
				type: 'ExtensionProviders | ExtensionProvidersWithEditorAction',
			},
			{
				name: 'featureFlags',
				type: '{ [featureFlag: string]: string | boolean; }',
				description:
					"@description\nShort lived feature flags for experiments and gradual rollouts\nFlags are expected to follow these rules or they are filtered out\n\n1. cased in kebab-case (match [a-z-])\n2. have boolean values\n\n@example\n```tsx\n(<Editor featureFlags={{ 'my-feature': true }} />);\ngetFeatureFlags()?.myFeature === true;\n```\n\n@example\n```tsx\n(<Editor featureFlags={{ 'my-feature': 'thing' }} />);\ngetFeatureFlags()?.myFeature === undefined;\n```\n\n@example\n```tsx\n(<Editor featureFlags={{ 'product.my-feature': false }} />);\ngetFeatureFlags()?.myFeature === undefined;\ngetFeatureFlags()?.productMyFeature === undefined;\n```",
				defaultValue: 'undefined',
			},
			{
				name: 'feedbackInfo',
				type: '{ contentId?: string; coreVersion?: string; labels?: string[]; packageName?: string; packageVersion?: string; product?: string; sessionId?: string; tabId?: string; }',
			},
			{
				name: 'initialPluginConfiguration',
				type: '{ blockControlsPlugin?: { enabled?: boolean; quickInsertButtonEnabled?: boolean; rightSideControlsEnabled?: boolean; }; blockMenuPlugin?: { blockLinkHashPrefix?: string; enabled?: boolean; getLinkPath?: () => string; useStandardNodeWidth?: boolean; }; ... 7 more ...; trackChangesPlugin?: { ...; }; }',
			},
			{
				name: 'insertMenuItems',
				type: 'MenuItem[]',
			},
			{
				name: 'isEditorModernisationEnabled',
				type: 'boolean',
			},
			{
				name: 'legacyImageUploadProvider',
				type: 'Promise<ImageUploadProvider>',
			},
			{
				name: 'linking',
				type: 'LinkingOptions',
				description: 'Configure and extend editor linking behaviour',
			},
			{
				name: 'macroProvider',
				type: 'Promise<MacroProvider>',
			},
			{
				name: 'maxContentSize',
				type: 'number',
			},
			{
				name: 'maxHeight',
				type: 'number',
			},
			{
				name: 'media',
				type: 'MediaPluginOptions',
			},
			{
				name: 'mention',
				type: 'MentionPluginConfig',
			},
			{
				name: 'mentionProvider',
				type: 'Promise<MentionProvider>',
			},
			{
				name: 'minHeight',
				type: 'number',
			},
			{
				name: 'onCancel',
				type: '(editorView: EditorView) => void',
			},
			{
				name: 'onChange',
				type: '(editorView: EditorView, meta: { isDirtyChange: boolean; source: "local" | "remote"; }) => void',
			},
			{
				name: 'onDestroy',
				type: '() => void',
			},
			{
				name: 'onEditorReady',
				type: '(editorActions: EditorActions<any>) => void',
			},
			{
				name: 'onSave',
				type: '(editorView: EditorView) => void',
			},
			{
				name: 'onSSRMeasure',
				type: '(measure: { endTimestamp: number; segmentName: string; startTimestamp: number; }) => void',
				description:
					'Callback for measuring Server-Side Rendering (SSR) performance metrics.\nInvoked during SSR to track timing information for different segments of the rendering process.\n\n@param measure - Performance measurement data\n@param measure.startTimestamp - Absolute timestamp when the segment started (from `performance.now()`)\n@param measure.endTimestamp - Absolute timestamp when the segment completed (from `performance.now()`)\n@param measure.segmentName - Name identifier of the SSR segment being measured\n\n@remarks\nBoth timestamps are absolute values from `performance.now()`, not relative to measurement start.\nCalculate duration as: `measure.endTimestamp - measure.startTimestamp`\n\n@example\n```typescript\nonSSRMeasure={(measure) => {\n  const duration = measure.endTimestamp - measure.startTimestamp;\n  console.log(`${measure.segmentName}: ${duration}ms`);\n}}\n```',
			},
			{
				name: 'pasteWarningOptions',
				type: '{ cannotPasteSyncedBlock?: { description: MessageDescriptor; title: MessageDescriptor; urlHref: string; urlText: MessageDescriptor; }; }',
			},
			{
				name: 'persistScrollGutter',
				type: 'boolean',
			},
			{
				name: 'placeholder',
				type: 'string',
			},
			{
				name: 'placeholderBracketHint',
				type: 'string',
			},
			{
				name: 'popupsBoundariesElement',
				type: 'HTMLElement',
			},
			{
				name: 'popupsMountPoint',
				type: 'HTMLElement',
			},
			{
				name: 'popupsScrollableElement',
				type: 'HTMLElement',
			},
			{
				name: 'presenceProvider',
				type: 'Promise<any>',
			},
			{
				name: 'primaryToolbarComponents',
				type: 'ReactComponents | BeforeAndAfterToolbarComponents',
			},
			{
				name: 'primaryToolbarIconBefore',
				type: 'ReactElement<any, string | JSXElementConstructor<any>>',
			},
			{
				name: 'quickInsert',
				type: 'boolean | { disableDefaultItems?: boolean; itemFilter?: (item: QuickInsertItem) => boolean; onInsert?: (item: QuickInsertItem) => void; prioritySortingFn?: (items: QuickInsertItem[]) => Fuse.FuseSortFunction; provider?: Promise<...>; }',
			},
			{
				name: 'sanitizePrivateContent',
				type: 'boolean',
			},
			{
				name: 'saveOnEnter',
				type: 'boolean',
			},
			{
				name: 'searchProvider',
				type: 'Promise<SearchProvider>',
			},
			{
				name: 'secondaryToolbarComponents',
				type: 'ReactElement<any, string | JSXElementConstructor<any>> | ReactElement<any, string | JSXElementConstructor<any>>[]',
			},
			{
				name: 'shouldFocus',
				type: 'boolean',
			},
			{
				name: 'showIndentationButtons',
				type: 'boolean',
			},
			{
				name: 'skipValidation',
				type: 'boolean',
			},
			{
				name: 'syncBlock',
				type: 'SyncedBlockPluginOptions',
			},
			{
				name: 'syncedBlockProvider',
				type: 'SyncedBlockProvider',
			},
			{
				name: 'taskDecisionProvider',
				type: 'Promise<TaskDecisionProvider>',
			},
			{
				name: 'textFormatting',
				type: 'TextFormattingOptions',
			},
			{
				name: 'uploadErrorHandler',
				type: '(state: MediaState) => void',
			},
			{
				name: 'useStickyToolbar',
				type: 'boolean | RefObject<HTMLElement> | { offsetTop: number; }',
				description:
					"@description\nEnables the sticky toolbar in the comment/standard editor.\nIf a boolean is specified and it's `true`, the sticky toolbar will be enabled, sticking to the top of the scroll parent.\nInstead a reference can be specified to an existing sticky toolbar on the page that the editor toolbar should stay below (experimental).\nif {offsetTop: number} is passed in, the toolbar is sticky and the toolbar's 'top' will be set to the offsetTop\nso the toolbar will sticks to `{offsetTop}` below the scroll parent.",
				defaultValue: 'undefined',
			},
			{
				name: 'waitForMediaUpload',
				type: 'boolean',
			},
		],
	},
	{
		name: 'Editor Core',
		package: '@atlaskit/editor-extension-dropbox',
		description: 'A an atlassian editor extension to add a native dropbox picker',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'extension-dropbox', 'atlaskit'],
		category: 'editor',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport SectionMessage from '@atlaskit/section-message';\nimport Modal from '../src/modal';\nexport default (): React.JSX.Element => {\n\tconst [isOpen, setIsOpen] = useState(true);\n\treturn (\n\t\t<>\n\t\t\t<SectionMessage appearance=\"warning\">\n\t\t\t\tInternal component only - not consumable outside this package\n\t\t\t</SectionMessage>\n\t\t\t<Button onClick={() => setIsOpen(true)}>Show Modal</Button>\n\t\t\t<Modal\n\t\t\t\tshowModal={isOpen}\n\t\t\t\tonClose={() => setIsOpen(false)}\n\t\t\t\tTEST_ONLY_src=\"http://localhost:9000/examples.html?groupId=editor&packageId=extension-dropbox&exampleId=bad-example-modal-content\"\n\t\t\t/>\n\t\t</>\n\t);\n};",
		],
		props: [
			{
				name: 'appKey',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'canMountinIframe',
				type: 'boolean',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Block Controls',
		package: '@atlaskit/editor-plugin-block-controls',
		description: 'Block controls plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-block-controls', 'atlaskit'],
		category: 'editor',
		examples: [
			"import applyDevTools from 'prosemirror-dev-tools';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { annotationPlugin } from '@atlaskit/editor-plugins/annotation';\nimport type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';\nimport { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';\nimport { compositionPlugin } from '@atlaskit/editor-plugins/composition';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { emojiPlugin } from '@atlaskit/editor-plugins/emoji';\nimport { expandPlugin } from '@atlaskit/editor-plugins/expand';\nimport { extensionPlugin } from '@atlaskit/editor-plugins/extension';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { focusPlugin } from '@atlaskit/editor-plugins/focus';\nimport { gridPlugin } from '@atlaskit/editor-plugins/grid';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { layoutPlugin } from '@atlaskit/editor-plugins/layout';\nimport { listPlugin } from '@atlaskit/editor-plugins/list';\nimport { mediaPlugin } from '@atlaskit/editor-plugins/media';\nimport { panelPlugin } from '@atlaskit/editor-plugins/panel';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { rulePlugin } from '@atlaskit/editor-plugins/rule';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';\nimport { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport { defaultValue } from './default-value';\nexport default function Editor(): React.JSX.Element {\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(blockTypePlugin)\n\t\t\t.add(focusPlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add(selectionPlugin)\n\t\t\t.add(decorationsPlugin)\n\t\t\t.add(layoutPlugin)\n\t\t\t.add(listPlugin)\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(contentInsertionPlugin)\n\t\t\t.add(widthPlugin)\n\t\t\t.add(guidelinePlugin)\n\t\t\t.add(textFormattingPlugin)\n\t\t\t.add([\n\t\t\t\ttablesPlugin,\n\t\t\t\t{\n\t\t\t\t\ttableOptions: {\n\t\t\t\t\t\tadvanced: true,\n\t\t\t\t\t\tallowColumnResizing: true,\n\t\t\t\t\t\tallowHeaderRow: true,\n\t\t\t\t\t\tallowTableResizing: true,\n\t\t\t\t\t},\n\t\t\t\t\tisTableScalingEnabled: true,\n\t\t\t\t\tallowContextualMenu: true,\n\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add(emojiPlugin)\n\t\t\t.add(panelPlugin)\n\t\t\t.add(rulePlugin)\n\t\t\t.add(tasksAndDecisionsPlugin)\n\t\t\t.add([expandPlugin, { allowInsertion: true, appearance: 'full-page' }])\n\t\t\t.add(editorDisabledPlugin)\n\t\t\t.add(copyButtonPlugin)\n\t\t\t.add(compositionPlugin)\n\t\t\t.add(codeBlockPlugin)\n\t\t\t.add(blockControlsPlugin)\n\t\t\t.add(breakoutPlugin)\n\t\t\t.add(gridPlugin)\n\t\t\t.add(floatingToolbarPlugin)\n\t\t\t.add([selectionToolbarPlugin, { preferenceToolbarAboveSelection: true }])\n\t\t\t.add([\n\t\t\t\tmediaPlugin,\n\t\t\t\t{\n\t\t\t\t\tallowMediaSingle: { disableLayout: true },\n\t\t\t\t\tallowMediaGroup: false,\n\t\t\t\t\tallowResizing: true,\n\t\t\t\t\tisCopyPasteEnabled: true,\n\t\t\t\t\tallowBreakoutSnapPoints: true,\n\t\t\t\t\tallowAdvancedToolBarOptions: true,\n\t\t\t\t\tallowDropzoneDropLine: true,\n\t\t\t\t\tallowMediaSingleEditable: true,\n\t\t\t\t\tallowImagePreview: true,\n\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t\twaitForMediaUpload: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add([\n\t\t\t\tannotationPlugin,\n\t\t\t\t{\n\t\t\t\t\tinlineComment: {},\n\t\t\t\t} as AnnotationProviders,\n\t\t\t])\n\t\t\t.add(extensionPlugin),\n\t);\n\treturn (\n\t\t<ComposableEditor\n\t\t\tappearance=\"full-page\"\n\t\t\tonEditorReady={(editorAction) => {\n\t\t\t\teditorAction.replaceDocument(defaultValue);\n\t\t\t}}\n\t\t\tonChange={(view) => {\n\t\t\t\tapplyDevTools(view);\n\t\t\t}}\n\t\t\tpreset={preset}\n\t\t/>\n\t);\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ blockControls: BasePluginDependenciesAPI<{ actions: { getTextInfo: (editorView: EditorView) => { textContent: string; textLength: number; }; registerNodeDecoration: (factory: NodeDecorationFactory) => void; unregisterNodeDecoration: (type: string) => void; }; commands: { ...; }; dependencies: BlockControlsPluginDe...',
			},
			{
				name: 'config',
				type: '{ quickInsertButtonEnabled?: boolean; rightSideControlsEnabled?: boolean; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Block Menu',
		package: '@atlaskit/editor-plugin-block-menu',
		description: 'BlockMenu plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-block-menu', 'atlaskit'],
		category: 'editor',
		examples: [
			"import type { RegisterBlockMenuComponent } from '../src/blockMenuPluginType';\nimport { createBlockMenuRegistry } from '../src/editor-actions';\nimport { BlockMenuRenderer } from '../src/ui/block-menu-renderer/BlockMenuRenderer';\nimport { BLOCK_MENU_FALLBACKS } from '../src/ui/block-menu-renderer/fallbacks';\nimport {\n\tregisterDeleteComponent,\n\tregisterDeleteSectionComponent,\n\tregisterMoveDownComponent,\n\tregisterMoveUpComponent,\n\tregisterMoveUpDownSectionComponent,\n\tregisterNestedMenu,\n} from './helpers/block-menu-components-definition';\nconst allComponents = [\n\tregisterMoveUpComponent,\n\tregisterMoveDownComponent,\n\tregisterDeleteComponent,\n\tregisterDeleteSectionComponent,\n\tregisterMoveUpDownSectionComponent,\n\tregisterNestedMenu,\n] as RegisterBlockMenuComponent[];\n/**\n * This example registers several components and uses a `BlockMenuRenderer` to render them.\n *\n * @returns A basic example of a block menu using the registry.\n */\nexport default function Basic(): React.JSX.Element {\n\tconst registry = createBlockMenuRegistry();\n\tregistry.register(allComponents);\n\treturn (\n\t\t<BlockMenuRenderer\n\t\t\tallRegisteredComponents={registry.components}\n\t\t\tfallbacks={BLOCK_MENU_FALLBACKS}\n\t\t/>\n\t);\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ blockMenu: BasePluginDependenciesAPI<{ actions: { getBlockMenuComponents: () => RegisterBlockMenuComponent[]; isTransformOptionDisabled: (optionNodeTypeName: string, optionNodeTypeAttrs?: Record<string, unknown>) => boolean; registerBlockMenuComponents: (blockMenuComponents: RegisterBlockMenuComponent[]) => void; ...',
			},
			{
				name: 'config',
				type: '{ blockLinkHashPrefix?: string; getLinkPath?: () => string; useStandardNodeWidth?: boolean; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Connectivity',
		package: '@atlaskit/editor-plugin-connectivity',
		description: 'Connectivity plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-connectivity', 'atlaskit'],
		category: 'editor',
		examples: [
			"import React, { useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport { DevTools } from '@af/editor-examples-helpers/utils';\nimport Button from '@atlaskit/button/new';\nimport { useSharedPluginState } from '@atlaskit/editor-common/hooks';\nimport type { PublicPluginAPI } from '@atlaskit/editor-common/types';\nimport type { EditorActions } from '@atlaskit/editor-core';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';\nimport { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { annotationPlugin } from '@atlaskit/editor-plugins/annotation';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { cardPlugin } from '@atlaskit/editor-plugins/card';\nimport { connectivityPlugin, type ConnectivityPlugin } from '@atlaskit/editor-plugins/connectivity';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { emojiPlugin } from '@atlaskit/editor-plugins/emoji';\nimport { extensionPlugin } from '@atlaskit/editor-plugins/extension';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { focusPlugin } from '@atlaskit/editor-plugins/focus';\nimport { gridPlugin } from '@atlaskit/editor-plugins/grid';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';\nimport { layoutPlugin } from '@atlaskit/editor-plugins/layout';\nimport { loomPlugin } from '@atlaskit/editor-plugins/loom';\nimport { mediaPlugin } from '@atlaskit/editor-plugins/media';\nimport { mentionsPlugin } from '@atlaskit/editor-plugins/mentions';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport type { EditorView } from '@atlaskit/editor-prosemirror/view';\nimport { useEditorAnnotationProviders } from '@atlaskit/editor-test-helpers/annotation-example';\nimport { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';\nimport { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';\nimport { getExampleExtensionProviders } from '@atlaskit/editor-test-helpers/example-helpers';\nimport { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { Box, xcss } from '@atlaskit/primitives';\nimport { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';\nimport { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';\nimport { getLoomProvider } from './utils/provider/loom-provider';\nconst styles = xcss({ height: '100%' });\nconst smartCardClient = new ConfluenceCardClient('stg');\nfunction OfflineIndicator({\n\teditorApi,\n}: {\n\teditorApi: PublicPluginAPI<ConnectivityPlugin> | undefined;\n}) {\n\tconst { connectivityState } = useSharedPluginState(editorApi, ['connectivity']);\n\treturn (\n\t\t<Box as=\"span\" padding=\"space.100\">\n\t\t\tOffline status: {connectivityState?.mode}\n\t\t</Box>\n\t);\n}\nfunction SimulateMode() {\n\tconst [offline, setOffline] = useState(false);\n\treturn (\n\t\t<Button\n\t\t\tonClick={() => {\n\t\t\t\tif (!offline) {\n\t\t\t\t\tsetOffline(true);\n\t\t\t\t\twindow.dispatchEvent(new Event('offline'));\n\t\t\t\t} else {\n\t\t\t\t\tsetOffline(false);\n\t\t\t\t\twindow.dispatchEvent(new Event('online'));\n\t\t\t\t}\n\t\t\t}}\n\t\t>\n\t\t\tSimulate {offline ? 'online' : 'offline'}\n\t\t</Button>\n\t);\n}\nfunction Editor() {\n\tconst editorAnnotationProviders = useEditorAnnotationProviders();\n\tconst { preset, editorApi } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(blockTypePlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add([\n\t\t\t\tquickInsertPlugin,\n\t\t\t\t{\n\t\t\t\t\tenableElementBrowser: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add(hyperlinkPlugin)\n\t\t\t.add(widthPlugin)\n\t\t\t.add([\n\t\t\t\tinsertBlockPlugin,\n\t\t\t\t{\n\t\t\t\t\tshowElementBrowserLink: true,\n\t\t\t\t\tappearance: 'full-page',\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add(editorDisabledPlugin)\n\t\t\t.add(decorationsPlugin)\n\t\t\t.add(copyButtonPlugin)\n\t\t\t.add(floatingToolbarPlugin)\n\t\t\t.add(selectionPlugin)\n\t\t\t.add(guidelinePlugin)\n\t\t\t.add(gridPlugin)\n\t\t\t.add(focusPlugin)\n\t\t\t.add([\n\t\t\t\tmediaPlugin,\n\t\t\t\t{\n\t\t\t\t\tprovider: storyMediaProviderFactory(),\n\t\t\t\t\tallowMediaSingle: true,\n\t\t\t\t\tallowMediaSingleEditable: true,\n\t\t\t\t\tallowLinking: true,\n\t\t\t\t\tallowCommentsOnMedia: true,\n\t\t\t\t\tallowAdvancedToolBarOptions: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(contentInsertionPlugin)\n\t\t\t.add(mentionsPlugin)\n\t\t\t.add([tablesPlugin, { tableOptions: { advanced: true } }])\n\t\t\t.add([emojiPlugin, { emojiProvider: getEmojiResource() }])\n\t\t\t.add([cardPlugin, { provider: Promise.resolve(cardProviderStaging) }])\n\t\t\t.add(layoutPlugin)\n\t\t\t.add([selectionToolbarPlugin, {}])\n\t\t\t.add(tasksAndDecisionsPlugin)\n\t\t\t.add([annotationPlugin, editorAnnotationProviders])\n\t\t\t.add([\n\t\t\t\tloomPlugin,\n\t\t\t\t{\n\t\t\t\t\t...getLoomProvider({\n\t\t\t\t\t\t// NOTE: DEV MOVE - A public key referencing a sandbox loom account, this will eventially be substituted\n\t\t\t\t\t\t// for a session token that will intialise the SDK.\n\t\t\t\t\t\tpublicAppId: '4dc78821-b6d2-44ee-ab43-54d0494290c8',\n\t\t\t\t\t}),\n\t\t\t\t\tshouldShowToolbarButton: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add(primaryToolbarPlugin)\n\t\t\t.add(connectivityPlugin)\n\t\t\t.add(extensionPlugin),\n\t);\n\tconst [editorView, setEditorView] = React.useState<EditorView>();\n\tconst onReady = React.useCallback((editorActions: EditorActions<any>) => {\n\t\tsetEditorView(editorActions._privateGetEditorView());\n\t}, []);\n\treturn (\n\t\t<Box xcss={styles}>\n\t\t\t<SimulateMode />\n\t\t\t<DevTools editorView={editorView} />\n\t\t\t<OfflineIndicator editorApi={editorApi} />\n\t\t\t<ComposableEditor\n\t\t\t\tappearance=\"full-page\"\n\t\t\t\tpreset={preset}\n\t\t\t\tonEditorReady={onReady}\n\t\t\t\tmentionProvider={Promise.resolve(mentionResourceProvider)}\n\t\t\t\textensionProviders={(editorActions?: EditorActions) => [\n\t\t\t\t\tgetExampleExtensionProviders(editorApi, editorActions),\n\t\t\t\t]}\n\t\t\t/>\n\t\t</Box>\n\t);\n}\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<SmartCardProvider client={smartCardClient}>\n\t\t\t\t<Editor />\n\t\t\t</SmartCardProvider>\n\t\t</IntlProvider>\n\t);\n};",
		],
		props: [
			{
				name: 'api',
				type: '{ connectivity: BasePluginDependenciesAPI<{ commands: { setMode: (mode: Mode) => EditorCommand; }; sharedState: PublicPluginState; }>; } & RequiredPluginDependenciesAPI<...> & OptionalPluginDependenciesAPI<...>',
			},
			{
				name: 'config',
				type: 'undefined',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Extension',
		package: '@atlaskit/editor-plugin-extension',
		description: 'editor-plugin-extension plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-extension', 'atlaskit'],
		category: 'editor',
		examples: [
			"import { combineExtensionProviders } from '@atlaskit/editor-common/extensions';\nimport { getXProductExtensionProvider } from '@atlaskit/editor-test-helpers/example-helpers';\nimport ConfigPanelWithExtensionPicker from '../example-utils/config-panel/ConfigPanelWithExtensionPicker';\nexport default function Example(): React.JSX.Element {\n\tconst extensionProvider = combineExtensionProviders([getXProductExtensionProvider()]);\n\treturn <ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} />;\n}",
			"import {\n\tcombineExtensionProviders,\n\tDefaultExtensionProvider,\n} from '@atlaskit/editor-common/extensions';\nimport ConfigPanelWithExtensionPicker from '../example-utils/config-panel/ConfigPanelWithExtensionPicker';\nimport exampleManifest from '../example-utils/config-panel/example-manifest-all-fields';\nconst parameters = {\n\t'text-field': 'Hi',\n\t'text-field-multiline': 'Hello\\nWorld',\n\t'text-field-optional': '',\n\t'text-field-hidden': 'this is a hidden value passed to the extension',\n\t'number-field': '1234567',\n\t'date-start': '2020-01-18',\n\t'enum-select': 'a',\n\t'enum-select-icon': ['b', 'c', 'd'],\n\t'enum-select-icon-multiple': 'long',\n\t'enum-checkbox-multiple': ['a', 'b'],\n\t'fieldset-cql': 'created-at = now(-1w) AND query = foobar AND flag = BF',\n\t'fieldset-jira-filter': 'keywords = editor AND project = editor-platform AND status = to-do',\n\t'custom-required': 'meeting-notes',\n\t'custom-create-multiple': ['XR', 'FF'],\n};\nconst extensionProvider = combineExtensionProviders([\n\tnew DefaultExtensionProvider([exampleManifest]),\n]);\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<ConfigPanelWithExtensionPicker extensionProvider={extensionProvider} parameters={parameters} />\n\t);\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ extension: BasePluginDependenciesAPI<{ actions: ExtensionPluginActions; dependencies: ExtensionPluginDependencies; pluginConfiguration: ExtensionPluginOptions; sharedState: { ...; }; }>; } & RequiredPluginDependenciesAPI<...> & OptionalPluginDependenciesAPI<...>',
			},
			{
				name: 'config',
				type: 'ExtensionPluginOptions',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Highlight',
		package: '@atlaskit/editor-plugin-highlight',
		description: 'Highlight plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-highlight', 'atlaskit'],
		category: 'editor',
		examples: [
			"import { AnnotationTypes } from '@atlaskit/adf-schema';\nimport { AnnotationUpdateEmitter } from '@atlaskit/editor-common/annotation';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { emojiPlugin } from '@atlaskit/editor-plugin-emoji';\nimport { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { annotationPlugin } from '@atlaskit/editor-plugins/annotation';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { highlightPlugin } from '@atlaskit/editor-plugins/highlight';\nimport { historyPlugin } from '@atlaskit/editor-plugins/history';\nimport { insertBlockPlugin } from '@atlaskit/editor-plugins/insert-block';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';\nimport { statusPlugin } from '@atlaskit/editor-plugins/status';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport type { TablePluginOptions } from '@atlaskit/editor-plugins/table';\nimport { textColorPlugin } from '@atlaskit/editor-plugins/text-color';\nimport { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport {\n\tExampleCreateInlineCommentComponent,\n\tExampleViewInlineCommentComponent,\n} from '@atlaskit/editor-test-helpers/example-helpers';\nimport { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';\nconst highlightAdfDoc = {\n\ttype: 'doc',\n\tversion: 1,\n\tcontent: [\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttext: 'Highlights: ',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttext: 'Light Gray',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#dcdfe4' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Light Teal',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#c6edfb' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Light Lime',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#d3f1a7' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Light Orange',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#fedec8' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Light Magenta',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#fdd0ec' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Light Purple',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#dfd8fd' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Custom: black',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#000000' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Custom: white',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#ffffff' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Custom: red',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#c9372c' } }],\n\t\t\t\t},\n\t\t\t\t{ text: ', ', type: 'text' },\n\t\t\t\t{\n\t\t\t\t\ttext: 'Custom: yellow',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#f8e6a0' } }],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttext: ', No highlight',\n\t\t\t\t\ttype: 'text',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'this is ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'status',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\ttext: 'some ',\n\t\t\t\t\t\tcolor: 'neutral',\n\t\t\t\t\t\tlocalId: '1d3d429b-a8d9-4340-beb0-0647bd0b20d4',\n\t\t\t\t\t\tstyle: '',\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'emoji',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tshortName: ':slight_smile:',\n\t\t\t\t\t\tid: '1f642',\n\t\t\t\t\t\ttext: '🙂',\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' text with ',\n\t\t\t\t\tmarks: [{ type: 'backgroundColor', attrs: { color: '#fdd0ec' } }],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'inline',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{ type: 'backgroundColor', attrs: { color: '#dfd8fd' } },\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' nodes',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'table',\n\t\t\tattrs: {\n\t\t\t\tisNumberColumnEnabled: false,\n\t\t\t\tlayout: 'default',\n\t\t\t\tlocalId: '7c2ef57c-0a6d-43bf-822c-67803b11f46f',\n\t\t\t\twidth: 760,\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'tableRow',\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableHeader',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttext: 'Highlight in table',\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\tmarks: [\n\t\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\t\t\t\t\t\t\tattrs: { color: '#c6edfb' },\n\t\t\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableHeader',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableHeader',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'tableRow',\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'tableRow',\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Highlight ',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#c6edfb',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'over',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#c6edfb',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' comment',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#c6edfb',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Comment ',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'over',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#d3f1a7',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' highlight',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Partially ',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#fedec8',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'overlapping',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#fedec8',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' comment',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'annotation',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tid: 'annotation-id',\n\t\t\t\t\t\t\t\tannotationType: AnnotationTypes.INLINE_COMMENT,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Adjacent ',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#d3f1a7',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'highlights',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#c6edfb',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' example',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'backgroundColor',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tcolor: '#fedec8',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t],\n};\nconst emitter = new AnnotationUpdateEmitter();\nconst Editor = (): React.JSX.Element => {\n\tconst tableOptions = {\n\t\ttableOptions: {\n\t\t\tadvanced: true,\n\t\t\tallowNumberColumn: true,\n\t\t\tallowHeaderRow: true,\n\t\t\tallowHeaderColumn: true,\n\t\t\tpermittedLayouts: 'all',\n\t\t},\n\t\tallowContextualMenu: true,\n\t} as TablePluginOptions;\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(historyPlugin)\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(primaryToolbarPlugin)\n\t\t\t.add(undoRedoPlugin)\n\t\t\t.add(textFormattingPlugin)\n\t\t\t.add(textColorPlugin)\n\t\t\t.add(statusPlugin)\n\t\t\t.add(contentInsertionPlugin)\n\t\t\t.add(widthPlugin)\n\t\t\t.add(guidelinePlugin)\n\t\t\t.add(selectionPlugin)\n\t\t\t.add([selectionToolbarPlugin, { preferenceToolbarAboveSelection: true }])\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add([tablesPlugin, tableOptions])\n\t\t\t.add([\n\t\t\t\tinsertBlockPlugin,\n\t\t\t\t{\n\t\t\t\t\tallowTables: true,\n\t\t\t\t\tallowExpand: true,\n\t\t\t\t\ttableSelectorSupported: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add([\n\t\t\t\tannotationPlugin,\n\t\t\t\t{\n\t\t\t\t\tinlineComment: {\n\t\t\t\t\t\tcreateComponent: ExampleCreateInlineCommentComponent,\n\t\t\t\t\t\tviewComponent: ExampleViewInlineCommentComponent,\n\t\t\t\t\t\tupdateSubscriber: emitter,\n\t\t\t\t\t\tgetState: async (annotationsIds: string[]) => {\n\t\t\t\t\t\t\treturn annotationsIds.map((id) => ({\n\t\t\t\t\t\t\t\tid,\n\t\t\t\t\t\t\t\tannotationType: 'inlineComment',\n\t\t\t\t\t\t\t\tstate: { resolved: false },\n\t\t\t\t\t\t\t})) as any;\n\t\t\t\t\t\t},\n\t\t\t\t\t\tdisallowOnWhitespace: true,\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add(decorationsPlugin)\n\t\t\t.add(copyButtonPlugin)\n\t\t\t.add(editorDisabledPlugin)\n\t\t\t.add(floatingToolbarPlugin)\n\t\t\t.add(emojiPlugin)\n\t\t\t.add(highlightPlugin),\n\t);\n\treturn (\n\t\t<ComposableEditor\n\t\t\tappearance=\"full-page\"\n\t\t\tpreset={preset}\n\t\t\tdefaultValue={highlightAdfDoc}\n\t\t\temojiProvider={getEmojiProvider()}\n\t\t/>\n\t);\n};\nexport default Editor;",
		],
		props: [
			{
				name: 'api',
				type: '{ highlight: BasePluginDependenciesAPI<{ commands: { changeColor: ({ color }: { color: string; inputMethod: INPUT_METHOD; }) => EditorCommand; }; dependencies: [OptionalPlugin<NextEditorPluginFunctionOptionalConfigDefinition<"analytics", { actions: EditorAnalyticsAPI; dependencies: [...]; pluginConfiguration: Analyt...',
			},
			{
				name: 'config',
				type: 'undefined',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Selection Marker',
		package: '@atlaskit/editor-plugin-selection-marker',
		description: 'Selection marker plugin for @atlaskit/editor-core.',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-selection-marker', 'atlaskit'],
		category: 'editor',
		examples: [
			"import { EditorPresetBuilder } from '@atlaskit/editor-common/preset';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { focusPlugin } from '@atlaskit/editor-plugins/focus';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { selectionMarkerPlugin } from '@atlaskit/editor-plugins/selection-marker';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nexport default function Editor(): React.JSX.Element {\n\tconst { preset } = usePreset(() =>\n\t\tnew EditorPresetBuilder()\n\t\t\t.add(basePlugin)\n\t\t\t.add(blockTypePlugin)\n\t\t\t.add(focusPlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add(selectionMarkerPlugin),\n\t);\n\treturn <ComposableEditor preset={preset} />;\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ selectionMarker: BasePluginDependenciesAPI<{ actions: { hideDecoration: () => ReleaseHiddenDecoration; queueHideDecoration: (setCleanup: SetCleanup) => () => void; }; dependencies: [...]; pluginConfiguration?: SelectionMarkerPluginOptions; sharedState: { ...; }; }>; } & RequiredPluginDependenciesAPI<...> & Optiona...',
			},
			{
				name: 'config',
				type: '{ hideCursorOnInit?: boolean; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Selection Toolbar',
		package: '@atlaskit/editor-plugin-selection-toolbar',
		description: '@atlaskit/editor-plugin-selection-toolbar for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-selection-toolbar', 'atlaskit'],
		category: 'editor',
		examples: [
			"import applyDevTools from 'prosemirror-dev-tools';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { annotationPlugin } from '@atlaskit/editor-plugins/annotation';\nimport type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';\nimport { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';\nimport { compositionPlugin } from '@atlaskit/editor-plugins/composition';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { emojiPlugin } from '@atlaskit/editor-plugins/emoji';\nimport { expandPlugin } from '@atlaskit/editor-plugins/expand';\nimport { extensionPlugin } from '@atlaskit/editor-plugins/extension';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { focusPlugin } from '@atlaskit/editor-plugins/focus';\nimport { gridPlugin } from '@atlaskit/editor-plugins/grid';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { layoutPlugin } from '@atlaskit/editor-plugins/layout';\nimport { listPlugin } from '@atlaskit/editor-plugins/list';\nimport { mediaPlugin } from '@atlaskit/editor-plugins/media';\nimport { panelPlugin } from '@atlaskit/editor-plugins/panel';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { rulePlugin } from '@atlaskit/editor-plugins/rule';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';\nimport { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport { LocalUserPreferencesProvider } from './user-preferences-provider';\nexport default function Editor(): React.JSX.Element {\n\tconst localUserPreferencesProvider = new LocalUserPreferencesProvider();\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(blockTypePlugin)\n\t\t\t.add(focusPlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add(selectionPlugin)\n\t\t\t.add(decorationsPlugin)\n\t\t\t.add(layoutPlugin)\n\t\t\t.add(listPlugin)\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(contentInsertionPlugin)\n\t\t\t.add(widthPlugin)\n\t\t\t.add(guidelinePlugin)\n\t\t\t.add(textFormattingPlugin)\n\t\t\t.add([\n\t\t\t\ttablesPlugin,\n\t\t\t\t{\n\t\t\t\t\ttableOptions: {\n\t\t\t\t\t\tadvanced: true,\n\t\t\t\t\t\tallowColumnResizing: true,\n\t\t\t\t\t\tallowHeaderRow: true,\n\t\t\t\t\t\tallowTableResizing: true,\n\t\t\t\t\t},\n\t\t\t\t\tisTableScalingEnabled: true,\n\t\t\t\t\tallowContextualMenu: true,\n\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add(emojiPlugin)\n\t\t\t.add(panelPlugin)\n\t\t\t.add(rulePlugin)\n\t\t\t.add(tasksAndDecisionsPlugin)\n\t\t\t.add([expandPlugin, { allowInsertion: true, appearance: 'full-page' }])\n\t\t\t.add(editorDisabledPlugin)\n\t\t\t.add(copyButtonPlugin)\n\t\t\t.add(compositionPlugin)\n\t\t\t.add(codeBlockPlugin)\n\t\t\t.add(blockControlsPlugin)\n\t\t\t.add(breakoutPlugin)\n\t\t\t.add(gridPlugin)\n\t\t\t.add(floatingToolbarPlugin)\n\t\t\t.add([\n\t\t\t\tselectionToolbarPlugin,\n\t\t\t\t{\n\t\t\t\t\tpreferenceToolbarAboveSelection: true,\n\t\t\t\t\tcontextualFormattingEnabled: true,\n\t\t\t\t\tuserPreferencesProvider: localUserPreferencesProvider,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add([\n\t\t\t\tmediaPlugin,\n\t\t\t\t{\n\t\t\t\t\tallowMediaSingle: { disableLayout: true },\n\t\t\t\t\tallowMediaGroup: false,\n\t\t\t\t\tallowResizing: true,\n\t\t\t\t\tisCopyPasteEnabled: true,\n\t\t\t\t\tallowBreakoutSnapPoints: true,\n\t\t\t\t\tallowAdvancedToolBarOptions: true,\n\t\t\t\t\tallowDropzoneDropLine: true,\n\t\t\t\t\tallowMediaSingleEditable: true,\n\t\t\t\t\tallowImagePreview: true,\n\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t\twaitForMediaUpload: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add([\n\t\t\t\tannotationPlugin,\n\t\t\t\t{\n\t\t\t\t\tinlineComment: {},\n\t\t\t\t} as AnnotationProviders,\n\t\t\t])\n\t\t\t.add(extensionPlugin),\n\t);\n\treturn (\n\t\t<ComposableEditor\n\t\t\tappearance=\"full-page\"\n\t\t\tonChange={(view) => {\n\t\t\t\tapplyDevTools(view);\n\t\t\t}}\n\t\t\tpreset={preset}\n\t\t/>\n\t);\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ selectionToolbar: BasePluginDependenciesAPI<{ actions?: { clearToolbarDockingOverride?: () => boolean; forceToolbarDockingWithoutAnalytics?: (toolbarDocking: ToolbarDocking) => boolean; overrideToolbarDocking?: (toolbarDocking: ToolbarDocking) => boolean; refreshToolbarDocking?: () => boolean; setToolbarDocking?: ...',
			},
			{
				name: 'config',
				type: '{ contextualFormattingEnabled?: boolean; disablePin?: boolean; preferenceToolbarAboveSelection?: boolean; userPreferencesProvider?: UserPreferencesProvider; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Show Diff',
		package: '@atlaskit/editor-plugin-show-diff',
		description: 'ShowDiff plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-show-diff', 'atlaskit'],
		category: 'editor',
		examples: [
			"import React, { useState } from 'react';\nimport applyDevTools from 'prosemirror-dev-tools';\nimport Button from '@atlaskit/button/new';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { annotationPlugin } from '@atlaskit/editor-plugins/annotation';\nimport type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';\nimport { captionPlugin } from '@atlaskit/editor-plugins/caption';\nimport { cardPlugin } from '@atlaskit/editor-plugins/card';\nimport { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';\nimport { compositionPlugin } from '@atlaskit/editor-plugins/composition';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { editorViewModePlugin } from '@atlaskit/editor-plugins/editor-viewmode';\nimport { emojiPlugin } from '@atlaskit/editor-plugins/emoji';\nimport { expandPlugin } from '@atlaskit/editor-plugins/expand';\nimport { extensionPlugin } from '@atlaskit/editor-plugins/extension';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { focusPlugin } from '@atlaskit/editor-plugins/focus';\nimport { gridPlugin } from '@atlaskit/editor-plugins/grid';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { hyperlinkPlugin } from '@atlaskit/editor-plugins/hyperlink';\nimport { layoutPlugin } from '@atlaskit/editor-plugins/layout';\nimport { listPlugin } from '@atlaskit/editor-plugins/list';\nimport { mediaPlugin } from '@atlaskit/editor-plugins/media';\nimport { mentionsPlugin } from '@atlaskit/editor-plugins/mentions';\nimport { panelPlugin } from '@atlaskit/editor-plugins/panel';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { rulePlugin } from '@atlaskit/editor-plugins/rule';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { statusPlugin } from '@atlaskit/editor-plugins/status';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';\nimport { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { unsupportedContentPlugin } from '@atlaskit/editor-plugins/unsupported-content';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport type { ColorScheme } from '../src/showDiffPluginType';\nconst step1 = {\n\tuserId: 'ari:cloud:identity::user/123',\n\tclientId: 123,\n\tfrom: 1,\n\tto: 5,\n\tstepType: 'replace',\n\tslice: {\n\t\tcontent: [{ type: 'text', text: 'abc', content: [], attrs: {}, marks: [] }],\n\t\topenStart: 0,\n\t\topenEnd: 0,\n\t},\n};\nexport default function Editor(): React.JSX.Element {\n\tconst [colorScheme, setColorScheme] = useState<ColorScheme>('traditional');\n\tconst { preset } = usePreset(\n\t\t(builder) =>\n\t\t\tbuilder\n\t\t\t\t.add(basePlugin)\n\t\t\t\t.add(blockTypePlugin)\n\t\t\t\t.add(focusPlugin)\n\t\t\t\t.add(typeAheadPlugin)\n\t\t\t\t.add(quickInsertPlugin)\n\t\t\t\t.add(selectionPlugin)\n\t\t\t\t.add(decorationsPlugin)\n\t\t\t\t.add(layoutPlugin)\n\t\t\t\t.add(listPlugin)\n\t\t\t\t.add([analyticsPlugin, {}])\n\t\t\t\t.add(contentInsertionPlugin)\n\t\t\t\t.add(widthPlugin)\n\t\t\t\t.add(statusPlugin)\n\t\t\t\t.add(guidelinePlugin)\n\t\t\t\t.add(textFormattingPlugin)\n\t\t\t\t.add([\n\t\t\t\t\ttablesPlugin,\n\t\t\t\t\t{\n\t\t\t\t\t\ttableOptions: {\n\t\t\t\t\t\t\tadvanced: true,\n\t\t\t\t\t\t\tallowColumnResizing: true,\n\t\t\t\t\t\t\tallowHeaderRow: true,\n\t\t\t\t\t\t\tallowTableResizing: true,\n\t\t\t\t\t\t},\n\t\t\t\t\t\tisTableScalingEnabled: true,\n\t\t\t\t\t\tallowContextualMenu: true,\n\t\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t\t},\n\t\t\t\t])\n\t\t\t\t.add(emojiPlugin)\n\t\t\t\t.add(hyperlinkPlugin)\n\t\t\t\t.add(unsupportedContentPlugin)\n\t\t\t\t.add(mentionsPlugin)\n\t\t\t\t.add(panelPlugin)\n\t\t\t\t.add(rulePlugin)\n\t\t\t\t.add(tasksAndDecisionsPlugin)\n\t\t\t\t.add([expandPlugin, { allowInsertion: true, appearance: 'full-page' }])\n\t\t\t\t.add(editorDisabledPlugin)\n\t\t\t\t.add(copyButtonPlugin)\n\t\t\t\t.add(compositionPlugin)\n\t\t\t\t.add(codeBlockPlugin)\n\t\t\t\t.add(blockControlsPlugin)\n\t\t\t\t.add(breakoutPlugin)\n\t\t\t\t.add(gridPlugin)\n\t\t\t\t.add(floatingToolbarPlugin)\n\t\t\t\t.add([cardPlugin, { allowBlockCards: true, allowEmbeds: true }])\n\t\t\t\t.add([editorViewModePlugin, { mode: 'view' }])\n\t\t\t\t.add([\n\t\t\t\t\tmediaPlugin,\n\t\t\t\t\t{\n\t\t\t\t\t\tallowMediaSingle: { disableLayout: false },\n\t\t\t\t\t\tallowMediaGroup: true,\n\t\t\t\t\t\tallowResizing: true,\n\t\t\t\t\t\tisCopyPasteEnabled: true,\n\t\t\t\t\t\tallowBreakoutSnapPoints: true,\n\t\t\t\t\t\tallowAdvancedToolBarOptions: true,\n\t\t\t\t\t\tallowDropzoneDropLine: true,\n\t\t\t\t\t\tallowMediaSingleEditable: true,\n\t\t\t\t\t\tallowImagePreview: true,\n\t\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t\t\twaitForMediaUpload: true,\n\t\t\t\t\t\tallowCaptions: true,\n\t\t\t\t\t},\n\t\t\t\t])\n\t\t\t\t.add(captionPlugin)\n\t\t\t\t.add([\n\t\t\t\t\tannotationPlugin,\n\t\t\t\t\t{\n\t\t\t\t\t\tinlineComment: {},\n\t\t\t\t\t} as AnnotationProviders,\n\t\t\t\t])\n\t\t\t\t.add(extensionPlugin)\n\t\t\t\t.add([\n\t\t\t\t\tshowDiffPlugin,\n\t\t\t\t\t{\n\t\t\t\t\t\tsteps: [step1],\n\t\t\t\t\t\tcolorScheme: colorScheme,\n\t\t\t\t\t\toriginalDoc: {\n\t\t\t\t\t\t\ttype: 'doc',\n\t\t\t\t\t\t\tversion: 1,\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tcontent: [{ type: 'text', text: 'uiod' }],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t},\n\t\t\t\t]),\n\t\t[colorScheme],\n\t);\n\treturn (\n\t\t<>\n\t\t\t<Button\n\t\t\t\tonClick={() => {\n\t\t\t\t\tsetColorScheme(colorScheme === 'traditional' ? 'standard' : 'traditional');\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\tColour scheme: {colorScheme}\n\t\t\t</Button>\n\t\t\t<ComposableEditor\n\t\t\t\tappearance=\"full-page\"\n\t\t\t\tonChange={(view) => {\n\t\t\t\t\tapplyDevTools(view);\n\t\t\t\t}}\n\t\t\t\tpreset={preset}\n\t\t\t\tdefaultValue={{\n\t\t\t\t\ttype: 'doc',\n\t\t\t\t\tversion: 1,\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\ttext: 'abc',\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t}}\n\t\t\t/>\n\t\t</>\n\t);\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ showDiff: BasePluginDependenciesAPI<{ commands: { hideDiff: EditorCommand; scrollToNext: EditorCommand; scrollToPrevious: EditorCommand; showDiff: (config: PMDiffParams) => EditorCommand; }; dependencies: [...]; pluginConfiguration: DiffParams; sharedState: { ...; }; }>; } & RequiredPluginDependenciesAPI<...> & Op...',
			},
			{
				name: 'config',
				type: '{ colorScheme?: ColorScheme; originalDoc: JSONDocNode; steps: StepJson[]; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Tasks And Decisions',
		package: '@atlaskit/editor-plugin-tasks-and-decisions',
		description: 'Tasks and decisions plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-tasks-and-decisions', 'atlaskit'],
		category: 'editor',
		examples: [
			"import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';\nexport default function Editor(): React.JSX.Element {\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add(tasksAndDecisionsPlugin),\n\t);\n\treturn <ComposableEditor appearance=\"full-page\" preset={preset} />;\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ taskDecision: BasePluginDependenciesAPI<{ actions: { indentTaskList: (inputMethod?: IndentationInputMethod) => Command; insertTaskDecision: (listType: TaskDecisionListType, inputMethod?: INPUT_METHOD.FORMATTING | ... 2 more ... | TOOLBAR_MENU_TYPE, addItem?: AddItemTransactionCreator, listLocalId?: string, itemLoc...',
			},
			{
				name: 'config',
				type: 'TasksAndDecisionsPluginOptions',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Text Color',
		package: '@atlaskit/editor-plugin-text-color',
		description: 'Text color plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-text-color', 'atlaskit'],
		category: 'editor',
		examples: [
			"import { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { primaryToolbarPlugin } from '@atlaskit/editor-plugin-primary-toolbar';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { historyPlugin } from '@atlaskit/editor-plugins/history';\nimport { textColorPlugin } from '@atlaskit/editor-plugins/text-color';\nimport { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { undoRedoPlugin } from '@atlaskit/editor-plugins/undo-redo';\nconst Editor = (): React.JSX.Element => {\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(historyPlugin)\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(primaryToolbarPlugin)\n\t\t\t.add(undoRedoPlugin)\n\t\t\t.add(textFormattingPlugin)\n\t\t\t.add(textColorPlugin),\n\t);\n\treturn <ComposableEditor appearance=\"full-page\" preset={preset} />;\n};\nexport default Editor;",
		],
		props: [
			{
				name: 'api',
				type: '{ textColor: BasePluginDependenciesAPI<{ actions: { changeColor: (color: string, inputMethod?: TextColorInputMethod) => Command; }; commands: { changeColor: (color: string, inputMethod?: TextColorInputMethod) => EditorCommand; setPalette: (isPaletteOpen: boolean) => EditorCommand; }; dependencies: Dependencies; plug...',
			},
			{
				name: 'config',
				type: 'boolean | TextColorPluginConfig',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin Track Changes',
		package: '@atlaskit/editor-plugin-track-changes',
		description: 'ShowDiff plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-track-changes', 'atlaskit'],
		category: 'editor',
		examples: [
			"import { IntlProvider } from 'react-intl';\nimport Button from '@atlaskit/button/new';\nimport { cssMap } from '@atlaskit/css';\nimport { EditorPresetBuilder } from '@atlaskit/editor-common/preset';\nimport { useSharedPluginStateSelector } from '@atlaskit/editor-common/use-shared-plugin-state-selector';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { analyticsPlugin } from '@atlaskit/editor-plugin-analytics';\nimport { blockTypePlugin } from '@atlaskit/editor-plugin-block-type';\nimport { codeBlockPlugin } from '@atlaskit/editor-plugin-code-block';\nimport { compositionPlugin } from '@atlaskit/editor-plugin-composition';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugin-content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugin-copy-button';\nimport { datePlugin } from '@atlaskit/editor-plugin-date';\nimport { decorationsPlugin } from '@atlaskit/editor-plugin-decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugin-editor-disabled';\nimport { emojiPlugin } from '@atlaskit/editor-plugin-emoji';\nimport { expandPlugin } from '@atlaskit/editor-plugin-expand';\nimport { extensionPlugin } from '@atlaskit/editor-plugin-extension';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugin-floating-toolbar';\nimport { focusPlugin } from '@atlaskit/editor-plugin-focus';\nimport { gridPlugin } from '@atlaskit/editor-plugin-grid';\nimport { guidelinePlugin } from '@atlaskit/editor-plugin-guideline';\nimport { historyPlugin } from '@atlaskit/editor-plugin-history';\nimport { hyperlinkPlugin } from '@atlaskit/editor-plugin-hyperlink';\nimport { imageUploadPlugin } from '@atlaskit/editor-plugin-image-upload';\nimport { insertBlockPlugin } from '@atlaskit/editor-plugin-insert-block';\nimport { layoutPlugin } from '@atlaskit/editor-plugin-layout';\nimport { listPlugin } from '@atlaskit/editor-plugin-list';\nimport { mediaPlugin } from '@atlaskit/editor-plugin-media';\nimport { mentionsPlugin } from '@atlaskit/editor-plugin-mentions';\nimport { panelPlugin } from '@atlaskit/editor-plugin-panel';\nimport { placeholderTextPlugin } from '@atlaskit/editor-plugin-placeholder-text';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugin-quick-insert';\nimport { rulePlugin } from '@atlaskit/editor-plugin-rule';\nimport { selectionPlugin } from '@atlaskit/editor-plugin-selection';\nimport { showDiffPlugin } from '@atlaskit/editor-plugin-show-diff';\nimport { statusPlugin } from '@atlaskit/editor-plugin-status';\nimport { tablesPlugin } from '@atlaskit/editor-plugin-table';\nimport { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugin-tasks-and-decisions';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugin-type-ahead';\nimport { widthPlugin } from '@atlaskit/editor-plugin-width';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport { token } from '@atlaskit/tokens';\nimport { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';\nimport { trackChangesPlugin } from '../src/trackChangesPlugin';\nconst styles = cssMap({\n\taboveEditor: {\n\t\tposition: 'fixed',\n\t\tbottom: 0,\n\t\tzIndex: 800,\n\t\tpaddingTop: token('space.100'),\n\t\tpaddingBottom: token('space.100'),\n\t},\n\teverythingContainer: {\n\t\tpaddingTop: token('space.200'),\n\t\tpaddingBottom: token('space.200'),\n\t\tpaddingLeft: token('space.200'),\n\t\tpaddingRight: token('space.200'),\n\t},\n});\nconst createPreset = () =>\n\tnew EditorPresetBuilder()\n\t\t.add(basePlugin)\n\t\t.add(typeAheadPlugin)\n\t\t.add(widthPlugin)\n\t\t.add(compositionPlugin)\n\t\t.add([analyticsPlugin, {}])\n\t\t.add(editorDisabledPlugin)\n\t\t.add(contentInsertionPlugin)\n\t\t.add(guidelinePlugin)\n\t\t.add(selectionPlugin)\n\t\t.add(decorationsPlugin)\n\t\t.add(hyperlinkPlugin)\n\t\t.add(datePlugin)\n\t\t.add(listPlugin)\n\t\t.add(blockTypePlugin)\n\t\t.add(imageUploadPlugin)\n\t\t.add([emojiPlugin, { emojiProvider: getEmojiResource() }])\n\t\t.add(quickInsertPlugin)\n\t\t.add(rulePlugin)\n\t\t.add(codeBlockPlugin)\n\t\t.add(panelPlugin)\n\t\t.add(focusPlugin)\n\t\t.add(gridPlugin)\n\t\t.add(copyButtonPlugin)\n\t\t.add(floatingToolbarPlugin)\n\t\t.add(mediaPlugin)\n\t\t.add(statusPlugin)\n\t\t.add(mentionsPlugin)\n\t\t.add(layoutPlugin)\n\t\t.add(expandPlugin)\n\t\t.add([placeholderTextPlugin, {}])\n\t\t.add(extensionPlugin)\n\t\t.add(tasksAndDecisionsPlugin)\n\t\t.add(textFormattingPlugin)\n\t\t.add([tablesPlugin, { tableOptions: { advanced: true } }])\n\t\t.add([\n\t\t\tinsertBlockPlugin,\n\t\t\t{\n\t\t\t\tallowExpand: true,\n\t\t\t\thorizontalRuleEnabled: true,\n\t\t\t\tnativeStatusSupported: true,\n\t\t\t},\n\t\t])\n\t\t.add(historyPlugin)\n\t\t.add(showDiffPlugin)\n\t\t.add(trackChangesPlugin);\nfunction Editor(): React.JSX.Element {\n\tconst { preset, editorApi } = usePreset(createPreset);\n\tconst isSelected = useSharedPluginStateSelector(editorApi, 'trackChanges.isDisplayingChanges');\n\tconst activeIndex = useSharedPluginStateSelector(editorApi, 'showDiff.activeIndex');\n\tconst isShowDiffAvailable = useSharedPluginStateSelector(\n\t\teditorApi,\n\t\t'trackChanges.isShowDiffAvailable',\n\t);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<Box xcss={styles.everythingContainer}>\n\t\t\t\t<Box xcss={styles.aboveEditor}>\n\t\t\t\t\t<Button\n\t\t\t\t\t\tappearance=\"primary\"\n\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\teditorApi?.core.actions.execute(editorApi?.trackChanges.commands.toggleChanges);\n\t\t\t\t\t\t}}\n\t\t\t\t\t\tisSelected={isSelected}\n\t\t\t\t\t\tisDisabled={!(isShowDiffAvailable ?? false)}\n\t\t\t\t\t>\n\t\t\t\t\t\tShow Diff\n\t\t\t\t\t</Button>\n\t\t\t\t\t<Button\n\t\t\t\t\t\tappearance=\"primary\"\n\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\teditorApi?.core.actions.execute(editorApi?.showDiff.commands.scrollToNext);\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\tNext\n\t\t\t\t\t</Button>\n\t\t\t\t\t<Button\n\t\t\t\t\t\tappearance=\"primary\"\n\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\teditorApi?.core.actions.execute(editorApi?.showDiff.commands.scrollToPrevious);\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\tPrevious\n\t\t\t\t\t</Button>\n\t\t\t\t\t<Button>{activeIndex}</Button>\n\t\t\t\t</Box>\n\t\t\t\t<ComposableEditor preset={preset} appearance=\"comment\" />\n\t\t\t</Box>\n\t\t</IntlProvider>\n\t);\n}\nexport default Editor;",
		],
		props: [
			{
				name: 'api',
				type: '{ trackChanges: BasePluginDependenciesAPI<{ commands: { resetBaseline: EditorCommand; toggleChanges: EditorCommand; }; dependencies: [OptionalPlugin<NextEditorPluginFunctionOptionalConfigDefinition<"primaryToolbar", { actions: { registerComponent: ({ name, component, }: { ...; }) => void; }; pluginConfiguration?: Pr...',
			},
			{
				name: 'config',
				type: 'TrackChangesPluginOptions',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Plugin User Preferences',
		package: '@atlaskit/editor-plugin-user-preferences',
		description: 'UserPreferences plugin for @atlaskit/editor-core',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-plugin-user-preferences', 'atlaskit'],
		category: 'editor',
		examples: [
			"import applyDevTools from 'prosemirror-dev-tools';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { analyticsPlugin } from '@atlaskit/editor-plugins/analytics';\nimport { annotationPlugin } from '@atlaskit/editor-plugins/annotation';\nimport type { AnnotationProviders } from '@atlaskit/editor-plugins/annotation';\nimport { basePlugin } from '@atlaskit/editor-plugins/base';\nimport { blockControlsPlugin } from '@atlaskit/editor-plugins/block-controls';\nimport { blockTypePlugin } from '@atlaskit/editor-plugins/block-type';\nimport { breakoutPlugin } from '@atlaskit/editor-plugins/breakout';\nimport { codeBlockPlugin } from '@atlaskit/editor-plugins/code-block';\nimport { compositionPlugin } from '@atlaskit/editor-plugins/composition';\nimport { contentInsertionPlugin } from '@atlaskit/editor-plugins/content-insertion';\nimport { copyButtonPlugin } from '@atlaskit/editor-plugins/copy-button';\nimport { decorationsPlugin } from '@atlaskit/editor-plugins/decorations';\nimport { editorDisabledPlugin } from '@atlaskit/editor-plugins/editor-disabled';\nimport { emojiPlugin } from '@atlaskit/editor-plugins/emoji';\nimport { expandPlugin } from '@atlaskit/editor-plugins/expand';\nimport { extensionPlugin } from '@atlaskit/editor-plugins/extension';\nimport { floatingToolbarPlugin } from '@atlaskit/editor-plugins/floating-toolbar';\nimport { focusPlugin } from '@atlaskit/editor-plugins/focus';\nimport { gridPlugin } from '@atlaskit/editor-plugins/grid';\nimport { guidelinePlugin } from '@atlaskit/editor-plugins/guideline';\nimport { layoutPlugin } from '@atlaskit/editor-plugins/layout';\nimport { listPlugin } from '@atlaskit/editor-plugins/list';\nimport { mediaPlugin } from '@atlaskit/editor-plugins/media';\nimport { panelPlugin } from '@atlaskit/editor-plugins/panel';\nimport { quickInsertPlugin } from '@atlaskit/editor-plugins/quick-insert';\nimport { rulePlugin } from '@atlaskit/editor-plugins/rule';\nimport { selectionPlugin } from '@atlaskit/editor-plugins/selection';\nimport { selectionToolbarPlugin } from '@atlaskit/editor-plugins/selection-toolbar';\nimport { tablesPlugin } from '@atlaskit/editor-plugins/table';\nimport { tasksAndDecisionsPlugin } from '@atlaskit/editor-plugins/tasks-and-decisions';\nimport { textFormattingPlugin } from '@atlaskit/editor-plugins/text-formatting';\nimport { typeAheadPlugin } from '@atlaskit/editor-plugins/type-ahead';\nimport { widthPlugin } from '@atlaskit/editor-plugins/width';\nimport { getUserPreferencesProvider } from '@atlaskit/editor-test-helpers/mock-user-preference-provider';\nimport { userPreferencesPlugin } from '../src';\n/**\n * This is an example Editor class\n * @example return <Editor />\n */\nexport default function Editor(): React.JSX.Element {\n\tconst { preset } = usePreset((builder) =>\n\t\tbuilder\n\t\t\t.add(basePlugin)\n\t\t\t.add(blockTypePlugin)\n\t\t\t.add([userPreferencesPlugin, { userPreferencesProvider: getUserPreferencesProvider() }])\n\t\t\t.add(focusPlugin)\n\t\t\t.add(typeAheadPlugin)\n\t\t\t.add(quickInsertPlugin)\n\t\t\t.add(selectionPlugin)\n\t\t\t.add(decorationsPlugin)\n\t\t\t.add(layoutPlugin)\n\t\t\t.add(listPlugin)\n\t\t\t.add([analyticsPlugin, {}])\n\t\t\t.add(contentInsertionPlugin)\n\t\t\t.add(widthPlugin)\n\t\t\t.add(guidelinePlugin)\n\t\t\t.add(textFormattingPlugin)\n\t\t\t.add([\n\t\t\t\ttablesPlugin,\n\t\t\t\t{\n\t\t\t\t\ttableOptions: {\n\t\t\t\t\t\tadvanced: true,\n\t\t\t\t\t\tallowColumnResizing: true,\n\t\t\t\t\t\tallowHeaderRow: true,\n\t\t\t\t\t\tallowTableResizing: true,\n\t\t\t\t\t},\n\t\t\t\t\tisTableScalingEnabled: true,\n\t\t\t\t\tallowContextualMenu: true,\n\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add(emojiPlugin)\n\t\t\t.add(panelPlugin)\n\t\t\t.add(rulePlugin)\n\t\t\t.add(tasksAndDecisionsPlugin)\n\t\t\t.add([expandPlugin, { allowInsertion: true, appearance: 'full-page' }])\n\t\t\t.add(editorDisabledPlugin)\n\t\t\t.add(copyButtonPlugin)\n\t\t\t.add(compositionPlugin)\n\t\t\t.add(codeBlockPlugin)\n\t\t\t.add(blockControlsPlugin)\n\t\t\t.add(breakoutPlugin)\n\t\t\t.add(gridPlugin)\n\t\t\t.add(floatingToolbarPlugin)\n\t\t\t.add([\n\t\t\t\tselectionToolbarPlugin,\n\t\t\t\t{\n\t\t\t\t\tpreferenceToolbarAboveSelection: true,\n\t\t\t\t\tcontextualFormattingEnabled: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add([\n\t\t\t\tmediaPlugin,\n\t\t\t\t{\n\t\t\t\t\tallowMediaSingle: { disableLayout: true },\n\t\t\t\t\tallowMediaGroup: false,\n\t\t\t\t\tallowResizing: true,\n\t\t\t\t\tisCopyPasteEnabled: true,\n\t\t\t\t\tallowBreakoutSnapPoints: true,\n\t\t\t\t\tallowAdvancedToolBarOptions: true,\n\t\t\t\t\tallowDropzoneDropLine: true,\n\t\t\t\t\tallowMediaSingleEditable: true,\n\t\t\t\t\tallowImagePreview: true,\n\t\t\t\t\tfullWidthEnabled: true,\n\t\t\t\t\twaitForMediaUpload: true,\n\t\t\t\t},\n\t\t\t])\n\t\t\t.add([\n\t\t\t\tannotationPlugin,\n\t\t\t\t{\n\t\t\t\t\tinlineComment: {},\n\t\t\t\t} as AnnotationProviders,\n\t\t\t])\n\t\t\t.add(extensionPlugin),\n\t);\n\treturn (\n\t\t<ComposableEditor\n\t\t\tappearance=\"full-page\"\n\t\t\tonChange={(view) => {\n\t\t\t\tapplyDevTools(view);\n\t\t\t}}\n\t\t\tpreset={preset}\n\t\t/>\n\t);\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ userPreferences: BasePluginDependenciesAPI<{ actions: { getUserPreferences: () => ResolvedUserPreferences; updateUserPreference: (key: "toolbarDockingPosition", value: "top" | "none") => EditorCommand; }; commands: { ...; }; dependencies: [...]; pluginConfiguration: UserPreferencesPluginOptions; sharedState: UserP...',
			},
			{
				name: 'config',
				type: '{ initialUserPreferences?: ResolvedUserPreferences; userPreferencesProvider?: UserPreferencesProvider; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'Editor Ssr Renderer',
		package: '@atlaskit/editor-ssr-renderer',
		description: 'SSR Renderer based on Editor',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-ssr-renderer', 'atlaskit'],
		category: 'editor',
		examples: [
			"import type { JSX } from 'react';\nimport { createExample } from '../example-helpers/createExample';\nconst AllNodesExample: () => JSX.Element = createExample({\n\tversion: 1,\n\ttype: 'doc',\n\tcontent: [\n\t\t{\n\t\t\ttype: 'heading',\n\t\t\tattrs: {\n\t\t\t\tlevel: 1,\n\t\t\t\tlocalId: 'b4f3e2e3-5f4a-4f6d-8f4e-1c2e5d6a7b8c',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Hydrate ADF Example',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'taskList',\n\t\t\tattrs: {\n\t\t\t\tlocalId: '71f8c24d-4b69-48c4-9fa9-be30a8050158',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'taskItem',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tlocalId: '8a0fe9b4-f087-4079-90be-230c89902a30',\n\t\t\t\t\t\tstate: 'TODO',\n\t\t\t\t\t},\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\ttext: 'items 1',\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'taskItem',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tlocalId: 'dfbd3b3f-915e-45cc-8fdb-4dcf57a3bcbe',\n\t\t\t\t\t\tstate: 'TODO',\n\t\t\t\t\t},\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\ttext: 'item 2',\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'taskItem',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tlocalId: '543abf63-1883-4bbc-8a15-3dfeed52325d',\n\t\t\t\t\t\tstate: 'TODO',\n\t\t\t\t\t},\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'date',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\ttimestamp: '1650499200000',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\ttext: ' ',\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'bulletList',\n\t\t\tattrs: {\n\t\t\t\tlocalId: '12c103f9-b76d-4f1e-b961-a3936b2702de',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'listItem',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tlocalId: 'b1b3abf6-1db5-4a9a-bfaa-b6764c9f9112',\n\t\t\t\t\t},\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: '151acfae-ae82-4ef9-beeb-f88ec1c9894b',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\ttext: 'Hello ',\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'date',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\ttimestamp: '1757635200000',\n\t\t\t\t\t\t\t\t\t\tlocalId: '55acf137-5d94-45d9-90b4-b723fa28c985',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'listItem',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tlocalId: 'b1b3abf6-1db5-4a9a-bfaa-b6764c9f9112',\n\t\t\t\t\t},\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: '50501685-2dc4-4392-91bd-b128efcf9895',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'mention',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tid: '0',\n\t\t\t\t\t\t\t\t\t\tlocalId: '46c3bfd5-beea-4b0c-995c-046c1acc9d30',\n\t\t\t\t\t\t\t\t\t\ttext: '',\n\t\t\t\t\t\t\t\t\t\taccessLevel: '',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\ttext: ' ',\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'blockCard',\n\t\t\tattrs: {\n\t\t\t\tlocalId: 'c7f5005a-fea1-45ea-8f8d-c5b343c97b9e',\n\t\t\t\turl: 'https://google.com',\n\t\t\t},\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tattrs: {\n\t\t\t\tlocalId: '9fc1c384-5431-429e-80f8-c874e24f6533',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Elit duis quis minim. Et incididunt quis elit dolor cupidatat occaecat sunt ut quis aute. Enim esse non proident adipisicing et. Sit deserunt deserunt veniam commodo cupidatat labore tempor et non. Elit tempor ut voluptate et. Qui nostrud consectetur magna velit elit aliquip laboris magna ex qui sunt id. Ad Lorem ex ipsum officia incididunt aliqua fugiat enim elit in incididunt irure proident id nostrud. Incididunt fugiat proident pariatur dolor cupidatat sit. ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'emoji',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tshortName: ':trident:',\n\t\t\t\t\t\tid: '1f531',\n\t\t\t\t\t\ttext: '🔱',\n\t\t\t\t\t\tlocalId: 'fdb75b26-aae0-4be8-9b2b-a4e778e0a2cd',\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' ',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'table',\n\t\t\tattrs: {\n\t\t\t\tisNumberColumnEnabled: false,\n\t\t\t\tlayout: 'default',\n\t\t\t\tlocalId: 'd7a03990-a862-4bfd-ad17-b2e9f6a4ff2e',\n\t\t\t\twidth: 760,\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'tableRow',\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableHeader',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: '1e6b8676-4f0e-426b-a9a4-423d72123d24',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: '6b4e9510-f922-4ba7-bf81-f33465b7d367',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: 'Col 1',\n\t\t\t\t\t\t\t\t\t\t\tmarks: [\n\t\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype: 'strong',\n\t\t\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableHeader',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: 'e10f2258-1d22-4f6d-b98a-b3880a1747e8',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: '3dc0dc33-e9ca-4638-ad47-338ca67895ae',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: 'Col 2',\n\t\t\t\t\t\t\t\t\t\t\tmarks: [\n\t\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype: 'strong',\n\t\t\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableHeader',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: 'aa660cd1-e1d7-48e1-96cc-65e505c17cd5',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: 'a77ae3e3-240a-4a7a-a945-bd8b28adedbd',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: 'Col 3',\n\t\t\t\t\t\t\t\t\t\t\tmarks: [\n\t\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype: 'strong',\n\t\t\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'tableRow',\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: '8f95d973-3224-48e9-988f-ad4505177f66',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: 'c2f4f7ff-f648-4a9a-839a-8453565fdd34',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: '1',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: 'a131fc8c-a5a7-45e1-8097-f6a9187e3b08',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: '03c17a33-b317-443d-ae7b-ae3198a5a396',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: '3',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: 'c3e4e6cb-ec68-4789-a172-f79e06fdec4a',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: '233cbe23-3a97-4fb2-adf6-a38ca8916b3a',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: '3',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'tableRow',\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: 'e0530369-06f8-4984-932d-2fb257bf9d8b',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: '108448ca-1b20-449e-bcb6-1919cf5b7153',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: '4',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: 'ffebed1c-357e-4432-be6b-3b7f79efc562',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: '54c11e58-63b2-4dc6-823a-96819e45293a',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: '5',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'tableCell',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\tlocalId: '7f1ab7c1-f241-4788-a6c6-eddfb91a0fb3',\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\t\t\tlocalId: '5ba7b61d-49e7-464a-a468-b57fb628815a',\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\tcontent: [\n\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\t\t\t\t\ttext: '6',\n\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t],\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tattrs: {\n\t\t\t\tlocalId: 'e89b40f3-a58d-4b41-a4f3-38ff275aaeee',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Exercitation culpa dolore laboris est esse excepteur nisi cupidatat. Consectetur culpa occaecat qui proident laboris veniam do ex incididunt labore ut enim. Pariatur mollit sit eu laboris laboris reprehenderit anim labore dolore nostrud qui id quis eu et. Esse deserunt laborum laborum ut. Officia adipisicing qui proident commodo ex. Nulla cillum ea minim officia cillum voluptate sint consectetur culpa nostrud eu aliquip pariatur dolore nulla.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'mediaSingle',\n\t\t\tattrs: {\n\t\t\t\tlayout: 'center',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'media',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\ttype: 'file',\n\t\t\t\t\t\tlocalId: 'ded80750-25e1-4ecd-9aaa-65074b845afb',\n\t\t\t\t\t\tid: 'a47d3e72-58e9-43fa-b8bc-29613d2a17ff',\n\t\t\t\t\t\talt: 'GiBxSz9bcAAJ0qF.jpeg',\n\t\t\t\t\t\tcollection: 'MediaServicesSample',\n\t\t\t\t\t\theight: 2059,\n\t\t\t\t\t\twidth: 1536,\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tattrs: {\n\t\t\t\tlocalId: 'f9c037cf-0e43-410a-a486-b8853b02c5c1',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Sunt magna sit labore ea. Nulla aliquip dolor occaecat minim ex amet in officia exercitation. Occaecat enim ea Lorem amet laboris laboris aute dolor cillum sit excepteur ipsum. Ad dolore et ipsum non. Sint adipisicing consequat ea aliqua exercitation aliquip quis commodo adipisicing. Excepteur tempor excepteur ea nostrud exercitation laborum incididunt duis reprehenderit pariatur culpa proident.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'expand',\n\t\t\tattrs: {\n\t\t\t\ttitle: '',\n\t\t\t\tlocalId: '68b6b5f5-4979-41fa-aa00-e07ff7653f60',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'paragraph',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tlocalId: '0c39b970-4eb6-4c7f-ad64-dc7eeb37260d',\n\t\t\t\t\t},\n\t\t\t\t\tcontent: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'text',\n\t\t\t\t\t\t\ttext: 'Sunt magna sit labore ea. Nulla aliquip dolor occaecat minim ex amet in officia exercitation. Occaecat enim ea Lorem amet laboris laboris aute dolor cillum sit excepteur ipsum. Ad dolore et ipsum non. Sint adipisicing consequat ea aliqua exercitation aliquip quis commodo adipisicing. Excepteur tempor excepteur ea nostrud exercitation laborum incididunt duis reprehenderit pariatur culpa proident.',\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t],\n\t\t\tmarks: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'breakout',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tmode: 'wide',\n\t\t\t\t\t\twidth: null,\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'codeBlock',\n\t\t\tattrs: {\n\t\t\t\tlanguage: 'typescript',\n\t\t\t\tlocalId: 'bc950717-bb4f-4edb-9895-9025f8708ce6',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'var a = 1;',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'embedCard',\n\t\t\tattrs: {\n\t\t\t\turl: 'https://www.loom.com/share/f884ee7e062843a3bb7acb8ad6cd9234',\n\t\t\t\tlayout: 'align-end',\n\t\t\t},\n\t\t},\n\t],\n});\nexport default AllNodesExample;",
			"import type { JSX } from 'react';\nimport { createExample } from '../example-helpers/createExample';\nconst CodeBlocksExample: () => JSX.Element = createExample({\n\tversion: 1,\n\ttype: 'doc',\n\tcontent: [\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'This is an example document with text and code blocks.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'codeBlock',\n\t\t\tattrs: {\n\t\t\t\tlanguage: 'javascript',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: \"const greeting = 'Hello, World!';\\nconsole.log(greeting);\",\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Here is another example with Python code:',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'codeBlock',\n\t\t\tattrs: {\n\t\t\t\tlanguage: 'python',\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: \"def hello():\\n    print('Hello, World!')\\n\\nhello()\",\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'And a final paragraph of text.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t],\n});\nexport default CodeBlocksExample;",
			"import type { JSX } from 'react';\nimport { createExample } from '../example-helpers/createExample';\nconst TextExample: () => JSX.Element = createExample({\n\tversion: 1,\n\ttype: 'doc',\n\tcontent: [\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'This is the first paragraph with ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'bold text',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'strong',\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: '.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'This is the second paragraph where ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'some words',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'strong',\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' are bolded.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'This third paragraph contains only regular text.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'Here is a paragraph where ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: 'most of the text',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'strong',\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' is bolded.',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t],\n});\nexport default TextExample;",
		],
		props: [
			{
				name: 'aria-describedby',
				type: 'string',
			},
			{
				name: 'aria-label',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'className',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'data-editor-id',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'doc',
				type: 'PMNode',
				isRequired: true,
			},
			{
				name: 'id',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'intl',
				type: 'IntlShape',
				isRequired: true,
			},
			{
				name: 'onEditorStateChanged',
				type: '(state: EditorState) => void',
			},
			{
				name: 'onSSRMeasure',
				type: '(measure: { endTimestamp: number; segmentName: string; startTimestamp: number; }) => void',
			},
			{
				name: 'plugins',
				type: 'EditorPlugin[]',
				isRequired: true,
			},
			{
				name: 'portalProviderAPI',
				type: 'PortalProviderAPI',
				isRequired: true,
			},
			{
				name: 'schema',
				type: 'Schema<any, any>',
				isRequired: true,
			},
		],
	},
	{
		name: 'AssetsConfigModal',
		package: '@atlaskit/link-datasource',
		description:
			'Configuration modal for the Assets (object schema) datasource. Lets users set up a list of links from an Assets schema and produces Assets datasource ADF.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the user is configuring an Assets-based list of links. On confirm, use the returned parameters for datasource ADF or table view.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and that schema/object pickers have clear labels.',
		],
		keywords: ['link-datasource', 'assets', 'datasource', 'config', 'modal'],
		category: 'linking',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { mockAssetsClientFetchRequests } from '@atlaskit/link-test-helpers/assets';\nimport SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';\nimport { ASSETS_LIST_OF_LINKS_DATASOURCE_ID, type AssetsDatasourceParameters } from '../../src';\nimport JSMAssetsConfigModal from '../../src/ui/assets-modal';\nmockAssetsClientFetchRequests({ delayedResponse: false });\nconst mockVisibleColumnKeys = [\n\t'Key',\n\t'Label',\n\t'Created',\n\t'Is Virtual',\n\t'Hardware Components',\n\t'Applications',\n\t'Software Services',\n\t'Number of Slots',\n\t'Primary Capability',\n\t'Owners',\n\t'Notes',\n];\nexport default (): React.JSX.Element => {\n\tconst [showModal, setShowModal] = useState(false);\n\tconst [parameters] = useState<AssetsDatasourceParameters>({\n\t\taql: 'dummy aql',\n\t\tworkspaceId: '',\n\t\tschemaId: '1',\n\t});\n\tconst [visibleColumnKeys] = useState<string[] | undefined>(mockVisibleColumnKeys);\n\tconst toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);\n\tconst closeModal = () => setShowModal(false);\n\treturn (\n\t\t<SmartCardProvider client={new SmartLinkClient()}>\n\t\t\t<Button appearance=\"primary\" onClick={toggleIsOpen}>\n\t\t\t\tToggle Modal\n\t\t\t</Button>\n\t\t\t{showModal && (\n\t\t\t\t<JSMAssetsConfigModal\n\t\t\t\t\tdatasourceId={ASSETS_LIST_OF_LINKS_DATASOURCE_ID}\n\t\t\t\t\tvisibleColumnKeys={visibleColumnKeys}\n\t\t\t\t\tparameters={parameters}\n\t\t\t\t\tonCancel={closeModal}\n\t\t\t\t\tonInsert={closeModal}\n\t\t\t\t/>\n\t\t\t)}\n\t\t</SmartCardProvider>\n\t);\n};",
		],
		props: [
			{
				name: 'columnCustomSizes',
				type: 'ColumnSizesMap',
				description: 'Map of column key to custom column width',
			},
			{
				name: 'datasourceId',
				type: 'string',
				description:
					'Unique identifier for which type of datasource is being rendered and for making its requests',
				isRequired: true,
			},
			{
				name: 'disableDisplayDropdown',
				type: 'boolean',
				description: 'Disable the view mode display dropdown',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description:
					'Callback function to be invoked when the modal is closed either via cancel button click, esc keydown, or modal blanket click',
				isRequired: true,
			},
			{
				name: 'onInsert',
				type: '(adf: InlineCardAdf | AssetsDatasourceAdf, analyticsEvent?: UIAnalyticsEvent) => void',
				description: 'Callback function to be invoked when the insert issues button is clicked',
				isRequired: true,
			},
			{
				name: 'parameters',
				type: 'DatasourceParameters | AssetsDatasourceParameters',
				description:
					'Parameters for making the data requests necessary to render data within the table',
			},
			{
				name: 'shouldReturnFocus',
				type: 'boolean | React.RefObject<HTMLElement>',
				description:
					'Set the focus to return to the element that had focus before focus lock was activated or pass through a specific ref element\nDefaults to false, meaning focus remains where it was when the FocusLock was deactivated',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The url that was used to insert a List of Links',
			},
			{
				name: 'viewMode',
				type: '"table" | "inline"',
				description:
					"The view mode that the modal will show on open:\n- Table = Displays a list of links in table format\n- Inline = Presents a smart link that shows the count of query results. However, if there's only one result, it converts to an inline smart link of that issue.",
			},
			{
				name: 'visibleColumnKeys',
				type: 'string[]',
				description: 'List of properties/column keys that are visible/selected',
			},
			{
				name: 'wrappedColumnKeys',
				type: 'string[]',
				description:
					'List of column keys that needs to be shown without truncation (content will wrap to a new line)',
			},
		],
	},
	{
		name: 'ConfluenceSearchConfigModal',
		package: '@atlaskit/link-datasource',
		description:
			'Configuration modal for the Confluence search datasource. Lets users set up a "list of links" backed by a Confluence search query (space, query, sort) and produces Confluence search datasource ADF.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the user is configuring a Confluence search-based list of links (e.g. in a block or sidebar). On confirm, use the returned parameters to build datasource ADF or pass to DatasourceTableView.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and focus is trapped; form fields (space, query, sort) must have labels and error messages announced.',
		],
		keywords: ['link-datasource', 'confluence', 'search', 'datasource', 'config', 'modal'],
		category: 'linking',
		examples: [
			"import React, { useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport Button from '@atlaskit/button/standard-button';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport {\n\tdefaultInitialVisibleConfluenceColumnKeys,\n\tmockBasicFilterAGGFetchRequests,\n\tmockDatasourceFetchRequests,\n\tmockProductsData,\n\tmockSiteData,\n} from '@atlaskit/link-test-helpers/datasource';\nimport SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';\nimport { CONFLUENCE_SEARCH_DATASOURCE_ID } from '../../src/ui/confluence-search-modal';\nimport { ConfluenceSearchConfigModal } from '../../src/ui/confluence-search-modal/modal';\nimport { type ConfluenceSearchDatasourceParameters } from '../../src/ui/confluence-search-modal/types';\nmockDatasourceFetchRequests({\n\ttype: 'confluence',\n\tdelayedResponse: false,\n\tshouldMockORSBatch: true,\n\tavailableSitesOverride: mockSiteData.filter(\n\t\t(site) => !['test1', 'test2', 'test4'].includes(site.displayName),\n\t),\n\taccessibleProductsOverride: mockProductsData.filter((product) =>\n\t\t['confluence.ondemand'].includes(product.productId),\n\t),\n});\nmockBasicFilterAGGFetchRequests();\nexport default (): React.JSX.Element => {\n\tconst [showModal, setShowModal] = useState(false);\n\tconst [parameters] = useState<ConfluenceSearchDatasourceParameters>({\n\t\tcloudId: '67899',\n\t\tsearchString: 'Searched something',\n\t});\n\tconst [visibleColumnKeys] = useState<string[] | undefined>(\n\t\tdefaultInitialVisibleConfluenceColumnKeys,\n\t);\n\tconst toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);\n\tconst closeModal = () => setShowModal(false);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<SmartCardProvider client={new SmartLinkClient()}>\n\t\t\t\t<Button appearance=\"primary\" onClick={toggleIsOpen}>\n\t\t\t\t\tToggle Modal\n\t\t\t\t</Button>\n\t\t\t\t{showModal && (\n\t\t\t\t\t<ConfluenceSearchConfigModal\n\t\t\t\t\t\tdatasourceId={CONFLUENCE_SEARCH_DATASOURCE_ID}\n\t\t\t\t\t\tvisibleColumnKeys={visibleColumnKeys}\n\t\t\t\t\t\tparameters={parameters}\n\t\t\t\t\t\tonCancel={closeModal}\n\t\t\t\t\t\tonInsert={closeModal}\n\t\t\t\t\t/>\n\t\t\t\t)}\n\t\t\t</SmartCardProvider>\n\t\t</IntlProvider>\n\t);\n};",
		],
		props: [
			{
				name: 'columnCustomSizes',
				type: 'ColumnSizesMap',
				description: 'Map of column key to custom column width',
			},
			{
				name: 'datasourceId',
				type: 'string',
				description:
					'Unique identifier for which type of datasource is being rendered and for making its requests',
				isRequired: true,
			},
			{
				name: 'disableDisplayDropdown',
				type: 'boolean',
				description: 'Disable the view mode display dropdown',
			},
			{
				name: 'disableSiteSelector',
				type: 'boolean',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description:
					'Callback function to be invoked when the modal is closed either via cancel button click, esc keydown, or modal blanket click',
				isRequired: true,
			},
			{
				name: 'onInsert',
				type: '(adf: InlineCardAdf | ConfluenceSearchDatasourceAdf, analyticsEvent?: UIAnalyticsEvent) => void',
				description: 'Callback function to be invoked when the insert issues button is clicked',
				isRequired: true,
			},
			{
				name: 'overrideParameters',
				type: '{ entityTypes?: string[]; }',
			},
			{
				name: 'parameters',
				type: 'DatasourceParameters | ConfluenceSearchDatasourceParameters',
				description:
					'Parameters for making the data requests necessary to render data within the table',
			},
			{
				name: 'shouldReturnFocus',
				type: 'boolean | React.RefObject<HTMLElement>',
				description:
					'Set the focus to return to the element that had focus before focus lock was activated or pass through a specific ref element\nDefaults to false, meaning focus remains where it was when the FocusLock was deactivated',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The url that was used to insert a List of Links',
			},
			{
				name: 'viewMode',
				type: '"table" | "inline"',
				description:
					"The view mode that the modal will show on open:\n- Table = Displays a list of links in table format\n- Inline = Presents a smart link that shows the count of query results. However, if there's only one result, it converts to an inline smart link of that issue.",
			},
			{
				name: 'visibleColumnKeys',
				type: 'string[]',
				description: 'List of properties/column keys that are visible/selected',
			},
			{
				name: 'wrappedColumnKeys',
				type: 'string[]',
				description:
					'List of column keys that needs to be shown without truncation (content will wrap to a new line)',
			},
		],
	},
	{
		name: 'DatasourceTableView',
		package: '@atlaskit/link-datasource',
		description:
			'Table view component that renders a datasource (list of links) with configurable columns, sorting, and actions. Consumes datasource ADF or parameters and fetches data via the link client.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to display a list of links (Jira issues, Confluence search, Assets) in a table. Pass the datasource ADF or parameters; wrap in SmartCardProvider so resolution and actions work.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the table has a caption or aria-label; column headers and sort controls must be focusable and announced. Loading and error states should be announced.',
		],
		keywords: ['link-datasource', 'table', 'datasource', 'list of links', 'view'],
		category: 'linking',
		examples: [
			"import { DatasourceTableView } from '@atlaskit/link-datasource';\nimport { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';\nimport { FakeModalDialogContainer } from '../examples-helpers/fakeModalDialogContainer';\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<FakeModalDialogContainer>\n\t\t\t<ExampleJiraIssuesTableView DatasourceTable={DatasourceTableView} />\n\t\t</FakeModalDialogContainer>\n\t);\n};",
		],
		props: [
			{
				name: 'columnCustomSizes',
				type: 'ColumnSizesMap',
				description: 'Map of column key to custom column width',
			},
			{
				name: 'datasourceId',
				type: 'string',
				description:
					'Unique identifier for which type of datasource is being rendered and for making its requests',
				isRequired: true,
			},
			{
				name: 'onColumnResize',
				type: '(key: string, width: number) => void',
			},
			{
				name: 'onColumnSort',
				type: '(key: string) => void',
				description: 'Callback to be invoked whenever a user sorts a datasource table by a column.',
			},
			{
				name: 'onVisibleColumnKeysChange',
				type: '(visibleColumnKeys: string[]) => void',
				description:
					'Callback to be invoked whenever a user changes the visible columns in a datasource table\neither by selecting/unselecting or reordering (drag and drop)\n\n@param visibleColumnKeys the array of keys for all of the selected columns',
			},
			{
				name: 'onWrappedColumnChange',
				type: '(key: string, shouldWrap: boolean) => void',
				description:
					'Callback to be invoked whenever user changes wrap attribute of the column.\n\n@param key Column key\n@param shouldWrap  Whenever column should wrap',
			},
			{
				name: 'parameters',
				type: 'DatasourceParameters',
				description:
					'Parameters for making the data requests necessary to render data within the table',
				isRequired: true,
			},
			{
				name: 'scrollableContainerHeight',
				type: 'number',
				description:
					'If this number is set it will restrict (max-height) maximum size of the component AND make main container a scrollable container.\nIt this number is 0 it will not restrict height and not make container scrollable.',
			},
			{
				name: 'sortState',
				type: '{ direction: DatasourceTableSortDirection; key: string; }',
			},
			{
				name: 'url',
				type: 'string',
				description:
					'Url for an existing datasource, initially used for displaying to a user unauthorized to query that site',
			},
			{
				name: 'visibleColumnKeys',
				type: 'string[]',
				description: 'List of properties/column keys that are visible/selected',
			},
			{
				name: 'wrappedColumnKeys',
				type: 'string[]',
				description:
					'List of column keys that needs to be shown without truncation (content will wrap to a new line)',
			},
		],
	},
	{
		name: 'JiraIssuesConfigModal',
		package: '@atlaskit/link-datasource',
		description:
			'Configuration modal for the Jira issues datasource. Lets users set up a list of Jira issues (JQL, columns, filters) and produces Jira issues datasource ADF.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the user is configuring a Jira issues list (e.g. in a block or table). On confirm, use the returned parameters for datasource ADF or DatasourceTableView.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and focus management; JQL and column pickers must have clear labels and error announcements.',
		],
		keywords: ['link-datasource', 'jira', 'issues', 'datasource', 'config', 'modal', 'JQL'],
		category: 'linking',
		examples: [
			"import React, { useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport Button from '@atlaskit/button/new';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport {\n\tdefaultInitialVisibleJiraColumnKeys,\n\tmockBasicFilterAGGFetchRequests,\n\tmockDatasourceFetchRequests,\n\tmockProductsData,\n\tmockSiteData,\n} from '@atlaskit/link-test-helpers/datasource';\nimport SmartLinkClient from '../../examples-helpers/smartLinkCustomClient';\nimport { JIRA_LIST_OF_LINKS_DATASOURCE_ID, JiraIssuesConfigModal } from '../../src';\nmockDatasourceFetchRequests({\n\tdelayedResponse: false,\n\tshouldMockORSBatch: true,\n\tavailableSitesOverride: mockSiteData\n\t\t.map((site, index) => ({\n\t\t\t...site,\n\t\t\tcloudId: index === 0 ? 'doc-cloudId' : site.cloudId,\n\t\t}))\n\t\t.filter((site) => !['test1', 'test2', 'test4'].includes(site.displayName)),\n\taccessibleProductsOverride: mockProductsData\n\t\t.filter((product) => ['jira-servicedesk.ondemand'].includes(product.productId))\n\t\t.flatMap((product) => ({\n\t\t\t...product,\n\t\t\tworkspaces: product.workspaces?.map((workspace, index) => ({\n\t\t\t\t...workspace,\n\t\t\t\tcloudId: index === 0 ? 'doc-cloudId' : workspace.cloudId,\n\t\t\t})),\n\t\t})),\n});\nmockBasicFilterAGGFetchRequests({ withJiraFilterHydration: false });\nexport default (): React.JSX.Element => {\n\tconst [showModal, setShowModal] = useState(false);\n\tconst [visibleColumnKeys] = useState<string[] | undefined>(defaultInitialVisibleJiraColumnKeys);\n\tconst [columnCustomSizes] = useState<{ [key: string]: number } | undefined>();\n\tconst [wrappedColumnKeys] = useState<string[] | undefined>();\n\tconst toggleIsOpen = () => setShowModal((prevOpenState) => !prevOpenState);\n\tconst closeModal = () => setShowModal(false);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<SmartCardProvider client={new SmartLinkClient()}>\n\t\t\t\t<Button appearance=\"primary\" onClick={toggleIsOpen}>\n\t\t\t\t\tToggle Modal\n\t\t\t\t</Button>\n\t\t\t\t{showModal && (\n\t\t\t\t\t<JiraIssuesConfigModal\n\t\t\t\t\t\tdatasourceId={JIRA_LIST_OF_LINKS_DATASOURCE_ID}\n\t\t\t\t\t\tvisibleColumnKeys={visibleColumnKeys}\n\t\t\t\t\t\tcolumnCustomSizes={columnCustomSizes}\n\t\t\t\t\t\twrappedColumnKeys={wrappedColumnKeys}\n\t\t\t\t\t\tparameters={{ cloudId: 'doc-cloudId' }}\n\t\t\t\t\t\tonCancel={closeModal}\n\t\t\t\t\t\tonInsert={closeModal}\n\t\t\t\t\t/>\n\t\t\t\t)}\n\t\t\t</SmartCardProvider>\n\t\t</IntlProvider>\n\t);\n};",
			"import { DatasourceTableView } from '@atlaskit/link-datasource';\nimport { ExampleJiraIssuesTableView } from '../examples-helpers/buildJiraIssuesTable';\nimport { FakeModalDialogContainer } from '../examples-helpers/fakeModalDialogContainer';\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<FakeModalDialogContainer>\n\t\t\t<ExampleJiraIssuesTableView DatasourceTable={DatasourceTableView} />\n\t\t</FakeModalDialogContainer>\n\t);\n};",
		],
		props: [
			{
				name: 'columnCustomSizes',
				type: 'ColumnSizesMap',
				description: 'Map of column key to custom column width',
			},
			{
				name: 'datasourceId',
				type: 'string',
				description:
					'Unique identifier for which type of datasource is being rendered and for making its requests',
				isRequired: true,
			},
			{
				name: 'disableDisplayDropdown',
				type: 'boolean',
				description: 'Disable the view mode display dropdown',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description:
					'Callback function to be invoked when the modal is closed either via cancel button click, esc keydown, or modal blanket click',
				isRequired: true,
			},
			{
				name: 'onInsert',
				type: '(adf: InlineCardAdf | DatasourceAdf<Record<string, unknown>>, analyticsEvent?: UIAnalyticsEvent) => void',
				description: 'Callback function to be invoked when the insert issues button is clicked',
				isRequired: true,
			},
			{
				name: 'parameters',
				type: 'DatasourceParameters | JiraIssueDatasourceParameters',
				description:
					'Parameters for making the data requests necessary to render data within the table',
			},
			{
				name: 'shouldReturnFocus',
				type: 'boolean | React.RefObject<HTMLElement>',
				description:
					'Set the focus to return to the element that had focus before focus lock was activated or pass through a specific ref element\nDefaults to false, meaning focus remains where it was when the FocusLock was deactivated',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The url that was used to insert a List of Links',
			},
			{
				name: 'viewMode',
				type: '"table" | "inline"',
				description:
					"The view mode that the modal will show on open:\n- Table = Displays a list of links in table format\n- Inline = Presents a smart link that shows the count of query results. However, if there's only one result, it converts to an inline smart link of that issue.",
			},
			{
				name: 'visibleColumnKeys',
				type: 'string[]',
				description: 'List of properties/column keys that are visible/selected',
			},
			{
				name: 'wrappedColumnKeys',
				type: 'string[]',
				description:
					'List of column keys that needs to be shown without truncation (content will wrap to a new line)',
			},
		],
	},
	{
		name: 'LinkPicker',
		package: '@atlaskit/link-picker',
		description:
			'Standalone link picker UI that lets users search and select links to insert. Supports plugins for different data sources (recents, search, Jira, Confluence, etc.) and can be used in modals, popups, or inline.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the user needs to choose a link to insert (e.g. in an editor, form, or toolbar). Add plugins to define tabs and data sources; use SmartCardProvider above the picker so selected links resolve correctly.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the picker is focusable and has an accessible name (e.g. "Insert link"). Provide a keyboard-accessible way to open and close; ensure search and results are announced to screen readers.',
		],
		keywords: ['link-picker', 'link', 'picker', 'search', 'insert link', 'plugins'],
		category: 'linking',
		examples: [
			"import React, { Fragment, type SyntheticEvent, useMemo, useState } from 'react';\nimport Link from '@atlaskit/link';\nimport { useSmartLinkLifecycleAnalytics } from '@atlaskit/link-analytics';\nimport { token } from '@atlaskit/tokens';\nimport { AtlassianLinkPickerPlugin, Scope } from '@atlassian/link-picker-atlassian-plugin';\nimport { mockEndpoints } from '@atlassian/recent-work-client/mocks';\nimport { PageWrapper } from '../example-helpers/common';\nimport { mockPluginEndpoints } from '../example-helpers/mock-plugin-endpoints';\nimport { MOCK_DATA_V3 as mockRecentData } from '../example-helpers/mock-recents-data';\nimport { LinkPicker, type LinkPickerProps } from '../src';\ntype OnSubmitPayload = Parameters<LinkPickerProps['onSubmit']>[0];\nmockPluginEndpoints();\nmockEndpoints(undefined, undefined, mockRecentData);\nfunction Basic() {\n\tconst [link, setLink] = useState<OnSubmitPayload>({\n\t\turl: '',\n\t\tdisplayText: null,\n\t\ttitle: null,\n\t\tmeta: {\n\t\t\tinputMethod: 'manual',\n\t\t},\n\t});\n\tconst linkAnalytics = useSmartLinkLifecycleAnalytics();\n\tconst handleSubmit: LinkPickerProps['onSubmit'] = (payload, analytic) => {\n\t\tsetLink(payload);\n\t\tlinkAnalytics.linkCreated(payload, analytic);\n\t};\n\tconst handleClick = (e: SyntheticEvent) => {\n\t\te.preventDefault();\n\t};\n\tconst plugins = useMemo(\n\t\t() => [\n\t\t\tnew AtlassianLinkPickerPlugin({\n\t\t\t\tcloudId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',\n\t\t\t\tscope: Scope.ConfluenceContentType,\n\t\t\t\taggregatorUrl: 'https://pug.jira-dev.com/gateway/api/xpsearch-aggregator',\n\t\t\t\tactivityClientEndpoint: 'https://pug.jira-dev.com/gateway/api/graphql',\n\t\t\t}),\n\t\t],\n\t\t[],\n\t);\n\treturn (\n\t\t<Fragment>\n\t\t\t{\n\t\t\t<div style={{ paddingBottom: token('space.250') }}>\n\t\t\t\t<Link id=\"test-link\" href={link.url} target=\"_blank\" onClick={handleClick}>\n\t\t\t\t\t{link.displayText || link.url}\n\t\t\t\t</Link>\n\t\t\t</div>\n\t\t\t<LinkPicker\n\t\t\t\tplugins={plugins}\n\t\t\t\turl={link.url}\n\t\t\t\tdisplayText={link.displayText}\n\t\t\t\tonSubmit={handleSubmit}\n\t\t\t/>\n\t\t</Fragment>\n\t);\n}\nexport default function BasicWrapper(): React.JSX.Element {\n\treturn (\n\t\t<PageWrapper>\n\t\t\t<Basic />\n\t\t</PageWrapper>\n\t);\n}",
			"import React, { Fragment, type SyntheticEvent, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport Link from '@atlaskit/link';\nimport Popup from '@atlaskit/popup';\nimport { token } from '@atlaskit/tokens';\nimport { PageHeader, PageWrapper } from '../example-helpers/common';\nimport { LinkPicker } from '../src';\ntype OnSubmitPayload = Parameters<Required<React.ComponentProps<typeof LinkPicker>>['onSubmit']>[0];\nfunction WithoutPlugins() {\n\tconst [isOpen, setIsOpen] = useState(true);\n\tconst [link, setLink] = useState<OnSubmitPayload>({\n\t\turl: '',\n\t\tdisplayText: null,\n\t\ttitle: null,\n\t\tmeta: {\n\t\t\tinputMethod: 'manual',\n\t\t},\n\t});\n\tconst handleToggle = () => setIsOpen(!isOpen);\n\tconst handleSubmit = (payload: OnSubmitPayload) => {\n\t\tsetLink(payload);\n\t\tsetIsOpen(false);\n\t};\n\tconst handleClick = (e: SyntheticEvent) => {\n\t\te.preventDefault();\n\t\te.stopPropagation();\n\t\tsetIsOpen(true);\n\t};\n\tconst linkPickerInPopup = (\n\t\t<Popup\n\t\t\tisOpen={isOpen}\n\t\t\tautoFocus={false}\n\t\t\tonClose={handleToggle}\n\t\t\tcontent={({ update }) => (\n\t\t\t\t<LinkPicker\n\t\t\t\t\turl={link.url}\n\t\t\t\t\tdisplayText={link.displayText}\n\t\t\t\t\tonSubmit={handleSubmit}\n\t\t\t\t\tonCancel={handleToggle}\n\t\t\t\t\tonContentResize={update}\n\t\t\t\t/>\n\t\t\t)}\n\t\t\tplacement=\"right-start\"\n\t\t\ttrigger={({ ref, ...triggerProps }) => (\n\t\t\t\t<Button\n\t\t\t\t\t{...triggerProps}\n\t\t\t\t\tref={ref}\n\t\t\t\t\tappearance=\"primary\"\n\t\t\t\t\tisSelected={isOpen}\n\t\t\t\t\tonClick={handleToggle}\n\t\t\t\t>\n\t\t\t\t\t{isOpen ? '-' : '+'}\n\t\t\t\t</Button>\n\t\t\t)}\n\t\t/>\n\t);\n\treturn (\n\t\t<Fragment>\n\t\t\t<PageHeader>\n\t\t\t\t<p>\n\t\t\t\t\t<b>LinkPicker</b> without search, used as an interface to submit a valid link with custom\n\t\t\t\t\tdisplay text.\n\t\t\t\t</p>\n\t\t\t</PageHeader>\n\t\t\t{\n\t\t\t<div style={{ paddingBottom: token('space.250') }}>\n\t\t\t\t<Link id=\"test-link\" href={link.url} target=\"_blank\" onClick={handleClick}>\n\t\t\t\t\t{link.displayText || link.url}\n\t\t\t\t</Link>\n\t\t\t</div>\n\t\t\t{linkPickerInPopup}\n\t\t</Fragment>\n\t);\n}\nexport default function WithoutPluginsWrapper(): React.JSX.Element {\n\treturn (\n\t\t<PageWrapper>\n\t\t\t<WithoutPlugins />\n\t\t</PageWrapper>\n\t);\n}",
		],
		props: [
			{
				name: 'adaptiveHeight',
				type: 'boolean',
				description:
					'Allows height of search results to adapt to the number of results being displayed.',
			},
			{
				name: 'additionalError',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'This prop passes one additional error that is secondary to component errors',
			},
			{
				name: 'alwaysShowTabs',
				type: 'boolean',
				description: 'When true, tabs are displayed even if there is only one plugin.',
			},
			{
				name: 'component',
				type: 'ComponentClass<Partial<LinkPickerProps> & { children: ReactElement<any, string | JSXElementConstructor<any>>; }, any> | FunctionComponent<...>',
				description: 'Customise the link picker root component',
			},
			{
				name: 'customMessages',
				type: '{ linkLabel?: MessageDescriptor; linkAriaLabel?: MessageDescriptor; linkPlaceholder?: MessageDescriptor; linkTextLabel?: MessageDescriptor; linkTextPlaceholder?: MessageDescriptor; linkHelperTextLabel?: MessageDescriptor; submitButtonLabel?: MessageDescriptor; }',
				description: 'Allows for customisation of text in the link picker.',
			},
			{
				name: 'disableWidth',
				type: 'boolean',
				description: 'Disables the default width containing the link picker.',
			},
			{
				name: 'displayHelperText',
				type: 'string',
				description:
					'The desired text to be displayed below the display text input field. Only displayed when `platform-linking-visual-refresh-link-picker` gate is enabled.',
			},
			{
				name: 'displayText',
				type: 'string',
				description:
					'The desired text to be displayed alternatively to the title of the linked resource for editing.',
			},
			{
				name: 'featureFlags',
				type: '{ [x: string]: unknown; }',
			},
			{
				name: 'hideDisplayText',
				type: 'boolean',
				description: 'Hides the link picker display text field if set to true.',
			},
			{
				name: 'inputRef',
				type: '((instance: HTMLInputElement) => void) | RefObject<HTMLInputElement>',
				description: 'Ref to the link picker search input.',
			},
			{
				name: 'isLoadingPlugins',
				type: 'boolean',
				description:
					'If set true, Link picker will show the loading spinner where the tabs and results will show.',
			},
			{
				name: 'isSubmitting',
				type: 'boolean',
				description: 'Controls showing a "submission in-progres" UX',
			},
			{
				name: 'moveSubmitButton',
				type: 'boolean',
				description:
					'This prop controls where the submit button appears. When true the submit button will move below the input field and be full width',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description:
					'Callback to fire when the cancel button is clicked.\nIf not provided, cancel button is not displayed.',
			},
			{
				name: 'onContentResize',
				type: '() => void',
				description:
					'Callback to fire when content is changed inside the link picker e.g. items, when loading, tabs',
			},
			{
				name: 'onSubmit',
				type: '(arg: OnSubmitParameter, analytic?: UIAnalyticsEvent) => void',
				description: 'Callback to fire on form submission.',
				isRequired: true,
			},
			{
				name: 'paddingBottom',
				type: 'string',
				description: 'Override the default bottom padding.',
			},
			{
				name: 'paddingLeft',
				type: 'string',
				description: 'Override the default left padding.',
			},
			{
				name: 'paddingRight',
				type: 'string',
				description: 'Override the default right padding.',
			},
			{
				name: 'paddingTop',
				type: 'string',
				description: 'Override the default top padding.',
			},
			{
				name: 'plugins',
				type: 'LinkPickerPlugin[]',
				description: 'Plugins that provide link suggestions / search capabilities.',
			},
			{
				name: 'previewableLinksOnly',
				type: 'boolean',
				description: 'Disables URLs that do not have an embeddable preview',
			},
			{
				name: 'recentSearchListSize',
				type: 'number',
				description: 'Showing dynamic list size based on window height',
			},
			{
				name: 'shouldRenderNoResultsImage',
				type: 'boolean',
				description: 'Controls showing the image in the no results state',
			},
			{
				name: 'submitOnInputChange',
				type: 'boolean',
				description: 'This prop disables submit button and handles submit on input change',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The url of the linked resource for editing.',
			},
		],
	},
	{
		name: 'Renderer',
		package: '@atlaskit/renderer',
		description: 'Renderer component',
		status: 'general-availability',
		usageGuidelines: [
			'Use ReactRenderer with an ADF document; use a transformer (e.g. BitbucketTransformer) with ADFEncoder when your storage format is not ADF.',
			'Avoid unnecessary props changes: extract static objects to constants, avoid passing new objects or anonymous functions on every render, use useMemo/useCallback for props and callbacks to prevent performance degradation.',
			'Ensure only one version of Renderer sub-dependencies (adf-schema, editor-common, prosemirror-model, etc.) in your bundles; use deduplication or resolutions. Use correct peer dependency versions.',
			'Use the truncated prop with maxHeight/fadeOutHeight when you need to cap rendered content with a fade; add polyfills for fetch and ES6/ES7 when targeting older browsers.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'renderer', 'atlaskit'],
		category: 'editor',
		examples: [
			"import type { ChangeEvent } from 'react';\nimport RendererDemo from './helper/RendererDemo';\nimport { SmartCardProvider, CardClient } from '@atlaskit/link-provider';\nimport { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';\nimport type { ADFStage } from '@atlaskit/editor-common/validator';\nconst ADF_STAGE0 = 'stage0';\nconst ADF_FINAL = 'final';\nexport default function Example(): React.JSX.Element {\n\tconst [adfStage, setAdfStage] = React.useState<ADFStage>(ADF_FINAL);\n\tconst schema = getSchemaBasedOnStage(adfStage);\n\tconst onSchemaToggle = (event: ChangeEvent<HTMLInputElement>) => {\n\t\tsetAdfStage(event.currentTarget.checked ? ADF_STAGE0 : ADF_FINAL);\n\t};\n\tconst toggleCheckbox = (\n\t\t<label>\n\t\t\t{\n\t\t\t<input type=\"checkbox\" checked={adfStage === ADF_STAGE0} onChange={onSchemaToggle} />\n\t\t\tUse stage0 (experimental) document schema\n\t\t</label>\n\t);\n\treturn (\n\t\t<SmartCardProvider client={new CardClient('staging')}>\n\t\t\t<RendererDemo\n\t\t\t\tallowColumnSorting\n\t\t\t\tallowSelectAllTrap\n\t\t\t\tallowWrapCodeBlock\n\t\t\t\tallowCopyToClipboard\n\t\t\t\tserializer=\"react\"\n\t\t\t\tadfStage={adfStage}\n\t\t\t\tschema={schema}\n\t\t\t\tactionButtons={toggleCheckbox}\n\t\t\t\twithProviders\n\t\t\t/>\n\t\t</SmartCardProvider>\n\t);\n}",
			'import RendererDemo from \'./helper/RendererDemo\';\nimport {\n\tNORMAL_SEVERITY_THRESHOLD,\n\tDEGRADED_SEVERITY_THRESHOLD,\n} from \'../../renderer/src/ui/Renderer\';\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<RendererDemo\n\t\t\tappearance="full-page"\n\t\t\tserializer="react"\n\t\t\tallowHeadingAnchorLinks\n\t\t\tallowColumnSorting={true}\n\t\t\tallowCopyToClipboard\n\t\t\tallowWrapCodeBlock\n\t\t\tUNSTABLE_allowTableAlignment\n\t\t\tUNSTABLE_allowTableResizing\n\t\t\tanalyticsEventSeverityTracking={{\n\t\t\t\tenabled: true,\n\t\t\t\tseverityNormalThreshold: NORMAL_SEVERITY_THRESHOLD,\n\t\t\t\tseverityDegradedThreshold: DEGRADED_SEVERITY_THRESHOLD,\n\t\t\t}}\n\t\t/>\n\t);\n}',
			'import RendererDemo from \'./helper/RendererDemo\';\nexport default function Example(): React.JSX.Element {\n\treturn <RendererDemo withProviders={true} serializer="react" />;\n}',
		],
		props: [
			{
				name: 'addTelepointer',
				type: 'boolean',
				description:
					'When enabled a trailing telepointer will be added to the rendered document\nfollowing content updates.\n\nContent is updated by passing a new value prop to the renderer.\n\nThe trailing pointer is updated by dom injection to the last text node which\nis updated as a result of a content update.',
			},
			{
				name: 'adfStage',
				type: '"final" | "stage0"',
			},
			{
				name: 'allowAltTextOnImages',
				type: 'boolean',
			},
			{
				name: 'allowAnnotations',
				type: 'boolean',
			},
			{
				name: 'allowColumnSorting',
				type: 'boolean',
			},
			{
				name: 'allowCopyToClipboard',
				type: 'boolean',
			},
			{
				name: 'allowCustomPanels',
				type: 'boolean',
			},
			{
				name: 'allowFixedColumnWidthOption',
				type: 'boolean',
			},
			{
				name: 'allowHeadingAnchorLinks',
				type: 'boolean | HeadingAnchorLinksConfig',
			},
			{
				name: 'allowPlaceholderText',
				type: 'boolean',
			},
			{
				name: 'allowRendererContainerStyles',
				type: 'boolean',
			},
			{
				name: 'allowSelectAllTrap',
				type: 'boolean',
			},
			{
				name: 'allowUgcScrubber',
				type: 'boolean',
			},
			{
				name: 'allowWrapCodeBlock',
				type: 'boolean',
			},
			{
				name: 'analyticsEventSeverityTracking',
				type: '{ enabled: boolean; severityDegradedThreshold: number; severityNormalThreshold: number; }',
			},
			{
				name: 'annotationProvider',
				type: '{ annotationManager?: AnnotationManager; inlineComment: InlineCommentAnnotationProvider; }',
			},
			{
				name: 'appearance',
				type: '"comment" | "full-page" | "full-width" | "max"',
			},
			{
				name: 'createSerializer',
				type: '(init: ReactSerializerInit) => Serializer<JSX.Element>',
				description:
					'Creates a new `Serializer` to transform the ADF `document` into `JSX.Element`.\nAllows Confluence to implement {@link https://hello.atlassian.net/wiki/spaces/~lmarinov/pages/5177285037/COMPLEXIT+Progressive+rendering+of+ADF progressive rendering}.',
			},
			{
				name: 'dataProviders',
				type: 'ProviderFactory',
			},
			{
				name: 'disableActions',
				type: 'boolean',
			},
			{
				name: 'disableHeadingIDs',
				type: 'boolean',
			},
			{
				name: 'disableTableOverflowShadow',
				type: 'boolean',
				description:
					'When true, disables the overflow shadow (visual indication) on the edges\nof tables.',
			},
			{
				name: 'document',
				type: 'DocNode',
				isRequired: true,
			},
			{
				name: 'emojiResourceConfig',
				type: 'EmojiResourceConfig',
			},
			{
				name: 'enableSsrInlineScripts',
				type: 'boolean',
			},
			{
				name: 'eventHandlers',
				type: 'EventHandlers',
			},
			{
				name: 'extensionHandlers',
				type: 'ExtensionHandlers<any>',
			},
			{
				name: 'extensionViewportSizes',
				type: 'ExtensionViewportSize[]',
			},
			{
				name: 'fadeOutHeight',
				type: 'number',
			},
			{
				name: 'featureFlags',
				type: '{ [featureFlag: string]: boolean; } | Partial<RawObjectFeatureFlags>',
				description:
					"@description\nShort lived feature flags for experiments and gradual rollouts\nFlags are expected to follow these rules or they are filtered out\n\n1. cased in kebab-case (match [a-z-])\n2. have boolean values or object {} values\n\n@example\n```tsx\n(<Renderer featureFlags={{ 'my-feature': true }} />);\ngetFeatureFlags()?.myFeature === true;\n```\n\n@example\n```tsx\n(<Renderer featureFlags={{ 'my-feature': 'thing' }} />);\ngetFeatureFlags()?.myFeature === undefined;\n```\n\n@example\n```tsx\n(<Renderer featureFlags={{ 'product.my-feature': false }} />);\ngetFeatureFlags()?.myFeature === undefined;\ngetFeatureFlags()?.productMyFeature === undefined;\n```",
				defaultValue: 'undefined',
			},
			{
				name: 'getExtensionHeight',
				type: '(node: PMNode) => string',
			},
			{
				name: 'includeNodesCountInStats',
				type: 'boolean',
			},
			{
				name: 'innerRef',
				type: 'React.RefObject<HTMLDivElement>',
			},
			{
				name: 'isInsideOfInlineExtension',
				type: 'boolean',
			},
			{
				name: 'isTopLevelRenderer',
				type: 'boolean',
			},
			{
				name: 'maxHeight',
				type: 'number',
			},
			{
				name: 'media',
				type: 'MediaOptions',
			},
			{
				name: 'nodeComponents',
				type: '{ [key: string]: React.ComponentType<any>; }',
			},
			{
				name: 'noOpSSRInlineScript',
				type: 'boolean',
			},
			{
				name: 'onComplete',
				type: '(stat: RenderOutputStat) => void',
			},
			{
				name: 'onError',
				type: '(error: any) => void',
			},
			{
				name: 'onSetLinkTarget',
				type: '(url: string) => "_blank"',
				description:
					"Optional callback to programatically determine the link target for rendered links. Controls whether a link should render as external or not.\nReturn _blank if the url should render as an external link.\nReturn undefined to use the links default behavior and target.\n\n@param url - The URL of the link being rendered\n@returns '_blank' to render as an external link or undefined to not change the link",
			},
			{
				name: 'portal',
				type: 'HTMLElement',
			},
			{
				name: 'rendererContext',
				type: 'RendererContext',
			},
			{
				name: 'schema',
				type: 'Schema<any, any>',
			},
			{
				name: 'scrollToBlock',
				type: '(element: HTMLElement) => void',
				description:
					'Optional callback to scroll an element into view when using block links (#block-xxx).\nWhen provided, this is used instead of the default scrollIntoView for accurate positioning\nin product-specific scroll containers (e.g. Confluence view page).',
			},
			{
				name: 'shouldDisplayExtensionAsInline',
				type: '(extensionParams: ExtensionParams<Parameters>) => boolean',
				description:
					'Determines if the extension should be displayed as inline based on the extension parameters.\n@param extensionParams - The extension parameters.\n@returns True if the extension should be displayed as inline, false otherwise.',
			},
			{
				name: 'shouldOpenMediaViewer',
				type: 'boolean',
			},
			{
				name: 'shouldRemoveEmptySpaceAroundContent',
				type: 'boolean',
			},
			{
				name: 'smartLinks',
				type: 'SmartLinksOptions',
			},
			{
				name: 'stickyHeaders',
				type: 'boolean | ({ show?: boolean; } & { offsetTop?: number; } & StickyHeaderConfig_DO_NOT_USE)',
			},
			{
				name: 'textHighlighter',
				type: '{ component: React.ComponentType<{ children: React.ReactNode; groups: string[]; marks: Set<string>; match: string; startPos: number; }>; pattern: RegExp; }',
			},
			{
				name: 'timeZone',
				type: 'string',
			},
			{
				name: 'truncated',
				type: 'boolean',
			},
			{
				name: 'UNSTABLE_allowTableAlignment',
				type: 'boolean',
			},
			{
				name: 'UNSTABLE_allowTableResizing',
				type: 'boolean',
			},
			{
				name: 'UNSTABLE_isPresentational',
				type: 'boolean',
				description:
					'When true, elements may render without their default semantic roles\n(e.g., using role="presentation"), indicating that they are used solely for layout or styling purposes.\nElements currently affected: Tables.',
			},
			{
				name: 'unsupportedContentLevelsTracking',
				type: '{ enabled: boolean; samplingRates?: { [key: string]: number; }; thresholds?: Partial<UnsupportedContentLevelThresholds>; }',
			},
		],
	},
	{
		name: 'Card',
		package: '@atlaskit/smart-card',
		description:
			'Smart Links enhance URLs into interactive previews, offering a contextualized experience within Atlassian products. They come in inline, block, and embed formats, respecting content permissions and compliance settings.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inline for links in body text; block when you need extra context or a card-style preview; embed when users should engage with the linked content in place.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Use descriptive link text for inline appearance; avoid generic "click here" or the raw URL when possible.',
			'Ensure the card container is keyboard focusable and has a clear accessible name indicating it is a link or preview.',
			'Ensure loading and error states are announced to screen readers (e.g. aria-live or status text).',
		],
		keywords: ['smart-card', 'card', 'smart link', 'inline', 'block', 'embed', 'link', 'preview'],
		category: 'linking',
		examples: [
			'import { cssMap } from \'@atlaskit/css\';\nimport Link from \'@atlaskit/link\';\nimport { SmartCardProvider } from \'@atlaskit/link-provider\';\nimport { ResolvedClient, ResolvedClientEmbedUrl } from \'@atlaskit/link-test-helpers\';\nimport { Box, Grid, Stack } from \'@atlaskit/primitives/compiled\';\nimport SectionMessage from \'@atlaskit/section-message\';\nimport { Card } from \'../../src\';\nconst gridStyles = cssMap({\n\troot: {\n\t\tgridTemplateColumns: \'1fr 1fr\',\n\t},\n});\nexport default (): React.JSX.Element => (\n\t<SmartCardProvider client={new ResolvedClient(\'stg\')}>\n\t\t<Box paddingBlockStart="space.300">\n\t\t\t<Grid alignItems="center" columnGap="space.100" xcss={gridStyles.root}>\n\t\t\t\t<Stack space="space.600">\n\t\t\t\t\t<SectionMessage>\n\t\t\t\t\t\tYou must be logged in to{\' \'}\n\t\t\t\t\t\t<Link\n\t\t\t\t\t\t\thref="https://pug.jira-dev.com"\n\t\t\t\t\t\t\ttarget="_blank"\n\t\t\t\t\t\t\ttitle="Login to staging environment"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tstaging environment\n\t\t\t\t\t\t</Link>{\' \'}\n\t\t\t\t\t\tto load the examples.\n\t\t\t\t\t</SectionMessage>\n\t\t\t\t\t<Card appearance="inline" showHoverPreview={true} url={ResolvedClientEmbedUrl} />\n\t\t\t\t\t<Card appearance="block" url={ResolvedClientEmbedUrl} />\n\t\t\t\t</Stack>\n\t\t\t\t<Card appearance="embed" frameStyle="show" platform="web" url={ResolvedClientEmbedUrl} />\n\t\t\t</Grid>\n\t\t</Box>\n\t</SmartCardProvider>\n);',
			"import { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Card } from '../../src';\nexport default (): React.JSX.Element => (\n\t<SmartCardProvider client={new ResolvedClient('stg')}>\n\t\t<Card appearance=\"block\" url={ResolvedClientUrl} />\n\t</SmartCardProvider>\n);",
			"import { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Card } from '../../src';\nexport default (): React.JSX.Element => (\n\t<SmartCardProvider client={new ResolvedClient('stg')}>\n\t\t<Card appearance=\"inline\" url={ResolvedClientUrl} />\n\t</SmartCardProvider>\n);",
		],
		props: [
			{
				name: 'actionOptions',
				type: 'CardActionVisibilityOptions & { previewAction?: { hideBlanket?: boolean; size?: EmbedModalSize; }; rovoChatAction?: { optIn: boolean; }; }',
				description:
					'Configure visibility of actions available.\nBy default, smart links show all actions available on the views.\nSet `hide` to true to disable all actions.\nSet `hide` to false and set `exclude` to enable only specific actions.',
			},
			{
				name: 'appearance',
				type: '"inline" | "block" | "embed"',
				description: 'Define smart card default appearance.',
				isRequired: true,
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'CompetitorPrompt',
				type: 'ComponentClass<{ linkType?: string; sourceUrl: string; }, any> | FunctionComponent<{ linkType?: string; sourceUrl: string; }>',
				description: 'Competitor Prompt Component for Competitor link experiment',
			},
			{
				name: 'container',
				type: 'HTMLElement',
				description:
					'The container which `react-lazily-render` listens to for scroll events.\nThis property can be used in a scenario where you want to specify your own scroll container\nwhile the Card component is (lazy)loading.',
			},
			{
				name: 'disablePreviewPanel',
				type: 'boolean',
				description:
					'When Preview panel is supported, onClick is ignored and the panel opens by default.\nThis prop allows smartlinks inside of editor to bypass that as they have other ways to open Preview panel.',
			},
			{
				name: 'embedIframeRef',
				type: '((instance: HTMLIFrameElement) => void) | RefObject<HTMLIFrameElement>',
				description: 'React referenced value on embed iframe.',
			},
			{
				name: 'embedIframeUrlType',
				type: '"href" | "interactiveHref"',
				description:
					'Type of URL used with embed iframe. By default, the embed use `data.preview.href` from link response.\n`interactiveHref` is suitable for displaying iframe content that contains "more editable" version of\nthe link, e.g. includes toolbar.\nIt is only available on supported link response with `data.preview.interactiveHref`.',
			},
			{
				name: 'fallbackComponent',
				type: 'ComponentClass<{}, any> | FunctionComponent<{}>',
				description:
					'A React component responsible for returning a fallback UI when smart link fails to render because of uncaught errors.',
			},
			{
				name: 'forwardedRef',
				type: '((instance: any) => void) | RefObject<any>',
			},
			{
				name: 'frameStyle',
				type: '"show" | "hide" | "showOnHover"',
				description:
					'A prop that determines the style of a frame:\nwhether to show it, hide it or only show it when a user hovers over embed.',
			},
			{
				name: 'hoverPreviewOptions',
				type: 'HoverPreviewOptions',
				description: 'Configuration for hover card.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique id for smart link used in analytics.',
			},
			{
				name: 'inheritDimensions',
				type: 'boolean',
				description:
					"Determines whether width and height of an embed card are to be inherited from the parent.\nIf `true`, embed iframe will remove restrictions on iframe aspect ratio, height and width.\nThe parent container needs to override a style `.loader-wrapper` and set the desirable height there.\n(For instance, 'height: 100%')",
			},
			{
				name: 'inlinePreloaderStyle',
				type: '"on-left-with-skeleton" | "on-right-without-skeleton"',
				description:
					'By default, inline resolving states show a frame with a spinner on the left.\nAn alternative is to remove the frame and place the spinner on the right by setting this value to `on-right-without-skeleton`.\nThis property is specific to inline links in the editor.',
			},
			{
				name: 'isHovered',
				type: 'boolean',
				description:
					'A flag that determines whether a card is in a hover state. Currently used for inline links in editor only.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Show selected state of smart link.',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>, data?: OnClickData) => void',
				description:
					'A callback function triggered when a Smart Link is clicked.\n\nWhen defined, the default browser navigation is prevented and your handler\nis responsible for navigation — except for Flexible Card, which always opens\nthe link and then calls the callback.\n\nThe optional second argument `data` provides additional context about the click:\n- `data.destinationUrl` — the resolved URL Smart Link will navigate to.\n  This may differ from the original `url` prop if Smart Link resolved a\n  preferred URL from metadata or appended analytics parameters.\n- `data.url` — the original `url` prop passed to the component.\n\n@example\n// Basic usage\nonClick={(e) => { e.preventDefault(); window.location.href = myUrl; }}\n\n// With destination URL\nonClick={(e, data) => { navigate(data?.destinationUrl ?? url); }}',
			},
			{
				name: 'onError',
				type: '(data: { err?: Error; status: "errored" | "fallback" | "unauthorized" | "forbidden" | "not_found"; url: string; }) => void',
				description:
					'A callback function currently invoked in two cases:\n1. When the `CardState.status` is one of `ErrorCardType`. "err" property in argument will be undefined in this case\n   This does not mean that smart card failed to render.\n2. When there is any unhandled error inside smart card while rendering, resulting in failure to render smart card successfully.\n   "err" property in argument will be provided in this case.\n   Presence of an err property indicates that the client should either render their own fallback\n   or provide a fallbackComponent prop which will be rendered instead smart card component.\n   If fallbackComponent is not provided, smart card will render null',
			},
			{
				name: 'onResolve',
				type: '(data: { aspectRatio?: number; extensionKey?: string; title?: string; url?: string; }) => void',
				description: 'A callback function after the url is resolved into smart card.',
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'String to be displayed while the Card component is (lazy)loading.',
			},
			{
				name: 'removeTextHighlightingFromTitle',
				type: 'boolean',
				description:
					'When set to true, the text fragment will be removed from the title.\nThis will have no impact on the url and text highlighting will still persist in the url,\nhowever the text fragment will be stripped from the title of the smart card.\nFor example, when set to true: "my name | :~:text=highlight this" will be displayed as "my name"',
			},
			{
				name: 'resolvingPlaceholder',
				type: 'string',
				description:
					'When defined, this placeholder will be displayed while the smart card is resolving. This is only useful for inline cards.',
			},
			{
				name: 'showHoverPreview',
				type: 'boolean',
				description: 'Flag to display hover preview on hover.',
			},
			{
				name: 'truncateInline',
				type: 'boolean',
				description: 'When set to true, inline cards will be truncated to one line',
			},
			{
				name: 'ui',
				type: '{ clickableContainer?: boolean; enableSnippetRenderer?: boolean; hideBackground?: boolean; hideElevation?: boolean; hidePadding?: boolean; removeBlockRestriction?: boolean; size?: SmartLinkSize; theme?: SmartLinkTheme; zIndex?: number; }',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The url link of the resource to be resolved and shown as Smart Link.',
			},
		],
	},
	{
		name: 'FooterBlock',
		package: '@atlaskit/smart-card',
		description:
			'A block component for the Smart Link footer, typically showing actions (e.g. copy, open, follow).',
		status: 'general-availability',
		usageGuidelines: [
			'Use at the bottom of a FlexibleCard when you need actions such as copy link, open, or follow.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Give each action button or control an accessible name (e.g. "Copy link", "Open in new tab") so purpose is clear to screen readers.',
			'Ensure actions are keyboard operable and appear in a logical tab order.',
		],
		keywords: ['smart-card', 'footer block', 'flexible', 'block', 'actions'],
		category: 'linking',
		examples: [
			"import { FooterBlock } from '../../src';\nimport ExampleContainer from './example-container';\nexport default (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<FooterBlock />\n\t</ExampleContainer>\n);",
		],
		props: [
			{
				name: 'actions',
				type: 'ActionItem[]',
				description:
					'An array of actions to be displayed on the right.\nAdding more than three actions will result in the second and following\nactions being hidden inside of a dropdown\n@see ActionItem',
			},
			{
				name: 'alwaysShow',
				type: 'boolean',
				description: 'Allows rendering of the footer regardless of whether the block has resolved',
			},
			{
				name: 'blockRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description: 'Ref to block wrapper div.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'React children',
			},
			{
				name: 'hideIconLoadingSkeleton',
				type: 'boolean',
				description:
					'For image icons in the title, whether to hide the loading skeleton while the image is loading.',
			},
			{
				name: 'hideProvider',
				type: 'boolean',
				description: 'Allows hiding of the resources provider',
			},
			{
				name: 'isPreviewBlockErrored',
				type: 'boolean',
				description: 'Used with RovoActions to determine if the preview block is visible or not',
			},
			{
				name: 'onActionMenuOpenChange',
				type: '(options: OnActionMenuOpenChangeOptions) => void',
				description: 'Function to be called when footer action dropdown open state is changed.',
			},
			{
				name: 'placeholderId',
				type: 'string',
				description:
					'A unique identifier for the placeholder loading state, which is constant across all loading states of the same item.',
			},
			{
				name: 'size',
				type: 'SmartLinkSize',
				description:
					'The size of the block and the size that the underlying elements should\ndefault to.',
			},
		],
	},
	{
		name: 'MetadataBlock',
		package: '@atlaskit/smart-card',
		description:
			'A block component that displays a row of metadata elements (e.g. created by, due date, state) in a Smart Link.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need a single row of metadata (e.g. created by, due date, state) in a block Smart Link.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure metadata is available to screen readers (e.g. not conveyed only by color or icon).',
			'Use a list or group with an accessible name if the metadata row has a specific purpose (e.g. "Contributors", "Dates").',
		],
		keywords: ['smart-card', 'metadata block', 'flexible', 'block', 'metadata'],
		category: 'linking',
		examples: [
			"import { ElementName, MetadataBlock } from '../../src';\nimport ExampleContainer from './example-container';\nexport default (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<MetadataBlock\n\t\t\tprimary={[{ name: ElementName.CollaboratorGroup }, { name: ElementName.ModifiedOn }]}\n\t\t/>\n\t</ExampleContainer>\n);",
		],
		props: [
			{
				name: 'blockRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description: 'Ref to block wrapper div.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'React children',
			},
			{
				name: 'hideIconLoadingSkeleton',
				type: 'boolean',
				description:
					'For image icons in the title, whether to hide the loading skeleton while the image is loading.',
			},
			{
				name: 'maxLines',
				type: 'number',
				description:
					'Determines the number of lines the metadata should span across.\nDefault is 2. Maximum is 2.',
				defaultValue: '2',
			},
			{
				name: 'placeholderId',
				type: 'string',
				description:
					'A unique identifier for the placeholder loading state, which is constant across all loading states of the same item.',
			},
			{
				name: 'primary',
				type: 'ElementItem[]',
				description:
					'An array of metadata elements to display on the left.\nBy default elements will be shown to the right of the TitleBlock.\nThe visibility of the element is determine by the link data.\nIf link contain no data to display a particular element, the element\nwill simply not show up.\n@see ElementItem',
				defaultValue: '[]',
			},
			{
				name: 'secondary',
				type: 'ElementItem[]',
				description:
					'An array of metadata elements to display on the right.\nBy default elements will be shown to the right of the TitleBlock.\nThe visibility of the element is determine by the link data.\nIf link contain no data to display a particular element, the element\nwill simply not show up.\n@see ElementItem',
				defaultValue: '[]',
			},
			{
				name: 'size',
				type: 'SmartLinkSize',
				description:
					'The size of the block and the size that the underlying elements should\ndefault to.',
			},
		],
	},
	{
		name: 'PreviewBlock',
		package: '@atlaskit/smart-card',
		description: 'A block component that displays a preview image or media for the Smart Link.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the linked resource has a preview image or media and you want to surface it in the block card.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'If the preview image conveys information, provide meaningful alt text; if purely decorative, use alt="" or aria-hidden.',
			'Ensure no critical information is shown only in the preview; duplicate in text or metadata when needed.',
		],
		keywords: ['smart-card', 'preview block', 'flexible', 'block', 'preview', 'image'],
		category: 'linking',
		examples: [
			"import { PreviewBlock } from '../../src';\nimport ExampleContainer from './example-container';\nexport default (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<PreviewBlock />\n\t</ExampleContainer>\n);",
		],
		props: [
			{
				name: 'blockRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description: 'Ref to block wrapper div.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'React children',
			},
			{
				name: 'hideIconLoadingSkeleton',
				type: 'boolean',
				description:
					'For image icons in the title, whether to hide the loading skeleton while the image is loading.',
			},
			{
				name: 'ignoreContainerPadding',
				type: 'boolean',
				description:
					'Indicate whether preview block should ignore the padding its parent container.\nDefault is false.',
			},
			{
				name: 'overrideUrl',
				type: 'string',
				description:
					'An image URL to render. This will replace the default image from smart link data.',
			},
			{
				name: 'placeholderId',
				type: 'string',
				description:
					'A unique identifier for the placeholder loading state, which is constant across all loading states of the same item.',
			},
			{
				name: 'placement',
				type: 'MediaPlacement',
				description:
					'The placement of the preview block in relation of its container.\nThis makes the preview block leave flex layout to absolute positioning\nto the left/right of the container.',
			},
			{
				name: 'size',
				type: 'SmartLinkSize',
				description:
					'The size of the block and the size that the underlying elements should\ndefault to.',
			},
		],
	},
	{
		name: 'FlexibleCard',
		package: '@atlaskit/smart-card',
		description:
			'Flexible Smart Links (FlexibleCard / Flexible UI) is a composable system of data elements inside UI blocks for building custom Smart Link views. It does not affect inline, block, or embed appearance.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need a custom block-style Smart Link layout. Define the layout with blocks first (title, metadata, preview, footer), then add elements inside blocks for granular content.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Use a logical structure (e.g. heading hierarchy) so the card is navigable by assistive tech.',
			'Ensure all interactive elements inside blocks (links, buttons, actions) are focusable and have accessible names.',
		],
		keywords: [
			'smart-card',
			'flexible',
			'flexible card',
			'flexible ui',
			'blocks',
			'elements',
			'composable',
		],
		category: 'linking',
		examples: [
			"import LikeIcon from '@atlaskit/icon/core/thumbs-up';\nimport { type JsonLd } from '@atlaskit/json-ld-types';\nimport { CardClient as Client, SmartCardProvider as Provider } from '@atlaskit/link-provider';\nimport { response1 } from '@atlaskit/link-test-helpers';\nimport {\n\tActionName,\n\tCard,\n\tElementName,\n\tFooterBlock,\n\tMetadataBlock,\n\tPreviewBlock,\n\tSmartLinkPosition,\n\tSmartLinkSize,\n\tSnippetBlock,\n\tTitleBlock,\n} from '../../src';\nclass CustomClient extends Client {\n\tfetchData() {\n\t\treturn Promise.resolve(response1 as JsonLd.Response);\n\t}\n}\nexport default (): React.JSX.Element => (\n\t<Provider client={new CustomClient('stg')}>\n\t\t<Card appearance=\"block\" url={response1.data.url}>\n\t\t\t<TitleBlock\n\t\t\t\tsize={SmartLinkSize.Medium}\n\t\t\t\tmetadata={[{ name: ElementName.State }, { name: ElementName.AuthorGroup }]}\n\t\t\t\tposition={SmartLinkPosition.Center}\n\t\t\t/>\n\t\t\t<PreviewBlock />\n\t\t\t<MetadataBlock\n\t\t\t\tprimary={[\n\t\t\t\t\t{ name: ElementName.CreatedOn },\n\t\t\t\t\t{ name: ElementName.ModifiedOn },\n\t\t\t\t\t{ name: ElementName.CommentCount },\n\t\t\t\t\t{ name: ElementName.ReactCount },\n\t\t\t\t]}\n\t\t\t/>\n\t\t\t<SnippetBlock />\n\t\t\t<FooterBlock\n\t\t\t\tactions={[\n\t\t\t\t\t{\n\t\t\t\t\t\tname: ActionName.CustomAction,\n\t\t\t\t\t\ticon: <LikeIcon color=\"currentColor\" label=\"Like\" />,\n\t\t\t\t\t\tcontent: 'Like',\n\t\t\t\t\t\tonClick: () => console.log('Like clicked!'),\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\tname: ActionName.EditAction,\n\t\t\t\t\t\tonClick: () => console.log('Edit clicked!'),\n\t\t\t\t\t},\n\t\t\t\t\t{\n\t\t\t\t\t\tname: ActionName.DeleteAction,\n\t\t\t\t\t\tonClick: () => console.log('Delete clicked!'),\n\t\t\t\t\t},\n\t\t\t\t]}\n\t\t\t/>\n\t\t</Card>\n\t</Provider>\n);",
		],
		props: [
			{
				name: 'actions',
				type: 'ActionItem[]',
				description:
					'An array of action items to be displayed after the title\non the right of the block.\nAn action item provides preset icon and label, with exception of\na custom action which either Icon or label must be provided.\n@see ActionItem',
				defaultValue: '[]',
			},
			{
				name: 'anchorRef',
				type: '((instance: HTMLAnchorElement) => void) | React.RefObject<HTMLAnchorElement>',
				description: 'Ref passed into the link <a> element',
			},
			{
				name: 'anchorTarget',
				type: '"_blank" | "_self" | "_top" | "_parent"',
				description: 'Determines the href target behaviour of the Link.',
			},
			{
				name: 'blockRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description: 'Ref to block wrapper div.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'React children',
			},
			{
				name: 'CompetitorPrompt',
				type: 'React.ComponentClass<{ linkType?: string; sourceUrl: string; }, any> | React.FunctionComponent<{ linkType?: string; sourceUrl: string; }>',
				description: 'Competitor Prompt Component for Competitor link',
			},
			{
				name: 'hideIcon',
				type: 'boolean',
				description: 'Determines whether TitleBlock will hide the Link Icon.',
				defaultValue: 'false',
			},
			{
				name: 'hideIconLoadingSkeleton',
				type: 'boolean',
				description:
					'For image icons in the title, whether to hide the loading skeleton while the image is loading.',
			},
			{
				name: 'hideRetry',
				type: 'boolean',
				description:
					'This option determines whenever we show any of the links and messages on the right side of the block,\nlike "connect to preview" or "Can\'t find link" or "Restricted link, try another account" etc.\nDefault is false.',
			},
			{
				name: 'hideTitleTooltip',
				type: 'boolean',
				description:
					'[Experiment] Determines whether the linked title should display tooltip on hover.',
			},
			{
				name: 'icon',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'The icon to display in the title block. Overrides any icon that is retrieved from\nthe Smart Link.',
			},
			{
				name: 'maxLines',
				type: 'number',
				description:
					'Determines the maximum number of lines for the underlying link text to\nspread over. Default is 2. Maximum is 2.',
			},
			{
				name: 'metadata',
				type: 'ElementItem[]',
				description:
					'An array of metadata elements to display in the TitleBlock.\nBy default elements will be shown to the right of the TitleBlock.\nThe visibility of the element is determine by the link data.\nIf link contain no data to display a particular element, the element\nwill simply not show up.\n@see ElementItem',
			},
			{
				name: 'onActionMenuOpenChange',
				type: '(options: OnActionMenuOpenChangeOptions) => void',
				description:
					'Called when the action dropdown menu (if present) is open/closed.\nReceives an object with `isOpen` state.',
			},
			{
				name: 'placeholderId',
				type: 'string',
				description:
					'A unique identifier for the placeholder loading state, which is constant across all loading states of the same item.\nA unique identifier for the placeholder loading state, which is constant across all loading states of the same item.',
			},
			{
				name: 'position',
				type: 'SmartLinkPosition',
				description:
					'Determines the position of the link icon in relative to the vertical\nheight of the TitleBlock.  It can either be centred or placed on “top”.\nDefault is top.',
			},
			{
				name: 'showActionOnHover',
				type: 'boolean',
				description:
					'Determines whether TitleBlock will hide actions until the user is hovering\nover the link.',
			},
			{
				name: 'size',
				type: 'SmartLinkSize',
				description:
					'The size of the block and the size that the underlying elements should\ndefault to.',
			},
			{
				name: 'subtitle',
				type: 'ElementItem[]',
				description:
					'An array of metadata elements to display in the TitleBlock.\nBy default elements will be shown below the link text.\nThe visibility of the element is determine by the link data.\nIf link contain no data to display a particular element, the element\nwill simply not show up.\n@see ElementItem',
			},
			{
				name: 'text',
				type: 'string',
				description:
					'The text to display in the link. Overrides any text that is retrieved from\nthe Smart Link.',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The URL of the link for Competitor Prompt',
			},
		],
	},
	{
		name: 'TitleBlock',
		package: '@atlaskit/smart-card',
		description:
			'A block component for the Smart Link title row. Used inside FlexibleCard to show title, icon, and optional metadata and actions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use for the main title row of a block Smart Link when you need title, icon, optional subtitle, metadata, or actions in one row.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the title is exposed as a heading or has an accessible name so it is announced as the primary label for the card.',
			'If the title row icon conveys meaning, give it an accessible name (e.g. aria-label); otherwise mark as decorative.',
		],
		keywords: ['smart-card', 'title block', 'flexible', 'block'],
		category: 'linking',
		examples: [
			"import { TitleBlock } from '../../src';\nimport ExampleContainer from './example-container';\nexport default (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<TitleBlock />\n\t</ExampleContainer>\n);",
		],
		props: [
			{
				name: 'actions',
				type: 'ActionItem[]',
				description:
					'An array of action items to be displayed after the title\non the right of the block.\nAn action item provides preset icon and label, with exception of\na custom action which either Icon or label must be provided.\n@see ActionItem',
				defaultValue: '[]',
			},
			{
				name: 'anchorRef',
				type: '((instance: HTMLAnchorElement) => void) | React.RefObject<HTMLAnchorElement>',
				description: 'Ref passed into the link <a> element',
			},
			{
				name: 'anchorTarget',
				type: '"_blank" | "_self" | "_top" | "_parent"',
				description: 'Determines the href target behaviour of the Link.',
			},
			{
				name: 'blockRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description: 'Ref to block wrapper div.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'React children',
			},
			{
				name: 'CompetitorPrompt',
				type: 'React.ComponentClass<{ linkType?: string; sourceUrl: string; }, any> | React.FunctionComponent<{ linkType?: string; sourceUrl: string; }>',
				description: 'Competitor Prompt Component for Competitor link',
			},
			{
				name: 'hideIcon',
				type: 'boolean',
				description: 'Determines whether TitleBlock will hide the Link Icon.',
				defaultValue: 'false',
			},
			{
				name: 'hideIconLoadingSkeleton',
				type: 'boolean',
				description:
					'For image icons in the title, whether to hide the loading skeleton while the image is loading.',
			},
			{
				name: 'hideRetry',
				type: 'boolean',
				description:
					'This option determines whenever we show any of the links and messages on the right side of the block,\nlike "connect to preview" or "Can\'t find link" or "Restricted link, try another account" etc.\nDefault is false.',
			},
			{
				name: 'hideTitleTooltip',
				type: 'boolean',
				description:
					'[Experiment] Determines whether the linked title should display tooltip on hover.',
			},
			{
				name: 'icon',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'The icon to display in the title block. Overrides any icon that is retrieved from\nthe Smart Link.',
			},
			{
				name: 'maxLines',
				type: 'number',
				description:
					'Determines the maximum number of lines for the underlying link text to\nspread over. Default is 2. Maximum is 2.',
			},
			{
				name: 'metadata',
				type: 'ElementItem[]',
				description:
					'An array of metadata elements to display in the TitleBlock.\nBy default elements will be shown to the right of the TitleBlock.\nThe visibility of the element is determine by the link data.\nIf link contain no data to display a particular element, the element\nwill simply not show up.\n@see ElementItem',
			},
			{
				name: 'onActionMenuOpenChange',
				type: '(options: OnActionMenuOpenChangeOptions) => void',
				description:
					'Called when the action dropdown menu (if present) is open/closed.\nReceives an object with `isOpen` state.',
			},
			{
				name: 'placeholderId',
				type: 'string',
				description:
					'A unique identifier for the placeholder loading state, which is constant across all loading states of the same item.\nA unique identifier for the placeholder loading state, which is constant across all loading states of the same item.',
			},
			{
				name: 'position',
				type: 'SmartLinkPosition',
				description:
					'Determines the position of the link icon in relative to the vertical\nheight of the TitleBlock.  It can either be centred or placed on “top”.\nDefault is top.',
			},
			{
				name: 'showActionOnHover',
				type: 'boolean',
				description:
					'Determines whether TitleBlock will hide actions until the user is hovering\nover the link.',
			},
			{
				name: 'size',
				type: 'SmartLinkSize',
				description:
					'The size of the block and the size that the underlying elements should\ndefault to.',
			},
			{
				name: 'subtitle',
				type: 'ElementItem[]',
				description:
					'An array of metadata elements to display in the TitleBlock.\nBy default elements will be shown below the link text.\nThe visibility of the element is determine by the link data.\nIf link contain no data to display a particular element, the element\nwill simply not show up.\n@see ElementItem',
			},
			{
				name: 'text',
				type: 'string',
				description:
					'The text to display in the link. Overrides any text that is retrieved from\nthe Smart Link.',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The URL of the link for Competitor Prompt',
			},
		],
	},
	{
		name: 'useSmartLinkEvents',
		package: '@atlaskit/smart-card',
		description:
			'Hook that returns a SmartLinkEvents object for dispatching analytics events for a given URL. Currently supports insertSmartLink.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to fire Smart Link analytics (e.g. insert events) from custom UI that is not the default Card.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Use analytics events to understand usage; ensure event wiring does not change focus, interrupt screen readers, or alter semantics.',
		],
		keywords: ['smart-card', 'hooks', 'analytics', 'useSmartLinkEvents', 'events'],
		category: 'linking',
		examples: [
			"import {\n\tAnalyticsContext,\n\tAnalyticsListener,\n\ttype UIAnalyticsEvent,\n} from '@atlaskit/analytics-next';\nimport Heading from '@atlaskit/heading';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Box, Text, xcss } from '@atlaskit/primitives';\nimport { Card } from '../../src';\nconst headingBoxStyles = xcss({\n\tmarginBottom: 'space.100',\n});\nconst stackBoxStyles = xcss({\n\tmarginTop: 'space.100',\n});\ntype ExampleComponentProps = {\n\tsetRecentEvents: React.Dispatch<React.SetStateAction<UIAnalyticsEvent[]>>;\n};\nconst ExampleComponent = ({ setRecentEvents }: ExampleComponentProps): JSX.Element => {\n\tconst handleOnClick = React.useCallback(\n\t\t(e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {\n\t\t\te.preventDefault();\n\t\t\treturn;\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<AnalyticsListener\n\t\t\tonEvent={(event) => {\n\t\t\t\tsetRecentEvents((prevEvents) => [...prevEvents, event]);\n\t\t\t}}\n\t\t\tchannel=\"*\"\n\t\t>\n\t\t\t<AnalyticsContext\n\t\t\t\tdata={{\n\t\t\t\t\tsource: 'content',\n\t\t\t\t\tattributes: {\n\t\t\t\t\t\tdisplayCategory: 'link',\n\t\t\t\t\t\tdisplay: 'url',\n\t\t\t\t\t\tid: '123',\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\t<SmartCardProvider client={new ResolvedClient('dev')}>\n\t\t\t\t\t<Card\n\t\t\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\t\t\tappearance=\"inline\"\n\t\t\t\t\t\tplatform=\"web\"\n\t\t\t\t\t\tshowHoverPreview={true}\n\t\t\t\t\t\tonClick={handleOnClick}\n\t\t\t\t\t/>\n\t\t\t\t</SmartCardProvider>\n\t\t\t</AnalyticsContext>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default (): React.JSX.Element => {\n\tconst [recentEvents, setRecentEvents] = React.useState<UIAnalyticsEvent[]>([]);\n\tconst mostRecent10Events = React.useMemo(() => {\n\t\treturn Array.from({ length: 10 }, (_, i) => {\n\t\t\treturn recentEvents.at(recentEvents.length - i - 1);\n\t\t});\n\t}, [recentEvents]);\n\treturn (\n\t\t<Box>\n\t\t\t<Box xcss={headingBoxStyles}>\n\t\t\t\t<Heading size=\"medium\">Interact with the link below and see events being fired</Heading>\n\t\t\t</Box>\n\t\t\t<ExampleComponent setRecentEvents={setRecentEvents} />\n\t\t\t<Box xcss={stackBoxStyles}>\n\t\t\t\t<Heading size=\"small\">The 10 Most Recent Events Fired</Heading>\n\t\t\t\t<ol>\n\t\t\t\t\t{mostRecent10Events.map((event, index) => {\n\t\t\t\t\t\tif (event === undefined) {\n\t\t\t\t\t\t\treturn <li key={index}></li>;\n\t\t\t\t\t\t}\n\t\t\t\t\t\tconst { action, actionSubject, eventType } = event.payload;\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t<li key={index}>\n\t\t\t\t\t\t\t\t<Text\n\t\t\t\t\t\t\t\t\tkey={index}\n\t\t\t\t\t\t\t\t>{`actionSubject: ${actionSubject}, action: ${action}, eventType: ${eventType}`}</Text>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t);\n\t\t\t\t\t})}\n\t\t\t\t</ol>\n\t\t\t</Box>\n\t\t</Box>\n\t);\n};",
		],
		props: [
			{
				name: 'actionOptions',
				type: 'CardActionVisibilityOptions & { previewAction?: { hideBlanket?: boolean; size?: EmbedModalSize; }; rovoChatAction?: { optIn: boolean; }; }',
				description:
					'Configure visibility of actions available.\nBy default, smart links show all actions available on the views.\nSet `hide` to true to disable all actions.\nSet `hide` to false and set `exclude` to enable only specific actions.',
			},
			{
				name: 'appearance',
				type: '"inline" | "block" | "embed"',
				description: 'Define smart card default appearance.',
				isRequired: true,
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: '',
			},
			{
				name: 'CompetitorPrompt',
				type: 'ComponentClass<{ linkType?: string; sourceUrl: string; }, any> | FunctionComponent<{ linkType?: string; sourceUrl: string; }>',
				description: 'Competitor Prompt Component for Competitor link experiment',
			},
			{
				name: 'container',
				type: 'HTMLElement',
				description:
					'The container which `react-lazily-render` listens to for scroll events.\nThis property can be used in a scenario where you want to specify your own scroll container\nwhile the Card component is (lazy)loading.',
			},
			{
				name: 'disablePreviewPanel',
				type: 'boolean',
				description:
					'When Preview panel is supported, onClick is ignored and the panel opens by default.\nThis prop allows smartlinks inside of editor to bypass that as they have other ways to open Preview panel.',
			},
			{
				name: 'embedIframeRef',
				type: '((instance: HTMLIFrameElement) => void) | RefObject<HTMLIFrameElement>',
				description: 'React referenced value on embed iframe.',
			},
			{
				name: 'embedIframeUrlType',
				type: '"href" | "interactiveHref"',
				description:
					'Type of URL used with embed iframe. By default, the embed use `data.preview.href` from link response.\n`interactiveHref` is suitable for displaying iframe content that contains "more editable" version of\nthe link, e.g. includes toolbar.\nIt is only available on supported link response with `data.preview.interactiveHref`.',
			},
			{
				name: 'fallbackComponent',
				type: 'ComponentClass<{}, any> | FunctionComponent<{}>',
				description:
					'A React component responsible for returning a fallback UI when smart link fails to render because of uncaught errors.',
			},
			{
				name: 'frameStyle',
				type: '"show" | "hide" | "showOnHover"',
				description:
					'A prop that determines the style of a frame:\nwhether to show it, hide it or only show it when a user hovers over embed.',
			},
			{
				name: 'hoverPreviewOptions',
				type: 'HoverPreviewOptions',
				description: 'Configuration for hover card.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique id for smart link used in analytics.',
			},
			{
				name: 'inheritDimensions',
				type: 'boolean',
				description:
					"Determines whether width and height of an embed card are to be inherited from the parent.\nIf `true`, embed iframe will remove restrictions on iframe aspect ratio, height and width.\nThe parent container needs to override a style `.loader-wrapper` and set the desirable height there.\n(For instance, 'height: 100%')",
			},
			{
				name: 'inlinePreloaderStyle',
				type: '"on-left-with-skeleton" | "on-right-without-skeleton"',
				description:
					'By default, inline resolving states show a frame with a spinner on the left.\nAn alternative is to remove the frame and place the spinner on the right by setting this value to `on-right-without-skeleton`.\nThis property is specific to inline links in the editor.',
			},
			{
				name: 'isHovered',
				type: 'boolean',
				description:
					'A flag that determines whether a card is in a hover state. Currently used for inline links in editor only.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Show selected state of smart link.',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<Element, MouseEvent> | KeyboardEvent<Element>, data?: OnClickData) => void',
				description:
					'A callback function triggered when a Smart Link is clicked.\n\nWhen defined, the default browser navigation is prevented and your handler\nis responsible for navigation — except for Flexible Card, which always opens\nthe link and then calls the callback.\n\nThe optional second argument `data` provides additional context about the click:\n- `data.destinationUrl` — the resolved URL Smart Link will navigate to.\n  This may differ from the original `url` prop if Smart Link resolved a\n  preferred URL from metadata or appended analytics parameters.\n- `data.url` — the original `url` prop passed to the component.\n\n@example\n// Basic usage\nonClick={(e) => { e.preventDefault(); window.location.href = myUrl; }}\n\n// With destination URL\nonClick={(e, data) => { navigate(data?.destinationUrl ?? url); }}',
			},
			{
				name: 'onError',
				type: '(data: { err?: Error; status: "errored" | "fallback" | "unauthorized" | "forbidden" | "not_found"; url: string; }) => void',
				description:
					'A callback function currently invoked in two cases:\n1. When the `CardState.status` is one of `ErrorCardType`. "err" property in argument will be undefined in this case\n   This does not mean that smart card failed to render.\n2. When there is any unhandled error inside smart card while rendering, resulting in failure to render smart card successfully.\n   "err" property in argument will be provided in this case.\n   Presence of an err property indicates that the client should either render their own fallback\n   or provide a fallbackComponent prop which will be rendered instead smart card component.\n   If fallbackComponent is not provided, smart card will render null',
			},
			{
				name: 'onResolve',
				type: '(data: { aspectRatio?: number; extensionKey?: string; title?: string; url?: string; }) => void',
				description: 'A callback function after the url is resolved into smart card.',
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'String to be displayed while the Card component is (lazy)loading.',
			},
			{
				name: 'removeTextHighlightingFromTitle',
				type: 'boolean',
				description:
					'When set to true, the text fragment will be removed from the title.\nThis will have no impact on the url and text highlighting will still persist in the url,\nhowever the text fragment will be stripped from the title of the smart card.\nFor example, when set to true: "my name | :~:text=highlight this" will be displayed as "my name"',
			},
			{
				name: 'resolvingPlaceholder',
				type: 'string',
				description:
					'When defined, this placeholder will be displayed while the smart card is resolving. This is only useful for inline cards.',
			},
			{
				name: 'showHoverPreview',
				type: 'boolean',
				description: 'Flag to display hover preview on hover.',
			},
			{
				name: 'truncateInline',
				type: 'boolean',
				description: 'When set to true, inline cards will be truncated to one line',
			},
			{
				name: 'ui',
				type: '{ clickableContainer?: boolean; enableSnippetRenderer?: boolean; hideBackground?: boolean; hideElevation?: boolean; hidePadding?: boolean; removeBlockRestriction?: boolean; size?: SmartLinkSize; theme?: SmartLinkTheme; zIndex?: number; }',
				description: '',
			},
			{
				name: 'url',
				type: 'string',
				description: 'The url link of the resource to be resolved and shown as Smart Link.',
			},
		],
	},
	{
		name: 'useSmartLinkActions',
		package: '@atlaskit/smart-card',
		description:
			'Hook that extracts and returns actions for a given URL. Relies on Smart Link context; usages must be wrapped in SmartCardProvider or equivalent.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when building custom action UI (buttons, menus) that should expose Smart Link actions (e.g. Preview, Open) for a given URL.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'When rendering actions from this hook (e.g. buttons or menus), provide accessible labels (e.g. from action.text) and ensure keyboard support.',
		],
		keywords: ['smart-card', 'hooks', 'useSmartLinkActions', 'actions'],
		category: 'linking',
		examples: [
			"import React, { useCallback } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientUrl } from '@atlaskit/link-test-helpers';\nimport { Box } from '@atlaskit/primitives/compiled';\nimport { Card } from '../../src';\nimport { CardAction } from '../../src/constants';\nimport { useSmartLinkActions } from '../../src/hooks';\nimport ExampleContainer from './example-container';\nconst PreviewButton = ({ url }: { url: string }) => {\n\tconst actions = useSmartLinkActions({ url, appearance: 'block' });\n\t// actions are returned in an array, find the preview action\n\tconst previewAction = actions.find((action) => action.id === 'preview-content');\n\tconst handleClick = useCallback(() => {\n\t\tif (previewAction) {\n\t\t\tpreviewAction.invoke();\n\t\t}\n\t}, [previewAction]);\n\tif (!previewAction) {\n\t\treturn null;\n\t}\n\treturn <Button onClick={handleClick}>{previewAction.text}</Button>;\n};\nconst UseSmartLinkActionsExample = (): React.JSX.Element => (\n\t<ExampleContainer>\n\t\t<SmartCardProvider client={new ResolvedClient()}>\n\t\t\t<Card\n\t\t\t\tappearance=\"block\"\n\t\t\t\turl={ResolvedClientUrl}\n\t\t\t\tactionOptions={{ hide: false, exclude: [CardAction.PreviewAction] }}\n\t\t\t/>\n\t\t\t<Box paddingBlockStart=\"space.200\">\n\t\t\t\t<PreviewButton url={ResolvedClientUrl} />\n\t\t\t</Box>\n\t\t</SmartCardProvider>\n\t</ExampleContainer>\n);\nexport default UseSmartLinkActionsExample;",
		],
		props: [
			{
				name: 'actionOptions',
				type: 'CardActionVisibilityOptions & { previewAction?: { hideBlanket?: boolean; size?: EmbedModalSize; }; rovoChatAction?: { optIn: boolean; }; }',
				description: 'Configure the visiblity of actions',
			},
			{
				name: 'appearance',
				type: 'CardAppearance | "embedPreview" | "flexible" | "hoverCardPreview" | "url"',
				description:
					'Appearance under which these actions will be invoked.\n@example `block` for card views.',
				isRequired: true,
			},
			{
				name: 'origin',
				type: '"smartLinkCard" | "smartLinkEmbed" | "smartLinkInline" | "smartLinkPreviewHoverCard"',
				description: 'Smart link origin that the action being invoked from.',
			},
			{
				name: 'platform',
				type: '"web" | "mobile"',
				description: 'Platform on which actions are being invoked.',
				defaultValue: "'web'",
			},
			{
				name: 'prefetch',
				type: 'boolean',
				description: 'Whether to prefetch the link.',
				defaultValue: 'false',
			},
			{
				name: 'url',
				type: 'string',
				description:
					'Smart Link URL for which actions will be invoked.\n@example https://start.atlassian.com',
				isRequired: true,
			},
		],
	},
	{
		name: 'HoverCard',
		package: '@atlaskit/smart-card',
		description:
			'Hover cards can be used as a standalone component to wrap any React component and display information about a supplied URL when the user hovers over the child. Different actions are shown depending on the resource type.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need a Smart Link preview on hover over a custom trigger (e.g. text, icon). For hover preview on inline Smart Links in body text, use Card with showHoverPreview instead.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Provide a keyboard-accessible way to open the preview (e.g. focus or explicit trigger); do not rely on hover alone.',
			'Ensure the trigger element has an accessible name and role (e.g. link or button).',
			'Ensure the hover card content is announced when shown (e.g. aria-describedby or live region) and can be dismissed via keyboard.',
		],
		keywords: ['smart-card', 'hover card', 'hover', 'preview', 'smart link'],
		category: 'linking',
		examples: [
			"import { IntlProvider } from 'react-intl';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport { ResolvedClient, ResolvedClientEmbedUrl } from '@atlaskit/link-test-helpers';\nimport { HoverCard } from '../../src/hoverCard';\nimport HoverOverMe from '../utils/hover-card-box';\nexport default (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<SmartCardProvider client={new ResolvedClient('stg')}>\n\t\t\t<HoverCard url={ResolvedClientEmbedUrl}>\n\t\t\t\t<HoverOverMe />\n\t\t\t</HoverCard>\n\t\t</SmartCardProvider>\n\t</IntlProvider>\n);",
		],
		props: [
			{
				name: 'actionOptions',
				type: 'CardActionVisibilityOptions & { previewAction?: { hideBlanket?: boolean; size?: EmbedModalSize; }; rovoChatAction?: { optIn: boolean; }; }',
				description: 'Configure visibility of server and client actions',
			},
			{
				name: 'allowEventPropagation',
				type: 'boolean',
				description: 'Allow click event to bubble up from hover preview trigger component.',
			},
			{
				name: 'canOpen',
				type: 'boolean',
				description:
					'Determines if the hover card is allowed to open. If changed from true to false while the\nhover card is open, the hover card will be closed.',
			},
			{
				name: 'children',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
				description: 'React children component over which the hover card can be triggered.',
				isRequired: true,
			},
			{
				name: 'closeOnChildClick',
				type: 'boolean',
				description:
					'Determines if the hover card should close when the children passed in are\nclicked.',
			},
			{
				name: 'hoverPreviewOptions',
				type: 'HoverPreviewOptions',
				description: 'Additional configurations for hover card.',
			},
			{
				name: 'id',
				type: 'string',
				description: 'Unique ID for a hover card. Used for analytics.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Refers to an `aria-label` attribute. Sets an accessible name for the hover card to announce it to users of assistive technology.\nUsage of either this, or the `titleId` attribute is strongly recommended.',
			},
			{
				name: 'onVisibilityChange',
				type: '(isVisible: boolean) => void',
				description: 'Callback function that is called when the hover card is visible or hidden.',
			},
			{
				name: 'role',
				type: 'string',
				description:
					'Use this to set the accessibility role for the hover card.\nShould be used along with `label` or `titleId` for supported roles.',
			},
			{
				name: 'shouldRenderToParent',
				type: 'boolean',
				description:
					'Whether the hover card should render to the parent element, to the\natlaskit-portal-container at the root of the document. Defaults to false.',
			},
			{
				name: 'titleId',
				type: 'string',
				description:
					'Id referenced by the hover card `aria-labelledby` attribute.\nUsage of either this, or the `label` attribute is strongly recommended.',
			},
			{
				name: 'url',
				type: 'string',
				description: 'Hover card will display data from this url.',
				isRequired: true,
			},
			{
				name: 'zIndex',
				type: 'number',
				description:
					'Z-index that the hover card should be displayed in.\nThis is passed to the portal component.',
			},
		],
	},
	{
		name: 'LinkUrl',
		package: '@atlaskit/smart-card',
		description:
			'LinkUrl is a plain hyperlink (<a>) with a built-in safety check. Use it when you want to warn users if the link description looks like one URL but the actual destination is different.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the link text might look like one URL but point elsewhere—e.g. user-generated or external links—so users get a warning before navigating.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Use descriptive link text that indicates the destination or action; avoid exposing only the URL when possible.',
			'Ensure the safety-check warning (when link text and destination differ) is announced to screen readers.',
		],
		keywords: ['smart-card', 'link', 'url', 'safety', 'hyperlink'],
		category: 'linking',
		examples: [
			'import Link from \'@atlaskit/link\';\nimport { CardClient, SmartCardProvider } from \'@atlaskit/link-provider\';\nimport { UnAuthClient } from \'@atlaskit/link-test-helpers\';\nimport LinkUrl from \'../../src/view/LinkUrl\';\nexport default (): React.JSX.Element => (\n\t<div>\n\t\t<h2>Link safety warning</h2>\n\t\t<ul>\n\t\t\t<li>\n\t\t\t\tLink description is a URL and it\'s different from a destination.\n\t\t\t\t<br />\n\t\t\t\t<LinkUrl href="https://www.google.com/">atlassian.com</LinkUrl>\n\t\t\t</li>\n\t\t</ul>\n\t\t<h2>No link safety warning</h2>\n\t\t<ul>\n\t\t\t<li>\n\t\t\t\tLink description is a plain text.\n\t\t\t\t<br />\n\t\t\t\t<LinkUrl href="https://www.google.com/">Here is a google link</LinkUrl>\n\t\t\t</li>\n\t\t\t<li>\n\t\t\t\tLink description is a URL identical to a destination.\n\t\t\t\t<br />\n\t\t\t\t<LinkUrl href="https://www.atlassian.com/solutions/devops">\n\t\t\t\t\thttps://www.atlassian.com/solutions/devops\n\t\t\t\t</LinkUrl>\n\t\t\t</li>\n\t\t\t<li>\n\t\t\t\tLink is a multi-line URL.\n\t\t\t\t<br />\n\t\t\t\t<LinkUrl href="https://www.atlassian.com/solutions/devops">\n\t\t\t\t\t<p>Help</p>\n\t\t\t\t\t<Link href="https://www.atlassian.com/solutions/devops">\n\t\t\t\t\t\thttps://www.atlassian.com/solutions/devops\n\t\t\t\t\t</Link>\n\t\t\t\t</LinkUrl>\n\t\t\t</li>\n\t\t\t<li>\n\t\t\t\tLink is a multi-line URL.\n\t\t\t\t<br />\n\t\t\t\t<LinkUrl href="https://hello.atlassian.com/wiki">\n\t\t\t\t\t<div>Help</div>\n\t\t\t\t\t<span>https://hello.atlas...</span>\n\t\t\t\t</LinkUrl>\n\t\t\t</li>\n\t\t</ul>\n\t\t<h2>Link with smart link resolver</h2>\n\t\t<ul>\n\t\t\t<li>\n\t\t\t\tThis link trigger smart link resolver\n\t\t\t\t<br />\n\t\t\t\t<SmartCardProvider client={new CardClient(\'stg\')}>\n\t\t\t\t\t<LinkUrl enableResolve={true} href="https://www.google.com/">\n\t\t\t\t\t\thttps://www.resolved-link.com/\n\t\t\t\t\t</LinkUrl>\n\t\t\t\t</SmartCardProvider>\n\t\t\t</li>\n\t\t\t<li>\n\t\t\t\tThis link trigger smart link resolver with unauth\n\t\t\t\t<br />\n\t\t\t\t<SmartCardProvider client={new UnAuthClient()}>\n\t\t\t\t\t<LinkUrl enableResolve={true} href="https://www.unauth-link.com/">\n\t\t\t\t\t\thttps://www.unauth-link.com/\n\t\t\t\t\t</LinkUrl>\n\t\t\t\t</SmartCardProvider>\n\t\t\t</li>\n\t\t</ul>\n\t</div>\n);',
		],
		props: [
			{
				name: 'checkSafety',
				type: 'boolean',
				description: 'Determines if we want to perform a link safety check. True by default.',
			},
			{
				name: 'enableResolve',
				type: 'boolean',
				description:
					'Determines if we want to resolve the URL in the background for Rovo indexing. This has no impact on the UI/UX. False by default.',
			},
			{
				name: 'isLinkComponent',
				type: 'boolean',
			},
		],
	},
];
