import memoizeOne from 'memoize-one';
import { EditorView } from 'prosemirror-view';
import React from 'react';
import uuid from 'uuid';

import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import type { ContextIdentifierProvider } from '@atlaskit/editor-common/provider-factory';
import { ExperienceStore } from '@atlaskit/editor-common/ufo';
import { IntlErrorBoundary } from '@atlaskit/editor-common/ui';
import type { UserBrowserExtensionResults } from '@atlaskit/editor-common/utils';
import { sniffUserBrowserExtensions } from '@atlaskit/editor-common/utils';
import type { CustomData } from '@atlaskit/ufo/types';
import {
  ACTION,
  ACTION_SUBJECT,
  ErrorEventAttributes,
  ErrorEventPayload,
  EVENT_TYPE,
} from '../plugins/analytics';
import { editorAnalyticsChannel } from '../plugins/analytics/consts';
import { getFeatureFlags } from '../plugins/feature-flags-context';
import { FeatureFlags } from '../types/feature-flags';
import { getDocStructure } from '../utils/document-logger';
import { WithEditorView } from './WithEditorView';
import { isOutdatedBrowser } from '@atlaskit/editor-common/utils';

export type ErrorBoundaryProps = {
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
  editorView?: EditorView;
  rethrow?: boolean;
  children: React.ReactNode;
};

export type ErrorBoundaryState = {
  error?: Error;
};

type AnalyticsErrorBoundaryErrorInfo = {
  componentStack: string;
};

type AnalyticsErrorBoundaryAttributes = {
  error: string;
  info?: AnalyticsErrorBoundaryErrorInfo;
  [key: string]: any;
};

export class ErrorBoundaryWithEditorView extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  browserExtensions?: UserBrowserExtensionResults = undefined;
  experienceStore?: ExperienceStore;

  static defaultProps = {
    rethrow: true,
  };

  state = {
    error: undefined,
  };

  // Memoizing this as react alternative suggestion of https://reactjs.org/docs/react-component.html#unsafe_componentwillreceiveprops
  private getFeatureFlags = memoizeOne(
    (editorView: EditorView | undefined): FeatureFlags => {
      if (!editorView) {
        return {};
      }
      return getFeatureFlags(editorView.state);
    },
  );

  get featureFlags() {
    return this.getFeatureFlags(this.props.editorView);
  }

  constructor(props: ErrorBoundaryProps) {
    super(props);

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
      error: (error as any) as Error,
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
        errorStack,
        errorId: sharedId,
      },
    });

    if (this.featureFlags.ufo && this.props.editorView) {
      this.experienceStore?.failAll({
        ...this.getExperienceMetadata(attributes),
        errorStack,
      });
    }
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
    this.sendErrorData({
      error: error.toString(),
      errorInfo,
      errorStack: error.stack,
    });

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
