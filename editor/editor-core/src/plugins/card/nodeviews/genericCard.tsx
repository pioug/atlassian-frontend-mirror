import React from 'react';
import PropTypes from 'prop-types';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { Context as SmartCardContext, APIError } from '@atlaskit/smart-card';

import { getPosHandler } from '../../../nodeviews';
import { titleUrlPairFromNode } from '../utils';

type EditorContext<T> = React.Context<T> & { value: T };

export interface CardProps {
  children?: React.ReactNode;
  node: PMNode;
  selected: boolean;
  view: EditorView;
  getPos: getPosHandler;
  isMobile?: boolean;
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

      return <SmartCardComponent cardContext={cardContext} {...this.props} />;
    }

    componentDidCatch(error: Error | APIError) {
      const maybeAPIError = error as APIError;
      // NB: errors received in this component are propagated by the `@atlaskit/smart-card` component.
      // Depending on the kind of error, the expectation for this component is to either:
      // (1) Render a blue link whilst retaining `inlineCard` in the ADF (non-fatal errs);
      // (2) Render a blue link whilst downgrading to `link` in the ADF (fatal errs).
      if (maybeAPIError.kind && maybeAPIError.kind === 'fatal') {
        // TODO: EDM-340, add proper editor integration here.
        this.setState({ isError: true });
      } else {
        // Otherwise, render a blue link as fallback (above in render()).
        this.setState({ isError: true });
      }
    }
  };
}
