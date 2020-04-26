import React, { ErrorInfo } from 'react';
import { CardLinkView } from '@atlaskit/media-ui';

import { CardProps } from '../Card/types';
import { LazyCardWithUrlContent as CardWithUrlContentType } from './component';
import { fireSmartLinkEvent, uiRenderFailedEvent } from '../../utils/analytics';
import { AnalyticsPayload } from '../../utils/types';

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

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { appearance } = this.props;
    this.dispatchAnalytics(uiRenderFailedEvent(appearance, error, errorInfo));
  }

  // Wrapper around analytics.
  dispatchAnalytics = (analyticsPayload: AnalyticsPayload) => {
    const { appearance, createAnalyticsEvent } = this.props;
    if (analyticsPayload && analyticsPayload.attributes) {
      // Update if we haven't already set the display - possible
      // in the case of `preview` which is rendered differently.
      if (!analyticsPayload.attributes.display) {
        analyticsPayload.attributes.display = appearance;
      }
    }
    fireSmartLinkEvent(analyticsPayload, createAnalyticsEvent);
  };

  render() {
    const {
      url,
      appearance,
      isSelected,
      onClick,
      container,
      onResolve,
      testId,
      showActions,
    } = this.props;

    if (!url) {
      throw new Error('@atlaskit/smart-card: url property is missing.');
    }

    return CardWithURLRenderer.CardContent !== null ? (
      <CardWithURLRenderer.CardContent
        url={url}
        appearance={appearance}
        onClick={onClick}
        isSelected={isSelected}
        dispatchAnalytics={this.dispatchAnalytics}
        container={container}
        onResolve={onResolve}
        testId={testId}
        showActions={showActions}
      />
    ) : (
      <CardLinkView key={'chunk-placeholder'} link={url} />
    );
  }
}
