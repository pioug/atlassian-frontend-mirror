import React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { Card as SmartCard } from '@atlaskit/smart-card';
import PropTypes from 'prop-types';
import { EditorView } from 'prosemirror-view';
import rafSchedule from 'raf-schd';

import { SmartCardProps, Card } from './genericCard';
import { SelectionBasedNodeView, getPosHandler } from '../../../nodeviews/';
import { registerCard } from '../pm-plugins/actions';
import { UnsupportedBlock } from '@atlaskit/editor-common';

export interface Props {
  children?: React.ReactNode;
  node: PMNode;
  view: EditorView;
  selected?: boolean;
  getPos: getPosHandler;
}
export class EmbedCardComponent extends React.PureComponent<SmartCardProps> {
  onClick = () => {};

  static contextTypes = {
    contextAdapter: PropTypes.object,
  };

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
    );
  };

  render() {
    const { node, selected, cardContext, isMobile } = this.props;
    const { url } = node.attrs;
    // render an empty span afterwards to get around Webkit bug
    // that puts caret in next editable text element
    const cardInner = (
      <>
        <SmartCard
          url={url}
          appearance="embed"
          isSelected={selected}
          onClick={this.onClick}
          onResolve={this.onResolve}
          showActions={!isMobile}
          isFrameVisible
        />
      </>
    );

    return (
      <>
        {cardContext ? (
          <cardContext.Provider value={cardContext.value}>
            {cardInner}
          </cardContext.Provider>
        ) : (
          cardInner
        )}
      </>
    );
  }
}

const WrappedBlockCard = Card(EmbedCardComponent, UnsupportedBlock);

export class EmbedCard extends SelectionBasedNodeView {
  render() {
    return (
      <WrappedBlockCard
        node={this.node}
        selected={this.insideSelection()}
        view={this.view}
        getPos={this.getPos}
        isMobile={!!this.reactComponentProps.isMobile}
      />
    );
  }
}
