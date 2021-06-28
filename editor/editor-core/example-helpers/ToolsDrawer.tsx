import React from 'react';
import { EditorView } from 'prosemirror-view';
import {
  currentUser,
  getEmojiProvider,
} from '@atlaskit/util-data-test/get-emoji-provider';
import { mentionResourceProvider } from '@atlaskit/util-data-test/mention-story-data';
import { getMockTaskDecisionResource } from '@atlaskit/util-data-test/task-decision-story-data';
import Button from '@atlaskit/button/custom-theme-button';
import Tooltip from '@atlaskit/tooltip';

import { MockActivityResource } from './activity-provider';
import { Content, ButtonGroup } from './styles';
import imageUploadHandler from './imageUpload';

import { TeamMentionResource, MentionResource, EmojiResource } from '../src';
import { toJSON } from '../src/utils';
import { storyContextIdentifierProviderFactory } from '@atlaskit/editor-test-helpers/context-identifier-provider';
import { storyMediaProviderFactory } from '@atlaskit/editor-test-helpers/media-provider';
import { createEditorMediaMock } from '@atlaskit/editor-test-helpers/media-mock';

import { AnalyticsListener } from '@atlaskit/analytics-next';
import { SmartMentionResource, SmartMentionConfig } from '@atlaskit/mention';

const mediaMock = createEditorMediaMock();
const rejectedPromise = Promise.reject(
  new Error('Simulated provider rejection'),
);
const pendingPromise = new Promise<any>(() => {});

// https://pug.jira-dev.com
const testCloudId = 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5';

const teamMentionConfig = {
  url: 'https://api-private.stg.atlassian.com/teams/mentions',
  productId: 'micros-group/confluence',
  // can highlight current mention user by using
  // shouldHighlightMention: mention => mention.id === currentUserId,
};

const userMentionConfig = {
  url: `https://api-private.stg.atlassian.com/mentions/${testCloudId}`,
  productId: 'micros-group/confluence',
};

const smartMentionConfig: SmartMentionConfig = {
  env: 'local',
  productKey: 'confluence',
  siteId: 'DUMMY-a5a01d21-1cc3-4f29-9565-f2bb8cd969f5',
  includeGroups: true,
  includeTeams: true,
  principalId: 'Context',
};

const providers = {
  mentionProvider: {
    resolved: Promise.resolve(mentionResourceProvider),
    external: Promise.resolve(new MentionResource(userMentionConfig)),
    pending: pendingPromise,
    rejected: rejectedPromise,
    teamMentionResource: Promise.resolve(
      new TeamMentionResource(userMentionConfig, teamMentionConfig),
    ),
    smartMentionResource: Promise.resolve(
      new SmartMentionResource(smartMentionConfig),
    ),
    undefined: undefined,
  },
  emojiProvider: {
    resolved: getEmojiProvider({
      uploadSupported: true,
      currentUser,
    }),
    external: Promise.resolve(
      new EmojiResource({
        providers: [
          {
            url: 'https://api-private.stg.atlassian.com/emoji/standard',
          },
          {
            url: `https://api-private.stg.atlassian.com/emoji/${testCloudId}/site`,
          },
        ],
        allowUpload: true,
      }),
    ),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  taskDecisionProvider: {
    resolved: Promise.resolve(getMockTaskDecisionResource()),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  contextIdentifierProvider: {
    resolved: storyContextIdentifierProviderFactory(),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  mediaProvider: {
    resolved: storyMediaProviderFactory(),
    'resolved (no auth provider)': storyMediaProviderFactory({
      useMediaPickerAuthProvider: false,
    }),

    pending: pendingPromise,
    rejected: rejectedPromise,
    'view only': storyMediaProviderFactory({
      includeUploadMediaClientConfig: false,
    }),
    'w/o userAuthProvider': storyMediaProviderFactory({
      includeUserAuthProvider: false,
    }),

    undefined: undefined,
  },
  activityProvider: {
    resolved: new MockActivityResource(),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
  imageUploadProvider: {
    resolved: Promise.resolve(imageUploadHandler),
    pending: pendingPromise,
    rejected: rejectedPromise,
    undefined: undefined,
  },
};
rejectedPromise.catch(() => {});

export type ToolbarFeatures = {
  dynamicTextSizing: boolean;
  imageResizing: boolean;
};

const enabledFeatureNames: { [P in keyof ToolbarFeatures]: string } = {
  dynamicTextSizing: 'dynamic text sizing',
  imageResizing: 'image resizing',
};

export interface State {
  reloadEditor: boolean;
  editorEnabled: boolean;
  imageUploadProvider: ProviderState;
  mentionProvider: ProviderState;
  mediaProvider: ProviderState;
  emojiProvider: ProviderState;
  taskDecisionProvider: ProviderState;
  contextIdentifierProvider: ProviderState;
  activityProvider: ProviderState;
  jsonDocument?: string;
  mediaMockEnabled: boolean;
  enabledFeatures: ToolbarFeatures;
}

export interface Props {
  imageUploadProvider?: ProviderState;
}

export type ProviderState = 'resolved' | 'pending' | 'rejected' | 'undefined';

export default class ToolsDrawer extends React.Component<Props & any, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      reloadEditor: false,
      editorEnabled: true,
      imageUploadProvider: props.imageUploadProvider || 'undefined',
      mentionProvider: 'resolved',
      mediaProvider: 'resolved',
      emojiProvider: 'resolved',
      taskDecisionProvider: 'resolved',
      contextIdentifierProvider: 'resolved',
      activityProvider: 'resolved',
      jsonDocument: '{}',
      mediaMockEnabled: false,
      enabledFeatures: {
        dynamicTextSizing: false,
        imageResizing: false,
      },
    };

    if (this.state.mediaMockEnabled) {
      mediaMock.enable();
    }
  }

  private switchProvider = (providerType: string, providerName: string) => {
    this.setState({ [providerType]: providerName } as any);
  };

  private reloadEditor = () => {
    this.setState({ reloadEditor: true }, () => {
      this.setState({ reloadEditor: false });
    });
  };

  private toggleDisabled = () =>
    this.setState((prevState) => ({ editorEnabled: !prevState.editorEnabled }));

  private toggleMediaMock = () => {
    // eslint-disable-next-line no-unused-expressions
    this.state.mediaMockEnabled ? mediaMock.disable() : mediaMock.enable();
    this.setState((prevState) => ({
      mediaMockEnabled: !prevState.mediaMockEnabled,
    }));
  };

  private onChange = (editorView: EditorView) => {
    this.setState({
      jsonDocument: JSON.stringify(toJSON(editorView.state.doc), null, 2),
    });
  };

  private toggleFeature = (name: keyof ToolbarFeatures) => {
    this.setState((prevState) => ({
      ...prevState,

      enabledFeatures: {
        ...prevState.enabledFeatures,
        [name]: !prevState.enabledFeatures[name],
      },
    }));
  };

  render() {
    const {
      mentionProvider,
      emojiProvider,
      taskDecisionProvider,
      contextIdentifierProvider,
      mediaProvider,
      activityProvider,
      imageUploadProvider,
      jsonDocument,
      reloadEditor,
      editorEnabled,
      mediaMockEnabled,
      enabledFeatures,
    } = this.state;
    return (
      <AnalyticsListener
        channel="atlaskit"
        onEvent={(e: any) => console.log(e)}
      >
        <AnalyticsListener channel="media" onEvent={(e: any) => console.log(e)}>
          <AnalyticsListener
            channel="fabric-elements"
            onEvent={(e: any) => console.log(e)}
          >
            <Content>
              <div style={{ padding: '5px 0' }}>
                ️️️⚠️ Atlassians, for Media integration to work in non-mocked
                state, make sure you're logged into{' '}
                <a href="https://id.stg.internal.atlassian.com" target="_blank">
                  staging Identity server.
                </a>
              </div>
              {reloadEditor
                ? ''
                : this.props.renderEditor({
                    disabled: !editorEnabled,
                    enabledFeatures,
                    imageUploadProvider:
                      providers.imageUploadProvider[imageUploadProvider],
                    mediaProvider: providers.mediaProvider[mediaProvider],
                    mentionProvider: providers.mentionProvider[mentionProvider],
                    emojiProvider: providers.emojiProvider[emojiProvider],
                    taskDecisionProvider:
                      providers.taskDecisionProvider[taskDecisionProvider],
                    contextIdentifierProvider:
                      providers.contextIdentifierProvider[
                        contextIdentifierProvider
                      ],
                    activityProvider:
                      providers.activityProvider[activityProvider],
                    onChange: this.onChange,
                  })}
              <div className="toolsDrawer">
                {(Object.keys(providers) as Array<keyof typeof providers>).map(
                  (providerKey) => (
                    <div key={providerKey}>
                      <ButtonGroup>
                        <label>{providerKey}: </label>
                        {Object.keys(providers[providerKey]).map(
                          (providerStateName) => (
                            <Button
                              key={`${providerKey}-${providerStateName}`}
                              onClick={this.switchProvider.bind(
                                this,
                                providerKey,
                                providerStateName,
                              )}
                              className={`${providerKey}-${providerStateName
                                .replace(/[()]/g, '')
                                .replace(/ /g, '-')}`}
                              appearance={
                                providerStateName === this.state[providerKey]
                                  ? 'primary'
                                  : 'default'
                              }
                              spacing="compact"
                            >
                              {providerStateName}
                            </Button>
                          ),
                        )}
                      </ButtonGroup>
                    </div>
                  ),
                )}
                <div>
                  <ButtonGroup>
                    <Button onClick={this.toggleDisabled} spacing="compact">
                      {this.state.editorEnabled
                        ? 'Disable editor'
                        : 'Enable editor'}
                    </Button>
                    <Button
                      onClick={this.reloadEditor}
                      spacing="compact"
                      className="reloadEditorButton"
                    >
                      Reload Editor
                    </Button>

                    {(Object.keys(enabledFeatureNames) as Array<
                      keyof typeof enabledFeatureNames
                    >).map((key) => (
                      <Button
                        key={key}
                        onClick={() => this.toggleFeature(key)}
                        spacing="compact"
                        className={`toggleFeature-${key} ${
                          this.state.enabledFeatures[key] ? 'disable' : 'enable'
                        }Feature-${key}`}
                      >
                        {this.state.enabledFeatures[key]
                          ? `Disable ${enabledFeatureNames[key]}`
                          : `Enable ${enabledFeatureNames[key]}`}
                      </Button>
                    ))}

                    <Tooltip content="Hot reload is not supported. Enable or disable before opening media-picker">
                      <Button
                        onClick={this.toggleMediaMock}
                        appearance={mediaMockEnabled ? 'primary' : 'default'}
                        spacing="compact"
                        className="mediaPickerMock"
                      >
                        {mediaMockEnabled ? 'Disable' : 'Enable'} Media-Picker
                        Mock
                      </Button>
                    </Tooltip>
                  </ButtonGroup>
                </div>
              </div>
              <div className="json-output">
                <legend>JSON output:</legend>
                <pre>{jsonDocument}</pre>
              </div>
            </Content>
          </AnalyticsListener>
        </AnalyticsListener>
      </AnalyticsListener>
    );
  }
}
