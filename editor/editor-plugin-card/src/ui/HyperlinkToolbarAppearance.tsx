import React, { Component } from 'react';

import { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import { CardOptions } from '@atlaskit/editor-common/card';
import type { CardPluginActions } from '@atlaskit/editor-common/card';
import {
  CardProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import { EditorState } from '@atlaskit/editor-prosemirror/state';
import { EditorView } from '@atlaskit/editor-prosemirror/view';
import { CardPlatform } from '@atlaskit/smart-card';

import { LinkToolbarAppearance } from './LinkToolbarAppearance';

export interface HyperlinkToolbarAppearanceProps {
  intl: IntlShape;
  editorState: EditorState;
  providerFactory: ProviderFactory;
  url: string;
  editorView?: EditorView;
  platform?: CardPlatform;
  cardOptions?: CardOptions;
  editorAnalyticsApi: EditorAnalyticsAPI | undefined;
  cardActions: CardPluginActions | undefined;
}

export interface HyperlinkToolbarAppearanceState {
  supportedUrlsMap: Map<string, boolean>;
}

// eslint-disable-next-line @repo/internal/react/no-class-components
export class HyperlinkToolbarAppearance extends Component<
  HyperlinkToolbarAppearanceProps,
  HyperlinkToolbarAppearanceState
> {
  state: HyperlinkToolbarAppearanceState = {
    supportedUrlsMap: new Map(),
  };
  cardProvider?: CardProvider;

  private getProvider = async (): Promise<CardProvider> => {
    if (this.cardProvider) {
      return this.cardProvider;
    }

    return new Promise<CardProvider>(resolve => {
      const { providerFactory } = this.props;
      providerFactory.subscribe('cardProvider', async (_, cardProvider) => {
        if (!cardProvider) {
          return;
        }

        this.cardProvider = await cardProvider;
        resolve(this.cardProvider);
      });
    });
  };

  private resolveUrl = async (url: string) => {
    const { supportedUrlsMap } = this.state;
    if (supportedUrlsMap.has(url)) {
      return;
    }

    let isUrlSupported = false;
    try {
      const provider = await this.getProvider();
      isUrlSupported = await provider.findPattern(url);
    } catch (error) {
      isUrlSupported = false;
    }

    supportedUrlsMap.set(url, isUrlSupported);
    this.setState({ supportedUrlsMap });
  };

  componentDidMount = () => this.resolveUrl(this.props.url);

  // needed so we display the right state on the Toolbar while the same Toolbar
  // instance is visible and we click other link
  UNSAFE_componentWillReceiveProps(nextProps: HyperlinkToolbarAppearanceProps) {
    if (nextProps.url !== this.props.url) {
      this.resolveUrl(nextProps.url);
    }
  }

  render() {
    const {
      url,
      intl,
      editorView,
      editorState,
      cardOptions,
      platform,
      editorAnalyticsApi,
      cardActions,
    } = this.props;
    const { supportedUrlsMap } = this.state;

    if (!supportedUrlsMap.get(url)) {
      return null;
    }
    return (
      <LinkToolbarAppearance
        key="link-appearance"
        url={url}
        intl={intl}
        editorView={editorView}
        editorState={editorState}
        allowEmbeds={cardOptions?.allowEmbeds}
        allowBlockCards={cardOptions?.allowBlockCards}
        platform={platform}
        editorAnalyticsApi={editorAnalyticsApi}
        cardActions={cardActions}
      />
    );
  }
}
