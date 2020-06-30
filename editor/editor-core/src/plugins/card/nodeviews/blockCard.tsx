import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Card as SmartCard } from '@atlaskit/smart-card';
import { UnsupportedBlock } from '@atlaskit/editor-common';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';

import { SmartCardProps, Card, CardDerivedProps } from './genericCard';
import { ReactNodeView, getPosHandler } from '../../../nodeviews/';
import { registerCard } from '../pm-plugins/actions';
import { findOverflowScrollParent } from '@atlaskit/editor-common';

export interface Props {
  children?: React.ReactNode;
  node: PMNode;
  view: EditorView;
  getPos: getPosHandler;
}
export class BlockCardComponent extends React.PureComponent<SmartCardProps> {
  private scrollContainer?: HTMLElement;
  onClick = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

  UNSAFE_componentWillMount() {
    const { view } = this.props;
    const scrollContainer = findOverflowScrollParent(view.dom as HTMLElement);
    this.scrollContainer = scrollContainer || undefined;
  }

  onResolve = (data: { url?: string; title?: string }) => {
    const { getPos, view } = this.props;
    if (!getPos || typeof getPos === 'boolean') {
      return;
    }

    const { title, url } = data;

    // don't dispatch immediately since we might be in the middle of
    // rendering a nodeview
    rafSchedule(() =>
      view.dispatch(
        registerCard({
          title,
          url,
          pos: getPos(),
        })(view.state.tr),
      ),
    )();
  };

  render() {
    const { node, cardContext, platform } = this.props;
    const { url, data } = node.attrs;

    // render an empty span afterwards to get around Webkit bug
    // that puts caret in next editable text element
    const cardInner = (
      <>
        <SmartCard
          key={url}
          url={url}
          data={data}
          container={this.scrollContainer}
          appearance="block"
          onClick={this.onClick}
          onResolve={this.onResolve}
          showActions={platform === 'web'}
          platform={platform}
        />
        <span contentEditable={true} />
      </>
    );

    return (
      <div>
        {cardContext ? (
          <cardContext.Provider value={cardContext.value}>
            {cardInner}
          </cardContext.Provider>
        ) : (
          cardInner
        )}
      </div>
    );
  }
}

const WrappedBlockCard = Card(BlockCardComponent, UnsupportedBlock);

export class BlockCard extends ReactNodeView<CardDerivedProps> {
  render() {
    return (
      <WrappedBlockCard
        node={this.node}
        view={this.view}
        getPos={this.getPos}
        platform={this.reactComponentProps.platform}
      />
    );
  }
}
