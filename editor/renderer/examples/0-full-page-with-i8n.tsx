import React from 'react';
import RendererDemo from './helper/RendererDemo';
import { IntlProvider } from 'react-intl';

export type Props = {};
export type State = { locale: string; messages: { [key: string]: string } };

export default class Example extends React.Component<Props, State> {
  state: State = {
    locale: 'en',
    messages: {},
  };

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
        />
      </IntlProvider>
    );
  }
}
