import React from 'react';
import PropTypes from 'prop-types';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView } from 'prosemirror-view';
import { Context as SmartCardContext } from '@atlaskit/smart-card';

import { isSafeUrl } from '@atlaskit/adf-schema';
import { getPosHandler } from '../../../nodeviews';
import { titleUrlPairFromNode } from '../utils';

type EditorContext<T> = React.Context<T> & { value: T };

export interface CardProps {
  children?: React.ReactNode;
  node: PMNode;
  selected: boolean;
  view: EditorView;
  getPos: getPosHandler;
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

    componentDidCatch(_error: Error) {
      this.setState({ isError: true });
    }
  };
}
