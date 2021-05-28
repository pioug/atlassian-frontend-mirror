import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { IntlProvider } from 'react-intl';
import { MediaOptions } from '@atlaskit/editor-core';
import { getSchemaBasedOnStage } from '@atlaskit/adf-schema';
import adf from './helper/media-without-caption.adf.json';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };

export default class Example extends React.Component<Props, State> {
  state: State = {
    locale: 'en',
    messages: {},
  };
  mediaOptions: MediaOptions = { featureFlags: { captions: false } };

  render() {
    const { locale, messages } = this.state;
    return (
      <IntlProvider locale={locale} messages={messages}>
        <RendererDemo
          appearance="full-page"
          serializer="react"
          allowHeadingAnchorLinks
          allowColumnSorting={true}
          useSpecBasedValidator={true}
          adfStage={'stage0'}
          schema={getSchemaBasedOnStage('stage0')}
          mediaOptions={this.mediaOptions}
          document={adf}
        />
      </IntlProvider>
    );
  }
}
