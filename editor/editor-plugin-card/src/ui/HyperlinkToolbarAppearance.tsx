import React, { Component } from 'react';

import type { IntlShape } from 'react-intl-next';

import type { EditorAnalyticsAPI } from '@atlaskit/editor-common/analytics';
import type {
  CardOptions,
  CardPluginActions,
} from '@atlaskit/editor-common/card';
import type {
  CardProvider,
  ProviderFactory,
} from '@atlaskit/editor-common/provider-factory';
import type { EditorState } from '@atlaskit/editor-prosemirror/state';
import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import { getBooleanFF } from '@atlaskit/platform-feature-flags';
import { Flex } from '@atlaskit/primitives';
import type { CardPlatform } from '@atlaskit/smart-card';

import { DatasourceAppearanceButton } from './DatasourceAppearanceButton';
import { EditDatasourceButton } from './EditDatasourceButton';
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

    const newMap = new Map(supportedUrlsMap);
    newMap.set(url, isUrlSupported);
    this.setState({ supportedUrlsMap: newMap });
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
      <Flex>
        <EditDatasourceButton
          url={url}
          intl={intl}
          editorState={editorState}
          editorView={editorView}
          editorAnalyticsApi={editorAnalyticsApi}
        />
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
        {getBooleanFF(
          'platform.linking-platform.enable-datasource-appearance-toolbar',
        ) && (
          <DatasourceAppearanceButton
            intl={intl}
            url={url}
            editorState={editorState}
            editorView={editorView}
            editorAnalyticsApi={editorAnalyticsApi}
          />
        )}
      </Flex>
    );
  }
}
