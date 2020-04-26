/* eslint-disable no-console */
import React from 'react';
import {
  profilecard as profilecardUtils,
  emoji,
  taskDecision,
} from '@atlaskit/util-data-test';
import { CardEvent } from '@atlaskit/media-card';
import { defaultSchema } from '@atlaskit/adf-schema';
import {
  CardSurroundings,
  ProviderFactory,
  ExtensionHandlers,
  EventHandlers,
} from '@atlaskit/editor-common';
import { IframeWidthObserverFallbackWrapper } from '@atlaskit/width-detector';
import Button from '@atlaskit/button';
import {
  storyMediaProviderFactory,
  storyContextIdentifierProviderFactory,
} from '@atlaskit/editor-test-helpers';
import * as Clock from 'react-live-clock';

import { document as storyDataDocument } from './story-data';
import {
  default as Renderer,
  Props as RendererProps,
} from '../../src/ui/Renderer';

import { ProfileClient, modifyResponse } from '@atlaskit/profilecard';

import { renderDocument, TextSerializer } from '../../src';

import Sidebar, { getDefaultShowSidebarState } from './NavigationNext';
import { RendererAppearance } from '../../src/ui/Renderer/types';
import { MentionProvider } from '@atlaskit/mention/types';
import { Schema } from 'prosemirror-model';

const { getMockProfileClient: getMockProfileClientUtil } = profilecardUtils;
const MockProfileClient = getMockProfileClientUtil(
  ProfileClient,
  modifyResponse,
);

const mentionProvider = Promise.resolve({
  shouldHighlightMention(mention: { id: string }) {
    return mention.id === 'ABCDE-ABCDE-ABCDE-ABCDE';
  },
} as MentionProvider);

const mediaProvider = storyMediaProviderFactory();

const emojiProvider = emoji.storyData.getEmojiResource();

const profilecardProvider = Promise.resolve({
  cloudId: 'DUMMY-CLOUDID',
  resourceClient: new MockProfileClient({
    cacheSize: 10,
    cacheMaxAge: 5000,
  }),
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

const taskDecisionProvider = Promise.resolve(
  taskDecision.getMockTaskDecisionResource(),
);

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
  'com.atlassian.fabric': ext => {
    const { extensionKey } = ext;

    switch (extensionKey) {
      case 'clock':
        return (
          <Clock format={'HH:mm:ss'} ticking={true} timezone={'US/Pacific'} />
        );
      case 'mention':
        return [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text:
                  'Hi, my name is... My name is... My name is... My name is ',
              },
              {
                type: 'mention',
                attrs: {
                  id: '1',
                  text: '@Oscar Wallhult',
                },
              },
            ],
          },
        ];
      case 'inline':
        return [
          {
            type: 'text',
            text: 'Hi, my name is... My name is... My name is... My name is ',
          },
          {
            type: 'mention',
            attrs: {
              id: '1',
              text: '@Oscar Wallhult',
            },
          },
        ];
      default:
        return null;
    }
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
      result: CardEvent,
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

export interface DemoRendererProps {
  withPortal?: boolean;
  withProviders?: boolean;
  withExtension?: boolean;
  serializer: 'react' | 'text' | 'email';
  document?: object;
  showHowManyCopies?: boolean;
  appearance?: RendererAppearance;
  maxHeight?: number;
  fadeOutHeight?: number;
  truncationEnabled?: boolean;
  allowDynamicTextSizing?: boolean;
  allowHeadingAnchorLinks?: boolean;
  allowColumnSorting?: boolean;
  copies?: number;
  schema?: Schema;
}

export interface DemoRendererState {
  input: string;
  portal?: HTMLElement;
  truncated: boolean;
  showSidebar: boolean;
  shouldUseEventHandlers: boolean;
  copies?: number;
}

export default class RendererDemo extends React.Component<
  DemoRendererProps,
  DemoRendererState
> {
  textSerializer = new TextSerializer(
    this.props.schema ? this.props.schema : defaultSchema,
  );
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
    };
  }

  private handlePortalRef = (portal: HTMLElement | null) => {
    this.setState({ portal: portal || undefined });
  };

  render() {
    return (
      <Sidebar showSidebar={this.state.showSidebar}>
        {(additionalRendererProps: object) => (
          <div ref="root" style={{ position: 'relative', padding: 20 }}>
            <fieldset style={{ marginBottom: 20 }}>
              <legend>Input</legend>
              <textarea
                id="renderer-value-input"
                style={{
                  boxSizing: 'border-box',
                  border: '1px solid lightgray',
                  fontFamily: 'monospace',
                  fontSize: 16,
                  padding: 10,
                  width: '100%',
                  height: 320,
                }}
                ref={ref => {
                  this.inputBox = ref;
                }}
                onChange={this.onDocumentChange}
                value={this.state.input}
              />
              <button onClick={this.toggleSidebar}>Toggle Sidebar</button>
              <button onClick={this.toggleEventHandlers}>
                Toggle Event handlers
              </button>
              {this.props.showHowManyCopies && (
                <input
                  type="number"
                  ref={ref => {
                    this.inputCopies = ref;
                  }}
                  onChange={this.onCopiesChange}
                  value={this.state.copies}
                />
              )}
            </fieldset>
            <IframeWidthObserverFallbackWrapper>
              {this.renderRenderer(additionalRendererProps)}
            </IframeWidthObserverFallbackWrapper>
            {this.renderText()}
          </div>
        )}
      </Sidebar>
    );
  }

  private toggleTruncated = () => {
    this.setState(prevState => ({
      truncated: !prevState.truncated,
    }));
  };

  private renderRenderer(additionalRendererProps: any) {
    const { shouldUseEventHandlers, copies } = this.state;
    if (this.props.serializer !== 'react') {
      return null;
    }

    try {
      let props: RendererProps = {
        document: JSON.parse(this.state.input),
        schema: this.props.schema ? this.props.schema : defaultSchema,
      };

      if (this.props.withProviders) {
        props.eventHandlers = shouldUseEventHandlers
          ? eventHandlers
          : undefined;
        props.dataProviders = providerFactory;
      }

      if (this.props.allowHeadingAnchorLinks) {
        props.allowHeadingAnchorLinks = true;
      }

      if (this.props.withExtension) {
        props.extensionHandlers = extensionHandlers;
      }

      if (this.props.withPortal) {
        props.portal = this.state.portal;
      }

      props.maxHeight = this.props.maxHeight;
      props.fadeOutHeight = this.props.fadeOutHeight;
      props.truncated = this.props.truncationEnabled && this.state.truncated;
      props.allowDynamicTextSizing = this.props.allowDynamicTextSizing;
      props.allowColumnSorting = this.props.allowColumnSorting;

      if (additionalRendererProps) {
        props = {
          ...props,
          ...additionalRendererProps,
        };
      }

      props.appearance = this.props.appearance;

      const expandButton = (
        <div>
          <Button
            appearance={'link'}
            spacing={'none'}
            onClick={this.toggleTruncated}
          >
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
          <div style={{ color: '#ccc', marginBottom: '8px' }}>
            &lt;Renderer&gt;
          </div>
          <div id="RendererOutput">
            {Array.from({ length: copies || 1 }).map((_, index) => (
              <Renderer key={index} {...props} />
            ))}
          </div>
          {this.props.truncationEnabled ? expandButton : null}
          <div style={{ color: '#ccc', marginTop: '8px' }}>
            &lt;/Renderer&gt;
          </div>
          <div ref={this.handlePortalRef} />
        </div>
      );
    } catch (ex) {
      return <pre>Invalid document: {ex.stack}</pre>;
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
    this.setState(prevState => ({ showSidebar: !prevState.showSidebar }));
  };

  private toggleEventHandlers = () => {
    this.setState(prevState => ({
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
}
