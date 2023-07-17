import React from 'react';

import PropTypes from 'prop-types';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { AnalyticsContext } from '@atlaskit/analytics-next';
import type { DispatchAnalyticsEvent } from '@atlaskit/editor-common/analytics';
import type { EventDispatcher } from '@atlaskit/editor-common/event-dispatcher';
import { ProviderFactory } from '@atlaskit/editor-common/provider-factory';
import {
  getPosHandler,
  ReactComponentProps,
} from '@atlaskit/editor-common/react-node-view';
import { ExtractInjectionAPI } from '@atlaskit/editor-common/types';
import { getAnalyticsEditorAppearance } from '@atlaskit/editor-common/utils';
import { SmartCardContext } from '@atlaskit/link-provider';
import { APIError, CardPlatform } from '@atlaskit/smart-card';

import type { cardPlugin } from '../index';
import { changeSelectedCardToLinkFallback } from '../pm-plugins/doc';
import { getPluginState } from '../pm-plugins/util/state';
import { titleUrlPairFromNode } from '../utils';

export type EditorContext<T> = React.Context<T> & { value: T };

export interface CardNodeViewProps extends ReactComponentProps {
  providerFactory?: ProviderFactory;
  platform?: CardPlatform;
  eventDispatcher?: EventDispatcher;
}

export interface CardProps extends CardNodeViewProps {
  children?: React.ReactNode;
  node: PMNode;
  view: EditorView;
  getPos: getPosHandler;
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent;
  isMobile?: boolean;
  eventDispatcher?: EventDispatcher;
  allowResizing?: boolean;
  fullWidthMode?: boolean;
  useAlternativePreloader?: boolean;
  showServerActions?: boolean;
  pluginInjectionApi?: ExtractInjectionAPI<typeof cardPlugin>;
}

export interface SmartCardProps extends CardProps {
  cardContext?: EditorContext<typeof SmartCardContext>;
}

export function Card(
  SmartCardComponent: React.ComponentType<SmartCardProps>,
  UnsupportedComponent: React.ComponentType,
): React.ComponentType<CardProps> {
  return class extends React.Component<CardProps> {
    static contextTypes = {
      contextAdapter: PropTypes.object,
    };

    state = {
      isError: false,
    };

    render() {
      const { url } = titleUrlPairFromNode(this.props.node);
      if (url && !isSafeUrl(url)) {
        return <UnsupportedComponent />;
      }

      if (this.state.isError) {
        if (url) {
          return (
            <a
              href={url}
              onClick={e => {
                e.preventDefault();
              }}
            >
              {url}
            </a>
          );
        } else {
          return <UnsupportedComponent />;
        }
      }

      const cardContext = this.context.contextAdapter
        ? this.context.contextAdapter.card
        : undefined;
      const editorAppearance = getPluginState(
        this.props.view.state,
      )?.editorAppearance;
      const analyticsEditorAppearance =
        getAnalyticsEditorAppearance(editorAppearance);

      return (
        <AnalyticsContext
          data={{
            attributes: { location: analyticsEditorAppearance },
            // Below is added for the future implementation of Linking Platform namespaced analytics context
            location: analyticsEditorAppearance,
          }}
        >
          <SmartCardComponent
            key={url}
            cardContext={cardContext}
            {...this.props}
          />
        </AnalyticsContext>
      );
    }

    componentDidCatch(error: Error | APIError) {
      const maybeAPIError = error as APIError;
      // NB: errors received in this component are propagated by the `@atlaskit/smart-card` component.
      // Depending on the kind of error, the expectation for this component is to either:
      // (1) Render a blue link whilst retaining `inlineCard` in the ADF (non-fatal errs);
      // (2) Render a blue link whilst downgrading to `link` in the ADF (fatal errs).

      if (maybeAPIError.kind && maybeAPIError.kind === 'fatal') {
        this.setState({ isError: true });
        const { view, node, getPos, pluginInjectionApi } = this.props;
        const { url } = titleUrlPairFromNode(node);
        if (!getPos || typeof getPos === 'boolean') {
          return;
        }
        changeSelectedCardToLinkFallback(
          undefined,
          url,
          true,
          node,
          getPos(),
          pluginInjectionApi?.dependencies.analytics?.actions,
        )(view.state, view.dispatch);
        return null;
      } else {
        // Otherwise, render a blue link as fallback (above in render()).
        this.setState({ isError: true });
      }
    }
  };
}
