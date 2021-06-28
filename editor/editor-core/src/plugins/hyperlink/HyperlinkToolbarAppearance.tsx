import React from 'react';
import { Component } from 'react';
import { LinkToolbarAppearance } from '../card/ui/LinkToolbarAppearance';
import {
  ProviderFactory,
  CardProvider,
} from '@atlaskit/editor-common/provider-factory';
import { InjectedIntl } from 'react-intl';
import { CardOptions } from '@atlaskit/editor-common';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { CardPlatform } from '@atlaskit/smart-card';

export interface HyperlinkToolbarAppearanceProps {
  intl: InjectedIntl;
  editorState: EditorState;
  providerFactory: ProviderFactory;
  url: string;
  editorView?: EditorView;
  platform?: CardPlatform;
  cardOptions?: CardOptions;
}

export interface HyperlinkToolbarAppearanceState {
  supportedUrlsMap: Map<string, boolean>;
}

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

    return new Promise<CardProvider>((resolve) => {
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
  componentWillReceiveProps(nextProps: HyperlinkToolbarAppearanceProps) {
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
        platform={platform}
      />
    );
  }
}
