/* eslint-disable no-console */
/**
 * @jsxRuntime classic
 * @jsx jsx
 */
import React from 'react';

// eslint-disable-next-line @atlaskit/ui-styling-standard/use-compiled -- Ignored via go/DSP-18766
import { css, jsx } from '@emotion/react';

import type { InviteToEditComponentProps } from '@atlaskit/editor-common/collab';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type { OptionalPlugin, PublicPluginAPI } from '@atlaskit/editor-common/types';
import type { ExtensionPlugin } from '@atlaskit/editor-plugins/extension';
import { akEditorCodeBackground, akEditorCodeFontFamily } from '@atlaskit/editor-shared-styles';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import {
	TitleInput,
	getExampleExtensionProviders,
} from '@atlaskit/editor-test-helpers/example-helpers';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import type { ResolvingMentionProvider, MentionProvider } from '@atlaskit/mention/resource';
import type { ConfigResponse, ShareResponse } from '@atlaskit/share';
import { ShareDialogContainer } from '@atlaskit/share';
import type { OptionData, User } from '@atlaskit/smart-user-picker';
import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { token } from '@atlaskit/tokens';
import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import {
	mentionResourceProviderWithResolver,
	mentionResourceProviderWithResolver2,
} from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';

import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import type { EditorProps } from '../src';
import { Editor } from '../src';
import { usePresetContext } from '../src/presets/context';
import EditorContext from '../src/ui/EditorContext';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const content = css({
	padding: `0 ${token('space.250', '20px')}`,
	height: '100vh',
	background: '#fff',
	boxSizing: 'border-box',
	// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
	'& .ProseMirror': {
		// eslint-disable-next-line @atlaskit/ui-styling-standard/no-nested-selectors -- Ignored via go/DSP-18766
		'& pre': {
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			fontFamily: akEditorCodeFontFamily,
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			background: akEditorCodeBackground,
			padding: token('space.150', '12px'),
			// eslint-disable-next-line @atlaskit/ui-styling-standard/no-imported-style-values, @atlaskit/ui-styling-standard/no-unsafe-values -- Ignored via go/DSP-18766
			borderRadius: token('border.radius', '3px'),
		},
	},
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const columns = css({
	display: 'flex',
	flexDirection: 'row',
});

// eslint-disable-next-line @atlaskit/ui-styling-standard/no-exported-styles -- Ignored via go/DSP-18766
export const column = css({
	flex: '1 1 0',
});

const quickInsertProvider = quickInsertProviderFactory();

const shareClient = {
	share: () =>
		new Promise<ShareResponse>((resolve) => {
			setTimeout(
				() =>
					resolve({
						shareRequestId: 'c41e33e5-e622-4b38-80e9-a623c6e54cdd',
					}),
				3000,
			);
		}),
	getConfig: () =>
		new Promise<ConfigResponse>((resolve) => {
			setTimeout(
				() =>
					resolve({
						disableSharingToEmails: false,
					}),
				500,
			);
		}),
};

const userPropertiesToSearch: (keyof Pick<User, 'id' | 'name' | 'publicName'>)[] = [
	'id',
	'name',
	'publicName',
];

const loadUserOptions = (searchText?: string): OptionData[] => {
	if (!searchText) {
		return userPickerData;
	}

	return userPickerData
		.map((user: User) => ({
			...user,
			type: user.type || 'user',
		}))
		.filter((user: User) => {
			const searchTextInLowerCase = searchText.toLowerCase();
			return userPropertiesToSearch.some((property) => {
				const value = property && user[property];
				return !!(value && value.toLowerCase().includes(searchTextInLowerCase));
			});
		});
};

const mockOriginTracing = {
	id: 'id',
	addToUrl: (l: string) => `${l}&atlOrigin=mockAtlOrigin`,
	toAnalyticsAttributes: () => ({
		originIdGenerated: 'id',
		originProduct: 'product',
	}),
};

export const InviteToEditButton = (props: InviteToEditComponentProps) => {
	return (
		<ShareDialogContainer
			cloudId="cloudId"
			shareClient={shareClient}
			loadUserOptions={loadUserOptions}
			originTracingFactory={() => mockOriginTracing}
			productId="confluence"
			renderCustomTriggerButton={({ isSelected, onClick }: any): any =>
				React.cloneElement(props.children, {
					onClick,
					selected: isSelected,
				})
			}
			shareAri="ari"
			shareContentType="draft"
			shareLink={window && window.location.href}
			shareTitle="title"
			showFlags={() => {}}
		/>
	);
};

interface DropzoneEditorWrapperProps {
	children: (container: HTMLElement) => React.ReactNode;
}

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class DropzoneEditorWrapper extends React.Component<DropzoneEditorWrapperProps, {}> {
	dropzoneContainer: HTMLElement | null = null;

	handleRef = (node: HTMLDivElement) => {
		this.dropzoneContainer = node;
		this.forceUpdate();
	};

	render() {
		return (
			<div css={content} ref={this.handleRef}>
				{this.dropzoneContainer ? this.props.children(this.dropzoneContainer) : null}
			</div>
		);
	}
}

const mediaProvider1 = storyMediaProviderFactory();
const mediaProvider2 = storyMediaProviderFactory();
const mentionProvider2 = Promise.resolve<ResolvingMentionProvider>(
	mentionResourceProviderWithResolver2,
);
export type Props = {};

interface PropOptions {
	sessionId: string;
	mediaProvider: Promise<MediaProvider>;
	mentionProvider?: Promise<MentionProvider>;
	inviteHandler?: (event: React.MouseEvent<HTMLElement>) => void;
	parentContainer: any;
	inviteToEditComponent?: React.ComponentType<InviteToEditComponentProps>;
	editorApi: PublicPluginAPI<[OptionalPlugin<ExtensionPlugin>]> | undefined;
}

const editorProps = ({
	sessionId,
	mediaProvider,
	mentionProvider,
	inviteHandler,
	inviteToEditComponent,
	parentContainer,
	editorApi,
}: PropOptions): EditorProps => ({
	appearance: 'full-page',
	allowAnalyticsGASV3: true,
	allowBreakout: true,
	allowLayouts: {
		allowBreakout: true,
		UNSAFE_addSidebarLayouts: true,
		UNSAFE_allowSingleColumnLayout: true,
	},
	allowRule: true,
	allowStatus: true,
	allowTextColor: true,
	allowDate: true,
	allowPanel: true,
	allowFindReplace: true,
	featureFlags: {
		showAvatarGroupAsPlugin: true,
		collabAvatarScroll: true,
		twoLineEditorToolbar: true,
	},
	allowTables: {
		advanced: true,
	},
	extensionProviders: (editorActions) => [getExampleExtensionProviders(editorApi, editorActions)],
	allowExtension: { allowBreakout: true },
	macroProvider: Promise.resolve(macroProvider),
	smartLinks: {
		provider: Promise.resolve(cardProviderStaging),
	},
	allowExpand: {
		allowInsertion: true,
		allowInteractiveExpand: true,
	},
	allowTemplatePlaceholders: { allowInserting: true },
	media: {
		provider: mediaProvider,
		allowMediaSingle: true,
		customDropzoneContainer: parentContainer,
		featureFlags: {
			mediaInline: true,
		},
	},
	emojiProvider: getEmojiProvider(),
	mentionProvider: Promise.resolve(mentionProvider || mentionResourceProviderWithResolver),

	taskDecisionProvider: Promise.resolve(getMockTaskDecisionResource()),
	contextIdentifierProvider: storyContextIdentifierProviderFactory(),
	collabEdit: {
		provider: createCollabEditProvider({ userId: sessionId }),
		inviteToEditHandler: inviteHandler,
		inviteToEditComponent,
	},
	sanitizePrivateContent: true,
	placeholder: 'Write something...',
	shouldFocus: false,
	quickInsert: { provider: Promise.resolve(quickInsertProvider) },
	contentComponents: <TitleInput innerRef={(ref) => ref && ref.focus()} />,
	primaryToolbarComponents: undefined,
	extensionHandlers: extensionHandlers,
});

const Comp = ({ parentContainer }: { parentContainer: HTMLElement }) => {
	const editorApi = usePresetContext<StackPlugins>();
	return (
		<Editor
			{...editorProps({
				sessionId: 'morty',
				mediaProvider: mediaProvider2,
				mentionProvider: mentionProvider2,
				parentContainer,
				inviteToEditComponent: InviteToEditButton,
				editorApi,
			})}
		/>
	);
};

const Comp2 = ({ parentContainer }: { parentContainer: HTMLElement }) => {
	const editorApi = usePresetContext<StackPlugins>();

	return (
		<Editor
			{...editorProps({
				sessionId: 'rick',
				mediaProvider: mediaProvider1,
				parentContainer,
				inviteToEditComponent: InviteToEditButton,
				editorApi,
			})}
		/>
	);
};

// Ignored via go/ees005
// eslint-disable-next-line @repo/internal/react/no-class-components
class Example extends React.Component<Props> {
	render() {
		return (
			<div>
				<div css={columns} id="left">
					<div css={column}>
						<DropzoneEditorWrapper>
							{(parentContainer) => (
								<EditorContext>
									<Comp2 parentContainer={parentContainer} />
								</EditorContext>
							)}
						</DropzoneEditorWrapper>
					</div>
					<div css={column} id="right">
						<DropzoneEditorWrapper>
							{(parentContainer) => (
								<EditorContext>
									<Comp parentContainer={parentContainer} />
								</EditorContext>
							)}
						</DropzoneEditorWrapper>
					</div>
				</div>
			</div>
		);
	}
}

export default Example;
