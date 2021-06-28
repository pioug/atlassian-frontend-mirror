import React from 'react';
import { InjectedIntlProps, injectIntl } from 'react-intl';
import SectionMessage from '@atlaskit/section-message';
import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { FieldDefinition } from '@atlaskit/editor-common/extensions';
import {
  withAnalyticsContext,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  AnalyticsEventPayload,
} from '../../plugins/analytics';
import { editorAnalyticsChannel } from '../../plugins/analytics/consts';
import { messages } from './messages';

interface ErrorInfo {
  componentStack: string;
}
type AnalyticsErrorBoundaryAttributes = {
  error: string;
  errorInfo?: ErrorInfo;
  errorStack?: string;
};

interface Props {
  fields: FieldDefinition[];
  extensionKey: string;
  contextIdentifierProvider?: ContextIdentifierProvider;
  children: React.ReactNode;
}
interface State {
  error?: Error;
}
class FormErrorBoundaryInner extends React.Component<
  Props & WithAnalyticsEventsProps & InjectedIntlProps,
  State
> {
  state: State = { error: undefined };

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error }, () => {
      // Log the error
      this.fireAnalytics({
        error: error.toString(),
        errorInfo,
        errorStack: error.stack,
      });
    });
  }

  private getProductName = async () => {
    const { contextIdentifierProvider } = this.props;

    if (contextIdentifierProvider) {
      const context = await contextIdentifierProvider;
      if (context.product) {
        return context.product;
      }
    }
    return 'atlaskit';
  };

  fireAnalytics = (analyticsErrorPayload: AnalyticsErrorBoundaryAttributes) => {
    const { createAnalyticsEvent, extensionKey, fields } = this.props;

    this.getProductName()
      .then((product) => {
        if (!createAnalyticsEvent) {
          // eslint-disable-next-line no-console
          console.error(
            'ConfigPanel FormErrorBoundary: Missing `createAnalyticsEvent`',
            {
              channel: editorAnalyticsChannel,
              product,
              error: analyticsErrorPayload,
            },
          );
          return;
        }

        const { error, errorInfo, errorStack } = analyticsErrorPayload;
        const payload: AnalyticsEventPayload = {
          action: ACTION.ERRORED,
          actionSubject: ACTION_SUBJECT.CONFIG_PANEL,
          eventType: EVENT_TYPE.UI,
          attributes: {
            product,
            browserInfo: window?.navigator?.userAgent || 'unknown',
            extensionKey,
            fields: JSON.stringify(fields),
            error,
            errorInfo,
            errorStack,
          },
        };

        createAnalyticsEvent(payload).fire(editorAnalyticsChannel);
      })
      .catch((e) => {
        // eslint-disable-next-line no-console
        console.error(
          'Failed to resolve product name from contextIdentifierProvider.',
          e,
        );
      });
  };

  render() {
    const { intl } = this.props;
    const { error } = this.state;

    if (!error) {
      return this.props.children;
    }

    return (
      <SectionMessage
        title={intl.formatMessage(messages.errorBoundaryTitle)}
        appearance="error"
      >
        <p>
          <i>{error.message}</i>
        </p>

        <p>{intl.formatMessage(messages.errorBoundaryNote)}</p>
      </SectionMessage>
    );
  }
}

export const FormErrorBoundaryImpl = injectIntl(FormErrorBoundaryInner);

export const FormErrorBoundary = withAnalyticsContext()(
  withAnalyticsEvents()(FormErrorBoundaryImpl),
);
FormErrorBoundary.displayName = 'FormErrorBoundary';
