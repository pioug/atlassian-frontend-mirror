import type { EditorView } from '@atlaskit/editor-prosemirror/view';
import React from 'react';
import uuid from 'uuid';

import type { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { IntlErrorBoundary } from '@atlaskit/editor-common/ui';
import type { UserBrowserExtensionResults } from '@atlaskit/editor-common/utils';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
import type { CustomData } from '@atlaskit/ufo/types';
import type {
  ErrorEventAttributes,
  ErrorEventPayload,
} from '@atlaskit/editor-common/analytics';
import {
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  editorAnalyticsChannel,
} from '@atlaskit/editor-common/analytics';
import type { FeatureFlags } from '../types/feature-flags';
import { getDocStructure } from '../utils/document-logger';
import { WithEditorView } from './WithEditorView';
import { isOutdatedBrowser } from '@atlaskit/editor-common/utils';
import { logException } from '@atlaskit/editor-common/monitoring';

export type ErrorBoundaryProps = {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  editorView?: EditorView;
  rethrow?: boolean;
  children: React.ReactNode;
  featureFlags: FeatureFlags;
  errorTracking?: boolean;
};

export type ErrorBoundaryState = {
  error?: Error;
};

type AnalyticsErrorBoundaryErrorInfo = {
  componentStack: string;
};

type AnalyticsErrorBoundaryAttributes = {
  error: Error;
  info?: AnalyticsErrorBoundaryErrorInfo;
  [key: string]: any;
};

export class ErrorBoundaryWithEditorView extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  featureFlags: FeatureFlags;
  browserExtensions?: UserBrowserExtensionResults = undefined;
  experienceStore?: ExperienceStore;

  static defaultProps = {
    rethrow: true,
    errorTracking: true,
  };

  state = {
    error: undefined,
  };

  constructor(props: ErrorBoundaryProps) {
    super(props);

    this.featureFlags = props.featureFlags;

    if (props.editorView) {
      this.experienceStore = ExperienceStore.getInstance(props.editorView);
    }
  }

  private sendErrorData = async (
    analyticsErrorPayload: AnalyticsErrorBoundaryAttributes,
  ) => {
    const product = await this.getProductName();
    const { error, errorInfo, errorStack } = analyticsErrorPayload;
    const sharedId = uuid();
    const browserInfo = window?.navigator?.userAgent || 'unknown';

    const attributes: ErrorEventAttributes = {
      product,
      browserInfo,
      error: error.toString() as any as Error,
      errorInfo,
      errorId: sharedId,
      browserExtensions: this.browserExtensions,
      docStructure:
        this.featureFlags.errorBoundaryDocStructure && this.props.editorView
          ? getDocStructure(this.props.editorView.state.doc, { compact: true })
          : undefined,
      outdatedBrowser: isOutdatedBrowser(browserInfo),
    };

    this.fireAnalyticsEvent({
      action: ACTION.EDITOR_CRASHED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes,
    });
    this.fireAnalyticsEvent({
      action: ACTION.EDITOR_CRASHED_ADDITIONAL_INFORMATION,
      actionSubject: ACTION_SUBJECT.EDITOR,
      eventType: EVENT_TYPE.OPERATIONAL,
      attributes: {
        errorId: sharedId,
      },
      nonPrivacySafeAttributes: {
        errorStack,
      },
    });

    if (this.featureFlags.ufo && this.props.editorView) {
      this.experienceStore?.failAll({
        ...this.getExperienceMetadata(attributes),
        errorStack,
      });
    }

    logException(error, {
      location: 'editor-core/create-editor',
      product,
    });
  };

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

  private fireAnalyticsEvent = (event: ErrorEventPayload) => {
    this.props.createAnalyticsEvent?.(event).fire(editorAnalyticsChannel);
  };

  private getExperienceMetadata = (
    attributes: ErrorEventAttributes,
  ): CustomData => ({
    browserInfo: attributes.browserInfo,
    error: attributes.error.toString(),
    errorInfo: {
      componentStack: attributes.errorInfo.componentStack,
    },
    errorId: attributes.errorId,
    browserExtensions: attributes.browserExtensions?.toString(),
    docStructure: attributes.docStructure as string,
  });

  componentDidCatch(error: Error, errorInfo: AnalyticsErrorBoundaryErrorInfo) {
    if (this.props.errorTracking) {
      this.sendErrorData({
        error,
        errorInfo,
        errorStack: error.stack,
      });
    }

    // // Update state to allow a re-render to attempt graceful recovery (in the event that
    // // the error was caused by a race condition or is intermittent)
    this.setState({ error }, () => {
      if (this.props.rethrow) {
        // Now that a re-render has occured, we re-throw to allow product error boundaries
        // to catch and handle the error too.
        //
        // Note that when rethrowing inside a error boundary, the stack trace
        // from a higher error boundary's componentDidCatch.info param will reset
        // to this component, instead of the original component which threw it.
        throw error;
      }
    });
  }

  async componentDidMount() {
    this.browserExtensions = await sniffUserBrowserExtensions({
      extensions: ['grammarly'],
      async: true,
      asyncTimeoutMs: 20000,
    });
  }

  render() {
    return <IntlErrorBoundary>{this.props.children}</IntlErrorBoundary>;
  }
}

export default WithEditorView(ErrorBoundaryWithEditorView);
