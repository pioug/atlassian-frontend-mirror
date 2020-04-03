import React from 'react';
import { CardLinkView } from '@atlaskit/media-ui';

import { CardProps } from '../Card/types';
import { LazyCardWithUrlContent as CardWithUrlContentType } from './component';
import { fireSmartLinkEvent } from '../../utils/analytics';
import { AnalyticsHandler } from '../../utils/types';

export class CardWithURLRenderer extends React.PureComponent<CardProps> {
  static CardContent: typeof CardWithUrlContentType | null = null;

  static moduleImporter(target: CardWithURLRenderer) {
    import(
      /* webpackChunkName:"@atlaskit-internal-smartcard-urlcardcontent" */ './component'
    ).then(module => {
      CardWithURLRenderer.CardContent = module.LazyCardWithUrlContent;
      target.forceUpdate();
    });
  }

  componentDidMount() {
    if (CardWithURLRenderer.CardContent === null) {
      (this.props.importer || CardWithURLRenderer.moduleImporter)(this);
    }
  }

  render() {
    const {
      url,
      appearance,
      isSelected,
      onClick,
      createAnalyticsEvent,
      container,
      onResolve,
      testId,
    } = this.props;

    // Wrapper around analytics.
    const dispatchAnalytics: AnalyticsHandler = evt =>
      fireSmartLinkEvent(evt, createAnalyticsEvent);

    if (!url) {
      throw new Error('@atlaskit/smart-card: url property is missing.');
    }

    return CardWithURLRenderer.CardContent !== null ? (
      <CardWithURLRenderer.CardContent
        url={url}
        appearance={appearance}
        onClick={onClick}
        isSelected={isSelected}
        dispatchAnalytics={dispatchAnalytics}
        container={container}
        onResolve={onResolve}
        testId={testId}
      />
    ) : (
      <CardLinkView key={'chunk-placeholder'} link={url} />
    );
  }
}
