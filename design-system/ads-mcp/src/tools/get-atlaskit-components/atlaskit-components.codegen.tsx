/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content components from *.docs.tsx files outside of design-system
 *
 * @codegen <<SignedSource::999acbcad5b6a38dac9cb18c47addfef>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen:atlaskit-components
 */
/* eslint-disable @repo/internal/react/boolean-prop-naming-convention -- not our types */
import type { ComponentMcpPayload } from '../get-all-components/types';

export const atlaskitComponents: ComponentMcpPayload[] = [
	{
		name: 'FabricAnalyticsListeners',
		package: '@atlaskit/analytics-listeners',
		description:
			'A container component that mounts a set of pre-configured analytics listeners for common Atlassian channels (elements, editor, navigation, etc.).',
		status: 'general-availability',
		usageGuidelines: [
			'Mount this component near the root of your application to ensure all child components events are captured.',
			'Provide an `AnalyticsWebClient` instance to the `client` prop to handle the actual event transmission.',
			'Use `excludedChannels` to disable specific listeners if they are not needed or cause conflicts.',
		],
		keywords: ['analytics', 'listeners', 'fabric', 'atlassian'],
		category: 'analytics',
		examples: [
			"import { AnalyticsContext } from '@atlaskit/analytics-next';\nimport FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';\nimport { FabricChannel } from '../src/types';\nimport {\n\tcreateAnalyticsWebClientMock,\n\tcreateComponentWithAnalytics,\n\tcreateComponentWithAttributesWithAnalytics,\n} from './helpers';\nconst DummyElementsComponent = createComponentWithAnalytics(FabricChannel.elements);\nconst DummyElementsComponentWithAttributes = createComponentWithAttributesWithAnalytics(\n\tFabricChannel.elements,\n);\nconst DummyAtlaskitComponent = createComponentWithAnalytics(FabricChannel.atlaskit);\nconst DummyNavigationComponent = createComponentWithAnalytics(FabricChannel.navigation);\nconst DummyNotificationsComponent = createComponentWithAnalytics(FabricChannel.notifications);\nconst DummyLinkingPlatformComponent = createComponentWithAnalytics(FabricChannel.linkingPlatform);\nconst myOnClickHandler = () => {\n\tconsole.log('Button clicked ! Yay!');\n};\nfunction Example(): React.JSX.Element {\n\treturn (\n\t\t<FabricAnalyticsListeners client={createAnalyticsWebClientMock()}>\n\t\t\t<div>\n\t\t\t\t<DummyElementsComponent onClick={myOnClickHandler} />\n\t\t\t\t<AnalyticsContext data={{ issueId: 100, greeting: 'hello' }}>\n\t\t\t\t\t<AnalyticsContext data={{ issueId: 200 }}>\n\t\t\t\t\t\t<DummyElementsComponentWithAttributes onClick={myOnClickHandler} />\n\t\t\t\t\t</AnalyticsContext>\n\t\t\t\t</AnalyticsContext>\n\t\t\t\t<DummyAtlaskitComponent onClick={myOnClickHandler} />\n\t\t\t\t<AnalyticsContext\n\t\t\t\t\tdata={{\n\t\t\t\t\t\tcomponent: 'page',\n\t\t\t\t\t\tpackageName: '@atlaskit/page',\n\t\t\t\t\t\tpackageVersion: '2.0.1',\n\t\t\t\t\t\tattributes: { pageName: 'myPage' },\n\t\t\t\t\t\tsource: 'homePage',\n\t\t\t\t\t}}\n\t\t\t\t>\n\t\t\t\t\t<AnalyticsContext\n\t\t\t\t\t\tdata={{\n\t\t\t\t\t\t\tcomponent: 'myComponent',\n\t\t\t\t\t\t\tpackageName: '@atlaskit/my-component',\n\t\t\t\t\t\t\tpackageVersion: '1.0.0',\n\t\t\t\t\t\t\tattributes: { customAttr: true },\n\t\t\t\t\t\t\tsource: 'componentPage',\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\t<DummyNavigationComponent onClick={myOnClickHandler} />\n\t\t\t\t\t</AnalyticsContext>\n\t\t\t\t</AnalyticsContext>\n\t\t\t\t<AnalyticsContext data={{ attributes: { customAttribute: 'yes!' } }}>\n\t\t\t\t\t<DummyNotificationsComponent onClick={myOnClickHandler} />\n\t\t\t\t</AnalyticsContext>\n\t\t\t\t<DummyLinkingPlatformComponent onClick={myOnClickHandler} />\n\t\t\t</div>\n\t\t</FabricAnalyticsListeners>\n\t);\n}\nObject.assign(Example, {\n\tmeta: {\n\t\tnoListener: true,\n\t},\n});\nexport default Example;",
			"import { AnalyticsContext } from '@atlaskit/analytics-next';\nimport FabricAnalyticsListeners, { FabricChannel } from '../src';\nimport {\n\tcreateAnalyticsWebClientMock,\n\tcreateComponentWithAnalytics,\n\tcreateComponentWithAttributesWithAnalytics,\n} from './helpers';\nconst DummyElementsComponent = createComponentWithAnalytics(FabricChannel.elements);\nconst DummyElementsComponentWithAttributes = createComponentWithAttributesWithAnalytics(\n\tFabricChannel.elements,\n);\nconst DummyAtlaskitComponent = createComponentWithAnalytics(FabricChannel.atlaskit);\nconst myOnClickHandler = () => {\n\tconsole.log('Button clicked ! Yay!');\n};\nfunction Example(): React.JSX.Element {\n\treturn (\n\t\t<FabricAnalyticsListeners\n\t\t\tclient={createAnalyticsWebClientMock()}\n\t\t\texcludedChannels={[FabricChannel.atlaskit]}\n\t\t>\n\t\t\t<div>\n\t\t\t\t<p>Excluding analytics listener</p>\n\t\t\t\t<DummyElementsComponent onClick={myOnClickHandler} />\n\t\t\t\t<AnalyticsContext data={{ issueId: 100, greeting: 'hello' }}>\n\t\t\t\t\t<AnalyticsContext data={{ issueId: 200 }}>\n\t\t\t\t\t\t<DummyElementsComponentWithAttributes onClick={myOnClickHandler} />\n\t\t\t\t\t</AnalyticsContext>\n\t\t\t\t</AnalyticsContext>\n\t\t\t\t<DummyAtlaskitComponent onClick={myOnClickHandler} />\n\t\t\t</div>\n\t\t</FabricAnalyticsListeners>\n\t);\n}\nObject.assign(Example, {\n\tmeta: {\n\t\tnoListener: true,\n\t},\n});\nexport default Example;",
			"import Button from '@atlaskit/button/new';\nimport { token } from '@atlaskit/tokens';\nimport {\n\tcreateAnalyticsWebClientMock,\n\tcreateComponentWithAnalytics,\n\tIncorrectEventType,\n} from './helpers';\nimport { LOG_LEVEL } from '../src';\nimport FabricAnalyticsListeners from '../src/FabricAnalyticsListeners';\nimport { FabricChannel } from '../src/types';\nconst DummyElementsComponentWithAnalytics = createComponentWithAnalytics(FabricChannel.elements);\nconst DummyAtlaskitComponentWithAnalytics = createComponentWithAnalytics(FabricChannel.atlaskit);\nconst AtlaskitIncorrectEventType = IncorrectEventType(FabricChannel.atlaskit);\nconst myOnClickHandler = () => {\n\tconsole.log('Button clicked');\n};\nconst logLevels = [\n\t{ name: 'DEBUG', level: LOG_LEVEL.DEBUG },\n\t{ name: 'INFO', level: LOG_LEVEL.INFO },\n\t{ name: 'WARN', level: LOG_LEVEL.WARN },\n\t{ name: 'ERROR', level: LOG_LEVEL.ERROR },\n\t{ name: 'OFF', level: LOG_LEVEL.OFF },\n];\nclass Example extends React.Component {\n\tstate = {\n\t\tloggingLevelIdx: 0,\n\t};\n\tchangeLogLevel = (): void => {\n\t\tthis.setState({\n\t\t\tloggingLevelIdx: (this.state.loggingLevelIdx + 1) % logLevels.length,\n\t\t});\n\t};\n\trender(): React.JSX.Element {\n\t\tconst logLevel = logLevels[this.state.loggingLevelIdx];\n\t\treturn (\n\t\t\t<FabricAnalyticsListeners client={createAnalyticsWebClientMock()} logLevel={logLevel.level}>\n\t\t\t\t<div>\n\t\t\t\t\t{\n\t\t\t\t\t<div style={{ display: 'flex', alignItems: 'center' }}>\n\t\t\t\t\t\t<Button appearance=\"primary\" onClick={this.changeLogLevel}>\n\t\t\t\t\t\t\tChange log level\n\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t<div\n\t\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\t\tpadding: `${token('space.200', '16px')} ${token('space.100', '8px')}`,\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tLevel: {logLevel.name}\n\t\t\t\t\t\t</div>\n\t\t\t\t\t</div>\n\t\t\t\t\t{\n\t\t\t\t\t<div style={{ display: 'block' }}>\n\t\t\t\t\t\t<DummyElementsComponentWithAnalytics onClick={myOnClickHandler} />\n\t\t\t\t\t</div>\n\t\t\t\t\t{\n\t\t\t\t\t<div style={{ display: 'block' }}>\n\t\t\t\t\t\t<DummyAtlaskitComponentWithAnalytics onClick={myOnClickHandler} />\n\t\t\t\t\t</div>\n\t\t\t\t\t{\n\t\t\t\t\t<div style={{ display: 'block' }}>\n\t\t\t\t\t\t<AtlaskitIncorrectEventType onClick={myOnClickHandler} />\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</FabricAnalyticsListeners>\n\t\t);\n\t}\n}\nObject.assign(Example, {\n\tmeta: {\n\t\tnoListener: true,\n\t},\n});\nexport default Example;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Children!',
			},
			{
				name: 'client',
				type: 'AnalyticsWebClient | Promise<AnalyticsWebClient>',
			},
			{
				name: 'excludedChannels',
				type: 'FabricChannel[]',
				description: 'A list of individual listeners to exclude, identified by channel',
			},
			{
				name: 'logLevel',
				type: 'number',
			},
		],
	},
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
				name: 'prebuiltEditorState',
				type: 'EditorState',
				description:
					"Pre-built EditorState from ReactEditorView's ssrDeps.\nWhen provided, skips internal EditorState creation to avoid double work.",
			},
			{
				name: 'prebuiltPMPlugins',
				type: 'SafePlugin<any>[]',
				description:
					"Pre-built SafePlugins from ReactEditorView's ssrDeps.\nWhen provided, skips internal PM plugin creation to avoid double work.",
			},
			{
				name: 'schema',
				type: 'Schema<any, any>',
				isRequired: true,
			},
		],
	},
	{
		name: 'Emoji',
		package: '@atlaskit/emoji',
		description: 'A component for displaying a single emoji.',
		status: 'general-availability',
		usageGuidelines: ['Use `Emoji` to render a specific emoji by its ID or short name.'],
		keywords: ['emoji', 'display'],
		category: 'elements',
		examples: [
			"// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling\nimport { getEmojiRepository } from '@atlaskit/util-data-test/get-emoji-repository';\nimport { Emoji } from '../src/element';\nimport { IntlProvider } from 'react-intl';\nconst emojiService = getEmojiRepository();\nexport const renderEmoji = (fitToHeight: number = 24): React.JSX.Element => {\n\tconst blueStar = emojiService.findById('atlassian-blue_star');\n\tconst blueStarEmoji = blueStar ? (\n\t\t<Emoji emoji={blueStar} showTooltip={true} fitToHeight={fitToHeight} />\n\t) : (\n\t\t<span>[blueStar emoji not found]</span>\n\t);\n\tconst wtf = emojiService.findByShortName(':wtf:');\n\tconst wtfEmoji = wtf ? (\n\t\t<Emoji emoji={wtf} showTooltip={true} fitToHeight={fitToHeight} selected={true} />\n\t) : (\n\t\t<span>[wtf emoji not found]</span>\n\t);\n\tconst grimacing = emojiService.findByShortName(':grimacing:');\n\tconst grimacingEmoji = grimacing ? (\n\t\t<Emoji emoji={grimacing} showTooltip={true} fitToHeight={fitToHeight} />\n\t) : (\n\t\t<span>[grimacing emoji not found]</span>\n\t);\n\treturn (\n\t\t<div style={{ lineHeight: `${fitToHeight}px` }}>\n\t\t\t{blueStarEmoji}\n\t\t\t{wtfEmoji}\n\t\t\t{grimacingEmoji}\n\t\t\tEmoji at {fitToHeight}px.\n\t\t</div>\n\t);\n};\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<div>{renderEmoji(12)}</div>\n\t\t\t<br />\n\t\t\t<div>{renderEmoji()}</div>\n\t\t\t<br />\n\t\t\t<div>{renderEmoji(40)}</div>\n\t\t\t<br />\n\t\t\t<div>{renderEmoji(64)}</div>\n\t\t\t<br />\n\t\t</IntlProvider>\n\t);\n}",
		],
		props: [
			{
				name: 'autoWidth',
				type: 'boolean',
				description:
					"Auto Width takes the constraint of height and enables native scaling based on the emojis image.\nThis is primarily used when rendering emojis for SSR as the component does not know the width and height\nat the time of the render. It overrides the emoji representations width with 'auto' on the images width attribute\n\nUsed only for image based emojis",
			},
			{
				name: 'disableLazyLoad',
				type: 'boolean',
				description: 'Disables lazy load on images',
			},
			{
				name: 'editorEmoji',
				type: 'boolean',
				description:
					'This should only be set when the emoji is being used in the Editor.\nCurrently when set -- this prevents any aria labels being added.\nThis is acceptable in Editor -- as it uses another technique to announce the emoji nodes.',
			},
			{
				name: 'emoji',
				type: 'EmojiDescription',
				description: 'The emoji to render',
				isRequired: true,
			},
			{
				name: 'fitToHeight',
				type: 'number',
				description: 'Fits emoji to height in pixels, keeping aspect ratio',
			},
			{
				name: 'onDelete',
				type: 'OnEmojiEvent<any>',
				description: 'Called when an emoji is deleted',
			},
			{
				name: 'onFocus',
				type: 'OnEmojiEvent<any>',
				description: 'Called when the mouse moves over the emoji.',
			},
			{
				name: 'onLoadError',
				type: 'OnEmojiEvent<HTMLImageElement>',
				description: 'Callback for if an emoji image fails to load.',
			},
			{
				name: 'onLoadSuccess',
				type: '(emoji: EmojiDescription) => void',
				description: 'Callback for if an emoji image succesfully loads.',
			},
			{
				name: 'onMouseMove',
				type: 'OnEmojiEvent<any>',
				description: 'Called when the mouse moves over the emoji.',
			},
			{
				name: 'onSelected',
				type: 'OnEmojiEvent<any>',
				description: 'Called when an emoji is selected',
			},
			{
				name: 'preventFocusOnMouseDown',
				type: 'boolean',
				description:
					'Prevent mouse selection from moving browser focus to the emoji.\nKeyboard selection still keeps focus on the emoji for grid navigation.',
			},
			{
				name: 'renderUnicodeEmojiAsImage',
				type: 'boolean',
				description:
					'Renders unicode emoji through an image representation when a fixed height is supplied.\nDefaults to `true`.',
			},
			{
				name: 'selected',
				type: 'boolean',
				description: 'Show the emoji as selected',
			},
			{
				name: 'selectOnHover',
				type: 'boolean',
				description:
					'Automatically show the emoji as selected based on mouse hover.\nCSS, fast, does not require a re-render, but selected state not\nexternally controlled via props.',
			},
			{
				name: 'shouldBeInteractive',
				type: 'boolean',
				description:
					'Indicates whether emoji is an interactive element (tab index and role) or just a view',
			},
			{
				name: 'showDelete',
				type: 'boolean',
				description: 'Show a delete button on mouse hover\nUsed only for custom emoji',
			},
			{
				name: 'showTooltip',
				type: 'boolean',
				description: 'Show a tooltip on mouse hover.',
			},
		],
	},
	{
		name: 'EmojiPicker',
		package: '@atlaskit/emoji',
		description: 'A component that provides a searchable picker for emojis.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `EmojiPicker` when you need to allow users to select an emoji from a list.',
			'Requires an `EmojiResource` to fetch and manage emoji data.',
		],
		keywords: ['emoji', 'picker', 'select'],
		category: 'elements',
		examples: [
			"import {\n\tUsageShowAndClearComponent,\n\ttype UsagingShowingProps,\n} from '../example-helpers/demo-emoji-usage-components';\nimport type { EmojiProvider } from '../src/resource';\nimport { EmojiPicker } from '../src/picker';\nimport { EmojiResource } from '../src/api/EmojiResource';\nimport { IntlProvider } from 'react-intl';\nconst config = {\n\tproviders: [{ url: 'https://api-private.stg.atlassian.com/emoji/standard' }],\n};\nclass UsageShowingEmojiPickerTextInput extends UsageShowAndClearComponent {\n\tconstructor(props: UsagingShowingProps) {\n\t\tsuper(props);\n\t}\n\tgetWrappedComponent() {\n\t\tconst { emojiResource } = this.props;\n\t\treturn (\n\t\t\t<EmojiPicker\n\t\t\t\tonSelection={this.onSelection}\n\t\t\t\temojiProvider={Promise.resolve(emojiResource as EmojiProvider)}\n\t\t\t/>\n\t\t);\n\t}\n}\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<UsageShowingEmojiPickerTextInput emojiResource={new EmojiResource(config)} />\n\t\t</IntlProvider>\n\t);\n}",
		],
		props: [
			{
				name: 'emojiProvider',
				type: 'Promise<EmojiProvider>',
				description: 'Emoji Resource instance',
				isRequired: true,
			},
			{
				name: 'hideToneSelector',
				type: 'boolean',
				description: 'Flag to disable tone selector.',
			},
			{
				name: 'onPickerRef',
				type: 'PickerRefHandler',
				description: 'Callback to handle picker reference.',
			},
			{
				name: 'onSelection',
				type: 'OnEmojiEvent<any>',
				description: 'Callback to be executed on emoji selection.',
			},
			{
				name: 'size',
				type: '"small" | "medium" | "large"',
				description: "Size of Emoji Picker. default value is 'medium'.",
			},
		],
	},
	{
		name: 'EmojiTypeAhead',
		package: '@atlaskit/emoji',
		description: 'A component that provides emoji suggestions based on user input.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `EmojiTypeAhead` to provide a shortcut-based emoji selection experience (e.g., typing `:smile`).',
		],
		keywords: ['emoji', 'typeahead', 'autocomplete'],
		category: 'elements',
		examples: [
			"import { layers } from '@atlaskit/theme/constants';\nimport React, { useRef, useState } from 'react';\n// These imports are not included in the manifest file to avoid circular package dependencies blocking our Typescript and bundling tooling\nimport { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';\nimport { lorem, onClose, onOpen, onSelection } from '../example-helpers';\nimport SearchTextInput from '../example-helpers/demo-search-text-input';\nimport type { TypeaheadProps } from '../example-helpers/typeahead-props';\nimport { EmojiTypeAhead } from '../src/typeahead';\nimport type { EmojiId, OptionalEmojiDescription } from '../src/types';\nimport debug from '../src/util/logger';\nimport { IntlProvider } from 'react-intl';\nconst loremContent = (\n\t<div>\n\t\t{\n\t\t<p style={{ width: '400px' }}>{lorem}</p>\n\t</div>\n);\nexport const EmojiTypeAheadTextInput = (\n\tprops: React.PropsWithChildren<TypeaheadProps>,\n): React.JSX.Element => {\n\tconst emojiTypeAheadRef = useRef<EmojiTypeAhead | null>();\n\tconst [active, setActive] = useState<boolean>(false);\n\tconst [query, setQuery] = useState<string>('');\n\tconst { onSelection, label, emojiProvider, position } = props;\n\tdebug('demo-emoji-text-input.render', position);\n\tconst target = position ? '#demo-input' : undefined;\n\tconst showEmojiPopup = () => {\n\t\tsetActive(true);\n\t};\n\tconst hideEmojiPopup = () => {\n\t\tsetActive(false);\n\t};\n\tconst handleSelection = (emojiId: EmojiId, emoji: OptionalEmojiDescription) => {\n\t\thideEmojiPopup();\n\t\tonSelection(emojiId, emoji);\n\t};\n\tconst updateSearch = (event: React.ChangeEvent<HTMLInputElement>) => {\n\t\tif (active) {\n\t\t\tsetQuery(event.target.value || '');\n\t\t}\n\t};\n\tconst handleSearchTextInputChange = (query: React.ChangeEvent<HTMLInputElement>) => {\n\t\tupdateSearch(query);\n\t};\n\tconst handleSearchTextInputUp = () => {\n\t\temojiTypeAheadRef.current?.selectPrevious();\n\t};\n\tconst handleSearchTextInputDown = () => {\n\t\temojiTypeAheadRef.current?.selectNext();\n\t};\n\tconst handleSearchTextInputEnter = () => {\n\t\temojiTypeAheadRef.current?.chooseCurrentSelection();\n\t};\n\tconst handleEmojiTypeAheadRef = (ref: EmojiTypeAhead | null) => {\n\t\temojiTypeAheadRef.current = ref;\n\t};\n\tconst handleEmojiTypeAheadSelection = (emojiId: EmojiId, emoji: OptionalEmojiDescription) => {\n\t\thandleSelection(emojiId, emoji);\n\t};\n\tconst searchInput = (\n\t\t<SearchTextInput\n\t\t\tinputId=\"demo-input\"\n\t\t\tlabel={label}\n\t\t\tonChange={handleSearchTextInputChange}\n\t\t\tonUp={handleSearchTextInputUp}\n\t\t\tonDown={handleSearchTextInputDown}\n\t\t\tonEnter={handleSearchTextInputEnter}\n\t\t\tonEscape={hideEmojiPopup}\n\t\t\tonFocus={showEmojiPopup}\n\t\t\tonBlur={hideEmojiPopup}\n\t\t/>\n\t);\n\tlet emojiTypeAhead;\n\tif (active) {\n\t\temojiTypeAhead = (\n\t\t\t<EmojiTypeAhead\n\t\t\t\ttarget={target}\n\t\t\t\tposition={position}\n\t\t\t\tonSelection={handleEmojiTypeAheadSelection}\n\t\t\t\tonOpen={onOpen}\n\t\t\t\tonClose={onClose}\n\t\t\t\tref={handleEmojiTypeAheadRef}\n\t\t\t\tquery={query}\n\t\t\t\temojiProvider={emojiProvider}\n\t\t\t\tzIndex={layers.modal()}\n\t\t\t/>\n\t\t);\n\t}\n\treturn (\n\t\t<div style={{ padding: '10px' }}>\n\t\t\t{searchInput}\n\t\t\t{emojiTypeAhead}\n\t\t\t{loremContent}\n\t\t</div>\n\t);\n};\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<EmojiTypeAheadTextInput\n\t\t\t\tlabel=\"Emoji search\"\n\t\t\t\tonSelection={onSelection}\n\t\t\t\temojiProvider={getEmojiResource()}\n\t\t\t\tposition=\"below\"\n\t\t\t/>\n\t\t</IntlProvider>\n\t);\n}",
		],
		props: [
			{
				name: 'emojiProvider',
				type: 'Promise<EmojiProvider>',
				description: 'Emoji Resource instance',
				isRequired: true,
			},
			{
				name: 'listLimit',
				type: 'number',
				description: 'Number of results to be displayed in the search results list',
			},
			{
				name: 'offsetX',
				type: 'number',
			},
			{
				name: 'offsetY',
				type: 'number',
			},
			{
				name: 'onClose',
				type: 'OnLifecycle',
				description: 'Callback to be executed when typeahead component disappears',
			},
			{
				name: 'onOpen',
				type: 'OnLifecycle',
				description: 'Callback to be executed when typeahead component is being shown',
			},
			{
				name: 'onSelection',
				type: 'OnEmojiEvent<any>',
				description: 'Callback to be executed when user selects an emoji.',
			},
			{
				name: 'position',
				type: '"above" | "below" | "auto"',
			},
			{
				name: 'query',
				type: 'string',
				description: 'Search query.',
			},
			{
				name: 'target',
				type: 'string | HTMLElement',
				description: 'CSS selector, or target HTML element',
			},
			{
				name: 'zIndex',
				type: 'string | number',
			},
		],
	},
	{
		name: 'FeedbackCollector',
		package: '@atlaskit/feedback-collector',
		description: 'The main component for collecting user feedback.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `FeedbackCollector` to trigger a feedback form from your application.',
			'Provide `onClose` and `onSubmit` handlers to manage the feedback flow.',
		],
		keywords: ['feedback', 'collector', 'atlassian'],
		category: 'web-platform',
		examples: [
			"import React, { useRef, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { FlagGroup } from '@atlaskit/flag';\nimport FeedbackCollector, { FeedbackFlag } from '../src';\nconst ENTRYPOINT_ID: string = 'e0d501eb-7386-4ba7-aedc-68dc1dde485a';\nconst name: string = 'Feedback Sender';\nconst aaid: string = 'test-aaid';\nconst DisplayFeedback = () => {\n\tconst ref = useRef<HTMLElement | null>(null);\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst [displayFlag, setDisplayFlag] = useState(false);\n\tconst open = () => setIsOpen(true);\n\tconst close = () => setIsOpen(false);\n\tconst displayFlagTrue = () => setDisplayFlag(true);\n\tconst hideFlag = () => setDisplayFlag(false);\n\treturn (\n\t\t<div>\n\t\t\t<Button appearance=\"primary\" onClick={open}>\n\t\t\t\tDisplay Feedback\n\t\t\t</Button>\n\t\t\t{isOpen && (\n\t\t\t\t<FeedbackCollector\n\t\t\t\t\tlocale={'en'}\n\t\t\t\t\turl={'https://api-private.atlassian.com'}\n\t\t\t\t\tonClose={close}\n\t\t\t\t\tonSubmit={displayFlagTrue}\n\t\t\t\t\tatlassianAccountId={aaid}\n\t\t\t\t\tname={name}\n\t\t\t\t\tentrypointId={ENTRYPOINT_ID}\n\t\t\t\t\tshouldReturnFocusRef={ref}\n\t\t\t\t/>\n\t\t\t)}\n\t\t\t<FlagGroup onDismissed={hideFlag}>{displayFlag && <FeedbackFlag />}</FlagGroup>\n\t\t</div>\n\t);\n};\nexport default (): React.JSX.Element => (\n\t<>\n\t\t<>Click the button to display the feedback collector.</>\n\t\t<DisplayFeedback />\n\t</>\n);",
		],
		props: [
			{
				name: 'additionalFields',
				type: 'FieldType[]',
				description: 'Additional fields to send to the widget service *',
				isRequired: true,
			},
			{
				name: 'anonymousFeedback',
				type: 'boolean',
				description: 'Override to mark feedback as anonymous',
			},
			{
				name: 'atlassianAccountId',
				type: 'string',
				description: "Optional parameter for feedback submitter's Atlassian Account ID",
			},
			{
				name: 'canBeContactedAgreeValue',
				type: 'string | Object | Object[]',
				description:
					'Override the agree value for the "can be contacted" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'canBeContactedDeclineValue',
				type: 'string | Object | Object[]',
				description:
					'Override the decline value for the "can be contacted" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'canBeContactedFieldId',
				type: 'string',
				description:
					'Override the default id for the "can be contacted" custom field in your widget service *',
				isRequired: true,
			},
			{
				name: 'canBeContactedLabel',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description: 'Message which will be shown next to the can be contacted checkbox',
			},
			{
				name: 'canBeContactedLink',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Link which will be shown below the can be contacted checkbox',
			},
			{
				name: 'cancelButtonLabel',
				type: 'string',
				description: 'Message for cancel button label',
			},
			{
				name: 'customContent',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description: 'Optional custom modal content',
			},
			{
				name: 'customerNameDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "customer name" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'customerNameFieldId',
				type: 'string',
				description:
					'Override the default id for the "customer name" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'customFeedbackOptions',
				type: 'OptionType[]',
				description: 'Custom Select feedback options',
			},
			{
				name: 'customFeedbackUrl',
				type: 'string',
				description:
					'A custom URL for the Feedback Collector API, this field takes priority over `url`',
			},
			{
				name: 'customGatewayUrl',
				type: 'string',
				description: 'A custom URL for the Stargate gateway, this field takes priority over `url`',
			},
			{
				name: 'customTextAreaLabel',
				type: 'string',
				description: 'Optional custom label for TextArea when showTypeField is false',
			},
			{
				name: 'descriptionDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "description" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'descriptionFieldId',
				type: 'string',
				description:
					'Override the default id for the "description" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'dialogRef',
				type: 'RefObject<HTMLElement>',
				description: 'Ref to the rendered feedback dialog container',
			},
			{
				name: 'disableSubmitButton',
				type: 'boolean',
				description: 'Disable submit button to allow custom content to handle validation',
			},
			{
				name: 'email',
				type: 'string',
				description: "Optional parameter for feedback submitter's email address",
			},
			{
				name: 'enrolInResearchLabel',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description: 'Message which will be shown next to the enrol in research checkbox',
			},
			{
				name: 'enrolInResearchLink',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description: 'Message which will be shown below the enrol in research checkbox',
			},
			{
				name: 'enrollInResearchAgreeValue',
				type: 'string | Object | Object[]',
				description:
					'Override the agree value for the "enroll in research" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'enrollInResearchDeclineValue',
				type: 'string | Object | Object[]',
				description:
					'Override the decline value for the "enroll in research" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'enrollInResearchFieldId',
				type: 'string',
				description:
					'Override the default id for the "enroll in research" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'entrypointId',
				type: 'string',
				description:
					'The id of the entrypoint in the feedback service; to acquire your entrypointId, visit the #feedback-collectors channel',
				isRequired: true,
			},
			{
				name: 'feedbackGroupLabels',
				type: '{ bug?: SelectOptionDetails; comment?: SelectOptionDetails; suggestion?: SelectOptionDetails; question?: SelectOptionDetails; ... 5 more ...; other?: SelectOptionDetails; }',
				description: 'Message for select option labels and field labels',
			},
			{
				name: 'feedbackTitle',
				type: 'string | number',
				description: 'Message which will be shown as the title of the feedback dialog',
			},
			{
				name: 'feedbackTitleDetails',
				type: 'string | number | ReactElement<any, string | JSXElementConstructor<any>>',
				description: 'Message which will be shown below the title of the feedback dialog',
			},
			{
				name: 'locale',
				type: 'string',
				description: 'Locale for i18n',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'The customer name',
			},
			{
				name: 'onCancel',
				type: '(...args: any[]) => void',
				description:
					'Optional function that will be called when the cancel button is clicked, in addition to onClose.',
			},
			{
				name: 'onClose',
				type: '(...args: any[]) => void',
				description:
					'Function that will be called to initiate the exit transition.\nWhen triggered by the cancel button the originating event and Atlaskit UI analytics\nevent are forwarded; programmatic close paths (e.g. after submit) invoke it with no\narguments. Typed as a variadic `any[]` to maximise backward compatibility with\nconsumers that declared any conceivable signature for this callback.',
				isRequired: true,
			},
			{
				name: 'onSubmit',
				type: '(formFields: FormFields) => void',
				description:
					'Function that will be called optimistically after a delay when the feedback is submitted.',
				isRequired: true,
			},
			{
				name: 'selectLabel',
				type: 'string',
				description: 'Optional custom label for select field',
			},
			{
				name: 'shouldGetEntitlementDetails',
				type: 'boolean',
				description: 'Whether to request email details and product entitlements',
			},
			{
				name: 'shouldReturnFocusRef',
				type: 'RefObject<HTMLElement>',
				description: 'Optional ref to return focus to after feedback form is closed',
			},
			{
				name: 'showDefaultTextFields',
				type: 'boolean',
				description: 'Override to hide the default text fields for feedback',
			},
			{
				name: 'showRequiredFieldsSummary',
				type: 'boolean',
				description: 'Optional to show or hide the required fields summary',
			},
			{
				name: 'showTypeField',
				type: 'boolean',
				description: 'Override to hide the feedback type select drop down for the feedback',
				isRequired: true,
			},
			{
				name: 'submitButtonLabel',
				type: 'string',
				description: 'Message for submit button label',
			},
			{
				name: 'summaryDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "summary" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'summaryFieldId',
				type: 'string',
				description:
					'Override the default id for the "summary" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'summaryPlaceholder',
				type: 'string',
				description: 'Message which will be shown inside the summary text field',
			},
			{
				name: 'summaryTruncateLength',
				type: 'number',
				description:
					'Number of characters that the "summary" field accepts, the rest will be truncated',
				isRequired: true,
			},
			{
				name: 'timeoutOnSubmit',
				type: 'number',
				description: 'After this delay the onSubmit callback will be triggered optimistically',
				isRequired: true,
			},
			{
				name: 'typeBugDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "Bug" type of response in your widget service',
				isRequired: true,
			},
			{
				name: 'typeCommentDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "Comment" type of response in your widget service',
				isRequired: true,
			},
			{
				name: 'typeEmptyDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "Empty" type of response in your widget service',
				isRequired: true,
			},
			{
				name: 'typeFieldId',
				type: 'string',
				description: 'Override the default id for the "type" custom field in your widget service',
				isRequired: true,
			},
			{
				name: 'typeQuestionDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "Question" type of response in your widget service',
				isRequired: true,
			},
			{
				name: 'typeSuggestionDefaultValue',
				type: 'string | Object | Object[]',
				description:
					'Override the default value for the "Suggestion" type of response in your widget service',
				isRequired: true,
			},
			{
				name: 'url',
				type: 'string',
				description:
					'Override the URL for all HTTPS calls, only needed if service is not behind stargate (like the Atlaskit frontend itself)',
			},
		],
	},
	{
		name: 'FeedbackButton',
		package: '@atlaskit/feedback-collector',
		description: 'A button component used to trigger the feedback collector.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `FeedbackButton` to provide a consistent trigger for the feedback collector.',
		],
		keywords: ['feedback', 'button', 'trigger'],
		category: 'web-platform',
		examples: [
			"import { FeedbackButton } from '../src';\nexport default (): React.JSX.Element => <FeedbackButton locale={'en'} entrypointId={'key1'} />;",
		],
		props: [
			{
				name: 'atlassianAccountId',
				type: 'string',
			},
			{
				name: 'entrypointId',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'locale',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'shouldGetEntitlementDetails',
				type: 'boolean',
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
				name: 'disableManualUrlInsert',
				type: 'boolean',
				description:
					'When true, disables the Insert button when the user has manually typed a URL but no search\nresult has been selected. This prevents inserting external/manual links when only\nresult-based links are desired.',
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
		name: 'AvatarPickerDialog',
		package: '@atlaskit/media-avatar-picker',
		description: 'Main dialog component that orchestrates the avatar selection experience.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `AvatarPickerDialog` when you need to allow users to upload or select an avatar.',
		],
		keywords: ['media', 'avatar', 'picker', 'upload'],
		category: 'media',
		examples: [
			"import { tallImage } from '@atlaskit/media-test-helpers';\nimport StatefulAvatarPickerDialog from '../example-helpers/StatefulAvatarPickerDialog';\nexport default (): React.JSX.Element => (\n\t<StatefulAvatarPickerDialog placeholder={<div>Loading...</div>} imageSource={tallImage} />\n);",
		],
		props: [
			{
				name: 'avatars',
				type: 'Avatar[]',
				description:
					'This property is used to provide an array of pre-defined avatars. The **Avatar** object is a simple type with a single **dataURI: string** property. For convenience, this type is exported from the **@atlassian/media-avatar-picker** module along with the **AvatarPickerDialog** component.',
				isRequired: true,
			},
			{
				name: 'defaultSelectedAvatar',
				type: 'Avatar',
				description:
					'This property is used along with the **avatar** property. It allows you to set the currently selected pre-defined avatar. By default, there is no pre-defined avatar selected, even if the **avatars** property is set.',
			},
			{
				name: 'errorMessage',
				type: 'string',
				description:
					'This optional property allows the consumer to display an error message. This may occur from a call to a service. The string is clipped if greater than 125 charaters (approximately 3 lines within the dialog).',
			},
			{
				name: 'imageSource',
				type: 'string',
				description:
					'This optional property is used to set the selected image so that the component opens up with it visible already. The value should be a valid dataURI string. If an invalid dataURI is given, the bad format error state will be triggered and a message shown.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'This optional property is used while the avatar is loaded.',
			},
			{
				name: 'maxImageSize',
				type: 'number',
				description:
					'This optional property allows the consumer to define the maximum image size that can be uploaded.',
			},
			{
				name: 'onAvatarPicked',
				type: '((avatar: Avatar) => void) | ((avatar: Avatar, altText: string) => void)',
				description:
					'This property is raised when the user clicks the **Save** button and there is a pre-defined avatar selected, and no image selected. An **Avatar** object with a **dataURI** property is passed.\nThis property is raised when the user clicks the **Save** button and there is a pre-defined avatar selected, and no image selected. Two arguments are passed, an **Avatar** object with a **dataURI** property, and an **altText** string.',
				isRequired: true,
			},
			{
				name: 'onCancel',
				type: '() => void',
				description:
					'This property is raised when the user clicks **Cancel** button.\n **Note** this does not close the dialog.\nIt is up to the consumer to re-render and remove the dialog from the UI.',
				isRequired: true,
			},
			{
				name: 'onImagePicked',
				type: '((file: File, crop: CropProperties) => void) | ((file: File, crop: CropProperties, altText: string) => void)',
				description:
					'This property is raised when the user clicks the **Save** button and there is a selected image.\nTwo arguments are passed, the **file:File** which is a blob, and the crop settings which is an object containing **x:number**,**y:number**, and **size:number** values, which are all relative to the coordinates of the selected image. **Note** due to limitations on Safari <= 10.0 and IE11, a **Blob** object will be returned instead of a **File**.\nThis still allows access to the image byte data to facilitate uploads, essentially minus the filename and date attributes.\nThis property is raised when the user clicks the **Save** button and there is a selected image.\nThree arguments are passed, the **file:File** which is a blob, the crop settings which is an object containing **x:number**,**y:number**, and **size:number** values, which are all relative to the coordinates of the selected image, and **altText:string**. **Note** due to limitations on Safari <= 10.0 and IE11, a **Blob** object will be returned instead of a **File**.\nThis still allows access to the image byte data to facilitate uploads, essentially minus the filename and date attributes.',
			},
			{
				name: 'onImagePickedDataURI',
				type: '((dataUri: string) => void) | ((dataUri: string, altText: string) => void)',
				description:
					'This property is raised when the user clicks the **Save** button and there is a selected image. The selected image is provided as a dataURI string.\nThis property is raised when the user clicks the **Save** button and there is a selected image. The selected image is provided as a dataURI string, and the user-specified alt text is provided as an altText string.',
			},
			{
				name: 'outputSize',
				type: 'number',
				description:
					'The target width/height of the resulting (square) avatar. Leave blank for default (200x200)',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'predefinedAvatarsText',
				type: 'string',
				description: 'This property describes the text related to the Avatar.',
			},
			{
				name: 'primaryButtonText',
				type: 'string',
				description: 'The primary button text. The default is _Save_.',
			},
			{
				name: 'requireAltText',
				type: 'boolean',
				description:
					'This property allows the consumer to specify whether or not the user should be required to enter alt text.\nThis property allows the consumer to specify whether or not the user should be required to enter alt text.',
			},
			{
				name: 'selectAvatarLabel',
				type: 'string',
				description:
					'This optional property allows the consumer to define a custom label for select default avatar. The default is _Select a default avatar_.',
			},
			{
				name: 'showMoreAvatarsButtonLabel',
				type: 'string',
				description:
					'This optional property allows the consumer to define a custom label for the default avatars show more button. The default is _Show more_.',
			},
			{
				name: 'title',
				type: 'string',
				description: 'The title text for the dialog. The default is _Upload an avatar_.',
			},
		],
	},
	{
		name: 'ImageCropper',
		package: '@atlaskit/media-avatar-picker',
		description: 'Interactive component for cropping uploaded images.',
		status: 'general-availability',
		usageGuidelines: ['Use `ImageCropper` for standalone image cropping functionality.'],
		keywords: ['media', 'crop', 'image'],
		category: 'media',
		examples: [
			"import { IntlProvider } from 'react-intl';\nimport ImageCropper from '../src/image-cropper';\nimport { tallImage } from '@atlaskit/media-test-helpers';\nconst naturalWidth = 5360;\nconst onImageLoaded = (img: HTMLImageElement) =>\n\tconsole.log('onImageLoaded', img.naturalWidth, img.naturalHeight);\nconst onRemoveImage = () => console.log('onRemoveImage');\nconst onImageError = (errorMessage: string) => console.log('onImageError', errorMessage);\nexport default (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<div>\n\t\t\t<div>\n\t\t\t\t<h1>default</h1>\n\t\t\t\t<ImageCropper\n\t\t\t\t\timageOrientation={1}\n\t\t\t\t\timageSource={tallImage}\n\t\t\t\t\timageWidth={naturalWidth}\n\t\t\t\t\ttop={-80}\n\t\t\t\t\tleft={-80}\n\t\t\t\t\tonDragStarted={() => console.log('DragStarted')}\n\t\t\t\t\tonImageLoaded={onImageLoaded}\n\t\t\t\t\tonRemoveImage={onRemoveImage}\n\t\t\t\t\tonImageError={onImageError}\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<h1>when image width is not set</h1>\n\t\t\t\t<ImageCropper\n\t\t\t\t\timageOrientation={1}\n\t\t\t\t\timageSource={tallImage}\n\t\t\t\t\ttop={-50}\n\t\t\t\t\tleft={-115}\n\t\t\t\t\tonImageLoaded={onImageLoaded}\n\t\t\t\t\tonRemoveImage={onRemoveImage}\n\t\t\t\t\tonImageError={onImageError}\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<h1>with custom container size</h1>\n\t\t\t\t<ImageCropper\n\t\t\t\t\timageOrientation={1}\n\t\t\t\t\timageSource={tallImage}\n\t\t\t\t\timageWidth={naturalWidth}\n\t\t\t\t\tonImageLoaded={onImageLoaded}\n\t\t\t\t\ttop={-50}\n\t\t\t\t\tleft={-115}\n\t\t\t\t\tcontainerSize={400}\n\t\t\t\t\tonRemoveImage={onRemoveImage}\n\t\t\t\t\tonImageError={onImageError}\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<div>\n\t\t\t\t<h1>with circular mask</h1>\n\t\t\t\t<ImageCropper\n\t\t\t\t\timageOrientation={1}\n\t\t\t\t\timageSource={tallImage}\n\t\t\t\t\timageWidth={naturalWidth}\n\t\t\t\t\ttop={-70}\n\t\t\t\t\tleft={-90}\n\t\t\t\t\tisCircularMask={true}\n\t\t\t\t\tonImageLoaded={onImageLoaded}\n\t\t\t\t\tonRemoveImage={onRemoveImage}\n\t\t\t\t\tonImageError={onImageError}\n\t\t\t\t/>\n\t\t\t</div>\n\t\t</div>\n\t</IntlProvider>\n);",
		],
		props: [
			{
				name: 'containerSize',
				type: 'number',
			},
			{
				name: 'imageHeight',
				type: 'number',
			},
			{
				name: 'imageOrientation',
				type: 'number',
				isRequired: true,
			},
			{
				name: 'imageSource',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'imageWidth',
				type: 'number',
			},
			{
				name: 'isCircularMask',
				type: 'boolean',
			},
			{
				name: 'left',
				type: 'number',
				isRequired: true,
			},
			{
				name: 'moveImage',
				type: '(key: string) => void',
			},
			{
				name: 'onDragStarted',
				type: '(x: number, y: number) => void',
			},
			{
				name: 'onImageError',
				type: '(errorMessage: string) => void',
				isRequired: true,
			},
			{
				name: 'onImageLoaded',
				type: '(image: HTMLImageElement) => void',
				isRequired: true,
			},
			{
				name: 'onRemoveImage',
				type: '() => void',
				isRequired: true,
			},
			{
				name: 'top',
				type: 'number',
				isRequired: true,
			},
		],
	},
	{
		name: 'Card',
		package: '@atlaskit/media-card',
		description: 'The main component for displaying media files as cards.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `Card` to display media files in a grid or list.',
			'Requires a `MediaClient` instance and a file identifier.',
		],
		keywords: ['media', 'card', 'file', 'display'],
		category: 'media',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from '@emotion/react';\nimport { Component, type SyntheticEvent } from 'react';\nimport {\n\tdefaultCollectionName,\n\tgenericFileId,\n\taudioFileId,\n\taudioNoCoverFileId,\n\tvideoFileId,\n\tvideoProcessingFailedId,\n\tdocFileId,\n\tlargePdfFileId,\n\tarchiveFileId,\n\tunknownFileId,\n\terrorFileId,\n\tgifFileId,\n\tnoMetadataFileId,\n\tcreateUploadMediaClientConfig,\n\temptyImageFileId,\n} from '@atlaskit/media-test-helpers';\nimport Button from '@atlaskit/button/new';\nimport { Card } from '../src';\nimport {\n\tUploadController,\n\ttype FileIdentifier,\n\tMediaClient,\n\ttype MediaSubscribable,\n} from '@atlaskit/media-client';\nimport { cardWrapperStyles, cardFlowHeaderStyles } from '../example-helpers/styles';\nimport { MainWrapper } from '../example-helpers';\nconst mediaClientConfig = createUploadMediaClientConfig();\nconst mediaClient = new MediaClient(mediaClientConfig);\nexport interface ComponentProps {}\ntype fileId = {\n\tid: string;\n\tname?: string;\n};\nexport interface ComponentState {\n\tfileIds: fileId[];\n}\nconst fileIds = [\n\t{ id: genericFileId.id, name: 'Generic file' },\n\t{ id: audioFileId.id, name: 'Audio file' },\n\t{ id: audioNoCoverFileId.id, name: 'Audio no cover file' },\n\t{ id: videoFileId.id, name: 'Video file' },\n\t{ id: gifFileId.id, name: 'Gif file' },\n\t{ id: videoProcessingFailedId.id, name: 'Video processing failed' },\n\t{ id: errorFileId.id, name: 'Error file' },\n\t{ id: docFileId.id, name: 'Doc file' },\n\t{ id: largePdfFileId.id, name: 'Large pdf file' },\n\t{ id: archiveFileId.id, name: 'Archive file' },\n\t{ id: unknownFileId.id, name: 'Unknown file' },\n\t{ id: noMetadataFileId.id, name: 'No metadata file' },\n\t{ id: emptyImageFileId.id, name: 'Empty image file' },\n];\nclass Example extends Component<ComponentProps, ComponentState> {\n\tuploadController?: UploadController;\n\tstate: ComponentState = {\n\t\tfileIds,\n\t};\n\trenderCards() {\n\t\tconst { fileIds } = this.state;\n\t\tconst cards = fileIds.map(({ id, name }) => {\n\t\t\tconst identifier: FileIdentifier = {\n\t\t\t\tid,\n\t\t\t\tmediaItemType: 'file',\n\t\t\t\tcollectionName: defaultCollectionName,\n\t\t\t};\n\t\t\treturn (\n\t\t\t\t<div css={cardWrapperStyles} key={id}>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t<h3>{name}</h3>\n\t\t\t\t\t\t<Card\n\t\t\t\t\t\t\tmediaClientConfig={mediaClientConfig}\n\t\t\t\t\t\t\tidentifier={identifier}\n\t\t\t\t\t\t\tshouldEnableDownloadButton\n\t\t\t\t\t\t\tshouldOpenMediaViewer\n\t\t\t\t\t\t/>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t);\n\t\t});\n\t\treturn <div>{cards}</div>;\n\t}\n\tcancelUpload = () => {\n\t\tif (this.uploadController) {\n\t\t\tthis.uploadController.abort();\n\t\t}\n\t};\n\tuploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {\n\t\tif (!event.currentTarget.files || !event.currentTarget.files.length) {\n\t\t\treturn;\n\t\t}\n\t\tconst file = event.currentTarget.files[0];\n\t\tconst uplodableFile = {\n\t\t\tcontent: file,\n\t\t\tname: file.name,\n\t\t\tcollection: defaultCollectionName,\n\t\t\tmimeType: file.type,\n\t\t};\n\t\tconst uploadController = new UploadController();\n\t\tconst stream = mediaClient.file.upload(uplodableFile, uploadController);\n\t\tthis.uploadController = uploadController;\n\t\tthis.addStream(stream);\n\t};\n\taddStream = (stream: MediaSubscribable) => {\n\t\tlet isIdSaved = false;\n\t\tconst subscription = stream.subscribe({\n\t\t\tnext: (state) => {\n\t\t\t\tconst { fileIds } = this.state;\n\t\t\t\tif (!isIdSaved && state.status === 'uploading') {\n\t\t\t\t\tisIdSaved = true;\n\t\t\t\t\tthis.setState({\n\t\t\t\t\t\tfileIds: [{ id: state.id }, ...fileIds],\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t\tif (state.status === 'processing') {\n\t\t\t\t\t// here we have the public id, AKA upload is finished\n\t\t\t\t\tconsole.log('public id', state.id);\n\t\t\t\t\tsubscription.unsubscribe();\n\t\t\t\t}\n\t\t\t},\n\t\t\tcomplete() {\n\t\t\t\tconsole.log('stream complete');\n\t\t\t},\n\t\t\terror(error) {\n\t\t\t\tconsole.log('stream error', error);\n\t\t\t},\n\t\t});\n\t};\n\trender() {\n\t\treturn (\n\t\t\t<React.Fragment>\n\t\t\t\t{\n\t\t\t\t<div css={cardFlowHeaderStyles}>\n\t\t\t\t\tUpload file <input type=\"file\" onChange={this.uploadFile} />\n\t\t\t\t\t<Button appearance=\"primary\" onClick={this.cancelUpload}>\n\t\t\t\t\t\tCancel upload\n\t\t\t\t\t</Button>\n\t\t\t\t</div>\n\t\t\t\t{this.renderCards()}\n\t\t\t</React.Fragment>\n\t\t);\n\t}\n}\nexport default (): React.JSX.Element => (\n\t<MainWrapper>\n\t\t<Example />\n\t</MainWrapper>\n);\n// We export the example without FFs dropdown for SSR test:\n// packages/media/media-card/src/__tests__/unit/server-side-hydrate.tsx\nexport const SSR = (): React.JSX.Element => <Example />;",
		],
		props: [
			{
				name: 'actions',
				type: 'CardAction[]',
			},
			{
				name: 'alt',
				type: 'string',
			},
			{
				name: 'appearance',
				type: '"auto" | "image" | "square" | "horizontal"',
			},
			{
				name: 'backgroundColor',
				type: 'Globals | DataType.Color',
			},
			{
				name: 'contextId',
				type: 'string',
				description: 'Retrieve auth based on a given context.',
			},
			{
				name: 'dimensions',
				type: 'CardDimensions',
			},
			{
				name: 'disableOverlay',
				type: 'boolean',
			},
			{
				name: 'fallbackMediaNameFetcher',
				type: '(id: string) => Promise<string>',
				description:
					'Optional fallback fetcher to retrieve the media filename from another service.\nWorkaround for #hot-301450 where media service is missing filenames for DC -> Cloud migrated media.\nReceives the file ID and should resolve to the filename string.',
			},
			{
				name: 'featureFlags',
				type: 'MediaFeatureFlags',
			},
			{
				name: 'identifier',
				type: 'FileIdentifier | ExternalImageIdentifier',
				description: 'Instance of file identifier.',
				isRequired: true,
			},
			{
				name: 'includeHashForDuplicateFiles',
				type: 'boolean',
				description: 'Sets options for viewer *',
			},
			{
				name: 'isAIGenerating',
				type: 'boolean',
			},
			{
				name: 'isLazy',
				type: 'boolean',
				description: 'Lazy loads the media file.',
			},
			{
				name: 'mediaClientConfig',
				type: 'MediaClientConfig',
				isRequired: true,
			},
			{
				name: 'mediaSettings',
				type: '{ canUpdateVideoCaptions?: boolean; }',
				description: 'General Media Settings',
			},
			{
				name: 'mediaViewerExtensions',
				type: 'MediaViewerExtensions',
				description: 'Extensions for the media viewer (e.g. comment button in header).',
			},
			{
				name: 'mediaViewerItems',
				type: 'Identifier[]',
				description: 'Media file list to display in Media Viewer.',
			},
			{
				name: 'onClick',
				type: 'CardOnClickCallback',
			},
			{
				name: 'onError',
				type: '(reason: "upload" | "metadata-fetch" | "error-file-state" | "failed-processing" | "remote-preview-fetch" | "remote-preview-not-ready" | "remote-preview-fetch-ssr" | "local-preview-get" | ... 20 more ... | "download") => void',
				description: 'General Error handling include status errors and display errors',
			},
			{
				name: 'onFullscreenChange',
				type: '(fullscreen: boolean) => void',
				description:
					'Callback function to be called when video enters and exit fullscreen.\n`fullscreen = true` indicates video enters fullscreen\n`fullscreen = false` indicates video exits fullscreen',
			},
			{
				name: 'onMouseEnter',
				type: '(result: CardEvent) => void',
			},
			{
				name: 'onPreviewRender',
				type: '(fileId: string) => void',
			},
			{
				name: 'originalDimensions',
				type: 'NumericalCardDimensions',
			},
			{
				name: 'resizeMode',
				type: '"crop" | "fit" | "full-fit" | "stretchy-fit"',
			},
			{
				name: 'selectable',
				type: 'boolean',
			},
			{
				name: 'selected',
				type: 'boolean',
			},
			{
				name: 'shouldEnableDownloadButton',
				type: 'boolean',
				description: 'Enables the download button for media file.',
			},
			{
				name: 'shouldHideTooltip',
				type: 'boolean',
				description: 'Disable tooltip for the card',
			},
			{
				name: 'shouldOpenMediaViewer',
				type: 'boolean',
				description: 'Uses media MediaViewer to preview the media file.',
			},
			{
				name: 'ssr',
				type: '"client" | "server"',
				description: 'Server-Side-Rendering modes are "server" and "client"',
			},
			{
				name: 'ssrFileState',
				type: 'UploadingFileState | ProcessingFileState | ProcessedFileState | ErrorFileState | ProcessingFailedState',
				description:
					"Pre-hydrated SSR metadata from a Relay fragment.\nWhen provided and `fg('platform_media_ssr_data_seed')` is on, the card seeds\n`useFileState` with this data and skips the `items()` API call for files\nwhose `processingStatus` is `succeeded`.\n@see https://product-fabric.atlassian.net/browse/BMPT-7914",
			},
			{
				name: 'titleBoxBgColor',
				type: 'string',
			},
			{
				name: 'titleBoxIcon',
				type: 'string',
			},
			{
				name: 'useInlinePlayer',
				type: 'boolean',
				description: 'Uses the inline player for media file.',
			},
			{
				name: 'videoControlsWrapperRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
			},
			{
				name: 'viewerOptions',
				type: 'ViewerOptionsProps',
			},
		],
	},
	{
		name: 'Browser',
		package: '@atlaskit/media-picker',
		description: 'A component that triggers the native browser file dialog.',
		status: 'general-availability',
		usageGuidelines: ['Use `Browser` to allow users to select files from their computer.'],
		keywords: ['media', 'picker', 'upload', 'browser'],
		category: 'media',
		examples: [
			"import { Component } from 'react';\nimport {\n\tdefaultCollectionName,\n\tdefaultMediaPickerCollectionName,\n\tmediaPickerAuthProvider,\n} from '@atlaskit/media-test-helpers';\nimport Button from '@atlaskit/button/new';\nimport DropdownMenu, { DropdownItem } from '@atlaskit/dropdown-menu';\nimport {\n\tMainWrapper,\n\tUploadPreviews,\n\ttype AuthEnvironment,\n\tPopupHeader,\n\tPopupContainer,\n} from '../example-helpers';\nimport { type UploadParams, type BrowserConfig } from '../src/types';\nimport { Browser } from '../src/';\nimport { type FileState, MediaClient } from '@atlaskit/media-client';\nimport { type MediaClientConfig } from '@atlaskit/media-core';\nexport interface BrowserWrapperState {\n\tcollectionName: string;\n\tauthEnvironment: AuthEnvironment;\n\tmediaClient?: MediaClient;\n\tbrowseConfig?: BrowserConfig;\n}\nclass BrowserWrapper extends Component<{}, BrowserWrapperState> {\n\tdropzoneContainer?: HTMLDivElement;\n\tprivate browseFn: Function = () => {};\n\tstate: BrowserWrapperState = {\n\t\tauthEnvironment: 'client',\n\t\tcollectionName: defaultMediaPickerCollectionName,\n\t};\n\tcomponentDidMount() {\n\t\tconst mediaClientConfig: MediaClientConfig = {\n\t\t\tauthProvider: mediaPickerAuthProvider(),\n\t\t};\n\t\tconst uploadParams: UploadParams = {\n\t\t\tcollection: this.state.collectionName,\n\t\t};\n\t\tconst browseConfig: BrowserConfig = {\n\t\t\tmultiple: true,\n\t\t\tfileExtensions: ['image/jpeg', 'image/png', 'video/mp4'],\n\t\t\tuploadParams,\n\t\t};\n\t\tconst mediaClient = new MediaClient(mediaClientConfig);\n\t\tmediaClient.on('file-added', this.onFileAdded);\n\t\tthis.setState({\n\t\t\tmediaClient,\n\t\t\tbrowseConfig,\n\t\t});\n\t}\n\tonFileAdded = (fileState: FileState) => {\n\t\tconsole.log('onFileAdded', fileState);\n\t};\n\tonOpen = () => {\n\t\tif (this.browseFn) {\n\t\t\tthis.browseFn();\n\t\t}\n\t};\n\tonCollectionChange = (\n\t\te: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>,\n\t) => {\n\t\tif (!(e.currentTarget instanceof HTMLElement)) {\n\t\t\treturn;\n\t\t}\n\t\tconst { innerText: collectionName } = e.currentTarget;\n\t\tconst { browseConfig } = this.state;\n\t\tif (!browseConfig) {\n\t\t\treturn;\n\t\t}\n\t\tconst uploadParams: UploadParams = {\n\t\t\tcollection: collectionName,\n\t\t};\n\t\tthis.setState({\n\t\t\tcollectionName,\n\t\t\tbrowseConfig: {\n\t\t\t\t...browseConfig,\n\t\t\t\tuploadParams,\n\t\t\t},\n\t\t});\n\t};\n\tonAuthTypeChange = (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => {\n\t\tif (!(e.currentTarget instanceof HTMLElement)) {\n\t\t\treturn;\n\t\t}\n\t\tconst { innerText: authEnvironment } = e.currentTarget;\n\t\tthis.setState({ authEnvironment: authEnvironment as AuthEnvironment });\n\t};\n\tonBrowseFn = (browse: () => void) => {\n\t\tthis.browseFn = browse;\n\t};\n\trender() {\n\t\tconst { collectionName, authEnvironment, mediaClient, browseConfig } = this.state;\n\t\tif (!browseConfig || !mediaClient) {\n\t\t\treturn null;\n\t\t}\n\t\treturn (\n\t\t\t<MainWrapper>\n\t\t\t\t<PopupContainer>\n\t\t\t\t\t<PopupHeader>\n\t\t\t\t\t\t<Button appearance=\"primary\" onClick={this.onOpen}>\n\t\t\t\t\t\t\tOpen\n\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t<DropdownMenu trigger={collectionName} shouldRenderToParent>\n\t\t\t\t\t\t\t<DropdownItem onClick={this.onCollectionChange}>\n\t\t\t\t\t\t\t\t{defaultMediaPickerCollectionName}\n\t\t\t\t\t\t\t</DropdownItem>\n\t\t\t\t\t\t\t<DropdownItem onClick={this.onCollectionChange}>{defaultCollectionName}</DropdownItem>\n\t\t\t\t\t\t</DropdownMenu>\n\t\t\t\t\t\t<DropdownMenu trigger={authEnvironment} shouldRenderToParent>\n\t\t\t\t\t\t\t<DropdownItem onClick={this.onAuthTypeChange}>client</DropdownItem>\n\t\t\t\t\t\t\t<DropdownItem onClick={this.onAuthTypeChange}>asap</DropdownItem>\n\t\t\t\t\t\t</DropdownMenu>\n\t\t\t\t\t</PopupHeader>\n\t\t\t\t\t<UploadPreviews>\n\t\t\t\t\t\t{({ onUploadsStart, onError, onPreviewUpdate }) => (\n\t\t\t\t\t\t\t<Browser\n\t\t\t\t\t\t\t\tonBrowseFn={this.onBrowseFn}\n\t\t\t\t\t\t\t\tmediaClientConfig={mediaClient.config}\n\t\t\t\t\t\t\t\tconfig={browseConfig}\n\t\t\t\t\t\t\t\tonUploadsStart={onUploadsStart}\n\t\t\t\t\t\t\t\tonError={onError}\n\t\t\t\t\t\t\t\tonPreviewUpdate={onPreviewUpdate}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t)}\n\t\t\t\t\t</UploadPreviews>\n\t\t\t\t</PopupContainer>\n\t\t\t</MainWrapper>\n\t\t);\n\t}\n}\nexport default (): React.JSX.Element => <BrowserWrapper />;",
		],
		props: [
			{
				name: 'children',
				type: '(browse: () => void) => ReactChild',
			},
			{
				name: 'config',
				type: 'BrowserConfig',
			},
			{
				name: 'featureFlags',
				type: 'MediaFeatureFlags',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				description:
					'when true, the dialog will show when the component is rendered\n(NOTE: without this value, no dialog will appear unless you use the **onBrowserFn** hook)',
			},
			{
				name: 'mediaClientConfig',
				type: 'MediaClientConfig',
				isRequired: true,
			},
			{
				name: 'onBrowseFn',
				type: '(browse: () => void) => void',
				description:
					'This prop will be mainly used for those contexts (like Editor) where there is no react lifecylce and we cannot rerender easily.\nOtherwise, isOpen prop is preferred.',
			},
			{
				name: 'onCancelFn',
				type: '(cancel: (uniqueIdentifier: string) => void) => void',
			},
			{
				name: 'onClose',
				type: '() => void',
			},
			{
				name: 'onEnd',
				type: '(payload: UploadEndEventPayload) => void',
			},
			{
				name: 'onError',
				type: '(payload: UploadErrorEventPayload) => void',
			},
			{
				name: 'onPreviewUpdate',
				type: '(payload: UploadPreviewUpdateEventPayload) => void',
			},
			{
				name: 'onUploadsStart',
				type: '(payload: UploadsStartEventPayload) => void',
			},
		],
	},
	{
		name: 'Dropzone',
		package: '@atlaskit/media-picker',
		description: 'A component that provides a drag-and-drop area for file uploads.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `Dropzone` to allow users to upload files by dragging them onto a specific area.',
		],
		keywords: ['media', 'picker', 'upload', 'dropzone'],
		category: 'media',
		examples: [
			"import { Component } from 'react';\nimport {\n\tdefaultMediaPickerCollectionName,\n\tcreateUploadMediaClientConfig,\n\tcreateStorybookMediaClientConfig,\n\tfakeMediaClient,\n} from '@atlaskit/media-test-helpers';\nimport Button from '@atlaskit/button/new';\nimport Toggle from '@atlaskit/toggle';\nimport Spinner from '@atlaskit/spinner';\nimport { type FileState } from '@atlaskit/media-client';\nimport {\n\tMainWrapper,\n\tUploadPreviews,\n\tDropzoneContainer,\n\tPopupHeader,\n\tPopupContainer,\n\tDropzoneContentWrapper,\n\tDropzoneItemsInfo,\n} from '../example-helpers';\nimport { Dropzone } from '../src';\nimport { type DropzoneConfig, type UploadsStartEventPayload } from '../src/types';\nexport interface DropzoneWrapperState {\n\tisConnectedToUsersCollection: boolean;\n\tisActive: boolean;\n\tisFetchingLastItems: boolean;\n\tlastItems: any[];\n\tdropzoneContainer?: HTMLElement;\n\tfileIds: string[];\n}\nconst mediaClientConfig = createUploadMediaClientConfig();\nconst nonUserMediaClientConfig = createStorybookMediaClientConfig({\n\tauthType: 'asap',\n});\nclass DropzoneWrapper extends Component<{}, DropzoneWrapperState> {\n\tdropzoneContainer?: HTMLDivElement;\n\tstate: DropzoneWrapperState = {\n\t\tisConnectedToUsersCollection: true,\n\t\tisActive: true,\n\t\tisFetchingLastItems: true,\n\t\tlastItems: [],\n\t\tfileIds: [],\n\t};\n\tonUploadsStart = (payload: UploadsStartEventPayload) => {\n\t\tconst fileIds = payload.files.map(({ id }) => id);\n\t\tthis.setState({ fileIds });\n\t};\n\trenderDragZone = () => {\n\t\tconst { isConnectedToUsersCollection, isActive, dropzoneContainer } = this.state;\n\t\tif (!isActive || !dropzoneContainer) {\n\t\t\treturn null;\n\t\t}\n\t\tconst dropzoneMediaClient = isConnectedToUsersCollection\n\t\t\t? fakeMediaClient(mediaClientConfig)\n\t\t\t: fakeMediaClient(nonUserMediaClientConfig);\n\t\tdropzoneMediaClient.on('file-added', this.onFileUploaded);\n\t\tconst config: DropzoneConfig = {\n\t\t\tcontainer: this.state.dropzoneContainer,\n\t\t\tuploadParams: {\n\t\t\t\tcollection: defaultMediaPickerCollectionName,\n\t\t\t},\n\t\t};\n\t\treturn (\n\t\t\t<UploadPreviews>\n\t\t\t\t{({ onUploadsStart, onError, onPreviewUpdate }) => (\n\t\t\t\t\t<Dropzone\n\t\t\t\t\t\tmediaClientConfig={dropzoneMediaClient.config}\n\t\t\t\t\t\tconfig={config}\n\t\t\t\t\t\tonUploadsStart={(payload) => {\n\t\t\t\t\t\t\tthis.onUploadsStart(payload);\n\t\t\t\t\t\t\tonUploadsStart(payload);\n\t\t\t\t\t\t}}\n\t\t\t\t\t\tonError={onError}\n\t\t\t\t\t\tonPreviewUpdate={onPreviewUpdate}\n\t\t\t\t\t/>\n\t\t\t\t)}\n\t\t\t</UploadPreviews>\n\t\t);\n\t};\n\tonFileUploaded = (fileState: FileState) => {\n\t\tconsole.log('onFileUploaded', fileState);\n\t};\n\tsaveDropzoneContainer = async (element: HTMLDivElement) => {\n\t\tthis.setState({ dropzoneContainer: element });\n\t};\n\tonConnectionChange = () => {\n\t\tconst isConnectedToUsersCollection = !this.state.isConnectedToUsersCollection;\n\t\tthis.setState({ isConnectedToUsersCollection });\n\t};\n\tonActiveChange = () => {\n\t\tconst { isActive } = this.state;\n\t\tthis.setState({ isActive: !isActive });\n\t};\n\trenderLastItems = () => {\n\t\tconst { isFetchingLastItems, lastItems } = this.state;\n\t\tif (isFetchingLastItems) {\n\t\t\treturn <Spinner size=\"large\" />;\n\t\t}\n\t\treturn lastItems.map((item, key) => {\n\t\t\tconst { id, details } = item;\n\t\t\t// details are not always present in the response\n\t\t\tconst name = details ? details.name : '<no-details>';\n\t\t\tconst mediaType = details ? details.mediaType : '<no-details>';\n\t\t\treturn (\n\t\t\t\t<div key={key}>\n\t\t\t\t\t{id} | {name} |{mediaType}\n\t\t\t\t</div>\n\t\t\t);\n\t\t});\n\t};\n\trender() {\n\t\tconst { isConnectedToUsersCollection, isActive } = this.state;\n\t\treturn (\n\t\t\t<MainWrapper>\n\t\t\t\t<PopupContainer>\n\t\t\t\t\t<PopupHeader>\n\t\t\t\t\t\t<Button appearance=\"danger\">Cancel uploads</Button>\n\t\t\t\t\t\tConnected to users collection\n\t\t\t\t\t\t<Toggle\n\t\t\t\t\t\t\tdefaultChecked={isConnectedToUsersCollection}\n\t\t\t\t\t\t\tonChange={this.onConnectionChange}\n\t\t\t\t\t\t/>\n\t\t\t\t\t\tActive\n\t\t\t\t\t\t<Toggle defaultChecked={isActive} onChange={this.onActiveChange} />\n\t\t\t\t\t</PopupHeader>\n\t\t\t\t\t<DropzoneContentWrapper>\n\t\t\t\t\t\t<DropzoneContainer isActive={isActive} ref={this.saveDropzoneContainer} />\n\t\t\t\t\t\t<DropzoneItemsInfo>\n\t\t\t\t\t\t\t{this.renderDragZone()}\n\t\t\t\t\t\t\t<h1>User collection items</h1>\n\t\t\t\t\t\t\t{this.renderLastItems()}\n\t\t\t\t\t\t</DropzoneItemsInfo>\n\t\t\t\t\t</DropzoneContentWrapper>\n\t\t\t\t</PopupContainer>\n\t\t\t</MainWrapper>\n\t\t);\n\t}\n}\nexport default (): React.JSX.Element => <DropzoneWrapper />;",
		],
		props: [
			{
				name: 'config',
				type: 'LocalUploadConfig & DropzoneConfig',
				description: '',
				isRequired: true,
			},
			{
				name: 'featureFlags',
				type: 'MediaFeatureFlags',
			},
			{
				name: 'mediaClientConfig',
				type: 'MediaClientConfig',
				isRequired: true,
			},
			{
				name: 'onCancelFn',
				type: '(cancel: (uniqueIdentifier: string) => void) => void',
			},
			{
				name: 'onDragEnter',
				type: '(payload: DropzoneDragEnterEventPayload) => void',
			},
			{
				name: 'onDragLeave',
				type: '(payload: DropzoneDragLeaveEventPayload) => void',
			},
			{
				name: 'onDrop',
				type: '() => void',
			},
			{
				name: 'onEnd',
				type: '(payload: UploadEndEventPayload) => void',
			},
			{
				name: 'onError',
				type: '(payload: UploadErrorEventPayload) => void',
			},
			{
				name: 'onPreviewUpdate',
				type: '(payload: UploadPreviewUpdateEventPayload) => void',
			},
			{
				name: 'onUploadsStart',
				type: '(payload: UploadsStartEventPayload) => void',
			},
		],
	},
	{
		name: 'Mention',
		package: '@atlaskit/mention',
		description: 'A component for displaying a single mention.',
		status: 'general-availability',
		usageGuidelines: ['Use `Mention` to render a mention for a user or team.'],
		keywords: ['mention', 'user', 'team'],
		category: 'elements',
		examples: [
			"import type UIAnalyticsEvent from '@atlaskit/analytics-next/UIAnalyticsEvent';\nimport AnalyticsListener from '@atlaskit/analytics-next/AnalyticsListener';\nimport { onMentionEvent } from '../example-helpers/index';\nimport Mention from '../src/components/Mention';\nimport { ELEMENTS_CHANNEL } from '../src/_constants';\nimport debug from '../src/util/logger';\nimport { mockMentionData as mentionData } from '../src/__tests__/unit/_test-helpers';\nimport {\n\tMENTION_ID_HIGHLIGHTED,\n\tMENTION_ID_WITH_CONTAINER_ACCESS,\n\tMENTION_ID_WITH_NO_ACCESS,\n} from '../src/__tests__/unit/_test-constants';\nimport { IntlProvider } from 'react-intl';\nconst padding = { padding: '10px' };\nconst listenerHandler = (e: UIAnalyticsEvent) => {\n\tdebug('Analytics Next handler - payload:', e.payload, ' context: ', e.context);\n};\nconst handler = (_mentionId: string, text: string, event?: any, analytics?: any) => {\n\tdebug('Old Analytics handler: ', text, ' ', event, ' - analytics: ', analytics);\n};\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<div >\n\t\t\t\t{\n\t\t\t\t<div style={padding}>\n\t\t\t\t\t<AnalyticsListener onEvent={listenerHandler} channel={ELEMENTS_CHANNEL}>\n\t\t\t\t\t\t<Mention\n\t\t\t\t\t\t\t{...mentionData}\n\t\t\t\t\t\t\tid={MENTION_ID_WITH_CONTAINER_ACCESS}\n\t\t\t\t\t\t\taccessLevel={'CONTAINER'}\n\t\t\t\t\t\t\tonClick={handler}\n\t\t\t\t\t\t\tonMouseEnter={onMentionEvent}\n\t\t\t\t\t\t\tonMouseLeave={onMentionEvent}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</AnalyticsListener>\n\t\t\t\t</div>\n\t\t\t\t{\n\t\t\t\t<div style={padding}>\n\t\t\t\t\t<Mention\n\t\t\t\t\t\t{...mentionData}\n\t\t\t\t\t\tid={MENTION_ID_HIGHLIGHTED}\n\t\t\t\t\t\tisHighlighted={true}\n\t\t\t\t\t\tonClick={onMentionEvent}\n\t\t\t\t\t\tonMouseEnter={onMentionEvent}\n\t\t\t\t\t\tonMouseLeave={onMentionEvent}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t{\n\t\t\t\t<div style={padding}>\n\t\t\t\t\t<Mention\n\t\t\t\t\t\t{...mentionData}\n\t\t\t\t\t\tid={MENTION_ID_WITH_NO_ACCESS}\n\t\t\t\t\t\taccessLevel={'NONE'}\n\t\t\t\t\t\tonClick={onMentionEvent}\n\t\t\t\t\t\tonMouseEnter={onMentionEvent}\n\t\t\t\t\t\tonMouseLeave={onMentionEvent}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t{\n\t\t\t\t<div style={padding}>\n\t\t\t\t\t<Mention\n\t\t\t\t\t\t{...mentionData}\n\t\t\t\t\t\ttext=\"\"\n\t\t\t\t\t\tonClick={onMentionEvent}\n\t\t\t\t\t\tonMouseEnter={onMentionEvent}\n\t\t\t\t\t\tonMouseLeave={onMentionEvent}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t{/* Disabled variant (with tooltip). The chip is automatically kept tab-focusable\n\t\t\t\t    and gets aria-disabled + aria-label by the component itself. */}\n\t\t\t\t{\n\t\t\t\t<div style={padding}>\n\t\t\t\t\t<Mention\n\t\t\t\t\t\t{...mentionData}\n\t\t\t\t\t\tisDisabled\n\t\t\t\t\t\tdisabledTooltip=\"Only one agent can be active at a time\"\n\t\t\t\t\t\tonClick={onMentionEvent}\n\t\t\t\t\t\tonMouseEnter={onMentionEvent}\n\t\t\t\t\t\tonMouseLeave={onMentionEvent}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t{/* Disabled variant without a tooltip — chip is still in the DISABLED visual state\n\t\t\t\t    but has no on-hover affordance. */}\n\t\t\t\t{\n\t\t\t\t<div style={padding}>\n\t\t\t\t\t<Mention\n\t\t\t\t\t\t{...mentionData}\n\t\t\t\t\t\tisDisabled\n\t\t\t\t\t\tonClick={onMentionEvent}\n\t\t\t\t\t\tonMouseEnter={onMentionEvent}\n\t\t\t\t\t\tonMouseLeave={onMentionEvent}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t</IntlProvider>\n\t);\n}",
		],
		props: [
			{
				name: 'accessLevel',
				type: 'string',
			},
			{
				name: 'disabledTooltip',
				type: 'string',
				description:
					'Tooltip text shown on hover when the chip is disabled. Ignored when\n`isDisabled` is false. When omitted, no tooltip is rendered even if\n`isDisabled` is true.',
			},
			{
				name: 'id',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'When true, the mention chip is rendered in its disabled visual state\n(`MentionType.DISABLED`) and click handlers are not invoked. Takes\nprecedence over `isHighlighted` and the restricted state.',
			},
			{
				name: 'isHighlighted',
				type: 'boolean',
			},
			{
				name: 'localId',
				type: 'string',
			},
			{
				name: 'onClick',
				type: '(mentionId: string, text: string, event?: SyntheticEvent<HTMLSpanElement, Event>) => void',
			},
			{
				name: 'onHover',
				type: '() => void',
			},
			{
				name: 'onMouseEnter',
				type: '(mentionId: string, text: string, event?: SyntheticEvent<HTMLSpanElement, Event>) => void',
			},
			{
				name: 'onMouseLeave',
				type: '(mentionId: string, text: string, event?: SyntheticEvent<HTMLSpanElement, Event>) => void',
			},
			{
				name: 'ssrPlaceholderId',
				type: 'string',
			},
			{
				name: 'text',
				type: 'string',
				isRequired: true,
			},
		],
	},
	{
		name: 'MentionPicker',
		package: '@atlaskit/mention',
		description: 'A component that provides a searchable picker for mentions.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `MentionPicker` to allow users to select a user or team to mention.',
			'Requires a `MentionResource` to fetch and manage mention data.',
		],
		keywords: ['mention', 'picker', 'select'],
		category: 'elements',
		examples: [
			"import MentionTextInput from '../example-helpers/demo-mention-text-input';\nimport { onSelection, resourceProvider, MockPresenceResource } from '../example-helpers';\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<MentionTextInput\n\t\t\tlabel=\"User search\"\n\t\t\tonSelection={onSelection}\n\t\t\tresourceProvider={resourceProvider}\n\t\t\tpresenceProvider={new MockPresenceResource()}\n\t\t/>\n\t);\n}",
		],
		props: [
			{
				name: 'forwardedRef',
				type: '((instance: any) => void) | RefObject<any>',
			},
			{
				name: 'offsetX',
				type: 'number',
			},
			{
				name: 'offsetY',
				type: 'number',
			},
			{
				name: 'onClose',
				type: 'OnClose',
			},
			{
				name: 'onOpen',
				type: 'OnOpen',
			},
			{
				name: 'onSelection',
				type: 'OnMentionEvent',
			},
			{
				name: 'position',
				type: '"above" | "below" | "auto"',
			},
			{
				name: 'presenceProvider',
				type: 'PresenceProvider',
			},
			{
				name: 'query',
				type: 'string',
			},
			{
				name: 'resourceProvider',
				type: 'MentionProvider',
				isRequired: true,
			},
			{
				name: 'target',
				type: 'string',
			},
			{
				name: 'zIndex',
				type: 'string | number',
			},
		],
	},
	{
		name: 'TopNav',
		package: '@atlaskit/navigation-system',
		description: 'The horizontal top navigation bar component.',
		status: 'general-availability',
		usageGuidelines: [
			'Render `TopNav` within the `Root` component to provide global navigation and actions.',
		],
		keywords: ['navigation', 'top-nav', 'header'],
		category: 'navigation',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from '@compiled/react';\nimport AKBadge from '@atlaskit/badge';\nimport { cssMap } from '@atlaskit/css';\nimport AtlassianIntelligenceIcon from '@atlaskit/icon/core/atlassian-intelligence';\nimport SearchIcon from '@atlaskit/icon/core/search';\nimport { ConfluenceIcon } from '@atlaskit/logo';\nimport { Root } from '@atlaskit/navigation-system/layout/root';\nimport { SideNavToggleButton } from '@atlaskit/navigation-system/layout/side-nav';\nimport {\n\tTopNav,\n\tTopNavEnd,\n\tTopNavMiddle,\n\tTopNavStart,\n} from '@atlaskit/navigation-system/layout/top-nav';\nimport {\n\tAppLogo,\n\tAppSwitcher,\n\tChatButton,\n\tCreateButton,\n\tEndItem,\n\tHelp,\n\tProfile,\n\tSearch,\n\tSettings,\n} from '@atlaskit/navigation-system/top-nav-items';\nimport { Notifications } from '@atlaskit/navigation-system/top-nav-items/notifications';\nimport { Flex } from '@atlaskit/primitives/compiled';\nimport { token } from '@atlaskit/tokens';\nimport { WithResponsiveViewport } from './utils/example-utils';\nimport { MockSearch } from './utils/mock-search';\nconst iconSpacingStyles = cssMap({\n\tspace050: {\n\t\tpaddingBlock: token('space.050'),\n\t\tpaddingInline: token('space.050'),\n\t},\n});\nconst Badge = () => <AKBadge appearance=\"important\">{5}</AKBadge>;\nexport const TopNavigationExample: () => JSX.Element = () => (\n\t<WithResponsiveViewport>\n\t\t{/**\n\t\t * Wrapping in `Root to ensure the TopNav height is set correctly, as it would in a proper composed usage.\n\t\t * Root sets the top bar height CSS variable that TopNav uses to set its height\n\t\t */}\n\t\t<Root>\n\t\t\t<TopNav>\n\t\t\t\t<TopNavStart\n\t\t\t\t\tsideNavToggleButton={\n\t\t\t\t\t\t<SideNavToggleButton collapseLabel=\"Collapse sidebar\" expandLabel=\"Expand sidebar\" />\n\t\t\t\t\t}\n\t\t\t\t>\n\t\t\t\t\t<AppSwitcher label=\"App switcher\" onClick={() => alert('app switcher')} />\n\t\t\t\t\t<AppLogo\n\t\t\t\t\t\thref=\"http://www.atlassian.design\"\n\t\t\t\t\t\ticon={ConfluenceIcon}\n\t\t\t\t\t\tname=\"Confluence\"\n\t\t\t\t\t\tlabel=\"Home page\"\n\t\t\t\t\t/>\n\t\t\t\t</TopNavStart>\n\t\t\t\t<TopNavMiddle>\n\t\t\t\t\t<Search onClick={() => alert('mobile search')} label=\"Search\" />\n\t\t\t\t\t<CreateButton onClick={() => alert('create')}>Create</CreateButton>\n\t\t\t\t</TopNavMiddle>\n\t\t\t\t<TopNavEnd>\n\t\t\t\t\t<ChatButton onClick={() => alert('chat')}>Chat</ChatButton>\n\t\t\t\t\t<EndItem\n\t\t\t\t\t\ticon={AtlassianIntelligenceIcon}\n\t\t\t\t\t\tonClick={() => alert('inshelligence')}\n\t\t\t\t\t\tlabel=\"Atlassian Intelligence\"\n\t\t\t\t\t/>\n\t\t\t\t\t<Help onClick={() => alert('help')} label=\"Help\" />\n\t\t\t\t\t<Notifications\n\t\t\t\t\t\tbadge={Badge}\n\t\t\t\t\t\tonClick={() => alert('notifications')}\n\t\t\t\t\t\tlabel=\"Notifications\"\n\t\t\t\t\t/>\n\t\t\t\t\t<Settings onClick={() => alert('settings')} label=\"Settings\" />\n\t\t\t\t\t<Profile onClick={() => alert('User settings')} label=\"Your profile\" />\n\t\t\t\t</TopNavEnd>\n\t\t\t</TopNav>\n\t\t</Root>\n\t</WithResponsiveViewport>\n);\nexport const SearchRightElem: () => JSX.Element = () => (\n\t<WithResponsiveViewport>\n\t\t<Root>\n\t\t\t<TopNav>\n\t\t\t\t<TopNavStart sideNavToggleButton={null}>\n\t\t\t\t\t<AppSwitcher label=\"App switcher\" onClick={() => alert('app switcher')} />\n\t\t\t\t</TopNavStart>\n\t\t\t\t<TopNavMiddle>\n\t\t\t\t\t<Search\n\t\t\t\t\t\ticonBefore={AtlassianIntelligenceIcon}\n\t\t\t\t\t\telemAfter={\n\t\t\t\t\t\t\t<Flex xcss={iconSpacingStyles.space050}>\n\t\t\t\t\t\t\t\t<SearchIcon color={token('color.icon')} label=\"\" />\n\t\t\t\t\t\t\t</Flex>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tonClick={() => alert('mobile search')}\n\t\t\t\t\t\tlabel=\"Search\"\n\t\t\t\t\t/>\n\t\t\t\t\t<CreateButton onClick={() => alert('create')}>Create</CreateButton>\n\t\t\t\t</TopNavMiddle>\n\t\t\t\t<TopNavEnd>\n\t\t\t\t\t<Settings onClick={() => alert('settings')} label=\"Settings\" />\n\t\t\t\t</TopNavEnd>\n\t\t\t</TopNav>\n\t\t</Root>\n\t</WithResponsiveViewport>\n);\nexport const TopNavigationEnlargedSearchInput: () => JSX.Element = () => (\n\t<WithResponsiveViewport>\n\t\t<Root>\n\t\t\t<TopNav>\n\t\t\t\t<TopNavStart sideNavToggleButton={null}>\n\t\t\t\t\t<AppSwitcher label=\"App switcher\" onClick={() => alert('app switcher')} />\n\t\t\t\t</TopNavStart>\n\t\t\t\t<div>\n\t\t\t\t\t<TopNavMiddle>\n\t\t\t\t\t\t<MockSearch isEnlarged />\n\t\t\t\t\t\t<CreateButton onClick={() => alert('create')}>Create</CreateButton>\n\t\t\t\t\t</TopNavMiddle>\n\t\t\t\t</div>\n\t\t\t\t<TopNavEnd>\n\t\t\t\t\t<Settings onClick={() => alert('settings')} label=\"Settings\" />\n\t\t\t\t</TopNavEnd>\n\t\t\t</TopNav>\n\t\t</Root>\n\t</WithResponsiveViewport>\n);\nexport default TopNavigationExample;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'The content of the layout area.\nShould include `TopNavStart`, `TopNavMiddle`, and `TopNavEnd`.',
				isRequired: true,
			},
			{
				name: 'customTheme',
				type: '{ backgroundColor: string | RGB; highlightColor: string | RGB; }',
				description:
					'Custom theme for the top navigation. This is a port of Nav 3 functionality, and not recommended for new usage,\nas it does not align with our future vision.',
			},
			{
				name: 'height',
				type: 'number',
				description:
					'Not intended for long term use. This is added to support the migration to the new page layout.\nWe may replace this prop in a future release.',
			},
			{
				name: 'id',
				type: 'string',
				description:
					"The `id` attribute of the slot. Used to connect the layout slot's skip link to the layout element.\nIf not provided, a unique ID will be generated.",
			},
			{
				name: 'skipLinkLabel',
				type: 'string',
				description: "The label for this slot's skip link. Defaults to the slot's `label` value.",
			},
			{
				name: 'xcss',
				type: 'false | (XCSSValue<"backgroundColor", DesignTokenStyles, ""> & {} & XCSSPseudo<"backgroundColor", never, never, DesignTokenStyles> & XCSSMediaQuery<...> & { ...; } & { ...; })',
				description: 'Bounded style overrides.',
			},
		],
	},
	{
		name: 'ProfileCard',
		package: '@atlaskit/profilecard',
		description: 'A component for displaying user information in a card.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `ProfileCard` to show user details like name, avatar, and contact info.',
		],
		keywords: ['profile', 'user', 'card'],
		category: 'people-and-teams',
		examples: [
			"import { ProfileCard } from '../src';\nimport { profiles } from '../src/mocks';\nimport { reportingLinesData } from '../src/mocks/reporting-lines-data';\nimport ExampleWrapper from './helper/example-wrapper';\nimport { MainStage } from './helper/main-stage';\nconst avatarImage = profiles[4].User.avatarUrl;\nexport default function Example(): React.JSX.Element {\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t<MainStage>\n\t\t\t\t<ProfileCard\n\t\t\t\t\tavatarUrl={avatarImage}\n\t\t\t\t\tfullName=\"Rosalyn Franklin\"\n\t\t\t\t\tmeta=\"Manager\"\n\t\t\t\t\tnickname=\"rfranklin\"\n\t\t\t\t\temail=\"rfranklin@acme.com\"\n\t\t\t\t\ttimestring=\"18:45\"\n\t\t\t\t\tlocation=\"Somewhere, World\"\n\t\t\t\t\tactions={[\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t},\n\t\t\t\t\t]}\n\t\t\t\t\treportingLines={reportingLinesData}\n\t\t\t\t\treportingLinesProfileUrl=\"/\"\n\t\t\t\t\tonReportingLinesClick={(user) => {\n\t\t\t\t\t\tconsole.log('Clicked on ' + user.pii?.name);\n\t\t\t\t\t}}\n\t\t\t\t/>\n\t\t\t</MainStage>\n\t\t</ExampleWrapper>\n\t);\n}",
		],
		props: [
			{
				name: 'accountType',
				type: 'string',
			},
			{
				name: 'actions',
				type: 'ProfileCardAction[]',
			},
			{
				name: 'addFlag',
				type: '(flag: any) => void',
			},
			{
				name: 'agentActions',
				type: 'AgentActionsType',
			},
			{
				name: 'avatarUrl',
				type: 'string',
			},
			{
				name: 'clientFetchProfile',
				type: '() => void',
			},
			{
				name: 'cloudId',
				type: 'string',
			},
			{
				name: 'companyName',
				type: 'string',
			},
			{
				name: 'customLozenges',
				type: 'LozengeProps[]',
			},
			{
				name: 'disabledAccountMessage',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'disabledAriaAttributes',
				type: 'boolean',
			},
			{
				name: 'email',
				type: 'string',
			},
			{
				name: 'errorType',
				type: '{ reason: "default" | "NotFound"; }',
			},
			{
				name: 'fireEvent',
				type: '<K extends keyof AnalyticsEventAttributes>(params_0: K, ...params_1: OptionalIfUndefined<AnalyticsEventAttributes[K]>) => void',
			},
			{
				name: 'fullName',
				type: 'string',
			},
			{
				name: 'hasDisabledAccountLozenge',
				type: 'boolean',
			},
			{
				name: 'hasError',
				type: 'boolean',
			},
			{
				name: 'hideAgentConversationStarters',
				type: 'boolean',
				description: 'When true (and feature-gated), hide the agent conversation starters section',
			},
			{
				name: 'isBot',
				type: 'boolean',
			},
			{
				name: 'isCurrentUser',
				type: 'boolean',
			},
			{
				name: 'isKudosEnabled',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				type: 'boolean',
			},
			{
				name: 'isRenderedInPortal',
				type: 'boolean',
				description:
					"Indicates whether the profile card is rendered in a portal.\n\nIf true, the profile card will auto-focus the name element when opened for better accessibility,\nkeeping the user's focus in the tab trap.",
			},
			{
				name: 'isServiceAccount',
				type: 'boolean',
			},
			{
				name: 'isTriggeredUsingKeyboard',
				type: 'boolean',
			},
			{
				name: 'location',
				type: 'string',
			},
			{
				name: 'meta',
				type: 'string',
			},
			{
				name: 'nickname',
				type: 'string',
			},
			{
				name: 'onReportingLinesClick',
				type: '(user: ReportingLinesUser) => false | void',
				description:
					"Click handler when user clicks on manager's and direct reports' user avatar, un-clickable otherwise.\nReturning false will prevent the default behavior of opening the reporting lines page.",
			},
			{
				name: 'openKudosDrawer',
				type: '() => void',
			},
			{
				name: 'reportingLines',
				type: 'TeamCentralReportingLinesData',
				description: 'Show manager and direct reports section on profile hover card, if available',
			},
			{
				name: 'reportingLinesProfileUrl',
				type: 'string',
				description:
					"Base URL to populate href value for manager's and direct reports' user avatar",
			},
			{
				name: 'status',
				type: '"active" | "inactive" | "closed"',
			},
			{
				name: 'statusModifiedDate',
				type: 'number',
			},
			{
				name: 'teamCentralBaseUrl',
				type: 'string',
			},
			{
				name: 'timestring',
				type: 'string',
			},
			{
				name: 'userId',
				type: 'string',
			},
			{
				name: 'withoutElevation',
				type: 'boolean',
			},
		],
	},
	{
		name: 'ProfileCardTrigger',
		package: '@atlaskit/profilecard',
		description: 'A component that triggers a profile card on hover or click.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `ProfileCardTrigger` to wrap an element (like an avatar) that should show a profile card.',
		],
		keywords: ['profile', 'trigger', 'hover'],
		category: 'people-and-teams',
		examples: [
			"import React, { useState } from 'react';\n// Simulating import from '@atlaskit/profilecard/user'\nimport ProfileCardTrigger from '../src/components/User';\nimport { BlankSpace } from './helper/blank-space';\nimport ExampleWrapper from './helper/example-wrapper';\nimport { MainStage } from './helper/main-stage';\nimport { Section } from './helper/section';\nimport { getMockProfileClient } from './helper/util';\nconst mockClient = getMockProfileClient(10, 0);\nconst mockClientForInactiveAccount = getMockProfileClient(10, 0, {\n\tstatus: 'inactive',\n});\nconst mockClientForClosedAccountAndCustomMessage = getMockProfileClient(10, 0, {\n\tstatus: 'closed',\n\tdisabledAccountMessage:\n\t\t'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo.',\n\thasDisabledAccountLozenge: false,\n});\nconst defaultProps = {\n\tcloudId: 'DUMMY-10ae0bf3-157e-43f7-be45-f1bb13b39048',\n\tresourceClient: mockClient,\n};\nexport default function Example(): React.JSX.Element {\n\tconst [clickCount, setCount] = useState(0);\n\tconst [externalPropExampleIsVisible, setExternalPropExampleIsVisible] = useState(false);\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t<MainStage>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Profilecard triggered by hover</h4>\n\t\t\t\t\t<p>\n\t\t\t\t\t\tInput for testing with focus <input type=\"text\" />\n\t\t\t\t\t</p>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>hover over me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Profilecard triggered by click</h4>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Profilecard triggered by external prop</h4>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t\tisVisible={externalPropExampleIsVisible}\n\t\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t\t<button\n\t\t\t\t\t\t\ttype=\"button\"\n\t\t\t\t\t\t\tonClick={() => setExternalPropExampleIsVisible(!externalPropExampleIsVisible)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tToggle external prop\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Profilecard triggered for closed account</h4>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\tresourceClient={getMockProfileClient(10, 0, {\n\t\t\t\t\t\t\t\tstatus: 'closed',\n\t\t\t\t\t\t\t})}\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Profilecard triggered for inactive account</h4>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\tresourceClient={mockClientForInactiveAccount}\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Profilecard triggered for customer account</h4>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"3\"\n\t\t\t\t\t\t\tresourceClient={getMockProfileClient(10, 0, {\n\t\t\t\t\t\t\t\taccountType: 'customer',\n\t\t\t\t\t\t\t})}\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t\t\tshouldRender: (data: any) => data && data.accountType !== 'customer',\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Counting clicks of parent container</h4>\n\t\t\t\t\t{/**\n\t\t\t\t\t * If the user clicks on the trigger then we don't want that click\n\t\t\t\t\t * event to propagate out to parent containers. For example when\n\t\t\t\t\t * clicking a mention lozenge in an inline-edit.\n\t\t\t\t\t *\n\t\t\t\t\t * This example has the parent span counting how many times it was\n\t\t\t\t\t * clicked so we can easily verify that it's not triggered when\n\t\t\t\t\t * clicking the profile card trigger.\n\t\t\t\t\t */}\n\t\t\t\t\t<span\n\t\t\t\t\t\trole=\"presentation\"\n\t\t\t\t\t\ttabIndex={-1}\n\t\t\t\t\t\tonClick={() => setCount((c) => c + 1)}\n\t\t\t\t\t\tonKeyDown={() => setCount((c) => c + 1)}\n\t\t\t\t\t>\n\t\t\t\t\t\tLorem ipsum. Parent clicked {clickCount} times!{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\tresourceClient={mockClientForClosedAccountAndCustomMessage}\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>\n\t\t\t\t\t\tProfilecard triggered for closed account and custom message and not show status lozenge\n\t\t\t\t\t</h4>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\tresourceClient={mockClientForClosedAccountAndCustomMessage}\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<Section>\n\t\t\t\t\t<h4>Profilecard trigger hidden from screen readers</h4>\n\t\t\t\t\t<span>\n\t\t\t\t\t\tLorem ipsum{' '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\tariaHideProfileTrigger\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>hover over me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>\n\t\t\t\t\t\t{' or '}\n\t\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\t\tuserId=\"3\"\n\t\t\t\t\t\t\tresourceClient={getMockProfileClient(10, 0, {\n\t\t\t\t\t\t\t\taccountType: 'customer',\n\t\t\t\t\t\t\t})}\n\t\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t\t\tshouldRender: (data: any) => data && data.accountType !== 'customer',\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t\tariaHideProfileTrigger\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<strong>click me</strong>\n\t\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t\tdolor sit amet\n\t\t\t\t\t</span>\n\t\t\t\t</Section>\n\t\t\t\t<BlankSpace>Scroll down to test focus behaviour</BlankSpace>\n\t\t\t\t<Section>\n\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t]}\n\t\t\t\t\t>\n\t\t\t\t\t\t<strong>Hover me.</strong>\n\t\t\t\t\t</ProfileCardTrigger>{' '}\n\t\t\t\t\t|||{' '}\n\t\t\t\t\t<ProfileCardTrigger\n\t\t\t\t\t\t{...defaultProps}\n\t\t\t\t\t\tuserId=\"1\"\n\t\t\t\t\t\ttrigger=\"click\"\n\t\t\t\t\t\tactions={[\n\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\tlabel: 'View profile',\n\t\t\t\t\t\t\t\tid: 'view-profile',\n\t\t\t\t\t\t\t\tcallback: () => {},\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t]}\n\t\t\t\t\t>\n\t\t\t\t\t\t<strong>Click me.</strong>\n\t\t\t\t\t</ProfileCardTrigger>\n\t\t\t\t</Section>\n\t\t\t</MainStage>\n\t\t</ExampleWrapper>\n\t);\n}",
		],
		props: [
			{
				name: 'actions',
				type: 'ProfileCardAction[]',
				defaultValue: '[]',
			},
			{
				name: 'addFlag',
				type: '(flag: any) => void',
			},
			{
				name: 'agentActions',
				type: 'AgentActionsType',
			},
			{
				name: 'ariaHideProfileTrigger',
				type: 'boolean',
				defaultValue: 'false',
			},
			{
				name: 'ariaLabel',
				type: 'string',
			},
			{
				name: 'ariaLabelledBy',
				type: 'string',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				isRequired: true,
			},
			{
				name: 'cloudId',
				type: 'string',
				description:
					"A cloudId can be provided, and we'll verify that the target userId is an\n\tactual user in the specified site.\n\n\tInstead you can omit the cloudId and we won't do such a check.\n\n\tIf you have a cloudId and only want to show users who are in that site\n\tthen please provide it. If you're a site-less product or don't care about\n\tverifying that the shown user is in a particular site, don't provide a\n\tcloudId.",
			},
			{
				name: 'disabledAriaAttributes',
				type: 'boolean',
			},
			{
				name: 'hideAgentConversationStarters',
				type: 'boolean',
				description:
					'Hide the conversation starters. Defaults to false (conversation starters are shown by default).',
			},
			{
				name: 'hideAgentMoreActions',
				type: 'boolean',
			},
			{
				name: 'hideAiDisclaimer',
				type: 'boolean',
			},
			{
				name: 'hideDelay',
				type: 'number',
				description:
					'The delay in milliseconds before the profile card is hidden.\nPS: This is ignored when the isVisible is false or the trigger is clicked.',
			},
			{
				name: 'isRenderedInPortal',
				type: 'boolean',
				description:
					"Indicates whether the profile card is rendered in a portal.\n\nIf true, the profile card will auto-focus the name element when opened for better accessibility,\nkeeping the user's focus in the tab trap.",
			},
			{
				name: 'isVisible',
				type: 'boolean',
			},
			{
				name: 'offset',
				type: '[number, number]',
			},
			{
				name: 'onReportingLinesClick',
				type: '(user: ReportingLinesUser) => void',
			},
			{
				name: 'onVisibilityChange',
				type: '(isVisible: boolean) => void',
			},
			{
				name: 'position',
				type: '"bottom-start" | "auto" | "auto-start" | "auto-end" | "bottom" | "bottom-end" | "left-start" | "left" | "left-end" | "top-end" | "top" | "top-start" | "right-end" | "right" | "right-start"',
				defaultValue: '"bottom-start"',
			},
			{
				name: 'prepopulatedData',
				type: 'PrepopulatedData',
			},
			{
				name: 'product',
				type: 'string',
			},
			{
				name: 'reportingLinesProfileUrl',
				type: 'string',
			},
			{
				name: 'resourceClient',
				type: 'ProfileClient',
				isRequired: true,
			},
			{
				name: 'showDelay',
				type: 'number',
				description:
					'The delay in milliseconds before the profile card is shown.\nPS: This is ignored when the isVisible is true or the trigger is clicked.',
			},
			{
				name: 'ssrPlaceholderId',
				type: 'string',
			},
			{
				name: 'trigger',
				type: '"hover" | "click"',
				defaultValue: '"hover"',
			},
			{
				name: 'userId',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'viewingUserId',
				type: 'string',
			},
		],
	},
	{
		name: 'ConnectedReactionPicker',
		package: '@atlaskit/reactions',
		description: 'A reaction picker component pre-wired with a reactions store.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `ConnectedReactionPicker` to allow users to add reactions to content.',
			'Requires a `ReactionsStore` to manage reaction state.',
		],
		keywords: ['reactions', 'picker', 'emoji'],
		category: 'elements',
		examples: [
			"import { type EmojiProvider } from '@atlaskit/emoji/resource';\nimport { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';\nimport { ConnectedReactionPicker, ConnectedReactionsView, type StorePropInput } from '../src';\nimport { ExampleWrapper, Example, Constants } from './utils';\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t{(store: StorePropInput) => (\n\t\t\t\t<>\n\t\t\t\t\t<p>\n\t\t\t\t\t\t<strong>Memory store and Connected Picker view (same store)</strong>\n\t\t\t\t\t</p>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={'Regular picker view'}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionPicker\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${Constants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${Constants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'Use picker to add reaction, it will update reactions in a separate ConnectedReactionsView component below.'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${Constants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${Constants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t</>\n\t\t\t)}\n\t\t</ExampleWrapper>\n\t);\n};",
		],
		props: [
			{
				name: 'allowAllEmojis',
				type: 'boolean',
				description:
					'Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)',
			},
			{
				name: 'ari',
				type: 'string',
				description: 'Individual id for a reaction',
				isRequired: true,
			},
			{
				name: 'containerAri',
				type: 'string',
				description: 'Wrapper id for reactions list',
				isRequired: true,
			},
			{
				name: 'disabled',
				type: 'boolean',
				description: 'Enable/Disable the button to be clickable (defaults to false)',
			},
			{
				name: 'emojiPickerSize',
				type: '"small" | "medium" | "large"',
				description: 'Optional emoji picker size to control the size of emoji picker',
			},
			{
				name: 'emojiProvider',
				type: 'Promise<EmojiProvider>',
				description: 'Provider for loading emojis',
				isRequired: true,
			},
			{
				name: 'hoverableReactionPicker',
				type: 'boolean',
				description: 'Optional prop for hoverable reaction picker',
			},
			{
				name: 'hoverableReactionPickerDelay',
				type: 'number',
				description:
					'Optional prop to set a delay for the reaction picker when it opens/closes on hover',
			},
			{
				name: 'isListItem',
				type: 'boolean',
				description: 'Optional prop to say if the reactions component is in a list',
			},
			{
				name: 'miniMode',
				type: 'boolean',
				description: 'apply "miniMode" className to the button',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description: 'Optional event handler when the emoji picker is clicked outside and closed',
			},
			{
				name: 'onOpen',
				type: '() => void',
				description: 'Optional event handler when the emoji picker is opened',
			},
			{
				name: 'onShowMore',
				type: '() => void',
				description: 'Optional event handler when the custom emoji picker icon is selected',
			},
			{
				name: 'pickerQuickReactionEmojiIds',
				type: 'EmojiId[]',
				description:
					'Optional emojis shown for user to select from when the reaction add button is clicked (defaults to pre-defined list of emojis {@link DefaultReactions})',
			},
			{
				name: 'reactionPickerPlacement',
				type: 'AutoPlacement | BasePlacement | VariationPlacement',
				description: 'Optional prop for controlling the picker location',
			},
			{
				name: 'reactionPickerPopperZIndex',
				type: 'number',
				description: 'Optional zIndex for the reaction picker popper',
			},
			{
				name: 'reactionPickerStrategy',
				type: '"absolute" | "fixed"',
				description: 'Optional prop to set the strategy of the reaction picker popup',
			},
			{
				name: 'reactionPickerTriggerIcon',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Optional prop for controlling icon inside Trigger',
			},
			{
				name: 'reactionPickerTriggerText',
				type: 'string',
				description: 'Optional prop for controlling text of the trigger button',
			},
			{
				name: 'showAddReactionText',
				type: 'boolean',
				description: 'Optional prop for displaying text to add a reaction',
			},
			{
				name: 'showOpaqueBackground',
				type: 'boolean',
				description:
					'Optional prop for using an opaque button background instead of a transparent background',
			},
			{
				name: 'store',
				type: 'Store | Promise<Store>',
				description:
					'Reference to the store.\n@remarks\nThis was initially implemented with a sync and Async versions and will be replaced with just a sync Store in a future release (Please use only the sync version)',
				isRequired: true,
			},
			{
				name: 'subtleReactionsSummaryAndPicker',
				type: 'boolean',
				description: 'Optional prop for applying subtle styling to reaction summary and picker',
			},
			{
				name: 'tooltipContent',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Tooltip content for trigger button',
			},
		],
	},
	{
		name: 'ConnectedReactionsView',
		package: '@atlaskit/reactions',
		description: 'A component for displaying the current reactions on a piece of content.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `ConnectedReactionsView` to show the list of reactions and allow users to toggle their own reactions.',
		],
		keywords: ['reactions', 'view', 'display'],
		category: 'elements',
		examples: [
			"import { type EmojiProvider } from '@atlaskit/emoji/resource';\nimport { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';\nimport { ConnectedReactionsView, type StorePropInput } from '../src';\nimport { ExampleWrapper, Example, Constants as ExampleConstants } from './utils';\nimport { DefaultReactions } from '../src/shared/constants';\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t{(store: StorePropInput) => (\n\t\t\t\t<>\n\t\t\t\t\t{/* Example 1 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with a built in memory store and different emoji populated and several are selected.'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t{/* Example 2 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={'\"ConnectedReactionsView\" with miniMode for add reaction button'}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tallowAllEmojis\n\t\t\t\t\t\t\t\tminiMode\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t<strong\n\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\tfontSize: '14px',\n\t\t\t\t\t\t\tmarginLeft: '10px',\n\t\t\t\t\t\t\ttextDecoration: 'underline',\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\t\"allowAllEmojis\" prop - Show the \"more emoji\" selector icon for choosing emoji icons\n\t\t\t\t\t\tbeyond the default list of emojis (defaults to DEFAULT_REACTION_EMOJI_IDS)\n\t\t\t\t\t</strong>\n\t\t\t\t\t{/* Example 3 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with allowAllEmojis prop set to true (Select custom emojis from the picker instead of just a pre-defined list)'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}2`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tallowAllEmojis\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t{/* Example 4 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={'\"ConnectedReactionsView\" with allowAllEmojis flag set is not provided or false'}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}3`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t<strong\n\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\tfontSize: '14px',\n\t\t\t\t\t\t\tmarginLeft: '10px',\n\t\t\t\t\t\t\ttextDecoration: 'underline',\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\t\"pickerQuickReactionEmojiIds\" prop - emojis shown for user to select from the picker\n\t\t\t\t\t\tpopup when the reaction add button is clicked\n\t\t\t\t\t</strong>\n\t\t\t\t\t{/* Example 5 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with non-empty pickerQuickReactionEmojiIds array populated a single item'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}4`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tallowAllEmojis\n\t\t\t\t\t\t\t\tpickerQuickReactionEmojiIds={[{ id: '1f44d', shortName: ':thumbsup:' }]}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t{/* Example 6 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with empty pickerQuickReactionEmojiIds array (shows the full picker selector)'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}5`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tallowAllEmojis\n\t\t\t\t\t\t\t\tpickerQuickReactionEmojiIds={[]}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t<strong\n\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\tfontSize: '14px',\n\t\t\t\t\t\t\tmarginLeft: '10px',\n\t\t\t\t\t\t\ttextDecoration: 'underline',\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\t\"quickReactionEmojis\" prop - emojis that will be shown in the the primary view even if\n\t\t\t\t\t\tthe reaction count is zero and no emojis were created on the post/reply yet\n\t\t\t\t\t</strong>\n\t\t\t\t\t{/* Example 7 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with quickReactionEmojis array without any emoji (undefined or empty array) added to the container|ari item'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}6`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tallowAllEmojis\n\t\t\t\t\t\t\t\tpickerQuickReactionEmojiIds={[]}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t{/* Example 8 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with quickReactionEmojis array with some quick emoji icons selections to choose'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}7`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tquickReactionEmojis={{\n\t\t\t\t\t\t\t\t\tari: `${ExampleConstants.AriPrefix}7`,\n\t\t\t\t\t\t\t\t\tcontainerAri: `${ExampleConstants.ContainerAriPrefix}1`,\n\t\t\t\t\t\t\t\t\temojiIds: DefaultReactions.slice(3, 5).map((item) => item.id ?? ''),\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t{/* Example 9 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with large emoji picker, emojiPickerSize could be small, medium or large (default to medium).'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}7`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\temojiPickerSize=\"large\"\n\t\t\t\t\t\t\t\tallowAllEmojis\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t<strong\n\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\tfontSize: '14px',\n\t\t\t\t\t\t\tmarginLeft: '10px',\n\t\t\t\t\t\t\ttextDecoration: 'underline',\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\t\"allowUserDialog\" prop - enables a link within the reaction tooltip to show a full user\n\t\t\t\t\t\tlist associated with all reactions\n\t\t\t\t\t</strong>\n\t\t\t\t\t{/* Example 10 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={'Connected reactions with reactions dialog enabled'}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tallowUserDialog\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t<strong\n\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\tfontSize: '14px',\n\t\t\t\t\t\t\tmarginLeft: '10px',\n\t\t\t\t\t\t\ttextDecoration: 'underline',\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\t\"allowUserDialog\" prop with callbacks - enables a link within the reaction tooltip to\n\t\t\t\t\t\tshow a full user list associated with all reactions with event callbacks shown\n\t\t\t\t\t</strong>\n\t\t\t\t\t{/* Example 11 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'Connected reactions with reactions dialog enabled and callbacks shown as alert dialogs'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tallowUserDialog\n\t\t\t\t\t\t\t\tonDialogCloseCallback={(e, event) => {\n\t\t\t\t\t\t\t\t\talert(`onDialogCloseCallback event`);\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\tonDialogOpenCallback={(emojiId, source) => {\n\t\t\t\t\t\t\t\t\talert(`onDialogOpenCallback event with emojiId = ${emojiId}, source = ${source}`);\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\tonDialogSelectReactionCallback={(emojiId: string) => {\n\t\t\t\t\t\t\t\t\talert(`onDialogSelectReactionCallback event with emojiId = ${emojiId}`);\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t<hr role=\"presentation\" />\n\t\t\t\t\t{/* Example 11 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={\n\t\t\t\t\t\t\t'\"ConnectedReactionsView\" with a built in memory store and particle emojis enabled.'\n\t\t\t\t\t\t}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tparticleEffectByEmojiEnabled\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t\t{/* Example 12 */}\n\t\t\t\t\t<Example\n\t\t\t\t\t\ttitle={'\"ConnectedReactionsView\" with isViewOnly'}\n\t\t\t\t\t\tbody={\n\t\t\t\t\t\t\t<ConnectedReactionsView\n\t\t\t\t\t\t\t\tstore={store}\n\t\t\t\t\t\t\t\tcontainerAri={`${ExampleConstants.ContainerAriPrefix}1`}\n\t\t\t\t\t\t\t\tari={`${ExampleConstants.AriPrefix}1`}\n\t\t\t\t\t\t\t\temojiProvider={getEmojiResource() as Promise<EmojiProvider>}\n\t\t\t\t\t\t\t\tisViewOnly\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t</>\n\t\t\t)}\n\t\t</ExampleWrapper>\n\t);\n};",
		],
		props: [
			{
				name: 'allowAllEmojis',
				type: 'boolean',
				description:
					'Optional Show the "more emoji" selector icon for choosing emoji beyond the default list of emojis (defaults to false)',
			},
			{
				name: 'allowSelectFromSummaryView',
				type: 'boolean',
				description:
					'Optional prop for controlling if we can select emojis and display UI via summary view picker',
			},
			{
				name: 'allowUserDialog',
				type: 'boolean',
				description: 'Optional prop from checking a feature gate for rendering Reactions Dialog',
			},
			{
				name: 'ari',
				type: 'string',
				description: 'Individual id for a reaction',
				isRequired: true,
			},
			{
				name: 'containerAri',
				type: 'string',
				description: 'Wrapper id for reactions list',
				isRequired: true,
			},
			{
				name: 'emojiPickerSize',
				type: '"small" | "medium" | "large"',
				description: 'Optional emoji picker size to control the size of emoji picker',
			},
			{
				name: 'emojiProvider',
				type: 'Promise<EmojiProvider>',
				description: 'Provider for loading emojis',
				isRequired: true,
			},
			{
				name: 'isViewOnly',
				type: 'boolean',
				description:
					'Optional prop for controlling if the reactions component is view only, disabling adding reactions',
			},
			{
				name: 'miniMode',
				type: 'boolean',
				description: 'apply "miniMode" className to the button',
			},
			{
				name: 'onDialogCloseCallback',
				type: '(e: KeyboardOrMouseEvent, analyticEvent: UIAnalyticsEvent) => void',
				description: 'Optional callback function called when closing reactions dialog',
			},
			{
				name: 'onDialogOpenCallback',
				type: '(emojiId: string, source?: string) => void',
				description: 'Optional callback function called when opening reactions dialog',
			},
			{
				name: 'onDialogSelectReactionCallback',
				type: '(emojiId: string) => void',
				description:
					'Optional callback function called when selecting a reaction in reactions dialog',
			},
			{
				name: 'onlyRenderPicker',
				type: 'boolean',
				description: 'Optional prop to hide the user reactions and only render the picker',
			},
			{
				name: 'onReactionSuccess',
				type: '(action: ReactionUpdateType, ari: string, emojiId: string, count: number) => void',
				description: 'Callback function when a reaction is successfully added',
			},
			{
				name: 'particleEffectByEmojiEnabled',
				type: 'boolean',
				description: 'Optional boolean to control if particle animation on reactions appear',
			},
			{
				name: 'pickerQuickReactionEmojiIds',
				type: 'EmojiId[]',
				description:
					'Optional emojis shown for user to select from when the reaction add button is clicked (defaults to pre-defined list of emojis {@link DefaultReactions})',
			},
			{
				name: 'quickReactionEmojis',
				type: 'QuickReactionEmojiSummary',
				description:
					'quickReactionEmojiIds are emojis that will be shown in the the primary view even if the reaction count is zero',
			},
			{
				name: 'reactionPickerPopperZIndex',
				type: 'number',
				description: 'Optional zIndex for the reaction picker popper',
			},
			{
				name: 'store',
				type: 'Store | Promise<Store>',
				description:
					'Reference to the store.\n@remarks\nThis was initially implemented with a sync and Async versions and will be replaced with just a sync Store in a future release (Please use only the sync version)',
				isRequired: true,
			},
			{
				name: 'subtleReactionsSummaryAndPicker',
				type: 'boolean',
				description: 'Optional prop for applying subtle styling to reaction summary and picker',
			},
			{
				name: 'summaryViewEnabled',
				type: 'boolean',
				description:
					'Enables a summary view for displaying reactions. If enabled and the number of reactions meets or exceeds the summaryViewThreshold, reactions will be shown in a more aggregated format.',
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
				name: 'allowDownloadCodeBlock',
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
				name: 'headingIdPrefix',
				type: 'string',
				description:
					'Optional prefix to prepend to all generated heading IDs.\nUsed by nested renderers to namespace heading IDs and avoid collisions with the host page.',
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
	{
		name: 'UserPicker',
		package: '@atlaskit/user-picker',
		description: 'The main user picker component.',
		status: 'general-availability',
		usageGuidelines: [
			'Use `UserPicker` for selecting users or teams in forms or filters.',
			'Supports `isMulti` for selecting multiple items.',
		],
		keywords: ['user-picker', 'select', 'user', 'team'],
		category: 'elements',
		examples: [
			"import React, { useState } from 'react';\nimport { ExampleWrapper } from '../example-helpers/ExampleWrapper';\nimport UserPicker, { type OptionData } from '../src';\nconst Example = (): React.JSX.Element => {\n\tconst [selectedUser, setSelectedUser] = useState<OptionData>();\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t{({ options, onInputChange, onSelection }) => (\n\t\t\t\t<UserPicker\n\t\t\t\t\tfieldId=\"example\"\n\t\t\t\t\toptions={options}\n\t\t\t\t\tonChange={(option) => {\n\t\t\t\t\t\tif (option) {\n\t\t\t\t\t\t\tsetSelectedUser(option as OptionData);\n\t\t\t\t\t\t}\n\t\t\t\t\t}}\n\t\t\t\t\tonInputChange={onInputChange}\n\t\t\t\t\tonSelection={onSelection}\n\t\t\t\t\tvalue={selectedUser}\n\t\t\t\t\topenMenuOnFocus={false}\n\t\t\t\t/>\n\t\t\t)}\n\t\t</ExampleWrapper>\n\t);\n};\nexport default Example;",
			"import { ExampleWrapper } from '../example-helpers/ExampleWrapper';\nimport UserPicker from '../src';\nconst Example = (): React.JSX.Element => {\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t{({ options, onInputChange, onSelection }) => (\n\t\t\t\t<UserPicker\n\t\t\t\t\tfieldId=\"example\"\n\t\t\t\t\toptions={options}\n\t\t\t\t\tonChange={console.log}\n\t\t\t\t\tonInputChange={onInputChange}\n\t\t\t\t\tonSelection={onSelection}\n\t\t\t\t\tisMulti\n\t\t\t\t\tmaxPickerHeight={120}\n\t\t\t\t/>\n\t\t\t)}\n\t\t</ExampleWrapper>\n\t);\n};\nexport default Example;",
		],
		props: [
			{
				name: 'addMoreMessage',
				type: 'string',
			},
			{
				name: 'allowEmail',
				type: 'boolean',
			},
			{
				name: 'anchor',
				type: 'ComponentClass<any, any> | FunctionComponent<any>',
			},
			{
				name: 'appearance',
				type: '"normal" | "compact"',
			},
			{
				name: 'ariaDescribedBy',
				type: 'string',
			},
			{
				name: 'ariaLabel',
				type: 'string',
			},
			{
				name: 'ariaLabelledBy',
				type: 'string',
			},
			{
				name: 'ariaLive',
				type: '"polite" | "off" | "assertive"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
			},
			{
				name: 'captureMenuScroll',
				type: 'boolean',
			},
			{
				name: 'clearValueLabel',
				type: 'string',
			},
			{
				name: 'closeMenuOnScroll',
				type: 'boolean | EventListener',
			},
			{
				name: 'components',
				type: '{ Option?: ComponentType<OptionProps<OptionData, boolean, GroupBase<OptionData>>>; Group?: ComponentType<GroupProps<OptionData, boolean, GroupBase<...>>>; ... 19 more ...; ValueContainer?: ComponentType<...>; }',
			},
			{
				name: 'customGroupAnalyticsLabels',
				type: '{ user?: string; team?: string; email?: string; group?: string; custom?: string; external_user?: string; }',
			},
			{
				name: 'customGroupLabels',
				type: '{ user?: ReactNode; team?: ReactNode; email?: ReactNode; group?: ReactNode; custom?: ReactNode; external_user?: ReactNode; }',
			},
			{
				name: 'defaultValue',
				type: 'Value | OptionIdentifier | OptionIdentifier[]',
			},
			{
				name: 'disableInput',
				type: 'boolean',
			},
			{
				name: 'emailLabel',
				type: 'string',
			},
			{
				name: 'fieldId',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'footer',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'forwardedRef',
				type: '((instance: UserPickerRef) => void) | MutableRefObject<UserPickerRef>',
			},
			{
				name: 'groupByTypeOrder',
				type: 'NonNullable<"user" | "team" | "email" | "group" | "custom" | "external_user">[]',
			},
			{
				name: 'header',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'height',
				type: 'string | number',
			},
			{
				name: 'includeTeamsUpdates',
				type: 'boolean',
			},
			{
				name: 'inputId',
				type: 'string',
			},
			{
				name: 'isClearable',
				type: 'boolean',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
			},
			{
				name: 'isFooterFocused',
				type: 'boolean',
			},
			{
				name: 'isHeaderFocused',
				type: 'boolean',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				type: 'boolean',
			},
			{
				name: 'isMulti',
				type: 'boolean',
			},
			{
				name: 'isValidEmail',
				type: '(inputText: string) => EmailValidationResponse',
			},
			{
				name: 'loadOptions',
				type: 'LoadOptions',
			},
			{
				name: 'loadOptionsErrorMessage',
				type: '(value: { inputValue: string; }) => ReactNode',
			},
			{
				name: 'loadUserSource',
				type: 'LoadUserSource',
			},
			{
				name: 'maxOptions',
				type: 'number',
			},
			{
				name: 'maxPickerHeight',
				type: 'number',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
			},
			{
				name: 'menuMinWidth',
				type: 'number',
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
			},
			{
				name: 'menuShouldBlockScroll',
				type: 'boolean',
			},
			{
				name: 'minHeight',
				type: 'string | number',
			},
			{
				name: 'name',
				type: 'string',
			},
			{
				name: 'noBorder',
				type: 'boolean',
			},
			{
				name: 'noOptionsMessage',
				type: 'ReactNode | ((value: { inputValue: string; }) => ReactNode)',
			},
			{
				name: 'onBlur',
				type: '(sessionId?: string) => void',
			},
			{
				name: 'onChange',
				type: '(value: Value, action: ActionTypes) => void',
			},
			{
				name: 'onClear',
				type: '(sessionId?: string) => void',
			},
			{
				name: 'onClose',
				type: '(sessionId?: string) => void',
			},
			{
				name: 'onFocus',
				type: '(sessionId?: string) => void',
			},
			{
				name: 'onInputChange',
				type: '(query?: string, sessionId?: string) => void',
			},
			{
				name: 'onKeyDown',
				type: '(event: KeyboardEvent<Element>) => void',
			},
			{
				name: 'onOpen',
				type: '(sessionId?: string) => void',
			},
			{
				name: 'onSelection',
				type: '(value: Value, sessionId?: string, baseUserPicker?: BaseUserPickerWithoutAnalytics) => void',
			},
			{
				name: 'open',
				type: 'boolean',
			},
			{
				name: 'openMenuOnClick',
				type: 'boolean',
			},
			{
				name: 'openMenuOnFocus',
				type: 'boolean',
			},
			{
				name: 'options',
				type: 'OptionData[]',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'placeholderAvatar',
				type: '"team" | "person"',
			},
			{
				name: 'popupSelectProps',
				type: 'PopupSelectProps<OptionData, false, ModifierList>',
			},
			{
				name: 'required',
				type: 'boolean',
			},
			{
				name: 'search',
				type: 'string',
			},
			{
				name: 'setIsFooterFocused',
				type: '(value: SetStateAction<boolean>) => void',
			},
			{
				name: 'setIsHeaderFocused',
				type: '(value: SetStateAction<boolean>) => void',
			},
			{
				name: 'showClearIndicator',
				type: 'boolean',
			},
			{
				name: 'strategy',
				type: '"absolute" | "fixed"',
			},
			{
				name: 'styles',
				type: '{ clearIndicator?: (base: any, props: ClearIndicatorProps<OptionType, false, GroupBase<OptionType>>) => any; container?: (base: any, props: ContainerProps<...>) => any; ... 18 more ...; valueContainer?: (base: any, props: ValueContainerProps<...>) => any; }',
			},
			{
				name: 'subtle',
				type: 'boolean',
			},
			{
				name: 'suggestEmailsForDomain',
				type: 'string',
			},
			{
				name: 'textFieldBackgroundColor',
				type: 'boolean',
			},
			{
				name: 'value',
				type: 'OptionData | OptionData[]',
			},
			{
				name: 'width',
				type: 'string | number',
			},
		],
	},
];
