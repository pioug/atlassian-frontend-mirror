/**
 * THIS FILE WAS CREATED VIA CODEGEN DO NOT MODIFY {@see http://go/af-codegen}
 *
 * Structured content components from *.docs.tsx files outside of design-system
 *
 * @codegen <<SignedSource::a4eb2e29830d1b698e435ffc76b8bd21>>
 * @codegenCommand yarn workspace @af/ads-ai-tooling codegen
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
		name: 'AnalyticsContext',
		package: '@atlaskit/analytics-next',
		description:
			'Decorates every analytics event fired in its subtree with extra context data (e.g. the current page or feature area).',
		status: 'general-availability',
		usageGuidelines: [
			'Nest `AnalyticsContext` providers — context from each one is appended in order, so the closest provider is last in the resulting array.',
		],
		keywords: ['analytics', 'context', 'analytics-next'],
		category: 'analytics',
		examples: [
			"import React, { useCallback } from 'react';\nimport { AnalyticsContext, AnalyticsListener, type UIAnalyticsEvent } from '../src';\nimport AnalyticsButton from './helpers/AnalyticsButton';\nconst SaveButton = () => {\n\tconst onClick = useCallback(\n\t\t(e: React.MouseEvent<HTMLElement>, analyticsEvent: UIAnalyticsEvent) => {\n\t\t\tanalyticsEvent.fire();\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<AnalyticsButton\n\t\t\tanalyticsEventPayload={{\n\t\t\t\taction: 'clicked',\n\t\t\t\tactionSubject: 'button',\n\t\t\t\tcomponentName: 'save-button',\n\t\t\t\tpackageName: '@atlaskit/analytics-next',\n\t\t\t\tpackageVersion: '11.2.0',\n\t\t\t}}\n\t\t\tonClick={onClick}\n\t\t>\n\t\t\tSave\n\t\t</AnalyticsButton>\n\t);\n};\nconst App = (): React.JSX.Element => {\n\tconst onEvent = ({ context }: UIAnalyticsEvent) => console.log('Event context:', context);\n\treturn (\n\t\t<AnalyticsListener onEvent={onEvent}>\n\t\t\t<AnalyticsContext data={{ issueId: 123 }}>\n\t\t\t\t<AnalyticsContext data={{ panel: 'right' }}>\n\t\t\t\t\t<SaveButton />\n\t\t\t\t</AnalyticsContext>\n\t\t\t</AnalyticsContext>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default App;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Children!',
				isRequired: true,
			},
			{
				name: 'data',
				type: 'Object',
				description:
					'Arbitrary data. Any events created below this component in the tree will\nhave this added as an item in their context array.',
				isRequired: true,
			},
		],
	},
	{
		name: 'AnalyticsErrorBoundary',
		package: '@atlaskit/analytics-next',
		description:
			'Error boundary that fires an analytics event when a render error is caught, then optionally renders a fallback UI.',
		status: 'general-availability',
		usageGuidelines: [
			'Wrap experiences whose render failures you want to instrument. Provide `ErrorComponent` for a graceful fallback.',
		],
		keywords: ['analytics', 'error-boundary', 'analytics-next'],
		category: 'analytics',
		examples: [
			"import React, { useEffect } from 'react';\nimport { AnalyticsErrorBoundary } from '../src';\nconst ComponentWithError = () => {\n\tuseEffect(() => {\n\t\tthrow new Error('a test error');\n\t});\n\treturn null;\n};\nconst onError = () => {\n\tconsole.log('An error was caught.');\n};\nconst ErrorScreen = () => {\n\treturn (\n\t\t<>\n\t\t\t<h1>You dun goofed</h1>\n\t\t\t<div>This is a custom error screen. An unexpected error has occurred.</div>\n\t\t</>\n\t);\n};\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<AnalyticsErrorBoundary\n\t\t\tchannel=\"atlaskit\"\n\t\t\tdata={{\n\t\t\t\tcomponentName: 'button',\n\t\t\t\tpackageName: '@atlaskit/button/standard-button',\n\t\t\t\tcomponentVersion: '999.9.9',\n\t\t\t}}\n\t\t\tErrorComponent={ErrorScreen}\n\t\t\tonError={onError}\n\t\t>\n\t\t\t<>\n\t\t\t\t<div>You won't see this because an error would have occurred by now.</div>\n\t\t\t\t<ComponentWithError />\n\t\t\t</>\n\t\t</AnalyticsErrorBoundary>\n\t);\n};",
		],
		props: [
			{
				name: 'channel',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'React component to be wrapped',
				isRequired: true,
			},
			{
				name: 'data',
				type: '{}',
				isRequired: true,
			},
			{
				name: 'ErrorComponent',
				type: 'ComponentClass<{}, any> | FunctionComponent<{}>',
			},
			{
				name: 'onError',
				type: '(error: Error, info?: AnalyticsErrorBoundaryErrorInfo) => void',
			},
		],
	},
	{
		name: 'AnalyticsListener',
		package: '@atlaskit/analytics-next',
		description:
			'Subscribes to analytics events fired on a given channel from anywhere in its subtree. Mount once near the app root per channel you want to listen on.',
		status: 'general-availability',
		usageGuidelines: [
			'Mount one listener per channel near the app root. Use `channel="*"` to listen to every channel.',
			'Forward received events to your downstream analytics SDK (Segment, GASv3, etc.) inside `onEvent`.',
		],
		keywords: ['analytics', 'listener', 'events', 'analytics-next'],
		category: 'analytics',
		examples: [
			"import React, { type FC, type MouseEvent, useCallback } from 'react';\nimport {\n\tAnalyticsListener,\n\ttype UIAnalyticsEvent,\n\tuseAnalyticsEvents,\n\tuseCallbackWithAnalytics,\n\tusePlatformLeafEventHandler,\n\twithAnalyticsEvents,\n\ttype WithAnalyticsEventsProps,\n} from '../src';\ninterface Props extends WithAnalyticsEventsProps {\n\tchildren: React.ReactNode;\n\tonClick: (e: MouseEvent<HTMLButtonElement>) => void;\n}\nconst ButtonBase = ({ createAnalyticsEvent, onClick, ...rest }: Props) => {\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent!({\n\t\t\t\taction: 'click',\n\t\t\t});\n\t\t\t// Fire our analytics event on the 'atlaskit' channel\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...rest} onClick={handleClick} />;\n};\nconst Button = withAnalyticsEvents()(ButtonBase);\nconst ButtonUsingHook: FC<Props> = ({ onClick, ...props }) => {\n\t// Decompose function from the hook\n\tconst { createAnalyticsEvent } = useAnalyticsEvents();\n\tconst handleClick = useCallback(\n\t\t(e: MouseEvent<HTMLButtonElement>) => {\n\t\t\t// Create our analytics event\n\t\t\tconst analyticsEvent = createAnalyticsEvent({ action: 'click' });\n\t\t\t// Fire our analytics event\n\t\t\tanalyticsEvent.fire('atlaskit');\n\t\t\tif (onClick) {\n\t\t\t\tonClick(e);\n\t\t\t}\n\t\t},\n\t\t[onClick, createAnalyticsEvent],\n\t);\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingCallback: FC<Props> = ({ onClick, ...props }) => {\n\tconst handleClick = useCallbackWithAnalytics(onClick, { action: 'click' }, 'atlaskit');\n\treturn <button {...props} onClick={handleClick} />;\n};\nconst ButtonUsingEventHandlerHook = ({\n\tonClick,\n\tchildren,\n}: {\n\tchildren: React.ReactNode;\n\tonClick: (\n\t\tmouseEvent: React.MouseEvent<HTMLButtonElement>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => void;\n}) => {\n\tconst handleClick = usePlatformLeafEventHandler({\n\t\tfn: onClick,\n\t\taction: 'clicked',\n\t\tcomponentName: 'fancy-button',\n\t\tpackageName: '@atlaskit/fancy-button',\n\t\tpackageVersion: '0.1.0',\n\t});\n\treturn <button onClick={handleClick}>{children}</button>;\n};\nconst App: FC = () => {\n\tconst handleEvent = (analyticsEvent: UIAnalyticsEvent) => {\n\t\tconst { payload, context } = analyticsEvent;\n\t\tconsole.log('Received event:', { payload, context });\n\t};\n\tconst onClickHandler = () => console.log('onClickCallback');\n\treturn (\n\t\t<AnalyticsListener channel=\"atlaskit\" onEvent={handleEvent}>\n\t\t\t<Button onClick={onClickHandler}>Click me (withAnalyticsEvents)</Button>\n\t\t\t<br />\n\t\t\t<ButtonUsingHook onClick={onClickHandler}>Click me (useAnalyticsEvents)</ButtonUsingHook>\n\t\t\t<br />\n\t\t\t<ButtonUsingCallback onClick={onClickHandler}>\n\t\t\t\tClick me (useCallbackWithAnalytics)\n\t\t\t</ButtonUsingCallback>\n\t\t\t<br />\n\t\t\t<ButtonUsingEventHandlerHook onClick={onClickHandler}>\n\t\t\t\tClick me (usePlatformLeafEventHandler)\n\t\t\t</ButtonUsingEventHandlerHook>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default App;",
		],
		props: [
			{
				name: 'channel',
				type: 'string',
				description: 'The channel to listen for events on.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Children!',
			},
			{
				name: 'onEvent',
				type: '(event: UIAnalyticsEvent, channel?: string) => void',
				description:
					"A function which will be called when an event is fired on this Listener's\nchannel. It is passed the event and the channel as arguments.",
				isRequired: true,
			},
		],
	},
	{
		name: 'Notifications',
		package: '@atlaskit/atlassian-notifications',
		description: 'A component for displaying a list of notifications for Atlassian products.',
		status: 'general-availability',
		usageGuidelines: [
			'Use Notifications to display a list of user-relevant events or updates.',
			'Typically used within a notification drawer or popover.',
		],
		keywords: ['notifications', 'alerts', 'updates', 'list'],
		category: 'interaction',
		examples: [
			"import React, { useEffect } from 'react';\nimport { Notifications } from '../src';\nconst onLoad = (...args: any[]) => {\n\tconsole.log('onLoad', ...args);\n};\nconst BasicUsage = (): React.JSX.Element => {\n\t// Fake the notifications iframe url as it is unreachable from examples\n\tuseEffect(() => {\n\t\tconst iframe = document.querySelector('iframe[title=\"Notifications\"]') as HTMLIFrameElement;\n\t\tif (iframe) {\n\t\t\tconst content = `\n        <h1>Notifications</h1>\n        <script>\n          setTimeout(() => {\n            window.parent.postMessage('readyForUser', '*');\n          }, 1000);\n        </script>\n      `;\n\t\t\tiframe.src = `data:text/html,${encodeURIComponent(content)}`;\n\t\t}\n\t}, []);\n\treturn (\n\t\t<Notifications\n\t\t\tlocale=\"en\"\n\t\t\tonLoad={onLoad}\n\t\t\tproduct=\"jira\"\n\t\t\ttestId=\"jira-notifications\"\n\t\t\ttitle=\"Notifications\"\n\t\t/>\n\t);\n};\nexport default BasicUsage;",
		],
		props: [
			{
				name: '_url',
				type: 'string',
				description: 'Reserved for testing, avoid using this',
			},
			{
				name: 'isNewExperience',
				type: 'boolean',
			},
			{
				name: 'locale',
				type: 'string',
			},
			{
				name: 'product',
				type: 'string',
			},
			{
				name: 'subproduct',
				type: 'string',
			},
		],
	},
	{
		name: 'ColorPicker',
		package: '@atlaskit/color-picker',
		description: 'A component that allows users to select a color from a predefined palette.',
		status: 'general-availability',
		usageGuidelines: [
			'Use ColorPicker to allow users to choose a color for text, backgrounds, or other UI elements.',
			'Provides a standard palette of colors and supports custom color selection.',
		],
		keywords: ['color', 'picker', 'palette', 'select'],
		category: 'interaction',
		examples: [
			"import ColorPicker from '../src';\nimport { simplePalette } from '../mock-data';\nimport { token } from '@atlaskit/tokens';\nimport { IntlProvider } from 'react-intl';\nimport { DiProvider, injectable } from 'react-magnetic-di';\nimport { fg } from '@atlaskit/platform-feature-flags';\nconst platformFgInjectable = injectable(fg, () => true);\nclass ColorPickerExample extends React.Component<{}, { color: string }> {\n\tstate = {\n\t\tcolor: token('color.background.accent.purple.subtle'),\n\t};\n\trender() {\n\t\treturn (\n\t\t\t<IntlProvider locale=\"en\">\n\t\t\t\t<ColorPicker\n\t\t\t\t\tlabel=\"Change color\"\n\t\t\t\t\tpalette={simplePalette}\n\t\t\t\t\tselectedColor={this.state.color}\n\t\t\t\t\tonChange={(newColor: string) => this.setState({ color: newColor })}\n\t\t\t\t/>\n\t\t\t</IntlProvider>\n\t\t);\n\t}\n}\nconst Story = (): React.JSX.Element => (\n\t<DiProvider use={[platformFgInjectable]}>\n\t\t<ColorPickerExample />\n\t</DiProvider>\n);\nexport default Story;",
		],
		props: [
			{
				name: 'checkMarkColor',
				type: 'string',
				description: 'color of checkmark on selected color',
			},
			{
				name: 'cols',
				type: 'number',
				description: 'maximum column length',
			},
			{
				name: 'forwardedRef',
				type: '((instance: any) => void) | RefObject<any>',
			},
			{
				name: 'isDisabledSelectedSwatch',
				type: 'boolean',
				description: 'diasble swatch button',
			},
			{
				name: 'label',
				type: 'string',
				description: 'color picker button label',
			},
			{
				name: 'onChange',
				type: '(value: string, analyticsEvent?: object) => void',
				description: 'onChange handler',
				isRequired: true,
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'onMenuOpen handler',
			},
			{
				name: 'palette',
				type: 'Color[]',
				description: 'list of available colors',
				isRequired: true,
			},
			{
				name: 'popperProps',
				type: '{ innerRef?: Ref<any>; modifiers?: readonly (Partial<OffsetModifier> | Partial<ApplyStylesModifier> | Partial<ArrowModifier> | ... 6 more ... | Partial<...>)[]; placement?: Placement; strategy?: PositioningStrategy; referenceElement?: HTMLElement | VirtualElement; onFirstUpdate?: (state: Partial<...>) => void; }',
				description: 'props for react-popper',
			},
			{
				name: 'selectedColor',
				type: 'string',
				description: 'selected color',
			},
			{
				name: 'selectedColourSwatchSize',
				type: '"small" | "default"',
				description: 'swatch button size',
			},
			{
				name: 'showDefaultSwatchColor',
				type: 'boolean',
				description: 'swatch button default color',
			},
			{
				name: 'tooltipContent',
				type: 'string',
			},
			{
				name: 'triggerId',
				type: 'string',
				description: 'trigger id for accessability labelling',
			},
			{
				name: 'variant',
				type: '"fill" | "outline"',
				description: 'Display filled or outline variant of the color',
			},
		],
	},
	{
		name: 'ContextualSurvey',
		package: '@atlaskit/contextual-survey',
		description:
			'A component used to gather feedback from users in a specific context within the product.',
		status: 'general-availability',
		usageGuidelines: [
			'Use ContextualSurvey to ask users for feedback about a specific feature or experience.',
			'Supports various question types and can be triggered based on user actions.',
		],
		keywords: ['survey', 'feedback', 'engagement', 'nps', 'user-research'],
		category: 'interaction',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport React, { useCallback, useState } from 'react';\nimport { css, jsx } from '@compiled/react';\nimport Button from '@atlaskit/button/new';\nimport { Checkbox } from '@atlaskit/checkbox';\nimport { token } from '@atlaskit/tokens';\nimport { ContextualSurvey, DismissTrigger, type OnDismissArgs, SurveyMarshal } from '../src';\nconst styles = css({\n\tpaddingTop: token('space.100'),\n\tfont: token('font.body.large'),\n});\nexport default function BasicUsage(): React.JSX.Element {\n\tconst [showSurvey, setShowSurvey] = useState(false);\n\tconst [hasUserAnswered, setHasUserAnswered] = useState(false);\n\tconst onClick = useCallback(() => {\n\t\tsetShowSurvey(true);\n\t}, [setShowSurvey]);\n\tconst onDismiss = useCallback(\n\t\t(args: OnDismissArgs) => {\n\t\t\tconsole.log('dismiss called with', args);\n\t\t\t// Required due to double render in react strict mode\n\t\t\tif (args.trigger !== DismissTrigger.Unmount) {\n\t\t\t\tsetShowSurvey(false);\n\t\t\t}\n\t\t},\n\t\t[setShowSurvey],\n\t);\n\treturn (\n\t\t<React.Fragment>\n\t\t\t<Button appearance=\"primary\" onClick={onClick}>\n\t\t\t\tShow survey\n\t\t\t</Button>\n\t\t\t<div css={styles}>\n\t\t\t\t<Checkbox\n\t\t\t\t\tisChecked={hasUserAnswered}\n\t\t\t\t\tlabel=\"Has the user previously answered the mailing list question?\"\n\t\t\t\t\tonChange={() => setHasUserAnswered((value: boolean): boolean => !value)}\n\t\t\t\t\tisDisabled={showSurvey}\n\t\t\t\t\tname=\"checkbox-basic\"\n\t\t\t\t/>\n\t\t\t</div>\n\t\t\t<SurveyMarshal shouldShow={showSurvey}>\n\t\t\t\t{() => (\n\t\t\t\t\t<ContextualSurvey\n\t\t\t\t\t\tquestion=\"How strongly do you agree or disagree with this statement\"\n\t\t\t\t\t\tstatement=\"It is easy to find what I'm looking for in Jira\"\n\t\t\t\t\t\tonDismiss={onDismiss}\n\t\t\t\t\t\tgetUserHasAnsweredMailingList={() =>\n\t\t\t\t\t\t\tnew Promise((resolve) => {\n\t\t\t\t\t\t\t\tconsole.log(\n\t\t\t\t\t\t\t\t\t'Discovering if user has previously answered. Result will be:',\n\t\t\t\t\t\t\t\t\thasUserAnswered,\n\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t\tsetTimeout(() => resolve(hasUserAnswered), 1000);\n\t\t\t\t\t\t\t})\n\t\t\t\t\t\t}\n\t\t\t\t\t\tonMailingListAnswer={(answer: boolean) =>\n\t\t\t\t\t\t\tnew Promise((resolve) => {\n\t\t\t\t\t\t\t\tconsole.log('Did sign up to mailing list:', answer);\n\t\t\t\t\t\t\t\tsetTimeout(resolve, 1000);\n\t\t\t\t\t\t\t})\n\t\t\t\t\t\t}\n\t\t\t\t\t\tonSubmit={(formValues) =>\n\t\t\t\t\t\t\tnew Promise((resolve) => {\n\t\t\t\t\t\t\t\tconsole.log('submitted value', formValues);\n\t\t\t\t\t\t\t\tsetTimeout(resolve, 1000);\n\t\t\t\t\t\t\t})\n\t\t\t\t\t\t}\n\t\t\t\t\t/>\n\t\t\t\t)}\n\t\t\t</SurveyMarshal>\n\t\t</React.Fragment>\n\t);\n}",
		],
		props: [
			{
				name: 'getUserHasAnsweredMailingList',
				type: '() => Promise<boolean>',
				description:
					'Gets whether user has already signed up to the Atlassian Research Group list.\nIf `true` is returned then the user will not be prompted to sign up to the Research Group.',
				isRequired: true,
			},
			{
				name: 'onDismiss',
				type: '(args: OnDismissArgs) => void',
				description: 'Callback that is triggered when the survey should be dismissed',
				isRequired: true,
			},
			{
				name: 'onMailingListAnswer',
				type: '(answer: boolean) => Promise<void>',
				description:
					"Callback that is triggered when the user clicks 'Yes' or 'No' to sign up to the Atlassian Research Group",
				isRequired: true,
			},
			{
				name: 'onSubmit',
				type: '(formValues: FormValues) => Promise<void>',
				description:
					'Callback that is triggered when the survey is submitted, it will get the survey data as a parameter',
				isRequired: true,
			},
			{
				name: 'question',
				type: 'string',
				description:
					'Question used for the survey\nExample: "It is easy to find what I am looking for in Jira"',
				isRequired: true,
			},
			{
				name: 'statement',
				type: 'string',
				description:
					'Optional statement, to be used in conjunction with the question for the survey\nExample: "How strongly do you agree or disagree with this statement"',
			},
			{
				name: 'textLabel',
				type: 'string',
				description: 'Accessible label text for the survey text area',
				defaultValue: '"Why did you give that rating"',
			},
			{
				name: 'textPlaceholder',
				type: 'string',
				description: 'Text placeholder for the survey text area\nExample: "Tell us why"',
				defaultValue: '"Tell us why"',
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
		name: 'Date',
		package: '@atlaskit/date',
		description:
			'A component for displaying a formatted date, often used within an editor or task list.',
		status: 'general-availability',
		usageGuidelines: [
			'Use Date to display a date in a consistent format.',
			'Supports custom colors to indicate status (e.g., overdue).',
		],
		keywords: ['date', 'time', 'format', 'calendar'],
		category: 'data-display',
		examples: [
			'import { Date, type Color } from \'../src\';\nconst DateInParagraph = ({ color }: { color?: Color }) => (\n\t<p>\n\t\t<Date value={586137600000} color={color} />\n\t</p>\n);\nexport default (): React.JSX.Element => (\n\t<div>\n\t\t<DateInParagraph />\n\t\t<DateInParagraph color="red" />\n\t\t<DateInParagraph color="green" />\n\t\t<DateInParagraph color="blue" />\n\t\t<DateInParagraph color="purple" />\n\t\t<DateInParagraph color="yellow" />\n\t</div>\n);',
		],
		props: [
			{
				name: 'children',
				type: 'ReactNode | FunctionComponent<PropsWithChildren<Props>>',
			},
			{
				name: 'color',
				type: '"grey" | "red" | "blue" | "green" | "purple" | "yellow"',
			},
			{
				name: 'format',
				type: 'string',
			},
			{
				name: 'onClick',
				type: '(value: number, event: SyntheticEvent<any, Event>) => void',
			},
			{
				name: 'value',
				type: 'number',
				isRequired: true,
			},
		],
	},
	{
		name: 'BitbucketTransformer',
		package: '@atlaskit/editor-bitbucket-transformer',
		description: 'Editor Bitbucket transformer',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-bitbucket-transformer', 'atlaskit'],
		category: 'editor',
		examples: [],
		props: [],
	},
	{
		name: 'ConfluenceTransformer',
		package: '@atlaskit/editor-confluence-transformer',
		description: 'Editor Confluence Transformer',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-confluence-transformer', 'atlaskit'],
		category: 'editor',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { css, jsx } from '@emotion/react';\nimport type { SerializedStyles } from '@emotion/react';\nimport { Component, createRef } from 'react';\nimport { pd } from 'pretty-data';\nimport ButtonGroup from '@atlaskit/button/button-group';\nimport Button from '@atlaskit/button/new';\nimport type { EditorProps, EditorActions } from '@atlaskit/editor-core';\nimport { EditorContext, WithEditorActions } from '@atlaskit/editor-core';\nimport { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';\nimport { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';\nimport { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';\nimport { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';\nimport { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';\nimport { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';\nimport { MockActivityResource } from '@atlaskit/activity/dist/es5/support';\nimport Spinner from '@atlaskit/spinner';\nimport { token } from '@atlaskit/tokens';\nimport { TitleInput } from '@atlaskit/editor-test-helpers/example-helpers';\nimport { highlightPlugin } from '@atlaskit/editor-plugins/highlight';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport {\n\tCODE_MACRO,\n\tJIRA_ISSUE,\n\tJIRA_ISSUES_LIST,\n\tPANEL_MACRO,\n\tINLINE_EXTENSION,\n\tEXTENSION,\n\tBODIED_EXTENSION,\n\tBODIED_NESTED_EXTENSION,\n\tDATE,\n} from '../example-helpers/cxhtml-test-data';\nimport { ConfluenceTransformer } from '../src';\nimport type { Node } from '@atlaskit/editor-prosemirror/model';\nexport const content: SerializedStyles = css({\n\tpadding: `0 ${token('space.250')}`,\n\theight: '100%',\n\tbackground: '#fff',\n\tboxSizing: 'border-box',\n});\nconst clickableSpan: SerializedStyles = css({\n\tcursor: 'pointer',\n});\nconst fieldsetStyle: SerializedStyles = css({\n\tmarginTop: token('space.250'),\n\tmarginBottom: token('space.250'),\n});\nconst textareaStyle: SerializedStyles = css({\n\tboxSizing: 'border-box',\n\tborder: `${token('border.width')} solid lightgray`,\n\tfontFamily: 'monospace',\n\tpadding: token('space.150'),\n\twidth: '100%',\n\theight: 100,\n});\nconst SaveAndCancelButtons = (props: any) => (\n\t<ButtonGroup>\n\t\t<Button\n\t\t\tappearance=\"primary\"\n\t\t\tonClick={() =>\n\t\t\t\tprops.editorActions\n\t\t\t\t\t.getValue()\n\t\t\t\t\t.then((value: Node) => console.log(value.toJSON()))\n\t\t\t}\n\t\t>\n\t\t\tPublish\n\t\t</Button>\n\t\t<Button appearance=\"subtle\" onClick={() => props.editorActions.clear()}>\n\t\t\tClose\n\t\t</Button>\n\t</ButtonGroup>\n);\nconst providers = {\n\temojiProvider: getEmojiResource({\n\t\tuploadSupported: true,\n\t}),\n\tmentionProvider: Promise.resolve(mentionResourceProvider),\n\tactivityProvider: Promise.resolve(new MockActivityResource()),\n\tmacroProvider: Promise.resolve(macroProvider),\n\ttaskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),\n\tcontextIdentifierProvider: storyContextIdentifierProviderFactory(),\n};\nconst mediaProvider = storyMediaProviderFactory();\ntype ExampleProps = {\n\tonChange: Function;\n};\ntype ExampleState = {\n\tinput: string;\n\toutput: string;\n};\nconst ComposableEditorWrapper = (props: EditorProps) => {\n\tconst universalPreset = useUniversalPreset({ props });\n\tconst { preset } = usePreset(() => {\n\t\treturn universalPreset.add(highlightPlugin);\n\t}, [universalPreset]);\n\treturn (\n\t\t<ComposableEditor\n\t\t\tpreset={preset}\n\t\t\tappearance={props.appearance}\n\t\t\tcontentMode={props.contentMode}\n\t\t\tcontentComponents={props.contentComponents}\n\t\t\tprimaryToolbarIconBefore={props.primaryToolbarIconBefore}\n\t\t\tsecondaryToolbarComponents={props.secondaryToolbarComponents}\n\t\t\tpersistScrollGutter={props.persistScrollGutter}\n\t\t\tquickInsert={props.quickInsert}\n\t\t\tshouldFocus={props.shouldFocus}\n\t\t\tdisabled={props.disabled}\n\t\t\tcontextPanel={props.contextPanel}\n\t\t\terrorReporterHandler={props.errorReporterHandler}\n\t\t\tcontentTransformerProvider={props.contentTransformerProvider}\n\t\t\tmaxHeight={props.maxHeight}\n\t\t\tminHeight={props.minHeight}\n\t\t\tdefaultValue={props.defaultValue}\n\t\t\tassistiveLabel={props.assistiveLabel}\n\t\t\tassistiveDescribedBy={props.assistiveDescribedBy}\n\t\t\tpopupsMountPoint={props.popupsMountPoint}\n\t\t\tpopupsBoundariesElement={props.popupsBoundariesElement}\n\t\t\tpopupsScrollableElement={props.popupsScrollableElement}\n\t\t\teditorActions={props.editorActions}\n\t\t\tonEditorReady={props.onEditorReady}\n\t\t\tonDestroy={props.onDestroy}\n\t\t\tonChange={props.onChange}\n\t\t\tonCancel={props.onCancel}\n\t\t\textensionProviders={props.extensionProviders}\n\t\t\tUNSAFE_useAnalyticsContext={props.UNSAFE_useAnalyticsContext}\n\t\t\tuseStickyToolbar={props.useStickyToolbar}\n\t\t\tfeatureFlags={props.featureFlags}\n\t\t\tonSave={props.onSave}\n\t\t\tsanitizePrivateContent={props.sanitizePrivateContent}\n\t\t\tmedia={props.media}\n\t\t\tcollabEdit={props.collabEdit}\n\t\t\tprimaryToolbarComponents={props.primaryToolbarComponents}\n\t\t\tperformanceTracking={props.performanceTracking}\n\t\t\tinputSamplingLimit={props.inputSamplingLimit}\n\t\t\tallowUndoRedoButtons={props.allowUndoRedoButtons}\n\t\t\tlinking={props.linking}\n\t\t\tactivityProvider={props.activityProvider}\n\t\t\tsearchProvider={props.searchProvider}\n\t\t\tannotationProviders={props.annotationProviders}\n\t\t\tcollabEditProvider={props.collabEditProvider}\n\t\t\tpresenceProvider={props.presenceProvider}\n\t\t\temojiProvider={props.emojiProvider}\n\t\t\ttaskDecisionProvider={props.taskDecisionProvider}\n\t\t\tlegacyImageUploadProvider={props.legacyImageUploadProvider}\n\t\t\tmentionProvider={props.mentionProvider}\n\t\t\tautoformattingProvider={props.autoformattingProvider}\n\t\t\tmacroProvider={props.macroProvider}\n\t\t\tcontextIdentifierProvider={props.contextIdentifierProvider}\n\t\t\tonSSRMeasure={props.onSSRMeasure}\n\t\t\t__livePage={props.__livePage}\n\t\t\tskipValidation={props.skipValidation}\n\t\t\tsyncedBlockProvider={props.syncedBlockProvider}\n\t\t/>\n\t);\n};\n// Ignored via go/ees005\nclass Example extends Component<ExampleProps, ExampleState> {\n\tstate = {\n\t\tinput: '',\n\t\toutput: '',\n\t};\n\tinputRef = createRef<HTMLTextAreaElement>();\n\tshouldComponentUpdate(_nextProps: ExampleProps, nextState: ExampleState) {\n\t\treturn nextState.input !== this.state.input || nextState.output !== this.state.output;\n\t}\n\trender() {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<fieldset css={fieldsetStyle}>\n\t\t\t\t\t<legend>Input</legend>\n\t\t\t\t\t{\n\t\t\t\t\t<textarea css={textareaStyle} ref={this.inputRef} />\n\t\t\t\t\t<button onClick={this.handleImportClick}>Import</button>\n\t\t\t\t\t<button onClick={this.handleInsertCodeClick}>Code</button>\n\t\t\t\t\t<button onClick={this.handleInsertPanelClick}>Panel</button>\n\t\t\t\t\t<button onClick={this.handleInsertJiraIssueClick}>JIRA Issue</button>\n\t\t\t\t\t<button onClick={this.handleInsertJiraIssuesListClick}>JIRA Issues List</button>\n\t\t\t\t\t<button onClick={this.handleInsertInlineExtensionClick}>Inline Extension</button>\n\t\t\t\t\t<button onClick={this.handleInsertExtensionClick}>Extension</button>\n\t\t\t\t\t<button onClick={this.handleInsertBodiedExtensionClick}>Bodied Extension</button>\n\t\t\t\t\t<button onClick={this.handleInsertNestedMacroClick}>Nested Extensions</button>\n\t\t\t\t\t<button onClick={this.handleInsertDateClick}>Date</button>\n\t\t\t\t</fieldset>\n\t\t\t\t<div css={content}>\n\t\t\t\t\t<EditorContext>\n\t\t\t\t\t\t<WithEditorActions\n\t\t\t\t\t\t\trender={(actions) => (\n\t\t\t\t\t\t\t\t<ComposableEditorWrapper\n\t\t\t\t\t\t\t\t\tappearance=\"full-page\"\n\t\t\t\t\t\t\t\t\tallowTextColor={true}\n\t\t\t\t\t\t\t\t\tallowTables={{\n\t\t\t\t\t\t\t\t\t\tallowColumnResizing: true,\n\t\t\t\t\t\t\t\t\t\tallowMergeCells: true,\n\t\t\t\t\t\t\t\t\t\tallowBackgroundColor: true,\n\t\t\t\t\t\t\t\t\t\tallowNumberColumn: true,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\tallowPanel={true}\n\t\t\t\t\t\t\t\t\tallowExtension={true}\n\t\t\t\t\t\t\t\t\tallowConfluenceInlineComment={true}\n\t\t\t\t\t\t\t\t\tallowDate={true}\n\t\t\t\t\t\t\t\t\temojiProvider={providers.emojiProvider}\n\t\t\t\t\t\t\t\t\tmentionProvider={providers.mentionProvider}\n\t\t\t\t\t\t\t\t\tactivityProvider={providers.activityProvider}\n\t\t\t\t\t\t\t\t\tmacroProvider={providers.macroProvider}\n\t\t\t\t\t\t\t\t\ttaskDecisionProvider={providers.taskDecisionProvider}\n\t\t\t\t\t\t\t\t\tcontextIdentifierProvider={providers.contextIdentifierProvider}\n\t\t\t\t\t\t\t\t\tmedia={{ provider: mediaProvider, allowMediaSingle: true }}\n\t\t\t\t\t\t\t\t\tcontentTransformerProvider={(schema) => new ConfluenceTransformer(schema)}\n\t\t\t\t\t\t\t\t\tplaceholder=\"Write something...\"\n\t\t\t\t\t\t\t\t\tshouldFocus={false}\n\t\t\t\t\t\t\t\t\tonChange={() => this.props.onChange(actions)}\n\t\t\t\t\t\t\t\t\tdefaultValue={this.state.input}\n\t\t\t\t\t\t\t\t\tkey={this.state.input}\n\t\t\t\t\t\t\t\t\tcontentComponents={\n\t\t\t\t\t\t\t\t\t\t<TitleInput innerRef={(ref?: HTMLElement) => ref && ref.focus()} />\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\tprimaryToolbarComponents={\n\t\t\t\t\t\t\t\t\t\t<WithEditorActions\n\t\t\t\t\t\t\t\t\t\t\trender={(actions) => <SaveAndCancelButtons editorActions={actions} />}\n\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</EditorContext>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t);\n\t}\n\tprivate handleImportClick = () => this.setState({ input: this.inputRef.current?.value ?? '' });\n\tprivate handleInsertCodeClick = () => this.setState({ input: CODE_MACRO });\n\tprivate handleInsertJiraIssueClick = () => this.setState({ input: JIRA_ISSUE });\n\tprivate handleInsertJiraIssuesListClick = () => this.setState({ input: JIRA_ISSUES_LIST });\n\tprivate handleInsertPanelClick = () => this.setState({ input: PANEL_MACRO });\n\tprivate handleInsertInlineExtensionClick = () => this.setState({ input: INLINE_EXTENSION });\n\tprivate handleInsertExtensionClick = () => this.setState({ input: EXTENSION });\n\tprivate handleInsertBodiedExtensionClick = () => this.setState({ input: BODIED_EXTENSION });\n\tprivate handleInsertNestedMacroClick = () => this.setState({ input: BODIED_NESTED_EXTENSION });\n\tprivate handleInsertDateClick = () => this.setState({ input: DATE });\n}\nexport type ExampleWrapperProps = {};\nexport type ExampleWrapperState = {\n\tcxhtml?: string;\n\tisMediaReady?: boolean;\n\tprettify?: boolean;\n\tstory?: any;\n};\n// Ignored via go/ees005\nexport default class ExampleWrapper extends Component<ExampleWrapperProps, ExampleWrapperState> {\n\tstate: ExampleWrapperState = {\n\t\tcxhtml: '',\n\t\tprettify: true,\n\t\tisMediaReady: true,\n\t};\n\tfieldsetStyle: SerializedStyles = css({\n\t\tmarginTop: token('space.250'),\n\t});\n\tpreStyle: SerializedStyles = css({\n\t\twhiteSpace: 'pre-wrap',\n\t\twordBreak: 'break-all',\n\t});\n\tspinnerContainerStyle: SerializedStyles = css({\n\t\tpadding: token('space.250'),\n\t});\n\thandleChange = (editorActions: EditorActions): void => {\n\t\tthis.setState({ isMediaReady: false });\n\t\tconsole.log('Change');\n\t\teditorActions.getValue().then((value) => {\n\t\t\tconsole.log('Value has been resolved', value);\n\t\t\tthis.setState({\n\t\t\t\tisMediaReady: true,\n\t\t\t\tcxhtml: value,\n\t\t\t});\n\t\t});\n\t};\n\ttogglePrettify = (): void => {\n\t\tthis.setState({ prettify: !this.state.prettify });\n\t};\n\trender(): jsx.JSX.Element {\n\t\tconst xml = this.state.prettify ? pd.xml(this.state.cxhtml || '') : this.state.cxhtml || '';\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t<Example onChange={this.handleChange} />\n\t\t\t\t<fieldset css={fieldsetStyle}>\n\t\t\t\t\t<legend>\n\t\t\t\t\t\tCXHTML output ({\n\t\t\t\t\t\t<input type=\"checkbox\" checked={this.state.prettify} onChange={this.togglePrettify} />\n\t\t\t\t\t\t<span\n\t\t\t\t\t\t\tonClick={this.togglePrettify}\n\t\t\t\t\t\t\tonKeyDown={this.togglePrettify}\n\t\t\t\t\t\t\tcss={clickableSpan}\n\t\t\t\t\t\t\trole=\"button\"\n\t\t\t\t\t\t\ttabIndex={0}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t{' '}\n\t\t\t\t\t\t\tprettify\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t)\n\t\t\t\t\t</legend>\n\t\t\t\t\t{this.state.isMediaReady ? (\n\t\t\t\t\t\t<pre css={this.preStyle}>{xml}</pre>\n\t\t\t\t\t) : (\n\t\t\t\t\t\t<div css={this.spinnerContainerStyle}>\n\t\t\t\t\t\t\t<Spinner size=\"large\" />\n\t\t\t\t\t\t</div>\n\t\t\t\t\t)}\n\t\t\t\t</fieldset>\n\t\t\t</div>\n\t\t);\n\t}\n}",
		],
		props: [],
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
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactElement<any, string | React.JSXElementConstructor<any>>[]',
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
				name: 'emojiProvider',
				type: 'Promise<EmojiProvider>',
			},
			{
				name: 'errorReporterHandler',
				type: 'ErrorReportingHandler',
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
				name: 'isEditorModernisationEnabled',
				type: 'boolean',
			},
			{
				name: 'legacyImageUploadProvider',
				type: 'Promise<ImageUploadProvider>',
			},
			{
				name: 'macroProvider',
				type: 'Promise<MacroProvider>',
			},
			{
				name: 'maxHeight',
				type: 'number',
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
				name: 'persistScrollGutter',
				type: 'boolean',
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
				name: 'preset',
				type: 'EditorPresetBuilder<AllPluginNames[], AllEditorPresetPluginTypes[]>',
				isRequired: true,
			},
			{
				name: 'primaryToolbarComponents',
				type: 'ReactComponents | BeforeAndAfterToolbarComponents',
			},
			{
				name: 'primaryToolbarIconBefore',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>>',
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
				name: 'searchProvider',
				type: 'Promise<SearchProvider>',
			},
			{
				name: 'secondaryToolbarComponents',
				type: 'React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactElement<any, string | React.JSXElementConstructor<any>>[]',
			},
			{
				name: 'shouldFocus',
				type: 'boolean',
			},
			{
				name: 'skipValidation',
				type: 'boolean',
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
				name: 'useStickyToolbar',
				type: 'boolean | React.RefObject<HTMLElement> | { offsetTop: number; }',
				description:
					"@description\nEnables the sticky toolbar in the comment/standard editor.\nIf a boolean is specified and it's `true`, the sticky toolbar will be enabled, sticking to the top of the scroll parent.\nInstead a reference can be specified to an existing sticky toolbar on the page that the editor toolbar should stay below (experimental).\nif {offsetTop: number} is passed in, the toolbar is sticky and the toolbar's 'top' will be set to the offsetTop\nso the toolbar will sticks to `{offsetTop}` below the scroll parent.",
				defaultValue: 'undefined',
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
		name: 'JIRATransformer',
		package: '@atlaskit/editor-jira-transformer',
		description: "Editor JIRA transformer's",
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-jira-transformer', 'atlaskit'],
		category: 'editor',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { css, jsx } from '@emotion/react';\nimport { defaultSchema } from '@atlaskit/adf-schema/schema-default';\nimport { JSONTransformer } from '@atlaskit/editor-json-transformer';\nimport { token } from '@atlaskit/tokens';\nimport { JIRATransformer } from '../src';\nconst container = css({\n\t'#source, #output': {\n\t\tboxSizing: 'border-box',\n\t\tmargin: token('space.100'),\n\t\tpadding: token('space.100'),\n\t\twhiteSpace: 'pre-wrap',\n\t\twidth: '100%',\n\t\t'&:focus': {\n\t\t\toutline: 'none',\n\t\t},\n\t},\n\t'#source': {\n\t\theight: '80px',\n\t},\n\t'#output': {\n\t\tborder: `${token('border.width')} solid`,\n\t\tminHeight: '480px',\n\t},\n});\nconst jiraTransformer = new JIRATransformer(defaultSchema);\nconst adfTransformer = new JSONTransformer();\nfunction getADF(html: string) {\n\tconst pmNode = jiraTransformer.parse(html);\n\treturn adfTransformer.encode(pmNode);\n}\nexport interface State {\n\tsource: string;\n}\n// Ignored via go/ees005\nclass Example extends React.PureComponent<{}, State> {\n\tstate: State = { source: '' };\n\thandleChange = (evt: React.FormEvent<HTMLTextAreaElement>) => {\n\t\tthis.setState({ source: evt.currentTarget.value });\n\t};\n\trender() {\n\t\treturn (\n\t\t\t<div css={container}>\n\t\t\t\t{\n\t\t\t\t<textarea id=\"source\" onChange={this.handleChange} />\n\t\t\t\t<pre id=\"output\">{JSON.stringify(getADF(this.state.source), null, 2)}</pre>\n\t\t\t</div>\n\t\t);\n\t}\n}\nexport default (): jsx.JSX.Element => <Example />;",
		],
		props: [],
	},
	{
		name: 'JSONTransformer',
		package: '@atlaskit/editor-json-transformer',
		description: 'JSON transformer',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-json-transformer', 'atlaskit'],
		category: 'editor',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { css, jsx } from '@compiled/react';\n/* eslint-enable @typescript-eslint/consistent-type-imports */\nimport { getSchemaBasedOnStage } from '@atlaskit/adf-schema/schema-default';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { createDefaultPreset } from '@atlaskit/editor-core/preset-default';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport { gridPlugin } from '@atlaskit/editor-plugin-grid';\nimport { mediaPlugin } from '@atlaskit/editor-plugin-media';\nimport { layoutPlugin } from '@atlaskit/editor-plugins/layout';\nimport type { EditorView } from '@atlaskit/editor-prosemirror/view';\nimport { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';\nimport { token } from '@atlaskit/tokens';\nimport { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';\nimport { JSONTransformer } from '../src';\nconst container = css({\n\tdisplay: 'grid',\n\tgridTemplateColumns: '50% 50%',\n\t'#output': {\n\t\tborder: `${token('border.width.selected')} solid`,\n\t\tmarginTop: token('space.100'),\n\t\tmarginRight: token('space.100'),\n\t\tmarginBottom: token('space.100'),\n\t\tmarginLeft: token('space.100'),\n\t\tpaddingTop: token('space.100'),\n\t\tpaddingRight: token('space.100'),\n\t\tpaddingBottom: token('space.100'),\n\t\tpaddingLeft: token('space.100'),\n\t\twhiteSpace: 'pre-wrap',\n\t\tfontSize: 'xx-small',\n\t\t'&:focus': {\n\t\t\toutline: 'none',\n\t\t},\n\t\t'&:empty:not(:focus)::before': {\n\t\t\tcontent: 'attr(data-placeholder)',\n\t\t\tfontSize: '14px',\n\t\t},\n\t},\n});\nconst createPreset = () =>\n\tcreateDefaultPreset({\n\t\tfeatureFlags: { macroInteractionUpdates: true },\n\t\tpaste: {},\n\t\tappearance: 'comment',\n\t})\n\t\t.add(gridPlugin)\n\t\t.add(layoutPlugin)\n\t\t.add([\n\t\t\tmediaPlugin,\n\t\t\t{\n\t\t\t\tfeatureFlags: {\n\t\t\t\t\tmediaInline: true,\n\t\t\t\t},\n\t\t\t\tprovider: storyMediaProviderFactory(),\n\t\t\t\tallowMediaSingle: true,\n\t\t\t\tallowResizing: true,\n\t\t\t\tallowLinking: true,\n\t\t\t\tallowResizingInTables: true,\n\t\t\t\tallowAltTextOnImages: true,\n\t\t\t\tallowCaptions: true,\n\t\t\t\taltTextValidator: (value: string) => {\n\t\t\t\t\tconst errors = [];\n\t\t\t\t\t// Ignored via go/ees005\n\t\t\t\t\tif (!/^[A-Z]/g.test(value)) {\n\t\t\t\t\t\terrors.push('Please start with capital letter.');\n\t\t\t\t\t}\n\t\t\t\t\t// Ignored via go/ees005\n\t\t\t\t\tif (!/^[^\"<>&\\\\]*$/g.test(value)) {\n\t\t\t\t\t\terrors.push('Please remove special characters.');\n\t\t\t\t\t}\n\t\t\t\t\t// Ignored via go/ees005\n\t\t\t\t\tif (!/(\\w.+\\s).+/g.test(value)) {\n\t\t\t\t\t\terrors.push('Please use at least two words.');\n\t\t\t\t\t}\n\t\t\t\t\treturn errors;\n\t\t\t\t},\n\t\t\t},\n\t\t]);\nconst schema = getSchemaBasedOnStage('stage0');\nconst Layouts = (): jsx.JSX.Element => {\n\tconst [{ output }, setOutput] = React.useState<{ output: string }>({ output: '' });\n\tconst { current: transformer } = React.useRef(new JSONTransformer(schema));\n\tconst { preset } = usePreset(createPreset);\n\tconst handleChangeInTheEditor = React.useCallback(\n\t\t(editorView: EditorView) => {\n\t\t\tconst output = JSON.stringify(transformer.encode(editorView.state.doc), null, 2);\n\t\t\tsetOutput({ output });\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<div css={container}>\n\t\t\t<ComposableEditor\n\t\t\t\tappearance=\"comment\"\n\t\t\t\tpreset={preset}\n\t\t\t\tonChange={handleChangeInTheEditor}\n\t\t\t\ttaskDecisionProvider={Promise.resolve(getMockTaskDecisionResource())}\n\t\t\t/>\n\t\t\t<div\n\t\t\t\tid=\"output\"\n\t\t\t\tdata-placeholder=\"This is an empty document (or something has gone really wrong)\"\n\t\t\t>\n\t\t\t\t{output}\n\t\t\t</div>\n\t\t</div>\n\t);\n};\nexport default Layouts;",
		],
		props: [],
	},
	{
		name: 'MarkdownTransformer',
		package: '@atlaskit/editor-markdown-transformer',
		description: 'Editor Markdown transformer',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-markdown-transformer', 'atlaskit'],
		category: 'editor',
		examples: [],
		props: [],
	},
	{
		name: 'PerformanceMetrics',
		package: '@atlaskit/editor-performance-metrics',
		description:
			'Experimental code to track Editor Full Page performance on some particular scenarios',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-performance-metrics', 'atlaskit'],
		category: 'editor',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { useCallback, useEffect, useRef, useState } from 'react';\nimport { css, jsx } from '@compiled/react';\nconst isTriangular = (num: number) => {\n\tif (num < 0) {\n\t\treturn false;\n\t}\n\tlet sum = 0;\n\tfor (let n = 1; sum <= num; n++) {\n\t\tsum = sum + n;\n\t\tif (sum === num) {\n\t\t\treturn true;\n\t\t}\n\t}\n\treturn false;\n};\nconst nextPrime = (n: number): number => {\n\tlet candidate = n + 1;\n\twhile (!isPrime(candidate)) {\n\t\tcandidate++;\n\t}\n\treturn candidate;\n};\nconst isPrime = (num: number) => {\n\tif (num <= 1) {\n\t\treturn false;\n\t}\n\tfor (let i = 2; i < num; i++) {\n\t\tif (num % i === 0) {\n\t\t\treturn false;\n\t\t}\n\t}\n\treturn true;\n};\nconst invisibleStyles = css({\n\twidth: '400px',\n\theight: '300px',\n\tbackgroundColor: 'blue',\n\tposition: 'absolute',\n\tvisibility: 'hidden',\n});\nconst mainStyles = css({\n\tminWidth: '100vw',\n\tminHeight: '100vh',\n\tmaxHeight: '100vh',\n\tbackgroundColor: '#c0c2c23d',\n\tdisplay: 'grid',\n\tgridTemplateAreas: `\n    \"header   header\"\n    \"sidenav  content\"\n  `,\n\tgridTemplateColumns: '200px 1fr', // Sidebar width and content width\n\tgridTemplateRows: 'auto 1fr', // Header height and content height\n\tgridColumnGap: '0px',\n\tgridRowGap: '0px',\n});\nconst headerStyle = css({\n\tgridArea: 'header',\n\tdisplay: 'flex',\n\tjustifyContent: 'center',\n\talignItems: 'center',\n\tpadding: '10px',\n\tbackgroundColor: '#f0f0f0',\n});\nconst inputStyle = css({\n\twidth: '80%',\n\tpadding: '10px',\n\tfontSize: '16px',\n});\nconst sidebarStyle = css({\n\tgridArea: 'sidenav',\n\tdisplay: 'flex',\n\tflexDirection: 'column',\n\tbackgroundColor: '#e0e0e0',\n\tpadding: '10px',\n\toverflowY: 'auto',\n});\nconst buttonStyle = css({\n\tborder: 'none',\n\tborderRadius: '4px',\n\tpadding: '10px',\n\tmarginBottom: '5px',\n\tcursor: 'pointer',\n});\nconst triangularButtonStyle = css({\n\tborderColor: '#D496A7',\n\tborderStyle: 'solid',\n\tborderWidth: '2px',\n});\nconst contentStyle = css({\n\tgridArea: 'content',\n\toverflowY: 'auto',\n\tpadding: '10px',\n\tbackgroundColor: '#fff',\n});\nconst contentDivStyle = css({\n\tbackgroundColor: '#f9f9f9',\n\tpadding: '20px',\n\tmarginBottom: '10px',\n\tborderRadius: '4px',\n\tboxShadow: '0 0 5px rgba(0,0,0,0.1)',\n});\nconst randomNames = [\n\t'Aretha Franklin',\n\t'Stevie Wonder',\n\t'Whitney Houston',\n\t'Michael Jackson',\n\t'Beyoncé',\n\t'Prince',\n\t'Marvin Gaye',\n\t'Nina Simone',\n\t'Ray Charles',\n\t'Ella Fitzgerald',\n];\nconst primeContentDivStyle = css({\n\tbackgroundColor: '#e0f7fa',\n\tborderColor: '#00796b',\n\tborderStyle: 'solid',\n\tborderWidth: '2px',\n});\nconst InvibibleStuff = (props: { name: string }) => {\n\treturn (\n\t\t<div css={invisibleStyles} `}>\n\t\t\tYou should not see me\n\t\t</div>\n\t);\n};\nconst SectionContent = ({ isLoading }: { isLoading: boolean }) => {\n\tconst [toRender, setToRender] = useState(0);\n\tuseEffect(() => {\n\t\tif (isLoading) {\n\t\t\treturn;\n\t\t}\n\t\tlet i = 0;\n\t\tlet n = 0;\n\t\tlet id: NodeJS.Timeout;\n\t\tconst triggerNextUpdate = () => {\n\t\t\tid = setTimeout(() => {\n\t\t\t\tif (n >= 100 || i > 100) {\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\ti = nextPrime(i);\n\t\t\t\tn = Math.min(n + i, 100);\n\t\t\t\tsetToRender(n + 1);\n\t\t\t\t(window as any).__editor_metrics_tests_tick?.call();\n\t\t\t\trequestAnimationFrame(() => {\n\t\t\t\t\ttriggerNextUpdate();\n\t\t\t\t});\n\t\t\t}, 200);\n\t\t};\n\t\ttriggerNextUpdate();\n\t\treturn () => {\n\t\t\tclearTimeout(id);\n\t\t};\n\t}, [isLoading]);\n\tif (isLoading) {\n\t\treturn (\n\t\t\t<div id=\"no-content-yet\" >\n\t\t\t\tLOADING...\n\t\t\t</div>\n\t\t);\n\t}\n\treturn (\n\t\t<div\n\t\t\t\n\t\t\tclassName=\"slow-content-section\"\n\t\t>\n\t\t\t<InvibibleStuff name=\"after-fake-loading\" />\n\t\t\t{[...Array.from({ length: toRender }).keys()].map((i) => (\n\t\t\t\t<div\n\t\t\t\t\tkey={i}\n\t\t\t\t\tcss={[contentDivStyle, isPrime(i) && primeContentDivStyle]}\n\t\t\t\t\tdata-content\n\t\t\t\t\t`}\n\t\t\t\t\tdata-is-prime={isPrime(i)}\n\t\t\t\t>\n\t\t\t\t\tContent Div {i + 1}\n\t\t\t\t</div>\n\t\t\t))}\n\t\t</div>\n\t);\n};\nconst SideButton = ({\n\tname,\n\tindex,\n\tonFinished,\n}: {\n\tindex: number;\n\tname: string;\n\tonFinished: (i: number) => void;\n}) => {\n\tconst buttonRef = useRef<HTMLButtonElement | null>(null);\n\tconst forceLayoutShift = isTriangular(index);\n\tuseEffect(() => {\n\t\tif (!forceLayoutShift || !buttonRef.current) {\n\t\t\treturn;\n\t\t}\n\t\tconst timeoutId = setTimeout(() => {\n\t\t\tif (!buttonRef.current) {\n\t\t\t\treturn;\n\t\t\t}\n\t\t\t// yes, forced layout reflow for test purposes\n\t\t\tconst rect = buttonRef.current.getBoundingClientRect();\n\t\t\tconst height = rect.height;\n\t\t\tconst heightToIncrease = 1 + index / 10;\n\t\t\tbuttonRef.current.style.height = `${height * heightToIncrease}px`;\n\t\t\t(window as any).__editor_metrics_tests_tick?.call();\n\t\t\tsetTimeout(() => {\n\t\t\t\tonFinished(index);\n\t\t\t}, 200);\n\t\t}, 200 * index);\n\t\treturn () => {\n\t\t\tclearTimeout(timeoutId);\n\t\t};\n\t}, [index, forceLayoutShift, onFinished]);\n\tif (forceLayoutShift) {\n\t\treturn (\n\t\t\t<button\n\t\t\t\t`}\n\t\t\t\tref={buttonRef}\n\t\t\t\tcss={[buttonStyle, triangularButtonStyle]}\n\t\t\t>\n\t\t\t\t{name}\n\t\t\t</button>\n\t\t);\n\t}\n\treturn (\n\t\t<button `} css={buttonStyle}>\n\t\t\t{name}\n\t\t</button>\n\t);\n};\nexport default function Example(): JSX.Element {\n\tconst [inputValue, setInputValue] = useState('');\n\tconst [isLoading, setIsLoading] = useState(true);\n\tconst onButtonFinished = useCallback((i: number) => {\n\t\tif (i < 6) {\n\t\t\treturn;\n\t\t}\n\t\trequestAnimationFrame(() => {\n\t\t\t(window as any).__editor_metrics_tests_tick?.call();\n\t\t\tsetIsLoading(false);\n\t\t});\n\t}, []);\n\treturn (\n\t\t<main id=\"app-main\"  css={mainStyles}>\n\t\t\t<header  css={headerStyle}>\n\t\t\t\t<input\n\t\t\t\t\ttype=\"text\"\n\t\t\t\t\tcss={inputStyle}\n\t\t\t\t\tplaceholder=\"Type here...\"\n\t\t\t\t\tvalue={inputValue}\n\t\t\t\t\tonChange={(e) => setInputValue(e.target.value)}\n\t\t\t\t/>\n\t\t\t</header>\n\t\t\t<aside  css={sidebarStyle}>\n\t\t\t\t{randomNames.map((name, index) => (\n\t\t\t\t\t// Ignored via go/ees005\n\t\t\t\t\t<SideButton key={index} name={name} index={index} onFinished={onButtonFinished} />\n\t\t\t\t))}\n\t\t\t</aside>\n\t\t\t<section  css={contentStyle}>\n\t\t\t\t<InvibibleStuff name=\"before-fake-loading\" />\n\t\t\t\t<h1>My content go here</h1>\n\t\t\t\t<SectionContent isLoading={isLoading} />\n\t\t\t</section>\n\t\t</main>\n\t);\n}",
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { useLayoutEffect } from 'react';\nimport { jsx } from '@compiled/react';\nimport { FullPageBase } from '@af/editor-examples-helpers/example-presets';\nimport { getGlobalEditorMetricsObserver } from '@atlaskit/editor-performance-metrics';\nimport type { WindowWithEditorPerformanceGlobals } from '../__tests__/playwright/window-type';\nconst adf = {\n\tversion: 1,\n\ttype: 'doc',\n\tcontent: [\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tattrs: {\n\t\t\t\tlocalId: null,\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'link',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\thref: 'https://www.youtube.com/watch?v=eXsU_EUMWOE',\n\t\t\t\t\t\t\t\t__confluenceMetadata: null,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t\ttext: 'https://www.youtube.com/watch?v=eXsU_EUMWOE',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' ',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tattrs: {\n\t\t\t\tlocalId: null,\n\t\t\t},\n\t\t\tcontent: [\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\tmarks: [\n\t\t\t\t\t\t{\n\t\t\t\t\t\t\ttype: 'link',\n\t\t\t\t\t\t\tattrs: {\n\t\t\t\t\t\t\t\thref: 'https://en.wikipedia.org/wiki/Michael_Jordan',\n\t\t\t\t\t\t\t\t__confluenceMetadata: null,\n\t\t\t\t\t\t\t},\n\t\t\t\t\t\t},\n\t\t\t\t\t],\n\t\t\t\t\ttext: 'https://en.wikipedia.org/wiki/Michael_Jordan',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'date',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\ttimestamp: '1737590400000',\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'emoji',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tshortName: ':exploding_head:',\n\t\t\t\t\t\tid: '1f92f',\n\t\t\t\t\t\ttext: '🤯',\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' ',\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'mention',\n\t\t\t\t\tattrs: {\n\t\t\t\t\t\tid: '0',\n\t\t\t\t\t\tlocalId: '173a35ce-5e30-400c-8cfc-6043bece967d',\n\t\t\t\t\t\ttext: '',\n\t\t\t\t\t\taccessLevel: '',\n\t\t\t\t\t\tuserType: null,\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t\t{\n\t\t\t\t\ttype: 'text',\n\t\t\t\t\ttext: ' ',\n\t\t\t\t},\n\t\t\t],\n\t\t},\n\t\t{\n\t\t\ttype: 'blockCard',\n\t\t\tattrs: {\n\t\t\t\turl: null,\n\t\t\t\tdatasource: null,\n\t\t\t\twidth: null,\n\t\t\t\tlayout: null,\n\t\t\t\tdata: {\n\t\t\t\t\t'@context': 'https://www.w3.org/ns/activitystreams',\n\t\t\t\t\t'@type': 'Document',\n\t\t\t\t\tname: 'Welcome to Atlassian!',\n\t\t\t\t\turl: 'http://www.atlassian.com',\n\t\t\t\t},\n\t\t\t},\n\t\t},\n\t\t{\n\t\t\ttype: 'paragraph',\n\t\t\tattrs: {\n\t\t\t\tlocalId: null,\n\t\t\t},\n\t\t},\n\t],\n};\nexport default function Example(): JSX.Element {\n\tuseLayoutEffect(() => {\n\t\tconst perf = getGlobalEditorMetricsObserver();\n\t\tperf.onceNextIdle(({ idleAt, timelineBuffer }) => {\n\t\t\t(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests_ticks?.push(idleAt);\n\t\t\tconsole.log('LOL: perf.onceNextIdle', { idleAt, timelineBuffer }, performance.now());\n\t\t});\n\t}, []);\n\treturn (\n\t\t<main >\n\t\t\t<FullPageBase defaultValue={adf} />\n\t\t</main>\n\t);\n}",
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { useCallback, useEffect, useMemo, useState } from 'react';\nimport { css, jsx } from '@compiled/react';\nimport { PerformanceMetrics } from '@atlaskit/editor-performance-metrics/react';\nimport type { OnTTVC } from '@atlaskit/editor-performance-metrics/react';\nimport type { WindowWithEditorPerformanceGlobals } from '../__tests__/playwright/window-type';\nconst sectionOneStyle = css({\n\tbackgroundColor: '#FFB3BA', // Pastel Red\n\tgridArea: 'sectionOne',\n\theight: '100vh',\n});\nconst sectionTwoStyle = css({\n\tbackgroundColor: '#FFDFBA', // Pastel Orange\n\tgridArea: 'sectionTwo',\n\theight: '100vh',\n});\nconst sectionThreeStyle = css({\n\tbackgroundColor: '#FFFFBA', // Pastel Yellow\n\tgridArea: 'sectionThree',\n\theight: '100vh',\n});\nconst sectionFourStyle = css({\n\tbackgroundColor: '#BAFFC9', // Pastel Green\n\tgridArea: 'sectionFour',\n\theight: '100vh',\n});\nconst sectionFiveStyle = css({\n\tbackgroundColor: '#BAE1FF', // Pastel Blue\n\tgridArea: 'sectionFive',\n\theight: '100vh',\n});\nconst sectionSixStyle = css({\n\tbackgroundColor: '#E1BAFF', // Pastel Purple\n\tgridArea: 'sectionSix',\n\theight: '100vh',\n});\nconst sectionSevenStyle = css({\n\tbackgroundColor: '#FFB3E1', // Pastel Pink\n\tgridArea: 'sectionSeven',\n\theight: '100vh',\n});\nconst sectionEightStyle = css({\n\tbackgroundColor: '#D1BAFF', // Pastel Violet\n\tgridArea: 'sectionEight',\n\theight: '100vh',\n});\nconst sectionNineStyle = css({\n\tbackgroundColor: '#BAFFD1', // Pastel Mint\n\tgridArea: 'sectionNine',\n\theight: '100vh',\n});\nconst sectionTenStyle = css({\n\tbackgroundColor: '#BAF7FF', // Pastel Aqua\n\tgridArea: 'sectionTen',\n\theight: '100vh',\n});\n// Define style for the main App component using the `css` function\nconst appStyle = css({\n\tdisplay: 'grid',\n\tgridTemplateColumns: 'repeat(10, 1fr)',\n\tgridTemplateAreas: `\n\t\t\"sectionOne sectionTwo sectionThree sectionFour sectionFive sectionSix sectionSeven sectionEight sectionNine sectionTen\"\n\t`,\n\theight: '100vh',\n\tfontSize: '1.2em',\n});\n// Custom hook for visibility delay\nconst useCounterToVisible = (base: number) => {\n\tconst [visibleAt, setVisible] = useState<false | number>(false);\n\tuseEffect(() => {\n\t\tconst timer = setTimeout(() => {\n\t\t\tconst at = performance.now();\n\t\t\tsetVisible(at);\n\t\t}, base * 250);\n\t\treturn () => clearTimeout(timer);\n\t}, [base]);\n\treturn visibleAt;\n};\n// Define each section component using the custom hook\nconst SectionOne = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionOneStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionTwo = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionTwoStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionThree = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionThreeStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionFour = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionFourStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionFive = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionFiveStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionSix = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionSixStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionSeven = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionSevenStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionEight = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionEightStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionNine = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionNineStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\nconst SectionTen = ({ base, appCreatedAt }: { appCreatedAt: number; base: number }) => {\n\tconst visibleAt = useCounterToVisible(base);\n\tif (!visibleAt) {\n\t\treturn null;\n\t}\n\treturn (\n\t\t<div  css={sectionTenStyle}>\n\t\t\t<h2> Rendered at: {visibleAt.toFixed(2)} ms</h2>\n\t\t\t<h3> App created at: {appCreatedAt.toFixed(2)} ms</h3>\n\t\t</div>\n\t);\n};\n// Main App component\nexport default function Example(): JSX.Element {\n\tconst appCreatedAt = useMemo(() => performance.now(), []);\n\tconst [isTTVCReady, setIsTTVCReady] = useState(false);\n\tconst onTTVC: OnTTVC = useCallback(({ ttvc }) => {\n\t\tconsole.log('TTVC: ', ttvc, performance.now());\n\t\t(window as WindowWithEditorPerformanceGlobals).__editor_metrics_tests__calculated_ttvc = ttvc;\n\t\tsetIsTTVCReady(true);\n\t}, []);\n\treturn (\n\t\t<div  css={appStyle} data-is-ttvc-ready={isTTVCReady}>\n\t\t\t<PerformanceMetrics onTTVC={onTTVC} />\n\t\t\t<SectionOne base={1} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionTwo base={2} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionThree base={3} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionFour base={4} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionFive base={5} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionSix base={6} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionSeven base={7} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionEight base={8} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionNine base={9} appCreatedAt={appCreatedAt} />\n\t\t\t<SectionTen base={10} appCreatedAt={appCreatedAt} />\n\t\t</div>\n\t);\n}",
		],
		props: [
			{
				name: 'onTTAI',
				type: '(result: { idleAt: number; }) => void',
			},
			{
				name: 'onTTVC',
				type: '(result: { relativeTTVC: TTVCTargets; ttvc: TTVCTargets; }) => void',
			},
			{
				name: 'onUserLatency',
				type: '(result: { latency: LatencyPercentileTargets; }) => void',
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
		name: 'SlackTransformer',
		package: '@atlaskit/editor-slack-transformer',
		description: 'Editor Slack transformer',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-slack-transformer', 'atlaskit'],
		category: 'editor',
		examples: [],
		props: [],
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
		name: 'Toolbar',
		package: '@atlaskit/editor-toolbar',
		description:
			'A common toolbar component for editor-like interfaces, providing a container for buttons, dropdowns, and other controls.',
		status: 'general-availability',
		usageGuidelines: [
			'Use Toolbar to organize actions and controls for content editing.',
			'Supports grouping buttons and responsive behavior.',
			'Can be used as a primary toolbar or within specific sections of an interface.',
		],
		keywords: ['toolbar', 'editor', 'actions', 'controls', 'buttons'],
		category: 'interaction',
		examples: ['export default function Basic() {\n\treturn null;\n}'],
		props: [
			{
				name: 'actionSubject',
				type: 'string',
			},
			{
				name: 'actionSubjectId',
				type: 'string',
				description: 'Name of dropdown to identify in analytic events',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'label',
				type: 'string',
				description:
					"aria-label for the toolbar (No localisation needed as it won't be read by screen readers).\n\nuse case: query select the toolbar to position floating toolbar",
				isRequired: true,
			},
		],
	},
	{
		name: 'WikiMarkupTransformer',
		package: '@atlaskit/editor-wikimarkup-transformer',
		description: 'Wiki markup transformer for JIRA and Confluence',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'editor-wikimarkup-transformer', 'atlaskit'],
		category: 'editor',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { css, jsx } from '@emotion/react';\nimport { defaultSchema } from '@atlaskit/adf-schema/schema-default';\nimport { ProviderFactory } from '@atlaskit/editor-common/provider-factory';\nimport { JSONTransformer } from '@atlaskit/editor-json-transformer';\nimport { WikiMarkupTransformer } from '../src';\nimport { ReactRenderer } from '@atlaskit/renderer';\nimport { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';\nimport { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';\nimport { simpleMockProfilecardClient } from '@atlaskit/util-data-test/get-mock-profilecard-client';\nimport { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';\nimport { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';\nimport type { MentionProvider } from '@atlaskit/mention/types';\nimport type { Context } from '../src/interfaces';\nimport type { DocNode } from '@atlaskit/adf-schema';\nimport { token } from '@atlaskit/tokens';\nconst container = css({\n\tdisplay: 'grid',\n\tgridTemplateColumns: '33% 34% 33%',\n\t'#source, #output': {\n\t\tboxSizing: 'border-box',\n\t\tmargin: token('space.100'),\n\t\tpadding: token('space.100'),\n\t\twhiteSpace: 'pre-wrap',\n\t\twidth: '100%',\n\t\t'&:focus': {\n\t\t\toutline: 'none',\n\t\t},\n\t},\n\t'#source': {\n\t\theight: '80px',\n\t},\n\t'#output': {\n\t\tborder: `${token('border.width')} solid`,\n\t\tminHeight: '480px',\n\t},\n});\nconst MockProfileClient: any = simpleMockProfilecardClient();\nconst mentionProvider = Promise.resolve({\n\tshouldHighlightMention(mention: any) {\n\t\treturn mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE';\n\t},\n} as MentionProvider);\nconst mediaProvider = storyMediaProviderFactory();\nconst emojiProvider = getEmojiResource();\nconst taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());\nconst profilecardProvider = Promise.resolve({\n\tcloudId: 'DUMMY-CLOUDID',\n\tresourceClient: MockProfileClient,\n\tgetActions: (id: string) => {\n\t\tconst actions = [\n\t\t\t{\n\t\t\t\tlabel: 'Mention',\n\t\t\t\tcallback: () => console.log('profile-card:mention'),\n\t\t\t},\n\t\t\t{\n\t\t\t\tlabel: 'Message',\n\t\t\t\tcallback: () => console.log('profile-card:message'),\n\t\t\t},\n\t\t];\n\t\treturn id === '1' ? actions : actions.slice(0, 1);\n\t},\n});\nconst contextIdentifierProvider = storyContextIdentifierProviderFactory();\nconst providerFactory = ProviderFactory.create({\n\tmentionProvider,\n\tmediaProvider,\n\temojiProvider,\n\tprofilecardProvider,\n\ttaskDecisionProvider,\n\tcontextIdentifierProvider,\n});\nconst wikiTransformer = new WikiMarkupTransformer(defaultSchema);\nconst adfTransformer = new JSONTransformer();\nfunction getADF(wiki: string): DocNode {\n\tconst context: Context = {\n\t\ttokenErrCallback: (err, type) => console.log(err, type),\n\t\tconversion: {\n\t\t\tinlineCardConversion: {\n\t\t\t\t'ABC-10': 'https://instance.atlassian.net/browse/ABC-10',\n\t\t\t\t'ABC-20': 'https://instance.atlassian.net/browse/ABC-20',\n\t\t\t\t'ABC-30': 'https://instance.atlassian.net/browse/ABC-30',\n\t\t\t\t'ABC-40': 'https://instance.atlassian.net/browse/ABC-40',\n\t\t\t},\n\t\t\tmediaConversion: {\n\t\t\t\t'image.jpg': { transform: '1234' },\n\t\t\t},\n\t\t\tmentionConversion: {\n\t\t\t\t'accountId:9999': '9999',\n\t\t\t},\n\t\t},\n\t};\n\tconst pmNode = wikiTransformer.parse(wiki, context);\n\treturn adfTransformer.encode(pmNode) as DocNode;\n}\nexport interface State {\n\tsource: string;\n}\n// Ignored via go/ees005\nclass Example extends React.PureComponent<{}, State> {\n\tstate: State = { source: '' };\n\thandleChange = (evt: React.FormEvent<HTMLTextAreaElement>) => {\n\t\tthis.setState({ source: evt.currentTarget.value });\n\t};\n\trender() {\n\t\tconst doc = this.state.source ? getADF(this.state.source) : ('' as DocNode);\n\t\treturn (\n\t\t\t<div css={container}>\n\t\t\t\t{\n\t\t\t\t<textarea id=\"source\" onChange={this.handleChange} />\n\t\t\t\t<div id=\"output\">\n\t\t\t\t\t<ReactRenderer\n\t\t\t\t\t\tdocument={doc}\n\t\t\t\t\t\tdataProviders={providerFactory}\n\t\t\t\t\t\tschema={defaultSchema}\n\t\t\t\t\t\tmedia={{\n\t\t\t\t\t\t\tallowLinking: true,\n\t\t\t\t\t\t}}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<pre id=\"output\">{JSON.stringify(doc, null, 2)}</pre>\n\t\t\t</div>\n\t\t);\n\t}\n}\nexport default (): jsx.JSX.Element => <Example />;",
		],
		props: [],
	},
	{
		name: 'EmailSerializer',
		package: '@atlaskit/email-renderer',
		description: 'Email renderer',
		status: 'general-availability',
		usageGuidelines: [],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['editor', 'email-renderer', 'atlaskit'],
		category: 'editor',
		examples: [
			'import RendererDemo from \'./helper/RendererDemo\';\nexport default function Example(): React.JSX.Element {\n\treturn <RendererDemo serializer="email" />;\n}',
		],
		props: [],
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
				name: 'contentId',
				type: 'string',
				description:
					'The current Confluence page content id. When provided (and the\n`confluence_ai_generated_emojis` experiment is on), enables the\n"Create an emoji with Rovo" AI generation section in the upload flow.',
			},
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
		name: 'Help',
		package: '@atlaskit/help',
		description:
			'A cross-product help component that provides a unified interface for displaying articles, search, and AI-powered assistance.',
		status: 'general-availability',
		usageGuidelines: [
			'Use Help to provide in-product documentation and support to users.',
			'Supports displaying articles, searching help content, and AI-powered help features.',
			'Can be integrated into various parts of an application, such as a sidebar or a dedicated help page.',
		],
		keywords: ['help', 'support', 'documentation', 'articles', 'search', 'ai'],
		category: 'interaction',
		examples: [
			"import React, { useState } from 'react';\nimport { AnalyticsListener } from '@atlaskit/analytics-next';\nimport Page from '@atlaskit/page';\nimport Help, { ARTICLE_TYPE } from '../src';\nimport type { Article, articleId, HistoryItem } from '../src';\nimport { getArticle } from './utils/mockData';\nimport {\n\tExampleWrapper,\n\tHelpContainer,\n\tHelpWrapper,\n\tFooterContent,\n\tExampleDefaultContent,\n} from './utils/styled';\nconst handleEvent = (analyticsEvent: { context: any; payload: any }) => {\n\tconst { payload, context } = analyticsEvent;\n\tconsole.log('Received event:', { payload, context });\n};\nconst Example = (): React.JSX.Element => {\n\tconst [navigationData, setNavigationData] = useState<{\n\t\tarticleId: articleId;\n\t\thistory: HistoryItem[];\n\t}>({\n\t\tarticleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },\n\t\thistory: [],\n\t});\n\tconst navigationDataSetter = (navigationData: {\n\t\tarticleId: articleId;\n\t\thistory: HistoryItem[];\n\t}): void => {\n\t\tconsole.log('new navigation data');\n\t\tconsole.log(navigationData);\n\t\tsetNavigationData(navigationData);\n\t};\n\tconst onGetHelpArticle = (articleId: articleId): Promise<Article> => {\n\t\treturn new Promise((resolve) => resolve(getArticle(articleId.id)));\n\t};\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t<Page>\n\t\t\t\t<HelpContainer>\n\t\t\t\t\t<HelpWrapper>\n\t\t\t\t\t\t<AnalyticsListener channel=\"atlaskit\" onEvent={handleEvent}>\n\t\t\t\t\t\t\t<Help\n\t\t\t\t\t\t\t\tnavigation={{\n\t\t\t\t\t\t\t\t\tnavigationData,\n\t\t\t\t\t\t\t\t\tsetNavigationData: navigationDataSetter,\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\thelpArticle={{\n\t\t\t\t\t\t\t\t\tonGetHelpArticle,\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\tfooter={\n\t\t\t\t\t\t\t\t\t<FooterContent>\n\t\t\t\t\t\t\t\t\t\t<span>Footer</span>\n\t\t\t\t\t\t\t\t\t</FooterContent>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<ExampleDefaultContent>\n\t\t\t\t\t\t\t\t\t<span>Default content</span>\n\t\t\t\t\t\t\t\t</ExampleDefaultContent>\n\t\t\t\t\t\t\t</Help>\n\t\t\t\t\t\t</AnalyticsListener>\n\t\t\t\t\t</HelpWrapper>\n\t\t\t\t</HelpContainer>\n\t\t\t</Page>\n\t\t</ExampleWrapper>\n\t);\n};\nexport default Example;",
			"import React, { useState } from 'react';\nimport { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';\nimport ButtonGroup from '@atlaskit/button/button-group';\nimport Button from '@atlaskit/button/new';\nimport { type NotificationLogProvider } from '@atlaskit/notification-log-client';\nimport Page from '@atlaskit/page';\nimport Textfield from '@atlaskit/textfield';\nimport { token } from '@atlaskit/tokens';\nimport ShipIcon from '@atlaskit/icon/core/release';\nimport { Field, HelperMessage } from '@atlaskit/form';\nimport {\n\tExampleWrapper,\n\tHelpWrapper,\n\tControlsWrapper,\n\tButtonsWrapper,\n\tFooterContent,\n\tHelpContainer,\n} from './utils/styled';\nimport { useContentPlatformApi } from './utils/services/cpapi';\nimport { useAlgolia } from './utils/services/algolia';\nimport type { FilterConfiguration } from './utils/services/cpapi';\nimport Help, {\n\tRelatedArticles,\n\tARTICLE_TYPE,\n\tDividerLine,\n\ttype WHATS_NEW_ITEM_TYPES,\n} from '../src';\nimport type { ArticleItem, ArticleFeedback, articleId, WhatsNewArticle, HistoryItem } from '../src';\nconst SEARCH_EXTERNAL_URL = 'https://support.atlassian.com/';\nconst handleEvent = (analyticsEvent: { context: any; payload: any }) => {\n\tconst { payload, context } = analyticsEvent;\n\tconsole.log('Received event:', { payload, context });\n};\n// Mockup notification Promise\nclass MockNotificationLogClient implements NotificationLogProvider {\n\tpublic async countUnseenNotifications() {\n\t\treturn Promise.resolve({ count: 100 });\n\t}\n}\nconst notificationsClient = new MockNotificationLogClient();\nconst Footer = (\n\t<FooterContent>\n\t\t<span>Footer</span>\n\t</FooterContent>\n);\nconst Example = (): React.JSX.Element => {\n\tconst {\n\t\ttoken: articlesToken,\n\t\tsetToken: setArticlesToken,\n\t\tsearchWhatsNewArticles,\n\t\tgetWhatsNewArticle,\n\t} = useContentPlatformApi();\n\tconst [navigationData, setNavigationData] = useState<{\n\t\tarticleId: articleId;\n\t\thistory: HistoryItem[];\n\t}>({\n\t\tarticleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },\n\t\thistory: [],\n\t});\n\t// Algolia Values\n\tconst [routeGroup, setRouteGroup] = useState<string>('project-settings-software');\n\tconst [routeName, setRouteName] = useState<string | undefined>(\n\t\t'project-settings-software-access',\n\t);\n\tconst {\n\t\tgetArticleById,\n\t\tgetRelatedArticles,\n\t\tsearchArticles,\n\t\tproductName,\n\t\tsetProductName,\n\t\tproductExperience,\n\t\tsetProductExperience,\n\t\talgoliaIndexName,\n\t\tsetAlgoliaIndexName,\n\t} = useAlgolia({\n\t\tproductName: 'Jira Software',\n\t\tproductExperience: 'Team-managed',\n\t});\n\t// CPAPI values\n\tconst [fdIssueKeys, setFdIssueKeys] = useState<string>('');\n\tconst [fdIssueLinks, setFdIssueLinks] = useState<string>('');\n\tconst [productNames, setProductNames] = useState<string>('');\n\tconst [changeStatus, setChangeStatus] = useState<string>('');\n\tconst [featureRolloutDates, setFeatureRolloutDates] = useState<string>('');\n\tconst [releaseNoteFlags, setReleaseNoteFlags] = useState<string>('');\n\tconst [releaseNoteFlagOffValues, setReleaseNoteFlagOffValues] = useState<string>('');\n\tconst [showComponent, setShowComponent] = useState<boolean>(true);\n\tconst [algoliaParameters, setAlgoliaParameters] = useState({\n\t\trouteGroup,\n\t\trouteName,\n\t\talgoliaIndexName,\n\t\tproductName,\n\t\tproductExperience,\n\t});\n\tconst openDrawer = (articleId: string = '', type: ARTICLE_TYPE = ARTICLE_TYPE.HELP_ARTICLE) => {\n\t\tsetNavigationData({ articleId: { id: articleId, type }, history: [] });\n\t\tsetShowComponent(true);\n\t};\n\tconst closeDrawer = (): void => {\n\t\tsetNavigationData({\n\t\t\tarticleId: { id: '', type: ARTICLE_TYPE.HELP_ARTICLE },\n\t\t\thistory: [],\n\t\t});\n\t\tsetShowComponent(false);\n\t};\n\tconst handleOnSearchResultItemClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tarticleData: ArticleItem,\n\t) => {\n\t\tconsole.log('onSearchResultItemClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(articleData);\n\t\tanalyticsEvent.fire('help');\n\t};\n\tconst onSearchWhatsNewArticles = async (\n\t\tfilter: WHATS_NEW_ITEM_TYPES | '',\n\t\tnumberOfItems: number,\n\t\tpage: string = '',\n\t): Promise<any> => {\n\t\tconsole.log('onSearchWhatsNewArticles');\n\t\tlet filterConfig: FilterConfiguration = {};\n\t\tif (fdIssueKeys) {\n\t\t\tfilterConfig.fdIssueKeys = fdIssueKeys.split(',').map((value) => `\"${value}\"`);\n\t\t}\n\t\tif (fdIssueLinks) {\n\t\t\tfilterConfig.fdIssueLinks = fdIssueLinks.split(',').map((value) => `\"${value}\"`);\n\t\t}\n\t\tif (productNames) {\n\t\t\tfilterConfig.productNames = productNames.split(',').map((value) => `\"${value}\"`);\n\t\t}\n\t\tif (changeStatus) {\n\t\t\tfilterConfig.changeStatus = changeStatus.split(',').map((value) => `\"${value}\"`);\n\t\t}\n\t\tif (featureRolloutDates) {\n\t\t\tfilterConfig.featureRolloutDates = featureRolloutDates\n\t\t\t\t.split(',')\n\t\t\t\t.map((value) => `\"${value}\"`);\n\t\t}\n\t\tif (releaseNoteFlags) {\n\t\t\tfilterConfig.releaseNoteFlags = releaseNoteFlags.split(',').map((value) => `\"${value}\"`);\n\t\t}\n\t\tif (releaseNoteFlagOffValues) {\n\t\t\tfilterConfig.releaseNoteFlagOffValues = releaseNoteFlagOffValues.split(',');\n\t\t}\n\t\tif (filter !== '') {\n\t\t\tfilterConfig.changeTypes = [`\"${filter}\"`];\n\t\t}\n\t\treturn searchWhatsNewArticles(filterConfig, numberOfItems, page);\n\t};\n\tconst navigationDataSetter = (navigationData: {\n\t\tarticleId: articleId;\n\t\thistory: HistoryItem[];\n\t}): void => {\n\t\tconsole.log('new navigation data');\n\t\tconsole.log(navigationData);\n\t\tsetNavigationData(navigationData);\n\t};\n\tconst handleOnWasHelpfulNoButtonClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tArticleItem: ArticleItem,\n\t): void => {\n\t\tconsole.log('onWasHelpfulNoButtonClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(ArticleItem);\n\t\tanalyticsEvent.fire('help');\n\t};\n\tconst handleOnWasHelpfulYesButtonClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tArticleItem: ArticleItem,\n\t): void => {\n\t\tconsole.log('onWasHelpfulYesButtonClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(ArticleItem);\n\t\tanalyticsEvent.fire('help');\n\t};\n\tconst handleOnSearchInputChanged = (\n\t\tevent: React.KeyboardEvent<HTMLInputElement>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tvalue: string,\n\t) => {\n\t\tconsole.log('onSearchInputChanged');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(value);\n\t\tanalyticsEvent.fire('help');\n\t};\n\tconst handleOnSearchInputCleared = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => {\n\t\tconsole.log('onSearchInputCleared');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tanalyticsEvent.fire('help');\n\t};\n\tconst handleOnSearchExternalUrlClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => {\n\t\tconsole.log('onSearchExternalUrlClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tanalyticsEvent.fire('help');\n\t};\n\tconst handleOnCloseButtonClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => {\n\t\tconsole.log('onCloseButtonClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tanalyticsEvent.fire('help');\n\t\tcloseDrawer();\n\t};\n\tconst handleOnRelatedArticlesShowMoreClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tisCollapsed: boolean,\n\t) => {\n\t\tconsole.log('onRelatedArticlesShowMoreClickOfOpenArticle');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(isCollapsed);\n\t};\n\tconst handleOnWasHelpfulSubmit = (\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tarticleFeedback: ArticleFeedback,\n\t\tarticleData: ArticleItem,\n\t): Promise<boolean> => {\n\t\tconsole.log('OnWasHelpfulSubmit');\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(articleFeedback);\n\t\tconsole.log(articleData);\n\t\treturn new Promise((resolve, _rejects) => {\n\t\t\tlet wait = setTimeout(() => {\n\t\t\t\tclearTimeout(wait);\n\t\t\t\tresolve(true);\n\t\t\t}, 200);\n\t\t});\n\t};\n\tconst handleOnBackButtonClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => {\n\t\tconsole.log('onBackButtonClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tanalyticsEvent.fire('help');\n\t};\n\tconst handleOnRelatedArticlesListItemClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tarticleData: ArticleItem,\n\t) => {\n\t\tconsole.log('onRelatedArticlesListItemClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(articleData);\n\t};\n\tconst handleOnHelpArticleLoadingFailTryAgainButtonClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\tarticleId: articleId,\n\t) => {\n\t\tconsole.log('onHelpArticleLoadingFailTryAgainButtonClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(articleId);\n\t};\n\tconst handleOnWhatsNewButtonClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => {\n\t\tconsole.log('handleOnWhatsNewButtonClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t};\n\tconst handleOnSearchWhatsNewShowMoreClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t) => {\n\t\tconsole.log('handleOnSearchWhatsNewShowMoreClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t};\n\tconst handleOnWhatsNewResultItemClick = (\n\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\tanalyticsEvent: UIAnalyticsEvent,\n\t\twhatsNewArticleData: WhatsNewArticle,\n\t) => {\n\t\tconsole.log('handleOnWhatsNewResultItemClick');\n\t\tconsole.log(event);\n\t\tconsole.log(analyticsEvent);\n\t\tconsole.log(whatsNewArticleData);\n\t};\n\treturn (\n\t\t<AnalyticsListener channel=\"help\" onEvent={handleEvent}>\n\t\t\t<ExampleWrapper>\n\t\t\t\t<Page>\n\t\t\t\t\t<div\n\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\tdisplay: 'inline-block',\n\t\t\t\t\t\t\theight: '100vh',\n\t\t\t\t\t\t\tverticalAlign: 'top',\n\t\t\t\t\t\t\twidth: 'Calc(100% - 400px)',\n\t\t\t\t\t\t\tboxSizing: 'border-box',\n\t\t\t\t\t\t\tpadding: token('space.150'),\n\t\t\t\t\t\t\toverflow: 'auto',\n\t\t\t\t\t\t}}\n\t\t\t\t\t>\n\t\t\t\t\t\t<h2\n\t\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\t\twidth: 'Calc(100% - 400px)',\n\t\t\t\t\t\t\t\tpadding: `0 0 ${token('space.100')} ${token('space.200')}`,\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tHelp articles\n\t\t\t\t\t\t</h2>\n\t\t\t\t\t\t<ButtonsWrapper>\n\t\t\t\t\t\t\t<ButtonGroup>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={() => openDrawer()}>\n\t\t\t\t\t\t\t\t\tOpen drawer - no ID\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" type=\"button\" onClick={closeDrawer}>\n\t\t\t\t\t\t\t\t\tClose drawer\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={() => openDrawer('zl7jDsTshqNFSXgY8302f')}>\n\t\t\t\t\t\t\t\t\tOpen drawer - article 1\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={() => openDrawer('zhf8pCD3TzzP6uhO9X3WO')}>\n\t\t\t\t\t\t\t\t\tOpen drawer - article 2\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={() => openDrawer('11111111111111111111')}>\n\t\t\t\t\t\t\t\t\tOpen drawer - wrong id\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t\t</ButtonsWrapper>\n\t\t\t\t\t\t<h3\n\t\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\t\twidth: 'Calc(100% - 400px)',\n\t\t\t\t\t\t\t\tpadding: `${token('space.200')} 0 0 ${token('space.200')}`,\n\t\t\t\t\t\t\t\tmargin: token('space.0'),\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tHelp articles settings\n\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<ControlsWrapper>\n\t\t\t\t\t\t\t\t<Field label=\"Algolia Index\" name=\"algolia-index\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={algoliaParameters.algoliaIndexName}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetAlgoliaParameters({\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t...algoliaParameters,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\talgoliaIndexName: e.target.value,\n\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>e.g. : product_help_stg_copsi)</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t\t\t<ControlsWrapper>\n\t\t\t\t\t\t\t\t<Field label=\"Product Name\" name=\"product-name\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={algoliaParameters.productName}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetAlgoliaParameters({\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t...algoliaParameters,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tproductName: e.target.value,\n\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>e.g. : Jira Software</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t\t\t<ControlsWrapper>\n\t\t\t\t\t\t\t\t<Field label=\"Product Experience\" name=\"product-experience\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={algoliaParameters.productExperience}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetAlgoliaParameters({\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t...algoliaParameters,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tproductExperience: e.target.value,\n\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>e.g. : Team-managed</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t\t\t<ControlsWrapper>\n\t\t\t\t\t\t\t\t<Field label=\"Route Group\" name=\"route-group\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={algoliaParameters.routeGroup}\n\t\t\t\t\t\t\t\t\t\t\t\tname=\"route-group\"\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetAlgoliaParameters({\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t...algoliaParameters,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\trouteGroup: e.target.value,\n\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>e.g. : servicedesk</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t\t\t<ControlsWrapper>\n\t\t\t\t\t\t\t\t<Field label=\"Route Name\" name=\"route-name\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={algoliaParameters.routeName}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetAlgoliaParameters({\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t...algoliaParameters,\n\t\t\t\t\t\t\t\t\t\t\t\t\t\trouteName: e.target.value,\n\t\t\t\t\t\t\t\t\t\t\t\t\t})\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>e.g. : project/service-desk/settings/index</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<DividerLine />\n\t\t\t\t\t\t<h2\n\t\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\t\twidth: 'Calc(100% - 400px)',\n\t\t\t\t\t\t\t\tpadding: `${token('space.200')} 0 0 ${token('space.200')}`,\n\t\t\t\t\t\t\t\tmargin: token('space.0'),\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tRelease Notes\n\t\t\t\t\t\t</h2>\n\t\t\t\t\t\t<ButtonsWrapper>\n\t\t\t\t\t\t\t<ButtonGroup>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={() => openDrawer('', ARTICLE_TYPE.WHATS_NEW)}>\n\t\t\t\t\t\t\t\t\tOpen drawer - What's New\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t<Button\n\t\t\t\t\t\t\t\t\tappearance=\"primary\"\n\t\t\t\t\t\t\t\t\tonClick={() => openDrawer('11NZoqDJSUhapI6leC1M9C', ARTICLE_TYPE.WHATS_NEW)}\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\tOpen drawer - What's new Article\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t\t</ButtonsWrapper>\n\t\t\t\t\t\t<h3\n\t\t\t\t\t\t\tstyle={{\n\t\t\t\t\t\t\t\twidth: 'Calc(100% - 400px)',\n\t\t\t\t\t\t\t\tpadding: `${token('space.200')} 0 0 ${token('space.200')}`,\n\t\t\t\t\t\t\t\tmargin: token('space.0'),\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tHelp articles settings\n\t\t\t\t\t\t</h3>\n\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t<ControlsWrapper width=\"100%\">\n\t\t\t\t\t\t\t\t<Field label=\"Token\" name=\"token\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={articlesToken}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetArticlesToken(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tTo get your token you must be logged in in the Atlassian VPN and run in your\n\t\t\t\t\t\t\t\t\t\t\t\tterminal \"atlas slauth token --mfa -a content-platform-api -e staging -o\n\t\t\t\t\t\t\t\t\t\t\t\thttp\"\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t\t\t<ControlsWrapper>\n\t\t\t\t\t\t\t\t<Field label=\"FD Issue Key\" name=\"fd-issue-key\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={fdIssueKeys}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetFdIssueKeys(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tList of FD issue key (separate values with a \",\"). e.g. : FD-12345, FD-78902\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t\t<Field label=\"FD Issue Links\" name=\"fd-issue-links\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={fdIssueLinks}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetFdIssueLinks(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tList of FD issue links (separate values with a \",\"). e.g. :\n\t\t\t\t\t\t\t\t\t\t\t\thttps://hello.atlassian.net/browse/FD-12345\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t\t<Field label=\"Product names\" name=\"product-names\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={productNames}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetProductNames(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tList of product names (separate values with a \",\"). e.g. :\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t\t<Field label=\"Change status\" name=\"change-status\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={changeStatus}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetChangeStatus(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tList of change status (separate values with a \",\"). e.g. : Rolling out,\n\t\t\t\t\t\t\t\t\t\t\t\tComing soon\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t\t<Field label=\"featureRolloutDates\" name=\"feature-rollout-date\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={featureRolloutDates}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetFeatureRolloutDates(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tList of feature rollout dates (separate values with a \",\"). e.g. :\n\t\t\t\t\t\t\t\t\t\t\t\t2021-08-25, 2021-07-01\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t\t<Field label=\"releaseNoteFlags\" name=\"release-note-flags\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={releaseNoteFlags}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetReleaseNoteFlags(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tList of release note flags (separate values with a \",\"). e.g. :\n\t\t\t\t\t\t\t\t\t\t\t\thttps://app.launchdarkly.com/url-of-your-flag\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t\t<Field label=\"releaseNoteFlagOffValues\" name=\"release-note-flag-off-values\">\n\t\t\t\t\t\t\t\t\t{({ fieldProps }: any) => (\n\t\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t\t<Textfield\n\t\t\t\t\t\t\t\t\t\t\t\t{...fieldProps}\n\t\t\t\t\t\t\t\t\t\t\t\tvalue={releaseNoteFlagOffValues}\n\t\t\t\t\t\t\t\t\t\t\t\tonChange={(e: React.ChangeEvent<HTMLInputElement>) =>\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetReleaseNoteFlagOffValues(e.target.value)\n\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t<HelperMessage>\n\t\t\t\t\t\t\t\t\t\t\t\tList of release note flags with \"off\" values (separate values with a \",\").\n\t\t\t\t\t\t\t\t\t\t\t\te.g. : \"False\", \"Off\"\n\t\t\t\t\t\t\t\t\t\t\t</HelperMessage>\n\t\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\t</Field>\n\t\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<DividerLine />\n\t\t\t\t\t\t<ControlsWrapper>\n\t\t\t\t\t\t\t<Button\n\t\t\t\t\t\t\t\tappearance=\"primary\"\n\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\tcloseDrawer();\n\t\t\t\t\t\t\t\t\tsetRouteGroup(algoliaParameters.routeGroup);\n\t\t\t\t\t\t\t\t\tsetRouteName(algoliaParameters.routeName);\n\t\t\t\t\t\t\t\t\tsetProductName(algoliaParameters.productName);\n\t\t\t\t\t\t\t\t\tsetProductExperience(algoliaParameters.productExperience);\n\t\t\t\t\t\t\t\t\tsetAlgoliaIndexName(algoliaParameters.algoliaIndexName);\n\t\t\t\t\t\t\t\t\tsetTimeout(() => openDrawer(), 0);\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tSave\n\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t</ControlsWrapper>\n\t\t\t\t\t</div>\n\t\t\t\t\t{showComponent && (\n\t\t\t\t\t\t<HelpContainer>\n\t\t\t\t\t\t\t<HelpWrapper>\n\t\t\t\t\t\t\t\t<Help\n\t\t\t\t\t\t\t\t\tai={{\n\t\t\t\t\t\t\t\t\t\tisAiEnabled: true,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\thome={{\n\t\t\t\t\t\t\t\t\t\thomeOptions: [\n\t\t\t\t\t\t\t\t\t\t\t{\n\t\t\t\t\t\t\t\t\t\t\t\tid: 'test-button',\n\t\t\t\t\t\t\t\t\t\t\t\tonClick: (_id: string) => {\n\t\t\t\t\t\t\t\t\t\t\t\t\tconsole.log('test button');\n\t\t\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t\t\ttext: `Test Button`,\n\t\t\t\t\t\t\t\t\t\t\t\thref: 'https://www.google.com',\n\t\t\t\t\t\t\t\t\t\t\t\ticon: (\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ShipIcon\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tcolor={token('color.icon.subtle')}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tspacing=\"spacious\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlabel=\"\"\n\t\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t\t),\n\t\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t],\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\tfooter={Footer}\n\t\t\t\t\t\t\t\t\thelpArticle={{\n\t\t\t\t\t\t\t\t\t\tonGetHelpArticle: getArticleById,\n\t\t\t\t\t\t\t\t\t\tonHelpArticleLoadingFailTryAgainButtonClick:\n\t\t\t\t\t\t\t\t\t\t\thandleOnHelpArticleLoadingFailTryAgainButtonClick,\n\t\t\t\t\t\t\t\t\t\tonWasHelpfulSubmit: handleOnWasHelpfulSubmit,\n\t\t\t\t\t\t\t\t\t\tonWasHelpfulYesButtonClick: handleOnWasHelpfulYesButtonClick,\n\t\t\t\t\t\t\t\t\t\tonWasHelpfulNoButtonClick: handleOnWasHelpfulNoButtonClick,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\tnavigation={{\n\t\t\t\t\t\t\t\t\t\tnavigationData,\n\t\t\t\t\t\t\t\t\t\tsetNavigationData: navigationDataSetter,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\tsearch={{\n\t\t\t\t\t\t\t\t\t\tonSearch: searchArticles,\n\t\t\t\t\t\t\t\t\t\tonSearchInputChanged: handleOnSearchInputChanged,\n\t\t\t\t\t\t\t\t\t\tonSearchInputCleared: handleOnSearchInputCleared,\n\t\t\t\t\t\t\t\t\t\tonSearchResultItemClick: handleOnSearchResultItemClick,\n\t\t\t\t\t\t\t\t\t\tonSearchExternalUrlClick: handleOnSearchExternalUrlClick,\n\t\t\t\t\t\t\t\t\t\tsearchExternalUrl: SEARCH_EXTERNAL_URL,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\trelatedArticles={{\n\t\t\t\t\t\t\t\t\t\trouteGroup: routeGroup,\n\t\t\t\t\t\t\t\t\t\trouteName: routeName,\n\t\t\t\t\t\t\t\t\t\tonGetRelatedArticles: getRelatedArticles,\n\t\t\t\t\t\t\t\t\t\tonRelatedArticlesShowMoreClick: handleOnRelatedArticlesShowMoreClick,\n\t\t\t\t\t\t\t\t\t\tonRelatedArticlesListItemClick: handleOnRelatedArticlesListItemClick,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\twhatsNew={{\n\t\t\t\t\t\t\t\t\t\twhatsNewGetNotificationProvider: Promise.resolve(notificationsClient),\n\t\t\t\t\t\t\t\t\t\tproductName: 'Jira',\n\t\t\t\t\t\t\t\t\t\tonWhatsNewButtonClick: handleOnWhatsNewButtonClick,\n\t\t\t\t\t\t\t\t\t\tonSearchWhatsNewShowMoreClick: handleOnSearchWhatsNewShowMoreClick,\n\t\t\t\t\t\t\t\t\t\tonSearchWhatsNewArticles: onSearchWhatsNewArticles,\n\t\t\t\t\t\t\t\t\t\tonGetWhatsNewArticle: getWhatsNewArticle,\n\t\t\t\t\t\t\t\t\t\tonWhatsNewResultItemClick: handleOnWhatsNewResultItemClick,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\theader={{\n\t\t\t\t\t\t\t\t\t\tonCloseButtonClick: handleOnCloseButtonClick,\n\t\t\t\t\t\t\t\t\t\tonBackButtonClick: handleOnBackButtonClick,\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t<RelatedArticles\n\t\t\t\t\t\t\t\t\t\tonRelatedArticlesListItemClick={(\n\t\t\t\t\t\t\t\t\t\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\t\t\t\t\t\t\t\t\t\tanalytics: UIAnalyticsEvent,\n\t\t\t\t\t\t\t\t\t\t\tarticleData: ArticleItem,\n\t\t\t\t\t\t\t\t\t\t) => {\n\t\t\t\t\t\t\t\t\t\t\tconsole.log('onRelatedArticlesListItemClick');\n\t\t\t\t\t\t\t\t\t\t\tconsole.log(event);\n\t\t\t\t\t\t\t\t\t\t\tconsole.log(analytics);\n\t\t\t\t\t\t\t\t\t\t\tconsole.log(articleData);\n\t\t\t\t\t\t\t\t\t\t\tsetNavigationData({\n\t\t\t\t\t\t\t\t\t\t\t\t...navigationData,\n\t\t\t\t\t\t\t\t\t\t\t\tarticleId: {\n\t\t\t\t\t\t\t\t\t\t\t\t\tid: articleData.id,\n\t\t\t\t\t\t\t\t\t\t\t\t\ttype: ARTICLE_TYPE.HELP_ARTICLE,\n\t\t\t\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\tonRelatedArticlesShowMoreClick={(\n\t\t\t\t\t\t\t\t\t\t\tevent: React.MouseEvent<HTMLElement, MouseEvent>,\n\t\t\t\t\t\t\t\t\t\t\tanalytics: UIAnalyticsEvent,\n\t\t\t\t\t\t\t\t\t\t\tisCollapsed: boolean,\n\t\t\t\t\t\t\t\t\t\t) => {\n\t\t\t\t\t\t\t\t\t\t\tconsole.log('onRelatedArticlesShowMoreClick');\n\t\t\t\t\t\t\t\t\t\t\tconsole.log(event);\n\t\t\t\t\t\t\t\t\t\t\tconsole.log(analytics);\n\t\t\t\t\t\t\t\t\t\t\tconsole.log(isCollapsed);\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\tonGetRelatedArticles={getRelatedArticles}\n\t\t\t\t\t\t\t\t\t\trouteGroup={routeGroup}\n\t\t\t\t\t\t\t\t\t\trouteName={routeName}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</Help>\n\t\t\t\t\t\t\t</HelpWrapper>\n\t\t\t\t\t\t</HelpContainer>\n\t\t\t\t\t)}\n\t\t\t\t</Page>\n\t\t\t</ExampleWrapper>\n\t\t</AnalyticsListener>\n\t);\n};\nexport default Example;",
		],
		props: [
			{
				name: 'ai',
				type: '{ isAiEnabled?: boolean; onAiTabClicked?(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent): void; onSearchTabClicked?(event: MouseEvent<...>, analyticsEvent: UIAnalyticsEvent): void; }',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'footer',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'header',
				type: '{ onBackButtonClick?(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent): void; onCloseButtonClick?(event: MouseEvent<...>, analyticsEvent: UIAnalyticsEvent): void; }',
			},
			{
				name: 'helpArticle',
				type: '{ onGetHelpArticle?(articleId: articleId): Promise<Article>; onHelpArticleLoadingFailTryAgainButtonClick?(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent, articleId: articleId): void; onWasHelpfulNoButtonClick?(event: MouseEvent<...>, analyticsEvent: UIAnalyticsEvent, ArticleI...',
			},
			{
				name: 'home',
				type: '{ homeOptions?: Props[]; }',
			},
			{
				name: 'navigation',
				type: '{ navigationData?: { articleId: articleId; history: HistoryItem[]; }; setNavigationData?(navigationData: { articleId?: articleId; history?: HistoryItem[]; }): void; }',
			},
			{
				name: 'relatedArticles',
				type: '{ onGetRelatedArticles?(routeGroup?: string, routeName?: string): Promise<ArticleItem[]>; onRelatedArticlesListItemClick?: (event: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent, articleData: ArticleItem) => void; onRelatedArticlesShowMoreClick?(event: MouseEvent<...>, analyticsEven...',
			},
			{
				name: 'search',
				type: '{ onSearch?(value: string): Promise<ArticleItem[]>; onSearchExternalUrlClick?(event?: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent?: UIAnalyticsEvent): void; ... 5 more ...; searchOnEnterKeyPress?: boolean; }',
			},
			{
				name: 'whatsNew',
				type: '{ onGetWhatsNewArticle?(id: articleId): Promise<WhatsNewArticle>; onSearchWhatsNewArticles?(filter?: "" | WHATS_NEW_ITEM_TYPES, numberOfItems?: number, page?: string): Promise<...>; ... 4 more ...; whatsNewGetNotificationProvider?: Promise<...>; }',
			},
		],
	},
	{
		name: 'HelpArticle',
		package: '@atlaskit/help-article',
		description:
			'A component for displaying help articles with support for various content formats.',
		status: 'general-availability',
		usageGuidelines: [
			'Use HelpArticle to display the content of a single help article.',
			'Supports different body formats, including ADF (Atlassian Document Format).',
		],
		keywords: ['help', 'article', 'content', 'documentation', 'adf'],
		category: 'data-display',
		examples: [
			'import Button from \'@atlaskit/button/new\';\nimport { token } from \'@atlaskit/tokens\';\nimport HelpArticle from \'../src\';\ninterface Props {}\ninterface State {\n\t// Article Content\n\tbody?: string;\n}\nexport default class extends React.Component<Props, State> {\n\tconstructor(props: any) {\n\t\tsuper(props);\n\t\tthis.state = {\n\t\t\tbody: \'<p><a href="https://www.atlassian.com/" target="_blank">Atlassian</a> Quisque eros orci, sagittis, ultrices varius dolor. Nunc mi leo, accumsan id massa nec, commodo placerat libero. Phasellus ullamcorper ligula facilisis massa tempor auctor. Praesent malesuada, eros sit amet posuere rutrum, justo ex tempor dui, at suscipit metus lacus non dui. Phasellus vehicula urna eu rhoncus sagittis. Integer at risus molestie, rutrum nibh nec, vehicula lacus. Nulla mollis dictum felis vitae facilisis. Nam faucibus non orci eget gravida. <a href="https://www.atlassian.com/" target="_blank">Atlassian</a></<a>\',\n\t\t};\n\t}\n\tchangeContent(): void {\n\t\tthis.setState({\n\t\t\tbody: \'<p>before image</p> <img src="https://via.placeholder.com/600x600.png/" class="page-list__image" alt="LoremFlickr placeholder image"/> <p>after image</p>\',\n\t\t});\n\t}\n\trender(): React.JSX.Element {\n\t\treturn (\n\t\t\t<div style={{ padding: token(\'space.100\') }}>\n\t\t\t\t<HelpArticle title="Article Title" body={this.state.body} />\n\t\t\t\t<Button type="button" onClick={() => this.changeContent()}>\n\t\t\t\t\tChange content\n\t\t\t\t</Button>\n\t\t\t</div>\n\t\t);\n\t}\n}',
			"import Button from '@atlaskit/button/new';\nimport { token } from '@atlaskit/tokens';\nimport HelpArticle, { BODY_FORMAT_TYPES } from '../src';\nimport type { AdfDoc } from '../src';\nimport { AdfDocument, AdfDocumentComplex } from './utils/mockData';\nconst dataExamples = [\n\t{\n\t\tbodyFormat: BODY_FORMAT_TYPES.adf,\n\t\tbody: AdfDocument,\n\t},\n\t{\n\t\tbodyFormat: BODY_FORMAT_TYPES.adf,\n\t\tbody: AdfDocumentComplex,\n\t},\n\t{\n\t\tbodyFormat: BODY_FORMAT_TYPES.html,\n\t\tbody: '<p>before image</p> <img src=\"https://via.placeholder.com/600x600.png/\" class=\"page-list__image\" alt=\"LoremFlickr placeholder image\"/> <p>after image</p>',\n\t},\n];\ninterface Props {}\ninterface State {\n\t// Article Content\n\tbody?: string | AdfDoc;\n\tbodyFormat: BODY_FORMAT_TYPES;\n}\nexport default class extends React.Component<Props, State> {\n\tcurrentExample = 0;\n\tconstructor(props: any) {\n\t\tsuper(props);\n\t\tthis.state = dataExamples[this.currentExample];\n\t}\n\tchangeContent(): void {\n\t\tthis.currentExample =\n\t\t\tthis.currentExample + 1 < dataExamples.length ? this.currentExample + 1 : 0;\n\t\tthis.setState(dataExamples[this.currentExample]);\n\t}\n\trender(): React.JSX.Element {\n\t\treturn (\n\t\t\t<div style={{ padding: token('space.100') }}>\n\t\t\t\t<HelpArticle\n\t\t\t\t\ttitle=\"Article Title\"\n\t\t\t\t\tbody={this.state.body}\n\t\t\t\t\tbodyFormat={this.state.bodyFormat}\n\t\t\t\t/>\n\t\t\t\t<Button type=\"button\" onClick={() => this.changeContent()}>\n\t\t\t\t\tChange content\n\t\t\t\t</Button>\n\t\t\t</div>\n\t\t);\n\t}\n}",
		],
		props: [
			{
				name: 'body',
				type: 'string | AdfDoc',
			},
			{
				name: 'bodyFormat',
				type: 'BODY_FORMAT_TYPES',
			},
			{
				name: 'onArticleRenderBegin',
				type: '() => void',
			},
			{
				name: 'onArticleRenderDone',
				type: '() => void',
			},
			{
				name: 'title',
				type: 'string',
			},
			{
				name: 'titleLinkUrl',
				type: 'string',
			},
		],
	},
	{
		name: 'HelpLayout',
		package: '@atlaskit/help-layout',
		description:
			'A layout component for help content, providing a consistent structure for help panels and pages.',
		status: 'general-availability',
		usageGuidelines: [
			'Use HelpLayout to provide a consistent structure for help-related content.',
			'Typically used as a container for help articles, search results, and other help components.',
		],
		keywords: ['help', 'layout', 'structure', 'panel', 'container'],
		category: 'layout',
		examples: [
			"import { AnalyticsListener } from '@atlaskit/analytics-next';\nimport Page from '@atlaskit/page';\nimport LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';\nimport HelpLayout from '../src/index';\nimport { ExampleWrapper, HelpWrapper, FooterContent, ExampleDefaultContent } from './utils/styled';\nconst handleEvent = (analyticsEvent: { context: any; payload: any }) => {\n\tconst { payload, context } = analyticsEvent;\n\tconsole.log('Received event:', { payload, context });\n};\nconst Example = (): React.JSX.Element => {\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t<Page>\n\t\t\t\t<HelpWrapper>\n\t\t\t\t\t<AnalyticsListener channel=\"atlaskit\" onEvent={handleEvent}>\n\t\t\t\t\t\t<LocaleIntlProvider locale={'en'}>\n\t\t\t\t\t\t\t<HelpLayout\n\t\t\t\t\t\t\t\theaderTitle=\"Header Title\"\n\t\t\t\t\t\t\t\tisBackbuttonVisible={true}\n\t\t\t\t\t\t\t\tonCloseButtonClick={() => console.log('close')}\n\t\t\t\t\t\t\t\tfooter={\n\t\t\t\t\t\t\t\t\t<FooterContent>\n\t\t\t\t\t\t\t\t\t\t<span>Footer</span>\n\t\t\t\t\t\t\t\t\t</FooterContent>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t<ExampleDefaultContent>\n\t\t\t\t\t\t\t\t\t<span>Default content</span>\n\t\t\t\t\t\t\t\t</ExampleDefaultContent>\n\t\t\t\t\t\t\t</HelpLayout>\n\t\t\t\t\t\t</LocaleIntlProvider>\n\t\t\t\t\t</AnalyticsListener>\n\t\t\t\t</HelpWrapper>\n\t\t\t</Page>\n\t\t</ExampleWrapper>\n\t);\n};\nexport default Example;",
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'footer',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'headerContent',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'headerTitle',
				type: 'string',
			},
			{
				name: 'isAiEnabled',
				type: 'boolean',
			},
			{
				name: 'isBackbuttonVisible',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				type: 'boolean',
			},
			{
				name: 'onBackButtonClick',
				type: '(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onCloseButtonClick',
				type: '(event: MouseEvent<HTMLElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
			},
			{
				name: 'onLoad',
				type: '() => void',
			},
			{
				name: 'sideNavTabs',
				type: 'SideNavTab[]',
			},
		],
	},
	{
		name: 'FileTypeIcon',
		package: '@atlaskit/icon-file-type',
		description:
			'Icons used to represent specific file types (e.g., PDF, Word, Image) across Atlassian products.',
		status: 'general-availability',
		usageGuidelines: [
			'Use FileTypeIcon to visually represent the type of a file or attachment.',
			'Icons are available in different sizes (small, medium, large, xlarge).',
			'Can be used as a standalone icon or within other components like MediaTable.',
		],
		keywords: ['icon', 'file-type', 'attachment', 'visual-representation'],
		category: 'media',
		examples: [
			'// because icons are imported from absolute paths, this path is\n// not how you will consume it.\n// The path for you is `@atlaskit/icon-file-interface/glyph/audio/16`\nimport AudioIcon16 from \'../glyph/audio/16\';\nimport AudioIcon24 from \'../glyph/audio/24\';\nimport AudioIcon48 from \'../glyph/audio/48\';\nexport default (): React.JSX.Element => (\n\t<div>\n\t\t<AudioIcon48 label="audioicon 48" />\n\t\t<AudioIcon24 label="audioicon 24" />\n\t\t<AudioIcon16 label="audioicon 16" />\n\t</div>\n);',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					"The content to be rendered inside the glyph component.\nOnly for legacy icons that used R16's implicit children prop.\nIt doesn't actually serve any purpose, but is required to resolve R18 type errors\nwithout updating all the legacy icon usages.",
			},
			{
				name: 'glyph',
				type: 'ComponentClass<CustomGlyphProps, any> | FunctionComponent<CustomGlyphProps>',
				description:
					'Custom icon component that returns an SVG element with set `viewBox`,\n`width`, and `height` props.',
			},
			{
				name: 'isFacadeDisabled',
				type: 'boolean',
				description: 'Used to opt out of the icon facade.',
			},
			{
				name: 'label',
				type: 'string',
				description: 'Text used to describe what the icon is in context.',
				isRequired: true,
			},
			{
				name: 'primaryColor',
				type: 'string',
				description: 'Primary color for the icon.\nInherits the current font color by default.',
			},
			{
				name: 'secondaryColor',
				type: 'string',
				description:
					'Secondary color for the icon.\nDefaults to the page background for an icon that supports two colors.',
			},
			{
				name: 'size',
				type: '"small" | "medium" | "large" | "xlarge"',
				description:
					'There are three icon sizes – small (16px), medium (24px), and large (32px).\nThis pixel size refers to the canvas the icon sits on,\nnot the size of the icon shape itself.',
			},
		],
	},
	{
		name: 'JQLEditor',
		package: '@atlaskit/jql-editor',
		description:
			'An advanced JQL (Jira Query Language) editor component with autocomplete, syntax highlighting, and validation support.',
		status: 'general-availability',
		usageGuidelines: [
			'Use JQLEditor to enable users to author and validate JQL queries.',
			'Provides autocomplete suggestions for fields, operators, and values.',
			'Supports asynchronous loading of the editor and its dependencies.',
		],
		keywords: ['jql', 'editor', 'jira', 'query', 'autocomplete', 'search'],
		category: 'interaction',
		examples: [
			"import React, { useCallback } from 'react';\nimport { action } from '@storybook/addon-actions';\nimport {\n\ttype GetAutocompleteInitialData,\n\ttype GetAutocompleteSuggestions,\n\tuseAutocompleteProvider,\n} from '@atlaskit/jql-editor-autocomplete-rest';\nimport { jqlFieldsMock, jqlFunctionsMock, jqlValuesMock } from '../examples-utils/data';\nimport { Container } from '../examples-utils/styled';\nimport { JQLEditor } from '../src';\nconst getAutocompleteInitialData: GetAutocompleteInitialData = () =>\n\t// Simulate fetching initial data from an API\n\tnew Promise((resolve) => {\n\t\tsetTimeout(\n\t\t\t() =>\n\t\t\t\tresolve({\n\t\t\t\t\tjqlFields: jqlFieldsMock,\n\t\t\t\t\tjqlFunctions: jqlFunctionsMock,\n\t\t\t\t}),\n\t\t\t150,\n\t\t);\n\t});\nconst getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>\n\t// Simulate fetching autocomplete suggestions from an API\n\tnew Promise((resolve) => {\n\t\tsetTimeout(\n\t\t\t() =>\n\t\t\t\tresolve({\n\t\t\t\t\tresults: jqlValuesMock,\n\t\t\t\t}),\n\t\t\t150,\n\t\t);\n\t});\nexport default (): React.JSX.Element => {\n\tconst autocompleteProvider = useAutocompleteProvider(\n\t\t'my-app',\n\t\tgetAutocompleteInitialData,\n\t\tgetAutocompleteSuggestions,\n\t);\n\tconst onSearch = useCallback((jql: string) => {\n\t\t// Do some action on search\n\t\tconsole.log(jql);\n\t}, []);\n\treturn (\n\t\t<Container>\n\t\t\t<JQLEditor\n\t\t\t\tanalyticsSource={'my-app'}\n\t\t\t\tautocompleteProvider={autocompleteProvider}\n\t\t\t\tquery={'issuetype = bug order by rank'}\n\t\t\t\tlocale={'en'}\n\t\t\t\tonSearch={onSearch}\n\t\t\t\tonFocus={action('onFocus')}\n\t\t\t/>\n\t\t</Container>\n\t);\n};",
			"import React, { useCallback } from 'react';\nimport {\n\ttype GetAutocompleteInitialData,\n\ttype GetAutocompleteSuggestions,\n\tuseAutocompleteProvider,\n} from '@atlaskit/jql-editor-autocomplete-rest';\nimport {\n\tjqlFieldsMock,\n\tjqlFunctionsMock,\n\tjqlValuesMock,\n\tmockAvatarUrl,\n} from '../examples-utils/data';\nimport { Container } from '../examples-utils/styled';\nimport { type HydratedUser, type HydratedValues, JQLEditor } from '../src';\nconst getAutocompleteInitialData: GetAutocompleteInitialData = () =>\n\t// Simulate fetching initial data from an API\n\tnew Promise((resolve) => {\n\t\tsetTimeout(\n\t\t\t() =>\n\t\t\t\tresolve({\n\t\t\t\t\tjqlFields: jqlFieldsMock,\n\t\t\t\t\tjqlFunctions: jqlFunctionsMock,\n\t\t\t\t}),\n\t\t\t150,\n\t\t);\n\t});\nconst getAutocompleteSuggestions: GetAutocompleteSuggestions = () =>\n\t// Simulate fetching autocomplete suggestions from an API\n\tnew Promise((resolve) => {\n\t\tsetTimeout(\n\t\t\t() =>\n\t\t\t\tresolve({\n\t\t\t\t\tresults: jqlValuesMock,\n\t\t\t\t}),\n\t\t\t150,\n\t\t);\n\t});\nconst onHydrate = (jql: string): Promise<HydratedValues> =>\n\t// Simulate fetching hydrated user data from an API including agents\n\tnew Promise((resolve) => {\n\t\tsetTimeout(() => {\n\t\t\tconst hydratedUsers: HydratedUser[] = [];\n\t\t\t// Regular user (human user)\n\t\t\tif (jql.includes('john-doe')) {\n\t\t\t\thydratedUsers.push({\n\t\t\t\t\ttype: 'user',\n\t\t\t\t\tid: 'john-doe',\n\t\t\t\t\tname: 'John Doe',\n\t\t\t\t\tavatarUrl: mockAvatarUrl,\n\t\t\t\t});\n\t\t\t}\n\t\t\t// Agent\n\t\t\tif (jql.includes('agent-id')) {\n\t\t\t\thydratedUsers.push({\n\t\t\t\t\ttype: 'user',\n\t\t\t\t\tid: 'agent-id',\n\t\t\t\t\tname: 'AI Agent',\n\t\t\t\t\tavatarUrl: mockAvatarUrl,\n\t\t\t\t\tappType: 'agent',\n\t\t\t\t});\n\t\t\t}\n\t\t\tresolve({\n\t\t\t\tassignee: hydratedUsers,\n\t\t\t\treporter: hydratedUsers,\n\t\t\t});\n\t\t}, 300);\n\t});\nexport default (): React.JSX.Element => {\n\tconst autocompleteProvider = useAutocompleteProvider(\n\t\t'my-app',\n\t\tgetAutocompleteInitialData,\n\t\tgetAutocompleteSuggestions,\n\t);\n\tconst onSearch = useCallback((jql: string) => {\n\t\t// Do some action on search\n\t\tconsole.log(jql);\n\t}, []);\n\treturn (\n\t\t<Container>\n\t\t\t<JQLEditor\n\t\t\t\tanalyticsSource={'my-app'}\n\t\t\t\tautocompleteProvider={autocompleteProvider}\n\t\t\t\tquery={'assignee in (john-doe, agent-id) AND reporter in (agent-id)'}\n\t\t\t\tlocale={'en'}\n\t\t\t\tonSearch={onSearch}\n\t\t\t\tenableRichInlineNodes\n\t\t\t\tonHydrate={onHydrate}\n\t\t\t/>\n\t\t</Container>\n\t);\n};",
		],
		props: [
			{
				name: 'analyticsSource',
				type: 'string',
				description:
					'Page/experience where the component is being rendered. Used to correlate JQL analytics events to a given consumer.',
				isRequired: true,
			},
			{
				name: 'autocompleteProvider',
				type: '{ onFields: (query?: string, clause?: JQLClause) => Observable<AutocompleteOptions>; onFunctionArguments?: (fieldName: string, fieldValue: string, functionName: string) => Observable<...>; onFunctions: (query?: string, field?: string, isListOperator?: boolean) => Observable<...>; onOperators: (query?: string, field?...',
				description: 'Provider object to fetch autocomplete data.',
				isRequired: true,
			},
			{
				name: 'customComponents',
				type: '{ ErrorMessage?: CustomErrorComponent; }',
				description: 'Custom components to take over the rendering of certain parts of JQL editor',
			},
			{
				name: 'defaultRows',
				type: 'number',
				description: 'The number of default rows that are visible.',
			},
			{
				name: 'enableRichInlineNodes',
				type: 'boolean',
				description:
					'Enables rich inline nodes feature, which will replace user identifiers with a lozenge containing name and avatar.\nNote that you must specify an `onHydrate` prop which will return user data for a given query in order to see the\nfollowing behaviour:\n - Loading of user avatars\n - Rendering of user lozenges on component initialisation\n - Rendering of user lozenges on paste',
			},
			{
				name: 'inputRef',
				type: '((instance: { focus: () => void; }) => void) | React.RefObject<{ focus: () => void; }>',
				description: 'Ref callback to force the focus event',
			},
			{
				name: 'isCompact',
				type: 'boolean',
				description:
					'`false` matches the Atlaskit default field styling\n`true` matches the Atlaskit compact field styling, generally used for search purposes.',
			},
			{
				name: 'isSearching',
				type: 'boolean',
				description: 'Flag to enable the searching indicator when a JQL search is in progress.',
			},
			{
				name: 'locale',
				type: 'string',
				description:
					'React-intl locale. This should be set to "en" if alternate message sets are not being loaded higher in the React\ntree.',
			},
			{
				name: 'messages',
				type: 'ExternalMessage[]',
				description: 'Custom messages to display.',
			},
			{
				name: 'onDebugUnsafeMessage',
				type: '(message: string, event: { [key: string]: string | number | boolean | void; }) => void',
				description:
					'Called when we want to debug a particular error or action that has occurred within the editor. The message may\ncontain PII, and as such consumers should treat as a privacy unsafe error.',
			},
			{
				name: 'onEditorMounted',
				type: '() => void',
				description: 'Called when the JQL editor has been initialised.',
			},
			{
				name: 'onFocus',
				type: '(e: React.FocusEvent<HTMLElement, Element>) => void',
				description: 'Called when the editor input is focused.',
			},
			{
				name: 'onHydrate',
				type: '(query: string) => Promise<HydratedValues>',
				description: 'Called every time the editor needs to hydrate values for the current query.',
			},
			{
				name: 'onRenderError',
				type: '(error: Error) => void',
				description: 'Called if an unexpected error is thrown while rendering the editor.',
			},
			{
				name: 'onSearch',
				type: '(query: string, jast: Jast) => void',
				description:
					'Called every time the search command is given in the editor with the current query value and respective Jast object.\nIf not passed, hides the search button/other search related functionality, allowing this to be usable as a form field.',
			},
			{
				name: 'onSyntaxHelp',
				type: '(e: React.MouseEvent<HTMLElement, MouseEvent>) => boolean',
				description:
					'Called when the syntax help button is clicked. Consumers can return `true` to signify that this event has been\nhandled which will prevent default behaviour of the help button, i.e. `e.preventDefault()`.',
			},
			{
				name: 'onUpdate',
				type: '(query: string, jast: Jast) => void',
				description:
					'Called every time the editor is updated with the current query value and respective Jast object.',
			},
			{
				name: 'query',
				type: 'string',
				description: 'The query to render in the editor.',
				isRequired: true,
			},
		],
	},
	{
		name: 'JsonLdTypes',
		package: '@atlaskit/json-ld-types',
		description:
			'Types for the Atlassian Object Vocabulary (JSON-LD). Used by Smart Link resolver responses and link extractors to type document and entity structures. No runtime components; import types when working with JSON-LD from the resolver or link metadata.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to type JSON-LD payloads (e.g. from the Smart Link resolver) or when building extractors or UI that consume link metadata. Complements link-extractors and linking-types.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['json-ld-types', 'json-ld', 'types', 'atlassian object vocabulary'],
		category: 'linking',
		examples: [],
		props: [],
	},
	{
		name: 'AsyncSelect',
		package: '@atlaskit/link-create',
		description:
			'Async-capable select component used in link-create forms for fields that load options from an API (e.g. project, type).',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a create form when the dropdown options are loaded asynchronously (e.g. Jira projects, issue types).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the select has a label and that options are announced to screen readers.',
		],
		keywords: ['link-create', 'select', 'async', 'form'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Will display a red astrix next to the field title if true',
			},
			{
				name: 'label',
				type: 'string',
				description: 'This should be properly internationalization-ed',
				isRequired: true,
			},
			{
				name: 'loadOptions',
				type: '(inputValue: string) => Promise<T[] | GroupType<T>[]>',
				description:
					'Function to options to display in async select.\n**WARNING** Will refetch if function changes.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name passed to the <Field>',
				isRequired: true,
			},
			{
				name: 'validationHelpText',
				type: 'string',
				description:
					'Optional text below the field explaining any requirements for a valid value.\neg. "Must be 4 or more letters"',
			},
			{
				name: 'validators',
				type: 'Validator[]',
				description: 'Validators for this field',
			},
		],
	},
	{
		name: 'CreateField',
		package: '@atlaskit/link-create',
		description:
			'Controller component that connects a form field to the create form state (name, validation, value). Use to build custom fields that participate in CreateForm.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when building a custom form field (e.g. custom select, date picker) that must be part of the create form validation and submit payload.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the rendered control has an accessible name and that validation errors are associated (e.g. aria-describedby).',
		],
		keywords: ['link-create', 'form', 'field', 'CreateField'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'children',
				type: '(fieldProps: FieldProps) => React.ReactNode',
				isRequired: true,
			},
			{
				name: 'id',
				type: 'string',
			},
			{
				name: 'isRequired',
				type: 'boolean',
			},
			{
				name: 'label',
				type: 'string',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name passed to the <Field>.',
				isRequired: true,
			},
			{
				name: 'testId',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'validationHelpText',
				type: 'string',
				description:
					'Optional text below the textfield explaining any requirements for a valid value.\neg. "Must be 4 or more letters"',
			},
			{
				name: 'validators',
				type: 'Validator[]',
				description: 'Validators for this field',
			},
		],
	},
	{
		name: 'CreateForm',
		package: '@atlaskit/link-create',
		description:
			'Form container for a single link-create plugin. Renders the plugin form UI and handles submit, validation, and success callback. Used inside plugin form implementations.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when building a custom LinkCreatePlugin form; wrap your fields in CreateForm and use onSubmit to return CreatePayload on success.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'form', 'CreateForm', 'plugin'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<ReactNode> | React.ReactPortal',
				description: 'Children to render in the form (form fields)',
				isRequired: true,
			},
			{
				name: 'hideFooter',
				type: 'boolean',
				description: 'Hides the rendering of the footer buttons',
			},
			{
				name: 'hideRequiredFieldMessage',
				type: 'boolean',
				description: 'Hides the "Required fields are marked with an asterisk" message',
			},
			{
				name: 'initialValues',
				type: 'Record<string, any> & { __post_create__?: never; }',
				description:
					'Values to initialise the forms initial state with\nShould not include values for reserved fields',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Renders a spinner when true',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description: 'Callback when the cancel button is fired',
			},
			{
				name: 'onSubmit',
				type: '(data: OmitReservedFields<FormData>) => void | Errors | Promise<void | Errors>',
				description:
					'Should resolve to void, or resolve to an object of\nkeys (field names) with error messages (key values)',
				isRequired: true,
			},
		],
	},
	{
		name: 'CreateFormLoader',
		package: '@atlaskit/link-create',
		description:
			'Loader wrapper for CreateForm that shows a loading state until form data or context is ready.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the create form depends on async data (e.g. site list, field config); show loading until ready then render CreateForm.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: ['Ensure loading state is announced (e.g. aria-busy or live region).'],
		keywords: ['link-create', 'form', 'loader', 'CreateFormLoader'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'appearance',
				type: '"inherit" | "invert"',
				description:
					'You can use this to invert the current theme.\nThis is useful when you are displaying a spinner on a background that is not the same background color scheme as the main content.',
			},
			{
				name: 'delay',
				type: 'number',
				description:
					'Delay the intro animation of `Spinner`.\nThis is not to be used to avoid quick flickering of `Spinner`.\n`Spinner` will automatically fade in and takes ~200ms to become partially visible.\nThis prop can be helpful for **long delays** such as `500-1000ms` for when you want to not\nshow a `Spinner` until some longer period of time has elapsed.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Describes what the spinner is doing for assistive technologies. For example, "loading", "submitting", or "processing".',
			},
			{
				name: 'size',
				type: 'number | PresetSize',
				description:
					'Size of the spinner. The available sizes are `xsmall`, `small`, `medium`, `large`, and `xlarge`. For most use cases, we recommend `medium`.',
				defaultValue: '"large"',
			},
		],
	},
	{
		name: 'FormSpy',
		package: '@atlaskit/link-create',
		description:
			'Component that subscribes to form state (values, errors, submitting) from react-final-form. Used to build custom UI that reacts to form state.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to read or react to create form state (e.g. to enable/disable a submit button or show a summary) without controlling the form.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'form', 'FormSpy', 'react-final-form'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'children',
				type: '({ values }: { values: T; }) => React.ReactNode',
				isRequired: true,
			},
		],
	},
	{
		name: 'InlineCreate',
		package: '@atlaskit/link-create',
		description:
			'Inline (non-modal) link creation experience. Renders plugin forms inline so users can create a resource and get a link without opening a modal.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you want "create and link" inline (e.g. in a dropdown or panel) instead of a modal. Supply the same plugin structure as LinkCreate.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the inline form has an accessible name and that focus moves logically through fields.',
		],
		keywords: ['link-create', 'inline', 'create', 'plugins'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'entityKey',
				type: 'string',
				description:
					'The initial entity name for create. If this is provided, it will jump\ndirectly to the entity creation form.\nNote: it will be non-optional for now and can move to optional when we have\nthe meta creation flow built.',
				isRequired: true,
			},
			{
				name: 'groupKey',
				type: 'string',
				description:
					'The initial group key for create. If this is provided, it will jump\ndirectly to the entity selection screen',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description: 'This callback for when the form was manually discarded by user',
			},
			{
				name: 'onComplete',
				type: '() => void',
				description:
					'This callback for when the LinkCreate experience has successfully been completed.\nNote: this callback is one of the requirements to enable the LinkCreate\npost-create edit functionality',
			},
			{
				name: 'onCreate',
				type: '(payload: CreatePayload) => void | Promise<void>',
				description: 'This callback for when the resource has been successfully created.',
			},
			{
				name: 'onFailure',
				type: '(error: unknown) => void',
				description: 'This callback for any errors',
			},
			{
				name: 'plugins',
				type: 'LinkCreatePlugin<string>[]',
				isRequired: true,
			},
			{
				name: 'triggeredFrom',
				type: 'string',
				description:
					"This value tells where the linkCreate was triggered from. And it's for\nanalytic purpose only.\nDefault: unknown",
			},
		],
	},
	{
		name: 'LinkCreate',
		package: '@atlaskit/link-create',
		description:
			'The driver component of the link creation (meta create) flow. Renders a modal with plugin tabs (e.g. Jira issue, Confluence page); each plugin provides a form that returns a URL and metadata on success. Use for "create and link" experiences.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the user should create a new resource (issue, page, etc.) and insert its link in one flow. Supply plugins (e.g. from link-create-jira, link-create-confluence); control visibility with active/onCancel.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the modal has an accessible title and focus is trapped; ensure plugin forms have proper labels and error messages announced.',
		],
		keywords: ['link-create', 'create', 'modal', 'meta create', 'plugins'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'active',
				type: 'boolean',
				description:
					'This value controls whether the Create Modal should be active or hidden\nDefault: false',
			},
			{
				name: 'entityKey',
				type: 'string',
				description:
					'The initial entity name for create. If this is provided, it will jump\ndirectly to the entity creation form.\nNote: it will be non-optional for now and can move to optional when we have\nthe meta creation flow built.',
				isRequired: true,
			},
			{
				name: 'groupKey',
				type: 'string',
				description:
					'The initial group key for create. If this is provided, it will jump\ndirectly to the entity selection screen',
			},
			{
				name: 'modalHero',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'A ReactNode to be displayed in the modal hero section',
			},
			{
				name: 'modalTitle',
				type: 'string',
				description: 'A title for the LinkCreate with Modal component\nDefault: Create new',
			},
			{
				name: 'onCancel',
				type: '() => void',
				description: 'This callback for when the form was manually discarded by user',
			},
			{
				name: 'onCloseComplete',
				type: '(element: HTMLElement) => void',
				description:
					'Callback function called when the final link create experience dialog has finished closing.\n@see {@link https://atlassian.design/components/modal-dialog/code#ModalWrapper-onCloseComplete}',
			},
			{
				name: 'onComplete',
				type: '() => void',
				description:
					'This callback for when the LinkCreate experience has successfully been completed.\nNote: this callback is one of the requirements to enable the LinkCreate\npost-create edit functionality',
			},
			{
				name: 'onCreate',
				type: '(payload: CreatePayload) => void | Promise<void>',
				description: 'This callback for when the resource has been successfully created.',
			},
			{
				name: 'onFailure',
				type: '(error: unknown) => void',
				description: 'This callback for any errors',
			},
			{
				name: 'onOpenComplete',
				type: '(node: HTMLElement, isAppearing: boolean) => void',
				description:
					'Callback function called when the link create experience dialog has finished opening.\n @see {@link https://atlassian.design/components/modal-dialog/code#ModalWrapper-onOpenComplete}',
			},
			{
				name: 'plugins',
				type: 'LinkCreatePlugin<string>[]',
				isRequired: true,
			},
			{
				name: 'triggeredFrom',
				type: 'string',
				description:
					"This value tells where the linkCreate was triggered from. And it's for\nanalytic purpose only.\nDefault: unknown",
			},
		],
	},
	{
		name: 'LinkCreateCallbackProvider',
		package: '@atlaskit/link-create',
		description:
			'Context provider that supplies a callback (e.g. on success) to link-create. Used so plugins or parents can react to create completion.',
		status: 'general-availability',
		usageGuidelines: [
			'Wrap LinkCreate or InlineCreate when you need to run custom logic (e.g. insert link, close picker) when create succeeds; consume with useLinkCreateCallback.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-create', 'callback', 'context', 'provider'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'onCancel',
				type: '() => void',
				description: 'This callback for when the form was manually discarded by user',
			},
			{
				name: 'onCreate',
				type: '(result: CreatePayload) => void | Promise<void>',
				description: 'This callback for when the resource has been successfully created.',
			},
			{
				name: 'onFailure',
				type: '(error: unknown) => void',
				description: 'This callback for any errors',
			},
		],
	},
	{
		name: 'LinkCreateExitWarningProvider',
		package: '@atlaskit/link-create',
		description:
			'Provider that enables an exit-confirmation when the user tries to leave the create flow with unsaved changes. Uses ExitWarningModalProvider internally.',
		status: 'general-availability',
		usageGuidelines: [
			'Wrap the create flow when you want to warn users before closing or navigating away with unsaved form data.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the exit warning modal is focusable and has an accessible title and actions.',
		],
		keywords: ['link-create', 'exit', 'warning', 'provider', 'unsaved'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				isRequired: true,
			},
		],
	},
	{
		name: 'Select',
		package: '@atlaskit/link-create',
		description: 'Select component for link-create forms. Use for static or sync option lists.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a create form for dropdowns with static or synchronously available options.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: ['Ensure the select has an accessible label.'],
		keywords: ['link-create', 'select', 'form'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'appearance',
				type: '"default" | "subtle" | "none"',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Focus the control when it is mounted. There are very few cases that this should be used, and using incorrectly may violate accessibility guidelines.',
			},
			{
				name: 'blurInputOnSelect',
				type: 'boolean',
				description:
					'Remove focus from the input when the user selects an option (handy for dismissing the keyboard on touch devices)',
			},
			{
				name: 'classNamePrefix',
				type: 'string',
				description:
					'If provided, all inner components will be given a prefixed className attribute.\n\nThis is useful when styling via CSS classes instead of the Styles API approach.',
			},
			{
				name: 'classNames',
				type: '{ clearIndicator?: (props: ClearIndicatorProps<T, false, GroupBase<T>>) => string; container?: (props: ContainerProps<T, false, GroupBase<T>>) => string; ... 18 more ...; valueContainer?: (props: ValueContainerProps<...>) => string; }',
				description: 'Provide classNames based on state for each inner component',
			},
			{
				name: 'clearControlLabel',
				type: 'string',
				description: 'Set the `aria-label` for the clear icon button.',
			},
			{
				name: 'closeMenuOnSelect',
				type: 'boolean',
				description: 'Close the select menu when the user selects an option',
			},
			{
				name: 'components',
				type: '{ Option?: React.ComponentType<OptionProps<T, false, GroupBase<T>>>; Group?: React.ComponentType<GroupProps<T, false, GroupBase<T>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
				description:
					'This complex object includes all the compositional components that are used\nin `react-select`. If you wish to overwrite a component, pass in an object\nwith the appropriate namespace. If you wish to restyle a component, we recommend\nusing this prop with the `xcss` prop.',
			},
			{
				name: 'defaultInputValue',
				type: 'string',
			},
			{
				name: 'defaultMenuIsOpen',
				type: 'boolean',
			},
			{
				name: 'defaultValue',
				type: 'T | MultiValue<T>',
			},
			{
				name: 'descriptionId',
				type: 'string',
				description:
					"This sets the aria-describedby attribute. It sets an accessible description for the select, for people who use assistive technology. Use '<HelperMessage>' from '@atlaskit/form' is preferred.",
			},
			{
				name: 'filterOption',
				type: '(option: FilterOptionOption<T>, inputValue: string) => boolean',
				description: 'Custom method to filter whether an option should be displayed in the menu',
			},
			{
				name: 'form',
				type: 'string',
				description: 'Sets the form attribute on the input',
			},
			{
				name: 'formatGroupLabel',
				type: '(group: GroupBase<T>) => React.ReactNode',
				description:
					'Formats group labels in the menu as React components\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'formatOptionLabel',
				type: '(data: T, formatOptionLabelMeta: FormatOptionLabelMeta<T>) => React.ReactNode',
			},
			{
				name: 'getOptionLabel',
				type: '(option: T) => string',
				description:
					'Resolves option data to a string to be displayed as the label by components\n\nNote: Failure to resolve to a string type can interfere with filtering and\nscreen reader support.',
			},
			{
				name: 'getOptionValue',
				type: '(option: T) => string',
				description:
					'Resolves option data to a string to compare options and specify value attributes',
			},
			{
				name: 'hideSelectedOptions',
				type: 'boolean',
				description: 'Hide the selected option from the menu',
			},
			{
				name: 'id',
				type: 'string',
				description: 'The id to set on the SelectContainer component.',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'The id of the search input',
			},
			{
				name: 'inputValue',
				type: 'string',
				description: 'The value of the search input',
			},
			{
				name: 'instanceId',
				type: 'string | number',
				description: 'Define an id prefix for the select components e.g. {your-id}-value',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Is the select value clearable',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Is the select disabled',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Is the select invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Is the select in a state of loading (async)',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'Support multiple selected options',
			},
			{
				name: 'isOptionDisabled',
				type: '(option: T, selectValue: Options<T>) => boolean',
				description:
					'Override the built-in logic to detect whether an option is disabled\n\nAn example can be found in the [Replacing builtins](https://react-select.com/advanced#replacing-builtins) documentation.',
			},
			{
				name: 'isOptionSelected',
				type: '(option: T, selectValue: Options<T>) => boolean',
				description: 'Override the built-in logic to detect whether an option is selected',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description:
					'This prop indicates if the component is required.\nWill display a red astrix next to the field title if true',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Whether to enable search functionality',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'This sets the aria-label attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.\nThis should be properly internationalization-ed',
				isRequired: true,
			},
			{
				name: 'labelId',
				type: 'string',
				description:
					'This sets the aria-labelledby attribute. It sets an accessible name for the select, for people who use assistive technology. Use of a visible label is highly recommended for greater accessibility support.',
			},
			{
				name: 'loadingMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
				description: 'Async: Text to display when loading options',
			},
			{
				name: 'maxMenuHeight',
				type: 'number',
				description: 'Maximum height of the menu before scrolling',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open',
			},
			{
				name: 'menuPlacement',
				type: '"auto" | "bottom" | "top"',
				description:
					"Default placement of the menu in relation to the control. 'auto' will flip\nwhen there isn't enough space below the control.",
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description:
					'Whether the menu should use a portal, and where it should attach\n\nAn example can be found in the [Portaling](https://react-select.com/advanced#portaling) documentation',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description:
					'The CSS position value of the menu, when "fixed" extra layout management is required',
			},
			{
				name: 'menuShouldScrollIntoView',
				type: 'boolean',
				description: 'Whether the menu should be scrolled into view when it opens',
			},
			{
				name: 'minMenuHeight',
				type: 'number',
				description: 'Minimum height of the menu before flipping',
			},
			{
				name: 'name',
				type: 'string',
				description:
					'Name of the HTML Input (optional - without this, no input will be rendered)\nName passed to the <Field>',
				isRequired: true,
			},
			{
				name: 'noOptionsMessage',
				type: '(obj: { inputValue: string; }) => React.ReactNode',
			},
			{
				name: 'onBlur',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle blur events on the control',
			},
			{
				name: 'onChange',
				type: '(newValue: T, actionMeta: ActionMeta<T>) => void',
				description: 'Handle change events on the select',
			},
			{
				name: 'onClickPreventDefault',
				type: 'boolean',
			},
			{
				name: 'onFocus',
				type: '(event: React.FocusEvent<HTMLInputElement, Element>) => void',
				description: 'Handle focus events on the control',
			},
			{
				name: 'onInputChange',
				type: '(newValue: string, actionMeta: InputActionMeta) => void',
				description: 'Handle change events on the input',
			},
			{
				name: 'onKeyDown',
				type: '(event: React.KeyboardEvent<HTMLDivElement>) => void',
				description: 'Handle key down events on the select',
			},
			{
				name: 'onMenuClose',
				type: '() => void',
				description: 'Handle the menu closing',
			},
			{
				name: 'onMenuOpen',
				type: '() => void',
				description: 'Handle the menu opening',
			},
			{
				name: 'onMenuScrollToBottom',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the bottom of the menu',
			},
			{
				name: 'onMenuScrollToTop',
				type: '(event: WheelEvent | TouchEvent) => void',
				description: 'Fired when the user scrolls to the top of the menu',
			},
			{
				name: 'options',
				type: 'readonly (T | GroupBase<T>)[]',
				description: 'Array of options that populate the select menu',
			},
			{
				name: 'pageSize',
				type: 'number',
				description: 'Number of options to jump in menu when page{up|down} keys are used',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Placeholder for the select value',
			},
			{
				name: 'shouldPreventEscapePropagation',
				type: 'boolean',
				description: 'Prevents "Escape" keydown event propagation',
			},
			{
				name: 'spacing',
				type: '"compact" | "default"',
				description:
					'This prop affects the height of the select control. Compact is gridSize() * 4, default is gridSize * 5',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description:
					"Sets the tabIndex attribute on the input for focus. Since focus is already managed, the only acceptable value to be used is '-1' in rare cases when removing this field from the document tab order is required.",
			},
			{
				name: 'validationHelpText',
				type: 'string',
				description:
					'Optional text below the field explaining any requirements for a valid value.\neg. "Must be 4 or more letters"',
			},
			{
				name: 'validators',
				type: 'Validator[]',
				description: 'Validators for this field',
			},
			{
				name: 'value',
				type: 'T | MultiValue<T>',
				description: 'The value of the select; reflected by the selected option',
			},
		],
	},
	{
		name: 'SiteSelect',
		package: '@atlaskit/link-create',
		description:
			'Site/product picker used in link-create forms when the user must choose a site or product (e.g. Jira site, Confluence space) before other fields.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when the create flow requires picking a site or product first; follow with form fields that depend on that selection.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the site picker has an accessible name and that selected site is announced.',
		],
		keywords: ['link-create', 'site', 'select', 'picker', 'form'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'name',
				type: 'string',
			},
			{
				name: 'options',
				type: 'SitePickerOptionType[]',
			},
		],
	},
	{
		name: 'TextField',
		package: '@atlaskit/link-create',
		description: 'Text input component for link-create forms. Wired for validation and final-form.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a create form for single-line text fields (e.g. title, summary).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure each field has a visible or aria-label and that validation errors are announced.',
		],
		keywords: ['link-create', 'textfield', 'input', 'form'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'appearance',
				type: '"subtle" | "standard" | "none"',
				description:
					"Controls the appearance of the field.\nSubtle shows styling on hover.\nNone prevents all field styling. Take care when using the none appearance as this doesn't include accessible interactions.",
			},
			{
				name: 'elemAfterInput',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Element after input in text field.',
			},
			{
				name: 'elemBeforeInput',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Element before input in text field.',
			},
			{
				name: 'isCompact',
				type: 'boolean',
				description: 'Applies compact styling, making the field smaller.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					"Sets the field as to appear disabled,\npeople will not be able to interact with the text field and it won't appear in the focus order.\nWherever possible, prefer using validation and error messaging over disabled fields for a more accessible experience.",
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description:
					'Changes the text field to have a border indicating that its value is invalid.',
			},
			{
				name: 'isMonospaced',
				type: 'boolean',
				description: 'Sets content text value to appear monospaced.',
			},
			{
				name: 'isReadOnly',
				type: 'boolean',
				description: 'If true, prevents the value of the input from being edited.',
			},
			{
				name: 'isRequired',
				type: 'boolean',
				description: 'Set required for form that the field is part of.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name passed to the <Field>.',
				isRequired: true,
			},
			{
				name: 'onChange',
				type: '(event: React.FormEvent<HTMLInputElement>) => void',
				description: 'Handler called when the inputs value changes.',
			},
			{
				name: 'onMouseDown',
				type: '(event: React.MouseEvent<HTMLElement, MouseEvent>) => void',
				description: 'Handler called when the mouse down event is triggered on the input element.',
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Placeholder text to display in the text field whenever it is empty.',
			},
			{
				name: 'validationHelpText',
				type: 'string',
				description:
					'Optional text below the textfield explaining any requirements for a valid value.\neg. "Must be 4 or more letters"',
			},
			{
				name: 'validators',
				type: 'Validator[]',
				description: 'Validators for this field',
			},
			{
				name: 'width',
				type: 'string | number',
				description: 'Sets maximum width of input.',
			},
		],
	},
	{
		name: 'UserPicker',
		package: '@atlaskit/link-create',
		description:
			'User picker component for link-create forms. Used for assignee, reporter, or other user fields.',
		status: 'general-availability',
		usageGuidelines: [
			'Use inside a create form when the user must select a person (e.g. assignee, creator).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure the picker has an accessible name and that the selected user is announced.',
		],
		keywords: ['link-create', 'user', 'picker', 'form'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'defaultValue',
				type: '{ id: string; name?: string; avatarUrl?: string; }',
				isRequired: true,
			},
			{
				name: 'label',
				type: 'string',
				description: 'The label text above the component',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name to pass into the <Field>',
				isRequired: true,
			},
			{
				name: 'placeholder',
				type: 'string',
				description: 'Placeholder text to display in the text field whenever it is empty.',
			},
			{
				name: 'productKey',
				type: 'string',
				description: 'Refers to a product identifier, Jira, Confluence, Townsquare, ect.',
				isRequired: true,
			},
			{
				name: 'siteId',
				type: 'string',
				description: "Identifier for the product's tenant, also known as tenantId or cloudId",
				isRequired: true,
			},
			{
				name: 'validators',
				type: 'Validator[]',
				description: 'Validators for this field',
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
		name: 'Link extractors',
		package: '@atlaskit/link-extractors',
		description:
			'Functions for extracting props and metadata from JSON-LD. Includes genericExtractPropsFromJSONLD for type-based extraction, plus extractors for common fields (title, preview, provider, dates, persons, Smart Link embed, etc.). Used by Smart Link components to turn resolver JSON-LD into UI props.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need to parse JSON-LD from the Smart Link resolver (or other link metadata) into structured props for custom UI. Use Smart Link–specific extractors (extractSmartLinkTitle, extractSmartLinkEmbed, etc.) for Smart Link details.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-extractors', 'json-ld', 'extract', 'smart link', 'metadata'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'defaultExtractorFunction',
				type: 'ExtractorFunction<T>',
				isRequired: true,
			},
			{
				name: 'extractorFunctionsByType',
				type: '{ [type: string]: ExtractorFunction<T>; }',
				isRequired: true,
			},
			{
				name: 'extractorPrioritiesByType',
				type: '{ [type: string]: number; }',
				isRequired: true,
			},
			{
				name: 'json',
				type: 'any',
				isRequired: true,
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
		name: 'CardClient',
		package: '@atlaskit/link-provider',
		description:
			'HTTP client for fetching and resolving Smart Link metadata. Used by SmartCardProvider to load link details; can be supplied as a custom client for custom backends or testing.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the default instance from SmartCardProvider, or pass a custom CardClient to SmartCardProvider when you need a different resolver endpoint or behavior.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'client', 'CardClient', 'resolver', 'fetch'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'authFlow',
				type: '"oauth2" | "disabled"',
				description:
					'Enable and disable authentication flow.\nIf disabled, Smart Links will not offer Connect option when the link returns forbidden nor unauthorized status.',
			},
			{
				name: 'bridgeProduct',
				type: 'string',
				description:
					"Optional override for the bridge value used when wrapping smart link URLs for\ncross-product analytics. When omitted, defaults to `'smartLinks'`.",
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Any React components contains linking components.',
				isRequired: true,
			},
			{
				name: 'client',
				type: 'CardClient',
				description:
					'A client that make request to Object Resolver Service to resolve url for linking components.\nSee `CardClient` for more details.',
			},
			{
				name: 'isAdminHubAIEnabled',
				type: 'boolean',
				description:
					'Flag indicated whether AI feature is enabled in AdminHub.\nThis is required for AI summary in Smart Links.',
			},
			{
				name: 'isPreviewPanelAvailable',
				type: '(props: { ari: string; }) => boolean',
				description:
					'Optional callback establishing whether the preview panel is available in the host application for the given linked resource.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'openPreviewPanel',
				type: '(props: { ari: string; iconUrl: string; name: string; url: string; }) => void',
				description:
					'Optional callback enabling the host application to open a preview panel for compatible links.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'product',
				type: '"CONFLUENCE" | "ATLAS" | "BITBUCKET" | "TRELLO" | "CSM" | "JSW" | "JWM" | "JSM" | "JPD" | "ELEVATE"',
				description:
					'The product that linking components are rendered in.\nRequired for features such as AI summary in Smart Links, Loom embed Smart Links, etc.',
			},
			{
				name: 'renderers',
				type: 'CardProviderRenderers',
				description:
					'A render function returning React component.\n`emoji` is used to render Smart Link icon for Confluence emoji.',
			},
			{
				name: 'rovoOptions',
				type: 'RovoOptions',
				description: '',
			},
			{
				name: 'shouldControlDataExport',
				type: 'boolean',
				description:
					'Flag indicated by compliance to determine whether the content of this link should be controlled for data export.\nThis controls whether or not the link data should be blocked for data export during certain features, such as PDF export in Confluence.',
			},
			{
				name: 'storeOptions',
				type: 'CardProviderStoreOpts',
				description:
					'The options for redux store that contains linking data.\n`initialState` can be used to set linking data and prevent card client to make a request to resolve the url.',
			},
			{
				name: 'xpcProduct',
				type: 'string',
				description:
					"The product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'confluence', 'jira'). Does not affect link resolution.\nTakes precedence over `product` when determining the source product for XPC URL wrapping.",
			},
			{
				name: 'xpcSubProduct',
				type: 'string',
				description:
					"The sub-product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'jsw', 'jsm'). Does not affect link resolution.",
			},
		],
	},
	{
		name: 'EditorSmartCardProvider',
		package: '@atlaskit/link-provider',
		description:
			'Smart Card provider variant for editor environments, with value guard for type-safe access to editor-specific context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use in rich-text or page editors where Smart Links are rendered inside the editor and need editor-specific config (e.g. ADF renderers, preview panel).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'editor', 'EditorSmartCardProvider'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'authFlow',
				type: '"oauth2" | "disabled"',
				description:
					'Enable and disable authentication flow.\nIf disabled, Smart Links will not offer Connect option when the link returns forbidden nor unauthorized status.',
			},
			{
				name: 'bridgeProduct',
				type: 'string',
				description:
					"Optional override for the bridge value used when wrapping smart link URLs for\ncross-product analytics. When omitted, defaults to `'smartLinks'`.",
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Any React components contains linking components.',
				isRequired: true,
			},
			{
				name: 'client',
				type: 'CardClient',
				description:
					'A client that make request to Object Resolver Service to resolve url for linking components.\nSee `CardClient` for more details.',
			},
			{
				name: 'isAdminHubAIEnabled',
				type: 'boolean',
				description:
					'Flag indicated whether AI feature is enabled in AdminHub.\nThis is required for AI summary in Smart Links.',
			},
			{
				name: 'isPreviewPanelAvailable',
				type: '(props: { ari: string; }) => boolean',
				description:
					'Optional callback establishing whether the preview panel is available in the host application for the given linked resource.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'openPreviewPanel',
				type: '(props: { ari: string; iconUrl: string; name: string; url: string; }) => void',
				description:
					'Optional callback enabling the host application to open a preview panel for compatible links.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'product',
				type: '"CONFLUENCE" | "ATLAS" | "BITBUCKET" | "TRELLO" | "CSM" | "JSW" | "JWM" | "JSM" | "JPD" | "ELEVATE"',
				description:
					'The product that linking components are rendered in.\nRequired for features such as AI summary in Smart Links, Loom embed Smart Links, etc.',
			},
			{
				name: 'renderers',
				type: 'CardProviderRenderers',
				description:
					'A render function returning React component.\n`emoji` is used to render Smart Link icon for Confluence emoji.',
			},
			{
				name: 'rovoOptions',
				type: 'RovoOptions',
				description: '',
			},
			{
				name: 'shouldControlDataExport',
				type: 'boolean',
				description:
					'Flag indicated by compliance to determine whether the content of this link should be controlled for data export.\nThis controls whether or not the link data should be blocked for data export during certain features, such as PDF export in Confluence.',
			},
			{
				name: 'storeOptions',
				type: 'CardProviderStoreOpts',
				description:
					'The options for redux store that contains linking data.\n`initialState` can be used to set linking data and prevent card client to make a request to resolve the url.',
			},
			{
				name: 'xpcProduct',
				type: 'string',
				description:
					"The product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'confluence', 'jira'). Does not affect link resolution.\nTakes precedence over `product` when determining the source product for XPC URL wrapping.",
			},
			{
				name: 'xpcSubProduct',
				type: 'string',
				description:
					"The sub-product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'jsw', 'jsm'). Does not affect link resolution.",
			},
		],
	},
	{
		name: 'SmartCardContext',
		package: '@atlaskit/link-provider',
		description:
			'React context object for Smart Links. Prefer useSmartCardContext or useSmartLinkContext; use SmartCardContext.Consumer only when hooks are not available.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need context in a class component or without hooks; otherwise prefer useSmartCardContext.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['link-provider', 'context', 'SmartCardContext'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'authFlow',
				type: '"oauth2" | "disabled"',
				description:
					'Enable and disable authentication flow.\nIf disabled, Smart Links will not offer Connect option when the link returns forbidden nor unauthorized status.',
			},
			{
				name: 'bridgeProduct',
				type: 'string',
				description:
					"Optional override for the bridge value used when wrapping smart link URLs for\ncross-product analytics. When omitted, defaults to `'smartLinks'`.",
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Any React components contains linking components.',
				isRequired: true,
			},
			{
				name: 'client',
				type: 'CardClient',
				description:
					'A client that make request to Object Resolver Service to resolve url for linking components.\nSee `CardClient` for more details.',
			},
			{
				name: 'isAdminHubAIEnabled',
				type: 'boolean',
				description:
					'Flag indicated whether AI feature is enabled in AdminHub.\nThis is required for AI summary in Smart Links.',
			},
			{
				name: 'isPreviewPanelAvailable',
				type: '(props: { ari: string; }) => boolean',
				description:
					'Optional callback establishing whether the preview panel is available in the host application for the given linked resource.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'openPreviewPanel',
				type: '(props: { ari: string; iconUrl: string; name: string; url: string; }) => void',
				description:
					'Optional callback enabling the host application to open a preview panel for compatible links.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'product',
				type: '"CONFLUENCE" | "ATLAS" | "BITBUCKET" | "TRELLO" | "CSM" | "JSW" | "JWM" | "JSM" | "JPD" | "ELEVATE"',
				description:
					'The product that linking components are rendered in.\nRequired for features such as AI summary in Smart Links, Loom embed Smart Links, etc.',
			},
			{
				name: 'renderers',
				type: 'CardProviderRenderers',
				description:
					'A render function returning React component.\n`emoji` is used to render Smart Link icon for Confluence emoji.',
			},
			{
				name: 'rovoOptions',
				type: 'RovoOptions',
				description: '',
			},
			{
				name: 'shouldControlDataExport',
				type: 'boolean',
				description:
					'Flag indicated by compliance to determine whether the content of this link should be controlled for data export.\nThis controls whether or not the link data should be blocked for data export during certain features, such as PDF export in Confluence.',
			},
			{
				name: 'storeOptions',
				type: 'CardProviderStoreOpts',
				description:
					'The options for redux store that contains linking data.\n`initialState` can be used to set linking data and prevent card client to make a request to resolve the url.',
			},
			{
				name: 'xpcProduct',
				type: 'string',
				description:
					"The product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'confluence', 'jira'). Does not affect link resolution.\nTakes precedence over `product` when determining the source product for XPC URL wrapping.",
			},
			{
				name: 'xpcSubProduct',
				type: 'string',
				description:
					"The sub-product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'jsw', 'jsm'). Does not affect link resolution.",
			},
		],
	},
	{
		name: 'SmartCardProvider',
		package: '@atlaskit/link-provider',
		description:
			'React context provider for Smart Links. Supplies the link client, store, and configuration (auth flow, renderers, preview panel) to Smart Link components such as Card. Wrap your app or the tree that renders Smart Links with SmartCardProvider.',
		status: 'general-availability',
		usageGuidelines: [
			'Use at the root of any tree that renders Smart Links (Card, HoverCard, etc.). Pass a CardClient or use the default; configure authFlow and renderers as needed.',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [
			'Ensure any custom renderers (snippet, emoji, adf) produce accessible output and do not change focus or semantics of child Smart Link components.',
		],
		keywords: ['link-provider', 'smart card', 'provider', 'context', 'SmartCardProvider'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'authFlow',
				type: '"oauth2" | "disabled"',
				description:
					'Enable and disable authentication flow.\nIf disabled, Smart Links will not offer Connect option when the link returns forbidden nor unauthorized status.',
			},
			{
				name: 'bridgeProduct',
				type: 'string',
				description:
					"Optional override for the bridge value used when wrapping smart link URLs for\ncross-product analytics. When omitted, defaults to `'smartLinks'`.",
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Any React components contains linking components.',
				isRequired: true,
			},
			{
				name: 'client',
				type: 'CardClient',
				description:
					'A client that make request to Object Resolver Service to resolve url for linking components.\nSee `CardClient` for more details.',
			},
			{
				name: 'isAdminHubAIEnabled',
				type: 'boolean',
				description:
					'Flag indicated whether AI feature is enabled in AdminHub.\nThis is required for AI summary in Smart Links.',
			},
			{
				name: 'isPreviewPanelAvailable',
				type: '(props: { ari: string; }) => boolean',
				description:
					'Optional callback establishing whether the preview panel is available in the host application for the given linked resource.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'openPreviewPanel',
				type: '(props: { ari: string; iconUrl: string; name: string; url: string; }) => void',
				description:
					'Optional callback enabling the host application to open a preview panel for compatible links.\nRequired to be defined to add support for preview panel handling.',
			},
			{
				name: 'product',
				type: '"CONFLUENCE" | "ATLAS" | "BITBUCKET" | "TRELLO" | "CSM" | "JSW" | "JWM" | "JSM" | "JPD" | "ELEVATE"',
				description:
					'The product that linking components are rendered in.\nRequired for features such as AI summary in Smart Links, Loom embed Smart Links, etc.',
			},
			{
				name: 'renderers',
				type: 'CardProviderRenderers',
				description:
					'A render function returning React component.\n`emoji` is used to render Smart Link icon for Confluence emoji.',
			},
			{
				name: 'rovoOptions',
				type: 'RovoOptions',
			},
			{
				name: 'shouldControlDataExport',
				type: 'boolean',
				description:
					'Flag indicated by compliance to determine whether the content of this link should be controlled for data export.\nThis controls whether or not the link data should be blocked for data export during certain features, such as PDF export in Confluence.',
			},
			{
				name: 'storeOptions',
				type: 'CardProviderStoreOpts',
				description:
					'The options for redux store that contains linking data.\n`initialState` can be used to set linking data and prevent card client to make a request to resolve the url.',
			},
			{
				name: 'xpcProduct',
				type: 'string',
				description:
					"The product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'confluence', 'jira'). Does not affect link resolution.\nTakes precedence over `product` when determining the source product for XPC URL wrapping.",
			},
			{
				name: 'xpcSubProduct',
				type: 'string',
				description:
					"The sub-product identifier used exclusively for cross-product (XPC) URL wrapping analytics\n(e.g. 'jsw', 'jsm'). Does not affect link resolution.",
			},
		],
	},
	{
		name: 'Pulse',
		package: '@atlaskit/linking-common',
		description:
			'Wrapper that applies a single brief box-shadow pulse animation (3 iterations, ~1.45s each, using the bold discovery design token) to its child. Used to draw attention to a freshly-inserted Smart Link or discovery affordance. Once `showPulse` flips true, the animation persists across rerenders even if `showPulse` flips back — the wrapper latches a ref so the animation runs to completion.',
		status: 'general-availability',
		usageGuidelines: [
			'Use sparingly — overusing the pulse defeats its purpose as an attention-grabber. Trigger only on genuinely new content, not on every render.',
			'Pass `isInline` for inline contexts (uses `<span>`); the default wraps in `<div>`.',
			'Hook into `onAnimationStart` / `onAnimationIteration` if you need to fire analytics on first paint vs. each pulse iteration.',
		],
		accessibilityGuidelines: [
			'Pulse is decorative — do not rely on it alone to convey state. Ensure the wrapped element still has an accessible name and role.',
			'Respect `prefers-reduced-motion` at the call site (the component itself does not).',
		],
		keywords: ['linking-common', 'pulse', 'animation', 'discovery'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'children',
				type: 'JSX.Element',
				isRequired: true,
			},
			{
				name: 'isInline',
				type: 'boolean',
				defaultValue: 'false',
			},
			{
				name: 'onAnimationIteration',
				type: '(event: React.AnimationEvent<HTMLSpanElement>) => void',
			},
			{
				name: 'onAnimationStart',
				type: '(event: React.AnimationEvent<HTMLSpanElement>) => void',
			},
			{
				name: 'showPulse',
				type: 'boolean',
				defaultValue: 'false',
			},
		],
	},
	{
		name: 'Skeleton',
		package: '@atlaskit/linking-common',
		description:
			'Generic block-level loading skeleton used by Smart Card and Datasource UIs while a resolver response is pending. Supports three appearances (`gray`, `blue`, `darkGray`), explicit `width` / `height` / `borderRadius` props, and an optional shimmer animation toggled by `isShimmering`.',
		status: 'general-availability',
		usageGuidelines: [
			"Use for Smart Card / Datasource loading states — not as a general-purpose `<Skeleton>` primitive (the design system's `@atlaskit/skeleton` package owns that).",
			'Match the skeleton dimensions to the eventual content to avoid layout shift on resolve.',
		],
		accessibilityGuidelines: [
			'Skeletons must not announce themselves to assistive tech as content. Pair with `aria-busy="true"` on the container that owns the loading state.',
		],
		keywords: ['linking-common', 'skeleton', 'loading', 'placeholder'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'appearance',
				type: '"gray" | "blue" | "darkGray"',
				defaultValue: '"gray"',
			},
			{
				name: 'borderRadius',
				type: 'string | number',
				defaultValue: '0',
			},
			{
				name: 'height',
				type: 'string | number',
				defaultValue: '14',
			},
			{
				name: 'isShimmering',
				type: 'boolean',
				defaultValue: 'true',
			},
			{
				name: 'width',
				type: 'string | number',
			},
		],
	},
	{
		name: 'SpanSkeleton',
		package: '@atlaskit/linking-common',
		description:
			'Inline variant of `Skeleton` (renders a `<span>`) for use inside text flows — e.g. while a Smart Link title resolves inside a paragraph. Same prop shape as `Skeleton`.',
		status: 'general-availability',
		usageGuidelines: [
			'Use only when the placeholder needs to flow with surrounding text. For block-level cards reach for `Skeleton`.',
		],
		accessibilityGuidelines: [
			'Same as `Skeleton` — pair with `aria-busy` on the parent that owns the resolving state. Never put the skeleton itself in the accessible name.',
		],
		keywords: ['linking-common', 'skeleton', 'inline', 'loading'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'appearance',
				type: '"gray" | "blue" | "darkGray"',
				defaultValue: '"gray"',
			},
			{
				name: 'borderRadius',
				type: 'string | number',
				defaultValue: '0',
			},
			{
				name: 'height',
				type: 'string | number',
				defaultValue: '14',
			},
			{
				name: 'isShimmering',
				type: 'boolean',
				defaultValue: 'true',
			},
			{
				name: 'width',
				type: 'string | number',
			},
		],
	},
	{
		name: 'LinkingTypes',
		package: '@atlaskit/linking-types',
		description:
			'Schema and types shared by frontend and backend parts of the Linking Platform. Exports types for Smart Link actions, datasource requests/responses, and related contracts. Use when implementing clients, resolvers, or UI that must conform to the linking platform API.',
		status: 'general-availability',
		usageGuidelines: [
			'Use when you need type definitions for Smart Link invoke requests/responses, datasource details/data, or action discovery. Import from the main entry or subpaths (e.g. linking-types/smart-link-actions, linking-types/datasource).',
		],
		contentGuidelines: [],
		accessibilityGuidelines: [],
		keywords: ['linking-types', 'types', 'schema', 'smart link', 'datasource', 'actions'],
		category: 'linking',
		examples: [],
		props: [
			{
				name: 'parameters',
				type: 'DatasourceParameters',
				description: '',
				isRequired: true,
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
		name: 'DocumentViewer',
		package: '@atlaskit/media-document-viewer',
		description:
			'A specialized viewer for document types like PDF, Word, and Excel, providing paginated navigation and zooming.',
		status: 'general-availability',
		usageGuidelines: [
			'Use DocumentViewer for high-fidelity previews of documents.',
			'Supports multi-page navigation and zoom controls.',
			'Ideal for embedding document previews within a page or modal.',
		],
		keywords: ['media', 'document', 'viewer', 'pdf', 'word', 'excel', 'preview'],
		category: 'media',
		examples: [
			"import { DocumentViewer } from '../src/documentViewer';\nimport { contents, imageUrl } from './utils/dummy-data';\nexport default function Basic(): React.JSX.Element {\n\tconst getContent = async () => contents;\n\tconst getPageImageUrl = async () => imageUrl;\n\treturn <DocumentViewer getContent={getContent} getPageImageUrl={getPageImageUrl} zoom={1.75} />;\n}",
		],
		props: [
			{
				name: 'enableLazyPageRendering',
				type: 'boolean',
				description:
					'When true, renders an initial batch of pages and appends more as the user scrolls.\nIntended for large documents (e.g. large Excel previews).\nDefault: false.',
				defaultValue: 'false',
			},
			{
				name: 'getContent',
				type: '(pageStart: number, pageEnd: number) => Promise<PageRangeContent>',
				isRequired: true,
			},
			{
				name: 'getPageImageUrl',
				type: '(pageNumber: number, zoom: number) => Promise<string>',
				isRequired: true,
			},
			{
				name: 'maxPageImageZoom',
				type: 'number',
				description:
					"The maximum zoom level that will be requested from the image service.\nThis is used to prevent the page from being too large to render server side in a reasonable time.\n\nThe 'zoom' prop can still be greater than this value, but the server side image service will return\na smaller image and the image will be scaled-up client side.",
			},
			{
				name: 'onSuccess',
				type: '() => void',
			},
			{
				name: 'paginationSize',
				type: 'number',
				defaultValue: '50',
			},
			{
				name: 'zoom',
				type: 'number',
				isRequired: true,
			},
		],
	},
	{
		name: 'Filmstrip',
		package: '@atlaskit/media-filmstrip',
		description:
			'A component that displays a collection of media cards in a horizontal, scrollable filmstrip layout.',
		status: 'general-availability',
		usageGuidelines: [
			'Use Filmstrip to show a horizontal list of media items, such as attachments or gallery previews.',
			'Provides navigation arrows for scrolling through the items.',
			'Automatically handles layout and spacing of media cards.',
		],
		keywords: ['media', 'filmstrip', 'gallery', 'carousel', 'horizontal-scroll'],
		category: 'media',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from '@emotion/react';\nimport { Component, type SyntheticEvent } from 'react';\nimport {\n\tcreateUploadMediaClient,\n\tgenericFileId,\n\taudioFileId,\n\terrorFileId,\n\tgifFileId,\n\texternalImageIdentifier,\n\tdefaultCollectionName,\n} from '@atlaskit/media-test-helpers';\nimport { type CardEvent, type CardAction } from '@atlaskit/media-card';\nimport EditorCloseIcon from '@atlaskit/icon/core/cross';\nimport {\n\ttype FileItem,\n\ttype FileState,\n\ttype UploadableFile,\n\ttype MediaClient,\n\ttype FileIdentifier,\n} from '@atlaskit/media-client';\nimport Button from '@atlaskit/button/new';\nimport { filmstripWrapperStyles } from '../example-helpers/styles';\nimport { Filmstrip, type FilmstripItem } from '../src';\nexport interface ExampleState {\n\titems: FilmstripItem[];\n\tmediaClient?: MediaClient;\n\tshouldOpenMediaViewer: boolean;\n}\nconst defaultMediaClient = createUploadMediaClient();\nclass Example extends Component<{}, ExampleState> {\n\tonCardClick = (result: CardEvent) => {\n\t\tconst { items } = this.state;\n\t\tif (!result.mediaItemDetails) {\n\t\t\treturn;\n\t\t}\n\t\tconst selectedId = (result.mediaItemDetails as FileIdentifier).id;\n\t\tconst currentItemIndex = this.getItemIndex(selectedId);\n\t\tif (currentItemIndex > -1) {\n\t\t\tconst item = items[currentItemIndex];\n\t\t\tconst newItem = {\n\t\t\t\t...item,\n\t\t\t\tselected: !item.selected,\n\t\t\t};\n\t\t\titems[currentItemIndex] = newItem;\n\t\t\tthis.setState({\n\t\t\t\titems,\n\t\t\t});\n\t\t}\n\t};\n\tgetItemIndex = (id: string | Promise<string>): number => {\n\t\tconst { items } = this.state;\n\t\tconst item = items.find((item) => (item.identifier as FileIdentifier).id === id);\n\t\tif (item) {\n\t\t\treturn items.indexOf(item);\n\t\t}\n\t\treturn -1;\n\t};\n\tonClose = (item?: FileItem) => {\n\t\tif (!item) {\n\t\t\treturn;\n\t\t}\n\t\tconst { items } = this.state;\n\t\tconst index = this.getItemIndex(item.details.id);\n\t\tif (index > -1) {\n\t\t\titems.splice(index, 1);\n\t\t\tthis.setState({\n\t\t\t\titems,\n\t\t\t});\n\t\t}\n\t};\n\tcardProps: Partial<FilmstripItem> = {\n\t\tselectable: true,\n\t\tonClick: this.onCardClick,\n\t\tactions: [\n\t\t\t{\n\t\t\t\thandler: this.onClose,\n\t\t\t\ticon: <EditorCloseIcon color=\"currentColor\" spacing=\"spacious\" label=\"close\" />,\n\t\t\t},\n\t\t],\n\t};\n\tstate: ExampleState = {\n\t\titems: [\n\t\t\t{\n\t\t\t\tidentifier: genericFileId,\n\t\t\t\t...this.cardProps,\n\t\t\t},\n\t\t\t{\n\t\t\t\tidentifier: externalImageIdentifier,\n\t\t\t\t...this.cardProps,\n\t\t\t},\n\t\t\t{\n\t\t\t\tidentifier: audioFileId,\n\t\t\t\t...this.cardProps,\n\t\t\t},\n\t\t\t{\n\t\t\t\tidentifier: errorFileId,\n\t\t\t\t...this.cardProps,\n\t\t\t},\n\t\t\t{\n\t\t\t\tidentifier: gifFileId,\n\t\t\t\t...this.cardProps,\n\t\t\t},\n\t\t],\n\t\tmediaClient: defaultMediaClient,\n\t\tshouldOpenMediaViewer: false,\n\t};\n\tcreateOnClickFromId = (id: string) => (event: any) => {\n\t\tthis.onCardClick({\n\t\t\tevent,\n\t\t\tmediaItemDetails: {\n\t\t\t\tid,\n\t\t\t},\n\t\t});\n\t};\n\tcreateActionsFromId = (id: string): CardAction[] => {\n\t\tconst handler = () => {\n\t\t\tthis.onClose({\n\t\t\t\ttype: 'file',\n\t\t\t\tdetails: {\n\t\t\t\t\tid,\n\t\t\t\t},\n\t\t\t});\n\t\t};\n\t\treturn [\n\t\t\t{\n\t\t\t\thandler,\n\t\t\t\ticon: <EditorCloseIcon color=\"currentColor\" spacing=\"spacious\" label=\"close\" />,\n\t\t\t},\n\t\t];\n\t};\n\tuploadFile = async (event: SyntheticEvent<HTMLInputElement>) => {\n\t\tconst { mediaClient } = this.state;\n\t\tif (!event.currentTarget.files || !event.currentTarget.files.length || !mediaClient) {\n\t\t\treturn;\n\t\t}\n\t\tconst file = event.currentTarget.files[0];\n\t\tconst uploadableFile: UploadableFile = {\n\t\t\tcontent: file,\n\t\t\tname: file.name,\n\t\t\tcollection: defaultCollectionName,\n\t\t};\n\t\tmediaClient.file.upload(uploadableFile).subscribe({\n\t\t\tnext: (state: FileState) => {\n\t\t\t\tif (state.status === 'uploading') {\n\t\t\t\t\tconst { id } = state;\n\t\t\t\t\t// prevent adding the same file id mutliple times\n\t\t\t\t\tif (\n\t\t\t\t\t\tthis.state.items.some(\n\t\t\t\t\t\t\t(item) => item.identifier.mediaItemType === 'file' && item.identifier.id === id,\n\t\t\t\t\t\t)\n\t\t\t\t\t) {\n\t\t\t\t\t\treturn;\n\t\t\t\t\t}\n\t\t\t\t\tconst { items } = this.state;\n\t\t\t\t\tconst newItem: FilmstripItem = {\n\t\t\t\t\t\t...this.cardProps,\n\t\t\t\t\t\tonClick: this.createOnClickFromId(id),\n\t\t\t\t\t\tactions: this.createActionsFromId(id),\n\t\t\t\t\t\tidentifier: {\n\t\t\t\t\t\t\tid,\n\t\t\t\t\t\t\tmediaItemType: 'file',\n\t\t\t\t\t\t\tcollectionName: defaultCollectionName,\n\t\t\t\t\t\t},\n\t\t\t\t\t\tselected: true,\n\t\t\t\t\t};\n\t\t\t\t\tthis.setState({\n\t\t\t\t\t\titems: [newItem, ...items],\n\t\t\t\t\t});\n\t\t\t\t}\n\t\t\t},\n\t\t\terror(error: Error) {\n\t\t\t\tconsole.log('subscription', error);\n\t\t\t},\n\t\t});\n\t};\n\ttoggleMediaClient = () => {\n\t\tconst { mediaClient: currentMediaClient } = this.state;\n\t\tthis.setState({\n\t\t\tmediaClient: currentMediaClient ? undefined : defaultMediaClient,\n\t\t});\n\t};\n\ttoggleMediaViewer = () => {\n\t\tconst { shouldOpenMediaViewer } = this.state;\n\t\tthis.setState({\n\t\t\tshouldOpenMediaViewer: !shouldOpenMediaViewer,\n\t\t});\n\t};\n\trender() {\n\t\tconst { items, mediaClient, shouldOpenMediaViewer } = this.state;\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t{\n\t\t\t\t<div css={filmstripWrapperStyles}>\n\t\t\t\t\t<Filmstrip\n\t\t\t\t\t\tmediaClientConfig={mediaClient && mediaClient.config}\n\t\t\t\t\t\titems={items}\n\t\t\t\t\t\tshouldOpenMediaViewer={shouldOpenMediaViewer}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\tUpload file <input type=\"file\" onChange={this.uploadFile} />\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<Button appearance=\"primary\" onClick={this.toggleMediaClient}>\n\t\t\t\t\t\ttoggle mediaClient\n\t\t\t\t\t</Button>\n\t\t\t\t\tMediaClient is: {mediaClient ? 'ON' : 'OFF'}\n\t\t\t\t</div>\n\t\t\t\t<div>\n\t\t\t\t\t<Button appearance=\"primary\" onClick={this.toggleMediaViewer}>\n\t\t\t\t\t\ttoggle mediaViewer\n\t\t\t\t\t</Button>\n\t\t\t\t\tMediaClient is: {shouldOpenMediaViewer ? 'ON' : 'OFF'}\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t);\n\t}\n}\nexport default (): React.JSX.Element => <Example />;",
		],
		props: [
			{
				name: 'fallbackMediaNameFetcher',
				type: '(id: string) => Promise<string>',
				description:
					'Optional fallback fetcher to retrieve the media filename from another service.\nWorkaround for #hot-301450 where media service is missing filenames for DC -> Cloud migrated media.',
			},
			{
				name: 'featureFlags',
				type: 'MediaFeatureFlags',
			},
			{
				name: 'includeHashForDuplicateFiles',
				type: 'boolean',
			},
			{
				name: 'isLazy',
				type: 'boolean',
			},
			{
				name: 'items',
				type: 'FilmstripItem[]',
				isRequired: true,
			},
			{
				name: 'mediaClientConfig',
				type: 'MediaClientConfig',
			},
			{
				name: 'shouldOpenMediaViewer',
				type: 'boolean',
			},
			{
				name: 'viewerOptions',
				type: 'ViewerOptionsProps',
			},
		],
	},
	{
		name: 'MediaImage',
		package: '@atlaskit/media-image',
		description:
			'A component for rendering media images with built-in support for authentication, error handling, and SSR.',
		status: 'general-availability',
		usageGuidelines: [
			'Use MediaImage to display a single image from the Atlassian Media Service.',
			'Handles image fetching and authentication automatically.',
			'Provides an error boundary to handle loading failures gracefully.',
		],
		keywords: ['media', 'image', 'picture', 'thumbnail'],
		category: 'media',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from '@emotion/react';\nimport { Component } from 'react';\nimport Textfield from '@atlaskit/textfield';\nimport {\n\tgenericFileId,\n\tgifFileId,\n\tlargeImageFileId,\n\timageFileId,\n\tdocFileId,\n\terrorFileId,\n\tcreateStorybookMediaClientConfig,\n} from '@atlaskit/media-test-helpers';\nimport Spinner from '@atlaskit/spinner';\nimport Select from '@atlaskit/select';\nimport { MediaImage } from '../src';\nimport { optionsWrapperStyles, mediaImageWrapperStyles } from '../example-helpers/styles';\nexport interface ExampleProps {}\nexport type MediaImageId = {\n\tlabel: string;\n\tvalue: any;\n};\nexport interface ExampleState {\n\timageId: MediaImageId;\n\twidth: number;\n\theight: number;\n}\nconst mediaClientConfig = createStorybookMediaClientConfig();\nconst imageIds: MediaImageId[] = [\n\t{ label: 'Generic', value: genericFileId },\n\t{ label: 'Gif', value: gifFileId },\n\t{ label: 'Large', value: largeImageFileId },\n\t{ label: 'Image', value: imageFileId },\n\t{ label: 'Doc', value: docFileId },\n\t{ label: 'Error', value: errorFileId },\n];\nclass Example extends Component<ExampleProps, ExampleState> {\n\tstate: ExampleState = {\n\t\timageId: imageIds[0],\n\t\twidth: 100,\n\t\theight: 100,\n\t};\n\tonWidthChange = (e: any) => {\n\t\tthis.setState({\n\t\t\twidth: parseInt(e.currentTarget.value),\n\t\t});\n\t};\n\tonHeightChange = (e: any) => {\n\t\tthis.setState({\n\t\t\theight: parseInt(e.currentTarget.value),\n\t\t});\n\t};\n\trender() {\n\t\tconst { imageId, width, height } = this.state;\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t{\n\t\t\t\t<div css={optionsWrapperStyles}>\n\t\t\t\t\t<Select\n\t\t\t\t\t\toptions={imageIds}\n\t\t\t\t\t\tdefaultValue={imageId}\n\t\t\t\t\t\tonChange={(imageId: any) => {\n\t\t\t\t\t\t\tthis.setState({ imageId });\n\t\t\t\t\t\t}}\n\t\t\t\t\t/>\n\t\t\t\t\t<Textfield\n\t\t\t\t\t\tlabel=\"Width\"\n\t\t\t\t\t\tplaceholder=\"width\"\n\t\t\t\t\t\tvalue={`${width}`}\n\t\t\t\t\t\tonChange={this.onWidthChange}\n\t\t\t\t\t/>\n\t\t\t\t\t<Textfield\n\t\t\t\t\t\tlabel=\"Height\"\n\t\t\t\t\t\tplaceholder=\"height\"\n\t\t\t\t\t\tvalue={`${height}`}\n\t\t\t\t\t\tonChange={this.onHeightChange}\n\t\t\t\t\t/>\n\t\t\t\t</div>\n\t\t\t\t{\n\t\t\t\t<div css={mediaImageWrapperStyles}>\n\t\t\t\t\t<MediaImage\n\t\t\t\t\t\tidentifier={imageId.value}\n\t\t\t\t\t\tmediaClientConfig={mediaClientConfig}\n\t\t\t\t\t\tapiConfig={{ width, height }}\n\t\t\t\t\t>\n\t\t\t\t\t\t{({ loading, error, data }) => {\n\t\t\t\t\t\t\tif (loading) {\n\t\t\t\t\t\t\t\treturn <Spinner />;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tif (error) {\n\t\t\t\t\t\t\t\tconsole.error(error);\n\t\t\t\t\t\t\t\treturn <div>Error :(</div>;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tif (!data) {\n\t\t\t\t\t\t\t\treturn null;\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\treturn <img src={data.src} alt=\"Media\" />;\n\t\t\t\t\t\t}}\n\t\t\t\t\t</MediaImage>\n\t\t\t\t</div>\n\t\t\t</div>\n\t\t);\n\t}\n}\nexport default (): React.JSX.Element => <Example />;",
		],
		props: [
			{
				name: 'apiConfig',
				type: '{ readonly allowAnimated?: boolean; readonly version?: number; readonly collection?: string; readonly width?: number; readonly height?: number; readonly mode?: "fit" | "full-fit" | "crop"; readonly upscale?: boolean; readonly \'max-age\'?: number; readonly source?: string; readonly ssr?: SSR; }',
				description: 'Media API Configuration object',
			},
			{
				name: 'children',
				type: '(props: MediaImageChildrenProps) => React.ReactNode',
				description: 'Render props returning `MediaImageChildrenProps` data structure',
				isRequired: true,
			},
			{
				name: 'identifier',
				type: 'FileIdentifier',
				description: 'Instance of file identifier',
				isRequired: true,
			},
			{
				name: 'mediaClientConfig',
				type: 'MediaClientConfig',
				isRequired: true,
			},
			{
				name: 'ssr',
				type: '"client" | "server"',
				description: 'Server-Side-Rendering modes are "server" and "client"',
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
		name: 'MediaTable',
		package: '@atlaskit/media-table',
		description:
			'A table component specifically designed for displaying lists of media files with metadata like name, size, and upload date.',
		status: 'general-availability',
		usageGuidelines: [
			'Use MediaTable to display a list of files with their associated metadata.',
			'Supports sorting, pagination, and row selection.',
			'Ideal for file management interfaces or attachment lists.',
		],
		keywords: ['media', 'table', 'files', 'list', 'metadata'],
		category: 'media',
		examples: [
			"import { createUploadMediaClientConfig } from '@atlaskit/media-test-helpers';\nimport { type HeadType } from '@atlaskit/dynamic-table/types';\nimport { MediaTable } from '../src';\nimport { RenderMediaTableWithFieldRange, items } from '../example-helpers/helpers';\nconst columns: HeadType = {\n\tcells: [\n\t\t{\n\t\t\tkey: 'file',\n\t\t\twidth: 50,\n\t\t\tcontent: 'File name',\n\t\t\tisSortable: true,\n\t\t},\n\t\t{\n\t\t\tkey: 'size',\n\t\t\twidth: 20,\n\t\t\tcontent: 'Size',\n\t\t\tisSortable: true,\n\t\t},\n\t\t{\n\t\t\tkey: 'date',\n\t\t\twidth: 50,\n\t\t\tcontent: 'Upload time',\n\t\t\tisSortable: true,\n\t\t},\n\t\t{\n\t\t\tkey: 'download',\n\t\t\tcontent: '',\n\t\t\twidth: 10,\n\t\t},\n\t\t{\n\t\t\tkey: 'preview',\n\t\t\tcontent: '',\n\t\t\twidth: 10,\n\t\t},\n\t],\n};\nconst mediaClientConfig = createUploadMediaClientConfig();\nexport default (): React.JSX.Element => {\n\treturn RenderMediaTableWithFieldRange(\n\t\t<MediaTable\n\t\t\titems={items}\n\t\t\tmediaClientConfig={mediaClientConfig}\n\t\t\tcolumns={columns}\n\t\t\titemsPerPage={6}\n\t\t\ttotalItems={100}\n\t\t\tisLoading={false}\n\t\t\tpageNumber={1}\n\t\t\tonSetPage={(pageNumber) => console.log('onSetPage', pageNumber)}\n\t\t\tonSort={(key, sortOrder) => console.log('onSort', key, sortOrder)}\n\t\t\tonPreviewOpen={() => console.log('onPreviewOpen')}\n\t\t\tonPreviewClose={() => console.log('onPreviewClose')}\n\t\t/>,\n\t);\n};",
		],
		props: [
			{
				name: 'columns',
				type: 'HeadType',
				description: 'Object describing the column headings',
				isRequired: true,
			},
			{
				name: 'createAnalyticsEvent',
				type: '(payload: AnalyticsEventPayload) => UIAnalyticsEvent',
				description: '',
				isRequired: true,
			},
			{
				name: 'highlightedRowIndex',
				type: 'number[]',
				description: 'Row index that will be highlighted *',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Whether to show the loading state or not',
			},
			{
				name: 'items',
				type: 'MediaTableItem[]',
				description: 'The table rows to display in the current page',
				isRequired: true,
			},
			{
				name: 'itemsPerPage',
				type: 'number',
				description: 'The maximum number of rows per page. No maximum by default',
			},
			{
				name: 'mediaClient',
				type: 'MediaClient',
				description: '',
				isRequired: true,
			},
			{
				name: 'onPreviewClose',
				type: '() => void',
				description: 'Called when the preview is closed',
			},
			{
				name: 'onPreviewOpen',
				type: '() => void',
				description:
					'Called when the preview is opened by the user clicking on an item in the table',
			},
			{
				name: 'onRowClick',
				type: '(rowData: RowData, index: number) => boolean',
				description:
					'callback triggered when row click is passed, if returned true it will prevent default behaviour. *',
			},
			{
				name: 'onSetPage',
				type: '(pageNumber: number) => void',
				description:
					'Called when a pagination control is clicked. Provides the new page number to paginate by',
			},
			{
				name: 'onSort',
				type: '(key: string, sortOrder: SortOrderType) => void',
				description:
					'Called when a column header is clicked. Provides the key of the column and the new sortOrder to sort by',
			},
			{
				name: 'pageNumber',
				type: 'number',
				description: 'The current page number',
			},
			{
				name: 'sortKey',
				type: 'string',
				description:
					'The property that the table items are sorted by. This must match a key in columns.cells',
			},
			{
				name: 'sortOrder',
				type: '"ASC" | "DESC"',
				description: 'The direction that the table items are sorted in - ascending or descending',
			},
			{
				name: 'totalItems',
				type: 'number',
				description: 'The total number of table rows. This is used to calculate pagination',
				isRequired: true,
			},
			{
				name: 'viewerOptions',
				type: 'ViewerOptionsProps',
				description: 'Sets viewer options *',
			},
		],
	},
	{
		name: 'MediaViewer',
		package: '@atlaskit/media-viewer',
		description:
			"MediaViewer is Atlassian's powerful solution for viewing files on the web. It supports images, video, audio, documents, and more in a full-screen overlay.",
		status: 'general-availability',
		usageGuidelines: [
			'Use MediaViewer to provide a full-screen preview of files and media.',
			'Use for viewing images, videos, PDFs, and other document types without leaving the current context.',
			'Supports navigation between multiple files in a collection.',
		],
		keywords: ['media', 'viewer', 'preview', 'file', 'image', 'video', 'pdf'],
		category: 'media',
		examples: [
			"import React, { useState } from 'react';\nimport {\n\tcreateStorybookMediaClientConfig,\n\tdefaultCollectionName,\n} from '@atlaskit/media-test-helpers';\nimport { type Identifier, MediaClient } from '@atlaskit/media-client';\nimport { NativeMediaPreview } from '../example-helpers/NativeMediaPreview';\nimport { imageItem } from '../example-helpers';\nimport { MediaViewer } from '../src';\nconst mediaClientConfig = createStorybookMediaClientConfig();\nconst mediaClient = new MediaClient(mediaClientConfig);\nconst Example = (): React.JSX.Element => {\n\tconst [selectedIdentifier, setSelectedIdentifier] = useState<Identifier | undefined>();\n\treturn (\n\t\t<>\n\t\t\t<NativeMediaPreview\n\t\t\t\tidentifier={imageItem}\n\t\t\t\tmediaClient={mediaClient}\n\t\t\t\tonClick={() => setSelectedIdentifier(imageItem)}\n\t\t\t/>\n\t\t\t{selectedIdentifier && (\n\t\t\t\t<MediaViewer\n\t\t\t\t\tmediaClientConfig={mediaClientConfig}\n\t\t\t\t\tselectedItem={selectedIdentifier}\n\t\t\t\t\titems={[selectedIdentifier]}\n\t\t\t\t\tcollectionName={defaultCollectionName}\n\t\t\t\t\tonClose={() => setSelectedIdentifier(undefined)}\n\t\t\t\t/>\n\t\t\t)}\n\t\t</>\n\t);\n};\nexport default Example;",
			"import Button from '@atlaskit/button/new';\nimport {\n\texternalImageIdentifier,\n\texternalSmallImageIdentifier,\n\tcreateStorybookMediaClient,\n\tdefaultCollectionName,\n} from '@atlaskit/media-test-helpers';\nimport { ButtonList, Group, MainWrapper } from '../example-helpers/MainWrapper';\nimport {\n\tdocIdentifier,\n\tlargePdfIdentifier,\n\timageIdentifier,\n\timageIdentifier2,\n\tunsupportedIdentifier,\n\tvideoHorizontalFileItem,\n\tvideoIdentifier,\n\twideImageIdentifier,\n\taudioItem,\n\taudioItemNoCover,\n} from '../example-helpers';\nimport { MediaViewer } from '../src';\nimport { videoFileId } from '@atlaskit/media-test-helpers';\nimport { I18NWrapper } from '@atlaskit/media-test-helpers';\nimport { type Identifier } from '@atlaskit/media-client';\nimport { addGlobalEventEmitterListeners } from '@atlaskit/media-test-helpers';\naddGlobalEventEmitterListeners();\nconst mediaClient = createStorybookMediaClient();\nexport type State = {\n\tselected?: {\n\t\titems: Identifier[];\n\t\tidentifier: Identifier;\n\t};\n};\nexport default class Example extends React.Component<{}, State> {\n\tstate: State = {};\n\tprivate openList = () => {\n\t\tthis.setState({\n\t\t\tselected: {\n\t\t\t\titems: [\n\t\t\t\t\texternalImageIdentifier,\n\t\t\t\t\timageIdentifier,\n\t\t\t\t\tvideoIdentifier,\n\t\t\t\t\texternalSmallImageIdentifier,\n\t\t\t\t\tvideoHorizontalFileItem,\n\t\t\t\t\twideImageIdentifier,\n\t\t\t\t\taudioItem,\n\t\t\t\t\taudioItemNoCover,\n\t\t\t\t\tdocIdentifier,\n\t\t\t\t\tlargePdfIdentifier,\n\t\t\t\t\timageIdentifier2,\n\t\t\t\t\tunsupportedIdentifier,\n\t\t\t\t],\n\t\t\t\tidentifier: imageIdentifier,\n\t\t\t},\n\t\t});\n\t};\n\tprivate openListWithItemNotOnList = () => {\n\t\tthis.setState({\n\t\t\tselected: {\n\t\t\t\titems: [\n\t\t\t\t\timageIdentifier,\n\t\t\t\t\tvideoIdentifier,\n\t\t\t\t\tvideoHorizontalFileItem,\n\t\t\t\t\twideImageIdentifier,\n\t\t\t\t\taudioItem,\n\t\t\t\t\taudioItemNoCover,\n\t\t\t\t\tlargePdfIdentifier,\n\t\t\t\t\timageIdentifier2,\n\t\t\t\t\tunsupportedIdentifier,\n\t\t\t\t],\n\t\t\t\tidentifier: docIdentifier,\n\t\t\t},\n\t\t});\n\t};\n\tprivate openErrorList = () => {\n\t\tconst invalidItem: Identifier = {\n\t\t\tmediaItemType: 'file',\n\t\t\tid: 'invalid-id',\n\t\t\toccurrenceKey: 'invalid-key',\n\t\t};\n\t\tthis.setState({\n\t\t\tselected: {\n\t\t\t\titems: [\n\t\t\t\t\timageIdentifier,\n\t\t\t\t\tinvalidItem,\n\t\t\t\t\twideImageIdentifier,\n\t\t\t\t\tvideoIdentifier,\n\t\t\t\t\tvideoHorizontalFileItem,\n\t\t\t\t\taudioItem,\n\t\t\t\t\taudioItemNoCover,\n\t\t\t\t\tdocIdentifier,\n\t\t\t\t\tlargePdfIdentifier,\n\t\t\t\t\timageIdentifier2,\n\t\t\t\t\tunsupportedIdentifier,\n\t\t\t\t],\n\t\t\t\tidentifier: imageIdentifier,\n\t\t\t},\n\t\t});\n\t};\n\tprivate openNotFound = () => {\n\t\tthis.setState({\n\t\t\tselected: {\n\t\t\t\titems: [imageIdentifier, wideImageIdentifier],\n\t\t\t\tidentifier: {\n\t\t\t\t\tmediaItemType: 'file',\n\t\t\t\t\tid: videoFileId.id,\n\t\t\t\t\toccurrenceKey: 'testOccurrenceKey',\n\t\t\t\t},\n\t\t\t},\n\t\t});\n\t};\n\tprivate openInvalidId = () => {\n\t\tconst invalidItem: Identifier = {\n\t\t\tmediaItemType: 'file',\n\t\t\tid: 'invalid-id',\n\t\t\toccurrenceKey: 'invalid-key',\n\t\t};\n\t\tthis.setState({\n\t\t\tselected: {\n\t\t\t\tidentifier: invalidItem,\n\t\t\t\titems: [invalidItem],\n\t\t\t},\n\t\t});\n\t};\n\tprivate onClose = () => {\n\t\tthis.setState({ selected: undefined });\n\t};\n\trender(): React.JSX.Element {\n\t\tconst { selected } = this.state;\n\t\treturn (\n\t\t\t<I18NWrapper>\n\t\t\t\t<MainWrapper>\n\t\t\t\t\t<Group>\n\t\t\t\t\t\t<h2>File lists</h2>\n\t\t\t\t\t\t<ButtonList>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<Button onClick={this.openList}>Small list</Button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<Button onClick={this.openListWithItemNotOnList}>\n\t\t\t\t\t\t\t\t\tSmall list with selected item not on the list\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ButtonList>\n\t\t\t\t\t</Group>\n\t\t\t\t\t<Group>\n\t\t\t\t\t\t<h2>Errors</h2>\n\t\t\t\t\t\t<ButtonList>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<Button onClick={this.openNotFound}>Selected item not found</Button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<Button onClick={this.openInvalidId}>Invalid ID</Button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t\t<li>\n\t\t\t\t\t\t\t\t<Button onClick={this.openErrorList}>Error list</Button>\n\t\t\t\t\t\t\t</li>\n\t\t\t\t\t\t</ButtonList>\n\t\t\t\t\t</Group>\n\t\t\t\t\t{selected && (\n\t\t\t\t\t\t<MediaViewer\n\t\t\t\t\t\t\tmediaClientConfig={mediaClient.config}\n\t\t\t\t\t\t\tselectedItem={selected.identifier}\n\t\t\t\t\t\t\titems={selected.items}\n\t\t\t\t\t\t\tcollectionName={defaultCollectionName}\n\t\t\t\t\t\t\tonClose={this.onClose}\n\t\t\t\t\t\t/>\n\t\t\t\t\t)}\n\t\t\t\t</MainWrapper>\n\t\t\t</I18NWrapper>\n\t\t);\n\t}\n}",
		],
		props: [
			{
				name: 'collectionName',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'contextId',
				type: 'string',
			},
			{
				name: 'extensions',
				type: 'MediaViewerExtensions',
			},
			{
				name: 'fallbackMediaNameFetcher',
				type: '(id: string) => Promise<string>',
			},
			{
				name: 'featureFlags',
				type: 'MediaFeatureFlags',
			},
			{
				name: 'items',
				type: 'Identifier[]',
				isRequired: true,
			},
			{
				name: 'mediaClientConfig',
				type: 'MediaClientConfig',
				isRequired: true,
			},
			{
				name: 'onClose',
				type: '() => void',
			},
			{
				name: 'selectedItem',
				type: 'FileIdentifier | ExternalImageIdentifier',
				isRequired: true,
			},
			{
				name: 'viewerOptions',
				type: 'ViewerOptionsProps',
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
		name: 'NotificationIndicator',
		package: '@atlaskit/notification-indicator',
		description: 'A component that displays a badge indicating the number of unread notifications.',
		status: 'general-availability',
		usageGuidelines: [
			'Use NotificationIndicator to alert users to new or unread notifications.',
			'Typically placed within a navigation bar or header.',
			'Automatically fetches and updates the notification count using a provided provider.',
		],
		keywords: ['notification', 'indicator', 'badge', 'unread', 'alerts'],
		category: 'interaction',
		examples: [
			"import { type NotificationLogProvider } from '@atlaskit/notification-log-client';\nimport { NotificationIndicator } from '../src';\nclass MockNotificationLogClient implements NotificationLogProvider {\n\tpublic async countUnseenNotifications() {\n\t\treturn Promise.resolve({ count: 5 });\n\t}\n}\nexport default function Example(): React.JSX.Element {\n\tconst client = new MockNotificationLogClient();\n\treturn <NotificationIndicator notificationLogProvider={Promise.resolve(client)} />;\n}",
		],
		props: [
			{
				name: 'appearance',
				type: '"added" | "default" | "important" | "primary" | "primaryInverted" | "removed" | "success" | "neutral" | "information" | "inverse" | "danger" | "warning" | "discovery" | "successBold" | "informationBold" | "dangerBold" | "warningBold" | "discoveryBold"',
			},
			{
				name: 'max',
				type: 'number',
			},
			{
				name: 'notificationLogProvider',
				type: 'Promise<NotificationLogProvider>',
			},
			{
				name: 'onCountUpdated',
				type: '(param: ValueUpdatedParams) => void',
			},
			{
				name: 'onCountUpdating',
				type: '(param: ValueUpdatingParams) => ValueUpdatingResult',
			},
			{
				name: 'refreshOnHidden',
				type: 'boolean',
			},
			{
				name: 'refreshOnVisibilityChange',
				type: 'boolean',
			},
			{
				name: 'refreshRate',
				type: 'number',
			},
			{
				name: 'ssrInitialValue',
				type: 'number',
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
		name: 'QuizWidget',
		package: '@atlaskit/quiz-widget',
		description: 'A component that allows users to take quizzes or surveys within a help context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use QuizWidget to present interactive quizzes or feedback forms to users.',
			'Supports multiple choice questions and submission handling.',
		],
		keywords: ['quiz', 'widget', 'survey', 'feedback', 'interactive'],
		category: 'interaction',
		examples: [
			"import React, { useState } from 'react';\nimport { QuizWidget } from '../src';\nimport { type QuizElement } from '../src/components/QuizWidget/types';\nimport { QuizWrapper } from '../src/styled';\nexport const quizContent: {\n\tanswers: {\n\t\t1: string[];\n\t\t2: string[];\n\t\t3: string[];\n\t\t4: string[];\n\t};\n\tname: string;\n\tquestions: {\n\t\t1: string;\n\t\t2: string;\n\t\t3: string;\n\t\t4: string;\n\t};\n} = {\n\tname: 'Quiz 1',\n\tquestions: {\n\t\t1: 'Which button do you press?',\n\t\t2: 'Choose a color',\n\t\t3: 'Which fruit do you choose?',\n\t\t4: 'Which is better?',\n\t},\n\tanswers: {\n\t\t1: ['Release', 'Star', 'Lightning Bolt'],\n\t\t2: ['Red', 'Orange', 'Blue'],\n\t\t3: ['Apple', 'Apricot', 'Pear'],\n\t\t4: ['Hello', 'Bye', 'Hi'],\n\t},\n};\nconst correctAnswers = {\n\t1: 'Star',\n\t2: 'Blue',\n\t3: 'Apricot',\n\t4: 'Hi',\n};\nconst Basic: React.FC = () => {\n\tconst [score, setScore] = useState<number | null>(null);\n\tconst [correctAnswersState, setCorrectAnswersState] = useState<QuizElement | null>(null);\n\tconst onSubmitButtonClick = (chosenAnswers: string[]) => {\n\t\tsetScore(3);\n\t\tsetCorrectAnswersState(correctAnswers);\n\t};\n\treturn (\n\t\t<QuizWrapper>\n\t\t\t<QuizWidget\n\t\t\t\tquizContent={quizContent}\n\t\t\t\tscore={score}\n\t\t\t\tcorrectAnswers={correctAnswersState}\n\t\t\t\tonSubmitButtonClick={onSubmitButtonClick}\n\t\t\t/>\n\t\t</QuizWrapper>\n\t);\n};\nexport default Basic;",
		],
		props: [
			{
				name: 'correctAnswers',
				type: '{ [key: number]: string; }',
			},
			{
				name: 'onNextButtonClick',
				type: '() => void',
			},
			{
				name: 'onSubmitButtonClick',
				type: '(choosenAnswers: string[]) => void',
			},
			{
				name: 'quizContent',
				type: 'QuizInterface',
				isRequired: true,
			},
			{
				name: 'score',
				type: 'number',
				isRequired: true,
			},
		],
	},
	{
		name: 'Rating',
		package: '@atlaskit/rating',
		description:
			'An accessible rating component that allows users to provide feedback using a star-based system.',
		status: 'general-availability',
		usageGuidelines: [
			'Use Rating to allow users to rate items or experiences.',
			'Supports both controlled and uncontrolled states.',
			'Highly customizable, including the number of stars and their appearance.',
		],
		keywords: ['rating', 'stars', 'feedback', 'review'],
		category: 'interaction',
		examples: [
			'import React, { useState } from \'react\';\nimport ButtonGroup from \'@atlaskit/button/button-group\';\nimport Button from \'@atlaskit/button/new\';\nimport { token } from \'@atlaskit/tokens\';\nimport { RatingGroup, Star } from \'../src\';\nexport default (): React.JSX.Element => {\n\tconst [color, setColor] = useState<string>();\n\treturn (\n\t\t<div style={{ textAlign: \'center\' }}>\n\t\t\t<ButtonGroup>\n\t\t\t\t<Button\n\t\t\t\t\tisSelected={!!color}\n\t\t\t\t\tonClick={() => setColor((prev) => (prev ? undefined : token(\'color.icon.accent.green\')))}\n\t\t\t\t>\n\t\t\t\t\t{color ? \'Reset color\' : \'Use custom color\'}\n\t\t\t\t</Button>\n\t\t\t</ButtonGroup>\n\t\t\t{\n\t\t\t<div style={{ margin: \'16px 0 8px\' }}>\n\t\t\t\t<RatingGroup groupName="rating--star">\n\t\t\t\t\t<Star color={color} label="Terrible" value="one" />\n\t\t\t\t\t<Star color={color} label="Meh" value="two" />\n\t\t\t\t\t<Star color={color} label="Good" value="three" />\n\t\t\t\t\t<Star color={color} label="Great" value="four" />\n\t\t\t\t\t<Star color={color} label="Fantastic!" value="five" />\n\t\t\t\t</RatingGroup>\n\t\t\t</div>\n\t\t</div>\n\t);\n};',
		],
		props: [
			{
				name: 'id',
				type: 'string',
				description:
					'Id that is passed to both the label and the radio button element.\nThis is needed to declare their relationship.\n\nWhen using this with the `<Rating />` component this is handled for you.',
			},
			{
				name: 'isChecked',
				type: 'boolean',
				description:
					'Sets checked state on the rating item.\n\nWhen using this with the `<Rating />` component this is handled for you.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Label for the rating item.\nThis will be read by screen readers as well as used in the tooltip when hovering over the item.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description:
					'This is passed to the radio button input.\n\nWhen using this with the `<Rating />` component this is handled for you.',
			},
			{
				name: 'onChange',
				type: '(value?: string) => void',
				description:
					'Handler that is called back whenever the radio button element changes its checked state.\nWhen checked will be passed the `value` -\nwhen unchecked will be passed `undefined`.\n\nWhen using this with the `<Rating />` component this is handled for you.',
			},
			{
				name: 'render',
				type: '(props: { isChecked: boolean; }) => ReactNode',
				description:
					'Render callback that should return a ReactNode.\nIs passed an argument which is an object with one property `isChecked`.',
				isRequired: true,
			},
			{
				name: 'value',
				type: 'string',
				description:
					'Value of the rating item.\nThis will be passed back in the `onChange()` handler when checked.',
				isRequired: true,
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
				name: 'hideExtensionKeysWhilePending',
				type: 'string[]',
				description:
					'@description\nExtension keys whose default placeholder content should be hidden (render\nnothing) while their extension provider promise is still pending. Products\nopt specific extensions in by passing their keys; when omitted, behaviour is\nunchanged.',
				defaultValue: 'undefined',
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
		name: 'RightSidePanel',
		package: '@atlaskit/right-side-panel',
		description:
			'A panel component that slides in from the right side of the screen, typically used for help or additional context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use RightSidePanel to display supplementary information or tools without navigating away from the main content.',
			'Supports custom width and slide-in animations.',
		],
		keywords: ['panel', 'sidebar', 'overlay', 'help', 'context'],
		category: 'layout',
		examples: [
			"import ButtonGroup from '@atlaskit/button/button-group';\nimport Button from '@atlaskit/button/new';\nimport Page from '@atlaskit/page';\nimport { ButtonsWrapper, TextWrapper } from './utils/styled';\nimport { RightSidePanel, FlexContainer, ContentWrapper } from '../src';\nexport default class extends React.Component {\n\tstate = {\n\t\tisOpen: false,\n\t};\n\topenDrawer = (): void => {\n\t\tthis.setState({\n\t\t\tisOpen: true,\n\t\t});\n\t};\n\tcloseDrawer = (): void =>\n\t\tthis.setState({\n\t\t\tisOpen: false,\n\t\t});\n\trender(): React.JSX.Element {\n\t\tconst { isOpen } = this.state;\n\t\treturn (\n\t\t\t<FlexContainer id=\"RightSidePanelExample\">\n\t\t\t\t<ContentWrapper>\n\t\t\t\t\t<Page>\n\t\t\t\t\t\t<ButtonsWrapper>\n\t\t\t\t\t\t\t<ButtonGroup>\n\t\t\t\t\t\t\t\t<Button type=\"button\" onClick={this.openDrawer}>\n\t\t\t\t\t\t\t\t\tOpen drawer\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t<Button type=\"button\" onClick={this.closeDrawer}>\n\t\t\t\t\t\t\t\t\tClose drawer\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t\t</ButtonsWrapper>\n\t\t\t\t\t</Page>\n\t\t\t\t\t<RightSidePanel isOpen={isOpen} attachPanelTo=\"RightSidePanelExample\">\n\t\t\t\t\t\t<TextWrapper>\n\t\t\t\t\t\t\t<h1>Right Side Panel content</h1>\n\t\t\t\t\t\t</TextWrapper>\n\t\t\t\t\t</RightSidePanel>\n\t\t\t\t</ContentWrapper>\n\t\t\t</FlexContainer>\n\t\t);\n\t}\n}",
		],
		props: [
			{
				name: 'attachPanelTo',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'disableEnterAnimation',
				type: 'boolean',
			},
			{
				name: 'disableExitAnimation',
				type: 'boolean',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				isRequired: true,
			},
			{
				name: 'mountOnEnter',
				type: 'boolean',
			},
			{
				name: 'onCloseAnimationFinished',
				type: '() => void',
			},
			{
				name: 'onOpenAnimationFinished',
				type: '() => void',
			},
			{
				name: 'skipAnimationOnMount',
				type: 'boolean',
			},
			{
				name: 'unmountOnExit',
				type: 'boolean',
			},
			{
				name: 'width',
				type: 'number',
			},
		],
	},
	{
		name: 'AgentAvatar',
		package: '@atlaskit/rovo-agent-components',
		description:
			'A visual representation of a Rovo agent, supporting both custom images and generated avatars.',
		status: 'general-availability',
		usageGuidelines: [
			'Use AgentAvatar to identify a Rovo agent visually.',
			"Supports displaying a custom image or a generated avatar based on the agent's identity.",
		],
		keywords: ['rovo', 'agent', 'avatar', 'identity', 'ai'],
		category: 'media',
		examples: [
			'import { IntlProvider } from \'react-intl\';\nimport Heading from \'@atlaskit/heading\';\nimport { Box, Inline, Stack } from \'@atlaskit/primitives/compiled\';\nimport { AgentAvatar } from \'../src/ui/agent-avatar\';\nimport { imageAgentAvatar } from \'./helpers\';\nexport default function (): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale="en">\n\t\t\t<Box padding="space.300" backgroundColor="color.background.accent.purple.subtler.pressed">\n\t\t\t\t<Stack alignInline="center">\n\t\t\t\t\t<Heading size="medium">Sizes</Heading>\n\t\t\t\t\t<br />\n\t\t\t\t\t<Inline space="space.300" alignBlock="end" alignInline="center">\n\t\t\t\t\t\t<Stack alignBlock="start" alignInline="center" space="space.200">\n\t\t\t\t\t\t\t<AgentAvatar imageUrl={imageAgentAvatar} size="xsmall" />\n\t\t\t\t\t\t\t<Heading size="small">xsmall</Heading>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t\t<Stack alignBlock="start" alignInline="center" space="space.200">\n\t\t\t\t\t\t\t<AgentAvatar imageUrl={imageAgentAvatar} size="small" />\n\t\t\t\t\t\t\t<Heading size="small">small</Heading>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t\t<Stack alignBlock="start" alignInline="center" space="space.200">\n\t\t\t\t\t\t\t<AgentAvatar imageUrl={imageAgentAvatar} size="medium" />\n\t\t\t\t\t\t\t<Heading size="small">medium</Heading>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t\t<Stack alignBlock="start" alignInline="center" space="space.200">\n\t\t\t\t\t\t\t<AgentAvatar imageUrl={imageAgentAvatar} size="large" />\n\t\t\t\t\t\t\t<Heading size="small">large</Heading>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t\t<Stack alignBlock="start" alignInline="center" space="space.200">\n\t\t\t\t\t\t\t<AgentAvatar imageUrl={imageAgentAvatar} size="xlarge" />\n\t\t\t\t\t\t\t<Heading size="small">xlarge</Heading>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t\t<Stack alignBlock="start" alignInline="center" space="space.200">\n\t\t\t\t\t\t\t<AgentAvatar imageUrl={imageAgentAvatar} size="xxlarge" />\n\t\t\t\t\t\t\t<Heading size="small">xxlarge</Heading>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t</Inline>\n\t\t\t\t</Stack>\n\t\t\t</Box>\n\t\t</IntlProvider>\n\t);\n}',
			'import { IntlProvider } from \'react-intl\';\nimport { Grid } from \'@atlaskit/primitives\';\nimport { Box, Inline } from \'@atlaskit/primitives/compiled\';\nimport { AgentAvatar } from \'../src/ui/agent-avatar\';\nimport { TOTAL_AVATAR_COMBINATIONS } from \'../src/ui/agent-avatar/generated-avatars\';\nexport default function (): React.JSX.Element {\n\treturn (\n\t\t<IntlProvider locale="en">\n\t\t\t<Box padding="space.300" backgroundColor="color.background.accent.gray.subtlest.pressed">\n\t\t\t\t<Grid templateColumns="1fr 1fr" gap="space.200">\n\t\t\t\t\t{Array.from({ length: TOTAL_AVATAR_COMBINATIONS }, (_, i) => {\n\t\t\t\t\t\t// Converting to hex, in order to display all possible combinations of avatars, the GeneratedAvatar is using hex number to do combinations\n\t\t\t\t\t\tconst hexString = i.toString(16);\n\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t<Inline key={hexString} space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t<AgentAvatar agentIdentityAccountId={hexString} size="xxlarge" />\n\t\t\t\t\t\t\t\t<AgentAvatar agentIdentityAccountId={hexString} size="xlarge" />\n\t\t\t\t\t\t\t\t<AgentAvatar agentIdentityAccountId={hexString} size="large" />\n\t\t\t\t\t\t\t\t<AgentAvatar agentIdentityAccountId={hexString} size="medium" />\n\t\t\t\t\t\t\t\t<AgentAvatar agentIdentityAccountId={hexString} size="small" />\n\t\t\t\t\t\t\t\t<AgentAvatar agentIdentityAccountId={hexString} size="xsmall" />\n\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t);\n\t\t\t\t\t})}\n\t\t\t\t</Grid>\n\t\t\t</Box>\n\t\t</IntlProvider>\n\t);\n}',
		],
		props: [
			{
				name: 'agentId',
				type: 'string',
			},
			{
				name: 'agentIdentityAccountId',
				type: 'string',
			},
			{
				name: 'agentNamedId',
				type: 'string',
			},
			{
				name: 'forgeAgentIconUrl',
				type: 'string',
			},
			{
				name: 'imageUrl',
				type: 'string',
			},
			{
				name: 'isForgeAgent',
				type: 'boolean',
			},
			{
				name: 'isRovoDev',
				type: 'boolean',
			},
			{
				name: 'label',
				type: 'string',
			},
			{
				name: 'name',
				type: 'string',
			},
			{
				name: 'showBorder',
				type: 'boolean',
				defaultValue: 'true',
			},
			{
				name: 'size',
				type: '"xsmall" | "UNSAFE_xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"',
				defaultValue: '"medium"',
			},
		],
	},
	{
		name: 'AgentProfileInfo',
		package: '@atlaskit/rovo-agent-components',
		description:
			'A component for displaying information about a Rovo agent, including name, description, and star count.',
		status: 'general-availability',
		usageGuidelines: [
			'Use AgentProfileInfo to show details about a Rovo agent.',
			'Typically used in agent selection or profile views.',
		],
		keywords: ['rovo', 'agent', 'profile', 'info', 'ai'],
		category: 'data-display',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { IntlProvider } from 'react-intl';\nimport { cssMap, jsx } from '@atlaskit/css';\nimport { Box, Grid } from '@atlaskit/primitives/compiled';\nimport { token } from '@atlaskit/tokens';\nimport { AgentProfileCreator, AgentProfileInfo } from '../src/ui/agent-profile-info';\nimport { AgentStarCount } from '../src/ui/agent-profile-info/agent-star-count';\nconst styles = cssMap({\n\twrapper: {\n\t\twidth: '280px',\n\t\tmarginTop: token('space.200'),\n\t\tmarginRight: token('space.200'),\n\t\tmarginBottom: token('space.500'),\n\t\tmarginLeft: token('space.200'),\n\t},\n\tgridWrapper: {\n\t\tgridTemplateColumns: '1fr 1fr 1fr',\n\t},\n});\nexport default function (): JSX.Element {\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<Grid xcss={styles.gridWrapper} gap=\"space.200\">\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<AgentProfileInfo\n\t\t\t\t\t\tagentName=\"Gday Bot Agent\"\n\t\t\t\t\t\tisStarred={true}\n\t\t\t\t\t\tonStarToggle={() => {}}\n\t\t\t\t\t\tcreatorRender={\n\t\t\t\t\t\t\t<AgentProfileCreator\n\t\t\t\t\t\t\t\tcreator={{\n\t\t\t\t\t\t\t\t\ttype: 'SYSTEM',\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\tisLoading={false}\n\t\t\t\t\t\t\t\tonCreatorLinkClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log('Creator link clicked');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstarCountRender={<AgentStarCount starCount={14253} isLoading={false} />}\n\t\t\t\t\t\tisHidden={false}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<AgentProfileInfo\n\t\t\t\t\t\tagentName=\"Agent Name\"\n\t\t\t\t\t\tisStarred={true}\n\t\t\t\t\t\tonStarToggle={() => {}}\n\t\t\t\t\t\tcreatorRender={\n\t\t\t\t\t\t\t<AgentProfileCreator\n\t\t\t\t\t\t\t\tcreator={{\n\t\t\t\t\t\t\t\t\ttype: 'CUSTOMER',\n\t\t\t\t\t\t\t\t\tname: 'Creator Name',\n\t\t\t\t\t\t\t\t\tprofileLink: 'https://example.com',\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\tisLoading={false}\n\t\t\t\t\t\t\t\tonCreatorLinkClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log('Creator link clicked');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstarCountRender={<AgentStarCount starCount={512} isLoading={false} />}\n\t\t\t\t\t\tagentDescription=\"Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice.\"\n\t\t\t\t\t\tisHidden={false}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<AgentProfileInfo\n\t\t\t\t\t\tagentName=\"Test agent with long name Test agent with long name and loading\"\n\t\t\t\t\t\tisStarred={true}\n\t\t\t\t\t\tonStarToggle={() => {}}\n\t\t\t\t\t\tcreatorRender={\n\t\t\t\t\t\t\t<AgentProfileCreator\n\t\t\t\t\t\t\t\tcreator={undefined}\n\t\t\t\t\t\t\t\tisLoading={true}\n\t\t\t\t\t\t\t\tonCreatorLinkClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log('Creator link clicked');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstarCountRender={<AgentStarCount starCount={undefined} isLoading={true} />}\n\t\t\t\t\t\tagentDescription=\"Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice. Craft and refine all things blogs, external comms, and announcements. Align with your brand's voice.\"\n\t\t\t\t\t\tisHidden={false}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<AgentProfileInfo\n\t\t\t\t\t\tagentName=\"Test agent with long unbreakable description\"\n\t\t\t\t\t\tisStarred={true}\n\t\t\t\t\t\tonStarToggle={() => {}}\n\t\t\t\t\t\tcreatorRender={\n\t\t\t\t\t\t\t<AgentProfileCreator\n\t\t\t\t\t\t\t\tcreator={undefined}\n\t\t\t\t\t\t\t\tisLoading={true}\n\t\t\t\t\t\t\t\tonCreatorLinkClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log('Creator link clicked');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstarCountRender={<AgentStarCount starCount={undefined} isLoading={true} />}\n\t\t\t\t\t\tagentDescription=\"https://hello.atlassian.net/wiki/spaces/~70121164347b28c684f438d9c2bdbb160b08b/pages/5749122820/My+Rovo+Agent+isn+t+doing+what+I+m+telling+it+to+do\"\n\t\t\t\t\t\tisHidden={false}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<AgentProfileInfo\n\t\t\t\t\t\tagentName=\"Agent without creator and description\"\n\t\t\t\t\t\tisStarred={false}\n\t\t\t\t\t\tonStarToggle={() => {}}\n\t\t\t\t\t\tcreatorRender={\n\t\t\t\t\t\t\t<AgentProfileCreator\n\t\t\t\t\t\t\t\tcreator={undefined}\n\t\t\t\t\t\t\t\tisLoading={false}\n\t\t\t\t\t\t\t\tonCreatorLinkClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log('Creator link clicked');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstarCountRender={<AgentStarCount starCount={undefined} isLoading={false} />}\n\t\t\t\t\t\tisHidden={false}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<AgentProfileInfo\n\t\t\t\t\t\tagentName=\"Forge agent example\"\n\t\t\t\t\t\tisStarred={false}\n\t\t\t\t\t\tonStarToggle={() => {}}\n\t\t\t\t\t\tcreatorRender={\n\t\t\t\t\t\t\t<AgentProfileCreator\n\t\t\t\t\t\t\t\tcreator={{\n\t\t\t\t\t\t\t\t\ttype: 'THIRD_PARTY',\n\t\t\t\t\t\t\t\t\tname: 'Opsgenie Incident Timeline Lab',\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\tisLoading={false}\n\t\t\t\t\t\t\t\tonCreatorLinkClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log('Creator link clicked');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstarCountRender={<AgentStarCount starCount={undefined} isLoading={false} />}\n\t\t\t\t\t\tisHidden={false}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t\t<Box xcss={styles.wrapper}>\n\t\t\t\t\t<AgentProfileInfo\n\t\t\t\t\t\tagentName=\"Agent with deactivated creator\"\n\t\t\t\t\t\tisStarred={false}\n\t\t\t\t\t\tonStarToggle={() => {}}\n\t\t\t\t\t\tcreatorRender={\n\t\t\t\t\t\t\t<AgentProfileCreator\n\t\t\t\t\t\t\t\tcreator={{\n\t\t\t\t\t\t\t\t\ttype: 'CUSTOMER',\n\t\t\t\t\t\t\t\t\tname: 'Creator Name',\n\t\t\t\t\t\t\t\t\tstatus: 'inactive',\n\t\t\t\t\t\t\t\t\tprofileLink: 'https://example.com',\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\tisLoading={false}\n\t\t\t\t\t\t\t\tonCreatorLinkClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log('Creator link clicked');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t\tstarCountRender={<AgentStarCount starCount={undefined} isLoading={false} />}\n\t\t\t\t\t\tisHidden={false}\n\t\t\t\t\t/>\n\t\t\t\t</Box>\n\t\t\t</Grid>\n\t\t</IntlProvider>\n\t);\n}",
		],
		props: [
			{
				name: 'agentDescription',
				type: 'string',
			},
			{
				name: 'agentName',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'creatorRender',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				isRequired: true,
			},
			{
				name: 'headingRender',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'isHidden',
				type: 'boolean',
				isRequired: true,
			},
			{
				name: 'isStarred',
				type: 'boolean',
				isRequired: true,
			},
			{
				name: 'onStarToggle',
				type: '() => void',
				isRequired: true,
			},
			{
				name: 'renderAdditionalContent',
				type: '() => React.ReactNode',
			},
			{
				name: 'showStarButton',
				type: 'boolean',
				defaultValue: 'true',
			},
			{
				name: 'starCountRender',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				isRequired: true,
			},
		],
	},
	{
		name: 'RovoAgentSelector',
		package: '@atlaskit/rovo-agent-selector',
		description: 'A component that allows users to select a Rovo agent from a list.',
		status: 'general-availability',
		usageGuidelines: [
			'Use RovoAgentSelector to allow users to choose which Rovo agent to interact with.',
			'Typically used in chat or assistance contexts.',
		],
		keywords: ['rovo', 'agent', 'selector', 'ai', 'assistance'],
		category: 'interaction',
		examples: [
			"import { IntlProvider } from 'react-intl';\nimport { graphql, RelayEnvironmentProvider, useLazyLoadQuery } from 'react-relay';\nimport { createMockEnvironment, MockPayloadGenerator } from 'relay-test-utils';\nimport { RovoAgentSelector } from '../src';\nimport { generateMockAgentEdges } from '../src/common/utils/generate-mock-agent-edges';\nimport type { basicRovoAgentSelectorQuery } from './__generated__/basicRovoAgentSelectorQuery.graphql';\nconst TestRenderer = () => {\n\tconst data = useLazyLoadQuery<basicRovoAgentSelectorQuery>(\n\t\tgraphql`\n\t\t\tquery basicRovoAgentSelectorQuery($cloudIdString: String!) {\n\t\t\t\t# eslint-disable-next-line @atlassian/relay/must-colocate-fragment-spreads\n\t\t\t\t...rovoAgentSelector_AtlaskitRovoAgentSelector @arguments(cloudIdString: $cloudIdString)\n\t\t\t}\n\t\t`,\n\t\t{\n\t\t\tcloudIdString: 'mock-cloud-id',\n\t\t},\n\t);\n\treturn (\n\t\t<RovoAgentSelector\n\t\t\ttestId=\"rovo-agent-selector\"\n\t\t\tfragmentReference={data}\n\t\t\tcloudId=\"mock-cloud-id\"\n\t\t\tisFeatureEnabled\n\t\t/>\n\t);\n};\nexport default function Basic(): React.JSX.Element {\n\tconst environment = createMockEnvironment();\n\tenvironment.mock.queueOperationResolver((operation) =>\n\t\tMockPayloadGenerator.generate(operation, {\n\t\t\tAgentStudioAgentsConnection: () => ({\n\t\t\t\tpageInfo: {\n\t\t\t\t\thasNextPage: false,\n\t\t\t\t\tendCursor: null,\n\t\t\t\t},\n\t\t\t\tedges: generateMockAgentEdges(10),\n\t\t\t}),\n\t\t}),\n\t);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<RelayEnvironmentProvider environment={environment}>\n\t\t\t\t<TestRenderer />\n\t\t\t</RelayEnvironmentProvider>\n\t\t</IntlProvider>\n\t);\n}",
		],
		props: [
			{
				name: 'cloudId',
				type: 'string',
				description: 'Cloud ID for refetching agents',
				isRequired: true,
			},
			{
				name: 'fragmentReference',
				type: '{ readonly " $data"?: rovoAgentSelector_AtlaskitRovoAgentSelector$data; readonly " $fragmentSpreads": FragmentRefs<"rovoAgentSelector_AtlaskitRovoAgentSelector">; }',
				description: 'GraphQL fragment reference for fetching agents',
				isRequired: true,
			},
			{
				name: 'isFeatureEnabled',
				type: 'boolean',
				description:
					'Override the feature gate check. When provided, this value will be used\ninstead of checking the feature gate. Useful for testing and development.',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Whether the selector is in a loading state',
			},
			{
				name: 'onChange',
				type: '(agent: AgentOption) => void',
				description: 'Callback when an agent is selected',
			},
			{
				name: 'selectedAgent',
				type: '{ label: string; value: string; externalConfigReference?: string; identityAccountId?: string; isForgeAgent: boolean; }',
				description: 'Currently selected agent (optional)',
			},
		],
	},
	{
		name: 'ButtonMenuItem',
		package: '@atlaskit/side-nav-items',
		description: 'A menu item component for side navigation that triggers an action when clicked.',
		status: 'general-availability',
		usageGuidelines: [
			'Use ButtonMenuItem for navigation items that perform an action rather than navigating to a new URL.',
			'Supports icons, avatars, and labels.',
		],
		keywords: ['navigation', 'menu-item', 'button', 'side-nav'],
		category: 'navigation',
		examples: [
			'/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport React, { useState } from \'react\';\nimport Avatar from \'@atlaskit/avatar/Avatar\';\nimport { IconButton } from \'@atlaskit/button/new\';\nimport { cssMap, jsx } from \'@atlaskit/css\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nimport HomeIcon from \'@atlaskit/icon/core/home\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nimport Lozenge from \'@atlaskit/lozenge/lozenge\';\nimport { ButtonItem } from \'@atlaskit/menu\';\nimport { SideNavBody } from \'@atlaskit/navigation-system/layout/side-nav\';\nimport Popup from \'@atlaskit/popup\';\nimport { Box, Stack } from \'@atlaskit/primitives/compiled\';\nimport { ButtonMenuItem, COLLAPSE_ELEM_BEFORE } from \'@atlaskit/side-nav-items/button-menu-item\';\nimport { MenuList } from \'@atlaskit/side-nav-items/menu-list\';\nimport { token } from \'@atlaskit/tokens\';\nconst styles = cssMap({\n\troot: {\n\t\twidth: \'300px\',\n\t},\n\tmenuContainer: {\n\t\toverflow: \'hidden\',\n\t\tborderRadius: token(\'radius.large\', \'8px\'),\n\t},\n});\nconst AddAction = ({ shouldRenderToParent }: { shouldRenderToParent?: boolean }) => (\n\t<DropdownMenu\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="Add"\n\t\t\t\ticon={(iconProps) => <AddIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t<DropdownItem>Import</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nconst MoreAction = ({ shouldRenderToParent }: { shouldRenderToParent?: boolean }) => (\n\t<DropdownMenu\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="More"\n\t\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Manage starred</DropdownItem>\n\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nconst MockActions = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (\n\t<React.Fragment>\n\t\t<AddAction shouldRenderToParent={shouldRenderToParent} />\n\t\t<MoreAction shouldRenderToParent={shouldRenderToParent} />\n\t</React.Fragment>\n);\nconst homeIcon = <HomeIcon label="" color="currentColor" spacing="spacious" />;\nconst elemAfter = <Lozenge>elem after</Lozenge>;\nexport const ButtonMenuItemExample = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ButtonMenuItem>Text only</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={COLLAPSE_ELEM_BEFORE}>\n\t\t\t\t\tText only (collapse elemBefore)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon}>With elemBefore</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon}>\n\t\t\t\t\tWith elemBefore and long overflowing text\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore="🙂">Emoji as elemBefore</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tdescription="This is an example of a long description"\n\t\t\t\t>\n\t\t\t\t\tWith description\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tdescription="This is an example of a long description"\n\t\t\t\t\tisSelected\n\t\t\t\t>\n\t\t\t\t\tWith description and selected\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={\n\t\t\t\t\t\t<IconButton icon={HomeIcon} label="IconButton" appearance="subtle" spacing="compact" />\n\t\t\t\t\t}\n\t\t\t\t>\n\t\t\t\t\tWith icon button as elemBefore\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={<Avatar />}>With avatar</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} actions={<MockActions shouldRenderToParent />}>\n\t\t\t\t\tWith actions\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<MockActions shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith actions (portalled popup)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} actionsOnHover={<MockActions shouldRenderToParent />}>\n\t\t\t\t\tWith hover actions\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith hover actions (portalled popup)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} actionsOnHover={<MockActions shouldRenderToParent />}>\n\t\t\t\t\tWith hover actions and elemBefore and long text\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} elemAfter={elemAfter}>\n\t\t\t\t\tWith elemAfter\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactions={<MockActions shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and actions\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactions={<MockActions shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and actions (portalled popup)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent />}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith actions and hover actions\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent={false} />}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith actions and hover actions (portalled popup)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and hover actions\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and hover actions (portalled popup)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\tdescription="A long description that should be truncated"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent />}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith all options and long text\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\tdescription="A long description that should be truncated"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent={false} />}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith all options and long text (portalled popup)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} isDisabled>\n\t\t\t\t\tDisabled\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} isDisabled description="with description">\n\t\t\t\t\tDisabled\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} isSelected>\n\t\t\t\t\tSelected\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem elemBefore={homeIcon} isSelected isDisabled>\n\t\t\t\t\tSelected and disabled\n\t\t\t\t</ButtonMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ButtonMenuItemRTLExample = (): JSX.Element => (\n\t<div dir="rtl">\n\t\t<ButtonMenuItemExample />\n\t</div>\n);\nexport const ButtonMenuItemWithPopup = (): JSX.Element => {\n\tconst [isNestedPopupOpen, setIsNestedPopupOpen] = useState(false);\n\tconst [isNestedPopup2Open, setIsNestedPopup2Open] = useState(true);\n\treturn (\n\t\t<div css={styles.root}>\n\t\t\t<SideNavBody>\n\t\t\t\t<MenuList>\n\t\t\t\t\t<ButtonMenuItem\n\t\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\t\tactions={\n\t\t\t\t\t\t\t<Popup\n\t\t\t\t\t\t\t\tshouldRenderToParent\n\t\t\t\t\t\t\t\tisOpen={isNestedPopupOpen}\n\t\t\t\t\t\t\t\tonClose={() => setIsNestedPopupOpen(false)}\n\t\t\t\t\t\t\t\tplacement="bottom-start"\n\t\t\t\t\t\t\t\tcontent={() => (\n\t\t\t\t\t\t\t\t\t<Box xcss={styles.menuContainer}>\n\t\t\t\t\t\t\t\t\t\t<ButtonItem>Menu item 1</ButtonItem>\n\t\t\t\t\t\t\t\t\t\t<ButtonItem>Menu item 2</ButtonItem>\n\t\t\t\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\ttrigger={(triggerProps) => (\n\t\t\t\t\t\t\t\t\t<IconButton\n\t\t\t\t\t\t\t\t\t\t{...triggerProps}\n\t\t\t\t\t\t\t\t\t\ticon={(iconProps) => <AddIcon {...iconProps} size="small" />}\n\t\t\t\t\t\t\t\t\t\tlabel="Add"\n\t\t\t\t\t\t\t\t\t\tappearance="subtle"\n\t\t\t\t\t\t\t\t\t\tspacing="compact"\n\t\t\t\t\t\t\t\t\t\tonClick={() => setIsNestedPopupOpen(!isNestedPopupOpen)}\n\t\t\t\t\t\t\t\t\t\tisSelected={isNestedPopupOpen}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t>\n\t\t\t\t\t\tWith popup rendered in portal\n\t\t\t\t\t</ButtonMenuItem>\n\t\t\t\t\t<ButtonMenuItem\n\t\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\t\tactions={\n\t\t\t\t\t\t\t<Popup\n\t\t\t\t\t\t\t\tshouldRenderToParent\n\t\t\t\t\t\t\t\tisOpen={isNestedPopup2Open}\n\t\t\t\t\t\t\t\tonClose={() => setIsNestedPopup2Open(false)}\n\t\t\t\t\t\t\t\tplacement="bottom-start"\n\t\t\t\t\t\t\t\tcontent={() => (\n\t\t\t\t\t\t\t\t\t<Box xcss={styles.menuContainer}>\n\t\t\t\t\t\t\t\t\t\t<ButtonItem>Menu item 1</ButtonItem>\n\t\t\t\t\t\t\t\t\t\t<ButtonItem>Menu item 2</ButtonItem>\n\t\t\t\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t\ttrigger={(triggerProps) => (\n\t\t\t\t\t\t\t\t\t<IconButton\n\t\t\t\t\t\t\t\t\t\t{...triggerProps}\n\t\t\t\t\t\t\t\t\t\ticon={(iconProps) => <AddIcon {...iconProps} size="small" />}\n\t\t\t\t\t\t\t\t\t\tlabel="Add"\n\t\t\t\t\t\t\t\t\t\tappearance="subtle"\n\t\t\t\t\t\t\t\t\t\tspacing="compact"\n\t\t\t\t\t\t\t\t\t\tonClick={() => setIsNestedPopup2Open(!isNestedPopup2Open)}\n\t\t\t\t\t\t\t\t\t\tisSelected={isNestedPopup2Open}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t>\n\t\t\t\t\t\tWith popup rendered to parent\n\t\t\t\t\t</ButtonMenuItem>\n\t\t\t\t\t<ButtonMenuItem\n\t\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\t\tactions={<AddAction shouldRenderToParent />}\n\t\t\t\t\t>\n\t\t\t\t\t\tWith elemAfter and action\n\t\t\t\t\t</ButtonMenuItem>\n\t\t\t\t</MenuList>\n\t\t\t</SideNavBody>\n\t\t</div>\n\t);\n};\nexport const ButtonMenuItemWithElemAfter = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ButtonMenuItem elemBefore={homeIcon} elemAfter={elemAfter}>\n\t\t\t\tWith elemAfter\n\t\t\t</ButtonMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const ButtonMenuItemWithElemAfterAndActionsOnHover = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ButtonMenuItem\n\t\t\t\telemBefore={homeIcon}\n\t\t\t\telemAfter={elemAfter}\n\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t>\n\t\t\t\tWith elemAfter and actionsOnHover\n\t\t\t</ButtonMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nconst ExportAction = ({\n\tshouldRenderToParent,\n\tdefaultOpen,\n}: {\n\tdefaultOpen?: boolean;\n\tshouldRenderToParent?: boolean;\n}) => (\n\t<DropdownMenu\n\t\tdefaultOpen={defaultOpen}\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="More"\n\t\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nexport const ButtonMenuItemWithDropdownActionOpen = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<Stack space="space.800">\n\t\t\t\t<ButtonMenuItem actions={<ExportAction shouldRenderToParent defaultOpen />}>\n\t\t\t\t\tDropdown open (actions)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem actions={<ExportAction shouldRenderToParent={false} defaultOpen />}>\n\t\t\t\t\tPortalled dropdown open (actions)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem actionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}>\n\t\t\t\t\tDropdown open (actionsOnHover)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem actionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}>\n\t\t\t\t\tPortalled dropdown open (actionsOnHover)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemAfter={<Lozenge>elem after</Lozenge>}\n\t\t\t\t\tactionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}\n\t\t\t\t>\n\t\t\t\t\telemAfter and dropdown open (actionsOnHover)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t\t<ButtonMenuItem\n\t\t\t\t\telemAfter={<Lozenge>elem after</Lozenge>}\n\t\t\t\t\tactionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}\n\t\t\t\t>\n\t\t\t\t\telemAfter and portalled dropdown open (actionsOnHover)\n\t\t\t\t</ButtonMenuItem>\n\t\t\t</Stack>\n\t\t</MenuList>\n\t</div>\n);\nexport const ButtonMenuItemDisabled = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ButtonMenuItem elemBefore={homeIcon} isDisabled>\n\t\t\t\tDisabled\n\t\t\t</ButtonMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const ButtonMenuItemDisabledWithActions = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ButtonMenuItem\n\t\t\t\telemBefore={homeIcon}\n\t\t\t\tisDisabled\n\t\t\t\tactions={<AddAction />}\n\t\t\t\tactionsOnHover={<MoreAction />}\n\t\t\t>\n\t\t\t\tDisabled with actions\n\t\t\t</ButtonMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const ButtonMenuItemSelected = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ButtonMenuItem elemBefore={homeIcon} isSelected>\n\t\t\t\tSelected\n\t\t\t</ButtonMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const ButtonMenuItemSelectedDisabled = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ButtonMenuItem elemBefore={homeIcon} isSelected isDisabled>\n\t\t\t\tSelected and disabled\n\t\t\t</ButtonMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const ButtonMenuItemBasic = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ButtonMenuItem elemBefore={homeIcon}>Basic button menu item</ButtonMenuItem>\n\t\t</MenuList>\n\t</div>\n);\n// Combining into one example for atlaskit site\nconst Example = (): JSX.Element => (\n\t<div>\n\t\t<ButtonMenuItemExample />\n\t\t<div>With popup</div>\n\t\t<ButtonMenuItemWithPopup />\n\t\t<div dir="rtl">RTL</div>\n\t\t<ButtonMenuItemRTLExample />\n\t</div>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'actions',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'`ReactNode` to be placed visually after the `children`.\n\nIt is intended for additional actions (e.g. IconButtons).\n\nThey will not be rendered when the menu item is disabled.',
			},
			{
				name: 'actionsOnHover',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'`ReactNode` to be placed visually after the `children` and will\nonly be displayed on hover or focus.\n\nIt is intended for additional actions (e.g. IconButtons).\n\nThis `ReactNode` will replace `elemAfter` on hover or focus.\n\nThey will not be rendered when the menu item is disabled.\n\nThis `ReactNode` will be rendered visually on top of the main\ninteractive element for the menu item. If this element does not\ncontain an interactive element (`button` or `a`) then `pointer-events`\nwill be set to `none` on this slot so that users can click through\nthis element onto the main interactive element of the menu item.',
			},
			{
				name: 'aria-controls',
				type: 'string',
				description:
					'Identifies the popup element that this element controls when it is used as a popup trigger.\nShould match the `id` of the popup content for screen readers to understand the relationship.',
			},
			{
				name: 'aria-expanded',
				type: 'boolean',
				description:
					'Announces to assistive technology whether the popup is currently open or closed,\nwhen this element is used as a popup trigger.',
			},
			{
				name: 'aria-haspopup',
				type: 'boolean | "dialog" | "menu" | "listbox" | "tree" | "grid"',
				description: 'Informs assistive technology that this element triggers a popup.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'The main textual content and label of the menu item.\n\nThe content will be truncated to fit into the side nav in one line.\n\n**Note:** Placing non-textual content (such as lozenges) can cause unexpected truncation behavior.\nUse the provided slot props such as `elemBefore` or `elemAfter` for non-textual content instead.',
				isRequired: true,
			},
			{
				name: 'description',
				type: 'string',
				description:
					'Additional textual content for the menu item.\nIt is displayed underneath the main content.',
			},
			{
				name: 'dropIndicator',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'A slot to render drop indicators for drag and drop operations on the menu item.',
			},
			{
				name: 'elemAfter',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'`ReactNode` to be placed visually after the `children`.\n\nIt is intended for static content (e.g. a `Lozenge`).\n\nIf both `elemAfter` and `actionsOnHover` are provided, `elemAfter` will\nnot be displayed when the item is hovered over or expanded. This is\nbecause the `actionsOnHover` will be displayed instead.\n\nThis `ReactNode` will be rendered visually on top of the main\ninteractive element for the menu item. If this element does not\ncontain an interactive element (`button` or `a`) then `pointer-events`\nwill be set to `none` on this slot so that users can click through\nthis element onto the main interactive element of the menu item.',
			},
			{
				name: 'elemBefore',
				type: 'ReactNode | typeof COLLAPSE_ELEM_BEFORE',
				description:
					'`ReactNode` to be placed visually before the `children`.\n\nThis `ReactNode` will be rendered visually on top of the main\ninteractive element for the menu item. If this element does not\ncontain an interactive element (`button` or `a`) then `pointer-events`\nwill be set to `none` on this slot so that users can click through\nthis element onto the main interactive element of the menu item.\n\nIf you want to collapse the `elemBefore` so it takes up no space,\nthen pass in the `COLLAPSE_ELEM_BEFORE` symbol. Keep in mind that\ncollapsing the `elemBefore` can break visual alignment and\nwill make it difficult for users to visually distinguish levels\nin the side navigation.\n\n@example\n\n```tsx\n<MenuItemButton elemBefore={<HomeIcon label="home" />}>Home</MenuItemButton>\n\n// collapse the elemBefore\n<MenuItemButton elemBefore={COLLAPSE_ELEM_BEFORE}>Home</MenuItemButton>\n```',
			},
			{
				name: 'hasDragIndicator',
				type: 'boolean',
				description:
					'Whether this menu item can be dragged. Add a drag handle to this item.\nYou are responsible for wiring up drag and drop to the menu item.\n\n\n- Please be sure to make the MenuItem `ref` the `draggable` element\n- See our navigation drag and drop guidelines for more technical details',
			},
			{
				name: 'isContentTooltipDisabled',
				type: 'boolean',
				description:
					'Disable tooltip for menu item content. This should only be done when there is some other way\nto display the full menu content and description of a menu item close by (eg with another popup)',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description:
					'We are not using a discriminated union to enforce that the `actions` and `actionsOnHover`\nprops are not used when `isDisabled` is true due to ergonomic type issues with `boolean`\ntypes (as oppposed to literal `true` or `false` types), e.g. if a conditional boolean\nvariable is passed to `isDisabled`.,Whether the menu item is disabled.\n\nWhen disabled, content in the `actions` and `actionsOnHover` props will not be rendered.\n\nThe menu item will not be interactive and will not respond to hover or focus.',
			},
			{
				name: 'isDragging',
				type: 'boolean',
				description:
					'Whether the element is being dragged. Will apply "dragging" styles to\nmenu item.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Indicates that the menu item is selected.',
			},
			{
				name: 'listItemRef',
				type: '((instance: HTMLDivElement) => void) | RefObject<HTMLDivElement>',
				description:
					'Exposes the `<div role="listitem">` element that wraps the entire item.\n\nThis is the root element rendered by the component.',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Called when the user has clicked on the trigger content.',
			},
			{
				name: 'visualContentRef',
				type: '((instance: HTMLDivElement) => void) | RefObject<HTMLDivElement>',
				description:
					'Exposes the visually complete menu item, including:\n\n- the main interactive element (exposed through `ref`)\n- any `elemBefore`, `elemAfter`, `actions`, or `actionsOnHover`\n\nThis specifically excludes the wrapping list item,\nwhich is also exposed through either:\n- the `listItemRef` prop for LinkMenuItem and ButtonMenuItem\n- the `ref` prop for FlyoutMenuItem and ExpandableMenuItem',
			},
		],
	},
	{
		name: 'ExpandableMenuItem',
		package: '@atlaskit/side-nav-items',
		description:
			'A collapsible navigation container that groups related items under a parent trigger. Supports non-selectable (button) and selectable (link) variants, with optional flyout menus for overflow. Used to create navigation hierarchies in the side navigation rail.',
		status: 'open-beta',
		usageGuidelines: [
			'Group related objects under a parent where users frequently navigate between siblings (e.g., Projects, Dashboards, Spaces).',
			'Surface a scannable subset of max 15 items per section heading, with a clear path to the full set via a "View all {objects}" directory link or an "All/More {objects}" flyout.',
			'Use system-generated views like Starred (user-ordered) and Recent (most-recently-accessed) to speed access to frequent items.',
			'If the selected item is not currently visible (e.g., accessed via flyout), temporarily pin it to the top of the expanded view until the user navigates away.',
			'Do not use an expandable as the very first top-level item in the sidebar; start with a link menu item landing page instead.',
			'Do not use a selectable expandable (link variant) that both navigates and expands unless there is a strong precedent (e.g., Confluence page trees).',
			'Do not mix a selectable expandable with a separate directory link in the same container; the dual destinations confuse users.',
			'Do not exceed 15 items per section heading or introduce a third navigation level in the sidebar.',
			'Do not leave empty sections without guidance; always provide an action or link to create/find items.',
			'Render <ExpandableMenuItem> as a child of <SideNav> within the Navigation System layout.',
			'Choose between non-selectable (button) or selectable (link) variant based on whether the parent label is itself a navigation destination.',
			'For non-selectable triggers: clicking anywhere on the label or chevron toggles expansion. Do not navigate on click. Use for top-level groupings where the parent is not a destination page.',
			'For selectable triggers: label click navigates to the parent route; chevron click toggles expand/collapse. Provide both when the parent has its own landing page and contains children.',
			'Show Starred items first (user-ordered), then Recent items (most-recently-accessed) under separate section headings.',
			'For empty states, display a message (e.g., "No {objects} yet") with a primary action (e.g., "Create {object}") and a link (e.g., "View all {objects}").',
			'Do not nest multiple expandable menu items to create deep hierarchies.',
		],
		contentGuidelines: [
			'Label should be a noun or noun phrase describing what the section contains (e.g., "Projects", "Settings", "Notifications"). Do not use verbs or actions like "Manage" or "View".',
			'Avoid vague or generic terms like "More" or "Misc" that do not help users understand what they will find inside.',
			'Use "View all {objects}" for directory links and "All/More {objects}" for flyouts, consistently.',
		],
		accessibilityGuidelines: [
			'Use button semantics (role=button) for non-selectable expandable triggers. Set aria-expanded=true/false and aria-controls to the expanded region id.',
			'For selectable (navigable) parents, use link semantics for the label and separate the expand affordance (chevron) as its own button with aria-expanded.',
			'Keyboard: Tab moves focus to the expandable trigger; Enter/Space toggles expand/collapse; Left Arrow collapses; Right Arrow expands; Up/Down Arrow moves between items; Home/End jump to first/last item; Esc closes flyouts.',
			'Focus: After expanding via keyboard, keep focus on the trigger; do not auto-move focus. On collapse, keep focus on the trigger. Preserve focus-visible styles.',
			'Announcements: On toggle, do not announce the entire list. Use concise labels, e.g., "Projects, expanded, 12 items". Update aria-expanded only; rely on screen reader verbosity settings.',
			'Touch targets: Minimum 44x44 px for trigger and chevron. Provide at least 8 px spacing between adjacent targets.',
			'Contrast: Trigger text and chevron must meet 4.5:1 against background in default state and 3:1 for icons in active/hover states.',
			'Defer flyout population until trigger focus/hover to reduce initial payload; announce loading with aria-busy on the container.',
			'Show skeleton states (3-5 placeholder rows per section) while loading. Keep chevron disabled until data is ready; preserve container height to avoid layout shift.',
		],
		keywords: [
			'expandable',
			'menu',
			'navigation',
			'sidebar',
			'collapsible',
			'accordion',
			'hierarchy',
			'flyout',
		],
		category: 'navigation',
		examples: [
			'/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport React, { useState } from \'react\';\nimport Button, { IconButton } from \'@atlaskit/button/new\';\nimport { cssMap, jsx } from \'@atlaskit/css\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nimport ClockIcon from \'@atlaskit/icon/core/clock\';\nimport HomeIcon from \'@atlaskit/icon/core/home\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nimport Lozenge from \'@atlaskit/lozenge\';\nimport { SideNavBody } from \'@atlaskit/navigation-system/layout/side-nav\';\nimport { ButtonMenuItem } from \'@atlaskit/side-nav-items/button-menu-item\';\nimport {\n\tExpandableMenuItem,\n\tExpandableMenuItemContent,\n\tExpandableMenuItemTrigger,\n} from \'@atlaskit/side-nav-items/expandable-menu-item\';\nimport { LinkMenuItem } from \'@atlaskit/side-nav-items/link-menu-item\';\nimport { MenuList } from \'@atlaskit/side-nav-items/menu-list\';\nimport { token } from \'@atlaskit/tokens\';\nconst styles = cssMap({\n\troot: {\n\t\twidth: \'300px\',\n\t},\n\twrapper: {\n\t\tpaddingBlockEnd: token(\'space.150\'),\n\t},\n});\nconst AddAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (\n\t<DropdownMenu\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="Add"\n\t\t\t\ticon={(iconProps) => <AddIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t<DropdownItem>Import</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nconst MoreAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (\n\t<DropdownMenu\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="More"\n\t\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Manage starred</DropdownItem>\n\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nconst MockActions = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (\n\t<React.Fragment>\n\t\t<AddAction shouldRenderToParent={shouldRenderToParent} />\n\t\t<MoreAction shouldRenderToParent={shouldRenderToParent} />\n\t</React.Fragment>\n);\nexport const ExpandableMenuItemUnselectable = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nconst ExpandableMenuItemControlled = () => {\n\tconst [isExpanded, setIsExpanded] = useState(false);\n\treturn (\n\t\t<div css={styles.root}>\n\t\t\t<SideNavBody>\n\t\t\t\t<MenuList>\n\t\t\t\t\t<ExpandableMenuItem\n\t\t\t\t\t\tisExpanded={isExpanded}\n\t\t\t\t\t\tonExpansionToggle={() => setIsExpanded((value) => !value)}\n\t\t\t\t\t>\n\t\t\t\t\t\t<ExpandableMenuItemTrigger href="#">Parent menu item</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t</MenuList>\n\t\t\t</SideNavBody>\n\t\t</div>\n\t);\n};\nexport const ExpandableMenuItemSelectable = (): JSX.Element => {\n\tconst [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(null);\n\treturn (\n\t\t<div css={styles.root}>\n\t\t\t<SideNavBody>\n\t\t\t\t<MenuList>\n\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'trigger\'}\n\t\t\t\t\t\t\tonClick={() => setSelectedMenuItemId(\'trigger\')}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\tParent menu item\n\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-1\'}\n\t\t\t\t\t\t\t\tonClick={() => setSelectedMenuItemId(\'item-1\')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tItem 1\n\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-2\'}\n\t\t\t\t\t\t\t\tonClick={() => setSelectedMenuItemId(\'item-2\')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tItem 2\n\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t</MenuList>\n\t\t\t</SideNavBody>\n\t\t</div>\n\t);\n};\nexport const ExpandableMenuItemSelected = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger href="#test" isSelected>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemWithIcon = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger elemBefore={<HomeIcon label="" color={token(\'color.icon\')} />}>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemSelectedWithIcon = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\tisSelected\n\t\t\t\t\t\telemBefore={<HomeIcon label="" color={token(\'color.icon.selected\')} />}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\tisSelected\n\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" />}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item (with currentColor)\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemWithElemAfter = ({\n\tisExpanded,\n}: {\n\tisExpanded?: boolean;\n}): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem isDefaultExpanded={isExpanded}>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\telemBefore={<HomeIcon label="" color={token(\'color.icon\')} />}\n\t\t\t\t\t\telemAfter={<Lozenge>Elem after</Lozenge>}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemExpandedWithElemAfter = (): JSX.Element => (\n\t<ExpandableMenuItemWithElemAfter isExpanded />\n);\nexport const ExpandableMenuItemWithActions = ({\n\tisSelected,\n}: {\n\tisSelected?: boolean;\n}): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\tactions={<MockActions shouldRenderToParent />}\n\t\t\t\t\t\ttestId="menu-item-trigger"\n\t\t\t\t\t\tisSelected={isSelected}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nconst ExpandableMenuItemSelectedWithActions = () => <ExpandableMenuItemWithActions isSelected />;\nexport const ExpandableMenuItemWithActionsOnHover = ({\n\tisSelected,\n\tisExpanded,\n}: {\n\tisExpanded?: boolean;\n\tisSelected?: boolean;\n}): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem isExpanded={isExpanded}>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t\t\t\ttestId="menu-item-trigger"\n\t\t\t\t\t\tisSelected={isSelected}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemExpandedWithActionsOnHover = (): JSX.Element => (\n\t<ExpandableMenuItemWithActionsOnHover isExpanded />\n);\nexport const ExpandableMenuItemSelectedWithActionsOnHover = (): JSX.Element => (\n\t<ExpandableMenuItemWithActionsOnHover isSelected />\n);\nexport const ExpandableMenuItemWithActionsOnHoverAndElemAfter = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t\t\t\ttestId="menu-item-trigger"\n\t\t\t\t\t\telemAfter={<Lozenge>Elem after</Lozenge>}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemWithActionsAndElemAfter = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\tactions={<MockActions shouldRenderToParent />}\n\t\t\t\t\t\ttestId="menu-item-trigger"\n\t\t\t\t\t\telemAfter={<Lozenge>Elem after</Lozenge>}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemExpandedWithActionsOnHoverAndElemAfter = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem isExpanded>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t\t\t\ttestId="menu-item-trigger"\n\t\t\t\t\t\telemAfter={<span>elemAfter</span>}\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemNested = ({\n\thasItemInitiallySelected = true,\n}: {\n\thasItemInitiallySelected?: boolean;\n}): JSX.Element => {\n\tconst [selectedMenuItemId, setSelectedMenuItemId] = useState<string | null>(\n\t\thasItemInitiallySelected ? \'item-4\' : null,\n\t);\n\treturn (\n\t\t<div css={styles.root}>\n\t\t\t<SideNavBody>\n\t\t\t\t<MenuList>\n\t\t\t\t\t<ExpandableMenuItem isDefaultExpanded>\n\t\t\t\t\t\t<ExpandableMenuItemTrigger>Expandable trigger level 1</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-1\'}\n\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-1\');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tItem 1\n\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-2\'}\n\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-2\');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\telemBefore={<ClockIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tItem 2\n\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItem isDefaultExpanded>\n\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'trigger-level-2\'}\n\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'trigger-level-2\');\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\tExpandable trigger level 2 (selectable)\n\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-3\'}\n\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-3\');\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\tItem 3\n\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t\t<ExpandableMenuItem isDefaultExpanded>\n\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'trigger-level-3\'}\n\t\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'trigger-level-3\');\n\t\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\tExpandable trigger level 3 (selectable)\n\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-4\'}\n\t\t\t\t\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-4\');\n\t\t\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\tItem 4\n\t\t\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-5\'}\n\t\t\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-5\');\n\t\t\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\t\t\tactions={<MockActions shouldRenderToParent />}\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\tItem 5\n\t\t\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t\t\tExpandable trigger level 4\n\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-6\'}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-6\');\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tItem 6\n\t\t\t\t\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-7\'}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-7\');\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tItem 7\n\t\t\t\t\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t<LinkMenuItem\n\t\t\t\t\t\t\t\t\t\thref="#test"\n\t\t\t\t\t\t\t\t\t\tisSelected={selectedMenuItemId === \'item-8\'}\n\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\tsetSelectedMenuItemId(\'item-8\');\n\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\tItem 8\n\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t</MenuList>\n\t\t\t</SideNavBody>\n\t\t\t<Button\n\t\t\t\tonClick={() => {\n\t\t\t\t\tsetSelectedMenuItemId(null);\n\t\t\t\t}}\n\t\t\t>\n\t\t\t\tClear selection\n\t\t\t</Button>\n\t\t</div>\n\t);\n};\nexport const ExpandableMenuItemNestedNoSelection = (): JSX.Element => (\n\t<ExpandableMenuItemNested hasItemInitiallySelected={false} />\n);\nexport const ExpandableMenuItemNestedRTL = (): JSX.Element => (\n\t<div dir="rtl">\n\t\t<ExpandableMenuItemNested />\n\t</div>\n);\nexport const ExpandableMenuItemCollapsedWithSelectedChild = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger>Parent menu item</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<LinkMenuItem href="#test" isSelected>\n\t\t\t\t\t\t\tSelected item\n\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger elemBefore={<HomeIcon label="" color={token(\'color.icon\')} />}>\n\t\t\t\t\t\tParent menu item with elemBefore\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<LinkMenuItem href="#test" isSelected>\n\t\t\t\t\t\t\tSelected item\n\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemLink = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger href="#">Parent menu item</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemWithAllOptions = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\telemBefore={<HomeIcon label="" color={token(\'color.icon\')} />}\n\t\t\t\t\t\tactions={<AddAction shouldRenderToParent />}\n\t\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent />}\n\t\t\t\t\t\telemAfter={<Lozenge>Elem after</Lozenge>}\n\t\t\t\t\t\thref="#"\n\t\t\t\t\t\ttestId="parent-menu-item"\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nconst ExpandableMenuItemWithAllOptionsPortalledPopups = () => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\telemBefore={<HomeIcon label="" color={token(\'color.icon\')} />}\n\t\t\t\t\t\tactions={<AddAction shouldRenderToParent={false} />}\n\t\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent={false} />}\n\t\t\t\t\t\telemAfter={<Lozenge>Elem after</Lozenge>}\n\t\t\t\t\t\thref="#"\n\t\t\t\t\t>\n\t\t\t\t\t\tParent menu item\n\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t</ExpandableMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const ExpandableMenuItemWithDropdownActionOpen = ({\n\tisSelected,\n}: {\n\tisSelected?: boolean;\n}): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<ExpandableMenuItem>\n\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\thref="#test"\n\t\t\t\t\tisSelected={isSelected}\n\t\t\t\t\telemBefore={<HomeIcon label="" color={token(\'color.icon\')} />}\n\t\t\t\t\tactions={\n\t\t\t\t\t\t<DropdownMenu\n\t\t\t\t\t\t\tdefaultOpen\n\t\t\t\t\t\t\tshouldRenderToParent\n\t\t\t\t\t\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t\t\t\t\t\t<IconButton\n\t\t\t\t\t\t\t\t\tref={triggerRef}\n\t\t\t\t\t\t\t\t\t{...props}\n\t\t\t\t\t\t\t\t\tspacing="compact"\n\t\t\t\t\t\t\t\t\tappearance="subtle"\n\t\t\t\t\t\t\t\t\tlabel="More"\n\t\t\t\t\t\t\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size="small" />}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t)}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<DropdownItemGroup>\n\t\t\t\t\t\t\t\t<DropdownItem>Manage starred</DropdownItem>\n\t\t\t\t\t\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t\t\t\t\t\t</DropdownItemGroup>\n\t\t\t\t\t\t</DropdownMenu>\n\t\t\t\t\t}\n\t\t\t\t>\n\t\t\t\t\tParent menu item\n\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t<ButtonMenuItem>Item 1</ButtonMenuItem>\n\t\t\t\t\t<ButtonMenuItem>Item 2</ButtonMenuItem>\n\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t</ExpandableMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const ExpandableMenuItemSelectedWithDropdownActionOpen = (): JSX.Element => (\n\t<ExpandableMenuItemWithDropdownActionOpen isSelected />\n);\nconst ExampleWrapper = ({ children }: { children: React.ReactNode }) => (\n\t<div css={styles.wrapper}>{children}</div>\n);\n// Combining into one example for atlaskit site\nconst Example = (): JSX.Element => (\n\t<div>\n\t\t<ExampleWrapper>\n\t\t\tUnselectable\n\t\t\t<ExpandableMenuItemUnselectable />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tSelectable\n\t\t\t<ExpandableMenuItemSelectable />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tSelected\n\t\t\t<ExpandableMenuItemSelected />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tWith icon (elemBefore)\n\t\t\t<ExpandableMenuItemWithIcon />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tSelected with icon (elemBefore)\n\t\t\t<ExpandableMenuItemSelectedWithIcon />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tWith element after (elemAfter)\n\t\t\t<ExpandableMenuItemWithElemAfter />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tWith actions\n\t\t\t<ExpandableMenuItemWithActions />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tSelected with actions\n\t\t\t<ExpandableMenuItemSelectedWithActions />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tWith actions on hover\n\t\t\t<ExpandableMenuItemWithActionsOnHover />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tSelected with actions on hover\n\t\t\t<ExpandableMenuItemSelectedWithActionsOnHover />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tExpanded with actions on hover\n\t\t\t<ExpandableMenuItemExpandedWithActionsOnHover />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tWith actions on hover and element after\n\t\t\t<ExpandableMenuItemWithActionsOnHoverAndElemAfter />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tExpanded with actions on hover and element after\n\t\t\t<ExpandableMenuItemExpandedWithActionsOnHoverAndElemAfter />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tWith actions and element after\n\t\t\t<ExpandableMenuItemWithActionsAndElemAfter />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tNested\n\t\t\t<ExpandableMenuItemNested />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\t<div dir="rtl">Nested RTL</div>\n\t\t\t<ExpandableMenuItemNestedRTL />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tCollapsed with selected child\n\t\t\t<ExpandableMenuItemCollapsedWithSelectedChild />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tExpandable link\n\t\t\t<ExpandableMenuItemLink />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tExpandable with all options\n\t\t\t<ExpandableMenuItemWithAllOptions />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tExpandable with all options (portalled popups)\n\t\t\t<ExpandableMenuItemWithAllOptionsPortalledPopups />\n\t\t</ExampleWrapper>\n\t\t<ExampleWrapper>\n\t\t\tControlled\n\t\t\t<ExpandableMenuItemControlled />\n\t\t</ExampleWrapper>\n\t</div>\n);\nexport default Example;',
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport React, { useCallback, useState } from 'react';\nimport { IconButton } from '@atlaskit/button/new';\nimport { jsx } from '@atlaskit/css';\nimport AddIcon from '@atlaskit/icon/core/add';\nimport ChartBarIcon from '@atlaskit/icon/core/chart-bar';\nimport ClockIcon from '@atlaskit/icon/core/clock';\nimport HomeIcon from '@atlaskit/icon/core/home';\nimport InboxIcon from '@atlaskit/icon/core/inbox';\nimport MoreIcon from '@atlaskit/icon/core/show-more-horizontal';\nimport { JiraIcon } from '@atlaskit/logo';\nimport Lozenge from '@atlaskit/lozenge/lozenge';\nimport { SideNavBody } from '@atlaskit/navigation-system/layout/side-nav';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { ContainerAvatar } from '@atlaskit/side-nav-items/container-avatar';\nimport {\n\tExpandableMenuItem,\n\tExpandableMenuItemContent,\n\tExpandableMenuItemTrigger,\n} from '@atlaskit/side-nav-items/expandable-menu-item';\nimport { LinkMenuItem } from '@atlaskit/side-nav-items/link-menu-item';\nimport { MenuList } from '@atlaskit/side-nav-items/menu-list';\nimport { MenuSection, MenuSectionHeading } from '@atlaskit/side-nav-items/menu-section';\nimport MoneyIcon from '../images/money.svg';\nimport { MockSideNav } from './common/mock-side-nav';\nconst exampleHref = '#example-href';\nfunction PlaceholderExpandableContent({\n\tisSelected,\n\tonClick,\n}: {\n\tisSelected: boolean;\n\tonClick: (event: React.MouseEvent) => void;\n}) {\n\treturn (\n\t\t<ExpandableMenuItemContent>\n\t\t\t<LinkMenuItem\n\t\t\t\thref={exampleHref}\n\t\t\t\telemBefore={<ClockIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\tisSelected={isSelected}\n\t\t\t\tonClick={onClick}\n\t\t\t>\n\t\t\t\tLink menu item\n\t\t\t</LinkMenuItem>\n\t\t</ExpandableMenuItemContent>\n\t);\n}\nfunction AddAction() {\n\treturn (\n\t\t<IconButton\n\t\t\tspacing=\"compact\"\n\t\t\tappearance=\"subtle\"\n\t\t\tlabel=\"Add\"\n\t\t\ticon={(iconProps) => <AddIcon {...iconProps} size=\"small\" spacing=\"spacious\" />}\n\t\t/>\n\t);\n}\nfunction MoreAction() {\n\treturn (\n\t\t<IconButton\n\t\t\tspacing=\"compact\"\n\t\t\tappearance=\"subtle\"\n\t\t\tlabel=\"More\"\n\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size=\"small\" spacing=\"spacious\" />}\n\t\t/>\n\t);\n}\n// Examples of the link variant of the expandable menu item.\n// This means there is an href provided.\n// Clicking on a trigger will select it, demonstrating the selected state.\nexport function ExpandableMenuItemLinkVariantExample(): JSX.Element {\n\t// Track which menu item is currently selected by its unique id\n\tconst [selectedId, setSelectedId] = useState<string | null>(null);\n\t// Creates a click handler that selects the item with the given id.\n\t// Clicking an already-selected item will _not_ deselect it.\n\tconst createClickHandler = useCallback(\n\t\t(id: string) => (event: React.MouseEvent) => {\n\t\t\t// Prevent the default behavior of the link so the URL is not changed when clicked.\n\t\t\tevent.preventDefault();\n\t\t\tsetSelectedId(id);\n\t\t},\n\t\t[],\n\t);\n\treturn (\n\t\t<Inline space=\"space.600\">\n\t\t\t<MockSideNav>\n\t\t\t\t<SideNavBody>\n\t\t\t\t\t<MenuList>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'default'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('default')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (default)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'default-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('default-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'icon'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('icon')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (icon)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'icon-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('icon-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\telemBefore={<ContainerAvatar src={MoneyIcon} />}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'container-avatar'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('container-avatar')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (ContainerAvatar)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'container-avatar-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('container-avatar-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\telemBefore={<JiraIcon label=\"\" shouldUseNewLogoDesign size=\"xsmall\" />}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'app-tile'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('app-tile')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (app tile)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'app-tile-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('app-tile-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem isDefaultExpanded>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'level-0'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('level-0')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (level 0)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t<MenuSection isMenuListItem>\n\t\t\t\t\t\t\t\t\t<MenuSectionHeading>Menus section heading (Level 1)</MenuSectionHeading>\n\t\t\t\t\t\t\t\t\t<MenuList>\n\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\t\t\t\t\telemBefore={<InboxIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedId === 'level-1a'}\n\t\t\t\t\t\t\t\t\t\t\t\tonClick={createClickHandler('level-1a')}\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\tExp link menu item (level 1)\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\telemBefore={<ChartBarIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedId === 'level-2a'}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={createClickHandler('level-2a')}\n\t\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tExp link menu item (level 2)\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedId === 'level-2a-content'}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={createClickHandler('level-2a-content')}\n\t\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem isDefaultExpanded>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\t\t\t\t\telemBefore={<InboxIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedId === 'level-1b'}\n\t\t\t\t\t\t\t\t\t\t\t\tonClick={createClickHandler('level-1b')}\n\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\tExp link menu item (level 1)\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\telemBefore={<ChartBarIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedId === 'level-2b'}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={createClickHandler('level-2b')}\n\t\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tExp link menu item (level 2)\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tisSelected={selectedId === 'level-2b-content'}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={createClickHandler('level-2b-content')}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t</MenuList>\n\t\t\t\t\t\t\t\t</MenuSection>\n\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t</MenuList>\n\t\t\t\t</SideNavBody>\n\t\t\t</MockSideNav>\n\t\t\t<MockSideNav>\n\t\t\t\t<SideNavBody>\n\t\t\t\t\t<MenuList>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\tactions={\n\t\t\t\t\t\t\t\t\t<React.Fragment>\n\t\t\t\t\t\t\t\t\t\t<AddAction />\n\t\t\t\t\t\t\t\t\t\t<MoreAction />\n\t\t\t\t\t\t\t\t\t</React.Fragment>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'actions'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('actions')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (actions)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'actions-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('actions-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\tactionsOnHover={\n\t\t\t\t\t\t\t\t\t<React.Fragment>\n\t\t\t\t\t\t\t\t\t\t<AddAction />\n\t\t\t\t\t\t\t\t\t\t<MoreAction />\n\t\t\t\t\t\t\t\t\t</React.Fragment>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'actions-on-hover'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('actions-on-hover')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (actionsOnHover)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'actions-on-hover-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('actions-on-hover-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label=\"\" spacing=\"spacious\" />}\n\t\t\t\t\t\t\t\tactions={<MoreAction />}\n\t\t\t\t\t\t\t\tactionsOnHover={<AddAction />}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'actions-both'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('actions-both')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (actions & actionsOnHover)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'actions-both-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('actions-both-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label=\"\" />}\n\t\t\t\t\t\t\t\telemAfter={<Lozenge>New</Lozenge>}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'elem-after'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('elem-after')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (elemAfter)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'elem-after-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('elem-after-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\thref={exampleHref}\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label=\"\" />}\n\t\t\t\t\t\t\t\telemAfter={<Lozenge>New</Lozenge>}\n\t\t\t\t\t\t\t\tactions={<MoreAction />}\n\t\t\t\t\t\t\t\tactionsOnHover={<AddAction />}\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'elem-after-actions'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('elem-after-actions')}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp link menu item (elemAfter, actions & actionsOnHover)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent\n\t\t\t\t\t\t\t\tisSelected={selectedId === 'elem-after-actions-content'}\n\t\t\t\t\t\t\t\tonClick={createClickHandler('elem-after-actions-content')}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t</MenuList>\n\t\t\t\t</SideNavBody>\n\t\t\t</MockSideNav>\n\t\t</Inline>\n\t);\n}\nexport default ExpandableMenuItemLinkVariantExample;",
			'import { IconButton } from \'@atlaskit/button/new\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nimport ChartBarIcon from \'@atlaskit/icon/core/chart-bar\';\nimport HomeIcon from \'@atlaskit/icon/core/home\';\nimport InboxIcon from \'@atlaskit/icon/core/inbox\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nimport { JiraIcon } from \'@atlaskit/logo\';\nimport Lozenge from \'@atlaskit/lozenge/lozenge\';\nimport { SideNavBody } from \'@atlaskit/navigation-system/layout/side-nav\';\nimport { Inline } from \'@atlaskit/primitives/compiled/inline\';\nimport { ContainerAvatar } from \'@atlaskit/side-nav-items/container-avatar\';\nimport {\n\tExpandableMenuItem,\n\tExpandableMenuItemContent,\n\tExpandableMenuItemTrigger,\n} from \'@atlaskit/side-nav-items/expandable-menu-item\';\nimport { LinkMenuItem } from \'@atlaskit/side-nav-items/link-menu-item\';\nimport { MenuList } from \'@atlaskit/side-nav-items/menu-list\';\nimport { MenuSection, MenuSectionHeading } from \'@atlaskit/side-nav-items/menu-section\';\nimport MoneyIcon from \'../images/money.svg\';\nimport { MockSideNav } from \'./common/mock-side-nav\';\nconst exampleHref = \'#example-href\';\nfunction PlaceholderExpandableContent() {\n\treturn (\n\t\t<ExpandableMenuItemContent>\n\t\t\t<LinkMenuItem href={exampleHref}>Expandable menu item content</LinkMenuItem>\n\t\t</ExpandableMenuItemContent>\n\t);\n}\nfunction AddAction() {\n\treturn (\n\t\t<IconButton\n\t\t\tspacing="compact"\n\t\t\tappearance="subtle"\n\t\t\tlabel="Add"\n\t\t\ticon={(iconProps) => <AddIcon {...iconProps} size="small" />}\n\t\t/>\n\t);\n}\nfunction MoreAction() {\n\treturn (\n\t\t<IconButton\n\t\t\tspacing="compact"\n\t\t\tappearance="subtle"\n\t\t\tlabel="More"\n\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size="small" />}\n\t\t/>\n\t);\n}\n// Examples of the default (button) variant of the expandable menu item.\n// This means there is no href provided.\nexport function ExpandableMenuItemDefaultVariantExample(): React.JSX.Element {\n\treturn (\n\t\t<Inline space="space.600">\n\t\t\t<MockSideNav>\n\t\t\t\t<SideNavBody>\n\t\t\t\t\t<MenuList>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger>Exp default menu item (default)</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp default menu item (icon)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger elemBefore={<ContainerAvatar src={MoneyIcon} />}>\n\t\t\t\t\t\t\t\tExp default menu item (ContainerAvatar)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<JiraIcon label="" shouldUseNewLogoDesign size="xsmall" />}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp default menu item (app tile)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem isDefaultExpanded>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger>Exp default menu item (level 0)</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t<MenuSection isMenuListItem>\n\t\t\t\t\t\t\t\t\t<MenuSectionHeading>Menus section heading (Level 1)</MenuSectionHeading>\n\t\t\t\t\t\t\t\t\t<MenuList>\n\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger elemBefore={<InboxIcon label="" />}>\n\t\t\t\t\t\t\t\t\t\t\t\tExp default menu item (level 1)\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger elemBefore={<ChartBarIcon label="" />}>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tExp default menu item (level 2)\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<LinkMenuItem href={exampleHref}>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tExpandable menu item content\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem isDefaultExpanded>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger elemBefore={<InboxIcon label="" />}>\n\t\t\t\t\t\t\t\t\t\t\t\tExp default menu item (level 1)\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemTrigger elemBefore={<ChartBarIcon label="" />}>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tExp default menu item (level 2)\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t\t\t\t\t\t\t<ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t<LinkMenuItem href={exampleHref}>\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\tExpandable menu item content\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t</LinkMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t\t\t\t</MenuList>\n\t\t\t\t\t\t\t\t</MenuSection>\n\t\t\t\t\t\t\t</ExpandableMenuItemContent>\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t</MenuList>\n\t\t\t\t</SideNavBody>\n\t\t\t</MockSideNav>\n\t\t\t<MockSideNav>\n\t\t\t\t<SideNavBody>\n\t\t\t\t\t<MenuList>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t\tactions={\n\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t<AddAction />\n\t\t\t\t\t\t\t\t\t\t<MoreAction />\n\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp default menu item (actions)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t\tactionsOnHover={\n\t\t\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t\t\t<AddAction />\n\t\t\t\t\t\t\t\t\t\t<MoreAction />\n\t\t\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp default menu item (actionsOnHover)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t\tactions={<MoreAction />}\n\t\t\t\t\t\t\t\tactionsOnHover={<AddAction />}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp default menu item (actions & actionsOnHover)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t\telemAfter={<Lozenge>New</Lozenge>}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp default menu item (elemAfter)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t\t<ExpandableMenuItem>\n\t\t\t\t\t\t\t<ExpandableMenuItemTrigger\n\t\t\t\t\t\t\t\telemBefore={<HomeIcon label="" color="currentColor" spacing="spacious" />}\n\t\t\t\t\t\t\t\telemAfter={<Lozenge>New</Lozenge>}\n\t\t\t\t\t\t\t\tactions={<MoreAction />}\n\t\t\t\t\t\t\t\tactionsOnHover={<AddAction />}\n\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\tExp default menu item (elemAfter, actions & actionsOnHover)\n\t\t\t\t\t\t\t</ExpandableMenuItemTrigger>\n\t\t\t\t\t\t\t<PlaceholderExpandableContent />\n\t\t\t\t\t\t</ExpandableMenuItem>\n\t\t\t\t\t</MenuList>\n\t\t\t\t</SideNavBody>\n\t\t\t</MockSideNav>\n\t\t</Inline>\n\t);\n}\nexport default ExpandableMenuItemDefaultVariantExample;',
		],
		props: [
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Should contain `ExpandableMenuItemTrigger` and `ExpandableMenuItemContent`.',
				isRequired: true,
			},
			{
				name: 'dropIndicator',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description:
					'A slot to render a drop indicator on an entire menu item (trigger + content).\n\nThis should only be used when the **whole `ExpandableMenuItem` is a drop target**,\nand not when only the `ExpandableMenuItemTrigger` is a drop target.',
			},
			{
				name: 'isDefaultExpanded',
				type: 'boolean',
				description:
					'The default expanded state of the menu item.\n\nYou can use this to set the default expanded state without needing to entirely control the state.',
			},
			{
				name: 'isExpanded',
				type: 'boolean',
				description:
					'The controlled expanded state of the menu item. Allows you to control the expanded state of\nthe menu item externally.\n\nIf you are controlling the state, you should update your state using `onExpansionToggle`.',
			},
			{
				name: 'onExpansionToggle',
				type: '(isExpanded: boolean) => void',
				description:
					'Called when the user has interacted with the menu item to expand or collapse it.\n\nIt is not called when the `isExpanded` controlled state prop is changed.\n\nIf you are controlling the expanded state, you should use this callback to update your state.',
			},
		],
	},
	{
		name: 'LinkMenuItem',
		package: '@atlaskit/side-nav-items',
		description: 'A menu item component for side navigation that navigates to a URL.',
		status: 'general-availability',
		usageGuidelines: [
			'Use LinkMenuItem for standard navigation links in a side navigation bar.',
			'Supports icons, avatars, and labels.',
		],
		keywords: ['navigation', 'menu-item', 'link', 'side-nav'],
		category: 'navigation',
		examples: [
			'/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport Avatar from \'@atlaskit/avatar/Avatar\';\nimport { IconButton } from \'@atlaskit/button/new\';\nimport { cssMap, jsx } from \'@atlaskit/css\';\nimport DropdownMenu, { DropdownItem, DropdownItemGroup } from \'@atlaskit/dropdown-menu\';\nimport AddIcon from \'@atlaskit/icon/core/add\';\nimport HomeIcon from \'@atlaskit/icon/core/home\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nimport Lozenge from \'@atlaskit/lozenge/lozenge\';\nimport { SideNavBody } from \'@atlaskit/navigation-system/layout/side-nav\';\nimport { Stack } from \'@atlaskit/primitives/compiled\';\nimport { COLLAPSE_ELEM_BEFORE, LinkMenuItem } from \'@atlaskit/side-nav-items/link-menu-item\';\nimport { MenuList } from \'@atlaskit/side-nav-items/menu-list\';\nconst styles = cssMap({\n\troot: {\n\t\twidth: \'300px\',\n\t},\n});\nconst AddAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (\n\t<DropdownMenu\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="Add"\n\t\t\t\ticon={(iconProps) => <AddIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Create</DropdownItem>\n\t\t\t<DropdownItem>Import</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nconst MoreAction = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (\n\t<DropdownMenu\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="More"\n\t\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Manage starred</DropdownItem>\n\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nconst MockActions = ({ shouldRenderToParent }: { shouldRenderToParent: boolean }) => (\n\t<React.Fragment>\n\t\t<AddAction shouldRenderToParent={shouldRenderToParent} />\n\t\t<MoreAction shouldRenderToParent={shouldRenderToParent} />\n\t</React.Fragment>\n);\nconst homeIcon = <HomeIcon label="" color="currentColor" spacing="spacious" />;\nconst homeIconButton = (\n\t<IconButton icon={HomeIcon} label="IconButton" appearance="subtle" spacing="compact" />\n);\nconst elemAfter = <Lozenge>elem after</Lozenge>;\nexport const LinkMenuItemExample = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<SideNavBody>\n\t\t\t<MenuList>\n\t\t\t\t<LinkMenuItem href="#">Text only</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={COLLAPSE_ELEM_BEFORE}>\n\t\t\t\t\tText only (collapse elemBefore)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={homeIcon}>\n\t\t\t\t\tWith elemBefore\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={homeIcon}>\n\t\t\t\t\tWith elemBefore and long overflowing text\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore="🙂">\n\t\t\t\t\tEmoji as elemBefore\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tdescription="This is an example of a long description"\n\t\t\t\t>\n\t\t\t\t\tWith description\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tdescription="This is an example of a long description"\n\t\t\t\t\tisSelected\n\t\t\t\t>\n\t\t\t\t\tDescription and selected\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={homeIconButton}>\n\t\t\t\t\tWith icon button as elemBefore\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={homeIcon} isSelected>\n\t\t\t\t\tSelected\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tisSelected\n\t\t\t\t\tactions={<MockActions shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tSelected with actions\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={<Avatar />}>\n\t\t\t\t\tWith avatar\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={homeIcon} actions={<MockActions shouldRenderToParent />}>\n\t\t\t\t\tWith actions\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<MockActions shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith actions (portalled popup)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith hover actions\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith hover actions (portalled popup)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith hover actions and elemBefore and long text\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" elemBefore={homeIcon} elemAfter={elemAfter}>\n\t\t\t\t\tWith elemAfter\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactions={<MockActions shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and actions\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactions={<MockActions shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and actions (portalled popup)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent />}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith actions and hoverActions\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent={false} />}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith actions and hoverActions (portalled popup)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and hoverActions\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIcon}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith elemAfter and hoverActions (portalled popup)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\tdescription="A long description that should be truncated"\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIconButton}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent />}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent />}\n\t\t\t\t>\n\t\t\t\t\tWith all options and long text\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\tdescription="A long description that should be truncated"\n\t\t\t\t\thref="#"\n\t\t\t\t\telemBefore={homeIconButton}\n\t\t\t\t\tactions={<AddAction shouldRenderToParent={false} />}\n\t\t\t\t\telemAfter={elemAfter}\n\t\t\t\t\tactionsOnHover={<MoreAction shouldRenderToParent={false} />}\n\t\t\t\t>\n\t\t\t\t\tWith all options and long text (portalled popup)\n\t\t\t\t</LinkMenuItem>\n\t\t\t</MenuList>\n\t\t</SideNavBody>\n\t</div>\n);\nexport const LinkMenuItemRTLExample = (): JSX.Element => (\n\t<div dir="rtl">\n\t\t<LinkMenuItemExample />\n\t</div>\n);\nexport const LinkMenuItemWithElemAfter = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<LinkMenuItem href="#" elemBefore={homeIcon} elemAfter={elemAfter}>\n\t\t\t\tWith elemAfter\n\t\t\t</LinkMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const LinkMenuItemWithElemAfterAndActionsOnHover = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<LinkMenuItem\n\t\t\t\thref="#"\n\t\t\t\telemBefore={homeIcon}\n\t\t\t\telemAfter={elemAfter}\n\t\t\t\tactionsOnHover={<MockActions shouldRenderToParent />}\n\t\t\t>\n\t\t\t\tWith elemAfter and actionsOnHover\n\t\t\t</LinkMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const LinkMenuItemBasic = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<LinkMenuItem href="#" elemBefore={homeIcon}>\n\t\t\t\tBasic link menu item\n\t\t\t</LinkMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nexport const LinkMenuItemSelected = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<LinkMenuItem href="#" isSelected elemBefore={homeIcon}>\n\t\t\t\tSelected link menu item\n\t\t\t</LinkMenuItem>\n\t\t</MenuList>\n\t</div>\n);\nconst ExportAction = ({\n\tshouldRenderToParent,\n\tdefaultOpen,\n}: {\n\tdefaultOpen?: boolean;\n\tshouldRenderToParent?: boolean;\n}) => (\n\t<DropdownMenu\n\t\tdefaultOpen={defaultOpen}\n\t\tshouldRenderToParent={shouldRenderToParent}\n\t\ttrigger={({ triggerRef, ...props }) => (\n\t\t\t<IconButton\n\t\t\t\tref={triggerRef}\n\t\t\t\t{...props}\n\t\t\t\tspacing="compact"\n\t\t\t\tappearance="subtle"\n\t\t\t\tlabel="More"\n\t\t\t\ticon={(iconProps) => <MoreIcon {...iconProps} size="small" />}\n\t\t\t/>\n\t\t)}\n\t>\n\t\t<DropdownItemGroup>\n\t\t\t<DropdownItem>Export</DropdownItem>\n\t\t</DropdownItemGroup>\n\t</DropdownMenu>\n);\nexport const LinkMenuItemWithDropdownActionOpen = (): JSX.Element => (\n\t<div css={styles.root}>\n\t\t<MenuList>\n\t\t\t<Stack space="space.800">\n\t\t\t\t<LinkMenuItem href="#" actions={<ExportAction shouldRenderToParent defaultOpen />}>\n\t\t\t\t\tDropdown open (actions)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\tisSelected\n\t\t\t\t\tactions={<ExportAction shouldRenderToParent defaultOpen />}\n\t\t\t\t>\n\t\t\t\t\tSelected with dropdown open (actions)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" actions={<ExportAction shouldRenderToParent={false} defaultOpen />}>\n\t\t\t\t\tPortalled dropdown open (actions)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem href="#" actionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}>\n\t\t\t\t\tDropdown open (actionsOnHover)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\tactionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}\n\t\t\t\t>\n\t\t\t\t\tPortalled dropdown open (actionsOnHover)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemAfter={<Lozenge>elem after</Lozenge>}\n\t\t\t\t\tactionsOnHover={<ExportAction shouldRenderToParent defaultOpen />}\n\t\t\t\t>\n\t\t\t\t\telemAfter and dropdown open (actionsOnHover)\n\t\t\t\t</LinkMenuItem>\n\t\t\t\t<LinkMenuItem\n\t\t\t\t\thref="#"\n\t\t\t\t\telemAfter={<Lozenge>elem after</Lozenge>}\n\t\t\t\t\tactionsOnHover={<ExportAction shouldRenderToParent={false} defaultOpen />}\n\t\t\t\t>\n\t\t\t\t\telemAfter and portalled dropdown open (actionsOnHover)\n\t\t\t\t</LinkMenuItem>\n\t\t\t</Stack>\n\t\t</MenuList>\n\t</div>\n);\n// Combining into one example for atlaskit site\nconst Example = (): JSX.Element => (\n\t<div>\n\t\t<LinkMenuItemExample />\n\t\t<div dir="rtl">RTL</div>\n\t\t<LinkMenuItemRTLExample />\n\t</div>\n);\nexport default Example;',
		],
		props: [
			{
				name: 'actions',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'`ReactNode` to be placed visually after the `children`.\n\nIt is intended for additional actions (e.g. IconButtons).\n\nThey will not be rendered when the menu item is disabled.',
			},
			{
				name: 'actionsOnHover',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'`ReactNode` to be placed visually after the `children` and will\nonly be displayed on hover or focus.\n\nIt is intended for additional actions (e.g. IconButtons).\n\nThis `ReactNode` will replace `elemAfter` on hover or focus.\n\nThey will not be rendered when the menu item is disabled.\n\nThis `ReactNode` will be rendered visually on top of the main\ninteractive element for the menu item. If this element does not\ncontain an interactive element (`button` or `a`) then `pointer-events`\nwill be set to `none` on this slot so that users can click through\nthis element onto the main interactive element of the menu item.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'The main textual content and label of the menu item.\n\nThe content will be truncated to fit into the side nav in one line.\n\n**Note:** Placing non-textual content (such as lozenges) can cause unexpected truncation behavior.\nUse the provided slot props such as `elemBefore` or `elemAfter` for non-textual content instead.',
				isRequired: true,
			},
			{
				name: 'description',
				type: 'string',
				description:
					'Additional textual content for the menu item.\nIt is displayed underneath the main content.',
			},
			{
				name: 'dropIndicator',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'A slot to render drop indicators for drag and drop operations on the menu item.',
			},
			{
				name: 'elemAfter',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'`ReactNode` to be placed visually after the `children`.\n\nIt is intended for static content (e.g. a `Lozenge`).\n\nIf both `elemAfter` and `actionsOnHover` are provided, `elemAfter` will\nnot be displayed when the item is hovered over or expanded. This is\nbecause the `actionsOnHover` will be displayed instead.\n\nThis `ReactNode` will be rendered visually on top of the main\ninteractive element for the menu item. If this element does not\ncontain an interactive element (`button` or `a`) then `pointer-events`\nwill be set to `none` on this slot so that users can click through\nthis element onto the main interactive element of the menu item.',
			},
			{
				name: 'elemBefore',
				type: 'React.ReactNode | typeof COLLAPSE_ELEM_BEFORE',
				description:
					'`ReactNode` to be placed visually before the `children`.\n\nThis `ReactNode` will be rendered visually on top of the main\ninteractive element for the menu item. If this element does not\ncontain an interactive element (`button` or `a`) then `pointer-events`\nwill be set to `none` on this slot so that users can click through\nthis element onto the main interactive element of the menu item.\n\nIf you want to collapse the `elemBefore` so it takes up no space,\nthen pass in the `COLLAPSE_ELEM_BEFORE` symbol. Keep in mind that\ncollapsing the `elemBefore` can break visual alignment and\nwill make it difficult for users to visually distinguish levels\nin the side navigation.\n\n@example\n\n```tsx\n<MenuItemButton elemBefore={<HomeIcon label="home" />}>Home</MenuItemButton>\n\n// collapse the elemBefore\n<MenuItemButton elemBefore={COLLAPSE_ELEM_BEFORE}>Home</MenuItemButton>\n```',
			},
			{
				name: 'hasDragIndicator',
				type: 'boolean',
				description:
					'Whether this menu item can be dragged. Add a drag handle to this item.\nYou are responsible for wiring up drag and drop to the menu item.\n\n\n- Please be sure to make the MenuItem `ref` the `draggable` element\n- See our navigation drag and drop guidelines for more technical details',
			},
			{
				name: 'href',
				type: 'string | RouterLinkConfig',
				description:
					'Standard links can be provided as a string, which should be mapped to the\nunderlying router link component.\n\nAlternatively, you can provide an object for advanced link configurations\nby supplying the expected object type to the generic.\n\n@example\n```\nconst MyRouterLink = forwardRef(\n(\n  {\n    href,\n    children,\n    ...rest\n  }: RouterLinkComponentProps<{\n    href: string;\n    replace: boolean;\n  }>,\n  ref: Ref<HTMLAnchorElement>,\n) => { ...\n```',
				isRequired: true,
			},
			{
				name: 'isContentTooltipDisabled',
				type: 'boolean',
				description:
					'Disable tooltip for menu item content. This should only be done when there is some other way\nto display the full menu content and description of a menu item close by (eg with another popup)',
			},
			{
				name: 'isDragging',
				type: 'boolean',
				description:
					'Whether the element is being dragged. Will apply "dragging" styles to\nmenu item.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description:
					'Indicates that the menu item is selected.\nWhether the menu item is selected.',
			},
			{
				name: 'listItemRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description:
					'Exposes the `<div role="listitem">` element that wraps the entire item.\n\nThis is the root element rendered by the component.',
			},
			{
				name: 'onClick',
				type: '(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Called when the user has clicked on the trigger content.',
			},
			{
				name: 'target',
				type: 'string',
				description: 'The native `target` attribute for the anchor element.',
			},
			{
				name: 'visualContentRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description:
					'Exposes the visually complete menu item, including:\n\n- the main interactive element (exposed through `ref`)\n- any `elemBefore`, `elemAfter`, `actions`, or `actionsOnHover`\n\nThis specifically excludes the wrapping list item,\nwhich is also exposed through either:\n- the `listItemRef` prop for LinkMenuItem and ButtonMenuItem\n- the `ref` prop for FlyoutMenuItem and ExpandableMenuItem',
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
		name: 'SmartUserPicker',
		package: '@atlaskit/smart-user-picker',
		description:
			'A user picker component that provides ranked recommendations based on the current context.',
		status: 'general-availability',
		usageGuidelines: [
			'Use SmartUserPicker to allow users to select other users or teams.',
			'Provides intelligent recommendations to help users find the right person quickly.',
			'Supports searching by name, email, and other criteria.',
		],
		keywords: ['user', 'picker', 'recommendations', 'search', 'teams'],
		category: 'interaction',
		examples: [
			"import React, { Fragment, useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport {\n\ttype ActionTypes,\n\ttype OnChange,\n\ttype OnInputChange,\n\ttype Value,\n\ttype OptionData,\n\ttype ExternalUser,\n\ttype User,\n\ttype Team,\n} from '@atlaskit/user-picker';\nimport SmartUserPicker from '../src';\nimport Textfield from '@atlaskit/textfield';\nimport Select from '@atlaskit/select';\nimport Button from '@atlaskit/button/standard-button';\nimport { AnalyticsListener, type UIAnalyticsEvent } from '@atlaskit/analytics-next';\nimport { options } from '../example-helpers/options';\nimport { useEndpointMocks } from '../example-helpers/mock-endpoints';\nimport '../example-helpers/mock-ufo';\nimport { search as thirdPartyIntegrationSearch } from '@atlassian/integrations/third-party';\nconst exampleLocales = ['en-EN', 'cs-CZ', 'da-DK', 'de-DE'];\nconst products = [\n\t{ label: 'Jira', value: 'jira' },\n\t{ label: 'Confluence', value: 'confluence' },\n\t{ label: 'People', value: 'people' },\n\t{ label: 'Bitbucket', value: 'bitbucket' },\n];\nexport interface BitbucketAttributes {\n\tisPublicRepo?: boolean;\n\tworkspaceIds?: string[];\n\temailDomain?: string;\n}\nexport interface ConfluenceAttributes {\n\tisEntitledConfluenceExternalCollaborator?: boolean;\n}\ntype State = {\n\tuserId: string;\n\ttenantId: string;\n\torgId: string;\n\tproduct: string;\n\tincludeUsers: boolean;\n\tincludeGroups: boolean;\n\tincludeTeams: boolean;\n\tincludeNonLicensedUsers: boolean;\n\tisFilterOn: boolean;\n\tisMulti: boolean;\n\tisPrefetchOn: boolean;\n\tfieldId: string;\n\tchildObjectId?: string;\n\tobjectId?: string;\n\tcontainerId?: string;\n\tbootstrapOptions: boolean;\n\tbitbucketAttributes: BitbucketAttributes;\n\tconfluenceAttributes: ConfluenceAttributes;\n\tlocale: string;\n\tselectedOptionIds: Set<string>;\n\tincludeThirdPartyResolvers: boolean;\n};\nconst TENANT_ID = 'fake-tenant-id';\nconst ORG_ID = 'fake-org-id';\nconst productsMap = products\n\t.map((p) => ({ [p.value]: p }))\n\t.reduce((acc, val) => ({ ...acc, ...val }), {});\nconst SmartUserPickerCustomizableExample = (): React.JSX.Element => {\n\tuseEndpointMocks();\n\tlet [state, setState] = useState<State>({\n\t\tuserId: 'context',\n\t\ttenantId: TENANT_ID,\n\t\torgId: ORG_ID,\n\t\tfieldId: 'storybook',\n\t\tproduct: 'jira',\n\t\tincludeUsers: true,\n\t\tincludeGroups: false,\n\t\tincludeTeams: true,\n\t\tincludeNonLicensedUsers: false,\n\t\tisFilterOn: false,\n\t\tisMulti: true,\n\t\tisPrefetchOn: false,\n\t\tchildObjectId: undefined,\n\t\tobjectId: undefined,\n\t\tcontainerId: undefined,\n\t\tconfluenceAttributes: {\n\t\t\tisEntitledConfluenceExternalCollaborator: false,\n\t\t},\n\t\tbitbucketAttributes: {\n\t\t\tworkspaceIds: ['workspace-1', 'workspace-2'],\n\t\t\temailDomain: 'atlassian.com',\n\t\t\tisPublicRepo: true,\n\t\t},\n\t\tbootstrapOptions: false,\n\t\tlocale: 'en',\n\t\tselectedOptionIds: new Set(),\n\t\tincludeThirdPartyResolvers: false,\n\t});\n\tconst getProductAttributes = (product: string) => {\n\t\tswitch (product) {\n\t\t\tcase 'bitbucket':\n\t\t\t\treturn state.bitbucketAttributes;\n\t\t\tcase 'confluence':\n\t\t\t\treturn state.confluenceAttributes;\n\t\t\tdefault:\n\t\t\t\treturn undefined;\n\t\t}\n\t};\n\tlet onInputChange: OnInputChange = (query?: string, sessionId?: string) => {\n\t\tconsole.log(`onInputChange query=${query} sessionId=${sessionId}`);\n\t};\n\tlet onEvent = (e: UIAnalyticsEvent) => {\n\t\tconsole.log(\n\t\t\t`Analytics ${e.payload.attributes.sessionId} ${e.payload.actionSubject} ${e.payload.action} `,\n\t\t\te.payload,\n\t\t);\n\t};\n\tlet filterOptions = (userData: OptionData[]): OptionData[] => {\n\t\treturn userData.filter((option) => !state.selectedOptionIds.has(option.id));\n\t};\n\tconst thirdPartyContactsResolver = async (query: string) => {\n\t\tconst cloudId = 'mock-cloud-id';\n\t\tconst thirdPartyContacts: OptionData[] = await thirdPartyIntegrationSearch(\n\t\t\tquery,\n\t\t\tcloudId,\n\t\t).catch((e) => {\n\t\t\tconsole.log('Error fetching third-party contacts', e);\n\t\t\treturn [];\n\t\t});\n\t\treturn thirdPartyContacts;\n\t};\n\tconst userResolvers = [thirdPartyContactsResolver];\n\tlet onChange: OnChange = (value: Value, action: ActionTypes) => {\n\t\tvar selectedOptionIds = state.selectedOptionIds;\n\t\tif (Array.isArray(value)) {\n\t\t\tvalue.forEach((option) => selectedOptionIds.add(option.id));\n\t\t} else {\n\t\t\tvalue && selectedOptionIds.add(value.id);\n\t\t}\n\t\tsetState({\n\t\t\t...state,\n\t\t\tselectedOptionIds,\n\t\t});\n\t};\n\tlet overrideByline = (item: User | ExternalUser | Team) => {\n\t\treturn (item as ExternalUser).isExternal ? 'Invite to Product' : '';\n\t};\n\tlet createBoolean = (\n\t\tid:\n\t\t\t| 'includeUsers'\n\t\t\t| 'includeGroups'\n\t\t\t| 'includeTeams'\n\t\t\t| 'includeNonLicensedUsers'\n\t\t\t| 'isPrefetchOn'\n\t\t\t| 'bootstrapOptions'\n\t\t\t| 'isMulti'\n\t\t\t| 'isFilterOn'\n\t\t\t| 'includeThirdPartyResolvers',\n\t\tlabel: string,\n\t) => {\n\t\treturn (\n\t\t\t<div>\n\t\t\t\t{\n\t\t\t\t<input\n\t\t\t\t\tchecked={Boolean(state[id] as boolean)}\n\t\t\t\t\tid={id}\n\t\t\t\t\tonChange={() =>\n\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\t[id]: !state[id],\n\t\t\t\t\t\t})\n\t\t\t\t\t}\n\t\t\t\t\ttype=\"checkbox\"\n\t\t\t\t/>\n\t\t\t\t<label htmlFor={id}>{label}</label>\n\t\t\t</div>\n\t\t);\n\t};\n\tlet createText = (\n\t\tid: 'userId' | 'tenantId' | 'orgId' | 'objectId' | 'childObjectId' | 'fieldId' | 'containerId',\n\t\twidth: 'large' | 'medium',\n\t) => {\n\t\treturn (\n\t\t\t<Textfield\n\t\t\t\twidth={width}\n\t\t\t\tname={id}\n\t\t\t\tvalue={(state[id] as string) || ''}\n\t\t\t\tonChange={(e) => {\n\t\t\t\t\tsetState({\n\t\t\t\t\t\t...state,\n\t\t\t\t\t\t[id]: e.currentTarget.value,\n\t\t\t\t\t});\n\t\t\t\t}}\n\t\t\t/>\n\t\t);\n\t};\n\treturn (\n\t\t<div>\n\t\t\t<label htmlFor=\"product\">Product</label>\n\t\t\t<Select\n\t\t\t\twidth=\"medium\"\n\t\t\t\tonChange={(selectedValue) => {\n\t\t\t\t\tif (selectedValue) {\n\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\tproduct: selectedValue.value,\n\t\t\t\t\t\t});\n\t\t\t\t\t}\n\t\t\t\t}}\n\t\t\t\tvalue={productsMap[state.product]}\n\t\t\t\tclassName=\"single-select\"\n\t\t\t\tclassNamePrefix=\"react-select\"\n\t\t\t\toptions={products}\n\t\t\t\tplaceholder=\"Choose a Product\"\n\t\t\t/>\n\t\t\t<label htmlFor=\"product\">Locale</label>\n\t\t\t<Select\n\t\t\t\toptions={exampleLocales.map((locale) => ({\n\t\t\t\t\tlabel: locale,\n\t\t\t\t\tvalue: locale,\n\t\t\t\t}))}\n\t\t\t\tonChange={(chosenOption) =>\n\t\t\t\t\tchosenOption &&\n\t\t\t\t\tsetState({\n\t\t\t\t\t\t...state,\n\t\t\t\t\t\tlocale: chosenOption.value,\n\t\t\t\t\t})\n\t\t\t\t}\n\t\t\t\tvalue={{ label: state.locale, value: state.locale }}\n\t\t\t\twidth={150}\n\t\t\t/>\n\t\t\t<h5>Smart Picker props</h5>\n\t\t\t<label htmlFor=\"tenantId\">\n\t\t\t\tTenant Id\n\t\t\t\t<Button\n\t\t\t\t\tappearance=\"link\"\n\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\ttenantId: TENANT_ID,\n\t\t\t\t\t\t\tproduct: 'jira',\n\t\t\t\t\t\t\tincludeGroups: false,\n\t\t\t\t\t\t});\n\t\t\t\t\t}}\n\t\t\t\t>\n\t\t\t\t\tJdog\n\t\t\t\t</Button>\n\t\t\t\t<Button\n\t\t\t\t\tappearance=\"link\"\n\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\ttenantId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',\n\t\t\t\t\t\t\tproduct: 'confluence',\n\t\t\t\t\t\t\tincludeGroups: true,\n\t\t\t\t\t\t});\n\t\t\t\t\t}}\n\t\t\t\t>\n\t\t\t\t\tPug\n\t\t\t\t</Button>\n\t\t\t\t<Button\n\t\t\t\t\tappearance=\"link\"\n\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\ttenantId: 'bitbucket',\n\t\t\t\t\t\t\tproduct: 'bitbucket',\n\t\t\t\t\t\t});\n\t\t\t\t\t}}\n\t\t\t\t>\n\t\t\t\t\tBitbucket\n\t\t\t\t</Button>\n\t\t\t</label>\n\t\t\t{createText('tenantId', 'large')}\n\t\t\t<label htmlFor=\"orgId\">\n\t\t\t\tOrg Id\n\t\t\t\t<Button\n\t\t\t\t\tappearance=\"link\"\n\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\torgId: ORG_ID,\n\t\t\t\t\t\t});\n\t\t\t\t\t}}\n\t\t\t\t>\n\t\t\t\t\tMock value\n\t\t\t\t</Button>\n\t\t\t\t<Button\n\t\t\t\t\tappearance=\"link\"\n\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\torgId: '3f97e0d7-a8ca-4263-91bf-3015999c8e64',\n\t\t\t\t\t\t});\n\t\t\t\t\t}}\n\t\t\t\t>\n\t\t\t\t\tPug\n\t\t\t\t</Button>\n\t\t\t</label>\n\t\t\t{createText('orgId', 'large')}\n\t\t\t<label htmlFor=\"userId\">User Id (userId)</label>\n\t\t\t{createText('userId', 'large')}\n\t\t\t<label htmlFor=\"fieldId\">Context Id (fieldId)</label>\n\t\t\t{createText('fieldId', 'large')}\n\t\t\t{state.product === 'bitbucket' && (\n\t\t\t\t<label htmlFor=\"containerId\">Repository Id [Optional] (containerId)</label>\n\t\t\t)}\n\t\t\t{state.product !== 'bitbucket' && (\n\t\t\t\t<label htmlFor=\"containerId\">Container Id [Optional] (containerId)</label>\n\t\t\t)}\n\t\t\t{createText('containerId', 'large')}\n\t\t\t<label htmlFor=\"objectId\">Object Id [Optional] (objectId)</label>\n\t\t\t{createText('objectId', 'large')}\n\t\t\t<label htmlFor=\"childObjectId\">Child Object Id [Optional] (childObjectId)</label>\n\t\t\t{createText('childObjectId', 'large')}\n\t\t\t{createBoolean('includeUsers', 'include Users (includeUsers)')}\n\t\t\t{createBoolean('includeTeams', 'include Teams (includeTeams)')}\n\t\t\t{createBoolean(\n\t\t\t\t'includeNonLicensedUsers',\n\t\t\t\t'include Non Licensed Users (includeNonLicensedUsers)',\n\t\t\t)}\n\t\t\t{createBoolean('isPrefetchOn', 'Prefetch')}\n\t\t\t{createBoolean('bootstrapOptions', 'bootstrapOptions')}\n\t\t\t{createBoolean('isMulti', 'isMulti')}\n\t\t\t{createBoolean('isFilterOn', 'filter last selected')}\n\t\t\t{createBoolean('includeThirdPartyResolvers', 'include Third Party Resolvers (userResolvers)')}\n\t\t\t{state.product === 'confluence' && (\n\t\t\t\t<Fragment>\n\t\t\t\t\t<h5>Confluence props</h5>\n\t\t\t\t\t{createBoolean('includeGroups', 'include Groups (includeGroups)')}\n\t\t\t\t\t<div>\n\t\t\t\t\t\t{\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tchecked={Boolean(state.confluenceAttributes.isEntitledConfluenceExternalCollaborator)}\n\t\t\t\t\t\t\tid=\"includeGuests\"\n\t\t\t\t\t\t\tonChange={(e) => {\n\t\t\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\t\t\tconfluenceAttributes: {\n\t\t\t\t\t\t\t\t\t\t...state.confluenceAttributes,\n\t\t\t\t\t\t\t\t\t\tisEntitledConfluenceExternalCollaborator:\n\t\t\t\t\t\t\t\t\t\t\t!state.confluenceAttributes.isEntitledConfluenceExternalCollaborator,\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\ttype=\"checkbox\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<label htmlFor=\"includeGuests\">include Guests</label>\n\t\t\t\t\t</div>\n\t\t\t\t</Fragment>\n\t\t\t)}\n\t\t\t{state.product === 'bitbucket' && (\n\t\t\t\t<Fragment>\n\t\t\t\t\t<h5>Bitbucket props</h5>\n\t\t\t\t\t<label htmlFor=\"workspaceIds\">Workspace Ids (workspaceIds)</label>\n\t\t\t\t\t<Textfield\n\t\t\t\t\t\tname=\"workspaceIds\"\n\t\t\t\t\t\tvalue={state.bitbucketAttributes.workspaceIds || ''}\n\t\t\t\t\t\tonChange={(e) => {\n\t\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\t\tbitbucketAttributes: {\n\t\t\t\t\t\t\t\t\t...state.bitbucketAttributes,\n\t\t\t\t\t\t\t\t\tworkspaceIds: e.currentTarget.value,\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}}\n\t\t\t\t\t/>\n\t\t\t\t\t<label htmlFor=\"emailDomain\">Email domain (emailDomain)</label>\n\t\t\t\t\t<Textfield\n\t\t\t\t\t\tname=\"emailDomain\"\n\t\t\t\t\t\tvalue={state.bitbucketAttributes.emailDomain || ''}\n\t\t\t\t\t\tonChange={(e) => {\n\t\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\t\tbitbucketAttributes: {\n\t\t\t\t\t\t\t\t\t...state.bitbucketAttributes,\n\t\t\t\t\t\t\t\t\temailDomain: e.currentTarget.value,\n\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t});\n\t\t\t\t\t\t}}\n\t\t\t\t\t/>\n\t\t\t\t\t<div>\n\t\t\t\t\t\t{\n\t\t\t\t\t\t<input\n\t\t\t\t\t\t\tchecked={Boolean(state.bitbucketAttributes.isPublicRepo)}\n\t\t\t\t\t\t\tid=\"isPublicRepo\"\n\t\t\t\t\t\t\tonChange={(e) => {\n\t\t\t\t\t\t\t\tsetState({\n\t\t\t\t\t\t\t\t\t...state,\n\t\t\t\t\t\t\t\t\tbitbucketAttributes: {\n\t\t\t\t\t\t\t\t\t\t...state.bitbucketAttributes,\n\t\t\t\t\t\t\t\t\t\tisPublicRepo: !state.bitbucketAttributes.isPublicRepo,\n\t\t\t\t\t\t\t\t\t},\n\t\t\t\t\t\t\t\t});\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\ttype=\"checkbox\"\n\t\t\t\t\t\t/>\n\t\t\t\t\t\t<label htmlFor=\"isPublicRepo\">is Public Repository (isPublicRepo)</label>\n\t\t\t\t\t</div>\n\t\t\t\t</Fragment>\n\t\t\t)}\n\t\t\t<hr role=\"presentation\" />\n\t\t\t<label htmlFor=\"smart-user-picker-example\">User Picker</label>\n\t\t\t<AnalyticsListener onEvent={onEvent} channel=\"fabric-elements\">\n\t\t\t\t<IntlProvider locale={state.locale}>\n\t\t\t\t\t<SmartUserPicker\n\t\t\t\t\t\tmaxOptions={10}\n\t\t\t\t\t\tisMulti={state.isMulti}\n\t\t\t\t\t\tincludeUsers={state.includeUsers}\n\t\t\t\t\t\tincludeGroups={state.includeGroups}\n\t\t\t\t\t\tincludeTeams={state.includeTeams}\n\t\t\t\t\t\tincludeNonLicensedUsers={state.includeNonLicensedUsers}\n\t\t\t\t\t\tfieldId={state.fieldId}\n\t\t\t\t\t\tonChange={onChange}\n\t\t\t\t\t\tonInputChange={onInputChange}\n\t\t\t\t\t\tprincipalId={state.userId}\n\t\t\t\t\t\tsiteId={state.tenantId}\n\t\t\t\t\t\torgId={state.orgId}\n\t\t\t\t\t\tproductKey={state.product}\n\t\t\t\t\t\tobjectId={state.objectId}\n\t\t\t\t\t\tcontainerId={state.containerId}\n\t\t\t\t\t\tchildObjectId={state.childObjectId}\n\t\t\t\t\t\tdebounceTime={400}\n\t\t\t\t\t\tprefetch={state.isPrefetchOn}\n\t\t\t\t\t\tfilterOptions={state.isFilterOn ? filterOptions : undefined}\n\t\t\t\t\t\tbootstrapOptions={state.bootstrapOptions ? options : undefined}\n\t\t\t\t\t\tproductAttributes={getProductAttributes(state.product)}\n\t\t\t\t\t\tonError={(e) => {\n\t\t\t\t\t\t\tconsole.error(e);\n\t\t\t\t\t\t}}\n\t\t\t\t\t\toverrideByline={overrideByline}\n\t\t\t\t\t\tinputId=\"smart-user-picker-example\"\n\t\t\t\t\t\tuserResolvers={state.includeThirdPartyResolvers ? userResolvers : undefined}\n\t\t\t\t\t/>\n\t\t\t\t</IntlProvider>\n\t\t\t</AnalyticsListener>\n\t\t</div>\n\t);\n};\nexport default SmartUserPickerCustomizableExample;",
		],
		props: [
			{
				name: 'activationId',
				type: 'string',
				description: 'Identifier for the product activation.',
			},
			{
				name: 'addMoreMessage',
				type: 'string',
				description: 'Message to encourage the user to add more items to user picker.',
			},
			{
				name: 'allowEmail',
				type: 'boolean',
				description: 'Whether the user is allowed to enter emails as a value.',
			},
			{
				name: 'allowEmailSelectionWhenEmailMatched',
				type: 'boolean',
				description:
					"When both allowEmail and enableEmailSearch are true, this controls whether both email entry\nand matched user entries can be selected simultaneously.\nIf false, only allows email selection when:\n  1. The query matches email format (validated by regex)\n  2. No user/external user matches are found (teams/groups don't suppress email entry)",
				defaultValue: 'true',
			},
			{
				name: 'anchor',
				type: 'React.ComponentClass<any, any> | React.FunctionComponent<any>',
				description: 'Anchor for the user picker popup.',
			},
			{
				name: 'appearance',
				type: '"normal" | "compact"',
				description: 'Appearance of the user picker.',
			},
			{
				name: 'ariaDescribedBy',
				type: 'string',
				description:
					'Accessibility: Identifies the element (or elements) that describe the current element.',
			},
			{
				name: 'ariaLabel',
				type: 'string',
				description: 'Accessibility: Uses to set aria-label of the input',
			},
			{
				name: 'ariaLabelledBy',
				type: 'string',
				description:
					'Accessibility: Identifies the element (or elements) that labels the current element.',
			},
			{
				name: 'ariaLive',
				type: '"polite" | "off" | "assertive"',
				description:
					'Accessibility: Used to set the priority with which screen reader should treat updates to live regions.',
			},
			{
				name: 'autoFocus',
				type: 'boolean',
				description:
					'Override the internal behaviour to automatically focus the control when the picker is open',
			},
			{
				name: 'baseUrl',
				type: 'string',
				description: 'The base URL of the site eg: hello.atlassian.net',
			},
			{
				name: 'bootstrapOptions',
				type: 'OptionData[]',
				description:
					'Hydrated user suggestions to show when the query is blank. If not provided, smart user picker\n will still provide a smart-ranked list of suggestions for blank queries. Please refer to @atlaskit/user-picker\n for OptionData type.',
			},
			{
				name: 'captureMenuScroll',
				type: 'boolean',
				description:
					'React-select prop for blocking menu scroll on container when menu scrolled to the very top/bottom of the menu',
			},
			{
				name: 'childObjectId',
				type: 'string',
				description:
					'Context information for analytics. Eg: if a user picker was put inside a comment, the childObjectId would be\n the ID of the comment. Optional, but please provide if available.',
			},
			{
				name: 'clearValueLabel',
				type: 'string',
				description: 'Optional tooltip to display on hover over the clear indicator.',
			},
			{
				name: 'closeMenuOnScroll',
				type: 'boolean | EventListener',
				description: 'Whether to close menu on scroll',
			},
			{
				name: 'components',
				type: '{ Option?: React.ComponentType<OptionProps<OptionData, boolean, GroupBase<OptionData>>>; Group?: React.ComponentType<GroupProps<OptionData, boolean, GroupBase<...>>>; ... 19 more ...; ValueContainer?: React.ComponentType<...>; }',
				description: 'Override the default components used in the user picker.',
			},
			{
				name: 'containerId',
				type: 'string',
				description:
					'The container Id to identify context.\n\ne.g. Jira: projectId. Confluence: spaceId. Bitbucket: repositoryId.',
			},
			{
				name: 'customGroupAnalyticsLabels',
				type: '{ user?: string; team?: string; email?: string; group?: string; custom?: string; external_user?: string; }',
				description:
					"Stable, locale-independent labels keyed by option type, used only for analytics events.\nWhen provided alongside `customGroupLabels`, the corresponding string will be emitted as the\n`selectedLabel` analytics attribute instead of the raw option type, allowing consumers to\nreport meaningful group identifiers (e.g. `'recommendedAgents'`) without leaking display text.",
			},
			{
				name: 'customGroupLabels',
				type: '{ user?: React.ReactNode; team?: React.ReactNode; email?: React.ReactNode; group?: React.ReactNode; custom?: React.ReactNode; external_user?: React.ReactNode; }',
				description:
					'Custom labels for grouped option types. Overrides default labels when groupByTypeOrder is used.',
			},
			{
				name: 'debounceTime',
				type: 'number',
				description:
					'Time to debounce the suggestions fetching (in milliseconds). Defaults to 150ms.',
			},
			{
				name: 'defaultValue',
				type: 'Value | OptionIdentifier | OptionIdentifier[]',
				description:
					"The pre-selected values for the smart user picker. Supports only Users and Teams default value hydration.\nIf the `DefaultValue` contains only an `id` and `type` (it conforms to an `OptionIdentifier`)\nthen the values will be automatically hydrated.\nIf the value has a `name` then it is considered hydrated and will be ignored.\nUses Confluence and Jira if called from there, else uses Identity or Legion for teams. If a value could not be found, or there was\na network failure during the hydration, the value will be rendered with the label 'Unknown'. Else, if there were any other error\nduring default value hydration, no default values will be rendered, use `onValueError` to handle this.\n`defaultValue` differs from `value` in that it sets the initial value then leaves the component 'uncontrolled'\nwhereas setting the `value` prop delegates responsibility for maintaining the value to the caller\n(i.e. listen to `onChange`)",
			},
			{
				name: 'disableInput',
				type: 'boolean',
				description: 'Whether to disable interaction with the input',
			},
			{
				name: 'displayEmailInByline',
				type: 'boolean',
				description:
					'When enabled, displays email addresses for users in the byline of each option, if available.\nNote - overrideByline will take precedent over displayEmailInByline.\nNote - only certain user types will have their email displayed.',
				defaultValue: 'false',
			},
			{
				name: 'emailLabel',
				type: 'string',
				description: 'Email option label',
			},
			{
				name: 'enableEmailSearch',
				type: 'boolean',
				description: 'When enabled, allows searching by email address.',
				defaultValue: 'false',
			},
			{
				name: 'fetchOptions',
				type: '(query: string) => Promise<OptionData[]>',
				description:
					'Custom fetcher function to load options. When provided, this function will be called\ninstead of the default recommendation API. The function receives the search term\nand should return a Promise that resolves to an array of OptionData.',
			},
			{
				name: 'fieldId',
				type: 'string',
				description:
					'Identifier for informing the server on where the user picker has been mounted.\nUnlike User Picker, the fieldId in Smart User Picker is mandatory.\nThe server uses the fieldId to determine which model to utilize when\ngenerating suggestions.\nAll fieldId\'s will be bucketed into a model that provides generic smart results,\nexcept "assignee", "mentions" which are specifically trained for Jira Assignee and\n@Mentions. For specifically trained models, please contact #help-search-plex.',
				isRequired: true,
			},
			{
				name: 'filterOptions',
				type: '(options: OptionData[], query: string) => OptionData[]',
				description:
					'Function to transform options suggested by the server before showing to the user. Can be used to filter out suggestions.\nThe results of filterOptions are the results displayed in the suggestions UI.',
			},
			{
				name: 'footer',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Footer to be displayed in MenuList',
			},
			{
				name: 'forwardedRef',
				type: '((instance: UserPickerRef) => void) | React.MutableRefObject<UserPickerRef>',
				description: 'Ref to the underlying select',
			},
			{
				name: 'groupByTypeOrder',
				type: 'NonNullable<"user" | "team" | "email" | "group" | "custom" | "external_user">[]',
				description: 'group the options by type',
			},
			{
				name: 'header',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Header to be displayed in MenuList',
			},
			{
				name: 'height',
				type: 'string | number',
				description:
					'Sets the height of the user picker. If not set, the height settings will be based on the "compact" or "normal" appearance.',
			},
			{
				name: 'includeGroups',
				type: 'boolean',
				description:
					'Whether to include groups in the resultset. Only supported for Confluence. @default false',
			},
			{
				name: 'includeNonLicensedUsers',
				type: 'boolean',
				description: 'Whether to include non licensed users in the resultset. @default false',
			},
			{
				name: 'includeTeams',
				type: 'boolean',
				description: 'Whether to include teams in the resultset. @default false',
			},
			{
				name: 'includeTeamsUpdates',
				type: 'boolean',
				description: 'Whether to include teams UI updates in the resultset. @default false',
			},
			{
				name: 'includeUsers',
				type: 'boolean',
				description: 'Whether to include users in the resultset. @default true',
			},
			{
				name: 'inputId',
				type: 'string',
				description: 'Allows clicking on a label with the same id to open user picker.',
			},
			{
				name: 'isClearable',
				type: 'boolean',
				description: 'Display a remove button on the single picker. True by default.',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Disable all interactions with the picker, putting it in a read-only state.',
			},
			{
				name: 'isFooterFocused',
				type: 'boolean',
				description:
					'Checks if the footer is focused or not. This is needed to keep the menu open when the footer is focused',
			},
			{
				name: 'isHeaderFocused',
				type: 'boolean',
				description:
					'Checks if the header is focused or not. This is needed to keep the menu open when the header is focused',
			},
			{
				name: 'isInvalid',
				type: 'boolean',
				description: 'Display the  picker with a style to show the value is invalid',
			},
			{
				name: 'isLoading',
				type: 'boolean',
				description: 'Show the loading indicator.',
			},
			{
				name: 'isMulti',
				type: 'boolean',
				description: 'To enable multi user picker.',
			},
			{
				name: 'isTeamSyncedToGroupDirectoryFilter',
				type: 'boolean',
				description:
					'When true, URS returns only userbase-aligned teams (teams synced to Identity).\nConfluence uses this for teams-as-principals to avoid errors when users select teams\nthat are not yet mirrored to Identity (e.g. old org-scoped teams in NonVortex orgs).',
			},
			{
				name: 'isValidEmail',
				type: '(inputText: string) => EmailValidationResponse',
				description: 'Override default email validation function.',
			},
			{
				name: 'loadOptions',
				type: 'LoadOptions',
				description:
					'Function used to load options asynchronously.\naccepts two optional params:\nsearchText?: optional text to filter results\nsessionId?: user picker session identifier, used to track success metric for users providers',
			},
			{
				name: 'loadOptionsErrorMessage',
				type: '(value: { inputValue: string; }) => React.ReactNode',
				description:
					"Function to generate the error message when there's a failure executing the loadOptions prop.\nIf not provided, will default to a default error message.",
			},
			{
				name: 'loadUserSource',
				type: 'LoadUserSource',
				description:
					'Function used to load user source if they are an external user.\naccepts two params:\naccountId: account ID of the user to lookup sources\nsignal: AbortController signal to abort the request if the tooltip is closed',
			},
			{
				name: 'maxOptions',
				type: 'number',
				description:
					'The maximum number options to be displayed in the dropdown menu during any state of search. The value should be non-negative.',
			},
			{
				name: 'maxPickerHeight',
				type: 'number',
				description:
					'Sets max height of the user picker. If not set, the height will grow based on number of picked users.',
			},
			{
				name: 'menuIsOpen',
				type: 'boolean',
				description: 'Whether the menu is open or not.',
			},
			{
				name: 'menuMinWidth',
				type: 'number',
				description:
					'Sets the minimum width for the menu. If not set, menu will always have the same width of the field.',
			},
			{
				name: 'menuPortalTarget',
				type: 'HTMLElement',
				description: 'Whether the menu should use a portal, and where it should attach.',
			},
			{
				name: 'menuPosition',
				type: '"absolute" | "fixed"',
				description: 'React-select prop for controlling menu position',
			},
			{
				name: 'menuShouldBlockScroll',
				type: 'boolean',
				description: 'Whether to block scrolling actions',
			},
			{
				name: 'minHeight',
				type: 'string | number',
				description:
					'Sets the minimum height of the user picker. If not set, the minimum height will be based on the "height" prop then "compact" or "normal" appearance if height is not set.',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Name to use for input element.',
			},
			{
				name: 'noBorder',
				type: 'boolean',
				description: 'Display the picker with no border.',
			},
			{
				name: 'noOptionsMessage',
				type: 'React.ReactNode | ((value: { inputValue: string; }) => React.ReactNode)',
				description:
					'Message to be shown when the menu is open but no options are provided.\nIf message is null, no message will be displayed.\nIf message is undefined, default message will be displayed.',
			},
			{
				name: 'objectId',
				type: 'string',
				description:
					'An identifier of the closest context object, e.g. issueId, pageId, pullRequestId.\nUsed for analytics. Optional, but please include if available.',
			},
			{
				name: 'onBlur',
				type: '(sessionId?: string) => void',
				description: 'Callback for when the field loses focus.',
			},
			{
				name: 'onChange',
				type: '(value: Value, action: ActionTypes) => void',
				description:
					'Callback for value change events fired whenever a selection is inserted or removed.',
			},
			{
				name: 'onClear',
				type: '(sessionId?: string) => void',
				description: 'Callback for when the value/s in the picker is cleared.',
			},
			{
				name: 'onClose',
				type: '(sessionId?: string) => void',
				description: 'Callback that is triggered when popup picker is closed',
			},
			{
				name: 'onEmpty',
				type: '(query: string) => Promise<OptionData[]>',
				description:
					'Custom handler to give opportunity for caller to return list of options when server returns empty list.\nthis is called if server returns empty list. This will NOT be called if props.filterOptions returns empty list.',
			},
			{
				name: 'onError',
				type: '(error: any, request: RecommendationRequest) => void | Promise<OptionData[]>',
				description:
					'Error handler for when the server fails to suggest users and returns with an error response.\n`error`: the error.\n`RecommendationRequest`: the original recommendationRequest containing the query and other search parameters.\nThis may be used to provide a fail over search direct to the product backend.\nHelper fail over clients exist under /helpers.\nNote that OnError results are filtered.',
			},
			{
				name: 'onFocus',
				type: '(sessionId?: string) => void',
				description: 'Callback for when the field gains focus.',
			},
			{
				name: 'onInputChange',
				type: '(query?: string, sessionId?: string) => void',
				description: 'Callback for search input text change events.',
			},
			{
				name: 'onKeyDown',
				type: '(event: React.KeyboardEvent<Element>) => void',
				description: 'Callback that is trigger on key down in text input',
			},
			{
				name: 'onOpen',
				type: '(sessionId?: string) => void',
				description: 'Callback that is triggered when popup picker is opened',
			},
			{
				name: 'onSelection',
				type: '(value: Value, sessionId?: string, baseUserPicker?: BaseUserPickerWithoutAnalytics) => void',
				description: 'Callback for when a selection is made.',
			},
			{
				name: 'onValueError',
				type: '(error: any, defaultValue: DefaultValue) => void | Promise<OptionData[]>',
				description:
					"Error handler used to provide OptionData[] values when the server fails to hydrate the `defaultValue` prop's values.",
			},
			{
				name: 'open',
				type: 'boolean',
				description:
					'Controls if user picker menu is open or not. If not provided, UserPicker will control menu state internally.',
			},
			{
				name: 'openMenuOnClick',
				type: 'boolean',
				description:
					'Override the internal behaviour of default menu open on focus and applicable for single value select',
			},
			{
				name: 'openMenuOnFocus',
				type: 'boolean',
				description:
					'Whether to open the menu when the input receives focus. Defaults to true for multi-select.',
			},
			{
				name: 'options',
				type: 'OptionData[]',
				description: 'List of users or teams to be used as options by the user picker.',
			},
			{
				name: 'orgId',
				type: 'string',
				description: 'Identifier for the organization in which to search for teams.',
			},
			{
				name: 'overrideByline',
				type: '(option: User | ExternalUser | Team) => string',
				description:
					'Function to generate the byline of each option. The server response is\nprovided as an argument to the function.',
			},
			{
				name: 'placeholder',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Placeholder text to be shown when there is no value in the field.',
			},
			{
				name: 'placeholderAvatar',
				type: '"team" | "person"',
				description: 'Placeholder avatar style - defaults to person',
			},
			{
				name: 'popupSelectProps',
				type: 'PopupSelectProps<OptionData, false, ModifierList>',
				description: 'Props to be passed to the popup select component',
			},
			{
				name: 'prefetch',
				type: 'boolean',
				description:
					'Prefetch the list of suggested assignees before the user picker is focused.\nWARNING: please consider carefully before deciding to prefetch your suggestions\nas this will increase the load on the recommendations services (has caused HOTs).\nPlease give #help-search-plex a ballpark on the expected request volume.',
			},
			{
				name: 'principalId',
				type: 'string',
				description:
					'Id of the user interacting with the component.\nIf principalId is not provided, server will extract principalId from the context header, assuming that the user is logged in\n when making the request. @default “context”',
			},
			{
				name: 'productAttributes',
				type: 'BitbucketAttributes | ConfluenceAttributes | JiraAttributes',
				description:
					'Product-specific Attributes - you should pass in the attribute type that matches your current SupportedProduct.\nCurrently we support additional attributes (BitbucketAttributes) for bitbucket and (ConfluenceAttributes) for Confluence.',
			},
			{
				name: 'productKey',
				type: 'string',
				description:
					'Product identifier. If you are an NPF, please ensure your product has been onboarded with\n Cross-product user-search @see https://developer.atlassian.com/cloud/cross-product-user-search/\nIf you are still waiting for CPUS, you can use the `people` productKey in the interim.',
				isRequired: true,
			},
			{
				name: 'required',
				type: 'boolean',
				description: 'Accessibility: A field to dictate if this is a mandatory field in the form.',
			},
			{
				name: 'restrictTo',
				type: 'RestrictionFilter',
				description:
					'Restricts the recommendations to specific users and/or groups.\nIf provided, only users matching the provided user IDs and/or groups matching the provided group IDs will be included in the results.\n@example { userIds: ["123", "456"], groupIds: ["789"] }',
			},
			{
				name: 'search',
				type: 'string',
				description: 'Input text value.',
			},
			{
				name: 'searchQueryFilter',
				type: 'string',
				description:
					'Filter to be applied to the eventual query to CPUS for user suggestions.\nExample:`account_status:"active" AND (NOT email_domain:"connect.atlassian.com")`\n will remove inactive users from the list of suggestions.',
			},
			{
				name: 'setIsFooterFocused',
				type: '(value: React.SetStateAction<boolean>) => void',
				description:
					'Sets if the footer is focused or not. This is needed to keep the menu open when the footer is focused',
			},
			{
				name: 'setIsHeaderFocused',
				type: '(value: React.SetStateAction<boolean>) => void',
				description:
					'Sets if the header is focused or not. This is needed to keep the menu open when the header is focused',
			},
			{
				name: 'showClearIndicator',
				type: 'boolean',
				description: 'Override default behavior and show the clear indicator.',
			},
			{
				name: 'siteId',
				type: 'string',
				description: "Identifier for the product's tenant, also known as tenantId or cloudId",
				isRequired: true,
			},
			{
				name: 'strategy',
				type: '"absolute" | "fixed"',
				description: 'Positioning strategy for the popper element',
			},
			{
				name: 'styles',
				type: '{ clearIndicator?: (base: any, props: ClearIndicatorProps<OptionType, false, GroupBase<OptionType>>) => any; container?: (base: any, props: ContainerProps<...>) => any; ... 18 more ...; valueContainer?: (base: any, props: ValueContainerProps<...>) => any; }',
				description:
					'You may pass through a `StylesConfig` to be merged with the picker default styles if a custom override is required.\nConsider using noBorder, subtle before customising further.\nSee https://react-select.com/styles',
			},
			{
				name: 'subtle',
				type: 'boolean',
				description: 'Display the picker with a subtle style.',
			},
			{
				name: 'suggestEmailsForDomain',
				type: 'string',
				description:
					'Setting this with allowEmail will cause the picker to constantly show an email option at the bottom for the supplied email domain/an email the user types in',
			},
			{
				name: 'textFieldBackgroundColor',
				type: 'boolean',
				description: 'Sets the background color to be the same color as a textfield (Atlaskit N10)',
			},
			{
				name: 'transformOptions',
				type: '(options: OptionData[], query?: string) => Promise<OptionData[]>',
				description:
					'Optional callback to customize the options shown to the user.\nCalled after options are loaded.',
			},
			{
				name: 'userbaseId',
				type: 'string',
				description:
					'Identifier for the userbase scope.\nCurrently, this is supported for team fetching only.\nWhen provided, team search uses this scope. Otherwise team search falls back to `orgId` and `siteId`.',
			},
			{
				name: 'userResolvers',
				type: '((query: string) => Promise<OptionData[]>)[]',
				description:
					'Optional callback to provide additional user resolvers, such as for fetching and adding users from third party sources',
			},
			{
				name: 'value',
				type: 'OptionData | OptionData[]',
				description:
					'Controls if the user picker has a value or not. If not provided, UserPicker will control the value internally.',
			},
			{
				name: 'verifiedTeams',
				type: 'boolean',
				description:
					'When set to true, only returns verified teams. Only applies when includeTeams is true. @default false',
			},
			{
				name: 'width',
				type: 'string | number',
				description:
					'Width of the user picker field. It can be the amount of pixels as numbers or a string with the percentage.',
			},
		],
	},
	{
		name: 'Status',
		package: '@atlaskit/status',
		description: 'A component for displaying a status label with a background color.',
		status: 'general-availability',
		usageGuidelines: [
			'Use Status to indicate the current state of an item (e.g., "In Progress", "Done").',
			'Supports various colors to convey different meanings.',
		],
		keywords: ['status', 'label', 'badge', 'state', 'lozenge'],
		category: 'data-display',
		examples: [
			'/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { Status, type Color } from \'../src/element\';\nimport { css, jsx } from \'@compiled/react\';\nconst containerStyles = css({\n\twidth: \'140px\',\n});\nconst StatusInParagraph = ({ text, color }: { color: Color; text: string }) => (\n\t<p>\n\t\t<Status text={text} color={color} />\n\t</p>\n);\nexport default (): JSX.Element => (\n\t<div css={containerStyles} id="container">\n\t\t<StatusInParagraph text="Unavailable" color="neutral" />\n\t\t<StatusInParagraph text="New" color="purple" />\n\t\t<StatusInParagraph text="In progress" color="blue" />\n\t\t<StatusInParagraph text="Blocked" color="red" />\n\t\t<StatusInParagraph text="On hold" color="yellow" />\n\t\t<StatusInParagraph text="Done" color="green" />\n\t</div>\n);',
		],
		props: [
			{
				name: 'color',
				type: '"neutral" | "purple" | "blue" | "red" | "yellow" | "green"',
				isRequired: true,
			},
			{
				name: 'isBold',
				type: 'boolean',
			},
			{
				name: 'localId',
				type: 'string',
			},
			{
				name: 'onClick',
				type: '(event: SyntheticEvent<any, Event>) => void',
			},
			{
				name: 'onHover',
				type: '() => void',
			},
			{
				name: 'role',
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
		name: 'StatusPicker',
		package: '@atlaskit/status',
		description: 'A picker component that allows users to select a status from a predefined list.',
		status: 'general-availability',
		usageGuidelines: [
			'Use StatusPicker to allow users to change the status of an item.',
			'Provides a list of available statuses with their associated colors.',
		],
		keywords: ['status', 'picker', 'select', 'state', 'choice'],
		category: 'interaction',
		examples: [
			"import { IntlProvider } from 'react-intl';\nimport ManagedStatusPicker from '../example-helpers/ManagedStatusPicker';\nexport const NeutralStatus = (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<ManagedStatusPicker initialSelectedColor={'neutral'} initialText={'In progress'} />\n\t</IntlProvider>\n);\nexport const PurpleStatus = (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<ManagedStatusPicker initialSelectedColor={'purple'} initialText={'In progress'} />\n\t</IntlProvider>\n);\nexport const BlueStatus = (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<ManagedStatusPicker initialSelectedColor={'blue'} initialText={'In progress'} />\n\t</IntlProvider>\n);\nexport const RedStatus = (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<ManagedStatusPicker initialSelectedColor={'red'} initialText={'In progress'} />\n\t</IntlProvider>\n);\nexport const YellowStatus = (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<ManagedStatusPicker initialSelectedColor={'yellow'} initialText={'In progress'} />\n\t</IntlProvider>\n);\nexport const GreenStatus = (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<ManagedStatusPicker initialSelectedColor={'green'} initialText={'In progress'} />\n\t</IntlProvider>\n);\nexport default (): React.JSX.Element => (\n\t<IntlProvider locale=\"en\">\n\t\t<ManagedStatusPicker initialSelectedColor={'green'} initialText={'In progress'} />\n\t</IntlProvider>\n);",
		],
		props: [
			{
				name: 'autoFocus',
				type: 'boolean',
			},
			{
				name: 'forwardedRef',
				type: '((instance: any) => void) | RefObject<any>',
			},
			{
				name: 'onColorClick',
				type: '(value: Color) => void',
				isRequired: true,
			},
			{
				name: 'onColorHover',
				type: '(value: Color) => void',
			},
			{
				name: 'onEnter',
				type: '() => void',
				isRequired: true,
			},
			{
				name: 'onTextChanged',
				type: '(value: string) => void',
				isRequired: true,
			},
			{
				name: 'selectedColor',
				type: '"neutral" | "purple" | "blue" | "red" | "yellow" | "green"',
				isRequired: true,
			},
			{
				name: 'text',
				type: 'string',
				isRequired: true,
			},
		],
	},
	{
		name: 'DecisionItem',
		package: '@atlaskit/task-decision',
		description: 'A component for displaying a single decision item with an icon and content.',
		status: 'general-availability',
		usageGuidelines: [
			'Use DecisionItem to represent a decision made during a meeting or discussion.',
			'Includes a distinctive icon to differentiate it from tasks.',
		],
		keywords: ['decision', 'outcome', 'icon', 'meeting-notes'],
		category: 'data-display',
		examples: [
			"import type { DocNode } from '@atlaskit/adf-schema';\nimport { ReactRenderer as Renderer } from '@atlaskit/renderer';\nimport { document } from '@atlaskit/util-data-test/task-decision-story-data';\nimport { DecisionItem } from '../src';\nimport { dumpRef } from '../example-helpers/story-utils';\nexport default (): React.JSX.Element => (\n\t<div>\n\t\t<h3>Simple DecisionItem</h3>\n\t\t<DecisionItem contentRef={dumpRef}>\n\t\t\tHello <b>world</b>.\n\t\t</DecisionItem>\n\t\t<h3>Long DecisionItem</h3>\n\t\t<DecisionItem contentRef={dumpRef}>\n\t\t\tLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut\n\t\t\tlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n\t\t\tlaboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n\t\t\tvoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat\n\t\t\tnon proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\t\t</DecisionItem>\n\t\t<h3>Simple DecisionItem with renderer</h3>\n\t\t<DecisionItem contentRef={dumpRef}>\n\t\t\t<Renderer document={document as DocNode} />\n\t\t</DecisionItem>\n\t\t<h3>Simple DecisionItem with placeholder</h3>\n\t\t<DecisionItem contentRef={dumpRef} showPlaceholder={true} placeholder=\"Placeholder text\" />\n\t</div>\n);",
		],
		props: [
			{
				name: 'appearance',
				type: 'string',
			},
			{
				name: 'children',
				type: 'any',
			},
			{
				name: 'contentRef',
				type: 'ContentRef',
			},
			{
				name: 'dataAttributes',
				type: '{ [key: string]: string | number; }',
			},
			{
				name: 'placeholder',
				type: 'string',
			},
			{
				name: 'showPlaceholder',
				type: 'boolean',
			},
		],
	},
	{
		name: 'TaskItem',
		package: '@atlaskit/task-decision',
		description: 'A component for displaying a single task item with a checkbox and content.',
		status: 'general-availability',
		usageGuidelines: [
			'Use TaskItem to represent an individual action item.',
			'Supports marking tasks as complete or incomplete.',
		],
		keywords: ['task', 'action-item', 'checkbox', 'todo'],
		category: 'data-display',
		examples: [
			"import type { DocNode } from '@atlaskit/adf-schema';\nimport { ReactRenderer as Renderer } from '@atlaskit/renderer';\nimport { document } from '@atlaskit/util-data-test/task-decision-story-data';\nimport { TaskItem } from '../src';\nimport { dumpRef, action } from '../example-helpers/story-utils';\nexport default (): React.JSX.Element => (\n\t<div>\n\t\t<h3>Simple TaskItem</h3>\n\t\t<TaskItem taskId=\"task-1\" contentRef={dumpRef} onChange={action('onChange')}>\n\t\t\tHello <b>world</b>.\n\t\t</TaskItem>\n\t\t<h3>Long TaskItem</h3>\n\t\t<TaskItem taskId=\"task-1\" contentRef={dumpRef}>\n\t\t\tLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut\n\t\t\tlabore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco\n\t\t\tlaboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in\n\t\t\tvoluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat\n\t\t\tnon proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n\t\t</TaskItem>\n\t\t<h3>Simple Completed TaskItem </h3>\n\t\t<TaskItem taskId=\"task-2\" isDone={true} contentRef={dumpRef} onChange={action('onChange')}>\n\t\t\t<Renderer document={document as DocNode} />\n\t\t</TaskItem>\n\t\t<h3>Simple TaskItem with renderer</h3>\n\t\t<TaskItem taskId=\"task-3\" contentRef={dumpRef} onChange={action('onChange')}>\n\t\t\t<Renderer document={document as DocNode} />\n\t\t</TaskItem>\n\t\t<h3>Simple TaskItem with placeholder</h3>\n\t\t<TaskItem\n\t\t\ttaskId=\"task-1\"\n\t\t\tcontentRef={dumpRef}\n\t\t\tonChange={action('onChange')}\n\t\t\tshowPlaceholder={true}\n\t\t\tplaceholder=\"Placeholder text\"\n\t\t/>\n\t</div>\n);",
		],
		props: [
			{
				name: 'appearance',
				type: 'string',
			},
			{
				name: 'children',
				type: 'any',
			},
			{
				name: 'contentRef',
				type: 'ContentRef',
			},
			{
				name: 'dataAttributes',
				type: '{ [key: string]: string | number; }',
			},
			{
				name: 'disabled',
				type: 'boolean',
			},
			{
				name: 'inputRef',
				type: '((instance: HTMLInputElement) => void) | RefObject<HTMLInputElement>',
			},
			{
				name: 'isDone',
				type: 'boolean',
			},
			{
				name: 'isFocused',
				type: 'boolean',
			},
			{
				name: 'isRenderer',
				type: 'boolean',
			},
			{
				name: 'onChange',
				type: '(taskId: string, isChecked: boolean) => void',
			},
			{
				name: 'onClick',
				type: '() => void',
			},
			{
				name: 'placeholder',
				type: 'string',
			},
			{
				name: 'showPlaceholder',
				type: 'boolean',
			},
			{
				name: 'taskId',
				type: 'string',
				isRequired: true,
			},
		],
	},
	{
		name: 'TeamsAvatar',
		package: '@atlaskit/teams-avatar',
		description: 'A visual representation of a team, typically used in profile views or lists.',
		status: 'general-availability',
		usageGuidelines: [
			'Use TeamsAvatar to identify a team visually.',
			'Supports different sizes and shapes (square by default for teams).',
			'Can display an image or fallback to a team icon.',
		],
		keywords: ['avatar', 'team', 'profile', 'identity', 'visual'],
		category: 'media',
		examples: [
			"import { selectField } from '@atlassian/teams-app-internal-playground/fields';\nimport {\n\tPlayground,\n\ttype PlaygroundConfig,\n} from '@atlassian/teams-app-internal-playground/playground';\nimport TeamAvatar from '../src/ui/teams-avatar';\nconst IMAGE_SOURCES = {\n\tfallback: '-',\n\tcustom:\n\t\t'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABACAMAAACqVYydAAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAGBQTFRF/zX7+DP73i77uyb8kR78ZhX9PQz+GwX+/jT78jL71Sz7ryT8hRv8WhL9Mwr+EwT+/TT76jD7yyr7pCL8eRn9ThD9KQj+DAL/+jT74i/7wCj8lx/8bBb9Qw3+IAb+BgH/HFKiKQAAAIBJREFUeJztzjkOggAAAEEEORTkFOQS/v9L+u1INDQ7L5ggOOkGIURwhxgSSOHsz6BBgwYNGjRo0OBvgxk84Ak5FPCCEiowaNCgQYMGDRo0eG2whgZa6OANPQzwAYMGDRo0aNCgQYPXBkeYYIYFVvjCBjsYNGjQoEGDBg0a/GvwADIe8BAKQVCtAAAAAElFTkSuQmCC',\n\tnextAvatar:\n\t\t'https://teams-directory-frontend.stg-east.frontend.public.atl-paas.net/assets/teams/avatars/v4/blue_4.svg',\n} as const;\nconst config = {\n\tfields: [\n\t\tselectField({\n\t\t\tid: 'size',\n\t\t\tlabel: 'Size',\n\t\t\ttype: 'select',\n\t\t\tdefaultValue: 'medium',\n\t\t\toptions: [\n\t\t\t\t{ label: 'xsmall', value: 'xsmall' },\n\t\t\t\t{ label: 'small', value: 'small' },\n\t\t\t\t{ label: 'medium', value: 'medium' },\n\t\t\t\t{ label: 'large', value: 'large' },\n\t\t\t\t{ label: 'xlarge', value: 'xlarge' },\n\t\t\t\t{ label: 'xxlarge', value: 'xxlarge' },\n\t\t\t],\n\t\t}),\n\t\tselectField({\n\t\t\tid: 'image-source',\n\t\t\tlabel: 'Image source',\n\t\t\ttype: 'select',\n\t\t\tdefaultValue: '-',\n\t\t\toptions: [\n\t\t\t\t{ label: 'Fallback', value: '-' },\n\t\t\t\t{ label: 'Custom avatar', value: IMAGE_SOURCES.custom },\n\t\t\t\t{ label: 'Next avatar', value: IMAGE_SOURCES.nextAvatar },\n\t\t\t],\n\t\t}),\n\t],\n} satisfies PlaygroundConfig;\nexport default function TeamAvatarExample(): React.JSX.Element {\n\treturn (\n\t\t<Playground config={config}>\n\t\t\t{({ size, imageSource }) => (\n\t\t\t\t<TeamAvatar size={size} src={imageSource === '-' ? undefined : imageSource} />\n\t\t\t)}\n\t\t</Playground>\n\t);\n}",
		],
		props: [
			{
				name: 'aria-controls',
				type: 'string',
				description:
					'Identifies the popup element that the avatar controls.\nUsed when Avatar is a trigger for a popup.',
			},
			{
				name: 'aria-expanded',
				type: 'boolean',
				description:
					'Announces to assistive technology whether the controlled popup is currently open or closed.',
			},
			{
				name: 'aria-haspopup',
				type: 'boolean | "dialog"',
				description:
					'Informs assistive technology that this element triggers a popup.\nWhen set, Avatar will render as a `<button>` element even without `onClick`.',
			},
			{
				name: 'as',
				type: 'keyof JSX.IntrinsicElements | React.ComponentType<React.AllHTMLAttributes<HTMLElement>>',
				description:
					'Replace the wrapping element. This accepts the name of a html tag which will\nbe used to wrap the element.',
			},
			{
				name: 'borderColor',
				type: 'string',
				description:
					'Used to override the default border color around the avatar body.\nAccepts any color argument that the border-color CSS property accepts.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Supply a custom avatar component instead of the default.',
			},
			{
				name: 'compact',
				type: 'boolean',
				defaultValue: 'false',
			},
			{
				name: 'href',
				type: 'string',
				description: 'Provides a url for avatars being used as a link.',
			},
			{
				name: 'imgLoading',
				type: '"lazy" | "eager"',
				description: 'Defines the loading behaviour of the avatar image. Default value is eager.',
			},
			{
				name: 'isDecorative',
				type: 'boolean',
				description: 'whether disable aria-labelledby for avatar img',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Change the style to indicate the avatar is disabled.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Used to provide custom content to screen readers.\nStatus or presence is not added to the label by default if it passed as nodes.\nIf status or presence is passed as a string, the default content format is "John Smith (online)".',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Provides alt text for the avatar image.',
			},
			{
				name: 'onClick',
				type: '(event: React.MouseEvent<Element, MouseEvent>, analyticsEvent?: UIAnalyticsEvent) => void',
				description: 'Handler to be called on click.',
			},
			{
				name: 'presence',
				type: 'Presence | Omit<React.ReactNode, string> | (string & {})',
				description:
					"Indicates a user's online status by showing a small icon on the avatar.\nRefer to presence values on the presence component.\nAlternatively accepts any React element. For best results, it is recommended to\nuse square content with height and width of 100%.",
			},
			{
				name: 'size',
				type: '"medium" | "small" | "xsmall" | "large" | "xlarge" | "xxlarge"',
				defaultValue: '"medium"',
			},
			{
				name: 'src',
				type: 'string',
				description: 'A url to load an image from (this can also be a base64 encoded image).',
			},
			{
				name: 'stackIndex',
				type: 'number',
				description: 'The index of where this avatar is in the group `stack`.',
			},
			{
				name: 'status',
				type: 'Omit<React.ReactNode, string> | (string & {}) | Status',
				description:
					'Indicates contextual information by showing a small icon on the avatar.\nRefer to status values on the Status component.',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description: 'Assign specific tabIndex order to the underlying node.',
			},
			{
				name: 'target',
				type: '"_blank" | "_self" | "_top" | "_parent"',
				description: 'Pass target down to the anchor, if href is provided.',
			},
			{
				name: 'teamId',
				type: 'string',
				defaultValue: '""',
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
	{
		name: 'Accordion',
		package: '@atlassian/accordion',
		description:
			'An accordion is a vertically stacked set of headings that each open or close a section of content. Use it to group related sections on one page and let people open only the ones they want, which saves vertical space. This is an internal Platform Labs component that follows the W3C ARIA accordion pattern. It has four parts that you compose together: Accordion, AccordionItem, AccordionTrigger, and AccordionPanel.',
		status: 'early-access',
		usageGuidelines: [
			'Use when a page has two or more related sections and people only need some of them at a time. Opening sections on demand keeps content compact and saves vertical space.',
			'Do not use it for critical content that should always be visible.',
			'Do not use it for primary navigation (use a menu), or step-by-step flows.',
			'Do not use it for options of equal weight that people compare side by side.',
			'Keep the trigger row free of interactive elements. The whole row is the toggle, so a nested button or link adds an extra click target and an extra tab stop. If an action is unavoidable, put it in the trailing slot, which is the one place that supports it.',
		],
		contentGuidelines: [
			'Write each trigger label as a short noun phrase that says what is in the panel.',
			'Make each label different from the others so people can tell them apart.',
			'Avoid vague labels like "More" or "Details" unless you add context.',
			'Use the trigger `description` for a short note that supports the label, not for the main content.',
			'Write labels that read clearly on their own, without relying on the icons next to them.',
		],
		accessibilityGuidelines: [
			'Set `headingLevel` to match its position on the page so people using a screen reader can navigate by heading.',
			'Avoid using `isDisabled`.',
			'Give each `AccordionItem` a `value` that stays the same across renders.',
			'Only wrap the accordion in a landmark when the whole area is a distinct page region.',
		],
		keywords: ['accordion', 'disclosure', 'expander', 'platform-labs', 'internal'],
		category: 'navigation',
		examples: [
			'import { IconButton } from \'@atlaskit/button/new\';\nimport CheckCircleIcon from \'@atlaskit/icon/core/check-circle\';\nimport EditIcon from \'@atlaskit/icon/core/edit\';\nimport ShareIcon from \'@atlaskit/icon/core/share\';\nimport MoreIcon from \'@atlaskit/icon/core/show-more-horizontal\';\nimport StarIcon from \'@atlaskit/icon/core/star-starred\';\nimport StatusInformationIcon from \'@atlaskit/icon/core/status-information\';\nimport Lozenge from \'@atlaskit/lozenge/lozenge\';\nimport { Accordion } from \'@atlassian/accordion/accordion\';\nimport { AccordionItem } from \'@atlassian/accordion/accordion-item\';\nimport { AccordionPanel } from \'@atlassian/accordion/accordion-panel\';\nimport { AccordionTrigger } from \'@atlassian/accordion/accordion-trigger\';\nimport ExampleContainer from \'../example-utils/container\';\nfunction BasicExample(): React.JSX.Element {\n\treturn (\n\t\t<ExampleContainer>\n\t\t\t<Accordion headingLevel={3}>\n\t\t\t\t<AccordionItem value="plain">\n\t\t\t\t\t<AccordionTrigger>Introduction</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>A plain accordion item with no adornments.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value="overview">\n\t\t\t\t\t<AccordionTrigger elemBefore={<StatusInformationIcon label="" />}>\n\t\t\t\t\t\tOverview\n\t\t\t\t\t</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>A short overview of the page.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value="details">\n\t\t\t\t\t<AccordionTrigger elemAfter={<Lozenge appearance="inprogress">In progress</Lozenge>}>\n\t\t\t\t\t\tDetails\n\t\t\t\t\t</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>Additional detail content visible when expanded.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value="resources">\n\t\t\t\t\t<AccordionTrigger\n\t\t\t\t\t\telemBefore={<StarIcon label="" />}\n\t\t\t\t\t\telemAfter={<Lozenge appearance="new">New</Lozenge>}\n\t\t\t\t\t>\n\t\t\t\t\t\tResources\n\t\t\t\t\t</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>Links and related resources for the user.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value="status">\n\t\t\t\t\t<AccordionTrigger elemBefore={<CheckCircleIcon label="" />}>Status</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>Status detail.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t{/* Interactive elemAfter: IconButton click fires its own handler, doesn\'t toggle. */}\n\t\t\t\t<AccordionItem value="single-action">\n\t\t\t\t\t<AccordionTrigger\n\t\t\t\t\t\telemBefore={<StarIcon label="" />}\n\t\t\t\t\t\telemAfter={\n\t\t\t\t\t\t\t<IconButton\n\t\t\t\t\t\t\t\tappearance="subtle"\n\t\t\t\t\t\t\t\ticon={EditIcon}\n\t\t\t\t\t\t\t\tlabel="Edit single action item"\n\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\tconsole.log(\'Edit clicked\');\n\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t}\n\t\t\t\t\t>\n\t\t\t\t\t\tSingle action\n\t\t\t\t\t</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>\n\t\t\t\t\t\tThe Edit button on the right is interactive — clicking it triggers its own action\n\t\t\t\t\t\twithout toggling the accordion. Clicking anywhere else on the row still toggles the\n\t\t\t\t\t\tpanel as usual.\n\t\t\t\t\t</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t{/* Interactive elemAfter with two IconButtons side-by-side. */}\n\t\t\t\t<AccordionItem value="multiple-actions">\n\t\t\t\t\t<AccordionTrigger\n\t\t\t\t\t\telemBefore={<StatusInformationIcon label="" />}\n\t\t\t\t\t\telemAfter={\n\t\t\t\t\t\t\t<>\n\t\t\t\t\t\t\t\t<IconButton\n\t\t\t\t\t\t\t\t\tappearance="subtle"\n\t\t\t\t\t\t\t\t\ticon={ShareIcon}\n\t\t\t\t\t\t\t\t\tlabel="Share multiple actions item"\n\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\tconsole.log(\'Share clicked\');\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t<IconButton\n\t\t\t\t\t\t\t\t\tappearance="subtle"\n\t\t\t\t\t\t\t\t\ticon={MoreIcon}\n\t\t\t\t\t\t\t\t\tlabel="More actions for multiple actions item"\n\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\tconsole.log(\'More clicked\');\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t</>\n\t\t\t\t\t\t}\n\t\t\t\t\t>\n\t\t\t\t\t\tMultiple actions\n\t\t\t\t\t</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>\n\t\t\t\t\t\tTwo IconButtons in the trailing slot. Each handles its own click; toggling the accordion\n\t\t\t\t\t\tstill works by clicking anywhere else on the row.\n\t\t\t\t\t</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t{/* Long label + body to exercise wrapping. */}\n\t\t\t\t<AccordionItem value="release-notes">\n\t\t\t\t\t<AccordionTrigger elemAfter={<Lozenge appearance="new">Updated</Lozenge>}>\n\t\t\t\t\t\tRelease notes for the most recent build, including a summary of all the new features,\n\t\t\t\t\t\tbug fixes, accessibility improvements, and known issues that consumers should be aware\n\t\t\t\t\t\tof before upgrading to this version of the component\n\t\t\t\t\t</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>\n\t\t\t\t\t\tThis panel contains an intentionally long paragraph of content so that we can verify how\n\t\t\t\t\t\tthe accordion handles wrapping text, vertical rhythm with surrounding items, and the way\n\t\t\t\t\t\tthe chevron indicator stays aligned to the first line of the label. Consumers should\n\t\t\t\t\t\tensure their own copy uses concise labels in production, but the primitive must still\n\t\t\t\t\t\tdegrade gracefully when text overflows. The panel body is also free to contain rich\n\t\t\t\t\t\tcontent such as multiple paragraphs, lists, or inline elements without breaking the\n\t\t\t\t\t\tlayout of the surrounding accordion items.\n\t\t\t\t\t</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t</Accordion>\n\t\t</ExampleContainer>\n\t);\n}\nexport default BasicExample;',
			"import { Accordion } from '@atlassian/accordion/accordion';\nimport { AccordionItem } from '@atlassian/accordion/accordion-item';\nimport { AccordionPanel } from '@atlassian/accordion/accordion-panel';\nimport { AccordionTrigger } from '@atlassian/accordion/accordion-trigger';\nimport ExampleContainer from '../example-utils/container';\nfunction MultipleExample(): React.JSX.Element {\n\treturn (\n\t\t<ExampleContainer>\n\t\t\t<Accordion headingLevel={3} mode=\"multiple\" defaultValue={['overview', 'details']}>\n\t\t\t\t<AccordionItem value=\"overview\">\n\t\t\t\t\t<AccordionTrigger>Overview</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>This panel starts open via defaultValue.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value=\"details\">\n\t\t\t\t\t<AccordionTrigger>Details</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>\n\t\t\t\t\t\tThis panel also starts open — multiple-mode allows any number of panels to be expanded\n\t\t\t\t\t\tat the same time.\n\t\t\t\t\t</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value=\"resources\">\n\t\t\t\t\t<AccordionTrigger>Resources</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>\n\t\t\t\t\t\tThis panel starts collapsed. You can open it without closing the two above.\n\t\t\t\t\t</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t</Accordion>\n\t\t</ExampleContainer>\n\t);\n}\nexport default MultipleExample;",
			"import React, { useCallback, useState } from 'react';\nimport { Accordion } from '@atlassian/accordion/accordion';\nimport { AccordionItem } from '@atlassian/accordion/accordion-item';\nimport { AccordionPanel } from '@atlassian/accordion/accordion-panel';\nimport { AccordionTrigger } from '@atlassian/accordion/accordion-trigger';\nimport ExampleContainer from '../example-utils/container';\nfunction ControlledSingleExample(): React.JSX.Element {\n\tconst [openValues, setOpenValues] = useState<string[]>(['details']);\n\tconst handleValueChange = useCallback((nextValue: string[]) => {\n\t\tsetOpenValues(nextValue);\n\t}, []);\n\treturn (\n\t\t<ExampleContainer>\n\t\t\t<Accordion\n\t\t\t\theadingLevel={3}\n\t\t\t\tmode=\"single\"\n\t\t\t\tvalue={openValues}\n\t\t\t\tonValueChange={handleValueChange}\n\t\t\t>\n\t\t\t\t<AccordionItem value=\"overview\">\n\t\t\t\t\t<AccordionTrigger>Overview</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>Overview content.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value=\"details\">\n\t\t\t\t\t<AccordionTrigger>Details</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>Details content (initially open).</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t\t<AccordionItem value=\"resources\">\n\t\t\t\t\t<AccordionTrigger>Resources</AccordionTrigger>\n\t\t\t\t\t<AccordionPanel>Resources content.</AccordionPanel>\n\t\t\t\t</AccordionItem>\n\t\t\t</Accordion>\n\t\t</ExampleContainer>\n\t);\n}\nexport default ControlledSingleExample;",
		],
		props: [
			{
				name: 'appearance',
				type: '"default" | "subtle"',
				description:
					'Visual chrome.\n - `default` → wrapper border + dividers between items.\n - `subtle`  → no borders.\n\nDefaults to `default`.',
				defaultValue: '"default"',
			},
			{
				name: 'children',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'The children of `Accordion`. Should be one or more `AccordionItem` elements.',
				isRequired: true,
			},
			{
				name: 'defaultValue',
				type: 'readonly string[]',
				description:
					'The list of open item values when the component mounts. Ignored when `value` is\nprovided.',
			},
			{
				name: 'descriptionPlacement',
				type: '"inline" | "stacked"',
				description:
					'Placement of the trigger `description` relative to the trigger title.\n - `inline`  → description sits inline beside the title (the default).\n - `stacked` → description stacks on its own line below the title.\n\nOnly has a visible effect when an `AccordionTrigger` is given a `description`.\nDefaults to `inline`.',
				defaultValue: '"inline"',
			},
			{
				name: 'headingLevel',
				type: '2 | 3 | 4 | 5 | 6',
				description:
					'The heading level (`h2`..`h6`) used for every trigger inside this accordion.\nPick the level that fits the surrounding document outline.',
				isRequired: true,
			},
			{
				name: 'indicatorPosition',
				type: '"start" | "end"',
				description:
					'Position of the disclosure chevron relative to the trigger label.\nDefaults to `start` (leading).',
				defaultValue: '"start"',
			},
			{
				name: 'mode',
				type: '"single" | "multiple"',
				description:
					'Controls how many panels can be open at once.\n\n- `single` — at most one panel open at a time; clicking the open trigger closes it.\n- `multiple` — any number of panels (including zero) may be open simultaneously.\n\nDefaults to `single`.',
				defaultValue: '"single"',
			},
			{
				name: 'onValueChange',
				type: '(nextValue: string[]) => void',
				description:
					'Fired when the set of open values changes. Receives the next array of open values.',
			},
			{
				name: 'value',
				type: 'readonly string[]',
				description:
					'The list of open item values. When provided, `Accordion` behaves as a controlled\ncomponent and you should listen to `onValueChange`. In `single` mode this must\ncontain at most one entry; extras are truncated to the first entry (with a\n`console.error` in development).',
			},
		],
	},
	{
		name: 'AiGenerativeTextIcon',
		package: '@atlassian/animated-icon',
		description:
			'Animated icon for generating text with Atlassian Intelligence. Animated counterpart of the static AiGenerativeText icon.',
		status: 'early-access',
		usageGuidelines: [
			'Use these icons for internal Platform Labs experiments while the motion model and package shape are being validated.',
			'These icons are intentionally medium-only (`16x16`) and do not expose a size prop.',
			'Replay animations by toggling the `animation` prop from `none` to `default` after mount.',
			'Do not treat this package as part of the public Atlassian Design System surface.',
		],
		contentGuidelines: [
			'Provide a contextual `label` when the icon is meaningful on its own.',
			'Use `label=""` when the icon is decorative and nearby text already communicates the intent.',
		],
		accessibilityGuidelines: [
			'These icons respect reduced-motion preferences and stay static when reduced motion is enabled.',
			'Do not rely on animation alone to convey state changes or critical feedback.',
		],
		keywords: [
			'ai-generative-text',
			'aigenerativetext',
			'icon',
			'generate',
			'text',
			'automation',
			'AI',
			'animated',
			'platform-labs',
		],
		category: 'icons',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { AiGenerativeTextIcon } from '../src/icons/ai-generative-text-icon';\nimport { AiGenerativeTextSummaryIcon } from '../src/icons/ai-generative-text-summary-icon';\nimport { AiSearchIcon } from '../src/icons/ai-search-icon';\nimport { AngleBracketsIcon } from '../src/icons/angle-brackets-icon';\nimport { MagicWandIcon } from '../src/icons/magic-wand-icon';\nimport { RovoChatIcon } from '../src/icons/rovo-chat-icon';\nimport type { AnimatedIconAnimation, AnimatedIconProps } from '../src/types';\ntype IconExample = {\n\tlabel: string;\n\tComponent: (props: AnimatedIconProps) => JSX.Element;\n};\nconst ICONS: IconExample[] = [\n\t{ label: 'Generate text', Component: AiGenerativeTextIcon },\n\t{ label: 'Summarize text', Component: AiGenerativeTextSummaryIcon },\n\t{ label: 'Search', Component: AiSearchIcon },\n\t{ label: 'Code', Component: AngleBracketsIcon },\n\t{ label: 'Suggest', Component: MagicWandIcon },\n\t{ label: 'Rovo chat', Component: RovoChatIcon },\n];\nexport default function BasicExample(): JSX.Element {\n\tconst [animationByLabel, setAnimationByLabel] = useState<Record<string, AnimatedIconAnimation>>(\n\t\t{},\n\t);\n\tconst replayAllAnimations = () => {\n\t\t// Reset every icon to `none` first, then flip them all back to `default`\n\t\t// on the next frame so the animation re-triggers even if it was already\n\t\t// playing.\n\t\tconst setAll = (animation: AnimatedIconAnimation) => {\n\t\t\tsetAnimationByLabel(Object.fromEntries(ICONS.map(({ label }) => [label, animation])));\n\t\t};\n\t\tsetAll('none');\n\t\tif (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {\n\t\t\tsetAll('default');\n\t\t\treturn;\n\t\t}\n\t\twindow.requestAnimationFrame(() => setAll('default'));\n\t};\n\tconst setHoverAnimation = (label: string, animation: AnimatedIconAnimation) => {\n\t\tsetAnimationByLabel((previous) => ({\n\t\t\t...previous,\n\t\t\t[label]: animation,\n\t\t}));\n\t};\n\treturn (\n\t\t<Stack space=\"space.300\" testId=\"animated-icon-basic-example\">\n\t\t\t<Text as=\"p\">\n\t\t\t\tAnimated icons stay static on initial mount. Hover an icon to replay its motion, or use the\n\t\t\t\tbutton to replay all icons.\n\t\t\t</Text>\n\t\t\t<Box>\n\t\t\t\t<Button onClick={replayAllAnimations}>Replay animations</Button>\n\t\t\t</Box>\n\t\t\t<Inline space=\"space.300\" shouldWrap>\n\t\t\t\t{ICONS.map(({ label, Component }) => (\n\t\t\t\t\t<Stack\n\t\t\t\t\t\tkey={label}\n\t\t\t\t\t\tspace=\"space.100\"\n\t\t\t\t\t\talignInline=\"center\"\n\t\t\t\t\t\ttestId={`animated-icon-card-${label.toLowerCase().replace(/\\s+/g, '-')}`}\n\t\t\t\t\t>\n\t\t\t\t\t\t<Box\n\t\t\t\t\t\t\tpadding=\"space.150\"\n\t\t\t\t\t\t\tbackgroundColor=\"color.background.neutral.subtle\"\n\t\t\t\t\t\t\tonMouseEnter={() => setHoverAnimation(label, 'default')}\n\t\t\t\t\t\t\tonMouseLeave={() => setHoverAnimation(label, 'none')}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<Component label={label} animation={animationByLabel[label] ?? 'none'} />\n\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t<Text size=\"small\">{label}</Text>\n\t\t\t\t\t</Stack>\n\t\t\t\t))}\n\t\t\t</Inline>\n\t\t</Stack>\n\t);\n}",
		],
		props: [
			{
				name: 'animation',
				type: '"none" | "default"',
				description:
					'Controls whether the icon should play its primary animation.\n`default` does not autoplay on initial mount; consumers must retrigger it.',
				defaultValue: '"none"',
			},
			{
				name: 'color',
				type: 'string',
				description:
					"Optional color override for the icon.\nDefaults to the standard design token backed icon color.\n\nPass a token-resolved value (e.g. `token('color.icon.subtle')`) rather than\na raw hex string so the icon stays consistent across themes.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text that describes the icon in context.\nUse an empty string when the icon is decorative.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'Optional name for analytics/debugging parity with icon APIs.',
			},
		],
	},
	{
		name: 'AiGenerativeTextSummaryIcon',
		package: '@atlassian/animated-icon',
		description:
			'Animated icon reserved for summarizing content with Atlassian Intelligence & Loom. Animated counterpart of the static AiGenerativeTextSummary icon.',
		status: 'early-access',
		usageGuidelines: [
			'Use these icons for internal Platform Labs experiments while the motion model and package shape are being validated.',
			'These icons are intentionally medium-only (`16x16`) and do not expose a size prop.',
			'Replay animations by toggling the `animation` prop from `none` to `default` after mount.',
			'Do not treat this package as part of the public Atlassian Design System surface.',
		],
		contentGuidelines: [
			'Provide a contextual `label` when the icon is meaningful on its own.',
			'Use `label=""` when the icon is decorative and nearby text already communicates the intent.',
		],
		accessibilityGuidelines: [
			'These icons respect reduced-motion preferences and stay static when reduced motion is enabled.',
			'Do not rely on animation alone to convey state changes or critical feedback.',
		],
		keywords: [
			'ai-generative-text-summary',
			'aigenerativetextsummary',
			'icon',
			'summarize',
			'summarise',
			'summary',
			'automation',
			'AI',
			'animated',
			'platform-labs',
		],
		category: 'icons',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { AiGenerativeTextIcon } from '../src/icons/ai-generative-text-icon';\nimport { AiGenerativeTextSummaryIcon } from '../src/icons/ai-generative-text-summary-icon';\nimport { AiSearchIcon } from '../src/icons/ai-search-icon';\nimport { AngleBracketsIcon } from '../src/icons/angle-brackets-icon';\nimport { MagicWandIcon } from '../src/icons/magic-wand-icon';\nimport { RovoChatIcon } from '../src/icons/rovo-chat-icon';\nimport type { AnimatedIconAnimation, AnimatedIconProps } from '../src/types';\ntype IconExample = {\n\tlabel: string;\n\tComponent: (props: AnimatedIconProps) => JSX.Element;\n};\nconst ICONS: IconExample[] = [\n\t{ label: 'Generate text', Component: AiGenerativeTextIcon },\n\t{ label: 'Summarize text', Component: AiGenerativeTextSummaryIcon },\n\t{ label: 'Search', Component: AiSearchIcon },\n\t{ label: 'Code', Component: AngleBracketsIcon },\n\t{ label: 'Suggest', Component: MagicWandIcon },\n\t{ label: 'Rovo chat', Component: RovoChatIcon },\n];\nexport default function BasicExample(): JSX.Element {\n\tconst [animationByLabel, setAnimationByLabel] = useState<Record<string, AnimatedIconAnimation>>(\n\t\t{},\n\t);\n\tconst replayAllAnimations = () => {\n\t\t// Reset every icon to `none` first, then flip them all back to `default`\n\t\t// on the next frame so the animation re-triggers even if it was already\n\t\t// playing.\n\t\tconst setAll = (animation: AnimatedIconAnimation) => {\n\t\t\tsetAnimationByLabel(Object.fromEntries(ICONS.map(({ label }) => [label, animation])));\n\t\t};\n\t\tsetAll('none');\n\t\tif (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {\n\t\t\tsetAll('default');\n\t\t\treturn;\n\t\t}\n\t\twindow.requestAnimationFrame(() => setAll('default'));\n\t};\n\tconst setHoverAnimation = (label: string, animation: AnimatedIconAnimation) => {\n\t\tsetAnimationByLabel((previous) => ({\n\t\t\t...previous,\n\t\t\t[label]: animation,\n\t\t}));\n\t};\n\treturn (\n\t\t<Stack space=\"space.300\" testId=\"animated-icon-basic-example\">\n\t\t\t<Text as=\"p\">\n\t\t\t\tAnimated icons stay static on initial mount. Hover an icon to replay its motion, or use the\n\t\t\t\tbutton to replay all icons.\n\t\t\t</Text>\n\t\t\t<Box>\n\t\t\t\t<Button onClick={replayAllAnimations}>Replay animations</Button>\n\t\t\t</Box>\n\t\t\t<Inline space=\"space.300\" shouldWrap>\n\t\t\t\t{ICONS.map(({ label, Component }) => (\n\t\t\t\t\t<Stack\n\t\t\t\t\t\tkey={label}\n\t\t\t\t\t\tspace=\"space.100\"\n\t\t\t\t\t\talignInline=\"center\"\n\t\t\t\t\t\ttestId={`animated-icon-card-${label.toLowerCase().replace(/\\s+/g, '-')}`}\n\t\t\t\t\t>\n\t\t\t\t\t\t<Box\n\t\t\t\t\t\t\tpadding=\"space.150\"\n\t\t\t\t\t\t\tbackgroundColor=\"color.background.neutral.subtle\"\n\t\t\t\t\t\t\tonMouseEnter={() => setHoverAnimation(label, 'default')}\n\t\t\t\t\t\t\tonMouseLeave={() => setHoverAnimation(label, 'none')}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<Component label={label} animation={animationByLabel[label] ?? 'none'} />\n\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t<Text size=\"small\">{label}</Text>\n\t\t\t\t\t</Stack>\n\t\t\t\t))}\n\t\t\t</Inline>\n\t\t</Stack>\n\t);\n}",
		],
		props: [
			{
				name: 'animation',
				type: '"none" | "default"',
				description:
					'Controls whether the icon should play its primary animation.\n`default` does not autoplay on initial mount; consumers must retrigger it.',
				defaultValue: '"none"',
			},
			{
				name: 'color',
				type: 'string',
				description:
					"Optional color override for the icon.\nDefaults to the standard design token backed icon color.\n\nPass a token-resolved value (e.g. `token('color.icon.subtle')`) rather than\na raw hex string so the icon stays consistent across themes.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text that describes the icon in context.\nUse an empty string when the icon is decorative.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'Optional name for analytics/debugging parity with icon APIs.',
			},
		],
	},
	{
		name: 'AiSearchIcon',
		package: '@atlassian/animated-icon',
		description:
			'Animated icon reserved for searching objects. Animated counterpart of the static Search icon.',
		status: 'early-access',
		usageGuidelines: [
			'Use these icons for internal Platform Labs experiments while the motion model and package shape are being validated.',
			'These icons are intentionally medium-only (`16x16`) and do not expose a size prop.',
			'Replay animations by toggling the `animation` prop from `none` to `default` after mount.',
			'Do not treat this package as part of the public Atlassian Design System surface.',
		],
		contentGuidelines: [
			'Provide a contextual `label` when the icon is meaningful on its own.',
			'Use `label=""` when the icon is decorative and nearby text already communicates the intent.',
		],
		accessibilityGuidelines: [
			'These icons respect reduced-motion preferences and stay static when reduced motion is enabled.',
			'Do not rely on animation alone to convey state changes or critical feedback.',
		],
		keywords: [
			'search',
			'find',
			'magnify',
			'icon',
			'magnifying glass',
			'ai',
			'animated',
			'platform-labs',
		],
		category: 'icons',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { AiGenerativeTextIcon } from '../src/icons/ai-generative-text-icon';\nimport { AiGenerativeTextSummaryIcon } from '../src/icons/ai-generative-text-summary-icon';\nimport { AiSearchIcon } from '../src/icons/ai-search-icon';\nimport { AngleBracketsIcon } from '../src/icons/angle-brackets-icon';\nimport { MagicWandIcon } from '../src/icons/magic-wand-icon';\nimport { RovoChatIcon } from '../src/icons/rovo-chat-icon';\nimport type { AnimatedIconAnimation, AnimatedIconProps } from '../src/types';\ntype IconExample = {\n\tlabel: string;\n\tComponent: (props: AnimatedIconProps) => JSX.Element;\n};\nconst ICONS: IconExample[] = [\n\t{ label: 'Generate text', Component: AiGenerativeTextIcon },\n\t{ label: 'Summarize text', Component: AiGenerativeTextSummaryIcon },\n\t{ label: 'Search', Component: AiSearchIcon },\n\t{ label: 'Code', Component: AngleBracketsIcon },\n\t{ label: 'Suggest', Component: MagicWandIcon },\n\t{ label: 'Rovo chat', Component: RovoChatIcon },\n];\nexport default function BasicExample(): JSX.Element {\n\tconst [animationByLabel, setAnimationByLabel] = useState<Record<string, AnimatedIconAnimation>>(\n\t\t{},\n\t);\n\tconst replayAllAnimations = () => {\n\t\t// Reset every icon to `none` first, then flip them all back to `default`\n\t\t// on the next frame so the animation re-triggers even if it was already\n\t\t// playing.\n\t\tconst setAll = (animation: AnimatedIconAnimation) => {\n\t\t\tsetAnimationByLabel(Object.fromEntries(ICONS.map(({ label }) => [label, animation])));\n\t\t};\n\t\tsetAll('none');\n\t\tif (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {\n\t\t\tsetAll('default');\n\t\t\treturn;\n\t\t}\n\t\twindow.requestAnimationFrame(() => setAll('default'));\n\t};\n\tconst setHoverAnimation = (label: string, animation: AnimatedIconAnimation) => {\n\t\tsetAnimationByLabel((previous) => ({\n\t\t\t...previous,\n\t\t\t[label]: animation,\n\t\t}));\n\t};\n\treturn (\n\t\t<Stack space=\"space.300\" testId=\"animated-icon-basic-example\">\n\t\t\t<Text as=\"p\">\n\t\t\t\tAnimated icons stay static on initial mount. Hover an icon to replay its motion, or use the\n\t\t\t\tbutton to replay all icons.\n\t\t\t</Text>\n\t\t\t<Box>\n\t\t\t\t<Button onClick={replayAllAnimations}>Replay animations</Button>\n\t\t\t</Box>\n\t\t\t<Inline space=\"space.300\" shouldWrap>\n\t\t\t\t{ICONS.map(({ label, Component }) => (\n\t\t\t\t\t<Stack\n\t\t\t\t\t\tkey={label}\n\t\t\t\t\t\tspace=\"space.100\"\n\t\t\t\t\t\talignInline=\"center\"\n\t\t\t\t\t\ttestId={`animated-icon-card-${label.toLowerCase().replace(/\\s+/g, '-')}`}\n\t\t\t\t\t>\n\t\t\t\t\t\t<Box\n\t\t\t\t\t\t\tpadding=\"space.150\"\n\t\t\t\t\t\t\tbackgroundColor=\"color.background.neutral.subtle\"\n\t\t\t\t\t\t\tonMouseEnter={() => setHoverAnimation(label, 'default')}\n\t\t\t\t\t\t\tonMouseLeave={() => setHoverAnimation(label, 'none')}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<Component label={label} animation={animationByLabel[label] ?? 'none'} />\n\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t<Text size=\"small\">{label}</Text>\n\t\t\t\t\t</Stack>\n\t\t\t\t))}\n\t\t\t</Inline>\n\t\t</Stack>\n\t);\n}",
		],
		props: [
			{
				name: 'animation',
				type: '"none" | "default"',
				description:
					'Controls whether the icon should play its primary animation.\n`default` does not autoplay on initial mount; consumers must retrigger it.',
				defaultValue: '"none"',
			},
			{
				name: 'color',
				type: 'string',
				description:
					"Optional color override for the icon.\nDefaults to the standard design token backed icon color.\n\nPass a token-resolved value (e.g. `token('color.icon.subtle')`) rather than\na raw hex string so the icon stays consistent across themes.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text that describes the icon in context.\nUse an empty string when the icon is decorative.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'Optional name for analytics/debugging parity with icon APIs.',
			},
		],
	},
	{
		name: 'AngleBracketsIcon',
		package: '@atlassian/animated-icon',
		description:
			'Animated icon for code or source code (e.g. in Bitbucket and Jira). Animated counterpart of the static AngleBrackets icon.',
		status: 'early-access',
		usageGuidelines: [
			'Use these icons for internal Platform Labs experiments while the motion model and package shape are being validated.',
			'These icons are intentionally medium-only (`16x16`) and do not expose a size prop.',
			'Replay animations by toggling the `animation` prop from `none` to `default` after mount.',
			'Do not treat this package as part of the public Atlassian Design System surface.',
		],
		contentGuidelines: [
			'Provide a contextual `label` when the icon is meaningful on its own.',
			'Use `label=""` when the icon is decorative and nearby text already communicates the intent.',
		],
		accessibilityGuidelines: [
			'These icons respect reduced-motion preferences and stay static when reduced motion is enabled.',
			'Do not rely on animation alone to convey state changes or critical feedback.',
		],
		keywords: [
			'angle-brackets',
			'anglebrackets',
			'icon',
			'code',
			'<>',
			'</>',
			'syntax',
			'jira status',
			'animated',
			'platform-labs',
		],
		category: 'icons',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { AiGenerativeTextIcon } from '../src/icons/ai-generative-text-icon';\nimport { AiGenerativeTextSummaryIcon } from '../src/icons/ai-generative-text-summary-icon';\nimport { AiSearchIcon } from '../src/icons/ai-search-icon';\nimport { AngleBracketsIcon } from '../src/icons/angle-brackets-icon';\nimport { MagicWandIcon } from '../src/icons/magic-wand-icon';\nimport { RovoChatIcon } from '../src/icons/rovo-chat-icon';\nimport type { AnimatedIconAnimation, AnimatedIconProps } from '../src/types';\ntype IconExample = {\n\tlabel: string;\n\tComponent: (props: AnimatedIconProps) => JSX.Element;\n};\nconst ICONS: IconExample[] = [\n\t{ label: 'Generate text', Component: AiGenerativeTextIcon },\n\t{ label: 'Summarize text', Component: AiGenerativeTextSummaryIcon },\n\t{ label: 'Search', Component: AiSearchIcon },\n\t{ label: 'Code', Component: AngleBracketsIcon },\n\t{ label: 'Suggest', Component: MagicWandIcon },\n\t{ label: 'Rovo chat', Component: RovoChatIcon },\n];\nexport default function BasicExample(): JSX.Element {\n\tconst [animationByLabel, setAnimationByLabel] = useState<Record<string, AnimatedIconAnimation>>(\n\t\t{},\n\t);\n\tconst replayAllAnimations = () => {\n\t\t// Reset every icon to `none` first, then flip them all back to `default`\n\t\t// on the next frame so the animation re-triggers even if it was already\n\t\t// playing.\n\t\tconst setAll = (animation: AnimatedIconAnimation) => {\n\t\t\tsetAnimationByLabel(Object.fromEntries(ICONS.map(({ label }) => [label, animation])));\n\t\t};\n\t\tsetAll('none');\n\t\tif (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {\n\t\t\tsetAll('default');\n\t\t\treturn;\n\t\t}\n\t\twindow.requestAnimationFrame(() => setAll('default'));\n\t};\n\tconst setHoverAnimation = (label: string, animation: AnimatedIconAnimation) => {\n\t\tsetAnimationByLabel((previous) => ({\n\t\t\t...previous,\n\t\t\t[label]: animation,\n\t\t}));\n\t};\n\treturn (\n\t\t<Stack space=\"space.300\" testId=\"animated-icon-basic-example\">\n\t\t\t<Text as=\"p\">\n\t\t\t\tAnimated icons stay static on initial mount. Hover an icon to replay its motion, or use the\n\t\t\t\tbutton to replay all icons.\n\t\t\t</Text>\n\t\t\t<Box>\n\t\t\t\t<Button onClick={replayAllAnimations}>Replay animations</Button>\n\t\t\t</Box>\n\t\t\t<Inline space=\"space.300\" shouldWrap>\n\t\t\t\t{ICONS.map(({ label, Component }) => (\n\t\t\t\t\t<Stack\n\t\t\t\t\t\tkey={label}\n\t\t\t\t\t\tspace=\"space.100\"\n\t\t\t\t\t\talignInline=\"center\"\n\t\t\t\t\t\ttestId={`animated-icon-card-${label.toLowerCase().replace(/\\s+/g, '-')}`}\n\t\t\t\t\t>\n\t\t\t\t\t\t<Box\n\t\t\t\t\t\t\tpadding=\"space.150\"\n\t\t\t\t\t\t\tbackgroundColor=\"color.background.neutral.subtle\"\n\t\t\t\t\t\t\tonMouseEnter={() => setHoverAnimation(label, 'default')}\n\t\t\t\t\t\t\tonMouseLeave={() => setHoverAnimation(label, 'none')}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<Component label={label} animation={animationByLabel[label] ?? 'none'} />\n\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t<Text size=\"small\">{label}</Text>\n\t\t\t\t\t</Stack>\n\t\t\t\t))}\n\t\t\t</Inline>\n\t\t</Stack>\n\t);\n}",
		],
		props: [
			{
				name: 'animation',
				type: '"none" | "default"',
				description:
					'Controls whether the icon should play its primary animation.\n`default` does not autoplay on initial mount; consumers must retrigger it.',
				defaultValue: '"none"',
			},
			{
				name: 'color',
				type: 'string',
				description:
					"Optional color override for the icon.\nDefaults to the standard design token backed icon color.\n\nPass a token-resolved value (e.g. `token('color.icon.subtle')`) rather than\na raw hex string so the icon stays consistent across themes.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text that describes the icon in context.\nUse an empty string when the icon is decorative.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'Optional name for analytics/debugging parity with icon APIs.',
			},
		],
	},
	{
		name: 'MagicWandIcon',
		package: '@atlassian/animated-icon',
		description:
			'Animated multi-purpose magic wand icon. Animated counterpart of the static MagicWand icon.',
		status: 'early-access',
		usageGuidelines: [
			'Use these icons for internal Platform Labs experiments while the motion model and package shape are being validated.',
			'These icons are intentionally medium-only (`16x16`) and do not expose a size prop.',
			'Replay animations by toggling the `animation` prop from `none` to `default` after mount.',
			'Do not treat this package as part of the public Atlassian Design System surface.',
		],
		contentGuidelines: [
			'Provide a contextual `label` when the icon is meaningful on its own.',
			'Use `label=""` when the icon is decorative and nearby text already communicates the intent.',
		],
		accessibilityGuidelines: [
			'These icons respect reduced-motion preferences and stay static when reduced motion is enabled.',
			'Do not rely on animation alone to convey state changes or critical feedback.',
		],
		keywords: [
			'magic-wand',
			'magicwand',
			'icon',
			'magic',
			'wand',
			'suggestion',
			'animated',
			'platform-labs',
		],
		category: 'icons',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { AiGenerativeTextIcon } from '../src/icons/ai-generative-text-icon';\nimport { AiGenerativeTextSummaryIcon } from '../src/icons/ai-generative-text-summary-icon';\nimport { AiSearchIcon } from '../src/icons/ai-search-icon';\nimport { AngleBracketsIcon } from '../src/icons/angle-brackets-icon';\nimport { MagicWandIcon } from '../src/icons/magic-wand-icon';\nimport { RovoChatIcon } from '../src/icons/rovo-chat-icon';\nimport type { AnimatedIconAnimation, AnimatedIconProps } from '../src/types';\ntype IconExample = {\n\tlabel: string;\n\tComponent: (props: AnimatedIconProps) => JSX.Element;\n};\nconst ICONS: IconExample[] = [\n\t{ label: 'Generate text', Component: AiGenerativeTextIcon },\n\t{ label: 'Summarize text', Component: AiGenerativeTextSummaryIcon },\n\t{ label: 'Search', Component: AiSearchIcon },\n\t{ label: 'Code', Component: AngleBracketsIcon },\n\t{ label: 'Suggest', Component: MagicWandIcon },\n\t{ label: 'Rovo chat', Component: RovoChatIcon },\n];\nexport default function BasicExample(): JSX.Element {\n\tconst [animationByLabel, setAnimationByLabel] = useState<Record<string, AnimatedIconAnimation>>(\n\t\t{},\n\t);\n\tconst replayAllAnimations = () => {\n\t\t// Reset every icon to `none` first, then flip them all back to `default`\n\t\t// on the next frame so the animation re-triggers even if it was already\n\t\t// playing.\n\t\tconst setAll = (animation: AnimatedIconAnimation) => {\n\t\t\tsetAnimationByLabel(Object.fromEntries(ICONS.map(({ label }) => [label, animation])));\n\t\t};\n\t\tsetAll('none');\n\t\tif (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {\n\t\t\tsetAll('default');\n\t\t\treturn;\n\t\t}\n\t\twindow.requestAnimationFrame(() => setAll('default'));\n\t};\n\tconst setHoverAnimation = (label: string, animation: AnimatedIconAnimation) => {\n\t\tsetAnimationByLabel((previous) => ({\n\t\t\t...previous,\n\t\t\t[label]: animation,\n\t\t}));\n\t};\n\treturn (\n\t\t<Stack space=\"space.300\" testId=\"animated-icon-basic-example\">\n\t\t\t<Text as=\"p\">\n\t\t\t\tAnimated icons stay static on initial mount. Hover an icon to replay its motion, or use the\n\t\t\t\tbutton to replay all icons.\n\t\t\t</Text>\n\t\t\t<Box>\n\t\t\t\t<Button onClick={replayAllAnimations}>Replay animations</Button>\n\t\t\t</Box>\n\t\t\t<Inline space=\"space.300\" shouldWrap>\n\t\t\t\t{ICONS.map(({ label, Component }) => (\n\t\t\t\t\t<Stack\n\t\t\t\t\t\tkey={label}\n\t\t\t\t\t\tspace=\"space.100\"\n\t\t\t\t\t\talignInline=\"center\"\n\t\t\t\t\t\ttestId={`animated-icon-card-${label.toLowerCase().replace(/\\s+/g, '-')}`}\n\t\t\t\t\t>\n\t\t\t\t\t\t<Box\n\t\t\t\t\t\t\tpadding=\"space.150\"\n\t\t\t\t\t\t\tbackgroundColor=\"color.background.neutral.subtle\"\n\t\t\t\t\t\t\tonMouseEnter={() => setHoverAnimation(label, 'default')}\n\t\t\t\t\t\t\tonMouseLeave={() => setHoverAnimation(label, 'none')}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<Component label={label} animation={animationByLabel[label] ?? 'none'} />\n\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t<Text size=\"small\">{label}</Text>\n\t\t\t\t\t</Stack>\n\t\t\t\t))}\n\t\t\t</Inline>\n\t\t</Stack>\n\t);\n}",
		],
		props: [
			{
				name: 'animation',
				type: '"none" | "default"',
				description:
					'Controls whether the icon should play its primary animation.\n`default` does not autoplay on initial mount; consumers must retrigger it.',
				defaultValue: '"none"',
			},
			{
				name: 'color',
				type: 'string',
				description:
					"Optional color override for the icon.\nDefaults to the standard design token backed icon color.\n\nPass a token-resolved value (e.g. `token('color.icon.subtle')`) rather than\na raw hex string so the icon stays consistent across themes.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text that describes the icon in context.\nUse an empty string when the icon is decorative.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'Optional name for analytics/debugging parity with icon APIs.',
			},
		],
	},
	{
		name: 'RovoChatIcon',
		package: '@atlassian/animated-icon',
		description:
			'Animated icon reserved for branded Rovo chat experiences. Animated counterpart of the static RovoChat icon.',
		status: 'early-access',
		usageGuidelines: [
			'Use these icons for internal Platform Labs experiments while the motion model and package shape are being validated.',
			'These icons are intentionally medium-only (`16x16`) and do not expose a size prop.',
			'Replay animations by toggling the `animation` prop from `none` to `default` after mount.',
			'Do not treat this package as part of the public Atlassian Design System surface.',
		],
		contentGuidelines: [
			'Provide a contextual `label` when the icon is meaningful on its own.',
			'Use `label=""` when the icon is decorative and nearby text already communicates the intent.',
		],
		accessibilityGuidelines: [
			'These icons respect reduced-motion preferences and stay static when reduced motion is enabled.',
			'Do not rely on animation alone to convey state changes or critical feedback.',
		],
		keywords: [
			'rovo-chat',
			'rovochat',
			'icon',
			'Rovo',
			'AI',
			'chat agent',
			'animated',
			'platform-labs',
		],
		category: 'icons',
		examples: [
			"import React, { useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { AiGenerativeTextIcon } from '../src/icons/ai-generative-text-icon';\nimport { AiGenerativeTextSummaryIcon } from '../src/icons/ai-generative-text-summary-icon';\nimport { AiSearchIcon } from '../src/icons/ai-search-icon';\nimport { AngleBracketsIcon } from '../src/icons/angle-brackets-icon';\nimport { MagicWandIcon } from '../src/icons/magic-wand-icon';\nimport { RovoChatIcon } from '../src/icons/rovo-chat-icon';\nimport type { AnimatedIconAnimation, AnimatedIconProps } from '../src/types';\ntype IconExample = {\n\tlabel: string;\n\tComponent: (props: AnimatedIconProps) => JSX.Element;\n};\nconst ICONS: IconExample[] = [\n\t{ label: 'Generate text', Component: AiGenerativeTextIcon },\n\t{ label: 'Summarize text', Component: AiGenerativeTextSummaryIcon },\n\t{ label: 'Search', Component: AiSearchIcon },\n\t{ label: 'Code', Component: AngleBracketsIcon },\n\t{ label: 'Suggest', Component: MagicWandIcon },\n\t{ label: 'Rovo chat', Component: RovoChatIcon },\n];\nexport default function BasicExample(): JSX.Element {\n\tconst [animationByLabel, setAnimationByLabel] = useState<Record<string, AnimatedIconAnimation>>(\n\t\t{},\n\t);\n\tconst replayAllAnimations = () => {\n\t\t// Reset every icon to `none` first, then flip them all back to `default`\n\t\t// on the next frame so the animation re-triggers even if it was already\n\t\t// playing.\n\t\tconst setAll = (animation: AnimatedIconAnimation) => {\n\t\t\tsetAnimationByLabel(Object.fromEntries(ICONS.map(({ label }) => [label, animation])));\n\t\t};\n\t\tsetAll('none');\n\t\tif (typeof window === 'undefined' || typeof window.requestAnimationFrame !== 'function') {\n\t\t\tsetAll('default');\n\t\t\treturn;\n\t\t}\n\t\twindow.requestAnimationFrame(() => setAll('default'));\n\t};\n\tconst setHoverAnimation = (label: string, animation: AnimatedIconAnimation) => {\n\t\tsetAnimationByLabel((previous) => ({\n\t\t\t...previous,\n\t\t\t[label]: animation,\n\t\t}));\n\t};\n\treturn (\n\t\t<Stack space=\"space.300\" testId=\"animated-icon-basic-example\">\n\t\t\t<Text as=\"p\">\n\t\t\t\tAnimated icons stay static on initial mount. Hover an icon to replay its motion, or use the\n\t\t\t\tbutton to replay all icons.\n\t\t\t</Text>\n\t\t\t<Box>\n\t\t\t\t<Button onClick={replayAllAnimations}>Replay animations</Button>\n\t\t\t</Box>\n\t\t\t<Inline space=\"space.300\" shouldWrap>\n\t\t\t\t{ICONS.map(({ label, Component }) => (\n\t\t\t\t\t<Stack\n\t\t\t\t\t\tkey={label}\n\t\t\t\t\t\tspace=\"space.100\"\n\t\t\t\t\t\talignInline=\"center\"\n\t\t\t\t\t\ttestId={`animated-icon-card-${label.toLowerCase().replace(/\\s+/g, '-')}`}\n\t\t\t\t\t>\n\t\t\t\t\t\t<Box\n\t\t\t\t\t\t\tpadding=\"space.150\"\n\t\t\t\t\t\t\tbackgroundColor=\"color.background.neutral.subtle\"\n\t\t\t\t\t\t\tonMouseEnter={() => setHoverAnimation(label, 'default')}\n\t\t\t\t\t\t\tonMouseLeave={() => setHoverAnimation(label, 'none')}\n\t\t\t\t\t\t>\n\t\t\t\t\t\t\t<Component label={label} animation={animationByLabel[label] ?? 'none'} />\n\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t<Text size=\"small\">{label}</Text>\n\t\t\t\t\t</Stack>\n\t\t\t\t))}\n\t\t\t</Inline>\n\t\t</Stack>\n\t);\n}",
		],
		props: [
			{
				name: 'animation',
				type: '"none" | "default"',
				description:
					'Controls whether the icon should play its primary animation.\n`default` does not autoplay on initial mount; consumers must retrigger it.',
				defaultValue: '"none"',
			},
			{
				name: 'color',
				type: 'string',
				description:
					"Optional color override for the icon.\nDefaults to the standard design token backed icon color.\n\nPass a token-resolved value (e.g. `token('color.icon.subtle')`) rather than\na raw hex string so the icon stays consistent across themes.",
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Text that describes the icon in context.\nUse an empty string when the icon is decorative.',
				isRequired: true,
			},
			{
				name: 'name',
				type: 'string',
				description: 'Optional name for analytics/debugging parity with icon APIs.',
			},
		],
	},
	{
		name: 'AvatarRelay',
		package: '@atlassian/avatar-relay',
		description:
			'A private Platform Labs Relay-backed avatar component that renders the correct avatar shape for the provided app type.',
		status: 'early-access',
		usageGuidelines: [
			'See [Avatar](https://atlassian.design/components/avatar) for the base avatar component.',
			'Use when a consumer already has Relay data and needs a shared avatar renderer that understands Atlassian app types.',
			'Do not use as a replacement for static ADS Avatar usage when Relay data is not required.',
		],
		contentGuidelines: [
			'Provide accessible labels from the consuming product when an avatar conveys identity or meaning.',
			'Keep surrounding copy responsible for explaining product-specific context.',
		],
		accessibilityGuidelines: [
			'Ensure the avatar has an accessible name when it is interactive or communicates identity.',
			'Do not rely on avatar shape alone to communicate user type or agent type.',
			'Verify focus behavior in the consuming surface when the avatar is wrapped in an interactive element.',
		],
		keywords: ['avatar', 'relay', 'platform-labs', 'internal', 'ai-agent', 'app-type'],
		category: 'identity',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { graphql, useLazyLoadQuery } from 'react-relay';\nimport { cssMap, jsx } from '@atlaskit/css';\nimport Heading from '@atlaskit/heading/heading';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Grid } from '@atlaskit/primitives/compiled/grid';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { token } from '@atlaskit/tokens';\nimport { AvatarRelay } from '@atlassian/avatar-relay/avatar-relay';\nimport type { basicQuery } from './__generated__/basicQuery.graphql';\nimport RelayMock from './utils/relay-mock';\nconst styles = cssMap({\n\tcontainer: {\n\t\tpaddingBlock: token('space.300'),\n\t\tpaddingInline: token('space.300'),\n\t},\n\ttwoColumns: {\n\t\tgridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',\n\t},\n\tuserExample: {\n\t\tminWidth: 0,\n\t},\n});\nconst Example = () => {\n\tconst data = useLazyLoadQuery<basicQuery>(\n\t\tgraphql`\n\t\t\tquery basicQuery($after: String = null, $first: Int = 50, $id: ID!, $searchBy: String = \"\") {\n\t\t\t\tnode(id: $id) {\n\t\t\t\t\t__typename\n\t\t\t\t\t... on JiraSingleSelectUserPickerField {\n\t\t\t\t\t\tusers(searchBy: $searchBy, first: $first, after: $after) {\n\t\t\t\t\t\t\tedges {\n\t\t\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t\t\t__typename\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\tid\n\t\t\t\t\t\t\t\t\t# eslint-disable-next-line @atlassian/relay/must-colocate-fragment-spreads\n\t\t\t\t\t\t\t\t\t...avatarRelay_user\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t`,\n\t\t{\n\t\t\tafter: null,\n\t\t\tfirst: 50,\n\t\t\tid: 'ari:cloud:jira:3c68b169-7056-42a8-a628-79826cb24808:issuefieldvalue/12125/assignee',\n\t\t\tsearchBy: '',\n\t\t},\n\t);\n\tconst edges =\n\t\tdata?.node?.__typename === 'JiraSingleSelectUserPickerField'\n\t\t\t? data.node.users?.edges || []\n\t\t\t: [];\n\tconst users = edges\n\t\t.map((edge) => edge?.node)\n\t\t.filter((node): node is NonNullable<typeof node> => node != null);\n\t// Split users into two columns\n\tconst midpoint = Math.ceil(users.length / 2);\n\tconst leftColumnUsers = users.slice(0, midpoint);\n\tconst rightColumnUsers = users.slice(midpoint);\n\treturn (\n\t\t<Box xcss={styles.container}>\n\t\t\t<Grid gap=\"space.400\" xcss={styles.twoColumns}>\n\t\t\t\t{/* Left Column */}\n\t\t\t\t<Stack space=\"space.200\" alignInline=\"center\">\n\t\t\t\t\t{leftColumnUsers.map((user) => (\n\t\t\t\t\t\t<Stack key={user.id} space=\"space.100\" alignInline=\"center\" xcss={styles.userExample}>\n\t\t\t\t\t\t\t<Heading size=\"medium\">{user.name}</Heading>\n\t\t\t\t\t\t\t<Inline space=\"space.100\" alignBlock=\"center\" shouldWrap>\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"xxlarge\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"xlarge\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"large\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"medium\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"small\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"xsmall\" />\n\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t))}\n\t\t\t\t</Stack>\n\t\t\t\t{/* Right Column */}\n\t\t\t\t<Stack space=\"space.200\" alignInline=\"center\">\n\t\t\t\t\t{rightColumnUsers.map((user) => (\n\t\t\t\t\t\t<Stack key={user.id} space=\"space.100\" alignInline=\"center\" xcss={styles.userExample}>\n\t\t\t\t\t\t\t<Heading size=\"medium\">{user.name}</Heading>\n\t\t\t\t\t\t\t<Inline space=\"space.100\" alignBlock=\"center\" shouldWrap>\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"xxlarge\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"xlarge\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"large\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"medium\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"small\" />\n\t\t\t\t\t\t\t\t<AvatarRelay userFragment={user} name={user.name || 'User'} size=\"xsmall\" />\n\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t</Stack>\n\t\t\t\t\t))}\n\t\t\t\t</Stack>\n\t\t\t</Grid>\n\t\t</Box>\n\t);\n};\nconst _default: () => JSX.Element = () => {\n\treturn (\n\t\t<RelayMock>\n\t\t\t<Example />\n\t\t</RelayMock>\n\t);\n};\nexport default _default;",
			"import { graphql, useLazyLoadQuery } from 'react-relay';\nimport { AvatarRelay } from '@atlassian/avatar-relay/avatar-relay';\nimport type { aiAgentQuery } from './__generated__/aiAgentQuery.graphql';\nimport RelayMock from './utils/relay-mock';\nconst Example = () => {\n\tconst data = useLazyLoadQuery<aiAgentQuery>(\n\t\tgraphql`\n\t\t\tquery aiAgentQuery($id: ID!) {\n\t\t\t\tnode(id: $id) {\n\t\t\t\t\t__typename\n\t\t\t\t\t... on JiraSingleSelectUserPickerField {\n\t\t\t\t\t\tusers(first: 1) {\n\t\t\t\t\t\t\tedges {\n\t\t\t\t\t\t\t\tnode {\n\t\t\t\t\t\t\t\t\t__typename\n\t\t\t\t\t\t\t\t\tname\n\t\t\t\t\t\t\t\t\t# eslint-disable-next-line @atlassian/relay/must-colocate-fragment-spreads\n\t\t\t\t\t\t\t\t\t...avatarRelay_user\n\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t`,\n\t\t{\n\t\t\tid: 'ari:cloud:jira:3c68b169-7056-42a8-a628-79826cb24808:issuefieldvalue/12125/assignee',\n\t\t},\n\t);\n\tconst edges =\n\t\tdata?.node?.__typename === 'JiraSingleSelectUserPickerField'\n\t\t\t? data.node.users?.edges || []\n\t\t\t: [];\n\tconst user = edges\n\t\t.map((edge) => edge?.node)\n\t\t.find(\n\t\t\t(node): node is NonNullable<typeof node> => node != null && node.name.includes('AI Agent'),\n\t\t)!;\n\treturn <AvatarRelay userFragment={user} name={user.name} size=\"large\" />;\n};\nexport default (): React.JSX.Element => {\n\treturn (\n\t\t<RelayMock>\n\t\t\t<Example />\n\t\t</RelayMock>\n\t);\n};",
		],
		props: [
			{
				name: 'aria-controls',
				type: 'string',
				description:
					'Identifies the popup element that the avatar controls.\nUsed when Avatar is a trigger for a popup.',
			},
			{
				name: 'aria-expanded',
				type: 'boolean',
				description:
					'Announces to assistive technology whether the controlled popup is currently open or closed.',
			},
			{
				name: 'aria-haspopup',
				type: 'boolean | "dialog"',
				description:
					'Informs assistive technology that this element triggers a popup.\nWhen set, Avatar will render as a `<button>` element even without `onClick`.',
			},
			{
				name: 'as',
				type: 'keyof global.JSX.IntrinsicElements | ComponentType<AllHTMLAttributes<HTMLElement>>',
				description:
					'Replace the wrapping element. This accepts the name of a html tag which will\nbe used to wrap the element.',
			},
			{
				name: 'borderColor',
				type: 'string',
				description:
					'Used to override the default border color around the avatar body.\nAccepts any color argument that the border-color CSS property accepts.',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Supply a custom avatar component instead of the default.',
			},
			{
				name: 'href',
				type: 'string',
				description: 'Provides a url for avatars being used as a link.',
			},
			{
				name: 'imgLoading',
				type: '"lazy" | "eager"',
				description: 'Defines the loading behaviour of the avatar image. Default value is eager.',
			},
			{
				name: 'isDecorative',
				type: 'boolean',
				description: 'whether disable aria-labelledby for avatar img',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Change the style to indicate the avatar is disabled.',
			},
			{
				name: 'label',
				type: 'string',
				description:
					'Used to provide custom content to screen readers.\nStatus or presence is not added to the label by default if it passed as nodes.\nIf status or presence is passed as a string, the default content format is "John Smith (online)".',
			},
			{
				name: 'name',
				type: 'string',
				description: 'Provides alt text for the avatar image.',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<Element, globalThis.MouseEvent>, analyticsEvent?: UIAnalyticsEvent) => void',
				description: 'Handler to be called on click.',
			},
			{
				name: 'presence',
				type: 'Presence | Omit<ReactNode, string> | (string & {})',
				description:
					"Indicates a user's online status by showing a small icon on the avatar.\nRefer to presence values on the presence component.\nAlternatively accepts any React element. For best results, it is recommended to\nuse square content with height and width of 100%.",
			},
			{
				name: 'size',
				type: '"xsmall" | "UNSAFE_xsmall" | "small" | "medium" | "large" | "xlarge" | "xxlarge"',
				description:
					"Defines the size of the avatar. Default value is `medium`.\n\nAvailable sizes (in pixels): `xsmall` (16), `small` (24), `medium` (32),\n`large` (40), `xlarge` (96), `xxlarge` (128).\n\nThe `UNSAFE_xsmall` (20px) size is an unsafe, transitional value and is\nintentionally not documented for general use — see `SizeType`.\n\nThis can also be controlled by the `size` property of the\n`AvatarContext` export from this package. If no prop is given when the\n`size` is set via this context, the context's value will be used.",
			},
			{
				name: 'stackIndex',
				type: 'number',
				description: 'The index of where this avatar is in the group `stack`.',
			},
			{
				name: 'status',
				type: 'Omit<ReactNode, string> | (string & {}) | Status',
				description:
					'Indicates contextual information by showing a small icon on the avatar.\nRefer to status values on the Status component.',
			},
			{
				name: 'tabIndex',
				type: 'number',
				description: 'Assign specific tabIndex order to the underlying node.',
			},
			{
				name: 'target',
				type: '"_blank" | "_self" | "_top" | "_parent"',
				description: 'Pass target down to the anchor, if href is provided.',
			},
			{
				name: 'userFragment',
				type: '{ readonly " $data"?: avatarRelay_user$data; readonly " $fragmentSpreads": FragmentRefs<"avatarRelay_user">; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'Card',
		package: '@atlassian/card',
		description:
			'A composable Platform Labs card primitive with ADS-aligned surface styles, fixed-density variants, and semantic content slots.',
		status: 'early-access',
		usageGuidelines: [
			'Use for composable card layouts with media, header, body, and footer slot content.',
			'Use Card (comfy by default) from @atlassian/card, or CompactCard from @atlassian/card/compact-card, to select product-level density.',
			'Import each subcomponent from its own entry-point, for example CardMedia from @atlassian/card/card-media.',
			'Use appearance flat or raised to match information hierarchy on the page.',
			'Use onClick for full-surface card actions, or href for full-surface navigation.',
			'Use CardLeading for a dedicated leading column, or CardHeader leading for avatar/tile inline with title.',
			'Do not place nested interactive elements (for example buttons or links) inside interactive cards.',
		],
		contentGuidelines: [
			'Use a concise title with optional description text in the header.',
			'Keep body content focused and avoid overcrowding dense card layouts.',
			'Use footer content for supporting metadata or secondary actions.',
		],
		accessibilityGuidelines: [
			'Choose heading levels via CardTitle as to preserve document hierarchy.',
			'Use interactive cards only when click target behavior is intentional and clear.',
			'When a card contains nested controls, keep the card root non-interactive to avoid overlapping targets.',
			'Ensure card content and any interactive affordances remain keyboard accessible.',
		],
		keywords: ['card', 'surface', 'layout', 'platform-labs', 'slots'],
		category: 'layout',
		examples: [
			"import Avatar from '@atlaskit/avatar/avatar';\nimport { cssMap } from '@atlaskit/css';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { token } from '@atlaskit/tokens';\nimport { Card } from '../src/entry-points/card';\nimport { CardBody } from '../src/entry-points/card-body';\nimport { CardContent } from '../src/entry-points/card-content';\nimport { CardDescription } from '../src/entry-points/card-description';\nimport { CardFooter } from '../src/entry-points/card-footer';\nimport { CardHeader } from '../src/entry-points/card-header';\nimport { CardLeading } from '../src/entry-points/card-leading';\nimport { CardMedia } from '../src/entry-points/card-media';\nimport { CardPrimaryContent } from '../src/entry-points/card-primary-content';\nimport { CardTitle } from '../src/entry-points/card-title';\nconst styles = cssMap({\n\tmedia: {\n\t\tbackgroundColor: token('color.background.discovery'),\n\t\tdisplay: 'flex',\n\t\talignItems: 'center',\n\t\tjustifyContent: 'center',\n\t},\n\tbodyContent: {\n\t\tbackgroundColor: token('color.background.discovery'),\n\t\tminHeight: '64px',\n\t\tdisplay: 'flex',\n\t\talignItems: 'center',\n\t\tjustifyContent: 'center',\n\t},\n});\nexport default function Basic(): React.JSX.Element {\n\treturn (\n\t\t<Box padding=\"space.300\">\n\t\t\t<Card appearance=\"flat\" testId=\"card\">\n\t\t\t\t<CardMedia>\n\t\t\t\t\t<Box xcss={styles.media} />\n\t\t\t\t</CardMedia>\n\t\t\t\t<CardContent>\n\t\t\t\t\t<CardLeading>\n\t\t\t\t\t\t<Avatar name=\"Taylor Smith\" size=\"small\" />\n\t\t\t\t\t</CardLeading>\n\t\t\t\t\t<CardPrimaryContent>\n\t\t\t\t\t\t<CardHeader>\n\t\t\t\t\t\t\t<Stack space=\"space.050\">\n\t\t\t\t\t\t\t\t<CardTitle>Card title</CardTitle>\n\t\t\t\t\t\t\t\t<CardDescription>Card description text</CardDescription>\n\t\t\t\t\t\t\t</Stack>\n\t\t\t\t\t\t</CardHeader>\n\t\t\t\t\t\t<CardBody>\n\t\t\t\t\t\t\t<Box xcss={styles.bodyContent}>\n\t\t\t\t\t\t\t\t<Text color=\"color.text.discovery\">Card body</Text>\n\t\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t</CardBody>\n\t\t\t\t\t\t<CardFooter>\n\t\t\t\t\t\t\t<Text color=\"color.text.subtle\">Footer content slot</Text>\n\t\t\t\t\t\t</CardFooter>\n\t\t\t\t\t</CardPrimaryContent>\n\t\t\t\t</CardContent>\n\t\t\t</Card>\n\t\t</Box>\n\t);\n}",
			"import Avatar from '@atlaskit/avatar/avatar';\nimport Button from '@atlaskit/button/new';\nimport { cssMap } from '@atlaskit/css';\nimport Heading from '@atlaskit/heading/heading';\nimport ImageIcon from '@atlaskit/icon/core/image';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Grid } from '@atlaskit/primitives/compiled/grid';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { Text } from '@atlaskit/primitives/compiled/text';\nimport { token } from '@atlaskit/tokens';\nimport { Card } from '../src/entry-points/card';\nimport { CardBody } from '../src/entry-points/card-body';\nimport { CardContent } from '../src/entry-points/card-content';\nimport { CardDescription } from '../src/entry-points/card-description';\nimport { CardFooter } from '../src/entry-points/card-footer';\nimport { CardHeader } from '../src/entry-points/card-header';\nimport { CardLeading } from '../src/entry-points/card-leading';\nimport { CardMedia } from '../src/entry-points/card-media';\nimport { CardPrimaryContent } from '../src/entry-points/card-primary-content';\nimport { CardTitle } from '../src/entry-points/card-title';\nconst styles = cssMap({\n\tmedia: {\n\t\tbackgroundColor: token('color.background.discovery'),\n\t\theight: '132px',\n\t\tdisplay: 'flex',\n\t\talignItems: 'center',\n\t\tjustifyContent: 'center',\n\t},\n\tbodyContent: {\n\t\tbackgroundColor: token('color.background.discovery'),\n\t\tminHeight: '64px',\n\t\tdisplay: 'flex',\n\t\talignItems: 'center',\n\t\tjustifyContent: 'center',\n\t},\n\tfooterRow: { width: '100%' },\n\tcardGrid: {\n\t\tgridTemplateColumns: 'repeat(2, minmax(340px, 380px))',\n\t},\n\ttitle: {\n\t\tminHeight: '20px',\n\t},\n});\nconst CompositionCard = ({\n\tappearance = 'flat',\n\twithHeader = true,\n\twithMedia,\n\twithAvatar,\n\tleadingInHeader,\n\twithDescription,\n\twithBody,\n\twithFooter,\n}: {\n\tappearance?: 'flat' | 'raised';\n\twithHeader?: boolean;\n\twithMedia?: boolean;\n\twithAvatar?: boolean;\n\tleadingInHeader?: boolean;\n\twithDescription?: boolean;\n\twithBody?: boolean;\n\twithFooter?: boolean;\n}) => {\n\tconst avatar = withAvatar ? <Avatar name=\"Taylor Smith\" size=\"small\" /> : null;\n\tconst mainContentColumn = (\n\t\t<CardPrimaryContent>\n\t\t\t{withHeader ? (\n\t\t\t\t<CardHeader leading={leadingInHeader ? avatar : undefined}>\n\t\t\t\t\t<Stack space=\"space.050\" grow=\"fill\">\n\t\t\t\t\t\t<Box xcss={styles.title}>\n\t\t\t\t\t\t\t<CardTitle>Card title</CardTitle>\n\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t{withDescription ? <CardDescription>Card description text</CardDescription> : null}\n\t\t\t\t\t</Stack>\n\t\t\t\t</CardHeader>\n\t\t\t) : null}\n\t\t\t{withBody ? (\n\t\t\t\t<CardBody>\n\t\t\t\t\t<Box xcss={styles.bodyContent}>\n\t\t\t\t\t\t<Text color=\"color.text.discovery\">Card body</Text>\n\t\t\t\t\t</Box>\n\t\t\t\t</CardBody>\n\t\t\t) : null}\n\t\t\t{withFooter ? (\n\t\t\t\t<CardFooter>\n\t\t\t\t\t<Box xcss={styles.footerRow}>\n\t\t\t\t\t\t<Inline spread=\"space-between\" alignBlock=\"center\">\n\t\t\t\t\t\t\t<Text color=\"color.text.subtle\" size=\"small\">\n\t\t\t\t\t\t\t\tFooter meta\n\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t<Button appearance=\"default\">Action</Button>\n\t\t\t\t\t\t</Inline>\n\t\t\t\t\t</Box>\n\t\t\t\t</CardFooter>\n\t\t\t) : null}\n\t\t</CardPrimaryContent>\n\t);\n\treturn (\n\t\t<Card appearance={appearance}>\n\t\t\t{withMedia ? (\n\t\t\t\t<CardMedia>\n\t\t\t\t\t<Box xcss={styles.media}>\n\t\t\t\t\t\t<ImageIcon color={token('color.icon.discovery')} label=\"Image placeholder\" />\n\t\t\t\t\t</Box>\n\t\t\t\t</CardMedia>\n\t\t\t) : null}\n\t\t\t<CardContent>\n\t\t\t\t{withAvatar && !leadingInHeader ? <CardLeading>{avatar}</CardLeading> : null}\n\t\t\t\t{mainContentColumn}\n\t\t\t</CardContent>\n\t\t</Card>\n\t);\n};\nconst CompositionGrid = ({ appearance = 'flat' }: { appearance?: 'flat' | 'raised' }) => (\n\t<Grid gap=\"space.300\" xcss={styles.cardGrid}>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Media + Header + Body + Footer</Text>\n\t\t\t<CompositionCard\n\t\t\t\tappearance={appearance}\n\t\t\t\twithMedia\n\t\t\t\twithAvatar\n\t\t\t\twithDescription\n\t\t\t\twithBody\n\t\t\t\twithFooter\n\t\t\t/>\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Media + Header + Body + Footer (Avatar in header)</Text>\n\t\t\t<CompositionCard\n\t\t\t\tappearance={appearance}\n\t\t\t\twithMedia\n\t\t\t\twithAvatar\n\t\t\t\tleadingInHeader\n\t\t\t\twithDescription\n\t\t\t\twithBody\n\t\t\t\twithFooter\n\t\t\t/>\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Media + Header</Text>\n\t\t\t<CompositionCard appearance={appearance} withMedia withAvatar withDescription />\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Header only (Avatar as leading column)</Text>\n\t\t\t<CompositionCard appearance={appearance} withAvatar withDescription />\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Header only (Avatar in header)</Text>\n\t\t\t<CompositionCard appearance={appearance} withAvatar leadingInHeader withDescription />\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Header + Body (no Avatar)</Text>\n\t\t\t<CompositionCard appearance={appearance} withDescription withBody />\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Media + Header (no Description)</Text>\n\t\t\t<CompositionCard appearance={appearance} withMedia withAvatar />\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Header + Footer</Text>\n\t\t\t<CompositionCard appearance={appearance} withAvatar withDescription withFooter />\n\t\t</Stack>\n\t\t<Stack space=\"space.100\">\n\t\t\t<Text weight=\"medium\">Body only</Text>\n\t\t\t<CompositionCard appearance={appearance} withHeader={false} withBody />\n\t\t</Stack>\n\t</Grid>\n);\nconst VariantsExample = (): React.JSX.Element => (\n\t<Box padding=\"space.300\" backgroundColor=\"elevation.surface\">\n\t\t<Stack space=\"space.500\">\n\t\t\t<Heading size=\"large\" as=\"h2\">\n\t\t\t\tFlat card compositions\n\t\t\t</Heading>\n\t\t\t<CompositionGrid appearance=\"flat\" />\n\t\t\t<Heading size=\"large\" as=\"h2\">\n\t\t\t\tRaised card compositions\n\t\t\t</Heading>\n\t\t\t<CompositionGrid appearance=\"raised\" />\n\t\t</Stack>\n\t</Box>\n);\nexport default VariantsExample;",
			'import React, { useState } from \'react\';\nimport Avatar from \'@atlaskit/avatar/avatar\';\nimport { cssMap } from \'@atlaskit/css\';\nimport ImageIcon from \'@atlaskit/icon/core/image\';\nimport { Box } from \'@atlaskit/primitives/compiled/box\';\nimport { Inline } from \'@atlaskit/primitives/compiled/inline\';\nimport { Stack } from \'@atlaskit/primitives/compiled/stack\';\nimport { Text } from \'@atlaskit/primitives/compiled/text\';\nimport { token } from \'@atlaskit/tokens\';\nimport { Card } from \'../src/entry-points/card\';\nimport { CardBody } from \'../src/entry-points/card-body\';\nimport { CardContent } from \'../src/entry-points/card-content\';\nimport { CardDescription } from \'../src/entry-points/card-description\';\nimport { CardFooter } from \'../src/entry-points/card-footer\';\nimport { CardHeader } from \'../src/entry-points/card-header\';\nimport { CardLeading } from \'../src/entry-points/card-leading\';\nimport { CardMedia } from \'../src/entry-points/card-media\';\nimport { CardPrimaryContent } from \'../src/entry-points/card-primary-content\';\nimport { CardTitle } from \'../src/entry-points/card-title\';\nconst styles = cssMap({\n\tpage: {\n\t\tbackgroundColor: token(\'elevation.surface.sunken\'),\n\t},\n\tpanel: {\n\t\tbackgroundColor: token(\'elevation.surface\'),\n\t\tborderColor: token(\'color.border\'),\n\t\tborderRadius: token(\'radius.medium\'),\n\t\tborderStyle: \'solid\',\n\t\tborderWidth: token(\'border.width\'),\n\t},\n\tmedia: {\n\t\tbackgroundColor: token(\'color.background.discovery\'),\n\t\theight: \'132px\',\n\t\tdisplay: \'flex\',\n\t\talignItems: \'center\',\n\t\tjustifyContent: \'center\',\n\t},\n\tbodyContent: {\n\t\tbackgroundColor: token(\'color.background.discovery\'),\n\t\tminHeight: \'64px\',\n\t\tdisplay: \'flex\',\n\t\talignItems: \'center\',\n\t\tjustifyContent: \'center\',\n\t},\n});\ntype LayoutOption = \'leading-column\' | \'header-leading\';\ntype AppearanceOption = \'flat\' | \'raised\';\nconst PlaygroundExample = (): React.JSX.Element => {\n\tconst [appearance, setAppearance] = useState<AppearanceOption>(\'flat\');\n\tconst [isSelected, setIsSelected] = useState(false);\n\tconst [layout, setLayout] = useState<LayoutOption>(\'leading-column\');\n\tconst [withMedia, setWithMedia] = useState(true);\n\tconst [withAvatar, setWithAvatar] = useState(true);\n\tconst [withHeader, setWithHeader] = useState(true);\n\tconst [withDescription, setWithDescription] = useState(true);\n\tconst [withBody, setWithBody] = useState(true);\n\tconst [withFooter, setWithFooter] = useState(true);\n\tconst avatar = withAvatar ? <Avatar name="Taylor Smith" size="small" /> : null;\n\tconst leadingInHeader = layout === \'header-leading\';\n\treturn (\n\t\t<Box padding="space.300" xcss={styles.page}>\n\t\t\t<Stack space="space.300">\n\t\t\t\t<Box xcss={styles.panel} padding="space.200">\n\t\t\t\t\t<Stack space="space.150">\n\t\t\t\t\t\t<Text weight="medium">Card playground</Text>\n\t\t\t\t\t\t<Inline space="space.300" shouldWrap>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="radio"\n\t\t\t\t\t\t\t\t\t\tname="appearance-option"\n\t\t\t\t\t\t\t\t\t\tchecked={appearance === \'flat\'}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setAppearance(\'flat\')}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Flat appearance</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="radio"\n\t\t\t\t\t\t\t\t\t\tname="appearance-option"\n\t\t\t\t\t\t\t\t\t\tchecked={appearance === \'raised\'}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setAppearance(\'raised\')}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Raised appearance</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\t\t\t\tchecked={isSelected}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setIsSelected(!isSelected)}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Selected</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t<Inline space="space.300" shouldWrap>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="radio"\n\t\t\t\t\t\t\t\t\t\tname="layout-option"\n\t\t\t\t\t\t\t\t\t\tchecked={layout === \'leading-column\'}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setLayout(\'leading-column\')}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Leading column layout</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="radio"\n\t\t\t\t\t\t\t\t\t\tname="layout-option"\n\t\t\t\t\t\t\t\t\t\tchecked={layout === \'header-leading\'}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setLayout(\'header-leading\')}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Header leading layout</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t<Inline space="space.200" shouldWrap>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\t\t\t\tchecked={withMedia}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setWithMedia(!withMedia)}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Media</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\t\t\t\tchecked={withAvatar}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setWithAvatar(!withAvatar)}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Avatar/Tile</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\t\t\t\tchecked={withHeader}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setWithHeader(!withHeader)}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Header</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\t\t\t\tchecked={withDescription}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setWithDescription(!withDescription)}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Description</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\t\t\t\tchecked={withBody}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setWithBody(!withBody)}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Body</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t\t<label>\n\t\t\t\t\t\t\t\t<Inline space="space.100" alignBlock="center">\n\t\t\t\t\t\t\t\t\t<input\n\t\t\t\t\t\t\t\t\t\ttype="checkbox"\n\t\t\t\t\t\t\t\t\t\tchecked={withFooter}\n\t\t\t\t\t\t\t\t\t\tonChange={() => setWithFooter(!withFooter)}\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t<Text>Footer</Text>\n\t\t\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t\t</label>\n\t\t\t\t\t\t</Inline>\n\t\t\t\t\t</Stack>\n\t\t\t\t</Box>\n\t\t\t\t<Card appearance={appearance} isSelected={isSelected}>\n\t\t\t\t\t{withMedia ? (\n\t\t\t\t\t\t<CardMedia>\n\t\t\t\t\t\t\t<Box xcss={styles.media}>\n\t\t\t\t\t\t\t\t<ImageIcon color={token(\'color.icon.discovery\')} label="Image placeholder" />\n\t\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t</CardMedia>\n\t\t\t\t\t) : null}\n\t\t\t\t\t<CardContent>\n\t\t\t\t\t\t{withAvatar && !leadingInHeader ? <CardLeading>{avatar}</CardLeading> : null}\n\t\t\t\t\t\t<CardPrimaryContent>\n\t\t\t\t\t\t\t{withHeader ? (\n\t\t\t\t\t\t\t\t<CardHeader leading={leadingInHeader ? avatar : undefined}>\n\t\t\t\t\t\t\t\t\t<Stack space="space.050">\n\t\t\t\t\t\t\t\t\t\t<CardTitle>Card title</CardTitle>\n\t\t\t\t\t\t\t\t\t\t{withDescription ? (\n\t\t\t\t\t\t\t\t\t\t\t<CardDescription>Card description text</CardDescription>\n\t\t\t\t\t\t\t\t\t\t) : null}\n\t\t\t\t\t\t\t\t\t</Stack>\n\t\t\t\t\t\t\t\t</CardHeader>\n\t\t\t\t\t\t\t) : null}\n\t\t\t\t\t\t\t{withBody ? (\n\t\t\t\t\t\t\t\t<CardBody>\n\t\t\t\t\t\t\t\t\t<Box xcss={styles.bodyContent}>\n\t\t\t\t\t\t\t\t\t\t<Text color="color.text.discovery">Card body</Text>\n\t\t\t\t\t\t\t\t\t</Box>\n\t\t\t\t\t\t\t\t</CardBody>\n\t\t\t\t\t\t\t) : null}\n\t\t\t\t\t\t\t{withFooter ? (\n\t\t\t\t\t\t\t\t<CardFooter>\n\t\t\t\t\t\t\t\t\t<Text color="color.text.subtle" size="small">\n\t\t\t\t\t\t\t\t\t\tFooter content slot\n\t\t\t\t\t\t\t\t\t</Text>\n\t\t\t\t\t\t\t\t</CardFooter>\n\t\t\t\t\t\t\t) : null}\n\t\t\t\t\t\t</CardPrimaryContent>\n\t\t\t\t\t</CardContent>\n\t\t\t\t</Card>\n\t\t\t</Stack>\n\t\t</Box>\n\t);\n};\nexport default PlaygroundExample;',
		],
		props: [
			{
				name: 'appearance',
				type: '"flat" | "raised"',
			},
			{
				name: 'children',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
			},
			{
				name: 'href',
				type: 'string',
				description: '',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: '',
			},
			{
				name: 'isSelected',
				type: 'boolean',
			},
			{
				name: 'onClick',
				type: '(event: MouseEvent<HTMLElement, globalThis.MouseEvent>) => void',
				description: '',
			},
			{
				name: 'target',
				type: '"_self" | "_blank" | "_parent" | "_top" | (string & {})',
				description: '',
			},
		],
	},
	{
		name: 'CharlieTable',
		package: '@atlassian/charlie-table',
		description:
			'A TanStack-powered table for dense product data. Use it when a table needs controlled state, sorting, resizing, column actions, selection, virtualization, or infinite loading.',
		status: 'general-availability',
		usageGuidelines: [
			'Use CharlieTable for dense product tables that need TanStack state, sorting, resizing, column actions, selection, virtualization, or infinite loading.',
			'Import CharlieTable and table-specific types from `@atlassian/charlie-table/compiled`; do not use the root package or `deprecated` entrypoints for new work.',
			'Define stable `columnDefs` and row data outside render or memoize them so TanStack table state does not reset unnecessarily.',
			'Provide `getRowId` when rows have durable IDs, especially for selection, expansion, reordering, and server-backed data.',
			'Use `tableCaption` for a visible table name, or `labels.table` when the table needs an aria-label without a visible caption.',
			'Use `enableColumnActions` for per-column sorting, moving, pinning, hiding, and clear-sort actions instead of the deprecated `columnActions` prop.',
			'Use `@atlassian/charlie-table/tanstack-helpers` for TanStack column helpers when typed column definitions need better inference.',
			'Use row and column virtualization only for large tables where render cost or scroll performance requires it.',
			'Use `enableRowSelection` for standard selectable rows; reserve experimental TanStack feature registration for existing patterns that already depend on it.',
		],
		contentGuidelines: [
			'Use column headers that name the data, such as "Owner" or "Due date", instead of instructions.',
			'Use internationalized labels from the consuming product that describe the action target, such as "Select all incidents" or "Resize column: Status".',
			'Use status bar content for compact totals, pagination, or selected-row summaries rather than explanatory prose.',
		],
		accessibilityGuidelines: [
			'Provide a concise table caption or accessible table label that describes the row set, not the page.',
			'Keep column headers short and unique so sort, resize, and column-action controls have clear labels.',
			'Use `labels` for internationalized accessibility and action copy when default sort, resize, select, expand, or load-more text would be ambiguous.',
			'Enable keyboard navigation only when the table is the primary data grid interaction; verify arrow-key movement and copy behavior in the host experience.',
			'Use CharlieTable props for sorting, selection, resizing, labels, and column actions instead of composing table internals manually.',
		],
		keywords: [
			'charlie-table',
			'table',
			'data-grid',
			'tanstack',
			'column-actions',
			'virtualization',
			'selection',
			'sorting',
			'resizing',
		],
		category: 'data display',
		examples: [
			"import { CharlieTable, TableState } from '@atlassian/charlie-table/compiled';\nimport { type ColumnDef } from '@atlassian/charlie-table/tanstack-helpers';\ntype Project = {\n\tkey: string;\n\tname: string;\n\towner: string;\n\tstatus: string;\n};\nconst columns: ColumnDef<Project>[] = [\n\t{\n\t\taccessorKey: 'key',\n\t\theader: 'Key',\n\t\tcell: ({ row }) => row.original.key,\n\t},\n\t{\n\t\taccessorKey: 'name',\n\t\theader: 'Name',\n\t\tenableSorting: true,\n\t\tcell: ({ row }) => row.original.name,\n\t},\n\t{\n\t\taccessorKey: 'owner',\n\t\theader: 'Owner',\n\t\tcell: ({ row }) => row.original.owner,\n\t},\n\t{\n\t\taccessorKey: 'status',\n\t\theader: 'Status',\n\t\tenableSorting: true,\n\t\tcell: ({ row }) => row.original.status,\n\t},\n];\nconst data: Project[] = [\n\t{ key: 'PLAT-1', name: 'Table migration', owner: 'Mina', status: 'On track' },\n\t{ key: 'PLAT-2', name: 'Access review', owner: 'Ravi', status: 'At risk' },\n\t{ key: 'PLAT-3', name: 'Rollout plan', owner: 'Casey', status: 'Done' },\n];\nexport default function BasicCompiledTable(): React.JSX.Element {\n\treturn (\n\t\t<CharlieTable\n\t\t\tcolumnDefs={columns}\n\t\t\tdata={data}\n\t\t\tgetRowId={(row) => row.key}\n\t\t\ttableCaption=\"Project status\"\n\t\t\ttableState={TableState.loaded}\n\t\t/>\n\t);\n}",
			"import { CharlieTable, TableState } from '@atlassian/charlie-table/compiled';\nimport { type ColumnDef } from '@atlassian/charlie-table/tanstack-helpers';\ntype Incident = {\n\tid: string;\n\tservice: string;\n\tpriority: string;\n\towner: string;\n};\nconst columns: ColumnDef<Incident>[] = [\n\t{ accessorKey: 'service', header: 'Service', cell: ({ row }) => row.original.service },\n\t{ accessorKey: 'priority', header: 'Priority', cell: ({ row }) => row.original.priority },\n\t{ accessorKey: 'owner', header: 'Owner', cell: ({ row }) => row.original.owner },\n];\nconst data: Incident[] = [\n\t{ id: 'INC-1', service: 'Billing', priority: 'P2', owner: 'Asha' },\n\t{ id: 'INC-2', service: 'Search', priority: 'P1', owner: 'Noah' },\n];\nexport default function RowSelectionTable(): React.JSX.Element {\n\treturn (\n\t\t<CharlieTable\n\t\t\tcolumnDefs={columns}\n\t\t\tdata={data}\n\t\t\tenableRowSelection\n\t\t\tgetRowId={(row) => row.id}\n\t\t\tlabels={{\n\t\t\t\tselectAllRows: 'Select all incidents',\n\t\t\t\tselectRow: 'Select incident',\n\t\t\t}}\n\t\t\ttableCaption=\"Incident owners\"\n\t\t\ttableState={TableState.loaded}\n\t\t/>\n\t);\n}",
		],
		props: [
			{
				name: '_features',
				type: 'TableFeature<unknown>[]',
				description:
					"Optional TanStack table features to register.\nUse this to opt-in to features like cell selection without bundling them by default.\n\n@example\nimport { cellSelectionFeature } from '@atlassian/charlie-table/cell-selection';\n<CharlieTable _features={[cellSelectionFeature]} />",
			},
			{
				name: 'autoResetExpanded',
				type: 'boolean',
				description:
					'An optional prop that will prevent a tanstack table from resetting the expanded state when the data changes; applicable when\na table with expandable rows lazy loads additional data',
			},
			{
				name: 'columnDefs',
				type: 'ColumnDef<T, any>[]',
			},
			{
				name: 'columnResizeMode',
				type: '"onChange" | "onEnd" | "onChangeEnd"',
				description:
					'Determines when column sizing state is updated during resize:\n- onChange: Updates state on every pixel during resize (default, existing behavior)\n- (WIP) onEnd: Only updates state once when resize is complete (only triggers onColumnSizingChange once per resize operation)\n- onChangeEnd: Updates state on every pixel during resize (smooth visual) but only triggers onColumnSizingChange once when resize is complete\n@link [API Docs](https://tanstack.com/table/latest/docs/framework/react/examples/column-sizing)',
				defaultValue: '"onChange"',
			},
			{
				name: 'columnVirtualizerOptions',
				type: 'PartialKeys<VirtualizerOptions<HTMLDivElement, Element>, "observeElementRect" | "observeElementOffset" | "scrollToFn"> | (({ table, }: { ...; }) => PartialKeys<...>)',
			},
			{
				name: 'componentPropOverrides',
				type: '{ row?: ({ row }: { row: Row<T>; }) => BoxProps<"tr">; }',
				description: 'Optional component prop overrides for internal table components.',
			},
			{
				name: 'components',
				type: '{ Table?: CharlieTableTableComponent; RowCell?: CharlieTableRowCellComponent; }',
				description:
					"Optional component overrides. Custom `Table` / `RowCell` implementations should spread the\nsame props as the compiled defaults so sizing CSS variables, pinning, and a11y keep working.\nNo `forwardRef` wrapper is needed — the table ref is delivered via the `tableRef` prop.\n\n@example\n```tsx\nimport CharlieTable from '@atlassian/charlie-table/compiled';\nimport { RowCell, Table } from '@atlassian/charlie-table/components';\n\n// No forwardRef needed — tableRef flows through the spread.\nconst MyTable = (props) => (\n  <Table {...props} xcss={cx(props.xcss, myTableStyles)} />\n);\n\nconst MyRowCell = (props) => (\n  <RowCell {...props} xcss={cx(props.xcss, myRowCellStyles)} />\n);\n\n<CharlieTable components={{ Table: MyTable, RowCell: MyRowCell }} ... />\n```",
			},
			{
				name: 'data',
				type: 'T[]',
			},
			{
				name: 'defaultColumn',
				type: 'Partial<ColumnDefBase<T, unknown> & StringHeaderIdentifier> | Partial<ColumnDefBase<T, unknown> & IdIdentifier<T, unknown>> | ... 5 more ... | Partial<...>',
				description:
					'Default column options to use for all column defs supplied to the table.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#defaultcolumn)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/tables)',
			},
			{
				name: 'emptyTableView',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'emptyTableView is used to display a loading message when data is empty and tableState === TableState.loaded',
			},
			{
				name: 'enableCellSelection',
				type: 'boolean | CellSelectionMode | ((cell: Cell<T, unknown>) => boolean | CellSelectionMode)',
				description:
					"Controls whether cell selection is enabled and what mode to use.\n- `false`: disables selection for all cells\n- `true`: enables selection with the default column mode\n- `'column'`: selects all cells in the same column when a cell is clicked\n- `'row'`: selects all cells in the same row when a cell is clicked\n- `'cell'`: selects only the clicked cell\n- `(cell) => ...`: per-cell control returning any of the above values\nRequires `cellSelectionFeature` to be passed via `_features`.",
				defaultValue: "'column'",
			},
			{
				name: 'enableColumnActions',
				type: 'boolean | ColumnActionsConfig | ((column: Column<T, unknown>) => boolean | ColumnActionsConfig)',
				description:
					"Enables/Disables and configures the column actions menu.\n\nSupports multiple formats:\n- `boolean`: Enable/disable column actions for all columns with default configuration\n- `ColumnActionsConfig`: Enable column actions for all columns with custom configuration\n- `(column) => boolean`: Conditionally enable/disable column actions per column with default configuration\n- `(column) => ColumnActionsConfig`: Conditionally configure column actions per column\n- `(column) => boolean | ColumnActionsConfig`: Conditionally enable/disable or configure per column\n\n@example\n// Enable column actions for all columns with default configuration\nenableColumnActions={true}\n\n@example\n// Disable column actions for all columns\nenableColumnActions={false}\n\n@example\n// Enable column actions with custom configuration for all columns\nenableColumnActions={{ pinToLeft: true, hiding: true, moveToFront: false }}\n\n@example\n// Conditionally enable column actions for specific columns\nenableColumnActions={(column) => column.id !== 'readOnlyColumn'}\n\n@example\n// Conditionally configure column actions per column\nenableColumnActions={(column) => {\n  if (column.id === 'name') return { pinToLeft: true, hiding: false };\n  if (column.id === 'status') return true;\n  return false;\n}}",
			},
			{
				name: 'enableColumnReorder',
				type: 'boolean',
				description: 'Determine if columns can be reordered via pragmatic drag + drop.',
			},
			{
				name: 'enableColumnVirtualization',
				type: 'boolean',
				description: 'Enables Column Virtualization for the table.\n@experimental',
			},
			{
				name: 'enableKeyboardNavigation',
				type: 'boolean',
				description:
					'Allows for tables to use keyboard arrow\nkeys (up, down, left, right) or tabbing to navigate the table.\n\nThe hook also includes meta + c to copy the content. Since the\ntable is not ADF, this only copies text content and not the\nfull experience like images / status lozenge.',
				defaultValue: 'false',
			},
			{
				name: 'enableMultiRowSelection',
				type: 'boolean | ((row: Row<T>) => boolean)',
				description:
					"- Enables/disables multiple row selection for all rows in the table OR\n- A function that given a row, returns whether to enable/disable multiple row selection for that row's children/grandchildren\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablemultirowselection)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)",
			},
			{
				name: 'enableResizing',
				type: 'boolean',
				description: 'Determine if columns can be resized via pragmatic drag + drop',
				defaultValue: 'false',
			},
			{
				name: 'enableRowReorder',
				type: 'boolean',
				description:
					'Enables/disables row reordering via pragmatic drag + drop.\nWhen true, onDraggingRowEnd callback is required.\n@experimental',
				defaultValue: 'false',
			},
			{
				name: 'enableRowSelection',
				type: 'boolean | ((row: Row<T>) => boolean)',
				description:
					'- Enables/disables row selection for all rows in the table OR\n- A function that given a row, returns whether to enable/disable row selection for that row\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablerowselection)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)',
			},
			{
				name: 'enableRowVirtualization',
				type: 'boolean',
				description:
					'Enables Row Virtualization for the table.\nNote: This disables the aggressive table body memoization unless resizing\n@experimental',
			},
			{
				name: 'enableServerSideGrouping',
				type: 'boolean',
			},
			{
				name: 'enableSortingRemoval',
				type: 'boolean',
				description:
					"Enables/Disables the ability to remove sorting for the table.\n- If `true` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'none' -> ...\n- If `false` then changing sort order will circle like: 'none' -> 'desc' -> 'asc' -> 'desc' -> 'asc' -> ...\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#enablesortingremoval)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)",
				defaultValue: 'false',
			},
			{
				name: 'enableSubRowSelection',
				type: 'boolean | ((row: Row<T>) => boolean)',
				description:
					'Enables/disables automatic sub-row selection when a parent row is selected, or a function that enables/disables automatic sub-row selection for each row.\n(Use in combination with expanding or grouping features)\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#enablesubrowselection)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)',
			},
			{
				name: 'errorView',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'errorView is used to display an error message when tableState === TableState.error',
			},
			{
				name: 'getRowCanExpand',
				type: '(row: Row<T>) => boolean',
				description:
					'If provided, allows you to override the default behavior of determining whether a row can be expanded.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#getrowcanexpand)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/expanding)',
			},
			{
				name: 'getRowId',
				type: '(originalRow: T, index: number, parent?: Row<T>) => string',
				description:
					"This optional function is used to derive a unique ID for any given row. If not provided the rows index is used (nested rows join together with `.` using their grandparents' index eg. `index.index.index`). If you need to identify individual rows that are originating from any server-side operations, it's suggested you use this function to return an ID that makes sense regardless of network IO/ambiguity eg. a userId, taskId, database ID field, etc.\n@example getRowId: row => row.userId\n@link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getrowid)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/tables)",
			},
			{
				name: 'getSubRows',
				type: '(originalRow: T, index: number) => T[]',
				description:
					'This optional function is used to access the sub rows for any given row. If you are using nested rows, you will need to use this function to return the sub rows object (or undefined) from the row.\n@example getSubRows: row => row.subRows\n@link [API Docs](https://tanstack.com/table/v8/docs/api/core/table#getsubrows)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/tables)',
			},
			{
				name: 'groupedColumnMode',
				type: 'false | "reorder" | "remove"',
				description:
					'Grouping columns are automatically reordered by default to the start of the columns list. If you would rather remove them or leave them as-is, set the appropriate mode here.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#groupedcolumnmode)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)',
			},
			{
				name: 'hasNext',
				type: 'boolean',
				description:
					'hasNext is used for infinite scrolling. This boolean should be true if there are more rows to load.',
			},
			{
				name: 'headerCellXcss',
				type: 'false | (XCSSValue<"columns" | "flex" | "grid" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | "accentColor" | "alignContent" | "alignItems" | ... 486 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'An optional parameter used to override XCSS styles for table header (<th>) cells.',
			},
			{
				name: 'hidePaginationEndIndicator',
				type: 'boolean',
				description:
					'Hides the HR divider in the footer of the table that indicates end of pagination',
			},
			{
				name: 'initialState',
				type: '{ columnVisibility?: VisibilityState; columnOrder?: ColumnOrderState; columnPinning?: ColumnPinningState; rowPinning?: RowPinningState; ... 9 more ...; selectedCell?: { ...; }; }',
				description:
					'Not all of tanstack State is fully implemented here and it may not do anything until implemented',
			},
			{
				name: 'labels',
				type: '{ table?: string; loadMore?: string; loadMoreLabel?: string; sortLabel?: string | ((header: Header<T, unknown>) => string); selectAllRows?: string; selectRow?: string; expandRow?: string | ((row: Row<...>) => string); ... 15 more ...; loadingMore?: string; }',
				defaultValue: 'defaultLabels',
			},
			{
				name: 'manualExpanding',
				type: 'boolean',
				description:
					'Enables manual row expansion. If this is set to `true`, `getExpandedRowModel` will not be used to expand rows and you would be expected to perform the expansion in your own data model. This is useful if you are doing server-side expansion.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#manualexpanding)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/expanding)',
			},
			{
				name: 'manualFiltering',
				type: 'boolean',
				description:
					'Disables the `getFilteredRowModel` from being used to filter data. This may be useful if your table needs to dynamically support both client-side and server-side filtering.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-filtering#manualfiltering)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/column-filtering)',
			},
			{
				name: 'manualGrouping',
				type: 'boolean',
				description:
					'Enables manual grouping. If this option is set to `true`, the table will not automatically group rows using `getGroupedRowModel()` and instead will expect you to manually group the rows before passing them to the table. This is useful if you are doing server-side grouping and aggregation.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#manualgrouping)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)',
			},
			{
				name: 'manualPagination',
				type: 'boolean',
				description:
					'Enables manual pagination. If this option is set to `true`, the table will not automatically paginate rows using `getPaginationRowModel()` and instead will expect you to manually paginate the rows before passing them to the table. This is useful if you are doing server-side pagination and aggregation.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/pagination#manualpagination)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/pagination)',
				defaultValue: 'true',
			},
			{
				name: 'manualSorting',
				type: 'boolean',
				description: 'Defaults to true. Disable if you prefer tanstack to sort for you',
				defaultValue: 'true',
			},
			{
				name: 'onColumnOrderChange',
				type: '(updater: Updater<ColumnOrderState>, context?: ColumnReorderContext) => void',
				description:
					"Callback fired when the column order changes due to a user-initiated reorder (drag or menu action).\nThe optional `context` parameter indicates how the reorder was triggered, which can be used\nfor analytics without coupling the table to any specific analytics implementation.\n\n@example\nonColumnOrderChange={(order, context) => {\n  setColumnOrder(order);\n  if (context) {\n    analytics.track('column_reordered', { trigger: context.trigger });\n  }\n}}",
			},
			{
				name: 'onColumnPinningChange',
				type: '(updaterOrValue: Updater<ColumnPinningState>) => void',
				description:
					'If provided, this function will be called with an `updaterFn` when `state.columnPinning` changes. This overrides the default internal state management, so you will also need to supply `state.columnPinning` from your own managed state.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-pinning#oncolumnpinningchange)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/oncolumnpinningchange)',
			},
			{
				name: 'onColumnSizingChange',
				type: '(updaterOrValue: Updater<ColumnSizingState>) => void',
				description:
					'If provided, this function will be called with an `updaterFn` when `state.columnSizing` changes. This overrides the default internal state management, so you will also need to supply `state.columnSizing` from your own managed state.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-sizing#oncolumnsizingchange)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/column-sizing)',
			},
			{
				name: 'onColumnVisibilityChange',
				type: '(updaterOrValue: Updater<VisibilityState>) => void',
				description:
					'If provided, this function will be called with an `updaterFn` when `state.columnVisibility` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/column-visibility#oncolumnvisibilitychange)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/column-visibility)',
			},
			{
				name: 'onDraggingRowEnd',
				type: '({ table, draggingRow, destinationRow, }: { table: Table<T>; draggingRow: Row<T>; destinationRow: Row<T>; }) => void',
				description:
					'A callback that is called when a row is dragged and dropped.\nRequired when enableRowReorder is true\n@param table the table object\n@param draggingRow the row that is being dragged\n@param destinationRow the row that the dragging row is being dropped on\n@returns void',
			},
			{
				name: 'onExpandedChange',
				type: '(updaterOrValue: Updater<ExpandedState>) => void',
				description:
					'This function is called when the `expanded` table state changes. If a function is provided, you will be responsible for managing this state on your own. To pass the managed state back to the table, use the `tableOptions.state.expanded` option.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/expanding#onexpandedchange)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/expanding)',
			},
			{
				name: 'onGroupingChange',
				type: '(updaterOrValue: Updater<GroupingState>) => void',
				description:
					'If this function is provided, it will be called when the grouping state changes and you will be expected to manage the state yourself. You can pass the managed state back to the table via the `tableOptions.state.grouping` option.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/grouping#ongroupingchange)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/grouping)',
			},
			{
				name: 'onLoadNext',
				type: '() => void',
				description:
					'onLoadNext is used for infinite scrolling.\nThis function should be called when the table triggers a "load more state". Such as when the user scrolls to the bottom of the table.\n@returns void',
			},
			{
				name: 'onRowClick',
				type: '(row: Row<T>) => void',
			},
			{
				name: 'onRowSelectionChange',
				type: '(updaterOrValue: Updater<RowSelectionState>) => void',
				description:
					'If provided, this function will be called with an `updaterFn` when `state.rowSelection` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/row-selection#onrowselectionchange)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/row-selection)',
			},
			{
				name: 'onSelectedCellChange',
				type: '(updater: { rowId: string; columnId: string; groupId?: string; } | ((old: { rowId: string; columnId: string; groupId?: string; }) => { rowId: string; columnId: string; groupId?: string; })) => void',
				description:
					'Callback fired when the selected cell state changes.\n@param updater - Function or value to update the selected cell state',
			},
			{
				name: 'onSortingChange',
				type: '(updaterOrValue: Updater<SortingState>) => void',
				description:
					'If provided, this function will be called with an `updaterFn` when `state.sorting` changes. This overrides the default internal state management, so you will need to persist the state change either fully or partially outside of the table.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#onsortingchange)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)',
			},
			{
				name: 'refs',
				type: '{ tableRef?: React.RefObject<HTMLTableElement>; tableBodyRef?: React.RefObject<HTMLTableSectionElement>; tableContainerRef?: React.RefObject<...>; rowVirtualizerRef?: React.MutableRefObject<...>; internalTableRef?: React.RefObject<...>; selectedCellRef?: React.RefObject<...>; }',
				description: 'Contains the refs for certain table elements.',
			},
			{
				name: 'renderChildComponent',
				type: '({ rowData, tableState, }: { rowData: Row<T>; tableState: TableState; }) => React.ReactNode',
				description:
					'renderChildComponent is a function that allows for sub-rows to be rendered.\nThis is useful for rendering nested rows or rows that are not directly related to the parent row. (IE grouping)',
			},
			{
				name: 'renderOptions',
				type: '{ groupingRow?: (rowData: T, state: Partial<TableState>) => React.ReactNode; bodyCellBackground?: ({ cell, state, isSelected, }: { cell: Cell<T, unknown>; state: Partial<TableState>; isSelected: false | ... 2 more ... | "row"; }) => BodyCellBackground; groupedRowBackground?: ({ rowData, state, }: { ...; }) => BodyCe...',
			},
			{
				name: 'responsiveColumnSizing',
				type: '(column: Column<T, unknown>) => boolean',
				description:
					'Optional function that allows the consumer to override the default responsive column sizing.\nThis is useful for a few situations such as:\n- Making the last non-pinned column grow instead of the pinned columns (like an action column)\n- Making all columns the same size (similar to how charlieTable used to behave )\n\nWhen placed on a column on the left side of the table, column resizing will have styling regressions due to how flexboxes work.\nWe recommend placing this on a column at the end of the non-pinned columns.\n@param column the Tanstack column object\n@returns true if the column should be responsive, false if it should not be responsive',
				defaultValue: 'undefined',
			},
			{
				name: 'rowCellXcss',
				type: 'false | (XCSSValue<"columns" | "flex" | "grid" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | "accentColor" | "alignContent" | "alignItems" | ... 486 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'An optional parameter used to override XCSS styles for table data (<td>) cells.',
			},
			{
				name: 'rowSpacing',
				type: '"compact" | "default"',
				defaultValue: '"default"',
			},
			{
				name: 'rowVirtualizerOptions',
				type: 'PartialKeys<VirtualizerOptions<HTMLDivElement, Element>, "observeElementRect" | "observeElementOffset" | "scrollToFn"> | (({ table, }: { ...; }) => PartialKeys<...>)',
			},
			{
				name: 'selectedCell',
				type: '{ rowId: string; columnId: string; groupId?: string; }',
				description:
					'The currently selected cell state (rowId and columnId).\nWhen set, the specified cell will be shown with a bold selected background,\nand its entire row will receive a lighter selected background.\nRequires `cellSelectionFeature` to be passed via `_features`.',
			},
			{
				name: 'sortDescFirst',
				type: 'boolean',
				description:
					'If `true`, all sorts will default to descending as their first toggle state.\n@link [API Docs](https://tanstack.com/table/v8/docs/api/features/sorting#sortdescfirst)\n@link [Guide](https://tanstack.com/table/v8/docs/guide/sorting)',
			},
			{
				name: 'state',
				type: '{ columnVisibility?: VisibilityState; columnOrder?: ColumnOrderState; columnPinning?: ColumnPinningState; rowPinning?: RowPinningState; ... 9 more ...; selectedCell?: { ...; }; }',
				description:
					'Not all of tanstack State is fully implemented here and it may not do anything until implemented',
			},
			{
				name: 'statusBar',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'statusBar is rendered in a bar at the bottom of the table (outside the scroll area).\nUse for row count ("Showing 8 of 8 rows"), pagination controls, actions, or other summary content.\nRenders below the scrollable table and does not scroll horizontally.\n\n**Important:** The status bar is only shown when the `charlie-table-shape-refresh` feature flag\nis enabled. If the flag is disabled, the status bar is a no-op (nothing is rendered).',
			},
			{
				name: 'tableCaption',
				type: 'string | (() => React.ReactNode)',
				description:
					'Optional caption for the table.\nIf a function is provided, the <caption> element will not be shown and the consumer is responsible for rendering the caption.',
			},
			{
				name: 'tableState',
				type: '"LOADED" | "LOADING" | "ERROR"',
				description:
					'tableState is used to set the current state of the table.\nIt can take on values as defined in the TableState enum.',
				defaultValue: '"LOADED"',
			},
			{
				name: 'tableType',
				type: '"INVENTORY" | "INPUT"',
				defaultValue: '"INPUT"',
			},
			{
				name: 'tableWrapperXcss',
				type: 'false | (XCSSValue<"columns" | "flex" | "grid" | "fill" | "stroke" | "all" | "bottom" | "left" | "right" | "top" | "clip" | "overlay" | "accentColor" | "alignContent" | "alignItems" | ... 485 more ... | "glyphOrientationVertical", DesignTokenStyles, ""> & ... 4 more ... & { ...; })',
				description:
					'An optional parameter used to override XCSS styles for the table wrapper (<div>) element.',
			},
		],
	},
	{
		name: 'ConfirmationDialog',
		package: '@atlassian/confirmation-dialog',
		description:
			'An internal Platform Labs composite primitive for rendering confirmation dialogs using Atlassian Design System primitives.',
		status: 'early-access',
		usageGuidelines: [
			'Use for confirmation flows where a user must explicitly confirm or cancel an action before continuing.',
			'Use for reusable internal confirmation flows that benefit from consistent ADS modal composition without adding a public Design System component.',
			'Keep product-specific orchestration outside the primitive, including analytics, feature gates, mutation handling, error handling, and close behavior.',
			'Do not use as a general modal replacement; use ModalDialog directly for custom modal layouts or flows that need product-specific structure.',
			'Do not treat this package as part of the public Atlassian Design System surface.',
		],
		contentGuidelines: [
			'Use a clear title that describes the action being confirmed.',
			'Use concise body copy that explains the consequence of confirming the action.',
			'Use specific action labels such as "Archive" or "Delete" rather than generic labels such as "OK".',
			'Provide all visible strings from the consuming product as react-intl MessageDescriptors.',
			'Keep cancel copy simple and predictable, typically "Cancel" unless the product context requires more specific wording.',
		],
		accessibilityGuidelines: [
			'Render under the consuming product’s react-intl provider so all visible text is localized.',
			'Ensure confirm and cancel labels clearly communicate the available actions.',
			'Prefer concise descriptions so screen reader users can understand the consequence of the action quickly.',
			'Avoid relying on color or warning appearance alone to communicate destructive or important consequences.',
		],
		keywords: ['confirmation', 'dialog', 'modal', 'platform-labs', 'internal', 'confirm', 'cancel'],
		category: 'overlay',
		examples: [
			"import React, { useCallback, useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport Button from '@atlaskit/button/new';\nimport ConfirmationDialog from '../src/confirmation-dialog';\nconst messages = {\n\ttitle: {\n\t\tid: 'confirmation-dialog-example.title',\n\t\tdefaultMessage: 'Archive page?',\n\t},\n\tdescription: {\n\t\tid: 'confirmation-dialog-example.description',\n\t\tdefaultMessage:\n\t\t\t'Archiving this page removes it from the page tree. You can restore it later from archived pages.',\n\t},\n\tconfirmButtonText: {\n\t\tid: 'confirmation-dialog-example.confirm-button',\n\t\tdefaultMessage: 'Archive',\n\t},\n\tcancelButtonText: {\n\t\tid: 'confirmation-dialog-example.cancel-button',\n\t\tdefaultMessage: 'Cancel',\n\t},\n};\nconst BasicExample = (): React.JSX.Element => {\n\tconst [isOpen, setIsOpen] = useState(false);\n\tconst close = useCallback(() => setIsOpen(false), []);\n\tconst open = useCallback(() => setIsOpen(true), []);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<Button appearance=\"primary\" onClick={open}>\n\t\t\t\tArchive page\n\t\t\t</Button>\n\t\t\t{isOpen && (\n\t\t\t\t<ConfirmationDialog\n\t\t\t\t\tisOpen={isOpen}\n\t\t\t\t\ttitle={messages.title}\n\t\t\t\t\tdescription={messages.description}\n\t\t\t\t\tconfirmButtonText={messages.confirmButtonText}\n\t\t\t\t\tcancelButtonText={messages.cancelButtonText}\n\t\t\t\t\tonClose={close}\n\t\t\t\t\tonConfirm={close}\n\t\t\t\t/>\n\t\t\t)}\n\t\t</IntlProvider>\n\t);\n};\nexport default BasicExample;",
		],
		props: [
			{
				name: 'cancelButtonText',
				type: 'MessageDescriptor',
				isRequired: true,
			},
			{
				name: 'confirmButtonAppearance',
				type: '"default" | "danger" | "primary" | "rovo" | "subtle" | "warning" | "discovery"',
			},
			{
				name: 'confirmButtonText',
				type: 'MessageDescriptor',
				isRequired: true,
			},
			{
				name: 'description',
				type: 'MessageDescriptor',
				isRequired: true,
			},
			{
				name: 'descriptionValues',
				type: '{ [x: string]: React.ReactNode | ((chunks: React.ReactNode) => React.ReactNode); }',
			},
			{
				name: 'isConfirmButtonLoading',
				type: 'boolean',
				defaultValue: 'false',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				isRequired: true,
			},
			{
				name: 'onCancel',
				type: '() => void',
			},
			{
				name: 'onClose',
				type: '() => void',
				isRequired: true,
			},
			{
				name: 'onConfirm',
				type: '() => void | Promise<void>',
				isRequired: true,
			},
			{
				name: 'title',
				type: 'MessageDescriptor',
				isRequired: true,
			},
			{
				name: 'titleAppearance',
				type: '"danger" | "warning"',
			},
			{
				name: 'width',
				type: 'string | number',
				defaultValue: '"medium"',
			},
		],
	},
	{
		name: 'CustomizationModal',
		package: '@atlassian/customization-modal',
		description: 'A modal used to hide, show and re-order navigation items within the sidebar.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the standard ModalHeader, ModalBody, and ModalFooter components from the Atlassian Design System.',
			'Include a text block with a title and description for each list section.',
			'Use the specific draggable menu item component provided for the customization modal.',
			'Ensure the modal has a maximum width of 600px; on smaller screens, use 100% width with a 60px margin.',
			'The modal height should adjust to the content, with the header and footer becoming sticky when vertical scrolling is required.',
			'A description must be included to clarify that changes only affect the individual user.',
			'Draggable items must include a drag indicator.',
			'Items can only be dragged within their respective sections.',
			'Do not use the customization modal for advanced settings like permissions or workflow configuration.',
			'Do not use component parts that are not part of the customization modal component.',
			'Do not add clutter or unnecessary items to the draggable menu items.',
			'Use when the intent is to let individual users adjust their sidebar by hiding/showing items or reordering navigation.',
		],
		contentGuidelines: [
			'Use "your" in the title (e.g., "Customize your sidebar") to emphasize personal impact.',
			'Follow a strict heading hierarchy: H1 for the modal title, H2 for section headings (e.g., "Jira navigation").',
			'Descriptions for headings should be complete sentences ending with a period.',
			'Use the format: "The following [ITEMS] are available [PREPOSITION] [CONTEXT]."',
			'Bold UI elements when they are referenced in descriptions (e.g., "**More** menu").',
		],
		accessibilityGuidelines: [
			'The close button must have the ARIA label "Close" and support the Esc key.',
			'Checkboxes must have descriptive ARIA labels like "Hide item from sidebar" or "Show item in sidebar".',
			'The actions menu (3-dot menu) must have a "More actions" tooltip and ARIA label.',
			'First focus must land on the modal itself when opened.',
			'Keyboard navigation should skip disabled menu items and move between checkboxes and action menus sequentially.',
			'Provide a blue drag zone indicator for visual feedback during reordering.',
		],
		keywords: ['navigation', 'sidebar', 'customize', 'reorder', 'drag and drop', 'settings'],
		category: 'navigation',
		examples: [
			"import React, { Fragment, useCallback, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport {\n\ttype CustomizableMenuItemData,\n\tCustomizationModal,\n\tCustomizationModalTransition,\n} from '../src';\nimport { simpleMockAppItems, simpleMockProductItems } from '../src/mocks/mock-data';\nimport {\n\tgetCustomizationItemTextMock,\n\tgetModalTextMock,\n} from '../src/mocks/mock-get-text-functions';\nconst RenderComponent = ({ menuId }: any) => <div>Item {menuId}</div>;\ntype ModalSection = {\n\tappItems: CustomizableMenuItemData[];\n\tproductItems: CustomizableMenuItemData[];\n};\nexport default function CustomizationModalExample(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState<boolean>(true);\n\tconst [modalSections, setModalSections] = useState<ModalSection>({\n\t\tproductItems: simpleMockProductItems,\n\t\tappItems: simpleMockAppItems,\n\t});\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\tconst handleItemsUpdate = useCallback(\n\t\t(\n\t\t\tupdatedProductItemsData: CustomizableMenuItemData[],\n\t\t\tupdatedAppItemsData: CustomizableMenuItemData[],\n\t\t) => {\n\t\t\tsetModalSections({ productItems: updatedProductItemsData, appItems: updatedAppItemsData });\n\t\t\tcloseModal();\n\t\t},\n\t\t[setModalSections, closeModal],\n\t);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup=\"dialog\" appearance=\"primary\" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<CustomizationModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<CustomizationModal\n\t\t\t\t\t\ttestId=\"example-customization-modal\"\n\t\t\t\t\t\t/**\n\t\t\t\t\t\t * @private\n\t\t\t\t\t\t * @deprecated: getModalText and getCustomizationItemText are no longer needed\n\t\t\t\t\t\t * when the navx-4425-i18n-customization-modal feature flag is enabled.\n\t\t\t\t\t\t * See example 04 for usage without these props.\n\t\t\t\t\t\t */\n\t\t\t\t\t\tgetModalText={getModalTextMock}\n\t\t\t\t\t\tonSave={handleItemsUpdate}\n\t\t\t\t\t\tproductItemsData={modalSections.productItems}\n\t\t\t\t\t\tgetCustomizationItemText={getCustomizationItemTextMock}\n\t\t\t\t\t\tcustomizationItemComponent={RenderComponent}\n\t\t\t\t\t\tonClose={closeModal}\n\t\t\t\t\t\tappItemsData={modalSections.appItems}\n\t\t\t\t\t/>\n\t\t\t\t)}\n\t\t\t</CustomizationModalTransition>\n\t\t\t{modalSections.productItems.map((item: any) => (\n\t\t\t\t<div key={item.menuId}>{item.menuId}</div>\n\t\t\t))}\n\t\t\t{modalSections.appItems.map((item: any) => (\n\t\t\t\t<div key={item.menuId}>{item.menuId}</div>\n\t\t\t))}\n\t\t</Fragment>\n\t);\n}",
			"/**\n * This example demonstrates the customization modal with built-in react-intl translations.\n * When the `navx-4425-i18n-customization-modal` feature flag is enabled, the modal sources\n * its own translated strings internally via react-intl — no `getModalText` or\n * `getCustomizationItemText` props are required.\n *\n * The only requirement is that an `IntlProvider` is present as an ancestor (which is already\n * the case in all Atlassian product apps).\n *\n * When navx-4425-i18n-customization-modal is cleaned up, this example can be deleted.\n */\nimport React, { Fragment, useCallback, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport {\n\ttype CustomizableMenuItemData,\n\tCustomizationModal,\n\tCustomizationModalTransition,\n} from '../src';\nimport { simpleMockAppItems, simpleMockProductItems } from '../src/mocks/mock-data';\nconst RenderComponent = ({ menuId }: any) => <div>Item {menuId}</div>;\ntype ModalSection = {\n\tappItems: CustomizableMenuItemData[];\n\tproductItems: CustomizableMenuItemData[];\n};\nexport default function CustomizationModalI18nExample(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState<boolean>(true);\n\tconst [modalSections, setModalSections] = useState<ModalSection>({\n\t\tproductItems: simpleMockProductItems,\n\t\tappItems: simpleMockAppItems,\n\t});\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\tconst handleItemsUpdate = useCallback(\n\t\t(\n\t\t\tupdatedProductItemsData: CustomizableMenuItemData[],\n\t\t\tupdatedAppItemsData: CustomizableMenuItemData[],\n\t\t) => {\n\t\t\tsetModalSections({ productItems: updatedProductItemsData, appItems: updatedAppItemsData });\n\t\t\tcloseModal();\n\t\t},\n\t\t[setModalSections, closeModal],\n\t);\n\treturn (\n\t\t// IntlProvider is already present in all Atlassian product apps — shown here for completeness.\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup=\"dialog\" appearance=\"primary\" onClick={openModal}>\n\t\t\t\tOpen modal\n\t\t\t</Button>\n\t\t\t<CustomizationModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<CustomizationModal\n\t\t\t\t\t\ttestId=\"example-customization-modal-i18n\"\n\t\t\t\t\t\t// No getModalText or getCustomizationItemText needed when\n\t\t\t\t\t\t// navx-4425-i18n-customization-modal feature flag is enabled.\n\t\t\t\t\t\tonSave={handleItemsUpdate}\n\t\t\t\t\t\tproductItemsData={modalSections.productItems}\n\t\t\t\t\t\tcustomizationItemComponent={RenderComponent}\n\t\t\t\t\t\tonClose={closeModal}\n\t\t\t\t\t\tappItemsData={modalSections.appItems}\n\t\t\t\t\t/>\n\t\t\t\t)}\n\t\t\t</CustomizationModalTransition>\n\t\t\t{modalSections.productItems.map((item: any) => (\n\t\t\t\t<div key={item.menuId}>{item.menuId}</div>\n\t\t\t))}\n\t\t\t{modalSections.appItems.map((item: any) => (\n\t\t\t\t<div key={item.menuId}>{item.menuId}</div>\n\t\t\t))}\n\t\t</Fragment>\n\t);\n}",
			"/**\n * This example demonstrates the customization modal with built-in react-intl translations.\n * When the `navx-4425-i18n-customization-modal` feature flag is enabled, the modal sources\n * its own translated strings internally via react-intl — no `getModalText` or\n * `getCustomizationItemText` props are required.\n *\n * The only requirement is that an `IntlProvider` is present as an ancestor (which is already\n * the case in all Atlassian product apps).\n */\nimport React, { Fragment, useCallback, useState } from 'react';\nimport Button from '@atlaskit/button/new';\nimport {\n\ttype CustomizableMenuItemData,\n\tCustomizationModal,\n\tCustomizationModalTransition,\n} from '../src';\nimport { simpleMockAppItems, simpleMockProductItems } from '../src/mocks/mock-data';\ntype ModalSection = {\n\tappItems: CustomizableMenuItemData[];\n\tproductItems: CustomizableMenuItemData[];\n};\nexport default function ModalErrorExample(): React.JSX.Element {\n\tconst [isOpen, setIsOpen] = useState<boolean>(true);\n\tconst [modalSections, setModalSections] = useState<ModalSection>({\n\t\tproductItems: simpleMockProductItems,\n\t\tappItems: simpleMockAppItems,\n\t});\n\tconst openModal = useCallback(() => setIsOpen(true), []);\n\tconst closeModal = useCallback(() => setIsOpen(false), []);\n\tconst handleItemsUpdate = useCallback(\n\t\t(\n\t\t\tupdatedProductItemsData: CustomizableMenuItemData[],\n\t\t\tupdatedAppItemsData: CustomizableMenuItemData[],\n\t\t) => {\n\t\t\tsetModalSections({ productItems: updatedProductItemsData, appItems: updatedAppItemsData });\n\t\t\tcloseModal();\n\t\t},\n\t\t[setModalSections, closeModal],\n\t);\n\treturn (\n\t\t<Fragment>\n\t\t\t<Button aria-haspopup=\"dialog\" appearance=\"primary\" onClick={openModal}>\n\t\t\t\tOpen broken modal\n\t\t\t</Button>\n\t\t\t<CustomizationModalTransition>\n\t\t\t\t{isOpen && (\n\t\t\t\t\t<CustomizationModal\n\t\t\t\t\t\ttestId=\"example-customization-modal-i18n\"\n\t\t\t\t\t\t// No getModalText or getCustomizationItemText needed when\n\t\t\t\t\t\t// navx-4425-i18n-customization-modal feature flag is enabled.\n\t\t\t\t\t\tonSave={handleItemsUpdate}\n\t\t\t\t\t\tproductItemsData={modalSections.productItems}\n\t\t\t\t\t\tcustomizationItemComponent={BrokenRenderComponent}\n\t\t\t\t\t\tonClose={closeModal}\n\t\t\t\t\t\tappItemsData={modalSections.appItems}\n\t\t\t\t\t/>\n\t\t\t\t)}\n\t\t\t</CustomizationModalTransition>\n\t\t</Fragment>\n\t);\n}\nfunction BrokenRenderComponent(): React.JSX.Element {\n\tthrow new Error('Test error boundary');\n}",
		],
		props: [
			{
				name: 'appItemsData',
				type: 'CustomizableMenuItemData[]',
				description: 'The list of shortcuts that can be customized',
			},
			{
				name: 'appLabel',
				type: 'string',
				description:
					'The application name used in product navigation section labels (e.g. "Jira", "Confluence").\nUsed in strings like "{app} navigation" and "Customize {app} navigation".\nDefaults to "Product" when not provided.',
			},
			{
				name: 'customizationItemComponent',
				type: 'React.ComponentClass<CustomizableMenuItemData, any> | React.FunctionComponent<CustomizableMenuItemData>',
				isRequired: true,
			},
			{
				name: 'headingBody',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'isAnalyticsEnabled',
				type: 'boolean',
			},
			{
				name: 'onClose',
				type: '() => void',
				isRequired: true,
			},
			{
				name: 'onSave',
				type: '(updatedProductItemsData: CustomizableMenuItemData[], updatedAppItemsData: CustomizableMenuItemData[]) => void',
				isRequired: true,
			},
			{
				name: 'productItemsData',
				type: 'CustomizableMenuItemData[]',
				description: 'The list of nav-items that can be customized',
				isRequired: true,
			},
			{
				name: 'returnFocusRef',
				type: 'React.RefObject<HTMLElement>',
			},
		],
	},
	{
		name: 'Editor Plugin AI',
		package: '@atlassian/editor-plugin-ai',
		description: 'The AI plugin for @atlaskit/editor-core.',
		status: 'general-availability',
		usageGuidelines: [
			'Add `aiPlugin` to your editor preset to enable AI features.',
			'Provide `editorPluginAIOptions` to configure AI behavior, including opt-in status, prompt editors, and feedback handlers.',
		],
		keywords: ['editor', 'plugin', 'ai', 'atlassian-intelligence'],
		category: 'editor',
		examples: [
			"import type { EditorActions } from '@atlaskit/editor-core';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { useUniversalPreset } from '@atlaskit/editor-core/preset-universal';\nimport { usePreset } from '@atlaskit/editor-core/use-preset';\nimport type { EditorView } from '@atlaskit/editor-prosemirror/view';\nimport { createPromptEditor } from '@atlassian/editor-ai-injected-editors/prompt-editor';\nimport { aiPlugin } from '../src';\nimport {\n\tchangeToneToCasualWithOptions,\n\tchangeToneToEducationalWithOptions,\n\tchangeToneToEmpatheticWithOptions,\n\tchangeToneToNeutralWithOptions,\n\tchangeToneToProfessionalWithOptions,\n} from '../src/ui/prebuilt/config-items/prompts/change-tone/change-tone';\nimport {\n\tfixSpellingAndGrammarWithOptions,\n\timproveWritingWithOptions,\n} from '../src/ui/prebuilt/config-items/prompts/enhance/enhance';\nimport { freeGenerate } from '../src/ui/prebuilt/config-items/prompts/free-generate/free-generate';\nimport { makeShorterWithOptions } from '../src/ui/prebuilt/config-items/prompts/make-shorter/make-shorter';\nimport { suggestTitleWithOptions } from '../src/ui/prebuilt/config-items/prompts/suggest-title/suggest-title';\nimport { summarizeWritingWithOptions } from '../src/ui/prebuilt/config-items/prompts/summarize-writing/summarize-writing';\nimport { DevTools } from './utils/components/DevTools';\nimport { ExampleWrapper } from './utils/components/ExampleWrapper';\nimport type { ExampleContext } from './utils/components/ExampleWrapper';\nimport { useIsExampleWrapperRovoEnabled } from './utils/components/hooks/useIsExampleWrapperRovoEnabled';\nimport { handleDevFeedbackSubmission } from './utils/feedbackCollector';\nimport { getDevFetchCustomHeaders } from './utils/getDevFetchCustomHeaders';\nimport { useOptInNag } from './utils/use-opt-in-nag';\nfunction BasicEditor({ appearance, optInStatus }: ExampleContext) {\n\tconst [isRovoEnabled] = useIsExampleWrapperRovoEnabled();\n\tconst { triggerOptInFlow, optInNagUi } = useOptInNag();\n\tconst editorPluginAIOptions = {\n\t\taiGlobalOptIn: { status: optInStatus, triggerOptInFlow },\n\t\tbaseGenerate: freeGenerate(),\n\t\tconfigItemWithOptions: [\n\t\t\tmakeShorterWithOptions(),\n\t\t\tsuggestTitleWithOptions(),\n\t\t\tsummarizeWritingWithOptions(),\n\t\t\timproveWritingWithOptions(),\n\t\t\tfixSpellingAndGrammarWithOptions(),\n\t\t\tchangeToneToCasualWithOptions(),\n\t\t\tchangeToneToEducationalWithOptions(),\n\t\t\tchangeToneToEmpatheticWithOptions(),\n\t\t\tchangeToneToNeutralWithOptions(),\n\t\t\tchangeToneToProfessionalWithOptions(),\n\t\t],\n\t\tdisableAISelectionToolbar: true,\n\t\tproduct: 'CONFLUENCE',\n\t\tgetFetchCustomHeaders: getDevFetchCustomHeaders,\n\t\thandleFeedbackSubmission: handleDevFeedbackSubmission,\n\t\tPromptEditor: createPromptEditor({\n\t\t\tlinking: {\n\t\t\t\tsmartLinks: {},\n\t\t\t},\n\t\t\tfeatureFlags: {},\n\t\t}),\n\t\tisRovoEnabled,\n\t};\n\tconst [editorView, setEditorView] = React.useState<EditorView>();\n\tconst onReady = React.useCallback((editorActions: EditorActions) => {\n\t\tsetEditorView(editorActions._privateGetEditorView());\n\t}, []);\n\tconst universalPreset = useUniversalPreset({\n\t\tprops: {\n\t\t\t// Our implementation currently relies on the annotation toolbar to make the\n\t\t\t// highlight action available.\n\t\t\tannotationProviders: { inlineComment: {} as any },\n\t\t\tappearance,\n\t\t},\n\t});\n\tconst { preset } = usePreset(() => {\n\t\treturn universalPreset.maybeAdd(\n\t\t\t[aiPlugin, editorPluginAIOptions],\n\t\t\tBoolean(optInStatus !== 'disabled'),\n\t\t);\n\t}, [universalPreset, optInStatus, editorPluginAIOptions]);\n\treturn (\n\t\t<>\n\t\t\t{optInNagUi}\n\t\t\t<DevTools editorView={editorView} />\n\t\t\t<ComposableEditor\n\t\t\t\tassistiveLabel=\"main editor\"\n\t\t\t\tappearance={appearance}\n\t\t\t\tpreset={preset}\n\t\t\t\tonEditorReady={onReady}\n\t\t\t/>\n\t\t</>\n\t);\n}\nexport default function Basic(): React.JSX.Element {\n\treturn (\n\t\t<ExampleWrapper defaultAppearance=\"comment\" showAppearanceDropdown>\n\t\t\t{({ appearance, optInStatus }) => (\n\t\t\t\t<BasicEditor appearance={appearance} optInStatus={optInStatus} />\n\t\t\t)}\n\t\t</ExampleWrapper>\n\t);\n}",
			"import React, { useMemo, useState } from 'react';\nimport { DiProvider, injectable } from 'react-magnetic-di';\nimport { useConfluenceFullPagePreset } from '@af/editor-examples-helpers/example-presets';\nimport ButtonGroup from '@atlaskit/button/button-group';\nimport Button from '@atlaskit/button/new';\nimport { CodeBlock } from '@atlaskit/code';\nimport type { PublicPluginAPI } from '@atlaskit/editor-common/types';\nimport { WithEditorActions } from '@atlaskit/editor-core';\nimport type { EditorActions, EditorProps } from '@atlaskit/editor-core';\nimport { ComposableEditor } from '@atlaskit/editor-core/composable-editor';\nimport { TextSelection } from '@atlaskit/editor-prosemirror/state';\nimport type { EditorView } from '@atlaskit/editor-prosemirror/view';\nimport {\n\tAnnotationsProvider,\n\tCommentsContentProvider,\n\tEditorAnnotationComponents,\n\tuseEditorAnnotationProviders,\n} from '@atlaskit/editor-test-helpers/annotation-example';\nimport { ConfluenceCardClient } from '@atlaskit/editor-test-helpers/confluence-card-client';\nimport { ConfluenceCardProvider } from '@atlaskit/editor-test-helpers/confluence-card-provider';\nimport { Label } from '@atlaskit/form';\nimport { SmartCardProvider } from '@atlaskit/link-provider';\nimport Modal, {\n\tModalBody,\n\tModalFooter,\n\tModalHeader,\n\tModalTitle,\n\tModalTransition,\n} from '@atlaskit/modal-dialog';\nimport { useSubscribe } from '@atlaskit/rovo-triggers/main';\nimport { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';\nimport TextArea from '@atlaskit/textarea';\nimport { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';\nimport { AssistanceServiceImpl } from '@atlassian/conversation-assistant-service/services/assistance-service/main';\nimport { AssistanceServiceMock } from '@atlassian/conversation-assistant-service/services/assistance-service/mocks';\nimport { createPromptEditor } from '@atlassian/editor-ai-injected-editors/prompt-editor';\nimport type { AiStreamingOrchestratorPlugin } from '@atlassian/editor-plugin-ai-streaming-orchestrator';\nimport { useLinkPickerEditorProps } from '@atlassian/link-picker-plugins/editor';\nimport { createPageEditorPluginAIOptions } from '../src/ui/prebuilt/confluence';\nimport { DevTools } from './utils/components/DevTools';\nimport type { ExampleContext } from './utils/components/ExampleWrapper';\nimport { ExampleWrapper, useExampleContext } from './utils/components/ExampleWrapper';\nimport { useOnSubmitStreaming } from './utils/components/free-gen/onSubmitHandler';\nimport { useIsExampleWrapperRovoEnabled } from './utils/components/hooks/useIsExampleWrapperRovoEnabled';\nimport { exampleAppearanceMap } from './utils/exampleAppearanceMap';\nimport { handleDevFeedbackSubmission } from './utils/feedbackCollector';\nimport { MockReduceAITone } from './utils/mocks/mock-reduce-ai-tone';\nimport { useOptInNag } from './utils/use-opt-in-nag';\ndeclare global {\n\tinterface Window {\n\t\t__editorView: EditorView | undefined;\n\t\t__TextSelection?: typeof TextSelection | undefined;\n\t}\n}\nMockReduceAITone();\nconst smartCardClient = new ConfluenceCardClient('staging');\nconst mockedCollabEditProvider = createCollabEditProvider({\n\tuserId: 'user-1',\n});\nexport const LOCALSTORAGE_defaultDocKey = 'fabric.editor.example.ai-full-page';\nfunction ConfluencePage({ appearance, optInStatus, viewMode, streamType }: ExampleContext) {\n\tconst [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);\n\tconst [isRovoEnabled] = useIsExampleWrapperRovoEnabled();\n\tconst cardProviderPromise = Promise.resolve(new ConfluenceCardProvider('staging'));\n\tconst linkPicker = useLinkPickerEditorProps(\n\t\tundefined,\n\t\tuseMemo(\n\t\t\t() => ({\n\t\t\t\tcloudId: 'a436116f-02ce-4520-8fbb-7301462a1674',\n\t\t\t\tproduct: 'confluence',\n\t\t\t\tactivityClientEndpoint: 'http://localhost:8081/gateway/api/graphql',\n\t\t\t}),\n\t\t\t[],\n\t\t),\n\t);\n\tconst { triggerOptInFlow, optInNagUi } = useOptInNag();\n\tconst { getFallbackModalToggled } = useExampleContext();\n\tconst apiRef = React.useRef<PublicPluginAPI<[AiStreamingOrchestratorPlugin]> | undefined>(\n\t\tundefined,\n\t);\n\tconst onSubmit = useOnSubmitStreaming({\n\t\tapiRef: apiRef,\n\t\tstreamType: streamType ?? 'append',\n\t});\n\tconst editorPluginAIOptions = createPageEditorPluginAIOptions({\n\t\tproduct: 'CONFLUENCE',\n\t\taiGlobalOptIn: { status: optInStatus, triggerOptInFlow },\n\t\tobjectId: 'object-1',\n\t\thandleFeedbackSubmission: (feedback) => {\n\t\t\tsetIsFeedbackModalOpen(true);\n\t\t\treturn handleDevFeedbackSubmission(feedback);\n\t\t},\n\t\tPromptEditor: createPromptEditor({\n\t\t\tlinkPicker,\n\t\t\tenableLinks: true,\n\t\t\tlinking: {\n\t\t\t\tsmartLinks: { provider: cardProviderPromise },\n\t\t\t},\n\t\t\tmentionProvider: Promise.resolve(mentionResourceProvider),\n\t\t\tfeatureFlags: {},\n\t\t}),\n\t\tgetChannelVariables: (purpose) => {\n\t\t\tif (purpose === 'rovo-agent') {\n\t\t\t\treturn {\n\t\t\t\t\tcontentURL: window.location.origin + window.location.pathname,\n\t\t\t\t\tcloudId: 'this-is-a-fake-uuid',\n\t\t\t\t\tuserId: 'another-a-fake-uuid',\n\t\t\t\t};\n\t\t\t}\n\t\t\treturn null;\n\t\t},\n\t\tonDocChangeByAgent: (agent) => {\n\t\t\tconsole.log('Content updated by agent:', agent);\n\t\t},\n\t\tonAIProviderChanged: (source, provider) => {\n\t\t\tconsole.log(\n\t\t\t\t`AI provider interaction started: ${provider?.type} for ${source}. Agent: ${provider?.agent?.name}`,\n\t\t\t);\n\t\t},\n\t\tisRovoEnabled,\n\t\tonAnnotationsRemoved: (ids) => {\n\t\t\tconsole.log(`AI removed annotations:`, ids);\n\t\t},\n\t\tgetUserPreferences: () => ({ isInDocumentStreamingAllowed: !getFallbackModalToggled?.() }),\n\t\tonSubmit,\n\t});\n\tconst annotationProviders = useEditorAnnotationProviders();\n\tconst contentComponents = useMemo<EditorProps['contentComponents']>(() => {\n\t\treturn {\n\t\t\tbefore: [\n\t\t\t\t<EditorAnnotationComponents\n\t\t\t\t\tkey=\"editorAnnotationComponents\"\n\t\t\t\t\tannotationProviders={annotationProviders}\n\t\t\t\t/>,\n\t\t\t],\n\t\t\tafter: [],\n\t\t};\n\t}, [annotationProviders]);\n\tconst { preset, editorApi } = useConfluenceFullPagePreset(\n\t\t{\n\t\t\teditorAppearance: appearance as 'full-page',\n\t\t\tviewMode: (viewMode ?? 'edit') as 'edit' | 'view',\n\t\t\toverridedFullPagePresetProps: {\n\t\t\t\tpluginOptions: {\n\t\t\t\t\tplaceholder: {\n\t\t\t\t\t\tisAIEnabled: true,\n\t\t\t\t\t\tviewMode: (viewMode ?? 'edit') as 'edit' | 'view',\n\t\t\t\t\t\tisRovoLLMEnabled: false,\n\t\t\t\t\t},\n\t\t\t\t\tcard: {\n\t\t\t\t\t\tenablePasteDisplayAsMenu: true,\n\t\t\t\t\t\teditorAppearance: appearance as 'full-page',\n\t\t\t\t\t\t__livePage: false,\n\t\t\t\t\t\tlinkPicker: undefined,\n\t\t\t\t\t\tonClickCallback: undefined,\n\t\t\t\t\t\tCompetitorPrompt: undefined,\n\t\t\t\t\t\tsmartCardContext: undefined,\n\t\t\t\t\t},\n\t\t\t\t},\n\t\t\t\tproviders: {},\n\t\t\t\tenabledOptionalPlugins: {\n\t\t\t\t\taiExperience: optInStatus !== 'disabled',\n\t\t\t\t\tconnectivity: true,\n\t\t\t\t\taiStreamingOrchestrator: true,\n\t\t\t\t\tuiControlRegistry: true,\n\t\t\t\t},\n\t\t\t},\n\t\t\taiOptions: optInStatus !== 'disabled' ? editorPluginAIOptions : undefined,\n\t\t},\n\t\t[streamType],\n\t);\n\tapiRef.current = editorApi;\n\tReact.useEffect(() => {\n\t\tif (!viewMode) {\n\t\t\treturn;\n\t\t}\n\t\teditorApi?.core?.actions.execute(editorApi?.editorViewMode?.commands.updateViewMode(viewMode));\n\t}, [viewMode, editorApi]);\n\tconst [rovoChatData, setRovoChatData] = useState<{\n\t\tdialogues: Array<{\n\t\t\tagent_message: {\n\t\t\t\tcontent: string;\n\t\t\t};\n\t\t\thuman_message: {\n\t\t\t\tcontent: string;\n\t\t\t};\n\t\t}>;\n\t\tname?: string;\n\t} | null>(null);\n\tuseSubscribe(\n\t\t{\n\t\t\ttopic: 'ai-mate',\n\t\t},\n\t\t(payload) => {\n\t\t\tswitch (payload.type) {\n\t\t\t\tcase 'chat-new': {\n\t\t\t\t\tsetRovoChatData(payload.data);\n\t\t\t\t\tbreak;\n\t\t\t\t}\n\t\t\t}\n\t\t},\n\t);\n\tconst [editorView, setEditorView] = React.useState<EditorView>();\n\tconst onReady = React.useCallback((editorActions: EditorActions) => {\n\t\twindow.__editorView = editorActions._privateGetEditorView();\n\t\twindow.__TextSelection = TextSelection;\n\t\tsetEditorView(editorActions._privateGetEditorView());\n\t}, []);\n\treturn (\n\t\t<DiProvider use={[injectable(AssistanceServiceImpl, AssistanceServiceMock)]}>\n\t\t\t<SmartCardProvider client={smartCardClient}>\n\t\t\t\t{optInNagUi}\n\t\t\t\t<ModalTransition>\n\t\t\t\t\t{rovoChatData && (\n\t\t\t\t\t\t<Modal onClose={() => setRovoChatData(null)}>\n\t\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t\t<ModalTitle>Rovo Chat</ModalTitle>\n\t\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t\t<ModalBody>\n\t\t\t\t\t\t\t\t<section>\n\t\t\t\t\t\t\t\t\t<h4>Name</h4>\n\t\t\t\t\t\t\t\t\t<CodeBlock\n\t\t\t\t\t\t\t\t\t\ttestId=\"rovo-chat-name\"\n\t\t\t\t\t\t\t\t\t\tlanguage=\"text\"\n\t\t\t\t\t\t\t\t\t\tshowLineNumbers={false}\n\t\t\t\t\t\t\t\t\t\ttext={rovoChatData.name || 'Default name'}\n\t\t\t\t\t\t\t\t\t\tshouldWrapLongLines\n\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t\t<br />\n\t\t\t\t\t\t\t\t<section>\n\t\t\t\t\t\t\t\t\t<h4>History</h4>\n\t\t\t\t\t\t\t\t\t<div >\n\t\t\t\t\t\t\t\t\t\t{rovoChatData.dialogues.map((dialogue, index: number) => (\n\t\t\t\t\t\t\t\t\t\t\t<div key={index}>\n\t\t\t\t\t\t\t\t\t\t\t\t<h5>Human</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t<CodeBlock\n\t\t\t\t\t\t\t\t\t\t\t\t\ttestId={`rovo-chat-history-${index}-human`}\n\t\t\t\t\t\t\t\t\t\t\t\t\tlanguage=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tshowLineNumbers={false}\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext={dialogue.human_message.content}\n\t\t\t\t\t\t\t\t\t\t\t\t\tshouldWrapLongLines\n\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t\t<h5>Agent</h5>\n\t\t\t\t\t\t\t\t\t\t\t\t<CodeBlock\n\t\t\t\t\t\t\t\t\t\t\t\t\ttestId={`rovo-chat-history-${index}-agent`}\n\t\t\t\t\t\t\t\t\t\t\t\t\tlanguage=\"text\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tshowLineNumbers={false}\n\t\t\t\t\t\t\t\t\t\t\t\t\ttext={dialogue.agent_message.content}\n\t\t\t\t\t\t\t\t\t\t\t\t\tshouldWrapLongLines\n\t\t\t\t\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t\t\t))}\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</section>\n\t\t\t\t\t\t\t</ModalBody>\n\t\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={() => setRovoChatData(null)}>\n\t\t\t\t\t\t\t\t\tClose\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t\t</Modal>\n\t\t\t\t\t)}\n\t\t\t\t\t{isFeedbackModalOpen && (\n\t\t\t\t\t\t<Modal testId=\"feedback-modal\" onClose={() => setIsFeedbackModalOpen(false)}>\n\t\t\t\t\t\t\t<ModalHeader hasCloseButton>\n\t\t\t\t\t\t\t\t<ModalTitle>Give feedback</ModalTitle>\n\t\t\t\t\t\t\t</ModalHeader>\n\t\t\t\t\t\t\t<ModalFooter>\n\t\t\t\t\t\t\t\t<Label htmlFor=\"area\">Share your feedback</Label>\n\t\t\t\t\t\t\t\t<TextArea\n\t\t\t\t\t\t\t\t\tid=\"area\"\n\t\t\t\t\t\t\t\t\tresize=\"auto\"\n\t\t\t\t\t\t\t\t\tmaxHeight=\"20vh\"\n\t\t\t\t\t\t\t\t\tname=\"area\"\n\t\t\t\t\t\t\t\t\tdefaultValue=\"Add a message here\"\n\t\t\t\t\t\t\t\t/>\n\t\t\t\t\t\t\t\t<Button appearance=\"primary\" onClick={() => setIsFeedbackModalOpen(false)}>\n\t\t\t\t\t\t\t\t\tCancel\n\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t</ModalFooter>\n\t\t\t\t\t\t</Modal>\n\t\t\t\t\t)}\n\t\t\t\t</ModalTransition>\n\t\t\t\t<AnnotationsProvider>\n\t\t\t\t\t<CommentsContentProvider>\n\t\t\t\t\t\t<DevTools editorView={editorView} />\n\t\t\t\t\t\t<ComposableEditor\n\t\t\t\t\t\t\t// To ensure the stream type forces the editor to rebuild\n\t\t\t\t\t\t\tkey={`${streamType}`}\n\t\t\t\t\t\t\tassistiveLabel=\"main editor\"\n\t\t\t\t\t\t\tappearance={appearance}\n\t\t\t\t\t\t\tcontentComponents={contentComponents}\n\t\t\t\t\t\t\tpreset={preset}\n\t\t\t\t\t\t\tdefaultValue={\n\t\t\t\t\t\t\t\t(localStorage && localStorage.getItem(LOCALSTORAGE_defaultDocKey)) || undefined\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\tonEditorReady={onReady}\n\t\t\t\t\t\t\tcollabEdit={{\n\t\t\t\t\t\t\t\tprovider: mockedCollabEditProvider,\n\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\tprimaryToolbarComponents={[\n\t\t\t\t\t\t\t\t<WithEditorActions\n\t\t\t\t\t\t\t\t\tkey={1}\n\t\t\t\t\t\t\t\t\trender={(actions) => {\n\t\t\t\t\t\t\t\t\t\treturn (\n\t\t\t\t\t\t\t\t\t\t\t<ButtonGroup>\n\t\t\t\t\t\t\t\t\t\t\t\t<Button\n\t\t\t\t\t\t\t\t\t\t\t\t\ttabIndex={-1}\n\t\t\t\t\t\t\t\t\t\t\t\t\tappearance=\"primary\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={async () => {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tconst value = await actions.getValue();\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlocalStorage.setItem(LOCALSTORAGE_defaultDocKey, JSON.stringify(value));\n\t\t\t\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\t\t\t\ttestId=\"save-button\"\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\tSave\n\t\t\t\t\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t\t\t\t\t<Button\n\t\t\t\t\t\t\t\t\t\t\t\t\ttabIndex={-1}\n\t\t\t\t\t\t\t\t\t\t\t\t\tappearance=\"subtle\"\n\t\t\t\t\t\t\t\t\t\t\t\t\tonClick={() => {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tif (!actions) {\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t\treturn;\n\t\t\t\t\t\t\t\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tactions.clear();\n\t\t\t\t\t\t\t\t\t\t\t\t\t\tlocalStorage.removeItem(LOCALSTORAGE_defaultDocKey);\n\t\t\t\t\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t\t\t\t\t>\n\t\t\t\t\t\t\t\t\t\t\t\t\tClear\n\t\t\t\t\t\t\t\t\t\t\t\t</Button>\n\t\t\t\t\t\t\t\t\t\t\t</ButtonGroup>\n\t\t\t\t\t\t\t\t\t\t);\n\t\t\t\t\t\t\t\t\t}}\n\t\t\t\t\t\t\t\t/>,\n\t\t\t\t\t\t\t]}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</CommentsContentProvider>\n\t\t\t\t</AnnotationsProvider>\n\t\t\t</SmartCardProvider>\n\t\t</DiProvider>\n\t);\n}\nexport default function ConfluencePageWrapper(): React.JSX.Element {\n\treturn (\n\t\t<ExampleWrapper\n\t\t\tdefaultAppearance={exampleAppearanceMap['confluence-page']}\n\t\t\tshowViewModeDropdown\n\t\t\tshowAppearanceDropdown\n\t\t\tshowStreamTypeDropdown\n\t\t>\n\t\t\t{({ appearance, optInStatus, viewMode, streamType }) => (\n\t\t\t\t<ConfluencePage\n\t\t\t\t\tappearance={appearance}\n\t\t\t\t\toptInStatus={optInStatus}\n\t\t\t\t\tviewMode={viewMode}\n\t\t\t\t\tstreamType={streamType}\n\t\t\t\t/>\n\t\t\t)}\n\t\t</ExampleWrapper>\n\t);\n}",
		],
		props: [
			{
				name: 'api',
				type: '{ aiExperience: BasePluginDependenciesAPI<{ actions: EditorPluginAIActions; commands: EditorPluginAICommands; dependencies: AIPluginDependencies; pluginConfiguration: EditorPluginAIProvider; sharedState: EditorPluginAISharedState; }>; } & RequiredPluginDependenciesAPI<...> & OptionalPluginDependenciesAPI<...>',
			},
			{
				name: 'config',
				type: '{ actionOverrides?: ActionOverrides; actionSideEffects?: ActionSideEffects; AIButtonWrapper?: React.FC<{ children: React.ReactNode; }>; ... 38 more ...; useFreeGenerateEditorAgent?: boolean; }',
				isRequired: true,
			},
		],
	},
	{
		name: 'GlobalMoreMenu',
		package: '@atlassian/global-more-menu',
		description:
			'A responsive overflow menu in the global navigation that reveals additional global actions when there is not enough space to display them all.',
		status: 'general-availability',
		usageGuidelines: [
			'Use the Global more menu in the global navigation when there are more global actions than can fit in the available horizontal space.',
			'Keep high-frequency and critical actions visible; move lower-priority or less frequently used actions into the menu based on importance and frequency.',
			'Do not use the Global more menu for page-level or contextual actions; use contextual menus or page actions instead.',
			'Do not use the Global more menu as a catch-all; only include global actions that have a clear reason to move into overflow.',
			'Group related actions together and use menu dividers where appropriate.',
			'Keep item labels, icons, and behavior identical to their direct global navigation equivalent.',
			'Open the menu as a popup aligned with the trigger, shifting or flipping as needed to remain within the viewport.',
			'If the menu content exceeds the available height, the popup menu itself should scroll while keeping the trigger and surrounding navigation stable.',
			'Communicate loading states using inline loading indicators for items that require asynchronous work, without blocking the entire menu.',
			'Do not show the Global more menu trigger when there are no overflow items.',
			'Keep element-after content such as badges or status indicators visible and aligned with each item when the item is shown inside the Global more menu.',
			'On resize, items should move into or out of the Global more menu in a stable, predictable order, typically based on priority.',
			'Avoid sudden or frequent reflow that makes it difficult for people to track where actions moved.',
		],
		contentGuidelines: [
			'Use short, action-oriented labels for items in the Global more menu.',
			'Use sentence case for menu labels (for example, "Invite people").',
			'Avoid abbreviations or product-specific jargon unless it is widely understood by the target audience.',
			'Keep labels concise so they do not truncate in the menu.',
			'Use consistent terminology with the rest of the global navigation and associated pages.',
			'Do not use vague labels such as "More" or "Stuff" for individual menu items.',
			'Do not rely solely on icons without accompanying text labels in the Global more menu.',
			'Do not use punctuation or decorative characters in labels that do not add meaning.',
		],
		accessibilityGuidelines: [
			'The Global more menu must be fully operable with a keyboard and screen readers, matching the expected behavior of a menu button and popup menu.',
			'Expose the trigger as a native button with an accessible label, `aria-expanded`, `aria-haspopup="menu"`, and `aria-controls` when the popup is present.',
			'Apply appropriate menu semantics to the popup content, such as `role="menu"` on the container and `role="menuitem"` on each actionable item when using a menu pattern.',
			'Pressing Enter or Space on the trigger should open the menu and move focus into the first focusable item within the menu.',
			'Allow navigation between menu items using the Up and Down Arrow keys when the menu is open.',
			'Pressing Escape closes the menu and returns focus to the trigger.',
			'Ensure that each menu item has a meaningful name that can be announced by assistive technologies.',
			'When items are dynamically moved into or out of the Global more menu because of resizing, maintain a logical focus order and avoid "focus jumps" that are difficult to follow with a screen reader.',
		],
		keywords: ['global navigation', 'more menu', 'overflow', 'responsive', 'actions', 'menu'],
		category: 'navigation',
		examples: [
			"import React, { useEffect } from 'react';\nimport { GlobalMoreMenu } from '../src';\nimport { CustomizeSidebarComponent, ExampleWrapper } from '../test-helpers';\nimport { createPeekingStore, ExamplePeekingMoreMenuItemComponent } from '../test-helpers/peeking';\nconst { usePeekingStore } = createPeekingStore();\nconst productItemsData = [\n\t{\n\t\tmenuId: 'example-link',\n\t\tvisible: false,\n\t},\n\t{\n\t\tmenuId: 'example-button',\n\t\tvisible: false,\n\t},\n];\nexport default function HiddenItemIsPeeked(): React.JSX.Element {\n\tconst [{ peekingId }, { startPeeking }] = usePeekingStore();\n\tuseEffect(() => {\n\t\tif (!peekingId) {\n\t\t\tstartPeeking('example-button');\n\t\t}\n\t}, [peekingId, startPeeking]);\n\tconst peekingProductItem = productItemsData.find(({ menuId }) => menuId === peekingId);\n\treturn (\n\t\t<ExampleWrapper>\n\t\t\t{!!peekingProductItem && (\n\t\t\t\t<ExamplePeekingMoreMenuItemComponent\n\t\t\t\t\tmenuId={peekingProductItem.menuId}\n\t\t\t\t\tusePeekingStore={usePeekingStore}\n\t\t\t\t/>\n\t\t\t)}\n\t\t\t<GlobalMoreMenu\n\t\t\t\tcustomizeSidebarMenuItem={<CustomizeSidebarComponent />}\n\t\t\t\tmenuItemComponent={(props) => (\n\t\t\t\t\t<ExamplePeekingMoreMenuItemComponent {...props} usePeekingStore={usePeekingStore} />\n\t\t\t\t)}\n\t\t\t\tpeekingMenuIds={[peekingId]}\n\t\t\t\tproductItemsData={productItemsData}\n\t\t\t/>\n\t\t</ExampleWrapper>\n\t);\n}",
			"import { ModalContextProvider } from '@atlassian/entry-points/modal-context-provider';\nimport { withIntlProviderMock } from '@atlassian/navigation-test-utils/intl-provider';\nimport { withRelayEnvironmentProviderMock } from '@atlassian/navigation-test-utils/relay-provider';\nimport { GlobalMoreMenu } from '../src';\nimport {\n\tExampleMoreMenuItemComponent,\n\tExampleWrapper,\n\tMinimalModalComponentWithTrigger,\n\tsimpleMockItems,\n} from '../test-helpers';\nfunction ReturnFocusDemo(): React.JSX.Element {\n\treturn (\n\t\t<ExampleWrapper testId={'example-global-more-menu-wrapper'}>\n\t\t\t<ModalContextProvider>\n\t\t\t\t<GlobalMoreMenu\n\t\t\t\t\ttestId=\"example-global-more-menu\"\n\t\t\t\t\tproductItemsData={simpleMockItems.productItemsData.map((item) => ({\n\t\t\t\t\t\t...item,\n\t\t\t\t\t\tvisible: true,\n\t\t\t\t\t}))}\n\t\t\t\t\tappItemsData={simpleMockItems.appItemsData.map((item) => ({\n\t\t\t\t\t\t...item,\n\t\t\t\t\t\tvisible: true,\n\t\t\t\t\t}))}\n\t\t\t\t\tmenuItemComponent={ExampleMoreMenuItemComponent}\n\t\t\t\t\tcustomizeSidebarMenuItem={<MinimalModalComponentWithTrigger />}\n\t\t\t\t\tpeekingMenuIds={[]}\n\t\t\t\t/>\n\t\t\t</ModalContextProvider>\n\t\t</ExampleWrapper>\n\t);\n}\nconst _default_1: (props: Record<string, never>) => React.JSX.Element =\n\twithRelayEnvironmentProviderMock({\n\t\tmockData: {},\n\t})(withIntlProviderMock()(ReturnFocusDemo));\nexport default _default_1;",
			"import { ModalContextProvider } from '@atlassian/entry-points/modal-context-provider';\nimport { withIntlProviderMock } from '@atlassian/navigation-test-utils/intl-provider';\nimport { withRelayEnvironmentProviderMock } from '@atlassian/navigation-test-utils/relay-provider';\nimport { GlobalMoreMenu } from '../src';\nimport {\n\tExampleMoreMenuItemComponent,\n\tExampleWrapper,\n\tMinimalModalComponentWithTrigger,\n\tsimpleMockItems,\n} from '../test-helpers';\nfunction ReturnFocusDemoMoreMenu(): React.JSX.Element {\n\treturn (\n\t\t<ExampleWrapper testId={'example-global-more-menu-wrapper'}>\n\t\t\t<ModalContextProvider>\n\t\t\t\t<GlobalMoreMenu\n\t\t\t\t\ttestId=\"example-global-more-menu\"\n\t\t\t\t\tproductItemsData={simpleMockItems.productItemsData.map((item) => ({\n\t\t\t\t\t\t...item,\n\t\t\t\t\t\tvisible: false,\n\t\t\t\t\t}))}\n\t\t\t\t\tappItemsData={simpleMockItems.appItemsData}\n\t\t\t\t\tmenuItemComponent={ExampleMoreMenuItemComponent}\n\t\t\t\t\tcustomizeSidebarMenuItem={<MinimalModalComponentWithTrigger />}\n\t\t\t\t\tpeekingMenuIds={[]}\n\t\t\t\t/>\n\t\t\t</ModalContextProvider>\n\t\t</ExampleWrapper>\n\t);\n}\nconst _default_1: (props: Record<string, never>) => React.JSX.Element =\n\twithRelayEnvironmentProviderMock({\n\t\tmockData: {},\n\t})(withIntlProviderMock()(ReturnFocusDemoMoreMenu));\nexport default _default_1;",
		],
		props: [
			{
				name: 'appItemsData',
				type: 'MenuItemConfigData[]',
				description:
					'The customization data for the app items, in the format `{menuId: string; visible: boolean;}[]`',
				defaultValue: '[]',
			},
			{
				name: 'customizeSidebarMenuItem',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'A `MenuButtonItem` that matches the "Customize Sidebar" designs. When clicked\nit should open the Customization Modal',
				isRequired: true,
			},
			{
				name: 'dropIndicator',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'A ReactNode to be used as a drop indicator for the More menu.\nThis is used to indicate where the item will be dropped when dragging and dropping into the More menu.',
			},
			{
				name: 'intlMode',
				type: '"async" | "inherit"',
				description:
					"When 'inherit', skip the internal NavErrorBoundary's AsyncIntlProvider and use the host\napp's IntlProvider. Use when the host already has global-more-menu i18n keys loaded.\nDefaults to 'async'.",
			},
			{
				name: 'menuItemComponent',
				type: 'React.ComponentClass<MoreMenuItemComponentProps, any> | React.FunctionComponent<MoreMenuItemComponentProps>',
				description:
					'A React Component that renders either a `MenuLinkItem` or a `MenuButtonItem` for\nthe given `menuId`.\n\nMoreMenuItemComponent props:\n- `menuId`: string; the menuId of the item being rendered in the More Menu\n- `key`: string; will be the menuId\n- `closeMenu`: () => void; a callback to close the More Menu. Call this in\n  the onClick function if the More Menu should close when this is clicked',
				isRequired: true,
			},
			{
				name: 'moreMenuItemLabel',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'ReactNode containing internationalized text for the trigger button label.\nDefaults to "More". Will be displayed next to a `ShowMoreHorizontalIcon` when there are hidden Menu Items.',
			},
			{
				name: 'onClickMoreMenuTrigger',
				type: '() => void',
				description:
					'Handler to be called onClick of the More menu trigger.\nCan be used for instrumentation and firing product-specific analytics.',
			},
			{
				name: 'peekingMenuIds',
				type: 'string[]',
				description:
					'When one or more `peekingMenuIds` is provided, those item will be hidden from the More Menu Popup,\neven if it is configured to be hidden. It is assumed that the item is rendered somewhere\nelse in the side nav (AKA "peeking")',
			},
			{
				name: 'productItemsData',
				type: 'MenuItemConfigData[]',
				description:
					'The customization data for the product items.\n{menuId: string; visible: boolean;}[]',
				isRequired: true,
			},
			{
				name: 'triggerRef',
				type: '((instance: HTMLButtonElement) => void) | React.MutableRefObject<HTMLButtonElement>',
				description:
					'A ref to the trigger button element.\nUsed for drag & drop into the More menu.',
			},
			{
				name: 'triggerVisualContentRef',
				type: '((instance: HTMLDivElement) => void) | React.MutableRefObject<HTMLDivElement>',
				description:
					'A ref to the visual content of the trigger button.\nUsed for drag & drop into the More menu.',
			},
		],
	},
	{
		name: 'GlobalShortcuts',
		package: '@atlassian/global-shortcuts',
		description:
			'For displaying different apps and sites attached to those apps in the sidebar. Extends the Object list flyout component.',
		status: 'general-availability',
		usageGuidelines: [
			'Render global shortcuts within the product sidebar to provide quick access to other Atlassian apps.',
			'Use a chevron (elemAfter) for apps with multiple sites to reveal site choices in a flyout.',
			'Use an external/offsite icon for single-site apps to indicate they open in a new browser window.',
			'Position the flyout relative to the trigger, ensuring it remains visible on screen (e.g., aligning to the base of the screen if space is limited).',
			'Maintain a fixed width of 400px for the flyout on desktop; use percentage-based width on mobile.',
			'Limit the flyout height to a maximum of 776px, after which a scrollbar should appear.',
			'On screens <= 768px, transition the flyout to a modal presentation with a close button.',
			'Follow the standard collection-based ordering: Company Hub -> TWC -> Strategy -> Product -> Dev -> Service -> Customer -> Platform.',
			'Only show apps the user is licensed for, except for specific growth/cross-sell scenarios.',
			'Users must be able to hide, show, and reorder shortcuts via the customization modal.',
			"Don't duplicate destinations already present as primary navigation items in the sidebar.",
			"Don't show a chevron when there is only one site; use the external/offsite icon instead.",
			"Don't mix items in this list that aren't global app shortcuts (e.g., hidden items management belongs in the Global More menu).",
			"Don't surface shortcuts to apps already deeply embedded in the current app (e.g., Search, Chat).",
			'Use when an app has multiple sites/instances to allow users to switch between them.',
			'Ensure the overarching intent supports cross-app workflows without cluttering the sidebar.',
		],
		contentGuidelines: [
			'Use "New" lozenges for apps the organization has licensed but the user hasn\'t tried yet.',
			'Use "Try" for apps the organization doesn\'t have but would provide value based on user behavior.',
			'Use "Try" for apps the organization has but the user is not yet licensed for.',
			'Ensure promotional apps can be dismissed individually without removing the entire recommendation experience.',
		],
		accessibilityGuidelines: [
			'Provide ARIA labels for shortcuts indicating the app name, draggable status, and position (e.g., "Jira sites, draggable, position 1 of 6").',
			'Include "(opens in a new tab)" in the ARIA label for single-site shortcuts.',
			'Use the Tab key to navigate through menu items and Shift + Tab to navigate backwards.',
			'Use Enter or Space to open a flyout or trigger a single-site link.',
			'Use the Escape key to close the flyout; focus must return to the trigger upon closing.',
			'Support keyboard reordering via the customization modal action buttons.',
			'The first element in an opened flyout (e.g., close button or first site) must receive focus.',
		],
		keywords: ['navigation', 'shortcuts', 'app switcher', 'flyout', 'side nav'],
		category: 'navigation',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { css, jsx } from '@compiled/react';\nimport { withForceStagingProvider } from '@atlassian/navigation-bff-data-provider/staging-provider';\nimport { withLinkHarness } from '@atlassian/navigation-test-utils/link-harness';\nimport GlobalShortcuts from '../src';\nimport { useMockShortcuts, withRealShortcutsIntlProvider } from './helpers/shortcuts';\n// Set Width so the shortcuts menu fits typical story layouts\nconst styles = css({ width: '300px' });\nconst Example: (props: object) => JSX.Element = withLinkHarness()(\n\twithRealShortcutsIntlProvider()(withForceStagingProvider()(ActualExample)),\n);\nexport default Example;\nfunction ActualExample() {\n\tconst mockShortcuts = useMockShortcuts();\n\treturn (\n\t\t<div css={styles}>\n\t\t\t<GlobalShortcuts\n\t\t\t\tshortcutItems={mockShortcuts}\n\t\t\t\ttestId=\"global-shortcuts\"\n\t\t\t\tproduct=\"atlaskit\"\n\t\t\t\tcloudId=\"1234\"\n\t\t\t/>\n\t\t</div>\n\t);\n}",
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { css, jsx } from '@compiled/react';\nimport { withLinkHarness } from '@atlassian/navigation-test-utils/link-harness';\nimport GlobalShortcuts from '../src';\nimport { useMockShortcuts, withRealShortcutsIntlProvider } from './helpers/shortcuts';\n// Set Width to 300px so flyout menu has room for its popup\nconst styles = css({ width: '300px' });\nconst Example: (props: object) => JSX.Element = withRealShortcutsIntlProvider()(\n\twithLinkHarness()(ActualExample),\n);\nexport default Example;\nfunction ActualExample() {\n\tconst mockShortcuts = useMockShortcuts();\n\treturn (\n\t\t<div css={styles}>\n\t\t\t<GlobalShortcuts\n\t\t\t\tshortcutItems={mockShortcuts}\n\t\t\t\ttestId=\"global-shortcuts\"\n\t\t\t\tproduct=\"atlaskit\"\n\t\t\t\tcloudId=\"1234\"\n\t\t\t\tviewAllAppsConfig={{\n\t\t\t\t\tpath: '/o/mockOrgId/apps',\n\t\t\t\t\tisSelected: false,\n\t\t\t\t}}\n\t\t\t/>\n\t\t</div>\n\t);\n}",
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { css, jsx } from '@compiled/react';\nimport { withForceStagingProvider } from '@atlassian/navigation-bff-data-provider/staging-provider';\nimport { withLinkHarness } from '@atlassian/navigation-test-utils/link-harness';\nimport GlobalShortcuts from '../src';\nimport {\n\tuseMockShortcutsWithCustomComponent,\n\twithRealShortcutsIntlProvider,\n} from './helpers/shortcuts';\n// Set Width to 300px so flyout menu has room for its popup\nconst styles = css({ width: '300px' });\nconst Example: (props: object) => JSX.Element = withLinkHarness()(\n\twithRealShortcutsIntlProvider()(withForceStagingProvider()(ActualExample)),\n);\nexport default Example;\nfunction ActualExample() {\n\tconst mockShortcutsWithCustomComponent = useMockShortcutsWithCustomComponent();\n\treturn (\n\t\t<div css={styles}>\n\t\t\t<GlobalShortcuts\n\t\t\t\tshortcutItems={mockShortcutsWithCustomComponent}\n\t\t\t\ttestId=\"global-shortcuts\"\n\t\t\t\tproduct=\"atlaskit\"\n\t\t\t\tcloudId=\"1234\"\n\t\t\t/>\n\t\t</div>\n\t);\n}",
		],
		props: [
			{
				name: 'cloudId',
				type: 'string',
				description: 'Cloud / site id for backend product-link resolution',
				isRequired: true,
			},
			{
				name: 'enableDragAndDrop',
				type: 'boolean',
				description: 'Drag and Drop Support',
			},
			{
				name: 'onUpdateGetFilteredProductLinks',
				type: '(getFilteredProductLinks: fnGetFilteredProductLinks) => void',
				description: 'Optional reporting of mapped shortcuts when changed',
			},
			{
				name: 'openInSameTab',
				type: 'boolean',
			},
			{
				name: 'product',
				type: 'string',
				description: 'Optional product',
			},
			{
				name: 'shortcutItems',
				type: 'GlobalShortcutsItem[]',
				description: 'Shortcut items',
			},
			{
				name: 'viewAllAppsConfig',
				type: '{ isSelected?: boolean; onNavigate?: (event?: MouseEvent<Element, globalThis.MouseEvent> | KeyboardEvent<Element>) => void; path?: string; }',
				description:
					'Configuration for the link to view all available apps, if that should be shown.',
			},
		],
	},
	{
		name: 'ObjectListFlyout',
		package: '@atlassian/global-side-navigation',
		description:
			'A flyout container that shows a list of items within a given context, such as projects or recent items, typically triggered from a side navigation menu.',
		status: 'general-availability',
		usageGuidelines: [
			'The flyout trigger (Flyout menu item) must be rendered within a side navigation context.',
			'The flyout container uses the ADS popup component to house the list of items.',
			'The flyout header is automatically set to the name of the flyout menu item and is not optional.',
			'Search and filter options within the header can be toggled on or off based on the content type.',
			'The flyout footer is optional and can contain up to 3 stacked buttons.',
			'Group items under semantic headings or ARIA groups when multiple categories (e.g., Starred, Recent) are present.',
			'For screens > 768px, position the flyout to the right of the trigger, ensuring it remains fully visible on screen.',
			'The flyout width should be fixed at 400px on desktop, while on mobile it becomes a modal with relative width.',
			'The maximum height is 776px; content exceeding this must trigger a scrollbar.',
			'Empty, error, and loading states must include clear text descriptions of the state and next steps.',
			'Do not use Expandable menu item components inside the flyout menu.',
			'Do not use navigation elements that are not simple link items (Menu link item).',
			'Do not rename the popup title to something different from the flyout trigger name (e.g., "Starred" trigger must have a "Starred" title).',
			'Use to show a list of objects like projects, spaces, or recent items without navigating away from the current page.',
			'Use when a user needs to quickly switch between frequently used or starred items.',
			'Use the footer for primary actions related to the object type, such as "View all projects" or "Create a project".',
			'When an item is un-starred, keep it in the list in an un-starred state until the flyout is closed to prevent layout shift and allow undoing the action.',
		],
		contentGuidelines: [
			'Match the popup title to the flyout name exactly (e.g., "Recent" trigger = "Recent" title).',
			'Search placeholders must be contextual: "Search [item type] items".',
			'If the flyout name is a plural noun (e.g., "Boards"), use "View all [name]" for the footer link.',
			'If the flyout name is an adjective (e.g., "Starred"), use "View all [name] items" for the footer link.',
			'Button labels must begin with a strong, clear action verb (e.g., "Create a project", "Import files").',
			'Avoid noun-only labels or pluralizing adjectives (e.g., don\'t use "View all Recents").',
		],
		accessibilityGuidelines: [
			'Ensure the flyout trigger is keyboard accessible via Tab/Shift+Tab.',
			'Enter or Space must open the flyout and move focus to the first focusable element.',
			'Esc key must close the flyout and return focus to the trigger.',
			'Provide a meaningful accessible name via aria-label or aria-labelledby pointing to the header title.',
			'Do not rely on layout position (e.g., "left menu") for accessible names; use descriptive labels.',
			'Ensure focus order follows the visual hierarchy: Header -> Search -> List Items -> Footer Actions.',
			'Loading states must convey progress in text for screen readers, not just a visual spinner.',
			'Do not rely on color alone to indicate selection; use icons (like checkmarks) or bold text labels.',
		],
		keywords: ['flyout', 'popup', 'navigation', 'recent items', 'starred items', 'object list'],
		category: 'navigation',
		examples: [
			"import { useIntl } from 'react-intl';\nimport ClockIcon from '@atlaskit/icon/core/clock';\nimport StarUnstarredIcon from '@atlaskit/icon/core/star-unstarred';\nimport Lozenge from '@atlaskit/lozenge/lozenge';\nimport { ButtonMenuItem } from '@atlaskit/side-nav-items/button-menu-item';\nimport {\n\tFlyoutMenuItem,\n\tFlyoutMenuItemContent,\n\tFlyoutMenuItemTrigger,\n} from '@atlaskit/side-nav-items/flyout-menu-item';\nimport { MenuList } from '@atlaskit/side-nav-items/menu-list';\nimport type { ObjectListFlyoutItem } from '@atlassian/navigation-common/types';\nimport { svgIcons } from '@atlassian/navigation-test-utils/icons';\nimport { withLinkHarness } from '@atlassian/navigation-test-utils/link-harness';\nimport { withRelayEnvironmentProviderMock } from '@atlassian/navigation-test-utils/relay-provider';\nimport { ObjectListFlyout } from '../src';\nimport { GlobalSideNavigationNoContent } from '../src/common/ui/no-content';\nimport { messages } from '../src/controllers/items-and-shortcuts-provider/use-recent-nav-item/messages';\nimport { withCommonUtils } from './helpers';\nimport {\n\tactions,\n\tfilterConfig,\n\tmultiFilterConfig,\n\tuseItems,\n\tuseItemsEmpty,\n\tuseItemsError,\n\tuseItemsLoading,\n\tuseItemsLoadMore,\n\tuseItemsNoResults,\n\tuseItemsSuspense,\n\tuseStarredItems,\n} from './mocks/object-list-flyout';\nexport default function Example(): React.JSX.Element {\n\t// We still use withSidebarWidth() as it creates a smaller snapshot\n\tconst WrappedComponent = withCommonUtils(\n\t\twithLinkHarness()(withRelayEnvironmentProviderMock({ mockData: {} })(ObjectListFlyoutMenu)),\n\t);\n\treturn <WrappedComponent />;\n}\nfunction ObjectListFlyoutMenu() {\n\tconst { formatMessage } = useIntl(); // This has no effect on the rendering, unfortunately.\n\treturn (\n\t\t<MenuList>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={formatMessage(messages.label)}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With everything'}\n\t\t\t\tactions={actions}\n\t\t\t\tcallToAction={{\n\t\t\t\t\tlabel: 'Some fancy action',\n\t\t\t\t\tonClick: () => {\n\t\t\t\t\t\tconsole.log('Call to action clicked');\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\tfilterConfig={filterConfig}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With everything (suspense)'}\n\t\t\t\tactions={actions}\n\t\t\t\tcallToAction={{\n\t\t\t\t\tlabel: 'Some fancy action',\n\t\t\t\t\tonClick: () => {\n\t\t\t\t\t\tconsole.log('Call to action clicked');\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\tfilterConfig={filterConfig}\n\t\t\t\tuseItems={useItemsSuspense}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'Without search'}\n\t\t\t\tisSearchable={false}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With actions'}\n\t\t\t\tactions={actions}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With call-to-action button'}\n\t\t\t\tcallToAction={{\n\t\t\t\t\tlabel: 'Some fancy action',\n\t\t\t\t\tonClick: () => {\n\t\t\t\t\t\tconsole.log('Call to action clicked');\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With call-to-action button + lozenge'}\n\t\t\t\tcallToAction={{\n\t\t\t\t\tlabel: (\n\t\t\t\t\t\t<>\n\t\t\t\t\t\t\tCreate a thing <Lozenge appearance=\"new\">New</Lozenge>\n\t\t\t\t\t\t</>\n\t\t\t\t\t),\n\t\t\t\t\tonClick: () => {\n\t\t\t\t\t\tconsole.log('Call to action clicked');\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With call-to-action link'}\n\t\t\t\tcallToAction={{\n\t\t\t\t\tlabel: 'Some fancy link',\n\t\t\t\t\thref: 'https://www.atlassian.com',\n\t\t\t\t\tonClick: () => {\n\t\t\t\t\t\tconsole.log('Call to action clicked');\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With call-to-action link (new tab)'}\n\t\t\t\tcallToAction={{\n\t\t\t\t\tlabel: 'Some fancy link',\n\t\t\t\t\thref: 'https://www.atlassian.com',\n\t\t\t\t\ttarget: '_blank',\n\t\t\t\t\tonClick: () => {\n\t\t\t\t\t\tconsole.log('Call to action clicked');\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With filters (select one)'}\n\t\t\t\tfilterConfig={filterConfig}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With filters (select multiple)'}\n\t\t\t\tfilterConfig={multiFilterConfig}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With selected filter - no results'}\n\t\t\t\tfilterConfig={{ ...filterConfig, defaultSelected: ['test'] }}\n\t\t\t\tuseItems={useItemsNoResults}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With selected filter - custom no results'}\n\t\t\t\tfilterConfig={{ ...filterConfig, defaultSelected: ['test'] }}\n\t\t\t\tsearchNoResultsElem={<CustomNoContent />}\n\t\t\t\tuseItems={useItemsNoResults}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With custom item'}\n\t\t\t\tItemComponent={CustomItem}\n\t\t\t\tuseItems={useItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'With load more'}\n\t\t\t\tuseItems={useItemsLoadMore}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\tactions={actions}\n\t\t\t\telemBefore={<StarUnstarredIcon label={''} />}\n\t\t\t\tfilterConfig={{ ...filterConfig, defaultSelected: ['all'], hideSelectedFilterTag: ['all'] }}\n\t\t\t\tlabel={'Starred'}\n\t\t\t\tsearchPlaceholder=\"Search starred items\"\n\t\t\t\tuseItems={useStarredItems}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'Loading'}\n\t\t\t\tactions={actions}\n\t\t\t\tuseItems={useItemsLoading}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'Empty - default'}\n\t\t\t\tuseItems={useItemsEmpty}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<StarUnstarredIcon label={''} />}\n\t\t\t\titemMenuId=\"test.sidebar.starred\"\n\t\t\t\tlabel={'Empty - starred'}\n\t\t\t\tuseItems={useItemsEmpty}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\temptyElem={<CustomNoContent />}\n\t\t\t\tlabel={'Empty - custom element'}\n\t\t\t\tuseItems={useItemsEmpty}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'Empty - call-to-action'}\n\t\t\t\tcallToAction={{\n\t\t\t\t\tlabel: 'Create note',\n\t\t\t\t\tonClick: () => {\n\t\t\t\t\t\tconsole.log('Call to action clicked');\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\tuseItems={useItemsEmpty}\n\t\t\t/>\n\t\t\t<ObjectListFlyout\n\t\t\t\telemBefore={<ClockIcon label={''} />}\n\t\t\t\tlabel={'Error'}\n\t\t\t\tuseItems={useItemsError}\n\t\t\t/>\n\t\t</MenuList>\n\t);\n}\nfunction CustomItem(props: ObjectListFlyoutItem) {\n\tconst { elemBefore, onClick, primaryLabel } = props;\n\t// Add the onClick callback to the child menu items, so that the flyout only closes when a child item is clicked\n\t// (rather than when the FlyoutMenuItemTrigger is clicked)\n\treturn (\n\t\t<FlyoutMenuItem>\n\t\t\t<FlyoutMenuItemTrigger elemBefore={elemBefore}>{primaryLabel}</FlyoutMenuItemTrigger>\n\t\t\t<FlyoutMenuItemContent>\n\t\t\t\t<MenuList>\n\t\t\t\t\t<ButtonMenuItem onClick={onClick}>Item 1</ButtonMenuItem>\n\t\t\t\t\t<ButtonMenuItem onClick={onClick}>Item 2</ButtonMenuItem>\n\t\t\t\t</MenuList>\n\t\t\t</FlyoutMenuItemContent>\n\t\t</FlyoutMenuItem>\n\t);\n}\nfunction CustomNoContent() {\n\treturn (\n\t\t<GlobalSideNavigationNoContent\n\t\t\trenderImage={() => <img src={svgIcons.adminIcon} width={96} alt=\"\" />}\n\t\t\theading=\"Custom Heading\"\n\t\t\tdescription=\"Custom description\"\n\t\t/>\n\t);\n}",
		],
		props: [
			{
				name: 'actions',
				type: 'ObjectListFlyoutAction[]',
				description: 'A list of actions to show at the bottom of the menu (e.g. Show all, etc)',
			},
			{
				name: 'analyticsName',
				type: 'string',
				description: "Name to be used for analytics\nTODO: This isn't used!",
			},
			{
				name: 'callToAction',
				type: '{ closeFlyoutOnClick?: boolean; label: React.ReactNode; onClick?: React.MouseEventHandler<Element>; } & (LinkProps | ButtonProps)',
				description: 'Optional, configuration for a call-to-action button at the top of the menu.',
			},
			{
				name: 'dropIndicator',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'A slot to render drop indicators for drag and drop operations on the menu item.',
			},
			{
				name: 'elemBefore',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Left icon for the flyout menu trigger',
				isRequired: true,
			},
			{
				name: 'elemBeforeResults',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Optional React node to render between the header (search/CTA area) and the results list.',
			},
			{
				name: 'emptyElem',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Optional React node to use when no objects are present to display',
			},
			{
				name: 'entryPoint',
				type: 'InternalEntryPointRepresentation<any, any, any, any, any>',
				description: 'Optional React node to use when no objects are present to display',
			},
			{
				name: 'entryPointParams',
				type: '{ [x: string]: unknown; }',
				description:
					"Optional parameters that are passed to the entryPoint's getPreloadedProps() function",
			},
			{
				name: 'errorFallback',
				type: '(props: { error: Error; onClose: () => void; }) => React.ReactElement<any, any>',
				description:
					'Optional React component to render when there is an entryPoint loading error.',
				defaultValue: 'Spinner icon',
			},
			{
				name: 'experienceEndTracker',
				type: 'React.ComponentClass<{}, any> | React.FunctionComponent<{}>',
				description:
					'Optional React component to render at the very end of the flyout after actions',
			},
			{
				name: 'fallback',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Optional React node to use when loading the entrypoint component.',
				defaultValue: 'Spinner icon',
			},
			{
				name: 'filterConfig',
				type: 'FilterConfig',
				description:
					'Optional config for showing a drop-down menu of filters to filter the results list.',
			},
			{
				name: 'hasDragIndicator',
				type: 'boolean',
				description:
					'Whether this menu item can be dragged. Add a drag handle to this item.\nYou are responsible for wiring up drag and drop to the menu item.\n\n\n- Please be sure to make the MenuItem `ref` the `draggable` element\n- See our navigation drag and drop guidelines for more technical details',
			},
			{
				name: 'hideActionsWhenEmpty',
				type: 'boolean',
				description:
					'Optionally hides footer actions when the menu resolves to its initial empty state.\n\nDefaults to false. This only applies when the first default result set has no data;\nlater empty states from search or filter changes are not affected.',
			},
			{
				name: 'id',
				type: 'string',
				description:
					'ID that is assigned to the popup container element and used to associate the trigger with the content.',
			},
			{
				name: 'isDefaultOpen',
				type: 'boolean',
				description:
					'Whether the flyout menu is open by default.\n\nYou can use this to set the default expansion state without needing to entirely control the state.',
			},
			{
				name: 'isDragging',
				type: 'boolean',
				description:
					'Whether the element is being dragged. Will apply "dragging" styles to\nmenu item.',
			},
			{
				name: 'isFlyoutOpen',
				type: 'boolean',
				description: 'Optional prop which allows the flyout to be controlled after initial render.',
			},
			{
				name: 'isOpen',
				type: 'boolean',
				description:
					'Allows to control the open state of the flyout externally.\n\nIf you are controlling the state, you should update your state using:\n- `onClick` on the `FlyoutMenuItemTrigger`\n- `onClose` on the `FlyoutMenuItemContent`',
			},
			{
				name: 'isSearchable',
				type: 'boolean',
				description: 'Optional, whether list is searchable.',
				defaultValue: 'true',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Indicates that the menu item is selected.',
			},
			{
				name: 'ItemComponent',
				type: 'React.ComponentClass<ObjectListFlyoutItem<object>, any> | React.FunctionComponent<ObjectListFlyoutItem<object>>',
				description:
					'Optional, a component type to use to render each item. Item fields will be\nspread as props onto this component. If not specified, a default will be used.',
			},
			{
				name: 'itemMenuId',
				type: 'string',
				description: 'ID for the menu item that this component is being used for',
			},
			{
				name: 'label',
				type: 'string',
				description: 'Label for the flyout menu trigger',
				isRequired: true,
			},
			{
				name: 'labelElem',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description:
					'Optional label element for the flyout menu trigger, overrides the rendering of label.',
			},
			{
				name: 'loadingElem',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Optional React node to use when loading items.',
			},
			{
				name: 'MenuContentWrapperComponent',
				type: 'React.ComponentClass<{ children: React.ReactNode; }, any> | React.FunctionComponent<{ children: React.ReactNode; }>',
				description: "Optional React node to wrap the flyout menu's content.",
			},
			{
				name: 'onClick',
				type: '(event: React.MouseEvent<HTMLButtonElement, MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description: 'Optional on-click handler',
			},
			{
				name: 'onOpenChange',
				type: '(isOpen: boolean) => void',
				description:
					'Callback that is called when the flyout menu is opened or closed.\n\nCan be used for analytics purposes when you are not controlling the state yourself.',
			},
			{
				name: 'onSubMenuItemClick',
				type: '(event: React.MouseEvent<Element, MouseEvent>, extendedSubItemAnalyticsAttributes?: Record<string, unknown>) => void',
				description:
					'Optional handler for FlyoutMenuItemContent item click event.\nSecond argument carries optional `extendedSubItemAnalyticsAttributes`.',
			},
			{
				name: 'searchNoResultsElem',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
				description: 'Optional React node to use when no search results are found.',
			},
			{
				name: 'searchNoResultsElemAfter',
				type: 'React.ReactNode | ((params: ObjectListFlyoutHookParams<never>) => React.ReactNode)',
				description:
					'Optional React node or render function to render after the no results state.\nWhen a function is provided, it receives the hook params (e.g. searchText, selectedFilters).',
			},
			{
				name: 'searchPlaceholder',
				type: 'string',
				description: 'Optional placeholder text for search field. Defaults to "Search".',
			},
			{
				name: 'triggerRef',
				type: '((instance: HTMLButtonElement) => void) | React.RefObject<HTMLButtonElement>',
				description: 'Optional ref to forward to the FlyoutMenuItemTrigger.',
			},
			{
				name: 'useItems',
				type: '(params: ObjectListFlyoutHookParams<never>) => ObjectListFlyoutHookResults<ObjectListFlyoutItem<object>>',
				description: 'A hook to load items to show. Organized by sections.',
				isRequired: true,
			},
			{
				name: 'visualContentRef',
				type: '((instance: HTMLDivElement) => void) | React.RefObject<HTMLDivElement>',
				description:
					'Exposes the visually complete menu item, including:\n\n- the main interactive element (exposed through `ref`)\n- any `elemBefore`, `elemAfter`, `actions`, or `actionsOnHover`\n\nThis specifically excludes the wrapping list item,\nwhich is also exposed through either:\n- the `listItemRef` prop for LinkMenuItem and ButtonMenuItem\n- the `ref` prop for FlyoutMenuItem and ExpandableMenuItem',
			},
		],
	},
	{
		name: 'LabelTagging',
		package: '@atlassian/label-tagging',
		description:
			'An internal Platform Labs label field: a creatable multi-select that renders selected labels as coloured chips, with read-only rendering and loading/saving/error/validation states. Presentational only — consumers own data, persistence, analytics, permissions, and localisation.',
		status: 'early-access',
		usageGuidelines: [
			'Use to add/remove/create labels on an entity where the surface owns the label data and persistence.',
			'Bring your own data source: map it to the plain props contract (selected + onSearch/onSelectLabel/onCreateLabel/onRemoveLabel). Works with Relay, Apollo, or the unified gateway.',
			'Keep product-specific orchestration outside the component: feature gates, mutations, analytics, permissions, and error handling belong in the consuming provider.',
			'Selecting/creating/removing auto-saves through the callbacks — there is no save button; show in-flight state via isSaving.',
			'Do not pass Relay fragment refs or Apollo types; the component must stay data-source agnostic.',
		],
		contentGuidelines: [
			'Visible strings ship as localisable react-intl defaults; override any of them per-string via the messages prop using your own message descriptors.',
			'Keep the field label short and descriptive (for example "Labels").',
			'Use concise validation and error messages that explain how to proceed.',
		],
		accessibilityGuidelines: [
			'Render under the consuming product’s react-intl provider so all visible text is localized.',
			'In editable mode the field label is associated with the input; in read-only mode labels render as non-interactive tags.',
			'Do not rely on colour alone to convey meaning — label colour is decorative; the label text carries the meaning.',
		],
		keywords: ['label', 'labels', 'tag', 'tagging', 'multi-select', 'platform-labs', 'internal'],
		category: 'forms-and-input',
		examples: [
			"import React, { useCallback, useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport LabelTagging, { type LabelTaggingLabel } from '../src/label-tagging';\nconst availableLabels: LabelTaggingLabel[] = [\n\t{ id: 'frontend', name: 'frontend', color: 'blue' },\n\t{ id: 'platform', name: 'platform', color: 'purple' },\n\t{ id: 'design-system', name: 'design-system', color: 'teal' },\n];\nconst BasicLabelTaggingExample = (): React.JSX.Element => {\n\tconst [selectedLabels, setSelectedLabels] = useState<LabelTaggingLabel[]>([availableLabels[0]]);\n\tconst [labels, setLabels] = useState(availableLabels);\n\tconst searchLabels = useCallback(\n\t\tasync (query: string) =>\n\t\t\tlabels.filter((label) => label.name.toLowerCase().includes(query.toLowerCase())),\n\t\t[labels],\n\t);\n\tconst selectLabel = useCallback((label: LabelTaggingLabel) => {\n\t\tsetSelectedLabels((current) =>\n\t\t\tcurrent.some((selectedLabel) => selectedLabel.id === label.id)\n\t\t\t\t? current\n\t\t\t\t: [...current, label],\n\t\t);\n\t}, []);\n\tconst createLabel = useCallback((name: string) => {\n\t\tconst label: LabelTaggingLabel = { id: name.toLowerCase().replace(/\\s+/g, '-'), name };\n\t\tsetLabels((current) => [label, ...current]);\n\t\treturn label;\n\t}, []);\n\tconst removeLabel = useCallback((label: LabelTaggingLabel) => {\n\t\tsetSelectedLabels((current) =>\n\t\t\tcurrent.filter((selectedLabel) => selectedLabel.id !== label.id),\n\t\t);\n\t}, []);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<LabelTagging\n\t\t\t\tselected={selectedLabels}\n\t\t\t\tonSearch={searchLabels}\n\t\t\t\tonSelectLabel={selectLabel}\n\t\t\t\tonCreateLabel={createLabel}\n\t\t\t\tonRemoveLabel={removeLabel}\n\t\t\t/>\n\t\t</IntlProvider>\n\t);\n};\nexport default BasicLabelTaggingExample;",
			"import React, { useCallback, useMemo, useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport LabelTagging, { type LabelTaggingLabel } from '../src/label-tagging';\n// Mirrors a Jira integration: the shared component driven with Jira-flavoured labels\n// (coloured) and auto-save, alongside a read-only variant.\nconst availableLabels: readonly LabelTaggingLabel[] = [\n\t{ id: 'jira-frontend', name: 'frontend', color: 'blue' },\n\t{ id: 'jira-platform', name: 'platform', color: 'purple' },\n\t{ id: 'jira-design-system', name: 'design-system', color: 'teal' },\n\t{ id: 'jira-bug', name: 'bug', color: 'red' },\n];\nconst JiraLabelTaggingExample = (): React.JSX.Element => {\n\tconst [selectedLabels, setSelectedLabels] = useState<LabelTaggingLabel[]>([\n\t\tavailableLabels[0],\n\t\tavailableLabels[1],\n\t]);\n\tconst [isSaving, setIsSaving] = useState(false);\n\tconst searchLabels = useCallback(async (query: string) => {\n\t\tconst normalizedQuery = query.toLowerCase();\n\t\treturn availableLabels.filter(({ name }) => name.toLowerCase().includes(normalizedQuery));\n\t}, []);\n\tconst createLabel = useCallback(\n\t\tasync (name: string): Promise<LabelTaggingLabel> => ({ id: `jira-created-${name}`, name }),\n\t\t[],\n\t);\n\tconst persist = useCallback(async () => {\n\t\tsetIsSaving(true);\n\t\tawait new Promise<void>((resolve) => {\n\t\t\tsetTimeout(resolve, 300);\n\t\t});\n\t\tsetIsSaving(false);\n\t}, []);\n\tconst handlers = useMemo(\n\t\t() => ({\n\t\t\tonSelectLabel: (label: LabelTaggingLabel) => {\n\t\t\t\tsetSelectedLabels((labels) => [...labels, label]);\n\t\t\t\tvoid persist();\n\t\t\t},\n\t\t\tonRemoveLabel: (label: LabelTaggingLabel) => {\n\t\t\t\tsetSelectedLabels((labels) => labels.filter(({ id }) => id !== label.id));\n\t\t\t\tvoid persist();\n\t\t\t},\n\t\t}),\n\t\t[persist],\n\t);\n\tconst noop = useCallback(() => {}, []);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<LabelTagging\n\t\t\t\tselected={selectedLabels}\n\t\t\t\tonSearch={searchLabels}\n\t\t\t\tonCreateLabel={createLabel}\n\t\t\t\tisSaving={isSaving}\n\t\t\t\tmessages={{\n\t\t\t\t\tfieldLabel: { id: 'example.jira.auto-save', defaultMessage: 'Jira labels (auto-save)' },\n\t\t\t\t}}\n\t\t\t\t{...handlers}\n\t\t\t/>\n\t\t\t<LabelTagging\n\t\t\t\tselected={[availableLabels[2], availableLabels[3]]}\n\t\t\t\tonSearch={searchLabels}\n\t\t\t\tonSelectLabel={noop}\n\t\t\t\tonRemoveLabel={noop}\n\t\t\t\tisReadOnly\n\t\t\t\tmessages={{\n\t\t\t\t\tfieldLabel: { id: 'example.jira.read-only', defaultMessage: 'Jira labels (read-only)' },\n\t\t\t\t}}\n\t\t\t/>\n\t\t</IntlProvider>\n\t);\n};\nexport default JiraLabelTaggingExample;",
			"import React, { useCallback, useMemo, useState } from 'react';\nimport { IntlProvider } from 'react-intl';\nimport LabelTagging, { type LabelTaggingLabel } from '../src/label-tagging';\n// Mirrors a Confluence integration: the shared component driven with Confluence-flavoured\n// labels and auto-save, plus a read-only variant.\nconst availableLabels: readonly LabelTaggingLabel[] = [\n\t{ id: 'confluence-frontend', name: 'frontend', color: 'blue' },\n\t{ id: 'confluence-platform', name: 'platform', color: 'purple' },\n\t{ id: 'confluence-design-system', name: 'design-system', color: 'teal' },\n\t{ id: 'confluence-documentation', name: 'documentation', color: 'green' },\n];\nconst ConfluenceLabelTaggingExample = (): React.JSX.Element => {\n\tconst [selectedLabels, setSelectedLabels] = useState<LabelTaggingLabel[]>([\n\t\tavailableLabels[0],\n\t\tavailableLabels[1],\n\t]);\n\tconst [isSaving, setIsSaving] = useState(false);\n\tconst searchLabels = useCallback(async (query: string) => {\n\t\tconst normalizedQuery = query.toLowerCase();\n\t\treturn availableLabels.filter(({ name }) => name.toLowerCase().includes(normalizedQuery));\n\t}, []);\n\tconst createLabel = useCallback(\n\t\tasync (name: string): Promise<LabelTaggingLabel> => ({\n\t\t\tid: `confluence-created-${name}`,\n\t\t\tname,\n\t\t}),\n\t\t[],\n\t);\n\tconst persist = useCallback(async () => {\n\t\tsetIsSaving(true);\n\t\tawait new Promise<void>((resolve) => {\n\t\t\tsetTimeout(resolve, 300);\n\t\t});\n\t\tsetIsSaving(false);\n\t}, []);\n\tconst handlers = useMemo(\n\t\t() => ({\n\t\t\tonSelectLabel: (label: LabelTaggingLabel) => {\n\t\t\t\tsetSelectedLabels((labels) => [...labels, label]);\n\t\t\t\tvoid persist();\n\t\t\t},\n\t\t\tonRemoveLabel: (label: LabelTaggingLabel) => {\n\t\t\t\tsetSelectedLabels((labels) => labels.filter(({ id }) => id !== label.id));\n\t\t\t\tvoid persist();\n\t\t\t},\n\t\t}),\n\t\t[persist],\n\t);\n\tconst noop = useCallback(() => {}, []);\n\treturn (\n\t\t<IntlProvider locale=\"en\">\n\t\t\t<LabelTagging\n\t\t\t\tselected={selectedLabels}\n\t\t\t\tonSearch={searchLabels}\n\t\t\t\tonCreateLabel={createLabel}\n\t\t\t\tisSaving={isSaving}\n\t\t\t\tmessages={{\n\t\t\t\t\tfieldLabel: {\n\t\t\t\t\t\tid: 'example.confluence.auto-save',\n\t\t\t\t\t\tdefaultMessage: 'Confluence labels (auto-save)',\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t\t{...handlers}\n\t\t\t/>\n\t\t\t<LabelTagging\n\t\t\t\tselected={[availableLabels[2], availableLabels[3]]}\n\t\t\t\tonSearch={searchLabels}\n\t\t\t\tonSelectLabel={noop}\n\t\t\t\tonRemoveLabel={noop}\n\t\t\t\tisReadOnly\n\t\t\t\tmessages={{\n\t\t\t\t\tfieldLabel: {\n\t\t\t\t\t\tid: 'example.confluence.read-only',\n\t\t\t\t\t\tdefaultMessage: 'Confluence labels (read-only)',\n\t\t\t\t\t},\n\t\t\t\t}}\n\t\t\t/>\n\t\t</IntlProvider>\n\t);\n};\nexport default ConfluenceLabelTaggingExample;",
		],
		props: [
			{
				name: 'error',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				type: 'boolean',
			},
			{
				name: 'isReadOnly',
				type: 'boolean',
				description: '',
			},
			{
				name: 'isSaving',
				type: 'boolean',
			},
			{
				name: 'messages',
				type: '{ fieldLabel?: MessageDescriptor; placeholder?: MessageDescriptor; searchPrompt?: MessageDescriptor; noOptionsMessage?: MessageDescriptor; ... 5 more ...; readOnlyMessage?: MessageDescriptor; }',
				description:
					"Override any of the component's built-in strings with your own react-intl\nmessage descriptors. The component must be rendered under an IntlProvider.",
			},
			{
				name: 'onCreateLabel',
				type: '(name: string) => LabelTaggingLabel | Promise<LabelTaggingLabel>',
				description: '',
			},
			{
				name: 'onRemoveLabel',
				type: '(label: LabelTaggingLabel) => void',
				description: '',
			},
			{
				name: 'onSearch',
				type: '(query: string) => Promise<LabelTaggingLabel[]>',
				description: '',
			},
			{
				name: 'onSelectLabel',
				type: '(label: LabelTaggingLabel) => void',
				description: '',
			},
			{
				name: 'selected',
				type: 'LabelTaggingLabel[]',
				description: 'The currently selected labels (controlled).',
				isRequired: true,
			},
			{
				name: 'validationMessage',
				type: 'string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal',
			},
			{
				name: 'validationState',
				type: '"default" | "error" | "success"',
			},
		],
	},
	{
		name: 'LogoThirdParty',
		package: '@atlassian/logo-third-party',
		description:
			'Displays approved third-party brand icons as full-bleed assets inside an ADS Tile or hexagon.',
		status: 'early-access',
		usageGuidelines: [
			'Use for approved third-party product or integration icons that need to appear in an Atlassian interface.',
			'Import the generated icon component for the brand instead of importing custom SVG or image assets in your app.',
			'Import each logo from its own entry point, such as `@atlassian/logo-third-party/figma`.',
			'Use the `size` prop to match the surrounding Tile scale.',
			'Use `type="agent"` when the logo represents an AI agent or needs to align with Avatar hexagons.',
			'Use `@atlaskit/logo` for Atlassian-owned product icons and logos.',
			'Do not display third-party logos outside Tile. Logos in this package are always bordered and rendered on white Tile backgrounds.',
			'Contribute new logos by adding approved assets to the Brand Foundations Figma library, exporting the SVG into `logos_raw/icon`, and running the component generator.',
			'Do not edit generated logo entry points or the generated example logo list directly.',
		],
		contentGuidelines: [
			'Keep the default label when the icon identifies the brand.',
			'Provide a more specific label when the surrounding UI needs additional context, such as "Slack workspace".',
			'Pass `label=""` only when adjacent visible text already names the brand and the icon is decorative.',
			'Use the third-party brand name consistently with the approved source asset filename.',
			'Do not use this package for Atlassian product marks, wordmarks, or icon-and-text lockups.',
		],
		accessibilityGuidelines: [
			'By default, a third-party logo exposes the Tile as an image with an accessible name matching the third-party brand.',
			'Decorative icons must use an empty label `label=""` so assistive technologies do not announce duplicate content.',
			'Customize the label when the surrounding UI needs additional context, such as "Slack workspace".',
			'Do not rely on the inline SVG content for semantics; the wrapped SVG is hidden from assistive technologies and Tile owns the accessible name.',
			'Keep adjacent text and `label` values in sync so screen reader users do not hear contradictory brand names.',
		],
		designSource: {
			figmaUrl:
				'https://www.figma.com/design/BGz5AdkWe3yTIYdKnTSZuY/%F0%9F%8C%AE-ADS-Components?node-id=146761-5643&t=h4JPe8pHCk2eSYdj-4',
		},
		keywords: ['third-party', 'logo', 'brand', 'tile', 'platform-labs', 'integration'],
		category: 'images',
		examples: [
			'/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from \'@compiled/react\';\nimport { Box } from \'@atlaskit/primitives/compiled/box\';\nimport { Inline } from \'@atlaskit/primitives/compiled/inline\';\nimport { logos } from \'./utils/logos\';\nexport default function Basic(): JSX.Element {\n\treturn (\n\t\t<Box padding="space.400">\n\t\t\t<Inline space="space.150" rowSpace="space.150" alignBlock="center" shouldWrap>\n\t\t\t\t{logos.map(({ name, Component }) => (\n\t\t\t\t\t<Component key={name} />\n\t\t\t\t))}\n\t\t\t</Inline>\n\t\t</Box>\n\t);\n}',
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from '@compiled/react';\nimport Code from '@atlaskit/code/code';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport { Stack } from '@atlaskit/primitives/compiled/stack';\nimport { FigmaIcon } from '@atlassian/logo-third-party/figma';\nimport { SlackIcon } from '@atlassian/logo-third-party/slack';\nimport type { ThirdPartyLogoSize } from '@atlassian/logo-third-party/types';\nconst sizes: ThirdPartyLogoSize[] = ['xxsmall', 'xsmall', 'small', 'medium', 'large', 'xlarge'];\nexport default function Sizes(): JSX.Element {\n\treturn (\n\t\t<Box padding=\"space.200\">\n\t\t\t<Stack space=\"space.300\">\n\t\t\t\t{sizes.map((size) => (\n\t\t\t\t\t<Stack key={size} space=\"space.100\">\n\t\t\t\t\t\t<Inline>\n\t\t\t\t\t\t\t<Code>{size}</Code>\n\t\t\t\t\t\t</Inline>\n\t\t\t\t\t\t<Inline space=\"space.100\" alignBlock=\"center\">\n\t\t\t\t\t\t\t<SlackIcon size={size} />\n\t\t\t\t\t\t\t<FigmaIcon size={size} />\n\t\t\t\t\t\t\t<SlackIcon size={size} type=\"agent\" />\n\t\t\t\t\t\t\t<FigmaIcon size={size} type=\"agent\" />\n\t\t\t\t\t\t</Inline>\n\t\t\t\t\t</Stack>\n\t\t\t\t))}\n\t\t\t</Stack>\n\t\t</Box>\n\t);\n}",
			'/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from \'@compiled/react\';\nimport Avatar from \'@atlaskit/avatar/avatar\';\nimport { AvatarContent } from \'@atlaskit/avatar/avatar-content\';\nimport { FigmaIcon } from \'@atlassian/logo-third-party/figma\';\nexport default function AvatarExample(): JSX.Element {\n\treturn (\n\t\t<Avatar appearance="hexagon" name="Figma" size="medium">\n\t\t\t<AvatarContent>\n\t\t\t\t<FigmaIcon label="" size="medium" type="agent" />\n\t\t\t</AvatarContent>\n\t\t</Avatar>\n\t);\n}',
		],
		props: [
			{
				name: 'label',
				type: 'string',
				description:
					'Accessible text to describe the logo. Set to an empty string when the logo is decorative.',
				defaultValue: '"Figma"',
			},
			{
				name: 'size',
				type: '"xxsmall" | "xsmall" | "small" | "medium" | "large" | "xlarge"',
				description: 'The size of the logo tile.',
			},
			{
				name: 'type',
				type: '"app" | "agent"',
				description: 'The kind of entity the logo represents. Defaults to `app`.',
			},
		],
	},
	{
		name: 'TeamProfileHeader',
		package: '@atlassian/profile-header',
		description: 'A header component for team profiles, typically including a background image.',
		status: 'general-availability',
		usageGuidelines: [
			'Use TeamProfileHeader to display a banner or background image at the top of a team profile.',
			'Supports custom background images and fallback colors.',
		],
		keywords: ['profile', 'header', 'team', 'banner', 'identity'],
		category: 'media',
		examples: [
			"import React, { useEffect } from 'react';\nimport type { TeamWithImageUrls, User } from '@atlaskit/teams-client/types';\nimport { TeamStoreContainer, useTeamProfileDataState } from '@atlassian/teams';\nimport { selectField, toggleField } from '@atlassian/teams-app-internal-playground/fields';\nimport {\n\tPlayground,\n\ttype PlaygroundConfig,\n} from '@atlassian/teams-app-internal-playground/playground';\nimport { TeamProfileHeader } from '../src';\nconst TEAM_ID = 'example-team';\nconst config = {\n\tfields: [\n\t\tselectField({\n\t\t\tid: 'height',\n\t\t\tlabel: 'Height (px)',\n\t\t\ttype: 'select',\n\t\t\tdefaultValue: '192',\n\t\t\toptions: [\n\t\t\t\t{ label: '100', value: '100' },\n\t\t\t\t{ label: '192', value: '192' },\n\t\t\t\t{ label: '300', value: '300' },\n\t\t\t],\n\t\t}),\n\t\ttoggleField({\n\t\t\tid: 'isEditable',\n\t\t\tlabel: 'Editable',\n\t\t\ttype: 'toggle',\n\t\t\tdefaultValue: false,\n\t\t}),\n\t\ttoggleField({\n\t\t\tid: 'isHeaderDisabled',\n\t\t\tlabel: 'Header disabled (grayscale)',\n\t\t\ttype: 'toggle',\n\t\t\tdefaultValue: false,\n\t\t}),\n\t\ttoggleField({\n\t\t\tid: 'isDeactivated',\n\t\t\tlabel: 'Deactivated',\n\t\t\ttype: 'toggle',\n\t\t\tdefaultValue: false,\n\t\t}),\n\t],\n} satisfies PlaygroundConfig;\nconst exampleTeamData: TeamWithImageUrls = {\n\tid: TEAM_ID,\n\tdisplayName: 'Example team',\n\tdescription: '',\n\tstate: 'ACTIVE',\n\tmembershipSettings: 'OPEN',\n\trestriction: 'NO_RESTRICTION',\n\tlargeAvatarImageUrl: '',\n\tsmallAvatarImageUrl: '',\n\tlargeHeaderImageUrl: '',\n\tsmallHeaderImageUrl: '',\n};\nconst exampleUser: User = { id: 'current-user', fullName: 'Example user' };\n/**\n * Seeds the team sweet-state store with minimal data so that the\n * TeamProfileHeader HOC recognises the team ID and stops showing a spinner.\n */\nfunction SeedTeamStore({ children }: { children: React.ReactNode }) {\n\tconst [, actions] = useTeamProfileDataState();\n\tuseEffect(() => {\n\t\tactions.prefillTeamData(TEAM_ID, exampleTeamData, [], exampleUser);\n\t}, [actions]);\n\treturn <>{children}</>;\n}\nexport default function TeamProfileHeaderExample(): React.JSX.Element {\n\treturn (\n\t\t<Playground config={config}>\n\t\t\t{({ height, isEditable, isHeaderDisabled, isDeactivated }) => (\n\t\t\t\t<TeamStoreContainer scope=\"profile-header-example\">\n\t\t\t\t\t<SeedTeamStore>\n\t\t\t\t\t\t<TeamProfileHeader\n\t\t\t\t\t\t\tid={TEAM_ID}\n\t\t\t\t\t\t\tteamId={TEAM_ID}\n\t\t\t\t\t\t\ttype=\"team\"\n\t\t\t\t\t\t\taddFlag={() => {}}\n\t\t\t\t\t\t\theight={Number(height)}\n\t\t\t\t\t\t\tisEditable={isEditable}\n\t\t\t\t\t\t\tisHeaderDisabled={isHeaderDisabled}\n\t\t\t\t\t\t\tisDeactivated={isDeactivated}\n\t\t\t\t\t\t\tisOrgLoading={false}\n\t\t\t\t\t\t/>\n\t\t\t\t\t</SeedTeamStore>\n\t\t\t\t</TeamStoreContainer>\n\t\t\t)}\n\t\t</Playground>\n\t);\n}",
		],
		props: [
			{
				name: 'addFlag',
				type: '(options: Flag) => void',
				isRequired: true,
			},
			{
				name: 'defaultOpen',
				type: 'boolean',
			},
			{
				name: 'hasRoundCorners',
				type: 'boolean',
			},
			{
				name: 'height',
				type: 'number',
			},
			{
				name: 'id',
				type: 'string',
				description: 'User or Team id',
				isRequired: true,
			},
			{
				name: 'imgSrc',
				type: 'string',
			},
			{
				name: 'isDeactivated',
				type: 'boolean',
			},
			{
				name: 'isEditable',
				type: 'boolean',
			},
			{
				name: 'isHeaderDisabled',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				type: 'boolean',
			},
			{
				name: 'isOrgLoading',
				type: 'boolean',
				isRequired: true,
			},
			{
				name: 'orgId',
				type: 'string',
			},
			{
				name: 'profileHeaderMediaPickerUploadAttributes',
				type: '{ [x: string]: string | boolean; }',
				description:
					'Optional attributes merged into the profileHeaderMediaPickerUpload analytics event (e.g. isNewUserProfile).',
			},
			{
				name: 'teamId',
				type: 'string',
				isRequired: true,
			},
			{
				name: 'type',
				type: '"user" | "team"',
				isRequired: true,
			},
			{
				name: 'updateHeaderImage',
				type: '(fileId: string) => Promise<TeamWithImageUrls>',
			},
			{
				name: 'usePrimaryButtonStyle',
				type: 'boolean',
				description:
					'When true, uses the primary (information) button style for the cover image dropdown trigger.',
			},
		],
	},
	{
		name: 'UserProfileHeader',
		package: '@atlassian/profile-header',
		description: 'A header component for user profiles, typically including a background image.',
		status: 'general-availability',
		usageGuidelines: [
			'Use UserProfileHeader to display a banner or background image at the top of a user profile.',
			'Supports custom background images and fallback colors.',
		],
		keywords: ['profile', 'header', 'user', 'banner', 'identity'],
		category: 'media',
		examples: [
			"import { selectField, toggleField } from '@atlassian/teams-app-internal-playground/fields';\nimport {\n\tPlayground,\n\ttype PlaygroundConfig,\n} from '@atlassian/teams-app-internal-playground/playground';\nimport { UserProfileHeader } from '../src';\nconst config = {\n\tfields: [\n\t\tselectField({\n\t\t\tid: 'height',\n\t\t\tlabel: 'Height (px)',\n\t\t\ttype: 'select',\n\t\t\tdefaultValue: '192',\n\t\t\toptions: [\n\t\t\t\t{ label: '100', value: '100' },\n\t\t\t\t{ label: '192', value: '192' },\n\t\t\t\t{ label: '300', value: '300' },\n\t\t\t],\n\t\t}),\n\t\ttoggleField({\n\t\t\tid: 'isEditable',\n\t\t\tlabel: 'Editable',\n\t\t\ttype: 'toggle',\n\t\t\tdefaultValue: false,\n\t\t}),\n\t\ttoggleField({\n\t\t\tid: 'isHeaderDisabled',\n\t\t\tlabel: 'Header disabled (grayscale)',\n\t\t\ttype: 'toggle',\n\t\t\tdefaultValue: false,\n\t\t}),\n\t\ttoggleField({\n\t\t\tid: 'isDeactivated',\n\t\t\tlabel: 'Deactivated',\n\t\t\ttype: 'toggle',\n\t\t\tdefaultValue: false,\n\t\t}),\n\t],\n} satisfies PlaygroundConfig;\nexport default function UserProfileHeaderExample(): React.JSX.Element {\n\treturn (\n\t\t<Playground config={config}>\n\t\t\t{({ height, isEditable, isHeaderDisabled, isDeactivated }) => (\n\t\t\t\t<UserProfileHeader\n\t\t\t\t\tid=\"123\"\n\t\t\t\t\ttype=\"user\"\n\t\t\t\t\taddFlag={() => {}}\n\t\t\t\t\theight={Number(height)}\n\t\t\t\t\tisEditable={isEditable}\n\t\t\t\t\tisHeaderDisabled={isHeaderDisabled}\n\t\t\t\t\tisDeactivated={isDeactivated}\n\t\t\t\t/>\n\t\t\t)}\n\t\t</Playground>\n\t);\n}",
		],
		props: [
			{
				name: 'addFlag',
				type: '(options: Flag) => void',
				isRequired: true,
			},
			{
				name: 'defaultOpen',
				type: 'boolean',
			},
			{
				name: 'hasRoundCorners',
				type: 'boolean',
			},
			{
				name: 'height',
				type: 'number',
			},
			{
				name: 'id',
				type: 'string',
				description: 'User or Team id',
				isRequired: true,
			},
			{
				name: 'imgSrc',
				type: 'string',
			},
			{
				name: 'isDeactivated',
				type: 'boolean',
			},
			{
				name: 'isEditable',
				type: 'boolean',
			},
			{
				name: 'isHeaderDisabled',
				type: 'boolean',
			},
			{
				name: 'isLoading',
				type: 'boolean',
			},
			{
				name: 'orgId',
				type: 'string',
			},
			{
				name: 'profileHeaderMediaPickerUploadAttributes',
				type: '{ [x: string]: string | boolean; }',
				description:
					'Optional attributes merged into the profileHeaderMediaPickerUpload analytics event (e.g. isNewUserProfile).',
			},
			{
				name: 'type',
				type: '"user" | "team"',
				isRequired: true,
			},
			{
				name: 'updateHeaderImage',
				type: '(fileId: string) => Promise<TeamWithImageUrls>',
			},
			{
				name: 'usePrimaryButtonStyle',
				type: 'boolean',
				description:
					'When true, uses the primary (information) button style for the cover image dropdown trigger.',
			},
		],
	},
	{
		name: 'RovoChatSendButton',
		package: '@atlassian/rovo-chat-send-button',
		description:
			'Platform Labs icon-only button for Rovo chat or send actions. It composes the ADS rovo IconButton appearance with ArrowUpIcon.',
		status: 'early-access',
		usageGuidelines: [
			'Use for the primary Rovo chat/send action where the Rovo visual treatment and upward arrow send affordance are both required.',
			'Pass a contextual label, such as “Ask Rovo” or “Send message”, so the icon-only control has an accessible name.',
			'Keep product orchestration, analytics, pending state, and error handling in the consuming product.',
			'Use ADS IconButton directly for non-Rovo actions, non-chat actions, or actions that need a different icon or appearance.',
			'Do not add product-specific styling overrides; the visual treatment is owned by the ADS rovo IconButton and this Platform Labs wrapper.',
		],
		contentGuidelines: [
			'Use a short action-oriented label that describes the result of activating the button.',
			'Prefer product-specific labels when “Ask Rovo” is not the exact action, for example “Send message”.',
		],
		accessibilityGuidelines: [
			'The component inherits ADS IconButton button semantics, keyboard behavior, focus treatment, disabled state, selected state, and tooltip behavior.',
			'Do not rely on future animation alone to communicate success, error, or pending state.',
			'Motion is decorative and tokenized; labels and button semantics remain the source of truth for assistive technologies.',
		],
		keywords: ['rovo', 'chat', 'icon-button', 'send', 'arrow-up', 'ai', 'platform-labs'],
		category: 'buttons',
		examples: [
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from '@compiled/react';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport RovoChatSendButton from '../src/rovo-chat-send-button';\nexport default function Default(): JSX.Element {\n\treturn (\n\t\t<Box padding=\"space.200\">\n\t\t\t<RovoChatSendButton label=\"Ask Rovo\" />\n\t\t</Box>\n\t);\n}",
			"/**\n * @jsxRuntime classic\n * @jsx jsx\n */\nimport { jsx } from '@compiled/react';\nimport { Box } from '@atlaskit/primitives/compiled/box';\nimport { Inline } from '@atlaskit/primitives/compiled/inline';\nimport RovoChatSendButton from '../src/rovo-chat-send-button';\nconst noop = () => undefined;\nexport default function AllStates(): JSX.Element {\n\treturn (\n\t\t<Box padding=\"space.200\">\n\t\t\t<Inline space=\"space.200\">\n\t\t\t\t<RovoChatSendButton label=\"Ask Rovo\" onClick={noop} />\n\t\t\t\t<RovoChatSendButton\n\t\t\t\t\tisAgentTyping\n\t\t\t\t\tlabel=\"Send message\"\n\t\t\t\t\tonClick={noop}\n\t\t\t\t\tstopButtonProps={{\n\t\t\t\t\t\tlabel: 'Stop generating',\n\t\t\t\t\t\tonClick: noop,\n\t\t\t\t\t}}\n\t\t\t\t/>\n\t\t\t</Inline>\n\t\t</Box>\n\t);\n}",
		],
		props: [
			{
				name: 'autoFocus',
				type: 'boolean',
				description: 'Set the button to autofocus on mount.',
			},
			{
				name: 'isAgentTyping',
				type: 'boolean',
				description:
					'When `true`, the button morphs into the stop affordance. This is a plain\nboolean so it can be driven directly by state (e.g. `isAgentTyping={isBusy}`).\n\nWhenever this can become `true`, `stopButtonProps` must be provided so the\nstop affordance has an accessible label and handler (enforced at runtime in\ndevelopment).',
			},
			{
				name: 'isDisabled',
				type: 'boolean',
				description: 'Disable the button to prevent user interaction.',
			},
			{
				name: 'isSelected',
				type: 'boolean',
				description: 'Indicates that the button is selected.',
			},
			{
				name: 'isTooltipDisabled',
				type: 'boolean',
				description:
					'Prevents a tooltip with the label text from showing. Use sparingly, as most icon-only buttons benefit from a tooltip or some other text clarifying the action.',
			},
			{
				name: 'label',
				type: 'string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal',
				description: 'Provide an accessible label, often used by screen readers.',
				isRequired: true,
			},
			{
				name: 'onBlur',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
				description: 'Handler called on blur.',
			},
			{
				name: 'onClick',
				type: '(e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, analyticsEvent: UIAnalyticsEvent) => void',
				description:
					'Handler called on click. You can use the second argument to fire Atlaskit analytics events on custom channels. They could then be routed to GASv3 analytics. See the pressable or anchor primitive code examples for information on [firing Atlaskit analytics events](https://atlassian.design/components/primitives/pressable/examples#atlaskit-analytics) or [routing these to GASv3 analytics](https://atlassian.design/components/primitives/pressable/examples#gasv3-analytics).',
			},
			{
				name: 'onFocus',
				type: '(event: FocusEvent<HTMLButtonElement, Element>) => void',
				description: 'Handler called on focus.',
			},
			{
				name: 'shape',
				type: '"default" | "circle"',
				description: 'Set the shape of the icon, defaults to square with rounded corners.',
			},
			{
				name: 'spacing',
				type: '"default" | "compact"',
				description: 'Controls the amount of padding in the button.',
			},
			{
				name: 'stopButtonProps',
				type: 'Partial<RovoChatSendButtonBaseProps> & Required<Pick<RovoChatSendButtonBaseProps, "onClick" | "label">>',
				description:
					'Props for the stop affordance. Required in practice whenever\n`isAgentTyping` can be `true`.',
			},
			{
				name: 'tooltip',
				type: '{ testId?: string; analyticsContext?: Record<string, any>; content?: ReactNode | (({ update }: { update?: () => void; }) => ReactNode); component?: ComponentType<TooltipPrimitiveProps> | ForwardRefExoticComponent<...>; ... 15 more ...; shouldRenderToParent?: boolean; }',
				description: 'Props passed down to the Tooltip component.',
			},
		],
	},
	{
		name: 'AtlassianSwitcher',
		package: '@atlassian/switcher',
		description:
			'The main app switcher component. It fetches and displays the list of available products and apps for the current user and cloud instance.',
		status: 'general-availability',
		usageGuidelines: [
			'Provide the `product` and `cloudId` props to identify the current context.',
			'Typically rendered inside a `Popup` or `Drawer` triggered by an app switcher icon.',
		],
		keywords: ['switcher', 'navigation', 'app-switcher', 'atlassian'],
		category: 'navigation',
		examples: [
			"import AppSwitcherIcon from '@atlaskit/icon/core/app-switcher';\nimport Button from '@atlaskit/button/new';\nimport Popup from '@atlaskit/popup';\nimport { withIntlProviderMock } from '@atlassian/navigation-test-utils/intl-provider';\nimport { mockEndpoints } from '@atlassian/switcher-test-utils';\nimport AtlassianSwitcher from '../src';\nclass GenericSwitcherExample extends React.Component {\n\tstate = {\n\t\tisOpen: true,\n\t};\n\tcomponentDidMount() {\n\t\tmockEndpoints(\n\t\t\t'generic-product',\n\t\t\t(originalMockData) => {\n\t\t\t\treturn {\n\t\t\t\t\t...originalMockData,\n\t\t\t\t\tTHIRD_PARTY_BFF_DATA: {\n\t\t\t\t\t\tthirdPartyConfig: [\n\t\t\t\t\t\t\t{ type: 'figma', redirectionUrl: 'https://www.figma.com/' },\n\t\t\t\t\t\t\t{ type: 'slack', redirectionUrl: 'https://slack.com/' },\n\t\t\t\t\t\t\t{ type: 'notion', redirectionUrl: 'https://notion.com/' },\n\t\t\t\t\t\t],\n\t\t\t\t\t},\n\t\t\t\t};\n\t\t\t},\n\t\t\t{\n\t\t\t\tpermitted: 2000,\n\t\t\t\tappswitcher: 1500,\n\t\t\t},\n\t\t);\n\t}\n\topen = () => {\n\t\tthis.setState({\n\t\t\tisOpen: !this.state.isOpen,\n\t\t});\n\t};\n\tonClose = () => {\n\t\tthis.setState({\n\t\t\tisOpen: false,\n\t\t});\n\t};\n\trender() {\n\t\treturn (\n\t\t\t<div style={{ padding: '2rem' }}>\n\t\t\t\t<Popup\n\t\t\t\t\tonClose={this.onClose}\n\t\t\t\t\tisOpen={this.state.isOpen}\n\t\t\t\t\tcontent={() => <AtlassianSwitcher product=\"generic-product\" cloudId=\"some-cloud-id\" />}\n\t\t\t\t\ttrigger={(props) => (\n\t\t\t\t\t\t<Button {...props} type=\"button\" onClick={this.open}>\n\t\t\t\t\t\t\t<AppSwitcherIcon label=\"app switcher\" />\n\t\t\t\t\t\t</Button>\n\t\t\t\t\t)}\n\t\t\t\t\tshouldRenderToParent\n\t\t\t\t/>\n\t\t\t</div>\n\t\t);\n\t}\n}\nconst _default_1: (props: {}) => React.JSX.Element = withIntlProviderMock()(GenericSwitcherExample);\nexport default _default_1;",
			"import Button from '@atlaskit/button/new';\nimport Popup from '@atlaskit/popup';\nimport { withIntlProviderMock } from '@atlassian/navigation-test-utils/intl-provider';\nimport { mockEndpoints } from '@atlassian/switcher-test-utils';\nimport AtlassianSwitcher from '../src';\nclass JiraSwitcherExample extends React.Component {\n\tstate = {\n\t\tisOpen: true,\n\t};\n\tcomponentDidMount() {\n\t\tthis.open();\n\t}\n\topen = () => {\n\t\tmockEndpoints('jira', (originalMockData) => {\n\t\t\treturn {\n\t\t\t\t...originalMockData,\n\t\t\t\tTHIRD_PARTY_BFF_DATA: {\n\t\t\t\t\tthirdPartyConfig: [\n\t\t\t\t\t\t{ type: 'slack', redirectionUrl: 'https://slack.com/' },\n\t\t\t\t\t\t{ type: 'figma', redirectionUrl: 'https://figma.com/' },\n\t\t\t\t\t\t{ type: 'notion', redirectionUrl: 'https://notion.com/' },\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t};\n\t\t});\n\t\tthis.setState({\n\t\t\tisOpen: true,\n\t\t});\n\t};\n\tonClose = () => {\n\t\tthis.setState({\n\t\t\tisOpen: false,\n\t\t});\n\t};\n\trender() {\n\t\treturn (\n\t\t\t<div style={{ padding: '2rem' }}>\n\t\t\t\t<Popup\n\t\t\t\t\tonClose={this.onClose}\n\t\t\t\t\tisOpen={this.state.isOpen}\n\t\t\t\t\tcontent={() => <AtlassianSwitcher product=\"jira\" cloudId=\"some-cloud-id\" />}\n\t\t\t\t\ttrigger={(props) => (\n\t\t\t\t\t\t<Button {...props} type=\"button\" onClick={this.open}>\n\t\t\t\t\t\t\tOpen Jira switcher\n\t\t\t\t\t\t</Button>\n\t\t\t\t\t)}\n\t\t\t\t\tshouldRenderToParent\n\t\t\t\t/>\n\t\t\t</div>\n\t\t);\n\t}\n}\nconst _default_1: (props: {}) => React.JSX.Element = withIntlProviderMock()(JiraSwitcherExample);\nexport default _default_1;",
			"import Button from '@atlaskit/button/new';\nimport Popup from '@atlaskit/popup';\nimport { withIntlProviderMock } from '@atlassian/navigation-test-utils/intl-provider';\nimport { mockEndpoints } from '@atlassian/switcher-test-utils';\nimport AtlassianSwitcher from '../src';\nclass ConfluenceSwitcherExample extends React.Component {\n\tstate = {\n\t\tisOpen: true,\n\t};\n\tcomponentDidMount() {\n\t\tthis.open();\n\t}\n\topen = () => {\n\t\tmockEndpoints('confluence', (originalMockData) => {\n\t\t\treturn {\n\t\t\t\t...originalMockData,\n\t\t\t\tTHIRD_PARTY_BFF_DATA: {\n\t\t\t\t\tthirdPartyConfig: [\n\t\t\t\t\t\t{ type: 'slack', redirectionUrl: 'https://slack.com/' },\n\t\t\t\t\t\t{ type: 'figma', redirectionUrl: 'https://figma.com/' },\n\t\t\t\t\t\t{ type: 'notion', redirectionUrl: 'https://notion.com/' },\n\t\t\t\t\t],\n\t\t\t\t},\n\t\t\t};\n\t\t});\n\t\tthis.setState({\n\t\t\tisOpen: true,\n\t\t});\n\t};\n\tonClose = () => {\n\t\tthis.setState({\n\t\t\tisOpen: false,\n\t\t});\n\t};\n\trender() {\n\t\treturn (\n\t\t\t<div style={{ padding: '2rem' }}>\n\t\t\t\t<Popup\n\t\t\t\t\tonClose={this.onClose}\n\t\t\t\t\tisOpen={this.state.isOpen}\n\t\t\t\t\tcontent={() => <AtlassianSwitcher product=\"confluence\" cloudId=\"some-cloud-id\" />}\n\t\t\t\t\ttrigger={(props) => (\n\t\t\t\t\t\t<Button {...props} type=\"button\" onClick={this.open}>\n\t\t\t\t\t\t\tOpen Confluence switcher\n\t\t\t\t\t\t</Button>\n\t\t\t\t\t)}\n\t\t\t\t\tshouldRenderToParent\n\t\t\t\t/>\n\t\t\t</div>\n\t\t);\n\t}\n}\nconst _default_1: (props: {}) => React.JSX.Element =\n\twithIntlProviderMock()(ConfluenceSwitcherExample);\nexport default _default_1;",
		],
		props: [],
	},
];
