/* eslint-disable no-console */
/** @jsx jsx */
import { css, jsx } from '@emotion/react';
import React from 'react';
import { borderRadius } from '@atlaskit/theme/constants';
import type { ShareResponse, ConfigResponse } from '@atlaskit/share';
import { ShareDialogContainer } from '@atlaskit/share';

import { getEmojiProvider } from '@atlaskit/util-data-test/get-emoji-provider';
import {
  mentionResourceProviderWithResolver,
  mentionResourceProviderWithResolver2,
} from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import { userPickerData } from '@atlaskit/util-data-test/user-picker-data';

import type { OptionData, User } from '@atlaskit/smart-user-picker';
import { cardProviderStaging } from '@atlaskit/editor-test-helpers/card-provider';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import quickInsertProviderFactory from '../example-helpers/quick-insert-provider';
import { extensionHandlers } from '@atlaskit/editor-test-helpers/extensions';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { customInsertMenuItems } from '@atlaskit/editor-test-helpers/mock-insert-menu';
import {
  akEditorCodeBackground,
  akEditorCodeBlockPadding,
  akEditorCodeFontFamily,
} from '@atlaskit/editor-shared-styles';

import type { EditorProps } from './../src';
import { Editor } from './../src';
import EditorContext from './../src/ui/EditorContext';

import { createCollabEditProvider } from '@atlaskit/synchrony-test-helpers';
import { TitleInput } from '../example-helpers/PageElements';
import type { MentionProvider } from '../src';
import type { MediaProvider } from '@atlaskit/editor-common/provider-factory';
import type { InviteToEditComponentProps } from '../src/plugins/collab-edit/types';
import type { ResolvingMentionProvider } from '@atlaskit/mention/resource';

import { macroProvider } from '@atlaskit/editor-test-helpers/mock-macro-provider';
import { getExampleExtensionProviders } from '../example-helpers/get-example-extension-providers';
import type { ExtensionPlugin } from '@atlaskit/editor-plugin-extension';
import type {
  PublicPluginAPI,
  OptionalPlugin,
} from '@atlaskit/editor-common/types';
import { usePresetContext } from '../src/presets/context';

type StackPlugins = [OptionalPlugin<ExtensionPlugin>];

export const content = css`
  padding: 0 20px;
  height: 100vh;
  background: #fff;
  box-sizing: border-box;

  & .ProseMirror {
    & pre {
      font-family: ${akEditorCodeFontFamily};
      background: ${akEditorCodeBackground};
      padding: ${akEditorCodeBlockPadding};
      border-radius: ${borderRadius()}px;
    }
  }
`;

export const columns = css`
  display: flex;
  flex-direction: row;
`;

export const column = css`
  flex: 1 1 0;
`;

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

const userPropertiesToSearch: (keyof Pick<
  User,
  'id' | 'name' | 'publicName'
>)[] = ['id', 'name', 'publicName'];

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

class DropzoneEditorWrapper extends React.Component<
  DropzoneEditorWrapperProps,
  {}
> {
  dropzoneContainer: HTMLElement | null = null;

  handleRef = (node: HTMLDivElement) => {
    this.dropzoneContainer = node;
    this.forceUpdate();
  };

  render() {
    return (
      <div css={content} ref={this.handleRef}>
        {this.dropzoneContainer
          ? this.props.children(this.dropzoneContainer)
          : null}
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
  hideAvatarGroup: true,
  featureFlags: {
    showAvatarGroupAsPlugin: true,
    collabAvatarScroll: true,
    twoLineEditorToolbar: true,
  },
  allowTables: {
    advanced: true,
  },
  extensionProviders: (editorActions) => [
    getExampleExtensionProviders(editorApi, editorActions),
  ],
  allowExtension: { allowAutoSave: true, allowBreakout: true },
  macroProvider: Promise.resolve(macroProvider),
  smartLinks: {
    provider: Promise.resolve(cardProviderStaging),
  },
  allowExpand: true,
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
  mentionProvider: Promise.resolve(
    mentionProvider || mentionResourceProviderWithResolver,
  ),

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
  insertMenuItems: customInsertMenuItems,
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
