import React, { ErrorInfo } from 'react';
import uuid from 'uuid';

import { CardLinkView } from '@atlaskit/media-ui';

import { CardProps } from '../Card/types';
import { LazyCardWithUrlContent as CardWithUrlContentType } from './component-lazy';
import { uiRenderFailedEvent, fireSmartLinkEvent } from '../../utils/analytics';
import { AnalyticsPayload } from '../../utils/types';
import { clearMarks, clearMeasures } from '../../utils/performance';

export class CardWithURLRenderer extends React.PureComponent<
  CardProps,
  { id: string }
> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      id: uuid(),
    };
  }

  static CardContent: typeof CardWithUrlContentType | null = null;

  static moduleImporter(target: CardWithURLRenderer) {
    import(
      /* webpackChunkName: "@atlaskit-internal_smartcard-urlcardcontent" */ './component-lazy/index'
    ).then((module) => {
      CardWithURLRenderer.CardContent = module.LazyCardWithUrlContent;
      target.forceUpdate();
    });
  }

  componentDidMount() {
    if (CardWithURLRenderer.CardContent === null) {
      (this.props.importer || CardWithURLRenderer.moduleImporter)(this);
    }
  }

  componentWillUnmount() {
    const id = this.state.id!;
    clearMarks(id);
    clearMeasures(id);
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const { appearance } = this.props;
    // NB: APIErrors are thrown in response to Object Resolver Service.
    // In these cases, control is handed back to the Editor. We do not
    // fire an event for these, as they do not cover failed UI render events.
    if (error.name === 'APIError') {
      throw error;
    }
    // NB: the rest of the errors caught here are unexpected, and correlate
    // to the reliability of the smart-card front-end components. We instrument
    // these in order to measure our front-end reliability.
    else {
      this.dispatchAnalytics(uiRenderFailedEvent(appearance, error, errorInfo));
    }
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
      isFrameVisible,
      onClick,
      container,
      onResolve,
      testId,
      showActions,
      inheritDimensions,
      platform,
      embedIframeRef,
      inlinePreloaderStyle,
    } = this.props;

    if (!url) {
      throw new Error('@atlaskit/smart-card: url property is missing.');
    }

    return CardWithURLRenderer.CardContent !== null ? (
      <CardWithURLRenderer.CardContent
        id={this.state.id}
        url={url}
        appearance={appearance}
        onClick={onClick}
        isSelected={isSelected}
        isFrameVisible={isFrameVisible}
        dispatchAnalytics={this.dispatchAnalytics}
        container={container}
        onResolve={onResolve}
        testId={testId}
        showActions={showActions}
        inheritDimensions={inheritDimensions}
        platform={platform}
        embedIframeRef={embedIframeRef}
        inlinePreloaderStyle={inlinePreloaderStyle}
      />
    ) : (
      <CardLinkView key={'chunk-placeholder'} link={url} />
    );
  }
}
