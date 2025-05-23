/* eslint-disable no-console */
import React from 'react';
import { scrubAdf } from '@atlaskit/adf-utils/scrub';
import type { ADFEntity } from '@atlaskit/adf-utils/types';
import { getEmojiResource } from '@atlaskit/util-data-test/get-emoji-resource';
import { simpleMockProfilecardClient } from '@atlaskit/util-data-test/get-mock-profilecard-client';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import type { CardEvent, InlineCardEvent } from '@atlaskit/media-card';
import { defaultSchema } from '@atlaskit/adf-schema/schema-default';
import type { ExtensionHandlers } from '@atlaskit/editor-common/extensions';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import type { ADFStage } from '@atlaskit/editor-common/validator';
import type { AnnotationProviders } from '@atlaskit/editor-common/types';
import type { CardSurroundings, EventHandlers } from '@atlaskit/editor-common/ui';
import type { UnsupportedContentLevelsTracking } from '@atlaskit/editor-common/utils';
import Button from '@atlaskit/button';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';

import Clock from 'react-live-clock';

import { document as storyDataDocument } from './story-data';
import type { RendererProps } from '../../src/ui/renderer-props';
import { default as Renderer } from '../../src/ui/Renderer';

import { renderDocument } from '../../src';
import TextSerializer from '../../src/text';

import Sidebar, { getDefaultShowSidebarState } from './NavigationNext';
import type { RendererAppearance, HeadingAnchorLinksProps } from '../../src/ui/Renderer/types';
import { CodeBlock } from '@atlaskit/code';
import type { MentionProvider } from '@atlaskit/mention/types';
import type { Schema } from '@atlaskit/editor-prosemirror/model';
import type { MediaOptions } from '@atlaskit/editor-plugin-media/types';

import { token } from '@atlaskit/tokens';

const MockProfileClient: any = simpleMockProfilecardClient();

const mentionProvider = Promise.resolve({
	shouldHighlightMention(mention: { id: string }) {
		return mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE';
	},
} as MentionProvider);

const mediaProvider = storyMediaProviderFactory();

const emojiProvider = getEmojiResource();

const profilecardProvider = Promise.resolve({
	cloudId: 'DUMMY-CLOUDID',
	resourceClient: MockProfileClient,
	getActions: (id: string) => {
		const actions = [
			{
				label: 'Mention',
				callback: () => console.log('profile-card:mention'),
			},
			{
				label: 'Message',
				callback: () => console.log('profile-card:message'),
			},
		];

		return id === '1' ? actions : actions.slice(0, 1);
	},
});

const taskDecisionProvider = Promise.resolve(getMockTaskDecisionResource());

const contextIdentifierProvider = storyContextIdentifierProviderFactory();

const providerFactory = ProviderFactory.create({
	mentionProvider,
	mediaProvider,
	emojiProvider,
	profilecardProvider,
	taskDecisionProvider,
	contextIdentifierProvider,
});

const extensionHandlers: ExtensionHandlers = {
	'com.atlassian.fabric': (ext) => {
		const { extensionKey } = ext;

		switch (extensionKey) {
			case 'clock':
				return <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} />;
			default:
				return null;
		}
	},
	// Simulates confluence bodied extensions
	'com.atlassian.confluence.macro.core': (ext, doc, actions) => {
		return (
			<Renderer
				document={{ type: 'doc', version: 1, content: ext.content as any }}
				useSpecBasedValidator={true}
				adfStage="stage0"
			/>
		);
	},
};

const eventHandlers: EventHandlers = {
	mention: {
		onClick: () => console.log('onMentionClick'),
		onMouseEnter: () => console.log('onMentionMouseEnter'),
		onMouseLeave: () => console.log('onMentionMouseLeave'),
	},
	media: {
		onClick: (
			result: CardEvent | InlineCardEvent,
			surroundings?: CardSurroundings,
			analyticsEvent?: any,
		) => {
			// json-safe-stringify does not handle cyclic references in the react mouse click event
			return console.log(
				'onMediaClick',
				'[react.MouseEvent]',
				result.mediaItemDetails,
				surroundings,
				analyticsEvent,
			);
		},
	},
};

interface DemoRendererProps {
	withPortal?: boolean;
	withProviders?: boolean;
	withExtension?: boolean;
	disableSidebar?: boolean;
	disableEventHandlers?: boolean;
	serializer: 'react' | 'text' | 'email';
	document?: object;
	showHowManyCopies?: boolean;
	appearance?: RendererAppearance;
	maxHeight?: number;
	fadeOutHeight?: number;
	truncationEnabled?: boolean;
	allowHeadingAnchorLinks?: HeadingAnchorLinksProps;
	allowColumnSorting?: boolean;
	allowAnnotations?: boolean;
	allowCopyToClipboard?: boolean;
	allowWrapCodeBlock?: boolean;
	allowPlaceholderText?: boolean;
	allowCustomPanels?: boolean;
	copies?: number;
	schema?: Schema;
	adfStage?: ADFStage;
	actionButtons?: React.ReactNode;
	annotationProvider?: AnnotationProviders | null;
	useSpecBasedValidator?: boolean;
	allowUgcScrubber?: boolean;
	allowSelectAllTrap?: boolean;
	onDocumentChange?: () => void;
	analyticsEventSeverityTracking?: {
		enabled: boolean;
		severityNormalThreshold: number;
		severityDegradedThreshold: number;
	};
	extensionHandlers?: ExtensionHandlers;
	unsupportedContentLevelsTracking?: UnsupportedContentLevelsTracking;
	mediaOptions?: MediaOptions;
	UNSTABLE_allowTableAlignment?: boolean;
	UNSTABLE_allowTableResizing?: boolean;
}

interface DemoRendererState {
	input: string;
	portal?: HTMLElement;
	truncated: boolean;
	showSidebar: boolean;
	shouldUseEventHandlers: boolean;
	copies?: number;
	scrubbedAdf?: ADFEntity;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
export default class RendererDemo extends React.Component<DemoRendererProps, DemoRendererState> {
	textSerializer = new TextSerializer(this.props.schema ? this.props.schema : defaultSchema);
	emailRef?: HTMLIFrameElement;
	inputBox?: HTMLTextAreaElement | null;
	inputCopies?: HTMLInputElement | null;
	emailTextareaRef?: any;

	constructor(props: DemoRendererProps) {
		super(props);

		const doc = !!this.props.document ? this.props.document : storyDataDocument;

		// Prevent browser retain the previous scroll position when refresh,
		// This code is necessary for pages with scrollable body to avoid two scroll actions.
		// For pages such as confluence(with a scrollable div), this code is not necessary.
		if (props.allowHeadingAnchorLinks && history.scrollRestoration === 'auto') {
			history.scrollRestoration = 'manual';
		}

		this.state = {
			input: JSON.stringify(doc, null, 2),
			truncated: true,
			showSidebar: getDefaultShowSidebarState(false),
			shouldUseEventHandlers: false,
			copies: props.copies || 1,
			scrubbedAdf: undefined,
		};
	}

	componentDidUpdate(prevProps: DemoRendererProps, prevState: DemoRendererState) {
		if (this.state.input && prevState.input !== this.state.input && this.props.onDocumentChange) {
			this.props.onDocumentChange();
		}

		if (this.props.document && prevProps.document !== this.props.document) {
			this.setState({
				input: JSON.stringify(this.props.document, null, 2),
			});
		}
	}

	private handlePortalRef = (portal: HTMLElement | null) => {
		this.setState({ portal: portal || undefined });
	};

	render() {
		if (this.props.disableSidebar) {
			return this.renderExampleContent({});
		}

		return (
			<Sidebar showSidebar={this.state.showSidebar}>
				{(additionalRendererProps: object) => this.renderExampleContent(additionalRendererProps)}
			</Sidebar>
		);
	}

	private toggleTruncated = () => {
		this.setState((prevState) => ({
			truncated: !prevState.truncated,
		}));
	};

	private renderExampleContent(additionalRendererProps: object) {
		return (
			<div
				// eslint-disable-next-line react/no-string-refs -- Ignored via go/ED-25883
				ref="root"
				// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
				style={{ position: 'relative', padding: token('space.250', '20px') }}
			>
				{/* eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766 */}
				<fieldset style={{ marginBottom: token('space.250', '20px') }}>
					<legend>Input</legend>
					{/* eslint-disable-next-line @atlaskit/design-system/no-html-textarea */}
					<textarea
						id="renderer-value-input"
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							boxSizing: 'border-box',
							border: `1px solid ${token('color.border.input', 'lightgray')}`,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontFamily: 'monospace',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							fontSize: 16,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							padding: token('space.150', '12px'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							width: '100%',
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							height: 320,
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							resize: 'vertical',
						}}
						ref={(ref) => {
							this.inputBox = ref;
						}}
						onChange={this.onDocumentChange}
						value={this.state.input}
					/>
					{this.props.disableSidebar ? null : (
						<button onClick={this.toggleSidebar}>Toggle Sidebar</button>
					)}
					{this.props.disableEventHandlers ? null : (
						<button onClick={this.toggleEventHandlers}>Toggle Event handlers</button>
					)}
					{this.props.allowUgcScrubber && <button onClick={this.scrubAdf}>Scrub content</button>}
					{this.props.showHowManyCopies && (
						<input
							type="number"
							ref={(ref) => {
								this.inputCopies = ref;
							}}
							onChange={this.onCopiesChange}
							value={this.state.copies}
						/>
					)}
					{this.props.actionButtons}
					{this.state.scrubbedAdf ? (
						<CodeBlock text={JSON.stringify(this.state.scrubbedAdf, null, 2)} language="JSON" />
					) : null}
				</fieldset>

				{this.renderRenderer(additionalRendererProps)}
				{this.renderText()}
			</div>
		);
	}

	private renderRenderer(additionalRendererProps: any) {
		const { shouldUseEventHandlers, copies } = this.state;
		if (this.props.serializer !== 'react') {
			return null;
		}

		try {
			let props: RendererProps = {
				document: JSON.parse(this.state.input),
			};

			// Order of importance
			// 1. schema
			// 2. adfStage
			// 3. default to adfStage = 'stage0'
			if (this.props.schema) {
				props.schema = this.props.schema;
			} else {
				props.adfStage = this.props.adfStage ?? 'stage0';
			}

			if (this.props.withProviders) {
				props.eventHandlers = shouldUseEventHandlers ? eventHandlers : undefined;
				props.dataProviders = providerFactory;
			}

			if (this.props.withExtension) {
				props.extensionHandlers = {
					...extensionHandlers,
					...(this.props.extensionHandlers || {}),
				};
			}

			if (this.props.withPortal) {
				props.portal = this.state.portal;
			}

			props.maxHeight = this.props.maxHeight;
			props.fadeOutHeight = this.props.fadeOutHeight;
			props.truncated = this.props.truncationEnabled && this.state.truncated;
			props.allowColumnSorting = this.props.allowColumnSorting;
			props.allowAnnotations = this.props.allowAnnotations;
			props.allowHeadingAnchorLinks = this.props.allowHeadingAnchorLinks;
			props.useSpecBasedValidator = this.props.useSpecBasedValidator;
			props.allowCopyToClipboard = this.props.allowCopyToClipboard;
			props.allowWrapCodeBlock = this.props.allowWrapCodeBlock;
			props.allowPlaceholderText = this.props.allowPlaceholderText;
			props.allowCustomPanels = this.props.allowCustomPanels;
			props.analyticsEventSeverityTracking = this.props.analyticsEventSeverityTracking;
			props.allowUgcScrubber = this.props.allowUgcScrubber;
			props.allowSelectAllTrap = this.props.allowSelectAllTrap;
			props.unsupportedContentLevelsTracking = this.props.unsupportedContentLevelsTracking;
			props.media = this.props.mediaOptions;
			props.UNSTABLE_allowTableAlignment = this.props.UNSTABLE_allowTableAlignment;
			props.UNSTABLE_allowTableResizing = this.props.UNSTABLE_allowTableResizing;

			if (props.allowAnnotations) {
				props.annotationProvider = this.props.annotationProvider;
			}

			if (additionalRendererProps) {
				props = {
					...props,
					...additionalRendererProps,
				};
			}

			props.featureFlags = {
				...props.featureFlags,
			};

			props.appearance = this.props.appearance;

			const expandButton = (
				<div>
					<Button appearance={'link'} spacing={'none'} onClick={this.toggleTruncated}>
						{this.state.truncated ? 'Expand text' : 'Collapse text'}
					</Button>
					&nbsp;&middot;&nbsp;
					<Button appearance={'link'} spacing={'none'}>
						Do something else
					</Button>
				</div>
			);

			return (
				<div>
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							color: token('color.text.subtle', '#ccc'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginBottom: token('space.100', '8px'),
						}}
					>
						&lt;Renderer&gt;
					</div>
					<div id="RendererOutput">
						{Array.from({ length: copies || 1 }).map((_, index) => (
							// Ignored via go/ees005
							// eslint-disable-next-line react/no-array-index-key
							<Renderer key={index} {...props} />
						))}
					</div>
					{this.props.truncationEnabled ? expandButton : null}
					<div
						style={{
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							color: token('color.text.subtle', '#ccc'),
							// eslint-disable-next-line @atlaskit/ui-styling-standard/enforce-style-prop -- Ignored via go/DSP-18766
							marginTop: token('space.100', '8px'),
						}}
					>
						&lt;/Renderer&gt;
					</div>
					<div ref={this.handlePortalRef} />
				</div>
			);
		} catch (ex) {
			return <pre>Invalid document: {ex instanceof Error ? ex.stack : String(ex)}</pre>;
		}
	}

	private renderText = () => {
		if (this.props.serializer !== 'text') {
			return null;
		}

		try {
			const doc = JSON.parse(this.state.input);

			return (
				<div>
					<h1>Text output</h1>
					<pre>{renderDocument(doc, this.textSerializer).result}</pre>
				</div>
			);
		} catch (ex) {
			return null;
		}
	};

	private toggleSidebar = () => {
		this.setState((prevState) => ({ showSidebar: !prevState.showSidebar }));
	};

	private toggleEventHandlers = () => {
		this.setState((prevState) => ({
			shouldUseEventHandlers: !prevState.shouldUseEventHandlers,
		}));
	};

	private onDocumentChange = () => {
		if (this.inputBox) {
			this.setState({ input: this.inputBox.value });
		}
	};

	private onCopiesChange = () => {
		if (this.inputCopies) {
			this.setState({ copies: Number(this.inputCopies.value) });
		}
	};

	private scrubAdf = () => {
		const scrubbedAdf = scrubAdf(JSON.parse(this.state.input)) || undefined;
		this.setState({ scrubbedAdf });
	};
}
